import { useEffect, useState } from 'react';
import { Dictionaries } from '../../types/Orders';
import { getDictionaries } from './ordersApi';

// Słowniki zmieniają się rzadko: pobieramy raz na sesję. Nieudane pobranie nie jest zapamiętywane (można ponowić).
let cached: Promise<Dictionaries> | null = null;

const loadDictionaries = (): Promise<Dictionaries> => {
    if (!cached) {
        cached = getDictionaries().catch((error) => {
            cached = null;
            throw error;
        });
    }
    return cached;
};

/** Tylko do testów. */
export const resetDictionariesCache = (): void => {
    cached = null;
};

export interface DictionariesState {
    dictionaries: Dictionaries | null;
    error: string | null;
}

export const useDictionaries = (): DictionariesState => {
    const [state, setState] = useState<DictionariesState>({ dictionaries: null, error: null });

    useEffect(() => {
        let active = true;
        loadDictionaries().then(
            (dictionaries) => active && setState({ dictionaries, error: null }),
            () => active && setState({ dictionaries: null, error: 'Nie udało się pobrać słowników.' })
        );
        return () => {
            active = false;
        };
    }, []);

    return state;
};
