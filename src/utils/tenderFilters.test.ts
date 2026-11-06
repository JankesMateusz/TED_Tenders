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

    it('po zamawiającym od Z do A, remisy nadal od najnowszej publikacji', () => {
        const buyers: Tender[] = [
            { ...tender('z'), buyerName: 'Żłobek' },
            { ...tender('a1'), buyerName: 'Urząd', publicationDate: '20-10-2026' },
            { ...tender('a2'), buyerName: 'Urząd', publicationDate: '28-10-2026' },
            { ...tender('s'), buyerName: 'Szpital' }
        ];
        expect(order('buyerDesc', buyers)).toEqual(['z', 'a2', 'a1', 's']);
    });

    it('od najstarszej publikacji: w obrębie dnia najpierw przetargi bez godziny (TED), potem wg godziny', () => {
        const day: Tender[] = [
            { ...tender('pozno'), publicationDate: '29-10-2026', publicationTime: '14:00' },
            { ...tender('ted'), publicationDate: '29-10-2026' },
            { ...tender('stary'), publicationDate: '20-10-2026' },
            { ...tender('rano'), publicationDate: '29-10-2026', publicationTime: '08:00' }
        ];
        expect(order('publicationAsc', day)).toEqual(['stary', 'ted', 'rano', 'pozno']);
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

describe('filtr ukrytych zamawiających', () => {
    const list = [
        { ...tender('prywatna'), buyerNip: '1111111111', buyerSectorAuto: 'private' as const },
        { ...tender('gmina'), buyerNip: '2222222222', buyerSectorAuto: 'public' as const },
        { ...tender('przywrocona'), buyerNip: '3333333333', buyerSectorAuto: 'private' as const },
        { ...tender('reczne'), buyerNip: '4444444444', buyerSectorAuto: 'unknown' as const },
        tender('ted')
    ];
    const decisions = { '3333333333': 'visible' as const, '4444444444': 'hidden' as const };
    const ids = (options: { showHiddenAdvertisers?: boolean; advertiserDecisions?: typeof decisions }) =>
        filterAndSortTenders(list, { ...baseOptions, ...options }).map((t) => t.id).sort();

    it('domyślnie ukrywa firmy prywatne wg automatu i ręcznie ukrytych, ręcznie przywróconych zostawia', () => {
        expect(ids({ advertiserDecisions: decisions })).toEqual(['gmina', 'przywrocona', 'ted']);
    });

    it('bez ręcznych decyzji rozstrzyga sam automat', () => {
        expect(ids({})).toEqual(['gmina', 'reczne', 'ted']);
    });

    it('na prośbę pokazuje także ukrytych', () => {
        expect(ids({ advertiserDecisions: decisions, showHiddenAdvertisers: true })).toEqual(['gmina', 'prywatna', 'przywrocona', 'reczne', 'ted']);
    });
});

describe('filtr po kategorii CPV', () => {
    const withCpv = (id: string, cpvCodes: string[]): Tender => ({ ...tender(id), cpvCodes });
    const list = [
        withCpv('k', ['30213100-6']),
        withCpv('o', ['48000000-8']),
        withCpv('m', ['30213100-6', '48000000-8']),
        withCpv('n', ['45000000-7'])
    ];
    const run = (selectedCpvCategory: 'computers' | 'software' | null) =>
        filterAndSortTenders(list, {
            selectedSources: [TenderSource.TED],
            selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
            selectedBuyers: [],
            selectedCities: [],
            selectedCpvs: [],
            selectedCpvCategory,
            isFiltered: false,
            searchQuery: '',
            statusFilters: noFilters
        }).map((t) => t.id).sort();

    it('pokazuje przetargi z kodem z wybranej kategorii', () => {
        expect(run('computers')).toEqual(['k', 'm']);
        expect(run('software')).toEqual(['m', 'o']);
    });

    it('bez wybranej kategorii niczego nie zawęża', () => {
        expect(run(null)).toEqual(['k', 'm', 'n', 'o']);
    });
});

describe('filtr po etykietach', () => {
    const labelled: Tender[] = [
        { ...tender('a'), labels: ['important', 'hard'] },
        { ...tender('b'), labels: ['simple'] },
        { ...tender('c'), labels: ['important'] },
        tender('d')
    ];
    const options = {
        selectedSources: [TenderSource.TED],
        selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
        selectedBuyers: [],
        selectedCities: [],
        selectedCpvs: [],
        isFiltered: false,
        searchQuery: '',
        statusFilters: noFilters
    };
    const ids = (selectedLabels: Tender['labels']) =>
        filterAndSortTenders(labelled, { ...options, selectedLabels }).map((t) => t.id).sort();

    it('bez wybranej etykiety pokazuje wszystko', () => {
        expect(ids([])).toEqual(['a', 'b', 'c', 'd']);
    });

    it('jedna etykieta zostawia przetargi, które ją mają', () => {
        expect(ids(['important'])).toEqual(['a', 'c']);
    });

    it('kilka etykiet działa jak "lub"', () => {
        expect(ids(['simple', 'hard'])).toEqual(['a', 'b']);
    });

    it('liczniki liczą przetarg przy każdej jego etykiecie i ignorują własny filtr', () => {
        const counts = countFacets(labelled, { ...options, selectedLabels: ['simple'] }).labels;
        expect(counts).toEqual({ important: 2, hard: 1, simple: 1 });
    });
});

describe('filtr po dokumentach', () => {
    const withDocs = (id: string, state?: NonNullable<Tender['docsCheck']>['state']): Tender => ({
        ...tender(id),
        ...(state && { docsCheck: { state } })
    });
    const list = [withDocs('a', 'available'), withDocs('b', 'none'), withDocs('c', 'unsupported'), withDocs('d', 'profile'), withDocs('e', 'error'), withDocs('f')];
    const options = {
        selectedSources: [TenderSource.TED],
        selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
        selectedBuyers: [],
        selectedCities: [],
        selectedCpvs: [],
        isFiltered: false,
        searchQuery: '',
        statusFilters: noFilters
    };
    const ids = (selectedDocs: Array<'available' | 'none' | 'otherPlatform'>) =>
        filterAndSortTenders(list, { ...options, selectedDocs }).map((t) => t.id).sort();

    it('bez wyboru pokazuje wszystko, także niesprawdzone', () => {
        expect(ids([])).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    it('„Są dokumenty" i „Brak dokumentów" pasują tylko do swojego stanu (błąd nie jest brakiem)', () => {
        expect(ids(['available'])).toEqual(['a']);
        expect(ids(['none'])).toEqual(['b']);
    });

    it('„Inna platforma" łączy platformy nieobsługiwane i profile zamawiających', () => {
        expect(ids(['otherPlatform'])).toEqual(['c', 'd']);
    });

    it('kilka wyborów działa jak „lub", a liczniki ignorują własny filtr', () => {
        expect(ids(['available', 'none'])).toEqual(['a', 'b']);
        expect(countFacets(list, { ...options, selectedDocs: ['available'] }).docs).toEqual({ available: 1, none: 1, otherPlatform: 2 });
    });
});
