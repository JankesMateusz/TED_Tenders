import React, { useState } from 'react';
import { Statistics } from '../../utils/calculateStatistics';
import { TREND_DAYS } from '../../utils/recentTrend';
import { pluralizeTenders } from '../../utils/pluralPl';
import type { HourlyChartData } from './types';
import { CHART_MAX_HEIGHT, ChartGrid } from './ChartGrid';
import { formatCount } from './formatCount';
import { AVERAGE_OPTION, DEFAULT_FIRST_HOUR, DEFAULT_LAST_HOUR, useHourlyChartState } from './useHourlyChartState';
import styles from '../StatisticsTab.module.css';

interface HourlyActivityChartProps {
    hourly: HourlyChartData;
    /** Rozkład godzin dni z wybranego zakresu; z niego bierzemy domyślnie wybrany (najnowszy) dzień. */
    rangeDistribution: Statistics['ezamowieniaHourlyDistribution'];
}

const hourLabel = (hour: number): string => hour.toString().padStart(2, '0');

/**
 * Godzinowa aktywność eZamówień dla wybranego dnia albo średniej z ostatnich dni. Ten sam wykres jest renderowany
 * dwa razy: poziome wiersze na wąskich ekranach i pionowe słupki na szerokich (który widać, wybiera CSS).
 * Komponent musi być zamontowany cały czas, żeby wybór dnia przetrwał chwilowy brak danych.
 */
export const HourlyActivityChart: React.FC<HourlyActivityChartProps> = ({ hourly, rangeDistribution }) => {
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);
    const {
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
    } = useHourlyChartState(hourly, rangeDistribution);

    if (!hasHourlyData) return null;

    return (
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
                    onChange={event => selectDate(event.target.value)}
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
                            ? `Średnio ${formatCount(Math.round(totalHourlyValue * 10) / 10)} dziennie${peakHour !== null ? ` · najlepsza godzina ${hourLabel(peakHour)}:00` : ''}`
                            : `Łącznie ${totalHourlyValue} ogłoszeń`)}
                </span>
            </div>
            <div className={styles.hourlyRows}>
                {visibleHours.map(({ count, hour }) => (
                    <div key={hour} className={styles.hourlyRow}>
                        <span className={styles.hourlyRowLabel}>{hourLabel(hour)}:00</span>
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
                    <ChartGrid
                        className={styles.hourlyChartGrid}
                        maxValue={maxHourlyValue}
                        formatLabel={(value) => formatCount(Math.round(value * 10) / 10)}
                    />
                    <div className={styles.hourlyChart}>
                        {visibleHours.map(({ count, hour }) => {
                            const height = maxHourlyValue > 0 ? (count / maxHourlyValue) * CHART_MAX_HEIGHT : 0;
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
                                            <strong>{hourLabel(hour)}:00</strong>
                                            <span>
                                                {isAverageSelected
                                                    ? `średnio ${formatCount(count)} dziennie`
                                                    : `${count} ${pluralizeTenders(count)}`}
                                            </span>
                                            {/* count > 0 gwarantuje totalHourlyValue > 0, więc dzielenie jest bezpieczne */}
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
                                        {hourLabel(hour)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
