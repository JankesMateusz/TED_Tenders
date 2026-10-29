import { commentFromDoc, favoriteFromDoc, favoriteToDoc, formatDay, tenderFromDoc } from './tenderMapping';

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
        expect(tenderFromDoc(doc, 'E_ZAMOWIENIA_2026_BZP_00510442_01')).toEqual({
            id: 'E_ZAMOWIENIA_2026_BZP_00510442_01',
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
        const tender = tenderFromDoc({ ...doc, deadlineDate: null, publicationTime: null, orderType: null }, 'x');
        expect(tender.deadlineDate).toBe('Brak terminu');
        expect(tender.publicationTime).toBeUndefined();
        expect(tender.orderType).toBeUndefined();
    });

    it('toleruje brak listy kodów CPV', () => {
        expect(tenderFromDoc({ ...doc, cpvCodes: undefined }, 'x').cpvCodes).toEqual([]);
    });
});

describe('status wspólny w dokumencie przetargu', () => {
    const base = {
        source: 'TED',
        publicationNumber: '100-2026',
        title: 'Serwery',
        buyerName: 'Urząd',
        buyerCity: 'Warszawa',
        publicationDate: '2026-10-29',
        deadlineDate: null,
        cpvCodes: [],
        link: 'https://example.com'
    };

    it('odczytuje status, autora i czas', () => {
        const at = new Date('2026-10-29T12:30:00Z');
        const tender = tenderFromDoc(
            { ...base, status: 'toClarify', statusBy: 'u1', statusByEmail: 'anna@example.com', statusAt: { toDate: () => at } },
            'TED_100-2026'
        );
        expect(tender.status).toBe('toClarify');
        expect(tender.statusByEmail).toBe('anna@example.com');
        expect(tender.statusAt).toEqual(at);
    });

    it('nie ma statusu, gdy pole jest puste lub ma nieznaną wartość', () => {
        expect(tenderFromDoc(base, 'x').status).toBeUndefined();
        expect(tenderFromDoc({ ...base, status: 'done' }, 'x').status).toBeUndefined();
    });

    it('toleruje czas, którego serwer jeszcze nie nadał', () => {
        const tender = tenderFromDoc({ ...base, status: 'entered', statusByEmail: 'a@b.pl', statusAt: null }, 'x');
        expect(tender.status).toBe('entered');
        expect(tender.statusAt).toBeUndefined();
    });
});

describe('kopia ulubionego przetargu', () => {
    const tender = tenderFromDoc(
        {
            source: 'E_ZAMOWIENIA',
            publicationNumber: '2026/BZP 1/01',
            title: 'Laptopy',
            buyerName: 'Gmina',
            buyerCity: 'Rędziny',
            publicationDate: '2026-10-29',
            publicationTime: null,
            deadlineDate: '2026-11-06',
            cpvCodes: ['30213100-6'],
            link: 'https://example.com',
            orderType: null,
            status: 'toEnter',
            statusByEmail: 'anna@example.com'
        },
        'E_ZAMOWIENIA_2026_BZP_1_01'
    );

    it('nie zawiera statusu wspólnego, identyfikatora ani pól undefined', () => {
        const doc = favoriteToDoc(tender);
        expect(doc).not.toHaveProperty('status');
        expect(doc).not.toHaveProperty('statusByEmail');
        expect(doc).not.toHaveProperty('id');
        expect(Object.values(doc)).not.toContain(undefined);
    });

    it('po zapisie i odczycie daje ten sam przetarg (bez statusu)', () => {
        const restored = favoriteFromDoc(favoriteToDoc(tender), tender.id);
        const { status, statusByEmail, statusAt, ...expected } = tender;
        expect(restored).toEqual(expect.objectContaining(expected));
        expect(restored.status).toBeUndefined();
    });
});

describe('commentFromDoc', () => {
    const doc = { tenderId: 'TED_1', text: 'Dlaczego?', authorUid: 'u1', authorEmail: 'a@example.com' };

    it('mapuje pola komentarza i zamienia czas serwera na Date', () => {
        const createdAt = new Date(2026, 9, 29, 12, 0);
        expect(commentFromDoc({ ...doc, createdAt: { toDate: () => createdAt } }, 'c1')).toEqual({ ...doc, id: 'c1', createdAt });
    });

    it('przy jeszcze nienadanym czasie serwera używa bieżącego', () => {
        const before = Date.now();
        const comment = commentFromDoc({ ...doc, createdAt: null }, 'c1');
        expect(comment.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    });
});
