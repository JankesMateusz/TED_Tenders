import React from 'react';
import { Statistics } from '../utils/calculateStatistics';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig } from '../utils/tenderSources';
import { STATUS_CONFIG, TENDER_STATUSES } from '../utils/tenderStatus';
import { TenderStatus } from '../types/TenderStatus';
import { OrderType, getOrderTypeConfig } from '../utils/tenderSources';
import { getCpvName } from '../utils/cpvMapping';
import { CpvCategoryKey } from '../utils/cpvCategories';
import { TrendPoint } from '../utils/recentTrend';
import { formatDelta } from '../utils/comparison';
import { MIN_REPEAT_COUNT } from '../utils/repeatOptions';
import { HourlyAverage } from '../utils/hourlyAverage';
import { RankedList, ShareBar } from './statistics/RankedList';
import { DailySourcesChart } from './statistics/DailySourcesChart';
import { HourlyActivityChart } from './statistics/HourlyActivityChart';
import { RecentTrendChart } from './statistics/RecentTrendChart';
import { StatisticsNotices } from './statistics/StatisticsNotices';
import styles from './StatisticsTab.module.css';

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

interface StatisticsTabProps {
    statistics: Statistics;
    isDateRange: boolean;
    onDrillDown: (target: StatisticsDrillDown) => void;
    /** Czy lista, z której liczone są statystyki, jest zawężona filtrami. */
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    /** `null`, gdy nie ma wybranego zakresu dat. */
    comparison: StatisticsComparison | null;
    hourly: HourlyChartData;
    /** Nowe ogłoszenia z ostatnich dni, po tych samych filtrach co statystyki (poza zakresem dat). */
    trend: { points: TrendPoint[]; error: string | null };
}

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

