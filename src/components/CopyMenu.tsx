import React, { useEffect, useRef, useState } from 'react';
import styles from './StatusMenu.module.css';

export type CopyItem = {
    key: string;
    label: string;
    value: string;
    /** Wersja HTML trafia do schowka obok zwykłego tekstu; edytory z obsługą HTML wkleją z niej klikalne linki. */
    html?: string;
};

const copyToClipboard = async (item: CopyItem): Promise<void> => {
    if (item.html && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/plain': new Blob([item.value], { type: 'text/plain' }),
                    'text/html': new Blob([item.html], { type: 'text/html' }),
                }),
            ]);
            return;
        } catch {
            // Przeglądarka odrzuciła zapis HTML: kopiujemy sam tekst
        }
    }
    await navigator.clipboard.writeText(item.value);
};

type Props = {
    items: CopyItem[];
};

const MoreIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
    </svg>
);

/** Przycisk "trzy kropki" z menu kopiowania danych przetargu do schowka. */
const CopyMenu: React.FC<Props> = ({ items }) => {
    const [open, setOpen] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const closeTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(closeTimer.current), []);

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
        menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [open]);

    const moveFocus = (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const step = event.key === 'ArrowDown' ? 1 : -1;
        buttons[(current + step + buttons.length) % buttons.length]?.focus();
    };

    const copy = async (item: CopyItem) => {
        try {
            await copyToClipboard(item);
        } catch {
            return;
        }
        setCopiedKey(item.key);
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => {
            setOpen(false);
            setCopiedKey(null);
            triggerRef.current?.focus();
        }, 700);
    };

    return (
        <div ref={containerRef} className={styles.container}>
            <button
                ref={triggerRef}
                type="button"
                className={styles.moreButton}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Więcej akcji"
                title="Kopiuj…"
            >
                <MoreIcon />
            </button>

            {open && (
                <ul ref={menuRef} className={`${styles.menu} ${styles.menuRight}`} role="menu" onKeyDown={moveFocus}>
                    {items.map((item) => (
                        <li key={item.key} role="none">
                            <button type="button" role="menuitem" className={styles.item} onClick={() => copy(item)}>
                                {copiedKey === item.key ? 'Skopiowano ✓' : item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CopyMenu;
