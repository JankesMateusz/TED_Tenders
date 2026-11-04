import React, { useEffect, useMemo, useState } from 'react';
import { Statistics } from '../utils/calculateStatistics';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig } from '../utils/tenderSources';
import { STATUS_CONFIG, TENDER_STATUSES, UNMARKED_COLOR } from '../utils/tenderStatus';
import { TenderStatus } from '../types/TenderStatus';
import { OrderType, getOrderTypeConfig } from '../utils/tenderSources';
import { getCpvName } from '../utils/cpvMapping';
import { CpvCategoryKey } from '../utils/cpvCategories';
import { TREND_DAYS, TrendPoint } from '../utils/recentTrend';
import { dayToDisplayDate } from '../utils/dateUtils';
import { buildStatusFunnel } from '../utils/statusFunnel';
import { formatDelta } from '../utils/comparison';
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

/** Wysokość (px) najwyższego słupka trendu. */
const TREND_BAR_MAX_HEIGHT = 100;

/** Pasek udziału: jaka część całości przypada na daną pozycję. */
const ShareBar: React.FC<{ count: number; total: number }> = ({ count, total }) => (
    <span className={styles.shareTrack} aria-hidden="true">
        <span className={styles.shareBar} style={{ width: `${total > 0 ? Math.min(100, (count / total) * 100) : 0}%` }} />
    </span>
);

/** Dane wykresu godzinowego eZamówień: dni do wyboru (DD-MM-RRRR, od najnowszego) i rozkład godzin po dniach. */
export interface HourlyChartData {
    days: string[];
    distribution: Record<string, number[]>;
    /** Wybrany dzień jest spoza zakresu dat i jego przetargi są jeszcze wczytywane. */
    isLoading: boolean;
    error: string | null;
    /** Woła komponent po każdej zmianie wybranego dnia, żeby rodzic doczytał dzień spoza zakresu. */
    onSelectDay: (day: string) => void;
}

const FUNNEL_COLLAPSED_KEY = 'statistics.funnelCollapsed';

