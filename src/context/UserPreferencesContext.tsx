import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tender } from '../types/Tender';

interface UserPreferencesContextType {
    favorites: Tender[];
    selectedTenders: Set<string>;
    toBeEnteredTenders: Set<string>;
    notToBeEnteredTenders: Set<string>;
    addToFavorites: (tender: Tender) => void;
    removeFromFavorites: (publicationNumber: string) => void;
    isFavorite: (publicationNumber: string) => boolean;
    toggleToBeEntered: (publicationNumber: string) => void;
    toggleNotToBeEntered: (publicationNumber: string) => void;
    isToBeEntered: (publicationNumber: string) => boolean;
    isNotToBeEntered: (publicationNumber: string) => boolean;
    toggleTenderSelection: (publicationNumber: string) => void;
    isTenderSelected: (publicationNumber: string) => boolean;
    clearSelectedTenders: () => void;
    getSelectedTenders: (tenders: Tender[]) => Tender[];
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Tender[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedTenders, setSelectedTenders] = useState<Set<string>>(new Set());

    const [toBeEnteredTenders, setToBeEnteredTenders] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('toBeEnteredTenders');
        return saved ? new Set<string>(JSON.parse(saved)) : new Set();
    });

    const [notToBeEnteredTenders, setNotToBeEnteredTenders] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('notToBeEnteredTenders');
        return saved ? new Set<string>(JSON.parse(saved)) : new Set();
    });


    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('toBeEnteredTenders', JSON.stringify(Array.from(toBeEnteredTenders)));
    }, [toBeEnteredTenders]);

    useEffect(() => {
        localStorage.setItem('notToBeEnteredTenders', JSON.stringify(Array.from(notToBeEnteredTenders)));
    }, [notToBeEnteredTenders]);

    // email alerts feature removed

    const addToFavorites = (tender: Tender) => {
        setFavorites(prev => {
            if (prev.some(t => t.publicationNumber === tender.publicationNumber)) {
                return prev;
            }
            return [...prev, tender];
        });
    };

    const toggleToBeEntered = (publicationNumber: string) => {
        setToBeEnteredTenders(prev => {
            const next = new Set(prev);
            if (next.has(publicationNumber)) next.delete(publicationNumber);
            else next.add(publicationNumber);
            return next;
        });
        // ensure a tender isn't both in toBeEntered and notToBeEntered
        setNotToBeEnteredTenders(prev => {
            if (!prev.has(publicationNumber)) return prev;
            const next = new Set(prev);
            next.delete(publicationNumber);
            return next;
        });
    };

    const toggleNotToBeEntered = (publicationNumber: string) => {
        setNotToBeEnteredTenders(prev => {
            const next = new Set(prev);
            if (next.has(publicationNumber)) next.delete(publicationNumber);
            else next.add(publicationNumber);
            return next;
        });
        // ensure a tender isn't both in notToBeEntered and toBeEntered
        setToBeEnteredTenders(prev => {
            if (!prev.has(publicationNumber)) return prev;
            const next = new Set(prev);
            next.delete(publicationNumber);
            return next;
        });
    };

    const removeFromFavorites = (publicationNumber: string) => {
        setFavorites(prev => prev.filter(t => t.publicationNumber !== publicationNumber));
    };

    const isFavorite = (publicationNumber: string) => {
        return favorites.some(t => t.publicationNumber === publicationNumber);
    };

    const isToBeEntered = (publicationNumber: string) => {
        return toBeEnteredTenders.has(publicationNumber);
    };

    const isNotToBeEntered = (publicationNumber: string) => {
        return notToBeEnteredTenders.has(publicationNumber);
    };

    const toggleTenderSelection = (publicationNumber: string) => {
        setSelectedTenders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(publicationNumber)) {
                newSet.delete(publicationNumber);
            } else {
                newSet.add(publicationNumber);
            }
            return newSet;
        });
    };

    const isTenderSelected = (publicationNumber: string) => {
        return selectedTenders.has(publicationNumber);
    };

    const clearSelectedTenders = () => {
        setSelectedTenders(new Set());
    };

    const getSelectedTenders = (tenders: Tender[]) => {
        return tenders.filter(tender => selectedTenders.has(tender.publicationNumber));
    };

    // addEmailAlert / removeEmailAlert removed

    return (
        <UserPreferencesContext.Provider 
            value={{
                favorites,
                selectedTenders,
                toBeEnteredTenders,
                notToBeEnteredTenders,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                toggleToBeEntered,
                toggleNotToBeEntered,
                isToBeEntered,
                isNotToBeEntered,
                toggleTenderSelection,
                isTenderSelected,
                clearSelectedTenders,
                getSelectedTenders,
                // email alerts removed
            }}
        >
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