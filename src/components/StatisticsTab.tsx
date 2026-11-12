import React, { useEffect, useMemo, useState } from 'react';
import { Statistics } from '../utils/calculateStatistics';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig } from '../utils/tenderSources';
import { STATUS_CONFIG, TENDER_STATUSES } from '../utils/tenderStatus';
import { TenderStatus } from '../types/TenderStatus';
import { OrderType, getOrderTypeConfig } from '../utils/tenderSources';
import { getCpvName } from '../utils/cpvMapping';
import { CpvCategoryKey } from '../utils/cpvCategories';
import { TREND_DAYS, TrendPoint } from '../utils/recentTrend';
import { formatDelta } from '../utils/comparison';
import { MIN_REPEAT_COUNT } from '../utils/repeatOptions';
import { HourlyAverage } from '../utils/hourlyAverage';
import { RankedList, ShareBar } from './statistics/RankedList';
import { RecentTrendChart } from './statistics/RecentTrendChart';
import { StatisticsNotices } from './statistics/StatisticsNotices';
import styles from './StatisticsTab.module.css';

const parseStatisticDate = (dateStr: string): number => {
    if (!dateStr || dateStr === 'Brak daty' || dateStr === 'Błąd formatu daty') {
        return 0;
    }
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
        return 0;
    }
    const [day, month, year] = parts.map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.getTime();
};

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

/** Godziny pracy pokazywane na wykresie godzinowym; poza nimi tylko wtedy, gdy ktoś coś opublikował. */
const DEFAULT_FIRST_HOUR = 7;
const DEFAULT_LAST_HOUR = 19;

/** Wartość listy wyboru dnia oznaczająca średnią z ostatnich dni (zamiast konkretnego dnia). */
const AVERAGE_OPTION = 'average';

