// Testy walidacji danych wejściowych funkcji modułu zamówień (bez bazy). Wymagają zbudowanych funkcji: npm --prefix functions run build
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    decodeCursor,
    encodeCursor,
    isIsoDate,
    parseBuyerSearchInput,
    parseId,
    parseListOrdersInput,
} from '../functions/lib/orders/validation.js';

const invalidArgument = (fn) =>
    assert.throws(fn, (error) => error?.code === 'invalid-argument', 'oczekiwano błędu invalid-argument');

describe('parseListOrdersInput', () => {
    it('puste dane dają domyślny rozmiar strony i brak filtrów', () => {
        for (const input of [undefined, null, {}]) {
            const filters = parseListOrdersInput(input);
            assert.equal(filters.limit, DEFAULT_PAGE_SIZE);
            assert.equal(filters.year, undefined);
            assert.equal(filters.search, undefined);
        }
    });

    it('przycina tekst i pomija puste filtry', () => {
        const filters = parseListOrdersInput({ search: '  urząd  ', status: '', accountType: '   ' });
        assert.equal(filters.search, 'urząd');
        assert.equal(filters.status, undefined);
        assert.equal(filters.accountType, undefined);
    });

    it('odrzuca nieprawidłowe typy i zakresy', () => {
        invalidArgument(() => parseListOrdersInput('tekst'));
        invalidArgument(() => parseListOrdersInput([1]));
        invalidArgument(() => parseListOrdersInput({ year: '2026' }));
        invalidArgument(() => parseListOrdersInput({ year: 1999 }));
        invalidArgument(() => parseListOrdersInput({ limit: 0 }));
        invalidArgument(() => parseListOrdersInput({ limit: MAX_PAGE_SIZE + 1 }));
        invalidArgument(() => parseListOrdersInput({ limit: 1.5 }));
        invalidArgument(() => parseListOrdersInput({ buyerId: -3 }));
        invalidArgument(() => parseListOrdersInput({ search: 'x'.repeat(101) }));
        invalidArgument(() => parseListOrdersInput({ search: 5 }));
    });

    it('waliduje daty kalendarzowe i kolejność zakresu', () => {
        assert.equal(parseListOrdersInput({ registeredFrom: '2026-02-28' }).registeredFrom, '2026-02-28');
        invalidArgument(() => parseListOrdersInput({ registeredFrom: '2026-02-31' }));
        invalidArgument(() => parseListOrdersInput({ registeredTo: '09-11-2026' }));
        invalidArgument(() => parseListOrdersInput({ registeredFrom: '2026-05-02', registeredTo: '2026-05-01' }));
    });
});

describe('kursor stronicowania', () => {
    it('koduje i dekoduje bez zmian', () => {
        const cursor = { registeredOn: '2026-11-09', id: 7773 };
        assert.deepEqual(decodeCursor(encodeCursor(cursor)), cursor);
    });

    it('odrzuca śmieci, błędne daty i niedodatnie identyfikatory', () => {
        invalidArgument(() => decodeCursor('to-nie-jest-kursor'));
        invalidArgument(() => decodeCursor(Buffer.from('{"d":"2026-13-40","i":1}').toString('base64url')));
        invalidArgument(() => decodeCursor(Buffer.from('{"d":"2026-11-09","i":0}').toString('base64url')));
        invalidArgument(() => decodeCursor(Buffer.from('{"d":"2026-11-09","i":"1; DROP TABLE orders"}').toString('base64url')));
        invalidArgument(() => parseListOrdersInput({ cursor: 'zepsuty' }));
    });
});

describe('parseId i parseBuyerSearchInput', () => {
    it('parseId wymaga dodatniej liczby całkowitej', () => {
        assert.equal(parseId({ id: 12 }), 12);
        invalidArgument(() => parseId({}));
        invalidArgument(() => parseId({ id: '12' }));
        invalidArgument(() => parseId({ id: 0 }));
        invalidArgument(() => parseId(null));
    });

    it('wyszukiwanie zamawiających wymaga co najmniej 2 znaków', () => {
        assert.equal(parseBuyerSearchInput({ query: ' gmina ' }).query, 'gmina');
        assert.equal(parseBuyerSearchInput({ query: 'ab' }).limit, 20);
        invalidArgument(() => parseBuyerSearchInput({ query: 'a' }));
        invalidArgument(() => parseBuyerSearchInput({ query: '  ' }));
        invalidArgument(() => parseBuyerSearchInput({}));
        invalidArgument(() => parseBuyerSearchInput({ query: 'gmina', limit: 51 }));
    });
});

describe('isIsoDate', () => {
    it('akceptuje tylko istniejące daty', () => {
        assert.equal(isIsoDate('2024-02-29'), true);
        assert.equal(isIsoDate('2026-02-29'), false);
        assert.equal(isIsoDate('2026-1-1'), false);
        assert.equal(isIsoDate('abc'), false);
    });
});
