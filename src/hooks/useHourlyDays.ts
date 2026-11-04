import { useEffect, useState } from 'react';
import { Tender } from '../types/Tender';
import { fetchRefreshLog, subscribeToTenders } from '../utils/tendersApi';
import { addDays } from '../utils/dateUtils';

// Przetargi wygasają po ok. 30 dniach, więc starszych wpisów w dzienniku nie ma
const LOOKBACK_DAYS = 31;

/**
 * Dni (RRRR-MM-DD, od najnowszego), dla których w bazie są pobrane przetargi, według dziennika odświeżeń.
 * Wczytywane raz, gdy `enabled` (zakładka statystyk jest otwarta), i ponownie przy zmianie dnia.
 */
export const useRefreshedDays = (enabled: boolean, todayDay: string): string[] => {
    const [days, setDays] = useState<string[]>([]);

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        fetchRefreshLog(addDays(todayDay, -LOOKBACK_DAYS), todayDay)
            .then((log) => {
                if (!cancelled) setDays(Object.keys(log).sort().reverse());
            })
            .catch((error) => {
                // Bez listy dropdown pokazuje tylko dni z wybranego zakresu, jak wcześniej
                console.error('Błąd wczytywania dziennika odświeżeń:', error);
            });
        return () => {
            cancelled = true;
        };
    }, [enabled, todayDay]);

    return days;
};

/**
 * Przetargi z jednego dnia (RRRR-MM-DD), nasłuch na żywo; `null` wyłącza nasłuch. `loadedDay` mówi, którego
 * dnia dotyczy `tenders`, żeby widok odróżnił dane poprzedniego dnia od jeszcze niewczytanego nowego.
 */
export const useDayTenders = (day: string | null) => {
    const [state, setState] = useState<{ loadedDay: string | null; tenders: Tender[] }>({
        loadedDay: null,
        tenders: []
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
        if (!day) {
            setState({ loadedDay: null, tenders: [] });
            return;
        }
        return subscribeToTenders(
            day,
            day,
            (tenders) => setState({ loadedDay: day, tenders }),
            (loadError) => {
                console.error('Błąd wczytywania dnia do wykresu godzinowego:', loadError);
                setError('Nie udało się wczytać wybranego dnia.');
            }
        );
    }, [day]);

    return { ...state, error };
};