/** Liczba na wykresie godzinowym: całkowita bez zmian, średnia z jednym miejscem po przecinku. */
const formatCount = (value: number): string =>
    Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',');

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
    const hourlyDates = hourly.days;
    // Domyślnie najnowszy dzień z wybranego zakresu; inne dni z bazy użytkownik wybiera sam
    const newestRangeDate = useMemo(
        () => Object.keys(statistics.ezamowieniaHourlyDistribution)
            .sort((a, b) => parseStatisticDate(b) - parseStatisticDate(a))[0] || '',
        [statistics.ezamowieniaHourlyDistribution]
    );
    const hasAverage = hourly.average !== null;
    const [selectedHourlyDate, setSelectedHourlyDate] = useState<string>(hasAverage ? AVERAGE_OPTION : newestRangeDate);
    // Dopóki użytkownik sam nie wybierze dnia, domyślną opcją jest średnia (gdy tylko są do niej dane)
    const [hasPickedHourlyDate, setHasPickedHourlyDate] = useState(false);
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
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
    const reviewedTotal = statistics.byReviewer.reduce((sum, item) => sum + item.count, 0);
    
    // Daily distribution by source
    const dailyEntries = useMemo(
        () => Object.entries(statistics.dailyDistributionBySource),
        [statistics.dailyDistributionBySource]
    );
    const hasDailyData = dailyEntries.length > 1; // Show only if multiple days
    const maxDailyValue = useMemo(() => {
        return dailyEntries.reduce((max, [, sources]) => {
            const total = sources[TenderSource.TED] + sources[TenderSource.E_ZAMOWIENIA] + sources[TenderSource.BAZA_KONKURENCYJNOSCI];
            return Math.max(max, total);
        }, 0);
    }, [dailyEntries]);

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

            {hasHourlyData && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3 className={styles.sectionTitle}>Godzinowa aktywność eZamówienia</h3>
                            <p className={styles.chartSubtitle}>
                                {isAverageSelected
                                    ? `Średnia liczba ogłoszeń w każdej godzinie z ostatnich ${TREND_DAYS} dni (tylko dni z kompletnym pobraniem). `
                                    : 'Liczba ogłoszeń opublikowanych w każdej godzinie wybranego dnia. '}
                                Widać godziny {DEFAULT_FIRST_HOUR}:00–{DEFAULT_LAST_HOUR}:59, inne tylko gdy coś w nich opublikowano.
                            </p>
                        </div>
                        <select
                            className={styles.chartSelect}
                            value={selectedHourlyDate}
                            onChange={event => {
                                setHasPickedHourlyDate(true);
                                setSelectedHourlyDate(event.target.value);
                            }}
                        >
                            {hasAverage && (
                                <option value={AVERAGE_OPTION}>Średnia ({TREND_DAYS} dni)</option>
                            )}
                            {hourlyDates.map(date => (
                                <option key={date} value={date}>
                                    {date}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.chartSummary}>
                        <span>
                            {isAverageSelected
                                ? <>Średnia z <strong>{hourly.average?.dayCount}</strong> dni z pełnymi danymi</>
                                : <>Wybrany dzień: <strong>{selectedHourlyDate}</strong></>}
                        </span>
                        <span>
                            {hourly.isLoading
                                ? 'Wczytywanie…'
                                : hourly.error ?? (isAverageSelected
                                    ? `Średnio ${formatCount(Math.round(totalHourlyValue * 10) / 10)} dziennie${peakHour !== null ? ` · najlepsza godzina ${String(peakHour).padStart(2, '0')}:00` : ''}`
                                    : `Łącznie ${totalHourlyValue} ogłoszeń`)}
                        </span>
                    </div>
                    <div className={styles.hourlyRows}>
                        {visibleHours.map(({ count, hour }) => (
                            <div key={hour} className={styles.hourlyRow}>
                                <span className={styles.hourlyRowLabel}>{hour.toString().padStart(2, '0')}:00</span>
                                <span className={styles.hourlyRowTrack}>
                                    <span
                                        className={`${styles.hourlyRowBar} ${hour === peakHour ? styles.hourlyRowBarPeak : ''}`}
                                        style={{ width: maxHourlyValue > 0 ? `${(count / maxHourlyValue) * 100}%` : 0 }}
                                    />
                                </span>
                                <span className={styles.hourlyRowCount}>{count > 0 ? formatCount(count) : ''}</span>
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.hourlyChartScroll} ${styles.hourlyChartVertical}`}>
                        <div className={styles.hourlyChartContainer}>
                            <div className={styles.hourlyChartGrid}>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={styles.gridLine}>
                                        <span className={styles.gridLabel}>
                                            {formatCount(Math.round((maxHourlyValue * (5 - i)) / 5 * 10) / 10)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.hourlyChart}>
                                {visibleHours.map(({ count, hour }) => {
                                    const maxChartHeight = 180;
                                    const height = maxHourlyValue > 0 ? (count / maxHourlyValue) * maxChartHeight : 0;
                                    const intensity = maxHourlyValue ? count / maxHourlyValue : 0;
                                    const isHovered = hoveredHour === hour;
                                    return (
                                        <div 
                                            key={hour} 
                                            className={styles.hourBarWrapper}
                                            onMouseEnter={() => setHoveredHour(hour)}
                                            onMouseLeave={() => setHoveredHour(null)}
                                        >
                                            {count > 0 && (
                                                <span className={`${styles.hourCount} ${isHovered ? styles.hourCountHovered : ''}`}>
                                                    {formatCount(count)}
                                                </span>
                                            )}
                                            {isHovered && count > 0 && (
                                                <div className={styles.hourTooltip}>
                                                    <strong>{hour.toString().padStart(2, '0')}:00</strong>
                                                    <span>
                                                        {isAverageSelected
                                                            ? `średnio ${formatCount(count)} dziennie`
                                                            : `${count} ${count === 1 ? 'ogłoszenie' : count < 5 ? 'ogłoszenia' : 'ogłoszeń'}`}
                                                    </span>
                                                    <span>{((count / totalHourlyValue) * 100).toFixed(1)}%</span>
                                                </div>
                                            )}
                                            <div 
                                                className={`${styles.hourBar} ${isHovered ? styles.hourBarHovered : ''} ${hour === peakHour ? styles.hourBarPeak : ''}`}
                                                style={{ 
                                                    height: `${height}px`,
                                                    opacity: count > 0 ? 0.6 + intensity * 0.4 : 0
                                                }}
                                            />
                                            <span className={`${styles.hourLabel} ${hour === peakHour ? styles.hourLabelPeak : ''}`}>
                                                {hour.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {isDateRange && hasDailyData && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <div>
                        <h3 className={styles.sectionTitle}>Porównanie źródeł w czasie</h3>
                        <p className={styles.chartSubtitle}>
                            Liczba ogłoszeń z TED i eZamówienia publikowanych każdego dnia
                        </p>
                    </div>
                    <div className={styles.dailyChartScroll}>
                        <div className={styles.dailyChartContainer}>
                            <div className={styles.dailyChartGrid}>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={styles.gridLine}>
                                        <span className={styles.gridLabel}>
                                            {Math.round((maxDailyValue * (5 - i)) / 5)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.dailyChart}>
                                {dailyEntries.map(([date, sources]) => {
                                    const maxChartHeight = 180;
                                    const tedCount = sources[TenderSource.TED];
                                    const ezamCount = sources[TenderSource.E_ZAMOWIENIA];
                                    const bazaCount = sources[TenderSource.BAZA_KONKURENCYJNOSCI];
                                    const total = tedCount + ezamCount + bazaCount;
                                    
                                    const tedHeight = maxDailyValue > 0 ? (tedCount / maxDailyValue) * maxChartHeight : 0;
                                    const ezamHeight = maxDailyValue > 0 ? (ezamCount / maxDailyValue) * maxChartHeight : 0;
                                    const bazaHeight = maxDailyValue > 0 ? (bazaCount / maxDailyValue) * maxChartHeight : 0;
                                    
                                    const isHovered = hoveredDay === date;
                                    
                                    return (
                                        <div 
                                            key={date} 
                                            className={styles.dayBarWrapper}
                                            onMouseEnter={() => setHoveredDay(date)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                        >
                                            {isHovered && total > 0 && (
                                                <div className={styles.dayTooltip}>
                                                    <strong>{date}</strong>
                                                    {tedCount > 0 && (
                                                        <span style={{ color: 'var(--series-ted)' }}>
                                                            TED: {tedCount}
                                                        </span>
                                                    )}
                                                    {ezamCount > 0 && (
                                                        <span style={{ color: 'var(--series-ezam)' }}>
                                                            eZamówienia: {ezamCount}
                                                        </span>
                                                    )}
                                                    {bazaCount > 0 && (
                                                        <span style={{ color: 'var(--series-baza)' }}>
                                                            Baza: {bazaCount}
                                                        </span>
                                                    )}
                                                    <span style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '4px', marginTop: '4px' }}>
                                                        Łącznie: {total}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={styles.dayBarsStack}>
                                                {tedCount > 0 && (
                                                    <div 
                                                        className={`${styles.dayBar} ${styles.dayBarTed} ${isHovered ? styles.dayBarHovered : ''}`}
                                                        style={{ height: `${tedHeight}px` }}
                                                    />
                                                )}
                                                {ezamCount > 0 && (
                                                    <div 
                                                        className={`${styles.dayBar} ${styles.dayBarEzam} ${isHovered ? styles.dayBarHovered : ''}`}
                                                        style={{ height: `${ezamHeight}px` }}
                                                    />
                                                )}
                                                {bazaCount > 0 && (
                                                    <div 
                                                        className={`${styles.dayBar} ${styles.dayBarBaza} ${isHovered ? styles.dayBarHovered : ''}`}
                                                        style={{ height: `${bazaHeight}px` }}
                                                    />
                                                )}
                                            </div>
                                            <span className={styles.dayLabel}>
                                                {date.split('-')[0]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                            <span className={`${styles.legendDot} ${styles.legendDotTed}`}></span>
                            <span>TED</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={`${styles.legendDot} ${styles.legendDotEzam}`}></span>
                            <span>eZamówienia</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={`${styles.legendDot} ${styles.legendDotBaza}`}></span>
                            <span>Baza Konkurencyjności</span>
                        </div>
                    </div>
                </div>
            )}
            
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

