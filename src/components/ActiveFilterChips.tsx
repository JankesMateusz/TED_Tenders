import React from 'react';
import { ActiveFilterChip } from '../utils/activeFilters';
import { MESSAGES } from '../constants';
import styles from './Tenders.module.css';

interface ActiveFilterChipsProps {
    chips: ActiveFilterChip[];
    onRemove: (chip: ActiveFilterChip) => void;
    /** Czy cokolwiek zawęża listę (także fraza wyszukiwania i domyślna kolejka); steruje przyciskiem czyszczenia. */
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    /** Czy widać domyślną kolejkę (tylko nieocenione); wtedy pierwszy chip to mówi, a jego ✕ pokazuje też ocenione. */
    queueActive?: boolean;
    onShowRated?: () => void;
}

const CloseIcon: React.FC = () => (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
);

/** Jeden rząd chipów z tym, co zawęża listę, plus "Wyczyść filtry". Zmiany są zapowiadane czytnikom ekranu (aria-live). */
export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({ chips, onRemove, hasActiveFilters, onClearFilters, queueActive, onShowRated }) => (
    <div className={styles.activeChips} aria-live="polite">
        {queueActive && onShowRated && (
            <span className={styles.activeChip} title={MESSAGES.QUEUE_CHIP_TITLE}>
                {MESSAGES.QUEUE_CHIP}
                <button
                    type="button"
                    className={styles.activeChipRemove}
                    onClick={onShowRated}
                    aria-label="Pokaż też ocenione ogłoszenia"
                    title="Pokaż też ocenione"
                >
                    <CloseIcon />
                </button>
            </span>
        )}
        {chips.map((chip) => (
            <span key={chip.id} className={styles.activeChip}>
                {chip.label}
                <button
                    type="button"
                    className={styles.activeChipRemove}
                    onClick={() => onRemove(chip)}
                    aria-label={`Usuń filtr: ${chip.label}`}
                    title="Usuń filtr"
                >
                    <CloseIcon />
                </button>
            </span>
        ))}
        {hasActiveFilters && (
            <button type="button" className={styles.clearFiltersButton} onClick={onClearFilters}>
                Wyczyść filtry
            </button>
        )}
    </div>
);
