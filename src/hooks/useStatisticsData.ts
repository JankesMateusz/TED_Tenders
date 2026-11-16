import { useCallback, useMemo, useState } from "react";
import { Tender } from "../types/Tender";
import { calculateStatistics } from "../utils/calculateStatistics";
import { dayToDisplayDate, displayDateToDay, parseDate } from "../utils/dateUtils";
import { TREND_DAYS, countTendersByDay, lastDays } from "../utils/recentTrend";
import { filterTenders } from "../utils/tenderFilters";
import { describePeriod, getComparisonPeriod } from "../utils/comparison";
import { averageHourlyDistribution } from "../utils/hourlyAverage";
import { refreshDayWithRetry } from "../utils/refreshWithRetry";
import { usePreviousPeriod } from "./usePreviousPeriod";
import { useRecentTenders } from "./useRecentTenders";
import { useDayTenders, useRefreshedDays } from "./useHourlyDays";
import type { StatisticsComparison } from "../components/statistics/types";

type FilterOptions = Parameters<typeof filterTenders>[1];

type Options = {
    /** Dane spoza bieżącego okresu (porównanie, trend, dodatkowy dzień) wczytujemy tylko, gdy zakładka jest otwarta. */
    isStatisticsTab: boolean;
    startDay: string | null;
    endDay: string | null;
    todayDay: string;
    /** Przetargi z wybranego zakresu dat (także te z gwiazdką: zostają na liście zespołu). */
    rangeTenders: Tender[];
    filterOptions: FilterOptions;
};

/**
 * Dane zakładki statystyk: statystyki bieżącego okresu, porównanie z poprzednim okresem, trend z ostatnich dni
 * i wykres godzinowy eZamówień. Wszystkie liczby używają tych samych filtrów,
 * żeby były ze sobą porównywalne.
 */
export const useStatisticsData = ({ isStatisticsTab, startDay, endDay, todayDay, rangeTenders, filterOptions }: Options) => {
    // Statystyki opisują ocenę przetargów, więc ignorują filtr statusu: domyślny widok "Nieoznaczone" zostawiłby
    // w nich same nieoznaczone i wyzerował pozostałe statusy.
    const applyStatisticsFilters = useCallback((list: Tender[]) => filterTenders(list, filterOptions, 'status'), [filterOptions]);
    const statistics = useMemo(
        () => calculateStatistics(applyStatisticsFilters(rangeTenders)),
        [applyStatisticsFilters, rangeTenders]
    );

    // Porównanie z poprzednim okresem
    const comparisonPeriod = useMemo(
        () => (startDay && endDay ? getComparisonPeriod(startDay, endDay, todayDay) : null),
        [startDay, endDay, todayDay]
    );
    const previousPeriod = usePreviousPeriod(
        isStatisticsTab && comparisonPeriod?.ok ? comparisonPeriod : null,
        refreshDayWithRetry
    );
    const previousStatistics = useMemo(
        () => calculateStatistics(applyStatisticsFilters(previousPeriod.tenders)),
        [applyStatisticsFilters, previousPeriod.tenders]
    );

    // Wykres godzinowy: dropdown ma dni z całej bazy (według dziennika odświeżeń), a nie tylko z wybranego
    // zakresu. Dzień spoza zakresu doczytujemy dopiero po wybraniu, przetargi tylko tego jednego dnia.
    const refreshedDays = useRefreshedDays(isStatisticsTab, todayDay);
    // Trend nowych ogłoszeń z ostatnich dni
    const recent = useRecentTenders(isStatisticsTab, todayDay, TREND_DAYS);
    const trend = useMemo(
        () => ({
            points: countTendersByDay(applyStatisticsFilters(recent.tenders), lastDays(todayDay, TREND_DAYS), recent.completeDays),
            error: recent.error
        }),
        [applyStatisticsFilters, recent.tenders, recent.completeDays, recent.error, todayDay]
    );
    // Średnia godzinowa z tych samych 14 dni (te same dane i filtry co trend, bez dodatkowych zapytań do bazy)
    const hourlyAverage = useMemo(
        () => averageHourlyDistribution(applyStatisticsFilters(recent.tenders), lastDays(todayDay, TREND_DAYS), recent.completeDays),
        [applyStatisticsFilters, recent.tenders, recent.completeDays, todayDay]
    );
    const [hourlyDay, setHourlyDay] = useState('');
    const hourlyExtraDay = useMemo(() => {
        const day = isStatisticsTab ? displayDateToDay(hourlyDay) : null;
        if (!day) return null;
        return startDay && endDay && day >= startDay && day <= endDay ? null : day;
    }, [isStatisticsTab, hourlyDay, startDay, endDay]);
    const extraDay = useDayTenders(hourlyExtraDay);
    const isExtraDayLoaded = hourlyExtraDay !== null && extraDay.loadedDay === hourlyExtraDay;
    const hourlyDistribution = useMemo(() => {
        const extra = isExtraDayLoaded
            ? calculateStatistics(applyStatisticsFilters(extraDay.tenders)).ezamowieniaHourlyDistribution
            : {};
        return { ...extra, ...statistics.ezamowieniaHourlyDistribution };
    }, [isExtraDayLoaded, extraDay.tenders, applyStatisticsFilters, statistics.ezamowieniaHourlyDistribution]);
    const hourlyDays = useMemo(() => {
        const days = new Set([...Object.keys(statistics.ezamowieniaHourlyDistribution), ...refreshedDays.map(dayToDisplayDate)]);
        return Array.from(days).sort((a, b) => parseDate(b).getTime() - parseDate(a).getTime());
    }, [statistics.ezamowieniaHourlyDistribution, refreshedDays]);

    let comparison: StatisticsComparison | null = null;
    if (comparisonPeriod && endDay) {
        if (!comparisonPeriod.ok) {
            comparison = { status: 'unavailable', reason: comparisonPeriod.reason };
        } else if (previousPeriod.missingDays === null) {
            comparison = previousPeriod.error
                ? { status: 'unavailable', reason: previousPeriod.error }
                : { status: 'loading' };
        } else {
            const label = describePeriod(comparisonPeriod.startDay, comparisonPeriod.endDay);
            comparison = previousPeriod.missingDays.length > 0
                ? {
                    status: 'missing',
                    label,
                    isFetching: previousPeriod.isFetching,
                    error: previousPeriod.error,
                    onFetch: previousPeriod.fetchMissing
                }
                : {
                    status: 'ready',
                    label,
                    statistics: previousStatistics,
                    isCurrentPeriodOngoing: endDay >= todayDay
                };
        }
    }

    const hourly = {
        days: hourlyDays,
        distribution: hourlyDistribution,
        average: hourlyAverage,
        isLoading: hourlyExtraDay !== null && !isExtraDayLoaded && !extraDay.error,
        error: extraDay.error,
        onSelectDay: setHourlyDay
    };

    return { statistics, comparison, trend, hourly };
};
