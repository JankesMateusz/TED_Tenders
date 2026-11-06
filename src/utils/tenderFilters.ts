import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { TenderStatus } from '../types/TenderStatus';
import { TenderLabel } from '../types/TenderLabel';
import { TENDER_LABELS } from './tenderLabels';
import { OrderType } from './tenderSources';
import { filterTendersByCpvCodes, normalizeCpv } from './cpvFilter';
import { normalizeName } from './stringUtils';
import { parseDate } from './dateUtils';
import { AdvertiserDecisions, isHiddenAdvertiser } from './advertisers';
import { DocsFilter } from '../types/DocsCheck';
import { docsFilterOf } from './docsCheck';
import { CpvCategoryKey, tenderHasCpvCategory } from './cpvCategories';

export type SortOrder = 'publication' | 'publicationAsc' | 'deadline' | 'buyer' | 'buyerDesc';

export const DEFAULT_SORT_ORDER: SortOrder = 'publication';

export const isSortOrder = (value: unknown): value is SortOrder =>
    value === 'publication' || value === 'publicationAsc' || value === 'deadline' || value === 'buyer' || value === 'buyerDesc';

interface FilterOptions {
    selectedSources: TenderSource[];
    selectedOrderTypes: OrderType[];
    /** Wybrani zamawiający; pusta lista oznacza brak filtra, a przetarg musi pasować do któregokolwiek z nich. */
    selectedBuyers: string[];
    /** Wybrane miasta; pusta lista oznacza brak filtra. */
    selectedCities: string[];
    /** Kody CPV wybrane w statystykach; pusta lista oznacza brak filtra, a przetarg musi zawierać któryś z nich. */
    selectedCpvs: string[];
    /** Kategoria CPV wybrana w statystykach (nie jest zapamiętywana w przeglądarce); brak lub null oznacza brak filtra. */
    selectedCpvCategory?: CpvCategoryKey | null;
    isFiltered: boolean;
    searchQuery: string;
    statusFilters: StatusFilters;
    /** Wybrane etykiety; pusta lub brak oznacza brak filtra, a przetarg musi mieć którąkolwiek z nich. */
    selectedLabels?: TenderLabel[];
    /** Wybrane stany dokumentów; pusta lub brak oznacza brak filtra, a przetarg musi pasować do któregokolwiek. */
    selectedDocs?: DocsFilter[];
    sortOrder?: SortOrder;
    /** Ręczne decyzje o zamawiających (po NIP); bez nich rozstrzyga sektor ustalony automatycznie. */
    advertiserDecisions?: AdvertiserDecisions;
    /** Czy pokazać także ogłoszenia ukrytych zamawiających (domyślnie są ukryte). */
    showHiddenAdvertisers?: boolean;
}

/** Które statusy (lub brak statusu) mają być widoczne; gdy żaden nie jest wybrany, filtr jest wyłączony. */
export type StatusFilters = Record<TenderStatus | 'unmarked', boolean>;

/** Wymiary filtrów, które mają własne liczniki ("ile wyników dałoby wybranie tej opcji"). */
export type FilterDimension = 'source' | 'orderType' | 'buyer' | 'city' | 'status' | 'label' | 'docs';

const matchesAny = (value: string, selected: string[]): boolean => {
    const normalizedValue = normalizeName(value);
    return selected.some((item) => normalizeName(item) === normalizedValue);
};

/**
 * Filtruje przetargi według kryteriów, bez sortowania. Wymiar podany w `skip` jest pomijany, co pozwala
 * policzyć, ile przetargów pasowałoby do każdej opcji tego filtra przy pozostałych filtrach bez zmian.
 */
