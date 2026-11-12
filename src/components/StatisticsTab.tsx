import React from 'react';
import { Statistics } from '../utils/calculateStatistics';
import { getCpvName } from '../utils/cpvMapping';
import { CpvCategoryKey } from '../utils/cpvCategories';
import { MIN_REPEAT_COUNT } from '../utils/repeatOptions';
import { RankedList } from './statistics/RankedList';
import { DailySourcesChart } from './statistics/DailySourcesChart';
import { HourlyActivityChart } from './statistics/HourlyActivityChart';
import { RecentTrendChart } from './statistics/RecentTrendChart';
import { StatisticsNotices } from './statistics/StatisticsNotices';
import { SummaryCards } from './statistics/SummaryCards';
import { HourlyChartData, StatisticsComparison, StatisticsDrillDown, StatisticsTrend } from './statistics/types';
import styles from './StatisticsTab.module.css';

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
    trend: StatisticsTrend;
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
    const reviewedTotal = statistics.byReviewer.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className={styles.statisticsContainer}>
            <StatisticsNotices hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} comparison={comparison} />

            <SummaryCards statistics={statistics} comparison={comparison} onDrillDown={onDrillDown} />

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

