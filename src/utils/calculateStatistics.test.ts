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
