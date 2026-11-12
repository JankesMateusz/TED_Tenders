import { useCallback, useEffect, useRef, useState } from "react";
import { TenderSource } from "../types/TenderSource";
import { fetchRefreshLog, subscribeToLastRefresh } from "../utils/tendersApi";
import { daysToRefresh } from "../utils/refreshPlan";
import { REFRESH_IN_PROGRESS_CODE, refreshDayWithRetry } from "../utils/refreshWithRetry";

const REFRESH_ERROR_MESSAGES: Record<string, string> = {
    "functions/unavailable": "Nie udało się pobrać nowych przetargów ze źródeł. Spróbuj ponownie za chwilę.",
    "functions/permission-denied": "Brak uprawnień do odświeżania przetargów.",
    "functions/unauthenticated": "Sesja wygasła. Zaloguj się ponownie."
};
const IN_PROGRESS_MESSAGE = "Inne odświeżanie nadal trwa. Spróbuj ponownie za chwilę.";
const PARTIAL_FAILURE_MESSAGE = "Nie wszystkie źródła odpowiedziały. Spróbuj odświeżyć ponownie za chwilę.";
const GENERIC_REFRESH_ERROR = "Nie udało się odświeżyć przetargów.";

/**
 * Prosi serwer o pobranie nowych przetargów dla wybranego zakresu dni (dla pojedynczego dnia tego dnia, dla
 * zakresu po kolei wszystkich dni, których jeszcze nie pobrano) i odświeża się przy wejściu oraz po zmianie dnia.
 * Wyniki pojawiają się na liście przez nasłuch bazy. Zwraca też czas ostatniego udanego odświeżenia przez kogokolwiek.
 */
export const useTendersRefresh = (
    startDay: string | null,
    endDay: string | null,
    useDateRange: boolean,
    todayDay: string
) => {
    // True, gdy serwer pobiera nowe przetargi ze źródeł (lista pokazuje w tym czasie to, co już jest w bazie)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);
    // Postęp odświeżania wielu dni (tryb zakresu); null, gdy odświeżany jest jeden dzień lub nic
    const [refreshProgress, setRefreshProgress] = useState<{ done: number; total: number } | null>(null);
    const refreshRunId = useRef(0);
    // Czas ostatniego udanego odświeżenia przez kogokolwiek; null, gdy nieznany
    const [lastRefreshAt, setLastRefreshAt] = useState<Date | null>(null);

    useEffect(
        () =>
            subscribeToLastRefresh(setLastRefreshAt, (error) =>
                console.error("Błąd wczytywania czasu ostatniego odświeżenia:", error)
            ),
        []
    );

    // `includeBaza`: tylko na ręczną prośbę; Baza Konkurencyjności nie ma oficjalnego API, więc nie odpytujemy jej
    // przy każdym wejściu do aplikacji (poza tym pobiera ją zadanie raz dziennie).
    const refresh = useCallback(async (includeBaza: boolean = false) => {
        if (!startDay || !endDay) return;

        // Nowe wywołanie (np. zmiana dnia) przerywa poprzednie po zakończeniu bieżącego dnia
        const runId = ++refreshRunId.current;
        const isCurrentRun = () => runId === refreshRunId.current;

        setIsRefreshing(true);
        setRefreshError(null);
        setRefreshProgress(null);
        try {
            // Pojedynczy dzień odświeżamy zawsze; zakres tylko w brakujących dniach
            const log = useDateRange ? await fetchRefreshLog(startDay, endDay) : {};
            const days = daysToRefresh(startDay, endDay, log, todayDay);

            let hadPartialFailure = false;
            for (let index = 0; index < days.length; index++) {
                if (!isCurrentRun()) return;
                setRefreshProgress({ done: index, total: days.length });
                // Baza szuka ogłoszeń z kilku dni naraz, więc w zakresie pytamy o nią tylko przy ostatnim dniu
                const withBaza = includeBaza && index === days.length - 1;
                const result = await refreshDayWithRetry(
                    days[index],
                    withBaza ? [TenderSource.TED, TenderSource.E_ZAMOWIENIA, TenderSource.BAZA_KONKURENCYJNOSCI] : undefined
                );
                hadPartialFailure = hadPartialFailure || result.errors.length > 0;
            }

            if (isCurrentRun() && hadPartialFailure) {
                setRefreshError(PARTIAL_FAILURE_MESSAGE);
            }
        } catch (error) {
            if (!isCurrentRun()) return;
            const code = (error as { code?: string })?.code ?? "";
            console.error("Błąd odświeżania przetargów:", error);
            setRefreshError(
                code === REFRESH_IN_PROGRESS_CODE ? IN_PROGRESS_MESSAGE : REFRESH_ERROR_MESSAGES[code] ?? GENERIC_REFRESH_ERROR
            );
        } finally {
            if (isCurrentRun()) {
                setIsRefreshing(false);
                setRefreshProgress(null);
            }
        }
    }, [startDay, endDay, useDateRange, todayDay]);

    // Odświeżenie przy wejściu do aplikacji i po zmianie dnia
    useEffect(() => {
        refresh();
    }, [refresh]);

    return { isRefreshing, refreshError, refreshProgress, refresh, lastRefreshAt };
};
