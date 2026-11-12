import React from 'react';
import { formatDelta } from '../../utils/comparison';
import styles from '../StatisticsTab.module.css';

interface DeltaBadgeProps {
    current: number;
    /** Wartość z poprzedniego okresu; `undefined`, gdy porównanie nie jest dostępne (wtedy nic nie rysujemy). */
    previous: number | undefined;
    /** Bieżący okres jeszcze trwa, więc jego liczby są niepełne. */
    isPeriodOngoing: boolean;
}

/**
 * Zmiana względem poprzedniego okresu. Dopóki bieżący okres trwa, jego liczby są niepełne i różnica względem
 * całego poprzedniego okresu byłaby prawie zawsze ujemna, więc pokazujemy samą wartość z poprzedniego okresu.
 */
export const DeltaBadge: React.FC<DeltaBadgeProps> = ({ current, previous, isPeriodOngoing }) => {
    if (previous === undefined) return null;
    if (isPeriodOngoing) {
        return (
            <span className={styles.delta} title="Bieżący okres jeszcze trwa, więc różnica byłaby zaniżona">
                poprzednio: {previous}
            </span>
        );
    }
    return <span className={styles.delta} title={`Poprzednio: ${previous}`}>{formatDelta(current, previous)}</span>;
};
