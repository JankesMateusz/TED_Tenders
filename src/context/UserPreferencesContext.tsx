import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Tender } from '../types/Tender';
import { TenderStatus } from '../types/TenderStatus';
import { addFavorite, removeFavorite, setTenderStatus, subscribeToFavorites } from '../utils/tendersApi';
import { GUEST_LABEL, useAuth } from './AuthContext';

const FAVORITES_LOAD_ERROR = 'Nie udało się wczytać zapisanych przetargów.';
const SAVE_ERROR = 'Nie udało się zapisać zmiany. Spróbuj ponownie.';
const TENDER_EXPIRED_ERROR = 'Ten przetarg wygasł i nie można już zmienić jego statusu.';

interface UserPreferencesContextType {
    /** Gwiazdki zalogowanego użytkownika (kopie przetargów, bez ograniczenia czasowego). */
    favorites: Tender[];
    isFavorite: (tenderId: string) => boolean;
    toggleFavorite: (tender: Tender) => void;
    /** Ustawia wspólny status; ponowne wybranie tego samego statusu go zdejmuje. */
    toggleStatus: (tender: Tender, status: TenderStatus) => void;
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

    const toggleStatus = useCallback((tender: Tender, status: TenderStatus) => {
        if (!uid) return;
        setActionError(null);
        setTenderStatus(tender.id, tender.status === status ? null : status, { uid, email }).catch(reportError);
    }, [uid, email, reportError]);

    return (
        <UserPreferencesContext.Provider value={{ favorites, isFavorite, toggleFavorite, toggleStatus, actionError }}>
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
