import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../components/Notice.module.css';

export type Notice = {
    message: string;
    /** Podpis przycisku akcji (np. "Cofnij"); bez niego komunikat jest tylko informacją. */
    actionLabel?: string;
    onAction?: () => void;
};

type NoticeContextType = {
    /** Pokazuje komunikat; nowy zastępuje poprzedni. */
    showNotice: (notice: Notice) => void;
    dismissNotice: () => void;
};

/** Tyle komunikat zostaje na ekranie, jeśli nikt go nie dotyka ani nie ma na nim fokusu. */
const NOTICE_VISIBLE_MS = 8000;

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

/** Jeden komunikat naraz na dole ekranu, z opcjonalną akcją (np. "Cofnij"). Czytniki ekranu dostają go jako status. */
export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notice, setNotice] = useState<(Notice & { id: number }) | null>(null);
    const nextId = useRef(0);
    const timer = useRef<number | undefined>(undefined);

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
        setNotice({ ...next, id: nextId.current });
        startTimer();
    }, [startTimer]);

    useEffect(() => stopTimer, [stopTimer]);

    const value = useMemo(() => ({ showNotice, dismissNotice }), [showNotice, dismissNotice]);

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
                        {notice.actionLabel && notice.onAction && (
                            <button
                                type="button"
                                className={styles.action}
                                onClick={() => {
                                    notice.onAction?.();
                                    dismissNotice();
                                }}
                            >
                                {notice.actionLabel}
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

const NO_NOTICES: NoticeContextType = { showNotice: () => undefined, dismissNotice: () => undefined };

/** Bez dostawcy (np. w testach pojedynczego komponentu) komunikaty są po cichu pomijane. */
export const useNotice = (): NoticeContextType => useContext(NoticeContext) ?? NO_NOTICES;
