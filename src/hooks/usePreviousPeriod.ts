import { useCallback, useEffect, useState } from 'react';
import { Tender } from '../types/Tender';
import { fetchRefreshLog, subscribeToTenders } from '../utils/tendersApi';
import { listDays } from '../utils/refreshPlan';

const LOAD_ERROR = 'Nie udało się wczytać danych do porównania.';
const FETCH_ERROR = 'Nie udało się pobrać danych z poprzedniego okresu.';

/**
 * Przetargi z okresu porównawczego (nasłuch na żywo) oraz dni tego okresu, których nie pobrano w całości
 * (`missingDays`). Porównanie z niekompletnym dniem pokazałoby fałszywy spadek, więc widok go nie
 * pokazuje, dopóki dni nie zostaną pobrane (`fetchMissing`). `period` równe `null` wyłącza nasłuch.
 */
export const usePreviousPeriod = (
    period: { startDay: string; endDay: string } | null,
    fetchDay: (day: string) => Promise<unknown>
) => {
    const startDay = period?.startDay ?? null;
    const endDay = period?.endDay ?? null;
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [missingDays, setMissingDays] = useState<string[] | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logVersion, setLogVersion] = useState(0);

    useEffect(() => {
        setTenders([]);
        if (!startDay || !endDay) return;
        return subscribeToTenders(startDay, endDay, setTenders, (loadError) => {
            console.error('Błąd wczytywania okresu porównawczego:', loadError);
            setError(LOAD_ERROR);
        });
    }, [startDay, endDay]);

    useEffect(() => {
        setMissingDays(null);
        if (!startDay || !endDay) return;
        let cancelled = false;
        fetchRefreshLog(startDay, endDay)
            .then((log) => {
                if (!cancelled) setMissingDays(listDays(startDay, endDay).filter((day) => !log[day]?.complete));
            })
            .catch((logError) => {
                console.error('Błąd wczytywania dziennika odświeżeń:', logError);
                if (!cancelled) setError(LOAD_ERROR);
            });
        return () => {
            cancelled = true;
        };
    }, [startDay, endDay, logVersion]);

    const fetchMissing = useCallback(async () => {
        if (!missingDays) return;
        setIsFetching(true);
        setError(null);
        try {
            for (const day of missingDays) {
                await fetchDay(day);
            }
            setLogVersion((version) => version + 1);
        } catch (fetchError) {
            console.error('Błąd pobierania okresu porównawczego:', fetchError);
            setError(FETCH_ERROR);
        } finally {
            setIsFetching(false);
        }
    }, [missingDays, fetchDay]);

    return { tenders, missingDays, isFetching, error, fetchMissing };
};
