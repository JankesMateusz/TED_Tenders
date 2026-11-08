import { useCallback, useEffect, useRef, useState } from 'react';
import { OrderListItem } from '../../types/Orders';
import { listOrders, OrderListQuery } from './ordersApi';

/** Filtry ustawiane przez użytkownika (bez kursora i rozmiaru strony). */
export type OrderFilters = Omit<OrderListQuery, 'cursor' | 'limit'>;

export const SEARCH_DEBOUNCE_MS = 300;

export interface OrdersListState {
    items: OrderListItem[];
    /** Pierwsze ładowanie albo ładowanie po zmianie filtrów. */
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    retry: () => void;
}

const errorMessage = (error: unknown): string => {
    const message = (error as { message?: unknown })?.message;
    return typeof message === 'string' && message ? message : 'Nie udało się pobrać zamówień.';
};

/**
 * Lista zamówień z kursorem. Zmiana filtrów zeruje listę; wyszukiwanie tekstowe jest opóźnione (debounce).
 * Odpowiedzi spóźnione (po zmianie filtrów) są ignorowane dzięki numerowi żądania.
 */
export const useOrdersList = (filters: OrderFilters): OrdersListState => {
    const [items, setItems] = useState<OrderListItem[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const requestId = useRef(0);

    // Klucz filtrów: stabilny między renderami, niezależnie od tożsamości obiektu.
    const { search, ...rest } = filters;
    const restKey = JSON.stringify(rest);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        if (search === debouncedSearch) return;
        const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search, debouncedSearch]);

    useEffect(() => {
        const id = ++requestId.current;
        setLoading(true);
        setLoadingMore(false);
        setError(null);
        setItems([]);
        setCursor(null);
        const query: OrderListQuery = { ...JSON.parse(restKey), ...(debouncedSearch ? { search: debouncedSearch } : {}) };
        listOrders(query).then(
            (page) => {
                if (id !== requestId.current) return;
                setItems(page.items);
                setCursor(page.nextCursor);
                setLoading(false);
            },
            (e) => {
                if (id !== requestId.current) return;
                setError(errorMessage(e));
                setLoading(false);
            }
        );
    }, [restKey, debouncedSearch, retryCount]);

    const loadMore = useCallback(() => {
        if (!cursor || loading || loadingMore) return;
        const id = requestId.current;
        setLoadingMore(true);
        setError(null);
        const query: OrderListQuery = {
            ...JSON.parse(restKey),
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            cursor,
        };
        listOrders(query).then(
            (page) => {
                if (id !== requestId.current) return;
                setItems((current) => [...current, ...page.items]);
                setCursor(page.nextCursor);
                setLoadingMore(false);
            },
            (e) => {
                if (id !== requestId.current) return;
                setError(errorMessage(e));
                setLoadingMore(false);
            }
        );
    }, [cursor, loading, loadingMore, restKey, debouncedSearch]);

    const retry = useCallback(() => {
        // Błąd przy doczytywaniu: ponów tylko następną stronę; w pozostałych przypadkach pełne ładowanie.
        if (cursor && items.length > 0) {
            setError(null);
            loadMore();
        } else {
            setRetryCount((n) => n + 1);
        }
    }, [cursor, items.length, loadMore]);

    return { items, loading, loadingMore, error, hasMore: cursor !== null, loadMore, retry };
};
