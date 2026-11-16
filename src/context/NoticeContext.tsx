import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useShortcutsEnabled } from '../hooks/useShortcutsSetting';
import styles from '../components/Notice.module.css';

export type Notice = {
    message: string;
    /** Cofnięcie zmiany, o której mówi komunikat. Z nim komunikat ma przycisk "Cofnij", a zmiana trafia na stos cofnięć (skrót U). */
    onUndo?: () => void;
};

type NoticeContextType = {
    /** Pokazuje komunikat; nowy zastępuje poprzedni. */
    showNotice: (notice: Notice) => void;
    dismissNotice: () => void;
    /** Cofa ostatnią zmianę ze stosu (od najnowszej); false, gdy nie ma czego cofać. */
    undoLast: () => boolean;
};

/** Tyle komunikat zostaje na ekranie, jeśli nikt go nie dotyka ani nie ma na nim fokusu. */
const NOTICE_VISIBLE_MS = 8000;
/** Ile ostatnich zmian da się cofnąć skrótem U. */
const UNDO_STACK_LIMIT = 20;
/**
 * Jak długo zmiana nadaje się do cofnięcia. Dłużej cofnięcie mogłoby nadpisać nowszą decyzję kolegi,
 * a zapis statusu to "ostatni wygrywa".
 */
const UNDO_MAX_AGE_MS = 5 * 60 * 1000;

type UndoEntry = { id: number; run: () => void; at: number };

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

/**
 * Jeden komunikat naraz na dole ekranu. Komunikaty ze zmianą, którą da się cofnąć, mają przycisk "Cofnij"
 * i trafiają na stos: skrót U cofa kolejne zmiany, także gdy komunikat dawno zniknął. Czytniki ekranu dostają
 * komunikat jako status.
 */
export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notice, setNotice] = useState<(Notice & { id: number }) | null>(null);
    const nextId = useRef(0);
    const timer = useRef<number | undefined>(undefined);
    const undoStack = useRef<UndoEntry[]>([]);
    const shortcutsEnabled = useShortcutsEnabled();

    const stopTimer = useCallback(() => window.clearTimeout(timer.current), []);

    const dismissNotice = useCallback(() => {
        stopTimer();
        setNotice(null);
    }, [stopTimer]);

    const startTimer = useCallback(() => {
        stopTimer();
        timer.current = window.setTimeout(() => setNotice(null), NOTICE_VISIBLE_MS);
    }, [stopTimer]);

    const showNotice = useCallback((next: Notice) => {
        nextId.current += 1;
        const id = nextId.current;
        if (next.onUndo) {
            undoStack.current.push({ id, run: next.onUndo, at: Date.now() });
            if (undoStack.current.length > UNDO_STACK_LIMIT) undoStack.current.shift();
        }
        setNotice({ ...next, id });
        startTimer();
    }, [startTimer]);

    // Po cofnięciu użytkownik widzi, co się stało; to potwierdzenie samo nie trafia na stos
    const confirmUndo = useCallback((message: string) => {
        nextId.current += 1;
        setNotice({ message, id: nextId.current });
        startTimer();
    }, [startTimer]);

    const undoEntry = useCallback((entry: UndoEntry) => {
        undoStack.current = undoStack.current.filter((item) => item.id !== entry.id);
        entry.run();
        confirmUndo('Cofnięto zmianę.');
    }, [confirmUndo]);

    const undoLast = useCallback((): boolean => {
        const now = Date.now();
        undoStack.current = undoStack.current.filter((entry) => now - entry.at < UNDO_MAX_AGE_MS);
        const entry = undoStack.current[undoStack.current.length - 1];
        if (!entry) {
            confirmUndo('Nie ma zmiany do cofnięcia.');
            return false;
        }
        undoEntry(entry);
        return true;
    }, [confirmUndo, undoEntry]);

    useEffect(() => stopTimer, [stopTimer]);

    const value = useMemo(() => ({ showNotice, dismissNotice, undoLast }), [showNotice, dismissNotice, undoLast]);

    const undoFromNotice = () => {
        if (!notice) return;
        const entry = undoStack.current.find((item) => item.id === notice.id);
        if (entry) undoEntry(entry);
        else dismissNotice();
    };

    return (
        <NoticeContext.Provider value={value}>
            {children}
            {/* Region żyje stale, żeby czytnik ekranu zauważył treść dodaną później */}
            <div className={styles.region} role="status" aria-live="polite">
                {notice && (
                    <div
                        key={notice.id}
                        className={styles.notice}
                        onMouseEnter={stopTimer}
                        onMouseLeave={startTimer}
                        onFocus={stopTimer}
                        onBlur={startTimer}
                    >
                        <span className={styles.message}>{notice.message}</span>
                        {notice.onUndo && (
                            <button type="button" className={styles.action} onClick={undoFromNotice} aria-keyshortcuts={shortcutsEnabled ? 'u' : undefined}>
                                Cofnij
                                {/* Klawisz skrótu jest tylko podpowiedzią dla klawiatury; na ekranie dotykowym ukryty */}
                                {shortcutsEnabled && <kbd className={styles.key} aria-hidden="true">U</kbd>}
                            </button>
                        )}
                        <button type="button" className={styles.close} onClick={dismissNotice} aria-label="Zamknij komunikat">
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </NoticeContext.Provider>
    );
};

const NO_NOTICES: NoticeContextType = { showNotice: () => undefined, dismissNotice: () => undefined, undoLast: () => false };

/** Bez dostawcy (np. w testach pojedynczego komponentu) komunikaty są po cichu pomijane. */
export const useNotice = (): NoticeContextType => useContext(NoticeContext) ?? NO_NOTICES;
