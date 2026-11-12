import { useEffect, useState } from "react";
import { Tender } from "../types/Tender";
import { subscribeToTenders } from "../utils/tendersApi";

const LOAD_ERROR_MESSAGE = "Nie udało się wczytać przetargów z bazy.";

/**
 * Nasłuch przetargów z bazy dla wybranego zakresu dni (zmiany od innych użytkowników widać na bieżąco).
 * `isLoading` jest prawdą do czasu pierwszej odpowiedzi bazy dla wybranego zakresu.
 */
export const useTendersSubscription = (startDay: string | null, endDay: string | null) => {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (!startDay || !endDay) {
            setTenders([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setLoadError(null);
        return subscribeToTenders(
            startDay,
            endDay,
            (loadedTenders) => {
                setTenders(loadedTenders);
                setIsLoading(false);
            },
            (error) => {
                console.error("Błąd wczytywania przetargów z bazy:", error);
                setLoadError(LOAD_ERROR_MESSAGE);
                setIsLoading(false);
            }
        );
    }, [startDay, endDay]);

    return { tenders, isLoading, loadError };
};
