import { getEmptyStateKind } from './emptyState';

const base = { rangeCount: 12, isQueueEmpty: false, hasActiveFilters: false, isItOnly: false };

describe('getEmptyStateKind', () => {
    it('brak ogłoszeń w zakresie to brak danych, niezależnie od filtrów', () => {
        expect(getEmptyStateKind({ ...base, rangeCount: 0, hasActiveFilters: true, isQueueEmpty: true })).toBe('noData');
    });

    it('wszystkie ocenione w kolejce to pusta kolejka', () => {
        expect(getEmptyStateKind({ ...base, isQueueEmpty: true })).toBe('queueEmpty');
    });

    it('filtry lub wyszukiwanie to przyczyna "filtered", także przy włączonym "Tylko IT"', () => {
        expect(getEmptyStateKind({ ...base, hasActiveFilters: true })).toBe('filtered');
        expect(getEmptyStateKind({ ...base, hasActiveFilters: true, isItOnly: true })).toBe('filtered');
    });

    it('"Tylko IT" bez innych filtrów to brak ogłoszeń IT', () => {
        expect(getEmptyStateKind({ ...base, isItOnly: true })).toBe('noIt');
    });

    it('w pozostałych przypadkach wyjaśnia, co nie trafia na listę', () => {
        expect(getEmptyStateKind(base)).toBe('other');
    });
});
