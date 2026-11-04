import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './Tenders.module.css';

export interface FilterPopoverOption {
    key: string;
    label: string;
    /** Liczba ogłoszeń w tej opcji (przy bieżących pozostałych filtrach). */
    count: number;
    /** Kolor kropki przy nazwie (kolor statusu lub źródła). */
    color?: string;
    checked: boolean;
}

interface FilterPopoverProps {
    label: string;
    options: FilterPopoverOption[];
    onToggle: (key: string) => void;
    /** Znaczek przy etykiecie, np. liczba wybranych; brak = bez znaczka. */
    badge?: number;
    /** Dodatkowa treść pod listą (np. odnośnik "Pokaż wszystkie statusy"). */
    children?: React.ReactNode;
}

/**
 * Przycisk z listą checkboxów. Zamyka się klawiszem Escape (fokus wraca na przycisk) i kliknięciem poza panelem.
 * Opcje z licznikiem 0 są przyciemnione, ale nadal aktywne.
 */
export const FilterPopover: React.FC<FilterPopoverProps> = ({ label, options, onToggle, badge, children }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const panelId = useId();
    // Na wąskim ekranie panel wyrównany do lewej krawędzi przycisku mógłby wyjść poza ekran: wtedy kotwiczymy go z prawej
    const [alignRight, setAlignRight] = useState(false);

    useLayoutEffect(() => {
        if (!open) {
            setAlignRight(false);
            return;
        }
        const rect = panelRef.current?.getBoundingClientRect();
        if (rect && rect.right > window.innerWidth - 8) setAlignRight(true);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        const handleClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [open]);

    return (
        <div ref={containerRef} className={styles.popover}>
            <button
                ref={triggerRef}
                type="button"
                className={`${styles.popoverButton} ${open ? styles.popoverButtonOpen : ''}`}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
            >
                {label}
                {badge !== undefined && badge > 0 && <span className={styles.popoverBadge}>{badge}</span>}
                <span aria-hidden="true">▾</span>
            </button>

            {open && (
                <div
                    ref={panelRef}
                    id={panelId}
                    className={`${styles.popoverPanel} ${alignRight ? styles.popoverPanelRight : ''}`}
                    role="group"
                    aria-label={label}
                >
                    {options.map((option) => (
                        <label
                            key={option.key}
                            className={`${styles.popoverOption} ${!option.checked && option.count === 0 ? styles.popoverOptionEmpty : ''}`}
                        >
                            <input
                                type="checkbox"
                                checked={option.checked}
                                onChange={() => onToggle(option.key)}
                            />
                            {option.color && (
                                <span className={styles.popoverDot} style={{ backgroundColor: option.color }} aria-hidden="true" />
                            )}
                            <span>{option.label}</span>
                            <span className={styles.popoverCount}>{option.count}</span>
                        </label>
                    ))}
                    {children}
                </div>
            )}
        </div>
    );
};
