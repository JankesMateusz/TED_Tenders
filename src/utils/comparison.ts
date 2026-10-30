import { addDays } from './dateUtils';
import { listDays } from './refreshPlan';

/** Tak długo przetargi są w bazie (TTL liczony od pierwszego zapisu), więc starszych dni nie porównamy. */
export const COMPARISON_WINDOW_DAYS = 30;

export type ComparisonPeriod =
    | { ok: true; startDay: string; endDay: string }
    | { ok: false; reason: string };

const WEEKDAY_NAMES = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

const weekday = (day: string): number => {
    const [year, month, date] = day.split('-').map(Number);
    return new Date(year, month - 1, date).getDay();
};

/** Poprzedni dzień roboczy (sobota-niedziela pomijane, święta nie): dla poniedziałku jest to piątek. */
export const previousWorkingDay = (day: string): string => {
    let previous = addDays(day, -1);
    while (weekday(previous) === 0 || weekday(previous) === 6) {
        previous = addDays(previous, -1);
    }
    return previous;
};

/**
 * Okres, z którym porównujemy wybrany zakres: dla jednego dnia poprzedni dzień roboczy, dla zakresu
 * bezpośrednio poprzedzający okres tej samej długości. Gdy wypada poza okno danych w bazie, porównanie
 * jest niedostępne.
 */
export const getComparisonPeriod = (startDay: string, endDay: string, today: string): ComparisonPeriod => {
    let period: { startDay: string; endDay: string };
    if (startDay === endDay) {
        const previous = previousWorkingDay(startDay);
        period = { startDay: previous, endDay: previous };
    } else {
        const length = listDays(startDay, endDay).length;
        period = { startDay: addDays(startDay, -length), endDay: addDays(startDay, -1) };
    }
    if (period.startDay < addDays(today, -COMPARISON_WINDOW_DAYS)) {
        return { ok: false, reason: 'Poprzedni okres jest starszy niż dane przechowywane w bazie (30 dni).' };
    }
    return { ok: true, ...period };
};

/** Opis okresu do wyświetlenia, np. "piątek 23-10-2026" albo "16-10-2026 – 22-10-2026". */
export const describePeriod = (startDay: string, endDay: string): string => {
    const format = (day: string) => day.split('-').reverse().join('-');
    if (startDay === endDay) {
        return `${WEEKDAY_NAMES[weekday(startDay)]} ${format(startDay)}`;
    }
    return `${format(startDay)} – ${format(endDay)}`;
};

/** Różnica do wyświetlenia przy liczniku: "+5", "−3" albo "bez zmian". */
export const formatDelta = (current: number, previous: number): string => {
    const delta = current - previous;
    if (delta === 0) return 'bez zmian';
    return delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`;
};
