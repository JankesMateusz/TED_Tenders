import { TenderSource } from '../types/TenderSource';
import { NO_STATUS_FILTERS, defaultFilters, parsePersistedFilters, storageKey } from './persistedFilters';

describe('odczyt zapisanych filtrów', () => {
    it('bez zapisu lub z uszkodzonym zapisem zwraca domyślne filtry', () => {
        expect(parsePersistedFilters(null)).toEqual(defaultFilters());
        expect(parsePersistedFilters('{nie json')).toEqual(defaultFilters());
        expect(parsePersistedFilters('42')).toEqual(defaultFilters());
    });

    it('odtwarza zapisane wartości', () => {
        const saved = {
            selectedSources: [TenderSource.TED],
            selectedOrderTypes: ['Delivery'],
            selectedBuyers: ['Urząd'],
            selectedCities: ['Kraków'],
            selectedCpvs: ['30213100-6'],
            statusFilters: { toEnter: true, entered: false, toClarify: false, notToEnter: false, unmarked: true },
            sortOrder: 'buyer'
        };
        expect(parsePersistedFilters(JSON.stringify(saved))).toEqual(saved);
    });

    it('zapisane sortowanie po terminie składania wraca do daty publikacji', () => {
        const parsed = parsePersistedFilters(JSON.stringify({ sortOrder: 'deadline', selectedBuyers: ['Urząd'] }));
        expect(parsed.sortOrder).toBe('publication');
        expect(parsed.selectedBuyers).toEqual(['Urząd']);
    });

    it('odrzuca nieznane wartości, ale zachowuje poprawne pola', () => {
        const parsed = parsePersistedFilters(
            JSON.stringify({
                selectedSources: [TenderSource.TED, 'NIEZNANE'],
                selectedOrderTypes: 'Delivery',
                selectedBuyers: ['Urząd', 5],
                sortOrder: 'losowo'
            })
        );
        expect(parsed.selectedSources).toEqual([TenderSource.TED]);
        expect(parsed.selectedOrderTypes).toEqual(defaultFilters().selectedOrderTypes);
        expect(parsed.selectedBuyers).toEqual(['Urząd']);
        expect(parsed.sortOrder).toBe('publication');
    });

    it('domyślnie pokazuje kolejkę pracy: tylko nieoznaczone, od najnowszych', () => {
        const filters = defaultFilters();
        expect(filters.statusFilters).toEqual({ ...NO_STATUS_FILTERS, unmarked: true });
        expect(filters.sortOrder).toBe('publication');
    });

    it('wybiera domyślny filtr statusu, gdy zapis go nie zawiera', () => {
        const parsed = parsePersistedFilters(JSON.stringify({ selectedBuyers: ['Urząd'] }));
        expect(parsed.statusFilters.unmarked).toBe(true);
    });

    it('zachowuje świadomie zapisany brak filtra statusu', () => {
        const parsed = parsePersistedFilters(JSON.stringify({ statusFilters: NO_STATUS_FILTERS }));
        expect(parsed.statusFilters).toEqual(NO_STATUS_FILTERS);
    });

    it('używa klucza v2, żeby stare zapisy bez kolejki pracy nie przesłaniały nowego domyślnego widoku', () => {
        expect(storageKey('abc')).toBe('tenders.filters.v2.abc');
    });
});
