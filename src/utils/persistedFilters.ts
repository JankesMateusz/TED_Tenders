import { TenderSource } from '../types/TenderSource';
import { TENDER_STATUSES } from './tenderStatus';
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

export const defaultFilters = (): PersistedFilters => ({
    selectedSources: [...ALL_SOURCES],
    selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
    selectedBuyers: [],
    selectedCities: [],
    selectedCpvs: [],
    statusFilters: { ...NO_STATUS_FILTERS },
    sortOrder: DEFAULT_SORT_ORDER
});

/** Klucz zależy od konta, żeby na wspólnym komputerze każdy miał własne ustawienia. */
export const storageKey = (uid: string): string => `tenders.filters.v1.${uid}`;

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

    const statuses = data.statusFilters;
    if (statuses && typeof statuses === 'object') {
        for (const key of [...TENDER_STATUSES, 'unmarked'] as const) {
            filters.statusFilters[key] = (statuses as Record<string, unknown>)[key] === true;
        }
    }

    if (isSortOrder(data.sortOrder)) filters.sortOrder = data.sortOrder;

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
