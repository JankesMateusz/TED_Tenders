import { TenderSource } from '../types/TenderSource';
import { DEFAULT_ORDER_TYPES } from '../constants';
import { ActiveFilterInput, buildActiveFilterChips } from './activeFilters';
import { ALL_SOURCES, DEFAULT_STATUS_FILTERS, NO_STATUS_FILTERS } from './persistedFilters';

const baseInput = (): ActiveFilterInput => ({
    statusFilters: { ...DEFAULT_STATUS_FILTERS },
    selectedSources: [...ALL_SOURCES],
    selectedOrderTypes: [...DEFAULT_ORDER_TYPES],
    selectedBuyers: [],
    selectedCities: [],
    selectedCpvs: [],
    selectedCpvCategory: null,
    selectedLabels: []
});

const labels = (input: ActiveFilterInput) => buildActiveFilterChips(input).map((chip) => chip.label);

describe('chipy aktywnych filtrów', () => {
    it('w stanie domyślnym (kolejka "Nieoznaczone") nie ma chipów', () => {
        expect(buildActiveFilterChips(baseInput())).toEqual([]);
    });

    it('brak wyboru statusu też nie daje chipów', () => {
        expect(buildActiveFilterChips({ ...baseInput(), statusFilters: { ...NO_STATUS_FILTERS } })).toEqual([]);
    });

    it('zaznaczone wszystkie statusy to jeden chip', () => {
        const all = { toEnter: true, entered: true, toClarify: true, notToEnter: true, unmarked: true };
        expect(buildActiveFilterChips({ ...baseInput(), statusFilters: all })).toEqual([
            { id: 'allStatuses', label: 'Wszystkie statusy', kind: 'allStatuses' }
        ]);
    });

    it('każdy wybrany status to osobny chip, w kolejności filtrów', () => {
        const statusFilters = { ...NO_STATUS_FILTERS, unmarked: true, entered: true, toEnter: true };
        expect(buildActiveFilterChips({ ...baseInput(), statusFilters })).toEqual([
            { id: 'status:toEnter', label: 'Do wpisania', kind: 'status', value: 'toEnter' },
            { id: 'status:entered', label: 'Wpisany', kind: 'status', value: 'entered' },
            { id: 'status:unmarked', label: 'Nieoznaczone', kind: 'status', value: 'unmarked' }
        ]);
    });

    it('pojedynczy status inny niż "Nieoznaczone" jest chipem', () => {
        const statusFilters = { ...NO_STATUS_FILTERS, notToEnter: true };
        expect(labels({ ...baseInput(), statusFilters })).toEqual(['Nie do wpisania']);
    });

    it('źródła i typy dają po jednym chipie zbiorczym, tylko gdy wybrano mniej niż wszystkie', () => {
        const input = {
            ...baseInput(),
            selectedSources: [TenderSource.E_ZAMOWIENIA, TenderSource.TED],
            selectedOrderTypes: ['Services' as const]
        };
        const chips = buildActiveFilterChips(input);
        expect(chips.map((chip) => chip.kind)).toEqual(['sources', 'orderTypes']);
        expect(chips[0].label).toMatch(/^Źródło: TED, /);
        expect(chips[1].label).toMatch(/^Typ: /);
    });

    it('pusty wybór źródeł pokazuje "brak"', () => {
        expect(labels({ ...baseInput(), selectedSources: [] })).toEqual(['Źródło: brak']);
    });

    it('zamawiający, miasta, kody i kategoria CPV mają stałą kolejność', () => {
        const chips = buildActiveFilterChips({
            ...baseInput(),
            selectedCpvCategory: 'other',
            selectedCpvs: ['30213100-6'],
            selectedCities: ['Kraków'],
            selectedBuyers: ['Urząd A', 'Urząd B'],
            statusFilters: { ...NO_STATUS_FILTERS, entered: true }
        });
        expect(chips.map((chip) => chip.id)).toEqual([
            'status:entered',
            'buyer:Urząd A',
            'buyer:Urząd B',
            'city:Kraków',
            'cpv:30213100-6',
            'cpvCategory'
        ]);
        expect(chips[4].label).toContain('30213100-6');
        expect(chips[4].value).toBe('30213100-6');
    });
});

describe('chipy etykiet', () => {
    it('każda wybrana etykieta ma własny chip, zaraz po statusach', () => {
        const input = { ...baseInput(), selectedLabels: ['important' as const, 'hard' as const] };
        expect(buildActiveFilterChips(input)).toEqual([
            { id: 'label:important', label: 'Etykieta: WAŻNY!', kind: 'label', value: 'important' },
            { id: 'label:hard', label: 'Etykieta: TRUDNY', kind: 'label', value: 'hard' }
        ]);
    });
});
