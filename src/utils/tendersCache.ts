import { Tender } from "../types/Tender";

interface CachedTenders {
    data: Tender[];
    timestamp: number;
    dateRange: {
        startDate: string;
        endDate: string;
    };
}

const CACHE_PREFIX = 'tenders_';
const CACHE_TTL = 30 * 60 * 1000; // 30 minut
const MAX_CACHE_SIZE = 50; // Maksymalna liczba zapisanych zakresów dat

/**
 * Generuje klucz cache dla danego zakresu dat
 */
const getCacheKey = (startDate: string, endDate: string): string => {
    return `${CACHE_PREFIX}${startDate}_${endDate}`;
};

/**
 * Zapisuje przetargi do cache
 */
export const saveTendersToCache = (startDate: string, endDate: string, tenders: Tender[]): void => {
    const cacheKey = getCacheKey(startDate, endDate);
    const cached: CachedTenders = {
        data: tenders,
        timestamp: Date.now(),
        dateRange: { startDate, endDate }
    };
    
    try {
        localStorage.setItem(cacheKey, JSON.stringify(cached));
        cleanupOldCache();
    } catch (error) {
        // Jeśli localStorage jest pełny, spróbuj wyczyścić stary cache i zapisz ponownie
        console.warn('Cache full, cleaning up old entries...', error);
        cleanupOldCache();
        try {
            localStorage.setItem(cacheKey, JSON.stringify(cached));
        } catch (e) {
            console.error('Failed to save to cache after cleanup:', e);
            // Jeśli nadal nie można zapisać, usuń najstarsze wpisy
            removeOldestCacheEntries(10);
            try {
                localStorage.setItem(cacheKey, JSON.stringify(cached));
            } catch (finalError) {
                console.error('Failed to save to cache after aggressive cleanup:', finalError);
            }
        }
    }
};

/**
 * Pobiera przetargi z cache
 * Zwraca null jeśli cache nie istnieje lub jest przestarzały
 */
export const getTendersFromCache = (startDate: string, endDate: string): Tender[] | null => {
    const cacheKey = getCacheKey(startDate, endDate);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    try {
        const parsed: CachedTenders = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        
        // Jeśli cache jest świeży (< TTL), zwróć go
        if (age < CACHE_TTL) {
            return parsed.data;
        }
        
        // Stary cache - usuń go
        localStorage.removeItem(cacheKey);
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        // Usuń uszkodzony cache
        localStorage.removeItem(cacheKey);
        return null;
    }
};

/**
 * Sprawdza czy cache istnieje (nawet jeśli jest stary)
 */
export const hasCache = (startDate: string, endDate: string): boolean => {
    const cacheKey = getCacheKey(startDate, endDate);
    return localStorage.getItem(cacheKey) !== null;
};

/**
 * Czyści stary cache (starszy niż TTL)
 */
const cleanupOldCache = (): void => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    const now = Date.now();
    
    cacheKeys.forEach(key => {
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return;
            
            const parsed: CachedTenders = JSON.parse(cached);
            const age = now - parsed.timestamp;
            
            // Usuń cache starszy niż TTL
            if (age >= CACHE_TTL) {
                localStorage.removeItem(key);
            }
        } catch (error) {
            // Usuń uszkodzony cache
            localStorage.removeItem(key);
        }
    });
    
    // Jeśli nadal mamy za dużo cache, usuń najstarsze
    const remainingKeys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    if (remainingKeys.length > MAX_CACHE_SIZE) {
        removeOldestCacheEntries(remainingKeys.length - MAX_CACHE_SIZE);
    }
};

/**
 * Usuwa najstarsze wpisy cache
 */
const removeOldestCacheEntries = (count: number): void => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    
    const cacheEntries = cacheKeys
        .map(key => {
            const cached = localStorage.getItem(key);
            if (!cached) return null;
            try {
                const parsed: CachedTenders = JSON.parse(cached);
                return { key, timestamp: parsed.timestamp };
            } catch {
                return null;
            }
        })
        .filter((entry): entry is { key: string; timestamp: number } => entry !== null)
        .sort((a, b) => a.timestamp - b.timestamp);
    
    // Usuń najstarsze
    for (let i = 0; i < Math.min(count, cacheEntries.length); i++) {
        localStorage.removeItem(cacheEntries[i].key);
    }
};

/**
 * Czyści cały cache przetargów
 */
export const clearAllTendersCache = (): void => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    cacheKeys.forEach(key => localStorage.removeItem(key));
};

/**
 * Zwraca informacje o cache (dla debugowania)
 */
export const getCacheInfo = (): { count: number; totalSize: number; entries: Array<{ key: string; age: number; size: number }> } => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    const now = Date.now();
    
    const entries = cacheKeys.map(key => {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        try {
            const parsed: CachedTenders = JSON.parse(cached);
            return {
                key,
                age: now - parsed.timestamp,
                size: cached.length
            };
        } catch {
            return null;
        }
    }).filter((entry): entry is { key: string; age: number; size: number } => entry !== null);
    
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    
    return {
        count: entries.length,
        totalSize,
        entries
    };
};

