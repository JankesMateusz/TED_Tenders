import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAwaySummary } from '../hooks/useAwaySummary';
import { AwaySummary } from '../utils/awaySummary';

interface AwaySummaryValue {
    summary: AwaySummary | null;
    /** Ostatnia wizyta sprzed dłuższej nieobecności; null, gdy nie było takiej nieobecności albo funkcja jest wyłączona. */
    since: Date | null;
    dismiss: () => void;
    /** Ile „nowych” przetargów widać teraz na liście (po jej filtrach); 0, gdy lista nie jest otwarta. */
    newInView: number;
    setNewInView: (count: number) => void;
}

const AwaySummaryContext = createContext<AwaySummaryValue>({
    summary: null, since: null, dismiss: () => undefined, newInView: 0, setNewInView: () => undefined
});

/** Jedno miejsce liczące podsumowanie „od ostatniej wizyty”: korzystają z niego baner i plakietki „Nowy” na kartach. */
export const AwaySummaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const away = useAwaySummary();
    const [newInView, setNewInView] = useState(0);
    const value = { ...away, newInView, setNewInView };
    return <AwaySummaryContext.Provider value={value}>{children}</AwaySummaryContext.Provider>;
};

export const useAwaySummaryContext = (): AwaySummaryValue => useContext(AwaySummaryContext);

/** Moment, od którego przetargi są „nowe”; poza providerem (np. w testach) brak plakietek. */
export const useAwaySince = (): Date | null => useContext(AwaySummaryContext).since;

/** Lista przetargów zgłasza bannerowi, ile nowych widzi po filtrach; po zamknięciu listy zeruje licznik. */
export const useReportNewInView = (count: number): void => {
    const { setNewInView } = useContext(AwaySummaryContext);
    useEffect(() => {
        setNewInView(count);
        return () => setNewInView(0);
    }, [count, setNewInView]);
};
