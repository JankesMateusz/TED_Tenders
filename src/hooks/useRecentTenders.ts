import { useEffect, useState } from 'react';
import { Tender } from '../types/Tender';
import { fetchRefreshLog, subscribeToTenders } from '../utils/tendersApi';
import { addDays } from '../utils/dateUtils';

/**
 * Przetargi z ostatnich `days` dni (nasłuch na żywo) oraz dni, które dziennik odświeżeń uznaje za pobrane
 * w całości. `enabled` równe false (zakładka statystyk zamknięta) wyłącza nasłuch, żeby nie czytać z bazy
 * kilkunastu dni bez potrzeby.
 */
export const useRecentTenders = (enabled: boolean, endDay: string, days: number) => {
    const startDay = addDays(endDay, -(days - 1));
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [completeDays, setCompleteDays] = useState<ReadonlySet<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;
        setError(null);
        return subscribeToTenders(startDay, endDay, setTenders, (loadError) => {
            console.error('Błąd wczytywania ostatnich dni do trendu:', loadError);
            setError('Nie udało się wczytać trendu.');
        });
    }, [enabled, startDay, endDay]);

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        fetchRefreshLog(startDay, endDay)
            .then((log) => {
                if (cancelled) return;
                setCompleteDays(new Set(Object.keys(log).filter((day) => log[day]?.complete)));
            })
            .catch((logError) => {
                // Bez dziennika wszystkie dni wyglądają na niekompletne, ale trend nadal się rysuje
                console.error('Błąd wczytywania dziennika odświeżeń do trendu:', logError);
            });
        return () => {
            cancelled = true;
        };
    }, [enabled, startDay, endDay]);

    return { tenders, completeDays, error };
};
