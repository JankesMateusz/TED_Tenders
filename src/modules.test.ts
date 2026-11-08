import { AppModule, enabledModules, moduleForHash } from './modules';

const modules = (ordersEnabled: boolean): AppModule[] => [
    { id: 'tenders', label: 'Przetargi', hash: '', enabled: true },
    { id: 'orders', label: 'Zamówienia', hash: '#/zamowienia', enabled: ordersEnabled },
];

describe('moduleForHash', () => {
    it('pusty hash i nieznane adresy prowadzą do przetargów', () => {
        expect(moduleForHash('', modules(true))).toBe('tenders');
        expect(moduleForHash('#', modules(true))).toBe('tenders');
        expect(moduleForHash('#/cos-innego', modules(true))).toBe('tenders');
    });

    it('rozpoznaje moduł zamówień także z podścieżką i ukośnikiem na końcu', () => {
        expect(moduleForHash('#/zamowienia', modules(true))).toBe('orders');
        expect(moduleForHash('#/zamowienia/', modules(true))).toBe('orders');
        expect(moduleForHash('#/zamowienia/123', modules(true))).toBe('orders');
    });

    it('nie dopasowuje adresów o podobnym początku', () => {
        expect(moduleForHash('#/zamowienia-stare', modules(true))).toBe('tenders');
        expect(moduleForHash('#/zamowieniaX/1', modules(true))).toBe('tenders');
    });

    it('wyłączony moduł nie jest dostępny przez adres', () => {
        expect(moduleForHash('#/zamowienia', modules(false))).toBe('tenders');
        expect(moduleForHash('#/zamowienia/123', modules(false))).toBe('tenders');
    });
});

describe('enabledModules', () => {
    it('zwraca tylko włączone moduły', () => {
        expect(enabledModules(modules(false)).map((m) => m.id)).toEqual(['tenders']);
        expect(enabledModules(modules(true)).map((m) => m.id)).toEqual(['tenders', 'orders']);
    });
});
