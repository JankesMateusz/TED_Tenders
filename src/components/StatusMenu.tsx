import React, { useEffect, useRef, useState } from 'react';
import { TenderStatus } from '../types/TenderStatus';
import { STATUS_CONFIG, TENDER_STATUSES, statusAuthorCaption } from '../utils/tenderStatus';
import { MESSAGES } from '../constants';
import styles from './StatusMenu.module.css';

type Props = {
    status?: TenderStatus;
    statusByEmail?: string;
    statusAt?: Date;
    /** False, gdy statusu nie da się zmienić (kopia z "Zapisanych"): pokazujemy go tylko do odczytu. */
    editable: boolean;
    /** Wybranie aktywnego statusu usuwa go (tak samo działa toggleStatus w kontekście). */
    onToggle: (status: TenderStatus) => void;
};

/** Jeden przycisk z nazwą statusu i menu wyboru; pod spodem widać, kto i kiedy ustawił status. */
const StatusMenu: React.FC<Props> = ({ status, statusByEmail, statusAt, editable, onToggle }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    // Zamknięcie klawiszem Escape (z powrotem na przycisk) lub kliknięciem poza menu
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

    // Po otwarciu fokus trafia na aktywną pozycję (albo pierwszą), żeby dało się sterować strzałkami
    useEffect(() => {
        if (!open || !menuRef.current) return;
        const items = menuRef.current.querySelectorAll<HTMLButtonElement>('button');
        const activeIndex = status ? TENDER_STATUSES.indexOf(status) : 0;
        items[Math.max(activeIndex, 0)]?.focus();
    }, [open, status]);

    const moveFocus = (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
        const current = items.indexOf(document.activeElement as HTMLButtonElement);
        const step = event.key === 'ArrowDown' ? 1 : -1;
        items[(current + step + items.length) % items.length]?.focus();
    };

    const config = status ? STATUS_CONFIG[status] : null;
    const caption = status ? statusAuthorCaption(statusByEmail, statusAt) : null;

    if (!editable) {
        if (!config) return null;
        return (
            <div className={styles.container}>
                <span className={styles.readOnly} style={{ '--status-color': config.color } as React.CSSProperties}>
                    <span className={styles.dot} aria-hidden="true" />
                    {config.label}
                </span>
                <span className={styles.caption}>{caption}</span>
            </div>
        );
    }

    return (
        // Puste title wyłącza ewentualne podpowiedzi rodzica nad menu
        <div ref={containerRef} className={styles.container} title="">
            <button
                ref={triggerRef}
                type="button"
                className={`${styles.trigger} ${config ? styles.triggerSet : ''}`}
                style={config ? ({ '--status-color': config.color } as React.CSSProperties) : undefined}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={open}
                title={MESSAGES.SHORTCUTS_TITLE}
            >
                {config && <span className={styles.dot} aria-hidden="true" />}
                {config ? config.label : 'Status'}
                <span className={styles.chevron} aria-hidden="true">▾</span>
            </button>
            {caption && <span className={styles.caption}>{caption}</span>}

            {open && (
                <ul ref={menuRef} className={styles.menu} role="menu" onKeyDown={moveFocus}>
                    {TENDER_STATUSES.map((value) => {
                        const item = STATUS_CONFIG[value];
                        const active = status === value;
                        return (
                            <li key={value} role="none">
                                <button
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={active}
                                    className={`${styles.item} ${active ? styles.itemActive : ''}`}
                                    style={{ '--status-color': item.color } as React.CSSProperties}
                                    onClick={() => {
                                        onToggle(value);
                                        setOpen(false);
                                        triggerRef.current?.focus();
                                    }}
                                >
                                    <span className={styles.dot} aria-hidden="true" />
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                    {status && (
                        <li role="none">
                            <button
                                type="button"
                                role="menuitem"
                                className={`${styles.item} ${styles.itemClear}`}
                                onClick={() => {
                                    onToggle(status);
                                    setOpen(false);
                                    triggerRef.current?.focus();
                                }}
                            >
                                Usuń status
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default StatusMenu;