const readFunnelCollapsed = (): boolean => {
    try {
        return window.localStorage.getItem(FUNNEL_COLLAPSED_KEY) === 'true';
    } catch {
        // localStorage bywa zablokowany (tryb prywatny); sekcja jest wtedy po prostu rozwinięta
        return false;
    }
};

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
    const [funnelCollapsed, setFunnelCollapsed] = useState<boolean>(readFunnelCollapsed);
    const toggleFunnel = () => {
        const next = !funnelCollapsed;
        setFunnelCollapsed(next);
        try {
            window.localStorage.setItem(FUNNEL_COLLAPSED_KEY, String(next));
        } catch {
            // brak możliwości zapisu: zwinięcie działa tylko do odświeżenia strony
        }
    };
    const funnelRows = useMemo(
        () => buildStatusFunnel(statistics.total, statistics.byStatus),
        [statistics.total, statistics.byStatus]
    );
    const hourlyDates = hourly.days;
    // Domyślnie najnowszy dzień z wybranego zakresu; inne dni z bazy użytkownik wybiera sam
    const newestRangeDate = useMemo(
        () => Object.keys(statistics.ezamowieniaHourlyDistribution)
            .sort((a, b) => parseStatisticDate(b) - parseStatisticDate(a))[0] || '',
        [statistics.ezamowieniaHourlyDistribution]
    );
    const [selectedHourlyDate, setSelectedHourlyDate] = useState<string>(newestRangeDate);
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    useEffect(() => {
        setSelectedHourlyDate(current => (hourlyDates.includes(current) ? current : newestRangeDate));
    }, [hourlyDates, newestRangeDate]);
    const { onSelectDay } = hourly;
    useEffect(() => {
        onSelectDay(selectedHourlyDate);
    }, [onSelectDay, selectedHourlyDate]);
    const hourlyData = useMemo(() => {
        if (!selectedHourlyDate) {
            return [];
        }
        const raw = hourly.distribution[selectedHourlyDate] || [];
        return Array.from({ length: 24 }, (_, hour) => raw[hour] || 0);
    }, [hourly.distribution, selectedHourlyDate]);
    const maxHourlyValue = useMemo(() => hourlyData.reduce((max, value) => Math.max(max, value), 0), [hourlyData]);
    const totalHourlyValue = useMemo(() => hourlyData.reduce((sum, value) => sum + value, 0), [hourlyData]);
    const hasHourlyData = hourlyDates.length > 0;
    const visibleHours = useMemo(() => {
        const active = hourlyData.flatMap((count, hour) => (count > 0 ? [hour] : []));
        const first = Math.min(DEFAULT_FIRST_HOUR, ...active);
        const last = Math.max(DEFAULT_LAST_HOUR, ...active);
        return hourlyData.map((count, hour) => ({ count, hour })).filter(({ hour }) => hour >= first && hour <= last);
    }, [hourlyData]);
    const maxTrendValue = useMemo(() => trend.points.reduce((max, point) => Math.max(max, point.count), 0), [trend.points]);
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
            {hasActiveFilters && (
                <div className={styles.filterNotice} role="status">
                    <span>Statystyki dotyczą przefiltrowanej listy (aktywne są filtry).</span>
                    <button type="button" onClick={onClearFilters}>Wyczyść filtry</button>
                </div>
            )}
            {comparison && (
                <div className={styles.comparisonNotice} role="status">
                    {comparison.status === 'unavailable' && <span>Porównanie niedostępne: {comparison.reason}</span>}
                    {comparison.status === 'loading' && <span>Wczytywanie danych do porównania...</span>}
                    {comparison.status === 'missing' && (
                        <>
                            <span>
                                Porównanie z: <strong>{comparison.label}</strong>. Brakuje kompletnych danych z tego okresu,
                                więc liczby byłyby zaniżone.
                                {comparison.error && <> {comparison.error}</>}
                            </span>
                            <button type="button" onClick={comparison.onFetch} disabled={comparison.isFetching}>
                                {comparison.isFetching ? 'Pobieranie...' : 'Pobierz dane z tego okresu'}
                            </button>
                        </>
                    )}
                    {comparison.status === 'ready' && (
                        <span>
                            Zmiana względem: <strong>{comparison.label}</strong>
                            {comparison.isCurrentPeriodOngoing && '. Bieżący okres jeszcze trwa, więc pokazujemy liczby z poprzedniego okresu zamiast różnicy.'}
                        </span>
                    )}
                </div>
            )}

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
                <button
                    type="button"
                    className={`${styles.statCard} ${styles.statCardPrimary} ${styles.clickable} ${statistics.byStatus.unmarked === 0 ? styles.statCardZero : ''}`}
                    onClick={() => onDrillDown({ kind: 'status', status: 'unmarked' })}
                >
                    <div className={styles.statValue}>{statistics.byStatus.unmarked}</div>
                    {renderDelta(statistics.byStatus.unmarked, previous?.byStatus.unmarked)}
                    <div className={styles.statLabel}>Do przejrzenia</div>
                </button>

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
            
            <div className={`${styles.section} ${styles.fullWidthSection} ${styles.desktopOnly}`}>
                <div className={styles.collapsibleHeader}>
                    <h3 className={styles.sectionTitle}>Postęp przeglądania</h3>
                    <button
                        type="button"
                        className={styles.collapseButton}
                        onClick={toggleFunnel}
                        aria-expanded={!funnelCollapsed}
                        aria-label={funnelCollapsed ? 'Rozwiń sekcję Postęp przeglądania' : 'Zwiń sekcję Postęp przeglądania'}
                        title={funnelCollapsed ? 'Rozwiń' : 'Zwiń'}
                    >
                        {funnelCollapsed ? '+' : '−'}
                    </button>
                </div>
                {!funnelCollapsed && (
                <>
                <p className={styles.chartSubtitle}>
                    Ile przetargów z listy ma już status, a ile czeka na przejrzenie. Udziały liczone względem wszystkich przetargów.
                </p>
                <div className={styles.funnel}>
                    {funnelRows.map(({ key, count, percent }) => {
                        const isStatus = key !== 'total' && key !== 'reviewed';
                        const label = key === 'total' ? 'Wszystkie przetargi'
                            : key === 'reviewed' ? 'Ze statusem'
                            : key === 'unmarked' ? 'Bez statusu (do przejrzenia)'
                            : STATUS_CONFIG[key].label;
                        const color = key === 'total' || key === 'reviewed' ? 'var(--button-primary)'
                            : key === 'unmarked' ? UNMARKED_COLOR
                            : STATUS_CONFIG[key].color;
                        const content = (
                            <>
                                <span className={styles.funnelLabel}>{label}</span>
                                <span className={styles.funnelTrack}>
                                    <span className={styles.funnelBar} style={{ width: `${percent}%`, backgroundColor: color }} />
                                </span>
                                <span className={styles.funnelValue}>{count} <small>({percent}%)</small></span>
                            </>
                        );
                        return isStatus ? (
                            <button
                                key={key}
                                type="button"
                                className={`${styles.funnelRow} ${styles.clickable}`}
                                onClick={() => onDrillDown({ kind: 'status', status: key })}
                            >
                                {content}
                            </button>
                        ) : (
                            <div key={key} className={styles.funnelRow}>{content}</div>
                        );
                    })}
                </div>
                </>
                )}
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

            {statistics.byCpvCategory.length > 0 && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h3 className={styles.sectionTitle}>Co jest zamawiane</h3>
                    <p className={styles.chartSubtitle}>
                        Liczba przetargów z kodem CPV z danej kategorii. Przetarg może mieć kody z kilku kategorii, więc sumy się nie dodają.
                    </p>
                    <ul className={styles.list}>
                        {statistics.byCpvCategory.map(({ key, label, count }) => (
                            <li key={key} className={styles.listItem}>
                                <button
                                    type="button"
                                    className={`${styles.listButton} ${styles.clickable}`}
                                    onClick={() => onDrillDown({ kind: 'cpvCategory', category: key })}
                                >
                                    <span className={styles.listName}>{label}</span>
                                    <span className={styles.listCount}>{count}</span>
                                    <ShareBar count={count} total={statistics.total} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {statistics.byReviewer.length > 0 && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h3 className={styles.sectionTitle}>Kto ocenia</h3>
                    <p className={styles.chartSubtitle}>
                        Przetargi według osoby, która ustawiła obecny status (przy zmianie statusu liczy się ostatnia osoba).
                    </p>
                    <ul className={styles.list}>
                        {statistics.byReviewer.map(({ reviewer, count }) => (
                            <li key={reviewer} className={styles.listItem}>
                                <div className={styles.listRow}>
                                    <span className={styles.listName}>{reviewer}</span>
                                    <span className={styles.listCount}>{count}</span>
                                    <ShareBar count={count} total={reviewedTotal} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={`${styles.section} ${styles.fullWidthSection}`}>
                <h3 className={styles.sectionTitle}>Nowe ogłoszenia, ostatnie {TREND_DAYS} dni</h3>
                <p className={styles.chartSubtitle}>
                    Liczba ogłoszeń opublikowanych każdego dnia, bez względu na wybrany zakres dat. Kreskowany słupek oznacza dzień, którego dane mogą być niekompletne.
                </p>
                {trend.error ? (
                    <p className={styles.chartSubtitle}>{trend.error}</p>
                ) : (
                    <ol className={styles.trendChart} aria-label={`Nowe ogłoszenia w ostatnich ${TREND_DAYS} dniach`}>
                        {trend.points.map(({ day, count, complete }) => {
                            const label = dayToDisplayDate(day);
                            const height = maxTrendValue > 0 ? (count / maxTrendValue) * TREND_BAR_MAX_HEIGHT : 0;
                            return (
                                <li
                                    key={day}
                                    className={styles.trendColumn}
                                    title={`${label}: ${count}${complete ? '' : ' (dane mogą być niekompletne)'}`}
                                >
                                    <span className={styles.trendCount}>{count > 0 ? count : ''}</span>
                                    <span
                                        className={`${styles.trendBar} ${complete ? '' : styles.trendBarIncomplete}`}
                                        style={{ height: `${Math.max(height, 2)}px` }}
                                    />
                                    <span className={styles.trendDay}>{label.slice(0, 2)}</span>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>

            {hasHourlyData && (
                <div className={`${styles.section} ${styles.fullWidthSection}`}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3 className={styles.sectionTitle}>Godzinowa aktywność eZamówienia</h3>
                            <p className={styles.chartSubtitle}>
                                Liczba ogłoszeń opublikowanych w każdej godzinie wybranego dnia ({DEFAULT_FIRST_HOUR}:00–{DEFAULT_LAST_HOUR}:59, inne godziny tylko gdy coś w nich opublikowano)
                            </p>
                        </div>
                        <select
                            className={styles.chartSelect}
                            value={selectedHourlyDate}
                            onChange={event => setSelectedHourlyDate(event.target.value)}
                        >
                            {hourlyDates.map(date => (
                                <option key={date} value={date}>
                                    {date}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.chartSummary}>
                        <span>Wybrany dzień: <strong>{selectedHourlyDate}</strong></span>
                        <span>
                            {hourly.isLoading
                                ? 'Wczytywanie…'
                                : hourly.error ?? `Łącznie ${totalHourlyValue} ogłoszeń`}
                        </span>
                    </div>
                    <div className={styles.hourlyRows}>
                        {visibleHours.map(({ count, hour }) => (
                            <div key={hour} className={styles.hourlyRow}>
                                <span className={styles.hourlyRowLabel}>{hour.toString().padStart(2, '0')}:00</span>
                                <span className={styles.hourlyRowTrack}>
                                    <span
                                        className={styles.hourlyRowBar}
                                        style={{ width: maxHourlyValue > 0 ? `${(count / maxHourlyValue) * 100}%` : 0 }}
                                    />
                                </span>
                                <span className={styles.hourlyRowCount}>{count > 0 ? count : ''}</span>
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.hourlyChartScroll} ${styles.hourlyChartVertical}`}>
                        <div className={styles.hourlyChartContainer}>
                            <div className={styles.hourlyChartGrid}>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={styles.gridLine}>
                                        <span className={styles.gridLabel}>
                                            {Math.round((maxHourlyValue * (5 - i)) / 5)}
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
                                                    {count}
                                                </span>
                                            )}
                                            {isHovered && count > 0 && (
                                                <div className={styles.hourTooltip}>
                                                    <strong>{hour.toString().padStart(2, '0')}:00</strong>
                                                    <span>{count} {count === 1 ? 'ogłoszenie' : count < 5 ? 'ogłoszenia' : 'ogłoszeń'}</span>
                                                    <span>{((count / totalHourlyValue) * 100).toFixed(1)}%</span>
                                                </div>
                                            )}
                                            <div 
                                                className={`${styles.hourBar} ${isHovered ? styles.hourBarHovered : ''}`}
                                                style={{ 
                                                    height: `${height}px`,
                                                    opacity: count > 0 ? 0.6 + intensity * 0.4 : 0
                                                }}
                                            />
                                            <span className={styles.hourLabel}>
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
                                                        <span style={{ color: '#e67e22' }}>
                                                            TED: {tedCount}
                                                        </span>
                                                    )}
                                                    {ezamCount > 0 && (
                                                        <span style={{ color: '#3498db' }}>
                                                            eZamówienia: {ezamCount}
                                                        </span>
                                                    )}
                                                    {bazaCount > 0 && (
                                                        <span style={{ color: '#9b59b6' }}>
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
                    <ul className={styles.list}>
                        {statistics.topCpvCodes.map(({ code, count }, index) => (
                            <li key={code} className={styles.listItem}>
                                <button
                                    type="button"
                                    className={`${styles.listButton} ${styles.clickable}`}
                                    onClick={() => onDrillDown({ kind: 'cpv', code })}
                                >
                                    <span className={styles.listRank}>{index + 1}.</span>
                                    <span className={styles.listName}>{getCpvName(code)} ({code})</span>
                                    <span className={styles.listCount}>{count}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.sectionsGrid}>
                {statistics.topCities.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Top 10 miast</h3>
                        <ul className={styles.list}>
                            {statistics.topCities.map(({ city, count }, index) => (
                                <li key={city} className={styles.listItem}>
                                    <button
                                        type="button"
                                        className={`${styles.listButton} ${styles.clickable}`}
                                        onClick={() => onDrillDown({ kind: 'city', city })}
                                    >
                                        <span className={styles.listRank}>{index + 1}.</span>
                                        <span className={styles.listName}>{city}</span>
                                        <span className={styles.listCount}>{count}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {statistics.topBuyers.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Top 10 zamawiających</h3>
                        <ul className={styles.list}>
                            {statistics.topBuyers.map(({ buyer, count }, index) => (
                                <li key={buyer} className={styles.listItem}>
                                    <button
                                        type="button"
                                        className={`${styles.listButton} ${styles.clickable}`}
                                        onClick={() => onDrillDown({ kind: 'buyer', buyer })}
                                    >
                                        <span className={styles.listRank}>{index + 1}.</span>
                                        <span className={styles.listName}>{buyer}</span>
                                        <span className={styles.listCount}>{count}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

