import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { dayToDisplayDate } from './dateUtils';

export interface HourlyAverage {
    /** Średnia liczba ogłoszeń eZamówień w każdej godzinie (0-23) na jeden dzień. */
    values: number[];
    /** Z ilu dni liczona jest średnia (tylko dni z kompletnym pobraniem). */
    dayCount: number;
    /** Godzina z największą średnią; null, gdy w żadnej godzinie nic nie opublikowano. */
    peakHour: number | null;
}

/**
 * Średni rozkład godzinowy ogłoszeń eZamówień z podanych dni (RRRR-MM-DD). Liczą się tylko dni, które dziennik
 * odświeżeń uznaje za pobrane w całości (jak w trendzie): w niekompletnym dniu zero znaczyłoby brak danych,
 * a nie brak ogłoszeń. Dzień kompletny bez ogłoszeń (np. weekend) zaniża średnią, bo tak naprawdę wyglądał.
 * Zwraca null, gdy żaden z dni nie jest kompletny.
 */
export const averageHourlyDistribution = (
    tenders: Tender[],
    days: string[],
    completeDays: ReadonlySet<string>
): HourlyAverage | null => {
    const usedDays = new Set(days.filter((day) => completeDays.has(day)).map(dayToDisplayDate));
    if (usedDays.size === 0) return null;

    const sums: number[] = Array(24).fill(0);
    for (const tender of tenders) {
        if (tender.source !== TenderSource.E_ZAMOWIENIA || !tender.publicationTime) continue;
        if (!usedDays.has(tender.publicationDate)) continue;
        const hour = Number(tender.publicationTime.split(':')[0]);
        if (Number.isInteger(hour) && hour >= 0 && hour < 24) sums[hour] += 1;
    }

    const values = sums.map((sum) => sum / usedDays.size);
    const max = Math.max(...values);
    return { values, dayCount: usedDays.size, peakHour: max > 0 ? values.indexOf(max) : null };
};
