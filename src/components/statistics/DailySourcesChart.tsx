import React, { useMemo, useState } from 'react';
import { Statistics } from '../../utils/calculateStatistics';
import { TenderSource } from '../../types/TenderSource';
import { CHART_MAX_HEIGHT, ChartGrid } from './ChartGrid';
import styles from '../StatisticsTab.module.css';

interface DailySourcesChartProps {
    distribution: Statistics['dailyDistributionBySource'];
}

/** Wykres słupkowy ze stosem: liczba ogłoszeń z każdego źródła w kolejnych dniach wybranego zakresu. */
export const DailySourcesChart: React.FC<DailySourcesChartProps> = ({ distribution }) => {
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    const dailyEntries = useMemo(() => Object.entries(distribution), [distribution]);
    const maxDailyValue = useMemo(
        () =>
            dailyEntries.reduce((max, [, sources]) => {
                const total = sources[TenderSource.TED] + sources[TenderSource.E_ZAMOWIENIA] + sources[TenderSource.BAZA_KONKURENCYJNOSCI];
                return Math.max(max, total);
            }, 0),
        [dailyEntries]
    );

    // Dla jednego dnia wykres nic nie mówi (jest tylko jeden słupek)
    if (dailyEntries.length <= 1) return null;

    return (
        <div className={`${styles.section} ${styles.fullWidthSection}`}>
            <div>
                <h3 className={styles.sectionTitle}>Porównanie źródeł w czasie</h3>
                <p className={styles.chartSubtitle}>
                    Liczba ogłoszeń z TED, eZamówień i Bazy Konkurencyjności publikowanych każdego dnia
                </p>
            </div>
            <div className={styles.dailyChartScroll}>
                <div className={styles.dailyChartContainer}>
                    <ChartGrid className={styles.dailyChartGrid} maxValue={maxDailyValue} formatLabel={(value) => String(Math.round(value))} />
                    <div className={styles.dailyChart}>
                        {dailyEntries.map(([date, sources]) => {
                            const tedCount = sources[TenderSource.TED];
                            const ezamCount = sources[TenderSource.E_ZAMOWIENIA];
                            const bazaCount = sources[TenderSource.BAZA_KONKURENCYJNOSCI];
                            const total = tedCount + ezamCount + bazaCount;

                            const barHeight = (count: number) => (maxDailyValue > 0 ? (count / maxDailyValue) * CHART_MAX_HEIGHT : 0);
                            const isHovered = hoveredDay === date;
                            const hoveredClass = isHovered ? styles.dayBarHovered : '';

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
                                            {tedCount > 0 && <span className={styles.dayTooltipTed}>TED: {tedCount}</span>}
                                            {ezamCount > 0 && <span className={styles.dayTooltipEzam}>eZamówienia: {ezamCount}</span>}
                                            {bazaCount > 0 && <span className={styles.dayTooltipBaza}>Baza: {bazaCount}</span>}
                                            <span className={styles.dayTooltipTotal}>Łącznie: {total}</span>
                                        </div>
                                    )}
                                    <div className={styles.dayBarsStack}>
                                        {tedCount > 0 && (
                                            <div
                                                className={`${styles.dayBar} ${styles.dayBarTed} ${hoveredClass}`}
                                                style={{ height: `${barHeight(tedCount)}px` }}
                                            />
                                        )}
                                        {ezamCount > 0 && (
                                            <div
                                                className={`${styles.dayBar} ${styles.dayBarEzam} ${hoveredClass}`}
                                                style={{ height: `${barHeight(ezamCount)}px` }}
                                            />
                                        )}
                                        {bazaCount > 0 && (
                                            <div
                                                className={`${styles.dayBar} ${styles.dayBarBaza} ${hoveredClass}`}
                                                style={{ height: `${barHeight(bazaCount)}px` }}
                                            />
                                        )}
                                    </div>
                                    <span className={styles.dayLabel}>{date.split('-')[0]}</span>
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
    );
};
