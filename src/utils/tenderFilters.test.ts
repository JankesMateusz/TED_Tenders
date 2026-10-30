import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { TenderStatus } from '../types/TenderStatus';
import { calculateStatistics } from './calculateStatistics';
import { StatusFilters, SortOrder, countFacets, filterAndSortTenders } from './tenderFilters';
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
        selectedBuyers: [],
        selectedCities: [],
        selectedCpvs: [],
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

describe('filtr po typie zamówienia', () => {
    const typed: Tender[] = [
        { ...tender('dostawa'), orderType: 'Delivery' },
        { ...tender('usluga'), orderType: 'Services' },
        { ...tender('nieznany') }
    ];
    const byType = (selectedOrderTypes: ('Delivery' | 'Services' | 'Works')[]) =>
        filterAndSortTenders(typed, {
            selectedSources: [TenderSource.TED],
            selectedOrderTypes,
            selectedBuyers: [],
            selectedCities: [],
            selectedCpvs: [],
            isFiltered: false,
            searchQuery: '',
            statusFilters: noFilters
        }).map((t) => t.id).sort();

    it('działa także dla przetargów z TED', () => {
        expect(byType(['Delivery'])).toEqual(['dostawa', 'nieznany']);
    });

    it('nie ukrywa przetargów bez znanego typu', () => {
        expect(byType([])).toEqual(['nieznany']);
    });
});

describe('filtr po kodzie CPV', () => {
    const withCpv: Tender[] = [
        { ...tender('laptopy'), cpvCodes: ['30213100-6', '30213000-5'] },
        { ...tender('serwery'), cpvCodes: ['48820000-2'] },
        { ...tender('bez-kodow') }
    ];
    const byCpv = (selectedCpvs: string[]) =>
        filterAndSortTenders(withCpv, {
            selectedSources: [TenderSource.TED],
            selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
            selectedBuyers: [],
            selectedCities: [],
            selectedCpvs,
            isFiltered: false,
            searchQuery: '',
            statusFilters: noFilters
        }).map((t) => t.id).sort();

    it('bez wybranego kodu pokazuje wszystko', () => {
        expect(byCpv([])).toEqual(['bez-kodow', 'laptopy', 'serwery']);
    });

    it('pokazuje przetargi zawierające kod, także z cyfrą kontrolną', () => {
        expect(byCpv(['30213100'])).toEqual(['laptopy']);
        expect(byCpv(['30213100-6'])).toEqual(['laptopy']);
    });

    it('przy kilku kodach pokazuje przetargi z którymkolwiek z nich', () => {
        expect(byCpv(['30213100', '48820000'])).toEqual(['laptopy', 'serwery']);
    });
});

describe('statystyki kodów CPV', () => {
    it('liczą przetargi z danym kodem IT, pomijają inne kody i nie liczą powtórzeń w jednym przetargu', () => {
        const stats = calculateStatistics([
            { ...tender('a'), cpvCodes: ['30213100-6', '30213100-6', '45000000-7'] },
            { ...tender('b'), cpvCodes: ['30213100-6', '30213000-5'] },
            { ...tender('c'), cpvCodes: ['30213000-5'] },
            { ...tender('d'), cpvCodes: ['30213000-5'] }
        ]);
        expect(stats.topCpvCodes).toEqual([
            { code: '30213000', count: 3 },
            { code: '30213100', count: 2 }
        ]);
    });
});

const baseOptions = {
    selectedSources: [TenderSource.TED, TenderSource.E_ZAMOWIENIA],
    selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
    selectedBuyers: [] as string[],
    selectedCities: [] as string[],
    selectedCpvs: [] as string[],
    isFiltered: false,
    searchQuery: '',
    statusFilters: noFilters
};

