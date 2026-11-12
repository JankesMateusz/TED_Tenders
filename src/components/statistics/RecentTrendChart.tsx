import React, { useMemo } from 'react';
import { TREND_DAYS, TrendPoint } from '../../utils/recentTrend';
import { dayToDisplayDate } from '../../utils/dateUtils';
import styles from '../StatisticsTab.module.css';

/** Wysokość (px) najwyższego słupka trendu. */
const TREND_BAR_MAX_HEIGHT = 100;

interface RecentTrendChartProps {
    /** Nowe ogłoszenia z ostatnich dni, po tych samych filtrach co statystyki (poza zakresem dat). */
    trend: { points: TrendPoint[]; error: string | null };
}

/** Słupki z liczbą ogłoszeń opublikowanych w każdym z ostatnich dni, niezależnie od wybranego zakresu dat. */
export const RecentTrendChart: React.FC<RecentTrendChartProps> = ({ trend }) => {
    const maxTrendValue = useMemo(() => trend.points.reduce((max, point) => Math.max(max, point.count), 0), [trend.points]);

    return (
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
    );
};
