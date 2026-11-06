import { TenderSource } from '../types/TenderSource';
import { TENDER_STATUSES } from './tenderStatus';
import { TenderLabel } from '../types/TenderLabel';
import { TENDER_LABELS } from './tenderLabels';
import { DocsFilter } from '../types/DocsCheck';
import { DOCS_FILTERS } from './docsCheck';
import { DEFAULT_ORDER_TYPES } from '../constants';
import { OrderType } from './tenderSources';
import { DEFAULT_SORT_ORDER, SortOrder, StatusFilters, isSortOrder } from './tenderFilters';

/** Filtry i sortowanie zapamiętywane w przeglądarce. Wyszukiwana fraza i zakres dat są celowo pomijane. */
export interface PersistedFilters {
    selectedSources: TenderSource[];
    selectedOrderTypes: OrderType[];
    selectedBuyers: string[];
    selectedCities: string[];
    selectedCpvs: string[];
    statusFilters: StatusFilters;
    selectedLabels: TenderLabel[];
    selectedDocs: DocsFilter[];
    sortOrder: SortOrder;
}

export const ALL_SOURCES: TenderSource[] = [
    TenderSource.TED,
    TenderSource.E_ZAMOWIENIA,
    TenderSource.BAZA_KONKURENCYJNOSCI
];

export const NO_STATUS_FILTERS: StatusFilters = {
    toEnter: false,
    entered: false,
    toClarify: false,
    notToEnter: false,
    unmarked: false
};

/** Domyślny widok to kolejka pracy: ogłoszenia, których nikt jeszcze nie ocenił. */
export const DEFAULT_STATUS_FILTERS: StatusFilters = { ...NO_STATUS_FILTERS, unmarked: true };

/** Czy filtr statusu to domyślna kolejka pracy (same "Nieoznaczone"). */
export const isQueueStatusFilter = (filters: StatusFilters): boolean =>
    (Object.keys(DEFAULT_STATUS_FILTERS) as Array<keyof StatusFilters>).every(
        (key) => filters[key] === DEFAULT_STATUS_FILTERS[key]
    );

export const defaultFilters = (): PersistedFilters => ({
    selectedSources: [...ALL_SOURCES],
    selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
    selectedBuyers: [],
    selectedCities: [],
    selectedCpvs: [],
    statusFilters: { ...DEFAULT_STATUS_FILTERS },
    selectedLabels: [],
    selectedDocs: [],
    sortOrder: DEFAULT_SORT_ORDER
});

/**
 * Klucz zależy od konta, żeby na wspólnym komputerze każdy miał własne ustawienia.
 * v2: zmieniony domyślny filtr statusu ("Nieoznaczone"); w v1 zapisany pusty filtr był nie do odróżnienia od
 * świadomego wyboru, więc stare zapisy porzucamy zamiast zostawiać wszystkim widok bez kolejki pracy.
 */
export const storageKey = (uid: string): string => `tenders.filters.v2.${uid}`;

const pickStrings = (value: unknown, allowed?: readonly string[]): string[] | null => {
    if (!Array.isArray(value)) return null;
    return value.filter(
        (item): item is string => typeof item === 'string' && (!allowed || allowed.includes(item))
    );
};

/** Odczytuje zapisane filtry; każde niepoprawne pole wraca do wartości domyślnej, a nie psuje całości. */
export const parsePersistedFilters = (raw: string | null): PersistedFilters => {
    const filters = defaultFilters();
    if (!raw) return filters;

    let data: Record<string, unknown>;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return filters;
        data = parsed as Record<string, unknown>;
    } catch {
        return filters;
    }

    const sources = pickStrings(data.selectedSources, ALL_SOURCES);
    if (sources) filters.selectedSources = sources as TenderSource[];

    const orderTypes = pickStrings(data.selectedOrderTypes, DEFAULT_ORDER_TYPES);
    if (orderTypes) filters.selectedOrderTypes = orderTypes as OrderType[];

    filters.selectedBuyers = pickStrings(data.selectedBuyers) ?? filters.selectedBuyers;
    filters.selectedCities = pickStrings(data.selectedCities) ?? filters.selectedCities;
    filters.selectedCpvs = pickStrings(data.selectedCpvs) ?? filters.selectedCpvs;

    const labels = pickStrings(data.selectedLabels, TENDER_LABELS);
    if (labels) filters.selectedLabels = labels as TenderLabel[];

    const docs = pickStrings(data.selectedDocs, DOCS_FILTERS);
    if (docs) filters.selectedDocs = docs as DocsFilter[];

    const statuses = data.statusFilters;
    if (statuses && typeof statuses === 'object') {
        for (const key of [...TENDER_STATUSES, 'unmarked'] as const) {
            filters.statusFilters[key] = (statuses as Record<string, unknown>)[key] === true;
        }
    }

    // Sortowanie po terminie składania zniknęło z listy opcji; zapis z tą wartością wraca do domyślnego
    if (isSortOrder(data.sortOrder) && data.sortOrder !== 'deadline') filters.sortOrder = data.sortOrder;

    return filters;
};

export const loadFilters = (uid: string | null): PersistedFilters => {
    if (!uid) return defaultFilters();
    try {
        return parsePersistedFilters(window.localStorage.getItem(storageKey(uid)));
    } catch {
        // localStorage bywa zablokowany (tryb prywatny, polityka przeglądarki); filtry po prostu nie są pamiętane
        return defaultFilters();
    }
};

export const saveFilters = (uid: string | null, filters: PersistedFilters): void => {
    if (!uid) return;
    try {
        window.localStorage.setItem(storageKey(uid), JSON.stringify(filters));
    } catch (error) {
        console.warn('Nie udało się zapisać filtrów w przeglądarce:', error);
    }
};
