import { Statistics } from '../../utils/calculateStatistics';
import { TenderSource } from '../../types/TenderSource';
import { TenderStatus } from '../../types/TenderStatus';
import { OrderType } from '../../utils/tenderSources';
import { CpvCategoryKey } from '../../utils/cpvCategories';
import { TrendPoint } from '../../utils/recentTrend';
import { HourlyAverage } from '../../utils/hourlyAverage';

/** Element statystyk, w który kliknięto, żeby zobaczyć odpowiadające mu przetargi na liście. */
export type StatisticsDrillDown =
    | { kind: 'source'; source: TenderSource }
    | { kind: 'orderType'; orderType: OrderType }
    | { kind: 'status'; status: TenderStatus | 'unmarked' }
    | { kind: 'city'; city: string }
    | { kind: 'buyer'; buyer: string }
    | { kind: 'cpv'; code: string }
    | { kind: 'cpvCategory'; category: CpvCategoryKey };

/** Stan porównania wybranego okresu z poprzednim (poprzedni dzień roboczy lub okres tej samej długości). */
export type StatisticsComparison =
    | { status: 'unavailable'; reason: string }
    | { status: 'loading' }
    | { status: 'missing'; label: string; isFetching: boolean; error: string | null; onFetch: () => void }
    | { status: 'ready'; label: string; statistics: Statistics; isCurrentPeriodOngoing: boolean };

/** Dane wykresu godzinowego eZamówień: dni do wyboru (DD-MM-RRRR, od najnowszego) i rozkład godzin po dniach. */
export interface HourlyChartData {
    days: string[];
    distribution: Record<string, number[]>;
    /** Średnia z ostatnich dni z kompletnymi danymi; null, gdy żaden dzień nie jest kompletny. */
    average: HourlyAverage | null;
    /** Wybrany dzień jest spoza zakresu dat i jego przetargi są jeszcze wczytywane. */
    isLoading: boolean;
    error: string | null;
    /** Woła komponent po każdej zmianie wybranego dnia, żeby rodzic doczytał dzień spoza zakresu. */
    onSelectDay: (day: string) => void;
}

/** Nowe ogłoszenia z ostatnich dni, po tych samych filtrach co statystyki (poza zakresem dat). */
export interface StatisticsTrend {
    points: TrendPoint[];
    error: string | null;
}
