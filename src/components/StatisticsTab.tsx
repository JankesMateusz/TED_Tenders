import React, { useEffect, useMemo, useState } from 'react';
import { Statistics } from '../utils/calculateStatistics';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig } from '../utils/tenderSources';
import styles from './StatisticsTab.module.css';

const ACTIVITY_LABELS: Record<string, string> = {
    health: 'Zdrowie',
    'general-public-services': 'Administracja publiczna',
    defence: 'Obrona',
    'public-order-and-safety': 'Porządek i bezpieczeństwo',
    environment: 'Środowisko',
    'economic-and-financial-affairs': 'Sprawy gospodarczo-finansowe',
    'housing-and-community-amenities': 'Budownictwo i infrastruktura komunalna',
    'recreation-culture-and-religion': 'Rekreacja, kultura i religia',
    education: 'Edukacja',
    'social-protection': 'Ochrona socjalna',
    other: 'Inne'
};

const formatActivityLabel = (rawKey: string): string => {
    const normalizedKey = rawKey.toLowerCase();
    if (ACTIVITY_LABELS[normalizedKey]) {
        return ACTIVITY_LABELS[normalizedKey];
    }
    return normalizedKey
        .split('-')
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
};

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

interface StatisticsTabProps {
    statistics: Statistics;
    isDateRange: boolean;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ statistics, isDateRange }) => {
    const buyerActivityEntries = Object.entries(statistics.byBuyerActivity);
    const hasBuyerActivity = buyerActivityEntries.length > 0;
    const hourlyEntries = useMemo(
        () => Object.entries(statistics.ezamowieniaHourlyDistribution)
            .sort((a, b) => parseStatisticDate(b[0]) - parseStatisticDate(a[0])),
        [statistics.ezamowieniaHourlyDistribution]
    );
    const hourlyDates = useMemo(() => hourlyEntries.map(([date]) => date), [hourlyEntries]);
    const [selectedHourlyDate, setSelectedHourlyDate] = useState<string>(hourlyDates[0] || '');
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    useEffect(() => {
        setSelectedHourlyDate(current => {
            if (hourlyDates.length === 0) {
                return '';
            }
            return hourlyDates.includes(current) ? current : hourlyDates[0];
        });
    }, [hourlyDates]);
    const hourlyData = useMemo(() => {
        if (!selectedHourlyDate) {
            return [];
        }
        const raw = statistics.ezamowieniaHourlyDistribution[selectedHourlyDate] || [];
        return Array.from({ length: 24 }, (_, hour) => raw[hour] || 0);
    }, [statistics.ezamowieniaHourlyDistribution, selectedHourlyDate]);
    const maxHourlyValue = useMemo(() => hourlyData.reduce((max, value) => Math.max(max, value), 0), [hourlyData]);
    const totalHourlyValue = useMemo(() => hourlyData.reduce((sum, value) => sum + value, 0), [hourlyData]);
    const hasHourlyData = hourlyEntries.length > 0;
    
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
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.total}</div>
                    <div className={styles.statLabel}>Wszystkich przetargów</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: '#f39c12' }}>
                        {statistics.byStatus.favorites}
                    </div>
                    <div className={styles.statLabel}>Ulubionych</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: '#2ecc71' }}>
                        {statistics.byStatus.toBeEntered}
                    </div>
                    <div className={styles.statLabel}>Do wpisania</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: '#e74c3c' }}>
                        {statistics.deadlineStats.upcoming}
                    </div>
                    <div className={styles.statLabel}>Nadchodzących deadline</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.dateStats.today}</div>
                    <div className={styles.statLabel}>Opublikowanych dzisiaj</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.dateStats.thisWeek}</div>
                    <div className={styles.statLabel}>W tym tygodniu</div>
                </div>
            </div>
            
            <div className={styles.sectionsGrid}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Według źródła</h3>
                    <div className={styles.sourceStats}>
                        {Object.entries(statistics.bySource).map(([source, count]) => {
                            const config = getSourceConfig(source as TenderSource);
                            return (
                                <div key={source} className={styles.sourceItem}>
                                    <span 
                                        className={styles.sourceBadge}
                                        style={{
                                            backgroundColor: config.backgroundColor,
                                            color: config.color
                                        }}
                                    >
                                        {config.label}
                                    </span>
                                    <span className={styles.sourceCount}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {Object.keys(statistics.byOrderType).length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Według typu zamówienia</h3>
                        <div className={styles.orderTypeStats}>
                            {Object.entries(statistics.byOrderType).map(([type, count]) => (
                                <div key={type} className={styles.orderTypeItem}>
                                    <span className={styles.orderTypeLabel}>{type}</span>
                                    <span className={styles.orderTypeCount}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasBuyerActivity && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Według działalności zamawiającego</h3>
                        <div className={styles.orderTypeStats}>
                            {buyerActivityEntries.map(([activity, count]) => (
                                <div key={activity} className={styles.orderTypeItem}>
                                    <span className={styles.orderTypeLabel}>{formatActivityLabel(activity)}</span>
                                    <span className={styles.orderTypeCount}>{count}</span>
                                </div>
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
                                Liczba ogłoszeń opublikowanych w każdej godzinie wybranego dnia
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
                        <span>Łącznie {totalHourlyValue} ogłoszeń</span>
                    </div>
                    <div className={styles.hourlyChartScroll}>
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
                                {hourlyData.map((count, hour) => {
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
            
            <div className={styles.sectionsGrid}>
                {statistics.topCities.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Top 10 miast</h3>
                        <ul className={styles.list}>
                            {statistics.topCities.map(({ city, count }, index) => (
                                <li key={city} className={styles.listItem}>
                                    <span className={styles.listRank}>{index + 1}.</span>
                                    <span className={styles.listName}>{city}</span>
                                    <span className={styles.listCount}>{count}</span>
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
                                    <span className={styles.listRank}>{index + 1}.</span>
                                    <span className={styles.listName}>{buyer}</span>
                                    <span className={styles.listCount}>{count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