describe('filtr po zamawiających i miastach', () => {
    const list: Tender[] = [
        { ...tender('a'), buyerName: 'Urząd Miasta', buyerCity: 'Warszawa' },
        { ...tender('b'), buyerName: 'Szpital', buyerCity: 'Kraków' },
        { ...tender('c'), buyerName: 'Szkoła', buyerCity: 'Gdańsk' }
    ];
    const ids = (options: Partial<typeof baseOptions>) =>
        filterAndSortTenders(list, { ...baseOptions, ...options }).map((t) => t.id).sort();

    it('pokazuje przetargi któregokolwiek z wybranych zamawiających', () => {
        expect(ids({ selectedBuyers: ['Urząd Miasta', 'Szkoła'] })).toEqual(['a', 'c']);
    });

    it('pokazuje przetargi z któregokolwiek z wybranych miast, ignorując wielkość liter', () => {
        expect(ids({ selectedCities: ['warszawa', 'KRAKÓW'] })).toEqual(['a', 'b']);
    });

    it('łączy zamawiających i miasta warunkiem "oraz"', () => {
        expect(ids({ selectedBuyers: ['Urząd Miasta', 'Szpital'], selectedCities: ['Kraków'] })).toEqual(['b']);
    });
});

describe('sortowanie', () => {
    const NOW = new Date(2026, 9, 29, 15, 0);
    const list: Tender[] = [
        { ...tender('brak'), deadlineDate: 'Brak terminu', publicationDate: '29-10-2026' },
        { ...tender('za-tydzien'), deadlineDate: '05-11-2026', publicationDate: '20-10-2026' },
        { ...tender('wczoraj'), deadlineDate: '28-10-2026', publicationDate: '27-10-2026' },
        { ...tender('dzis'), deadlineDate: '29-10-2026', publicationDate: '25-10-2026' },
        { ...tender('dawno'), deadlineDate: '01-10-2026', publicationDate: '28-10-2026' },
        { ...tender('jutro'), deadlineDate: '30-10-2026', publicationDate: '26-10-2026' }
    ];
    const order = (sortOrder: SortOrder, tenders: Tender[] = list) =>
        filterAndSortTenders(tenders, { ...baseOptions, sortOrder }, NOW).map((t) => t.id);

    it('domyślnie sortuje od najnowszej publikacji', () => {
        expect(filterAndSortTenders(list, baseOptions, NOW).map((t) => t.id)).toEqual(
            ['brak', 'dawno', 'wczoraj', 'jutro', 'dzis', 'za-tydzien']
        );
    });

    it('po terminie: najpierw nadchodzące, potem przeterminowane od najświeższego, na końcu bez terminu', () => {
        expect(order('deadline')).toEqual(['dzis', 'jutro', 'za-tydzien', 'wczoraj', 'dawno', 'brak']);
    });

    it('po zamawiającym alfabetycznie z polskimi znakami, remisy wg publikacji', () => {
        const buyers: Tender[] = [
            { ...tender('z'), buyerName: 'Żłobek' },
            { ...tender('a1'), buyerName: 'Urząd', publicationDate: '20-10-2026' },
            { ...tender('a2'), buyerName: 'Urząd', publicationDate: '28-10-2026' },
            { ...tender('s'), buyerName: 'Szpital' }
        ];
        expect(order('buyer', buyers)).toEqual(['s', 'a2', 'a1', 'z']);
    });
});

describe('liczniki opcji filtrów', () => {
    const list: Tender[] = [
        { ...tender('a', 'toEnter'), orderType: 'Delivery' },
        { ...tender('b', 'toEnter'), orderType: 'Services' },
        { ...tender('c'), orderType: 'Delivery', source: TenderSource.E_ZAMOWIENIA },
        { ...tender('d', 'entered'), orderType: 'Delivery', buyerName: 'Inny' }
    ];

    it('liczy opcję przy pozostałych filtrach, ale bez własnego filtra', () => {
        const counts = countFacets(list, {
            ...baseOptions,
            selectedSources: [TenderSource.TED],
            selectedOrderTypes: ['Delivery'],
            statusFilters: { ...noFilters, toEnter: true }
        });
        // źródła: bez filtra źródła, ale z typem Delivery i statusem toEnter
        expect(counts.sources).toEqual({ [TenderSource.TED]: 1 });
        // typy: bez filtra typu, ale ze źródłem TED i statusem toEnter
        expect(counts.orderTypes).toEqual({ Delivery: 1, Services: 1 });
        // statusy: bez filtra statusu, ale ze źródłem TED i typem Delivery
        expect(counts.statuses).toEqual({ toEnter: 1, entered: 1 });
    });

    it('przetargi bez statusu liczy jako "unmarked"', () => {
        expect(countFacets(list, baseOptions).statuses.unmarked).toBe(1);
    });
});
