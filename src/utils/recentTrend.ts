import { Tender } from '../types/Tender';
import { addDays, dayToDisplayDate } from './dateUtils';

/** Ile ostatnich dni obejmuje trend nowych ogłoszeń w statystykach. */
export const TREND_DAYS = 14;

export interface TrendPoint {
    /** Dzień RRRR-MM-DD. */
    day: string;
    count: number;
    /** False, gdy dziennik odświeżeń nie potwierdza pobrania całego dnia: zero może wtedy znaczyć brak danych. */
    complete: boolean;
}

/** Ostatnie `days` dni kończące się na `endDay` (od najstarszego), włącznie z `endDay`. */
export const lastDays = (endDay: string, days: number): string[] =>
    Array.from({ length: days }, (_, index) => addDays(endDay, index - (days - 1)));

/** Liczba przetargów opublikowanych w każdym z podanych dni (daty przetargów mają postać DD-MM-RRRR). */
export const countTendersByDay = (
    tenders: Tender[],
    days: string[],
    completeDays: ReadonlySet<string>
): TrendPoint[] => {
    const counts = new Map<string, number>();
    for (const tender of tenders) {
        counts.set(tender.publicationDate, (counts.get(tender.publicationDate) ?? 0) + 1);
    }
    return days.map((day) => ({
        day,
        count: counts.get(dayToDisplayDate(day)) ?? 0,
        complete: completeDays.has(day)
    }));
};
