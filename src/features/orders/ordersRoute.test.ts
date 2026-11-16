import { orderHash, orderIdFromHash, safeHttpUrl } from './ordersRoute';

describe('ordersRoute', () => {
    it('wyciąga id zamówienia z hasha', () => {
        expect(orderIdFromHash('#/zamowienia/123')).toBe(123);
        expect(orderIdFromHash('#/zamowienia/123/')).toBe(123);
        expect(orderHash(7)).toBe('#/zamowienia/7');
    });

    it('lista i niepoprawne adresy nie wskazują zamówienia', () => {
        for (const hash of ['', '#/zamowienia', '#/zamowienia/', '#/zamowienia/abc', '#/zamowienia/0', '#/zamowienia/1/x', '#/zamowienia/-1', '#/zamowienia/99999999999999999999']) {
            expect(orderIdFromHash(hash)).toBeNull();
        }
    });

    it('safeHttpUrl przepuszcza tylko http i https', () => {
        expect(safeHttpUrl('https://example.com/a')).toBe('https://example.com/a');
        expect(safeHttpUrl('http://example.com')).toBe('http://example.com/');
        expect(safeHttpUrl('javascript:alert(1)')).toBeNull();
        expect(safeHttpUrl('data:text/html,x')).toBeNull();
        expect(safeHttpUrl('nie adres')).toBeNull();
        expect(safeHttpUrl(null)).toBeNull();
    });
});
