import { formatDay, tenderFromDoc } from './tenderMapping';

describe('formatDay', () => {
    it('zamienia RRRR-MM-DD na DD-MM-RRRR', () => {
        expect(formatDay('2026-10-29', 'x')).toBe('29-10-2026');
    });

    it('zwraca wartość zastępczą dla braku lub błędnego formatu', () => {
        expect(formatDay(null, 'Brak terminu')).toBe('Brak terminu');
        expect(formatDay(undefined, 'Brak terminu')).toBe('Brak terminu');
        expect(formatDay('29-10-2026', 'Brak terminu')).toBe('Brak terminu');
    });
});

describe('tenderFromDoc', () => {
    const doc = {
        source: 'E_ZAMOWIENIA',
        publicationNumber: '2026/BZP 00510442/01',
        title: 'Zakup samochodu',
        buyerName: 'Gmina Rędziny',
        buyerCity: 'Rędziny',
        country: 'Polska',
        publicationDate: '2026-10-29',
        publicationTime: '20:22',
        deadlineDate: '2026-11-06',
        cpvCodes: ['34144210-3'],
        link: 'https://example.com',
        orderType: 'Delivery',
        buyerMainActivity: null
    };

    it('mapuje dokument na przetarg w formacie interfejsu', () => {
        expect(tenderFromDoc(doc)).toEqual({
            publicationNumber: '2026/BZP 00510442/01',
            title: 'Zakup samochodu',
            buyerName: 'Gmina Rędziny',
            buyerCity: 'Rędziny',
            publicationDate: '29-10-2026',
            publicationTime: '20:22',
            deadlineDate: '06-11-2026',
            cpvCodes: ['34144210-3'],
            link: 'https://example.com',
            source: 'E_ZAMOWIENIA',
            orderType: 'Delivery',
            country: 'Polska',
            buyerMainActivity: undefined,
            changeNoticeVersionIdentifier: null
        });
    });

    it('wstawia "Brak terminu" i pomija godzinę, gdy ich nie ma', () => {
        const tender = tenderFromDoc({ ...doc, deadlineDate: null, publicationTime: null, orderType: null });
        expect(tender.deadlineDate).toBe('Brak terminu');
        expect(tender.publicationTime).toBeUndefined();
        expect(tender.orderType).toBeUndefined();
    });

    it('toleruje brak listy kodów CPV', () => {
        expect(tenderFromDoc({ ...doc, cpvCodes: undefined }).cpvCodes).toEqual([]);
    });
});
