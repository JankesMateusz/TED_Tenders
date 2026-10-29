import { addDays } from './dateUtils';

/** Ile dni wstecz serwer pozwala odświeżać (functions/tenders/refresh.ts). */
export const MAX_REFRESH_PAST_DAYS = 31;

/** Wpis dziennika odświeżeń: `complete` oznacza dzień pobrany już po jego zakończeniu. */
export interface RefreshLogEntry {
    complete: boolean;
}

/** Czy serwer przyjmie odświeżenie tego dnia (nie z przyszłości i nie starsze niż miesiąc). */
export const canRefreshDay = (day: string, today: string): boolean =>
    day <= today && day >= addDays(today, -MAX_REFRESH_PAST_DAYS);

/** Wszystkie dni od `startDay` do `endDay` włącznie (pusta lista, gdy koniec jest przed początkiem). */
export const listDays = (startDay: string, endDay: string): string[] => {
    const days: string[] = [];
    for (let day = startDay; day <= endDay; day = addDays(day, 1)) {
        days.push(day);
    }
    return days;
};

/**
 * Dni z zakresu, które trzeba pobrać ze źródeł: te, które serwer przyjmie, a nie mają jeszcze kompletnego
 * wpisu w dzienniku. Dzisiejszy dzień pobieramy zawsze, bo w ciągu dnia pojawiają się nowe przetargi.
 */
export const daysToRefresh = (
    startDay: string,
    endDay: string,
    log: Record<string, RefreshLogEntry>,
    today: string
): string[] =>
    listDays(startDay, endDay).filter(
        (day) => canRefreshDay(day, today) && (day === today || !log[day]?.complete)
    );
