import { useEffect, useMemo, useState } from 'react';
import { Statistics } from '../../utils/calculateStatistics';
import { parseDate } from '../../utils/dateUtils';
import type { HourlyChartData } from './types';

/** Godziny pracy pokazywane na wykresie godzinowym; poza nimi tylko wtedy, gdy ktoś coś opublikował. */
export const DEFAULT_FIRST_HOUR = 7;
export const DEFAULT_LAST_HOUR = 19;

/** Wartość listy wyboru dnia oznaczająca średnią z ostatnich dni (zamiast konkretnego dnia). */
export const AVERAGE_OPTION = 'average';

/**
 * Stan wykresu godzinowego: wybór dnia (albo średniej) i dane do narysowania. Dopóki użytkownik sam nie wybierze dnia,
 * domyślną opcją jest średnia (gdy tylko są do niej dane), a bez niej najnowszy dzień z wybranego zakresu. Każdą zmianę
 * wyboru zgłasza rodzicowi przez `hourly.onSelectDay`, żeby doczytał dzień spoza zakresu dat.
 */
export const useHourlyChartState = (hourly: HourlyChartData, rangeDistribution: Statistics['ezamowieniaHourlyDistribution']) => {
    const hourlyDates = hourly.days;
    // Domyślnie najnowszy dzień z wybranego zakresu; inne dni z bazy użytkownik wybiera sam
    const newestRangeDate = useMemo(
        () => Object.keys(rangeDistribution).sort((a, b) => parseDate(b).getTime() - parseDate(a).getTime())[0] || '',
        [rangeDistribution]
    );
    const hasAverage = hourly.average !== null;
    const [selectedHourlyDate, setSelectedHourlyDate] = useState<string>(hasAverage ? AVERAGE_OPTION : newestRangeDate);
    // Dopóki użytkownik sam nie wybierze dnia, domyślną opcją jest średnia (gdy tylko są do niej dane)
    const [hasPickedHourlyDate, setHasPickedHourlyDate] = useState(false);
    useEffect(() => {
        setSelectedHourlyDate(current => {
            if (current === AVERAGE_OPTION) return hasAverage ? current : newestRangeDate;
            if (!hasPickedHourlyDate && hasAverage) return AVERAGE_OPTION;
            return hourlyDates.includes(current) ? current : (hasAverage ? AVERAGE_OPTION : newestRangeDate);
        });
    }, [hourlyDates, newestRangeDate, hasAverage, hasPickedHourlyDate]);
    const isAverageSelected = selectedHourlyDate === AVERAGE_OPTION && hourly.average !== null;
    const { onSelectDay } = hourly;
    useEffect(() => {
        // Średnia nie jest dniem do doczytania z bazy
        onSelectDay(selectedHourlyDate === AVERAGE_OPTION ? '' : selectedHourlyDate);
    }, [onSelectDay, selectedHourlyDate]);

    const selectDate = (date: string) => {
        setHasPickedHourlyDate(true);
        setSelectedHourlyDate(date);
    };

    const hourlyData = useMemo(() => {
        if (!selectedHourlyDate) {
            return [];
        }
        const raw = isAverageSelected ? hourly.average?.values ?? [] : hourly.distribution[selectedHourlyDate] || [];
        return Array.from({ length: 24 }, (_, hour) => raw[hour] || 0);
    }, [hourly.distribution, hourly.average, isAverageSelected, selectedHourlyDate]);
    const peakHour = isAverageSelected ? hourly.average?.peakHour ?? null : null;
    const maxHourlyValue = useMemo(() => hourlyData.reduce((max, value) => Math.max(max, value), 0), [hourlyData]);
    const totalHourlyValue = useMemo(() => hourlyData.reduce((sum, value) => sum + value, 0), [hourlyData]);
    const hasHourlyData = hourlyDates.length > 0 || hasAverage;
    const visibleHours = useMemo(() => {
        const active = hourlyData.flatMap((count, hour) => (count > 0 ? [hour] : []));
        const first = Math.min(DEFAULT_FIRST_HOUR, ...active);
        const last = Math.max(DEFAULT_LAST_HOUR, ...active);
        return hourlyData.map((count, hour) => ({ count, hour })).filter(({ hour }) => hour >= first && hour <= last);
    }, [hourlyData]);

    return {
        hourlyDates,
        hasAverage,
        hasHourlyData,
        selectedHourlyDate,
        selectDate,
        isAverageSelected,
        peakHour,
        maxHourlyValue,
        totalHourlyValue,
        visibleHours
    };
};
