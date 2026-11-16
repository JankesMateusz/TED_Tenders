import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'keyboardShortcuts';

const listeners = new Set<() => void>();

const readStored = (): boolean => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) !== 'off';
    } catch {
        // Zablokowany localStorage (tryb prywatny, polityka przeglądarki): skróty zostają włączone
        return true;
    }
};

let enabled = readStored();

/** Włącza lub wyłącza skróty jednoklawiszowe (J/K, 1-4, 0, S, "/"); wybór jest pamiętany w tej przeglądarce. */
export const setShortcutsEnabled = (value: boolean): void => {
    enabled = value;
    try {
        window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
    } catch {
        // Bez localStorage wybór obowiązuje do odświeżenia strony
    }
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

/**
 * Czy skróty jednoklawiszowe są włączone. Użytkownik musi móc je wyłączyć (WCAG 2.1.4): dyktowanie głosem
 * i przypadkowe naciśnięcia klawisza nie mogą zmieniać wspólnego statusu.
 */
export const useShortcutsEnabled = (): boolean => useSyncExternalStore(subscribe, () => enabled);
