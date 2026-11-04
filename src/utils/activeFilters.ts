import { TenderSource } from '../types/TenderSource';
import { DEFAULT_ORDER_TYPES } from '../constants';
import { getCpvName } from './cpvMapping';
import { CPV_CATEGORY_LABELS, CpvCategoryKey } from './cpvCategories';
import { ALL_SOURCES } from './persistedFilters';
import { StatusFilters } from './tenderFilters';
import { getOrderTypeConfig, getSourceConfig, OrderType } from './tenderSources';
import { STATUS_CONFIG, TENDER_STATUSES } from './tenderStatus';

/**
 * Rodzaj chipa decyduje o tym, co robi jego ✕:
 * - `status`: odznacza jeden status; `allStatuses` zdejmuje filtr statusu;
 * - `sources` i `orderTypes`: jeden chip na cały wybór, ✕ przywraca wszystkie wartości;
 * - pozostałe: usuwają jedną wartość (`value`).
 */
export type ActiveFilterKind =
    | 'status'
    | 'allStatuses'
    | 'sources'
    | 'orderTypes'
    | 'buyer'
    | 'city'
    | 'cpv'
    | 'cpvCategory';

export interface ActiveFilterChip {
    id: string;
    label: string;
    kind: ActiveFilterKind;
    /** Klucz statusu, nazwa zamawiającego lub miasta, kod CPV, klucz kategorii; brak dla chipów zbiorczych. */
    value?: string;
}

export interface ActiveFilterInput {
    statusFilters: StatusFilters;
    selectedSources: TenderSource[];
    selectedOrderTypes: OrderType[];
    selectedBuyers: string[];
    selectedCities: string[];
    selectedCpvs: string[];
    selectedCpvCategory: CpvCategoryKey | null;
}

const STATUS_KEYS: Array<keyof StatusFilters> = [...TENDER_STATUSES, 'unmarked'];

const statusLabel = (key: keyof StatusFilters): string =>
    key === 'unmarked' ? 'Nieoznaczone' : STATUS_CONFIG[key].label;

const statusChips = (filters: StatusFilters): ActiveFilterChip[] => {
    const selected = STATUS_KEYS.filter((key) => filters[key]);
    // Domyślna kolejka (same "Nieoznaczone") i brak wyboru nie są chipami; brak wyboru znaczy "bez filtra".
    if (selected.length === 0) return [];
    if (selected.length === 1 && selected[0] === 'unmarked') return [];
    if (selected.length === STATUS_KEYS.length) {
        return [{ id: 'allStatuses', label: 'Wszystkie statusy', kind: 'allStatuses' }];
    }
    return selected.map((key) => ({ id: `status:${key}`, label: statusLabel(key), kind: 'status', value: key }));
};

/** Zbiera wszystko, co zawęża listę, w stałej kolejności: statusy, źródła, typy, zamawiający, miasta, CPV. Fraza wyszukiwania ma własne pole. */
export const buildActiveFilterChips = (input: ActiveFilterInput): ActiveFilterChip[] => {
    const chips = statusChips(input.statusFilters);

    if (input.selectedSources.length < ALL_SOURCES.length) {
        const labels = ALL_SOURCES.filter((source) => input.selectedSources.includes(source))
            .map((source) => getSourceConfig(source).label);
        chips.push({ id: 'sources', label: `Źródło: ${labels.length > 0 ? labels.join(', ') : 'brak'}`, kind: 'sources' });
    }

    if (input.selectedOrderTypes.length < DEFAULT_ORDER_TYPES.length) {
        const labels = DEFAULT_ORDER_TYPES.filter((type) => input.selectedOrderTypes.includes(type))
            .map((type) => getOrderTypeConfig(type).label);
        chips.push({ id: 'orderTypes', label: `Typ: ${labels.length > 0 ? labels.join(', ') : 'brak'}`, kind: 'orderTypes' });
    }

    input.selectedBuyers.forEach((buyer) =>
        chips.push({ id: `buyer:${buyer}`, label: `Zamawiający: ${buyer}`, kind: 'buyer', value: buyer }));
    input.selectedCities.forEach((city) =>
        chips.push({ id: `city:${city}`, label: `Miasto: ${city}`, kind: 'city', value: city }));
    input.selectedCpvs.forEach((code) =>
        chips.push({ id: `cpv:${code}`, label: `CPV: ${getCpvName(code)} (${code})`, kind: 'cpv', value: code }));
    if (input.selectedCpvCategory) {
        chips.push({
            id: 'cpvCategory',
            label: `Kategoria CPV: ${CPV_CATEGORY_LABELS[input.selectedCpvCategory]}`,
            kind: 'cpvCategory',
            value: input.selectedCpvCategory
        });
    }

    return chips;
};