export const filterTenders = (
    tenders: Tender[],
    options: FilterOptions,
    skip?: FilterDimension
): Tender[] => {
    let result = [...tenders];

    // Ukryci zamawiający (firmy prywatne i NGO wg automatu albo ręcznej decyzji) znikają, chyba że poproszono o ich pokazanie
    if (!options.showHiddenAdvertisers) {
        result = result.filter(tender => !isHiddenAdvertiser(tender, options.advertiserDecisions));
    }

    // Filtrowanie po źródle
    if (skip !== 'source') {
        result = result.filter(tender => options.selectedSources.includes(tender.source));
    }

    // Filtrowanie po typie zamówienia; przetargi bez znanego typu (np. starsze zapisy z TED) zostają widoczne
    if (skip !== 'orderType') {
        result = result.filter(tender => !tender.orderType || options.selectedOrderTypes.includes(tender.orderType));
    }

    // Filtrowanie po zamawiających z użyciem znormalizowanej nazwy
    if (skip !== 'buyer' && options.selectedBuyers.length > 0) {
        result = result.filter(tender => matchesAny(tender.buyerName, options.selectedBuyers));
    }

    // Filtrowanie po miastach z użyciem znormalizowanej nazwy
    if (skip !== 'city' && options.selectedCities.length > 0) {
        result = result.filter(tender => matchesAny(tender.buyerCity, options.selectedCities));
    }

    // Filtrowanie po wybranych kodach CPV
    if (options.selectedCpvs.length > 0) {
        const selected = options.selectedCpvs.map(normalizeCpv);
        result = result.filter(tender => tender.cpvCodes.some(cpv => selected.includes(normalizeCpv(cpv))));
    }

    if (options.selectedCpvCategory) {
        const category = options.selectedCpvCategory;
        result = result.filter(tender => tenderHasCpvCategory(tender.cpvCodes, category));
    }

    // Filtrowanie po CPV jeśli włączone
    if (options.isFiltered) {
        result = filterTendersByCpvCodes(result);
    }

    // Filtrowanie po wyszukiwaniu
    if (options.searchQuery.trim()) {
        const query = options.searchQuery.trim().toLowerCase();
        result = result.filter(tender => {
            // Wyszukiwanie po tytule
            if (tender.title?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po zamawiającym
            if (tender.buyerName?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po mieście
            if (tender.buyerCity?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po numerze publikacji
            if (tender.publicationNumber?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po kodach CPV
            if (tender.cpvCodes?.some((cpv: string) => cpv.toLowerCase().includes(query))) return true;
            return false;
        });
    }

    // Filtrowanie po statusach (OR - wystarczy jeden wybrany status)
    if (skip !== 'status' && Object.values(options.statusFilters).some(Boolean)) {
        result = result.filter(tender => options.statusFilters[tender.status ?? 'unmarked']);
    }

    // Filtrowanie po etykietach (OR - wystarczy jedna z wybranych)
    const selectedLabels = options.selectedLabels ?? [];
    if (skip !== 'label' && selectedLabels.length > 0) {
        result = result.filter(tender => tender.labels?.some(label => selectedLabels.includes(label)));
    }

    // Filtrowanie po stanie dokumentów (OR); przetarg bez wyniku sprawdzenia nie pasuje do żadnej opcji
    const selectedDocs = options.selectedDocs ?? [];
    if (skip !== 'docs' && selectedDocs.length > 0) {
        result = result.filter(tender => {
            const docs = docsFilterOf(tender);
            return docs !== undefined && selectedDocs.includes(docs);
        });
    }

    return result;
};

/** Od najnowszej publikacji; w obrębie dnia po godzinie (jeśli źródło ją podaje). */
const comparePublication = (a: Tender, b: Tender): number => {
    const dateA = parseDate(a.publicationDate).getTime();
    const dateB = parseDate(b.publicationDate).getTime();
    if (dateA !== dateB) {
        return dateB - dateA;
    }
    return (b.publicationTime ?? '').localeCompare(a.publicationTime ?? '');
};

/**
 * Najpierw terminy dzisiejsze i przyszłe (najbliższy pierwszy), potem przeterminowane (najświeższy pierwszy),
 * na końcu przetargi bez terminu. Remisy rozstrzyga kolejność publikacji.
 */
const compareDeadline = (a: Tender, b: Tender, today: number): number => {
    const rank = (tender: Tender): { group: number; time: number } => {
        const time = parseDate(tender.deadlineDate).getTime();
        // parseDate zwraca epokę dla braku terminu ("Brak terminu") i błędnej daty
        if (time === 0) return { group: 2, time: 0 };
        return time >= today ? { group: 0, time } : { group: 1, time: -time };
    };
    const rankA = rank(a);
    const rankB = rank(b);
    if (rankA.group !== rankB.group) return rankA.group - rankB.group;
    if (rankA.time !== rankB.time) return rankA.time - rankB.time;
    return comparePublication(a, b);
};

const compareBuyer = (a: Tender, b: Tender): number =>
    a.buyerName.localeCompare(b.buyerName, 'pl') || comparePublication(a, b);

/**
 * Filtruje i sortuje przetargi według podanych kryteriów
 */
export const filterAndSortTenders = (
    tenders: Tender[],
    options: FilterOptions,
    now: Date = new Date()
): Tender[] => {
    const result = filterTenders(tenders, options);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    switch (options.sortOrder ?? DEFAULT_SORT_ORDER) {
        case 'deadline':
            result.sort((a, b) => compareDeadline(a, b, today));
            break;
        case 'buyer':
            result.sort(compareBuyer);
            break;
        case 'buyerDesc':
            result.sort((a, b) => b.buyerName.localeCompare(a.buyerName, 'pl') || comparePublication(a, b));
            break;
        case 'publicationAsc':
            result.sort((a, b) => comparePublication(b, a));
            break;
        default:
            result.sort(comparePublication);
    }

    return result;
};

export interface FacetCounts {
    sources: Partial<Record<TenderSource, number>>;
    orderTypes: Partial<Record<OrderType, number>>;
    statuses: Partial<Record<TenderStatus | 'unmarked', number>>;
    /** Przetarg z kilkoma etykietami liczy się przy każdej z nich. */
    labels: Partial<Record<TenderLabel, number>>;
    docs: Partial<Record<DocsFilter, number>>;
}

const countBy = <K extends string>(
    tenders: Tender[],
    key: (tender: Tender) => K | undefined
): Partial<Record<K, number>> => {
    const counts: Partial<Record<K, number>> = {};
    for (const tender of tenders) {
        const value = key(tender);
        if (value !== undefined) counts[value] = (counts[value] ?? 0) + 1;
    }
    return counts;
};

const countLabels = (tenders: Tender[]): Partial<Record<TenderLabel, number>> => {
    const counts: Partial<Record<TenderLabel, number>> = {};
    for (const tender of tenders) {
        for (const label of tender.labels ?? []) {
            if (TENDER_LABELS.includes(label)) counts[label] = (counts[label] ?? 0) + 1;
        }
    }
    return counts;
};

/** Liczniki opcji filtrów: ile przetargów zostałoby po wybraniu danej opcji przy pozostałych filtrach bez zmian. */
export const countFacets = (tenders: Tender[], options: FilterOptions): FacetCounts => ({
    sources: countBy(filterTenders(tenders, options, 'source'), (tender) => tender.source),
    orderTypes: countBy(filterTenders(tenders, options, 'orderType'), (tender) => tender.orderType),
    statuses: countBy(filterTenders(tenders, options, 'status'), (tender) => tender.status ?? 'unmarked'),
    labels: countLabels(filterTenders(tenders, options, 'label')),
    docs: countBy(filterTenders(tenders, options, 'docs'), docsFilterOf)
});
