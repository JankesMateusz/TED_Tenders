import { TenderSource } from '../types/TenderSource';
import { defaultFilters, parsePersistedFilters } from './persistedFilters';

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
            sortOrder: 'deadline'
        };
        expect(parsePersistedFilters(JSON.stringify(saved))).toEqual(saved);
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
});
