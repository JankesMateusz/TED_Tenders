import React, { useEffect, useId, useRef, useState } from 'react';
import { SortOrder } from '../utils/tenderFilters';
import { FilterPopoverOption } from './FilterPopover';
import tenders from './Tenders.module.css';
import styles from './FiltersSheet.module.css';

export interface FilterSheetGroup {
    key: string;
    label: string;
    options: FilterPopoverOption[];
    onToggle: (key: string) => void;
    /** Dodatkowy odnośnik pod grupą (np. "Pokaż wszystkie statusy"). */
    footerAction?: { label: string; onClick: () => void };
}

interface FiltersSheetProps {
    groups: FilterSheetGroup[];
    /** Ile filtrów zawęża listę (chipy pod paskiem); 0 = brak znaczka. */
    activeCount: number;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    sortOrder: SortOrder;
    sortOptions: Array<{ value: SortOrder; label: string }>;
    onSortOrderChange: (order: SortOrder) => void;
    hiddenAdvertisersCount: number;
    showHiddenAdvertisers: boolean;
    onShowHiddenAdvertisersChange: (show: boolean) => void;
}

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]';

/**
 * Telefon: jeden przycisk "Filtry" zamiast pięciu menu, przełącznika i sortowania. Otwiera arkusz od dołu ekranu
 * ze wszystkimi grupami filtrów i sortowaniem na jednej liście; na komputerze zostaje zwykły pasek narzędzi.
 */
export const FiltersSheet: React.FC<FiltersSheetProps> = ({
    groups,
    activeCount,
    hasActiveFilters,
    onClearFilters,
    sortOrder,
    sortOptions,
    onSortOrderChange,
    hiddenAdvertisersCount,
    showHiddenAdvertisers,
    onShowHiddenAdvertisersChange
}) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const sortId = useId();

    const close = () => {
        setOpen(false);
        triggerRef.current?.focus();
    };

    // Za arkuszem strona się nie przewija; fokus trafia do arkusza, żeby czytnik ekranu i klawiatura zaczynały od niego
    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialogRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            close();
            return;
        }
        if (event.key !== 'Tab' || !dialogRef.current) return;
        // Tab krąży w obrębie arkusza
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === dialogRef.current)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    };

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                className={`${tenders.popoverButton} ${open ? tenders.popoverButtonOpen : ''}`}
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label={activeCount > 0 ? `Filtry, aktywne: ${activeCount}` : 'Filtry'}
            >
                Filtry
                {activeCount > 0 && <span className={tenders.popoverBadge} aria-hidden="true">{activeCount}</span>}
            </button>

            {open && (
                <>
                    <div className={styles.backdrop} onClick={close} aria-hidden="true" />
                    <div
                        ref={dialogRef}
                        className={styles.sheet}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        tabIndex={-1}
                        onKeyDown={handleKeyDown}
                    >
                        <div className={styles.head}>
                            <h2 id={titleId} className={styles.title}>Filtry</h2>
                            <button type="button" className={styles.close} onClick={close}>Zamknij</button>
                        </div>

                        <div className={styles.body}>
                            {groups.map((group) => (
                                <fieldset key={group.key} className={styles.group}>
                                    <legend className={styles.legend}>{group.label}</legend>
                                    {group.options.map((option) => (
                                        <label
                                            key={option.key}
                                            className={`${styles.option} ${!option.checked && option.count === 0 ? styles.optionEmpty : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={option.checked}
                                                onChange={() => group.onToggle(option.key)}
                                            />
                                            {option.color && (
                                                <span className={styles.dot} style={{ backgroundColor: option.color }} aria-hidden="true" />
                                            )}
                                            <span>{option.label}</span>
                                            <span className={styles.count}>{option.count}</span>
                                        </label>
                                    ))}
                                    {group.footerAction && (
                                        <button type="button" className={styles.groupAction} onClick={group.footerAction.onClick}>
                                            {group.footerAction.label}
                                        </button>
                                    )}
                                </fieldset>
                            ))}

                            {(hiddenAdvertisersCount > 0 || showHiddenAdvertisers) && (
                                <label className={`${tenders.plainCheckbox} ${styles.toggleRow}`}>
                                    <input
                                        type="checkbox"
                                        checked={showHiddenAdvertisers}
                                        onChange={(e) => onShowHiddenAdvertisersChange(e.target.checked)}
                                    />
                                    <span>
                                        Pokaż ukrytych zamawiających ({hiddenAdvertisersCount})
                                        <span className={tenders.plainCheckboxHint}> – z Bazy Konkurencyjności</span>
                                    </span>
                                </label>
                            )}

                            <div className={styles.sortRow}>
                                <label className={styles.legend} htmlFor={sortId}>Sortuj</label>
                                <select
                                    id={sortId}
                                    className={styles.sortSelect}
                                    value={sortOrder}
                                    onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
                                >
                                    {sortOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.foot}>
                            {hasActiveFilters && (
                                <button type="button" className={styles.clear} onClick={onClearFilters}>
                                    Wyczyść filtry
                                </button>
                            )}
                            <button type="button" className={styles.done} onClick={close}>Gotowe</button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
