import React, { useEffect, useId, useRef, useState } from 'react';
import { APP_MODULES, AppModule, ModuleId, enabledModules, navigateToModule } from '../modules';
import styles from './ModuleMenu.module.css';

interface Props {
    /** Moduł, w którym jesteśmy (zaznaczony na liście). */
    current: ModuleId;
    /** Lista modułów; domyślnie rejestr aplikacji (parametr ułatwia testy). */
    modules?: AppModule[];
}

const MenuIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
        <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

/**
 * Menu "hamburger" z listą modułów aplikacji. Zachowuje się jak pozostałe rozwijane menu (zamknięcie klawiszem Escape
 * albo kliknięciem obok, strzałki między pozycjami). Gdy użytkownik ma dostęp do jednego modułu, nic nie renderuje,
 * więc przy wyłączonych modułach dodatkowych nagłówek wygląda jak dotąd.
 */
const ModuleMenu: React.FC<Props> = ({ current, modules = APP_MODULES }) => {
    const available = enabledModules(modules);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const menuId = useId();

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
        // Fokus na bieżącym module (a jeśli go nie ma, na pierwszej pozycji)
        const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [];
        (menuRef.current?.querySelector<HTMLButtonElement>('[aria-current="page"]') ?? items[0])?.focus();
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [open]);

    if (available.length < 2) return null;

    const moveFocus = (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        let next: number;
        if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else next = (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next]?.focus();
    };

    const select = (module: AppModule) => {
        setOpen(false);
        if (module.id !== current) navigateToModule(module);
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <button
                ref={triggerRef}
                type="button"
                className={styles.trigger}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                aria-label="Menu modułów"
                title="Menu modułów"
                onClick={() => setOpen((value) => !value)}
            >
                <MenuIcon />
            </button>
            {open && (
                <ul id={menuId} role="menu" aria-label="Moduły aplikacji" className={styles.menu} ref={menuRef} onKeyDown={moveFocus}>
                    {available.map((module) => {
                        const isCurrent = module.id === current;
                        return (
                            <li key={module.id} role="none">
                                <button
                                    type="button"
                                    role="menuitem"
                                    aria-current={isCurrent ? 'page' : undefined}
                                    className={`${styles.item} ${isCurrent ? styles.itemCurrent : ''}`}
                                    onClick={() => select(module)}
                                >
                                    {module.label}
                                    {isCurrent && <span className={styles.check} aria-hidden="true">✓</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ModuleMenu;
