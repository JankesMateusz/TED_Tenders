import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Tender } from '../types/Tender';
import { TenderStatus } from '../types/TenderStatus';
import { TenderLabel } from '../types/TenderLabel';
import { toggleLabel as toggleLabelIn } from '../utils/tenderLabels';
import { describeStatusChange } from '../utils/tenderStatus';
import { useNotice } from './NoticeContext';
import { addFavorite, removeFavorite, setTenderLabels, setTenderStatus, subscribeToFavorites } from '../utils/tendersApi';
import { GUEST_LABEL, useAuth } from './AuthContext';

const FAVORITES_LOAD_ERROR = 'Nie udało się wczytać zapisanych przetargów.';
const SAVE_ERROR = 'Nie udało się zapisać zmiany. Spróbuj ponownie.';
const TENDER_EXPIRED_ERROR = 'Ten przetarg wygasł i nie można już zmienić jego statusu.';
/** Tak długo zniknięcie karty po zmianie statusu uznajemy za skutek własnej zmiany (zapis wraca z bazy w ułamku sekundy). */
const OWN_CHANGE_WINDOW_MS = 10_000;

interface UserPreferencesContextType {
    /** Gwiazdki zalogowanego użytkownika (kopie przetargów, bez ograniczenia czasowego). */
    favorites: Tender[];
    isFavorite: (tenderId: string) => boolean;
    toggleFavorite: (tender: Tender) => void;
    /** Ustawia wspólny status; ponowne wybranie tego samego statusu go zdejmuje. */
    toggleStatus: (tender: Tender, status: TenderStatus) => void;
    /** Czy ta osoba zmieniła status tego przetargu przed chwilą (wtedy zniknięcie karty z kolejki jest jej własną decyzją). */
    wasChangedByMe: (tenderId: string) => boolean;
    /** Dodaje lub zdejmuje jedną wspólną etykietę (PROSTY i TRUDNY się wykluczają). */
    toggleLabel: (tender: Tender, label: TenderLabel) => void;
    /** Komunikat o nieudanym zapisie lub wczytaniu; null, gdy wszystko działa. */
    actionError: string | null;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const uid = user?.uid ?? null;
    const email = user ? user.email ?? GUEST_LABEL : null;
    const [favorites, setFavorites] = useState<Tender[]>([]);
    const [actionError, setActionError] = useState<string | null>(null);
    const { showNotice, dismissNotice } = useNotice();
    // Kiedy ta osoba ostatnio zmieniła status danego przetargu; odróżnia własną zmianę od cudzej
    const ownChanges = useRef(new Map<string, number>());

    useEffect(() => {
        if (!uid) {
            setFavorites([]);
            return;
        }
        return subscribeToFavorites(uid, setFavorites, (error) => {
            console.error('Błąd wczytywania zapisanych przetargów:', error);
            setActionError(FAVORITES_LOAD_ERROR);
        });
    }, [uid]);

    const favoriteIds = useMemo(() => new Set(favorites.map((tender) => tender.id)), [favorites]);

    const isFavorite = useCallback((tenderId: string) => favoriteIds.has(tenderId), [favoriteIds]);

    const reportError = useCallback((error: unknown) => {
        console.error('Błąd zapisu:', error);
        setActionError(
            (error as { code?: string })?.code === 'not-found' ? TENDER_EXPIRED_ERROR : SAVE_ERROR
        );
    }, []);

    const toggleFavorite = useCallback((tender: Tender) => {
        if (!uid) return;
        setActionError(null);
        const action = favoriteIds.has(tender.id) ? removeFavorite(uid, tender.id) : addFavorite(uid, tender);
        action.catch(reportError);
    }, [uid, favoriteIds, reportError]);

    const markOwnChange = useCallback((tenderId: string) => {
        ownChanges.current.set(tenderId, Date.now());
    }, []);

    const wasChangedByMe = useCallback((tenderId: string) => {
        const changedAt = ownChanges.current.get(tenderId);
        return changedAt !== undefined && Date.now() - changedAt < OWN_CHANGE_WINDOW_MS;
    }, []);

    const toggleStatus = useCallback((tender: Tender, status: TenderStatus) => {
        if (!uid) return;
        setActionError(null);
        const previous = { status: tender.status, byEmail: tender.statusByEmail };
        const next = tender.status === status ? null : status;
        markOwnChange(tender.id);
        // Komunikat z "Cofnij" pojawia się od razu; przy błędzie zapisu znika, a jego miejsce zajmuje komunikat o błędzie
        showNotice({
            message: describeStatusChange(previous, next, email),
            actionLabel: 'Cofnij',
            onAction: () => {
                markOwnChange(tender.id);
                setTenderStatus(tender.id, previous.status ?? null, { uid, email }).catch(reportError);
            },
        });
        setTenderStatus(tender.id, next, { uid, email }).catch((error) => {
            dismissNotice();
            reportError(error);
        });
    }, [uid, email, reportError, markOwnChange, showNotice, dismissNotice]);

    const toggleLabel = useCallback((tender: Tender, label: TenderLabel) => {
        if (!uid) return;
        setActionError(null);
        setTenderLabels(tender.id, toggleLabelIn(tender.labels ?? [], label), { uid, email }).catch(reportError);
    }, [uid, email, reportError]);

    return (
        <UserPreferencesContext.Provider value={{ favorites, isFavorite, toggleFavorite, toggleStatus, wasChangedByMe, toggleLabel, actionError }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (context === undefined) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
};
