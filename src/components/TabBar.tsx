import React, { useRef } from 'react';

export interface TabItem<T extends string> {
    id: T;
    label: React.ReactNode;
}

interface TabBarProps<T extends string> {
    tabs: TabItem<T>[];
    activeId: T;
    onChange: (id: T) => void;
    /** Prefiks identyfikatorów: tabId(prefiks, id) i panelId(prefiks) służą do powiązania z panelem. */
    idPrefix: string;
    ariaLabel: string;
    className?: string;
    tabClassName?: string;
    activeTabClassName?: string;
}

export const tabId = (prefix: string, id: string): string => `${prefix}-tab-${id}`;
export const panelId = (prefix: string): string => `${prefix}-panel`;

/**
 * Zakładki zgodne ze wzorcem WAI-ARIA: role tablist/tab, aria-selected, jeden element w kolejności Tab
 * (pozostałe osiągalne strzałkami), Home i End skaczą na pierwszą i ostatnią. Zakładka aktywuje się
 * od razu po przesunięciu fokusu, bo przełączenie jest tanie.
 */
function TabBar<T extends string>({
    tabs,
    activeId,
    onChange,
    idPrefix,
    ariaLabel,
    className,
    tabClassName,
    activeTabClassName
}: TabBarProps<T>) {
    const buttons = useRef<Array<HTMLButtonElement | null>>([]);

    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
        let next: number;
        switch (event.key) {
            case 'ArrowRight':
                next = (index + 1) % tabs.length;
                break;
            case 'ArrowLeft':
                next = (index - 1 + tabs.length) % tabs.length;
                break;
            case 'Home':
                next = 0;
                break;
            case 'End':
                next = tabs.length - 1;
                break;
            default:
                return;
        }
        event.preventDefault();
        onChange(tabs[next].id);
        buttons.current[next]?.focus();
    };

    return (
        <div role="tablist" aria-label={ariaLabel} className={className}>
            {tabs.map((tab, index) => {
                const active = tab.id === activeId;
                return (
                    <button
                        key={tab.id}
                        ref={(element) => {
                            buttons.current[index] = element;
                        }}
                        type="button"
                        role="tab"
                        id={tabId(idPrefix, tab.id)}
                        aria-selected={active}
                        aria-controls={panelId(idPrefix)}
                        tabIndex={active ? 0 : -1}
                        className={[tabClassName, active ? activeTabClassName : ''].filter(Boolean).join(' ')}
                        onClick={() => onChange(tab.id)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

export default TabBar;
