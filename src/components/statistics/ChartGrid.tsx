import React from 'react';
import styles from '../StatisticsTab.module.css';

/** Wysokość (px) najwyższego słupka na wykresach godzinowym i dziennym. */
export const CHART_MAX_HEIGHT = 180;

const GRID_LINES = 5;

interface ChartGridProps {
    /** Klasa kontenera siatki: każdy wykres ma własne wymiary i odstępy. */
    className: string;
    /** Wartość odpowiadająca górnej linii siatki. */
    maxValue: number;
    formatLabel: (value: number) => string;
}

/** Poziome linie siatki z podpisami osi pionowej (od największej wartości do zera). */
export const ChartGrid: React.FC<ChartGridProps> = ({ className, maxValue, formatLabel }) => (
    <div className={className}>
        {[...Array(GRID_LINES)].map((_, i) => (
            <div key={i} className={styles.gridLine}>
                <span className={styles.gridLabel}>{formatLabel((maxValue * (GRID_LINES - i)) / GRID_LINES)}</span>
            </div>
        ))}
    </div>
);
