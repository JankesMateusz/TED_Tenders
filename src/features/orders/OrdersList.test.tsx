import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import OrdersList from './OrdersList';
import { resetDictionariesCache } from './useDictionaries';
import { SEARCH_DEBOUNCE_MS } from './useOrdersList';
import * as api from './ordersApi';
import { Dictionaries, OrderListItem } from '../../types/Orders';

jest.mock('./ordersApi', () => ({
    getDictionaries: jest.fn(),
    listOrders: jest.fn(),
}));
const mocked = api as unknown as { getDictionaries: jest.Mock; listOrders: jest.Mock };

const dictionaries: Dictionaries = {
    lobCategories: [{ code: 'Phone', label: 'Smartfony' }],
    accountTypes: [{ code: 'Public', label: null }],
    orderStatuses: [],
    positionStatuses: [{ code: 'Pending', label: 'Oczekuje' }],
    years: [2026, 2025],
};

const order = (id: number, extra: Partial<OrderListItem> = {}): OrderListItem => ({
    id,
    year: 2026,
    mdpId: `MDP-${id}`,
    endUserBidNumber: null,
    name: null,
    registeredOn: '2026-01-02',
    publicationDate: null,
    bidDate: null,
    status: 'open',
    accountType: null,
    budget: null,
    buyer: { id: 1, name: `Urząd ${id}`, town: 'Łódź', province: null },
    positionsCount: 2,
    lobCategories: ['Phone'],
    positionStatusCounts: { Pending: 2 },
    positionsWithWinner: 0,
    ...extra,
});

beforeEach(() => {
    jest.resetAllMocks();
    resetDictionariesCache();
    mocked.getDictionaries.mockResolvedValue(dictionaries);
});

describe('OrdersList', () => {
    it('pokazuje ładowanie, potem listę', async () => {
        mocked.listOrders.mockResolvedValue({ items: [order(1), order(2)], nextCursor: null });
        render(<OrdersList />);
        expect(screen.getByText('Ładowanie zamówień…')).toBeTruthy();
        expect(await screen.findByText('MDP-1')).toBeTruthy();
        expect(screen.getByText('MDP-2')).toBeTruthy();
        expect(screen.queryByText('Pokaż więcej')).toBeNull();
    });

    it('pokazuje komunikat o braku wyników', async () => {
        mocked.listOrders.mockResolvedValue({ items: [], nextCursor: null });
        render(<OrdersList />);
        expect(await screen.findByText('Brak zamówień spełniających kryteria.')).toBeTruthy();
    });

    it('pokazuje błąd i ponawia po kliknięciu', async () => {
        mocked.listOrders.mockRejectedValueOnce(new Error('Awaria')).mockResolvedValueOnce({ items: [order(1)], nextCursor: null });
        render(<OrdersList />);
        expect((await screen.findByRole('alert')).textContent).toContain('Awaria');
        fireEvent.click(screen.getByText('Spróbuj ponownie'));
        expect(await screen.findByText('MDP-1')).toBeTruthy();
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('doczytuje kolejną stronę kursorem i dopisuje wyniki', async () => {
        mocked.listOrders
            .mockResolvedValueOnce({ items: [order(1)], nextCursor: 'c1' })
            .mockResolvedValueOnce({ items: [order(2)], nextCursor: null });
        render(<OrdersList />);
        fireEvent.click(await screen.findByText('Pokaż więcej'));
        expect(await screen.findByText('MDP-2')).toBeTruthy();
        expect(screen.getByText('MDP-1')).toBeTruthy();
        expect(mocked.listOrders).toHaveBeenLastCalledWith({ cursor: 'c1' });
        expect(screen.queryByText('Pokaż więcej')).toBeNull();
    });

    it('łączy filtry i zeruje listę przy zmianie', async () => {
        mocked.listOrders.mockResolvedValue({ items: [order(1)], nextCursor: null });
        render(<OrdersList />);
        await screen.findByText('MDP-1');
        await waitFor(() => expect(screen.getByRole('option', { name: 'Phone (Smartfony)' })).toBeTruthy());

        fireEvent.change(screen.getByLabelText('Rok'), { target: { value: '2025' } });
        fireEvent.change(screen.getByLabelText('Kategoria LoB'), { target: { value: 'Phone' } });
        await waitFor(() => expect(mocked.listOrders).toHaveBeenLastCalledWith({ year: 2025, lobCategory: 'Phone' }));

        fireEvent.change(screen.getByLabelText('Rok'), { target: { value: '' } });
        await waitFor(() => expect(mocked.listOrders).toHaveBeenLastCalledWith({ lobCategory: 'Phone' }));
    });

    it('wyszukiwanie jest opóźnione i wysyła jedno zapytanie', async () => {
        jest.useFakeTimers();
        try {
            mocked.listOrders.mockResolvedValue({ items: [], nextCursor: null });
            render(<OrdersList />);
            await act(async () => {});
            const initialCalls = mocked.listOrders.mock.calls.length;

            const input = screen.getByLabelText('Szukaj');
            fireEvent.change(input, { target: { value: 'ur' } });
            fireEvent.change(input, { target: { value: 'urząd' } });
            expect(mocked.listOrders).toHaveBeenCalledTimes(initialCalls);

            await act(async () => {
                jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
            });
            expect(mocked.listOrders).toHaveBeenCalledTimes(initialCalls + 1);
            expect(mocked.listOrders).toHaveBeenLastCalledWith({ search: 'urząd' });
        } finally {
            jest.useRealTimers();
        }
    });

    it('ignoruje spóźnioną odpowiedź po zmianie filtrów', async () => {
        let resolveFirst: (v: { items: OrderListItem[]; nextCursor: null }) => void = () => {};
        mocked.listOrders
            .mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
            .mockResolvedValueOnce({ items: [order(2)], nextCursor: null });
        render(<OrdersList />);
        await waitFor(() => expect(screen.getByRole('option', { name: 'Phone (Smartfony)' })).toBeTruthy());

        fireEvent.change(screen.getByLabelText('Kategoria LoB'), { target: { value: 'Phone' } });
        expect(await screen.findByText('MDP-2')).toBeTruthy();

        await act(async () => resolveFirst({ items: [order(1)], nextCursor: null }));
        expect(screen.queryByText('MDP-1')).toBeNull();
        expect(screen.getByText('MDP-2')).toBeTruthy();
    });

    it('lista działa mimo błędu słowników i ostrzega o filtrach', async () => {
        mocked.getDictionaries.mockRejectedValue(new Error('x'));
        mocked.listOrders.mockResolvedValue({ items: [order(1)], nextCursor: null });
        render(<OrdersList />);
        expect(await screen.findByText('MDP-1')).toBeTruthy();
        expect(await screen.findByText(/Nie udało się pobrać słowników/)).toBeTruthy();
    });
});
