import React from 'react';
import styles from '../StatisticsTab.module.css';

/** Pasek udziału: jaka część całości przypada na daną pozycję. */
export const ShareBar: React.FC<{ count: number; total: number }> = ({ count, total }) => (
    <span className={styles.shareTrack} aria-hidden="true">
        <span className={styles.shareBar} style={{ width: `${total > 0 ? Math.min(100, (count / total) * 100) : 0}%` }} />
    </span>
);

export interface RankedListItem {
    key: string;
    name: string;
    count: number;
}

interface RankedListProps {
    items: RankedListItem[];
    /** Pokazuje numer pozycji ("1.", "2." ...). */
    showRank?: boolean;
    /** Gdy podane, każda pozycja ma pasek udziału względem tej sumy. */
    shareTotal?: number;
    /** Gdy podane, pozycje są przyciskami; bez tego są zwykłymi wierszami. */
    onSelect?: (key: string) => void;
}

/** Lista "nazwa + licznik" z opcjonalnym numerem, paskiem udziału i kliknięciem (np. do filtrowania listy przetargów). */
export const RankedList: React.FC<RankedListProps> = ({ items, showRank = false, shareTotal, onSelect }) => (
    <ul className={styles.list}>
        {items.map(({ key, name, count }, index) => {
            const content = (
                <>
                    {showRank && <span className={styles.listRank}>{index + 1}.</span>}
                    <span className={styles.listName}>{name}</span>
                    <span className={styles.listCount}>{count}</span>
                    {shareTotal !== undefined && <ShareBar count={count} total={shareTotal} />}
                </>
            );
            return (
                <li key={key} className={styles.listItem}>
                    {onSelect ? (
                        <button
                            type="button"
                            className={`${styles.listButton} ${styles.clickable}`}
                            onClick={() => onSelect(key)}
                        >
                            {content}
                        </button>
                    ) : (
                        <div className={styles.listRow}>{content}</div>
                    )}
                </li>
            );
        })}
    </ul>
);
