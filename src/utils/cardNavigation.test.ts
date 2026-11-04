import { afterRemoval, nextActiveId } from './cardNavigation';

const ids = ['a', 'b', 'c'];

describe('przechodzenie po kartach (J/K)', () => {
    it('J przechodzi na następną, K na poprzednią', () => {
        expect(nextActiveId(ids, 'a', 'next')).toBe('b');
        expect(nextActiveId(ids, 'c', 'prev')).toBe('b');
    });

    it('na końcach listy zostaje na miejscu', () => {
        expect(nextActiveId(ids, 'c', 'next')).toBe('c');
        expect(nextActiveId(ids, 'a', 'prev')).toBe('a');
    });

    it('bez aktywnej karty (albo gdy zniknęła z listy) zaczyna od pierwszej', () => {
        expect(nextActiveId(ids, null, 'next')).toBe('a');
        expect(nextActiveId(ids, null, 'prev')).toBe('a');
        expect(nextActiveId(ids, 'zniknela', 'next')).toBe('a');
    });

    it('pusta lista nie ma aktywnej karty', () => {
        expect(nextActiveId([], null, 'next')).toBeNull();
        expect(nextActiveId([], 'a', 'prev')).toBeNull();
    });
});

describe('aktywna karta po zniknięciu poprzedniej', () => {
    it('zostaje następna', () => {
        expect(afterRemoval(ids, 'a')).toBe('b');
        expect(afterRemoval(ids, 'b')).toBe('c');
    });

    it('po ostatniej zostaje poprzednia', () => {
        expect(afterRemoval(ids, 'c')).toBe('b');
    });

    it('brak innych kart albo nieznane id daje null', () => {
        expect(afterRemoval(['a'], 'a')).toBeNull();
        expect(afterRemoval(ids, 'x')).toBeNull();
        expect(afterRemoval([], 'a')).toBeNull();
    });
});
