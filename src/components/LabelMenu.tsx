import React, { useEffect, useRef, useState } from 'react';
import { TenderLabel } from '../types/TenderLabel';
import { LABEL_CONFIG, TENDER_LABELS } from '../utils/tenderLabels';
import styles from './StatusMenu.module.css';

type Props = {
    labels: TenderLabel[];
    /** False, gdy etykiet nie da się zmienić (kopia z "Zapisanych"): wtedy menu się nie pokazuje. */
    editable: boolean;
    onToggle: (label: TenderLabel) => void;
};

/** Przycisk "Etykiety" z menu wielokrotnego wyboru. Menu zostaje otwarte po kliknięciu, żeby dało się zaznaczyć kilka. */
const LabelMenu: React.FC<Props> = ({ labels, editable, onToggle }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

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

    useEffect(() => {
        if (open) menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    }, [open]);

    const moveFocus = (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
        const current = items.indexOf(document.activeElement as HTMLButtonElement);
        const step = event.key === 'ArrowDown' ? 1 : -1;
        items[(current + step + items.length) % items.length]?.focus();
    };

    if (!editable) return null;

    return (
        <div ref={containerRef} className={styles.container} title="">
            <button
                ref={triggerRef}
                type="button"
                className={`${styles.trigger} ${labels.length > 0 ? styles.triggerSet : ''}`}
                style={labels.length > 0 ? ({ '--status-color': 'var(--border-color)' } as React.CSSProperties) : undefined}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                Etykiety{labels.length > 0 ? ` (${labels.length})` : ''}
                <span className={styles.chevron} aria-hidden="true">▾</span>
            </button>

            {open && (
                <ul ref={menuRef} className={styles.menu} role="menu" onKeyDown={moveFocus}>
                    {TENDER_LABELS.map((value) => {
                        const item = LABEL_CONFIG[value];
                        const active = labels.includes(value);
                        return (
                            <li key={value} role="none">
                                <button
                                    type="button"
                                    role="menuitemcheckbox"
                                    aria-checked={active}
                                    className={`${styles.item} ${active ? styles.itemActive : ''}`}
                                    style={{ '--status-color': item.color } as React.CSSProperties}
                                    onClick={() => onToggle(value)}
                                >
                                    <span className={styles.dot} aria-hidden="true" />
                                    {item.label}
                                    {active && <span aria-hidden="true"> ✓</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default LabelMenu;
