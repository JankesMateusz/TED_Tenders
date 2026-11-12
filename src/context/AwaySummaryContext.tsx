import React, { createContext, useContext } from 'react';
import { useAwaySummary } from '../hooks/useAwaySummary';
import { AwaySummary } from '../utils/awaySummary';

interface AwaySummaryValue {
    summary: AwaySummary | null;
    /** Ostatnia wizyta sprzed dłuższej nieobecności; null, gdy nie było takiej nieobecności albo funkcja jest wyłączona. */
    since: Date | null;
    dismiss: () => void;
}

const AwaySummaryContext = createContext<AwaySummaryValue>({ summary: null, since: null, dismiss: () => undefined });

/** Jedno miejsce liczące podsumowanie „od ostatniej wizyty”: korzystają z niego baner i plakietki „Nowy” na kartach. */
export const AwaySummaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useAwaySummary();
    return <AwaySummaryContext.Provider value={value}>{children}</AwaySummaryContext.Provider>;
};

export const useAwaySummaryContext = (): AwaySummaryValue => useContext(AwaySummaryContext);

/** Moment, od którego przetargi są „nowe”; poza providerem (np. w testach) brak plakietek. */
export const useAwaySince = (): Date | null => useContext(AwaySummaryContext).since;
