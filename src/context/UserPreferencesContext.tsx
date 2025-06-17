import React, { createContext, useContext, useState, useEffect } from 'react';

interface Tender {
    publicationNumber: string;
    title: string;
    buyerName: string;
    buyerCity: string;
    publicationDate: string;
    deadlineDate: string;
    cpvCodes: string[];
    link: string;
}

interface EmailAlert {
    id: string;
    tenders: Tender[];
    email: string;
}

interface UserPreferencesContextType {
    favorites: Tender[];
    emailAlerts: EmailAlert[];
    selectedTenders: Set<string>;
    toBeEnteredTenders: Set<string>;
    notToBeEnteredTenders: Set<string>;
    addToFavorites: (tender: Tender) => void;
    removeFromFavorites: (publicationNumber: string) => void;
    isFavorite: (publicationNumber: string) => boolean;
    toggleTenderSelection: (publicationNumber: string) => void;
    isTenderSelected: (publicationNumber: string) => boolean;
    clearSelectedTenders: () => void;
    getSelectedTenders: (tenders: Tender[]) => Tender[];
    addEmailAlert: (alert: { email: string, tenders: Tender[] }) => void;
    removeEmailAlert: (id: string) => void;
    toggleToBeEntered: (publicationNumber: string) => void;
    toggleNotToBeEntered: (publicationNumber: string) => void;
    isToBeEntered: (publicationNumber: string) => boolean;
    isNotToBeEntered: (publicationNumber: string) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Tender[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedTenders, setSelectedTenders] = useState<Set<string>>(new Set());
    const [toBeEnteredTenders, setToBeEnteredTenders] = useState<Set<string>>(new Set());
    const [notToBeEnteredTenders, setNotToBeEnteredTenders] = useState<Set<string>>(new Set());

    const [emailAlerts, setEmailAlerts] = useState<EmailAlert[]>(() => {
        const saved = localStorage.getItem('emailAlerts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('emailAlerts', JSON.stringify(emailAlerts));
    }, [emailAlerts]);

    useEffect(() => {
        localStorage.setItem('toBeEnteredTenders', JSON.stringify(Array.from(toBeEnteredTenders)));
    }, [toBeEnteredTenders]);

    useEffect(() => {
        localStorage.setItem('notToBeEnteredTenders', JSON.stringify(Array.from(notToBeEnteredTenders)));
    }, [notToBeEnteredTenders]);

    const addToFavorites = (tender: Tender) => {
        setFavorites(prev => {
            if (prev.some(t => t.publicationNumber === tender.publicationNumber)) {
                return prev;
            }
            return [...prev, tender];
        });
    };

    const removeFromFavorites = (publicationNumber: string) => {
        setFavorites(prev => prev.filter(t => t.publicationNumber !== publicationNumber));
    };

    const isFavorite = (publicationNumber: string) => {
        return favorites.some(t => t.publicationNumber === publicationNumber);
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

    const addEmailAlert = (alert: { email: string, tenders: Tender[] }) => {
        const newAlert = {
            ...alert,
            id: Math.random().toString(36).substr(2, 9)
        };
        setEmailAlerts(prev => [...prev, newAlert]);
        clearSelectedTenders(); // Clear selections after sending
    };

    const removeEmailAlert = (id: string) => {
        setEmailAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const toggleToBeEntered = (publicationNumber: string) => {
        setToBeEnteredTenders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(publicationNumber)) {
                newSet.delete(publicationNumber);
            } else {
                newSet.add(publicationNumber);
                // Remove from not to be entered if it was there
                setNotToBeEnteredTenders(prev => {
                    const newNotSet = new Set(prev);
                    newNotSet.delete(publicationNumber);
                    return newNotSet;
                });
            }
            return newSet;
        });
    };

    const toggleNotToBeEntered = (publicationNumber: string) => {
        setNotToBeEnteredTenders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(publicationNumber)) {
                newSet.delete(publicationNumber);
            } else {
                newSet.add(publicationNumber);
                // Remove from to be entered if it was there
                setToBeEnteredTenders(prev => {
                    const newToSet = new Set(prev);
                    newToSet.delete(publicationNumber);
                    return newToSet;
                });
            }
            return newSet;
        });
    };

    const isToBeEntered = (publicationNumber: string) => {
        return toBeEnteredTenders.has(publicationNumber);
    };

    const isNotToBeEntered = (publicationNumber: string) => {
        return notToBeEnteredTenders.has(publicationNumber);
    };

    const value = {
        favorites,
        emailAlerts,
        selectedTenders,
        toBeEnteredTenders,
        notToBeEnteredTenders,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleTenderSelection,
        isTenderSelected,
        clearSelectedTenders,
        getSelectedTenders,
        addEmailAlert,
        removeEmailAlert,
        toggleToBeEntered,
        toggleNotToBeEntered,
        isToBeEntered,
        isNotToBeEntered
    };

    return (
        <UserPreferencesContext.Provider value={value}>
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