export const StatisticsTab: React.FC<StatisticsTabProps> = ({
    statistics,
    isDateRange,
    onDrillDown,
    hasActiveFilters,
    onClearFilters,
    comparison,
    hourly,
    trend
}) => {
    const previous = comparison?.status === 'ready' ? comparison.statistics : null;
    const isPeriodOngoing = comparison?.status === 'ready' && comparison.isCurrentPeriodOngoing;
    // Dopóki bieżący okres trwa, jego liczby są niepełne i różnica względem całego poprzedniego okresu
    // byłaby prawie zawsze ujemna, więc pokazujemy samą wartość z poprzedniego okresu.
    const renderDelta = (current: number, previousValue: number | undefined) => {
        if (previousValue === undefined) return null;
        if (isPeriodOngoing) {
            return (
                <span className={styles.delta} title="Bieżący okres jeszcze trwa, więc różnica byłaby zaniżona">
                    poprzednio: {previousValue}
                </span>
            );
        }
        return <span className={styles.delta} title={`Poprzednio: ${previousValue}`}>{formatDelta(current, previousValue)}</span>;
    };
    const reviewedCount = statistics.total - statistics.byStatus.unmarked;
    const reviewedPercent = statistics.total > 0 ? Math.round((reviewedCount / statistics.total) * 100) : 0;
    const reviewedTotal = statistics.byReviewer.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className={styles.statisticsContainer}>
            <StatisticsNotices hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} comparison={comparison} />

            {statistics.total > 0 && (
                <div className={styles.progress}>
                    <div className={styles.progressHeader}>
                        <span><strong>{reviewedCount}</strong> z {statistics.total} ocenionych</span>
                        <span>{reviewedPercent}%</span>
                    </div>
                    <div
                        className={styles.progressTrack}
                        role="progressbar"
                        aria-label="Postęp oceniania przetargów"
                        aria-valuemin={0}
                        aria-valuemax={statistics.total}
                        aria-valuenow={reviewedCount}
                    >
                        <span className={styles.progressBar} style={{ width: `${reviewedPercent}%` }} />
                    </div>
                </div>
            )}

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.total}</div>
                    {renderDelta(statistics.total, previous?.total)}
                    <div className={styles.statLabel}>Wszystkich przetargów</div>
                </div>

                {TENDER_STATUSES.map((status) => (
                    <button
                        key={status}
                        type="button"
                        className={`${styles.statCard} ${styles.clickable} ${statistics.byStatus[status] === 0 ? styles.statCardZero : ''}`}
                        onClick={() => onDrillDown({ kind: 'status', status })}
                    >
                        <div className={styles.statValue} style={{ color: STATUS_CONFIG[status].color }}>
                            {statistics.byStatus[status]}
                        </div>
                        {renderDelta(statistics.byStatus[status], previous?.byStatus[status])}
                        <div className={styles.statLabel}>{STATUS_CONFIG[status].label}</div>
                    </button>
                ))}
            </div>

            <div className={styles.sectionsGrid}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Według źródła</h3>
                    <div className={styles.sourceStats}>
                        {Object.entries(statistics.bySource).map(([source, count]) => {
                            const config = getSourceConfig(source as TenderSource);
                            return (
                                <button
                                    key={source}
                                    type="button"
                                    className={`${styles.sourceItem} ${styles.clickable}`}
                                    onClick={() => onDrillDown({ kind: 'source', source: source as TenderSource })}
                                >
                                    <span 
                                        className={styles.sourceBadge}
                                        style={{
                                            backgroundColor: config.backgroundColor,
                                            color: config.color
                                        }}
                                    >
                                        {config.label}
                                    </span>
                                    <span className={styles.sourceCount}>
                                        {count} {renderDelta(count, previous?.bySource[source as TenderSource])}
                                    </span>
                                    <ShareBar count={count} total={statistics.total} />
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                {Object.keys(statistics.byOrderType).length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Według typu zamówienia</h3>
                        <div className={styles.orderTypeStats}>
                            {Object.entries(statistics.byOrderType).map(([type, count]) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`${styles.orderTypeItem} ${styles.clickable}`}
                                    onClick={() => onDrillDown({ kind: 'orderType', orderType: type as OrderType })}
                                >
                                    <span className={styles.orderTypeLabel}>{getOrderTypeConfig(type as OrderType).label}</span>
                                    <span className={styles.orderTypeCount}>{count}</span>
                                    <ShareBar count={count} total={statistics.total} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <HourlyActivityChart hourly={hourly} rangeDistribution={statistics.ezamowieniaHourlyDistribution} />

            <RecentTrendChart trend={trend} />

            {statistics.byCpvCategory.length > 0 && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h3 className={styles.sectionTitle}>Co jest zamawiane</h3>
                    <p className={styles.chartSubtitle}>
                        Liczba przetargów z kodem CPV z danej kategorii. Przetarg może mieć kody z kilku kategorii, więc sumy się nie dodają.
                    </p>
                    <RankedList
                        items={statistics.byCpvCategory.map(({ key, label, count }) => ({ key, name: label, count }))}
                        shareTotal={statistics.total}
                        onSelect={(key) => onDrillDown({ kind: 'cpvCategory', category: key as CpvCategoryKey })}
                    />
                </div>
            )}

            {statistics.byReviewer.length > 0 && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h3 className={styles.sectionTitle}>Kto ocenia</h3>
                    <p className={styles.chartSubtitle}>
                        Przetargi według osoby, która ustawiła obecny status (przy zmianie statusu liczy się ostatnia osoba).
                    </p>
                    <RankedList
                        items={statistics.byReviewer.map(({ reviewer, count }) => ({ key: reviewer, name: reviewer, count }))}
                        shareTotal={reviewedTotal}
                    />
                </div>
            )}

            {isDateRange && <DailySourcesChart distribution={statistics.dailyDistributionBySource} />}

            {statistics.topCpvCodes.length > 0 && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h3 className={styles.sectionTitle}>Top 10 kodów CPV (IT)</h3>
                    <p className={styles.chartSubtitle}>
                        Liczba przetargów zawierających dany kod. Przetarg może mieć kilka kodów, więc sumy się nie dodają.
                    </p>
                    <RankedList
                        showRank
                        items={statistics.topCpvCodes.map(({ code, count }) => ({ key: code, name: `${getCpvName(code)} (${code})`, count }))}
                        onSelect={(code) => onDrillDown({ kind: 'cpv', code })}
                    />
                </div>
            )}

            <div className={styles.sectionsGrid}>
                {statistics.topCities.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Top 10 miast</h3>
                        <RankedList
                            showRank
                            items={statistics.topCities.map(({ city, count }) => ({ key: city, name: city, count }))}
                            onSelect={(city) => onDrillDown({ kind: 'city', city })}
                        />
                    </div>
                )}
                
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Powtarzający się zamawiający</h3>
                    <p className={styles.chartSubtitle}>
                        Zamawiający z co najmniej {MIN_REPEAT_COUNT} ogłoszeniami w wybranym okresie: to oni wracają.
                    </p>
                    {statistics.repeatBuyers.length > 0 ? (
                        <RankedList
                            showRank
                            items={statistics.repeatBuyers.map(({ buyer, count }) => ({ key: buyer, name: buyer, count }))}
                            onSelect={(buyer) => onDrillDown({ kind: 'buyer', buyer })}
                        />
                    ) : (
                        <p className={styles.chartSubtitle}>Brak zamawiających z więcej niż jednym ogłoszeniem.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

