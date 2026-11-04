import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { calculateStatistics } from './calculateStatistics';

const tender = (overrides: Partial<Tender>): Tender =>
    ({
        id: 'T1',
        source: TenderSource.TED,
        publicationNumber: '1',
        title: 't',
        buyerName: 'b',
        buyerCity: 'c',
        publicationDate: '03-11-2026',
        deadlineDate: 'Brak terminu',
        cpvCodes: [],
        ...overrides
    }) as Tender;

describe('calculateStatistics: kategorie CPV i oceniający', () => {
    it('liczy przetarg raz w każdej kategorii i sortuje malejąco', () => {
        const stats = calculateStatistics([
            tender({ cpvCodes: ['30213100-6', '30213300-8'] }),
            tender({ cpvCodes: ['30213100-6', '48000000-8'] }),
            tender({ cpvCodes: ['45000000-7'] })
        ]);
        expect(stats.byCpvCategory.map(({ key, count }) => [key, count])).toEqual([
            ['computers', 2],
            ['software', 1]
        ]);
    });

    it('liczy statusy według osoby, która je ustawiła, z pominięciem nieoznaczonych', () => {
        const stats = calculateStatistics([
            tender({ status: 'toEnter', statusByEmail: 'anna@x.pl' }),
            tender({ status: 'entered', statusByEmail: 'anna@x.pl' }),
            tender({ status: 'notToEnter', statusByEmail: 'jan@x.pl' }),
            tender({ status: 'toEnter' }),
            tender({})
        ]);
        expect(stats.byReviewer).toEqual([
            { reviewer: 'anna@x.pl', count: 2 },
            { reviewer: 'jan@x.pl', count: 1 },
            { reviewer: 'Nieznany użytkownik', count: 1 }
        ]);
    });
});

describe('calculateStatistics: powtarzający się zamawiający', () => {
    it('pomija zamawiających z jednym ogłoszeniem i łączy warianty zapisu nazwy', () => {
        const stats = calculateStatistics([
            tender({ buyerName: 'Gmina Lublin' }),
            tender({ buyerName: '  gmina   lublin ' }),
            tender({ buyerName: 'Gmina Lublin' }),
            tender({ buyerName: 'Urząd A' }),
            tender({ buyerName: 'Urząd A' }),
            tender({ buyerName: 'Jednorazowy' }),
            tender({ buyerName: 'Brak danych' })
        ]);
        expect(stats.repeatBuyers).toEqual([
            { buyer: 'Gmina Lublin', count: 3 },
            { buyer: 'Urząd A', count: 2 }
        ]);
    });

    it('zostawia najwyżej 10 pozycji, od najliczniejszych', () => {
        const tenders = Array.from({ length: 12 }, (_, i) => [
            tender({ buyerName: `Zamawiający ${String(i).padStart(2, '0')}` }),
            tender({ buyerName: `Zamawiający ${String(i).padStart(2, '0')}` })
        ]).flat();
        tenders.push(tender({ buyerName: 'Zamawiający 11' }));
        const { repeatBuyers } = calculateStatistics(tenders);
        expect(repeatBuyers).toHaveLength(10);
        expect(repeatBuyers[0]).toEqual({ buyer: 'Zamawiający 11', count: 3 });
    });

    it('bez powtórzeń daje pustą listę', () => {
        expect(calculateStatistics([tender({ buyerName: 'A' }), tender({ buyerName: 'B' })]).repeatBuyers).toEqual([]);
    });
});
