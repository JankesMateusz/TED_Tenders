import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { TenderStatus } from '../types/TenderStatus';
import { calculateStatistics } from './calculateStatistics';
import { StatusFilters, filterAndSortTenders } from './tenderFilters';
import { DEFAULT_ORDER_TYPES } from '../constants';

const tender = (id: string, status?: TenderStatus): Tender => ({
    id,
    publicationNumber: id,
    title: `Przetarg ${id}`,
    buyerName: 'Urząd',
    buyerCity: 'Warszawa',
    publicationDate: '29-10-2026',
    deadlineDate: '06-11-2026',
    cpvCodes: [],
    link: 'https://example.com',
    source: TenderSource.TED,
    status
});

const noFilters: StatusFilters = { toEnter: false, entered: false, toClarify: false, notToEnter: false, unmarked: false };
const tenders = [tender('a', 'toEnter'), tender('b', 'entered'), tender('c', 'toClarify'), tender('d', 'notToEnter'), tender('e')];

const filter = (statusFilters: StatusFilters) =>
    filterAndSortTenders(tenders, {
        selectedSources: [TenderSource.TED],
        selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
        selectedBuyer: null,
        selectedCity: null,
        isFiltered: false,
        searchQuery: '',
        statusFilters
    }).map((t) => t.id).sort();

describe('filtr po statusie', () => {
    it('bez wybranego statusu pokazuje wszystko', () => {
        expect(filter(noFilters)).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('pokazuje przetargi z dowolnego z wybranych statusów', () => {
        expect(filter({ ...noFilters, toEnter: true, toClarify: true })).toEqual(['a', 'c']);
    });

    it('"nieoznaczone" pokazuje tylko przetargi bez statusu', () => {
        expect(filter({ ...noFilters, unmarked: true })).toEqual(['e']);
    });
});

describe('statystyki statusów', () => {
    it('liczą każdy status osobno oraz przetargi bez statusu', () => {
        expect(calculateStatistics(tenders).byStatus).toEqual({
            toEnter: 1, entered: 1, toClarify: 1, notToEnter: 1, unmarked: 1
        });
    });
});
