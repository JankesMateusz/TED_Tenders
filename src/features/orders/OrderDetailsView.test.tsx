import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderDetailsView from './OrderDetailsView';
import * as api from './ordersApi';
import { OrderDetails } from '../../types/Orders';

jest.mock('./ordersApi', () => ({ getOrder: jest.fn() }));
const getOrder = (api as unknown as { getOrder: jest.Mock }).getOrder;

const order = (extra: Partial<OrderDetails> = {}): OrderDetails => ({
    id: 5,
    year: 2026,
    mdpId: 'MDP-5',
    endUserBidNumber: null,
    name: 'Dostawa laptopów',
    registeredOn: '2026-01-02',
    orderWeek: '2026-W01',
    publicationDate: null,
    publicationQuarter: null,
    bidDate: null,
    siwzUrl: 'javascript:alert(1)',
    extraUrls: ['https://example.com/x'],
    financingEu: false,
    budget: null,
    accountType: null,
    outsideUzp: false,
    lenovoTopTen: false,
    comments: null,
    status: 'open',
    statusLabel: 'Jeszcze nierozstrzygnięty',
    valueTotal: '123456',
    partsCount: null,
    avgPartValue: null,
    sourceTenderId: null,
    version: 1,
    buyer: { id: 1, name: 'Urząd Miasta', street: 'Główna 1', zipCode: '90-001', town: 'Łódź', province: null, nip: null, canonicalId: null },
    contact: { id: 1, fullName: 'Jan Kowalski', phone: null, email: 'jan@example.com', email2: null, fax: null },
    positions: [
        {
            id: 1, positionNumber: 1, legacyId: null, partLabel: null, lobCategory: 'Phone', quantity: 3, architecture: null,
            cpuNo: null, os: null, office: null, initialBenchmark: null, acquisitionForm: null, remarks: null,
            attributes: { RAM: '8 GB' }, status: 'Pending', statusLabel: 'Przetarg w toku', winner: null, vendor: null,
            awardLetterDate: null, finalOffice: null, deliveryTerm: null, partValue: null, version: 1,
        },
    ],
    letters: [],
    ...extra,
});

beforeEach(() => getOrder.mockReset());

describe('OrderDetailsView', () => {
    it('pokazuje ładowanie, potem sekcje zamówienia', async () => {
        getOrder.mockResolvedValue(order());
        render(<OrderDetailsView id={5} />);
        expect(screen.getByText('Ładowanie zamówienia…')).toBeTruthy();
        expect(await screen.findByText('Zamówienie MDP-5: Dostawa laptopów')).toBeTruthy();
        expect(getOrder).toHaveBeenCalledWith(5);
        expect(screen.getByText('Urząd Miasta')).toBeTruthy();
        expect(screen.getByText('Jeszcze nierozstrzygnięty')).toBeTruthy();
        expect(screen.getByText('RAM: 8 GB')).toBeTruthy();
        expect(screen.getByText('Brak pism.')).toBeTruthy();
    });

    it('linkuje tylko bezpieczne adresy i nie pokazuje wartości zamówienia', async () => {
        getOrder.mockResolvedValue(order());
        const { container } = render(<OrderDetailsView id={5} />);
        await screen.findByText('Urząd Miasta');
        const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
        expect(hrefs).toContain('https://example.com/x');
        expect(hrefs).toContain('mailto:jan@example.com');
        expect(hrefs.some((h) => h?.startsWith('javascript:'))).toBe(false);
        expect(container.querySelector('a[href="https://example.com/x"]')?.getAttribute('rel')).toBe('noopener noreferrer');
        expect(container.innerHTML).not.toContain('123456');
    });

    it('wyświetla "brak" dla pustych pól i komunikat dla zamówienia bez pozycji', async () => {
        getOrder.mockResolvedValue(order({ positions: [], contact: null }));
        render(<OrderDetailsView id={5} />);
        expect(await screen.findByText('Zamówienie nie ma pozycji.')).toBeTruthy();
        expect(screen.getAllByText('brak').length).toBeGreaterThan(3);
    });

    it('nieistniejące id pokazuje "Nie znaleziono"', async () => {
        getOrder.mockRejectedValue({ code: 'functions/not-found' });
        render(<OrderDetailsView id={999} />);
        expect((await screen.findByRole('alert')).textContent).toBe('Nie znaleziono zamówienia.');
    });

    it('błąd można ponowić', async () => {
        getOrder.mockRejectedValueOnce(new Error('x')).mockResolvedValueOnce(order());
        render(<OrderDetailsView id={5} />);
        fireEvent.click(await screen.findByText('Spróbuj ponownie'));
        expect(await screen.findByText('Zamówienie MDP-5: Dostawa laptopów')).toBeTruthy();
    });

    it('link powrotu prowadzi do listy', async () => {
        getOrder.mockResolvedValue(order());
        render(<OrderDetailsView id={5} />);
        await screen.findByText('Urząd Miasta');
        expect(screen.getByText('← Wróć do listy').getAttribute('href')).toBe('#/zamowienia');
    });
});
