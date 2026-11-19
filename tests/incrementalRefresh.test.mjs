// Testy trybu przyrostowego odświeżania eZamówień. Wymagają zbudowanych funkcji: npm run test:unit
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, describe, it } from 'node:test';
import { isFullSweepRun } from '../functions/lib/tenders/schedule.js';
import { tenderId } from '../functions/lib/tenders/model.js';

const DAY = '2026-11-20';
const NOTICES_PER_TYPE = 25; // 3 strony po 10, ostatnia niepełna

const noticeNumber = (orderType, index) => `2026/BZP ${orderType}${String(index).padStart(3, '0')}/01`;

/** Ogłoszenia od najnowszego (indeks 0) do najstarszego, jak zwraca API przy sortowaniu malejąco. */
const buildNotices = (orderType) =>
    Array.from({ length: NOTICES_PER_TYPE }, (_, index) => ({
        noticeNumber: noticeNumber(orderType, index),
        publicationDate: `${DAY}T${String(20 - Math.floor(index / 2)).padStart(2, '0')}:00:00.0000000Z`,
        submittingOffersDate: null,
        cpvCode: '30213300-8 (Komputer)',
        orderObject: `Ogłoszenie ${orderType} ${index}`,
        organizationName: 'Urząd',
        organizationCity: 'Warszawa',
        objectId: `${orderType}-${index}`,
    }));

const idsOf = (orderType, indexes) =>
    indexes.map((index) => tenderId({ source: 'E_ZAMOWIENIA', publicationNumber: noticeNumber(orderType, index) }));

// Serwer zastępujący API eZamówień. Adres jest odczytywany przy imporcie modułu, więc ustawiamy go przed importem.
let requests = [];
const server = createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const orderType = url.searchParams.get('orderType');
    const page = Number(url.searchParams.get('PageNumber'));
    requests.push({ orderType, page });
    const slice = buildNotices(orderType).slice((page - 1) * 10, page * 10);
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(slice));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
process.env.EZAMOWIENIA_API_URL = `http://127.0.0.1:${server.address().port}/ezamowienia`;
const { fetchEzamowienia, pageIsAllKnown } = await import('../functions/lib/tenders/ezamowienia.js');
after(() => server.close());

describe('pageIsAllKnown i isFullSweepRun', () => {
    it('strona jest znana tylko wtedy, gdy każde jej ogłoszenie już mamy', () => {
        assert.equal(pageIsAllKnown(['a', 'b'], new Set(['a', 'b', 'c'])), true);
        assert.equal(pageIsAllKnown(['a', 'b'], new Set(['a'])), false);
    });

    it('pusta strona nie liczy się jako znana', () => {
        assert.equal(pageIsAllKnown([], new Set(['a'])), false);
    });

    it('pełne pobranie dnia jest w pierwszym kwadransie godziny (czas warszawski)', () => {
        assert.equal(isFullSweepRun(new Date('2026-11-20T09:00:05Z')), true); // 10:00
        assert.equal(isFullSweepRun(new Date('2026-11-20T09:09:59Z')), true);
        assert.equal(isFullSweepRun(new Date('2026-11-20T09:10:05Z')), false);
        assert.equal(isFullSweepRun(new Date('2026-11-20T09:50:05Z')), false);
    });
});

describe('fetchEzamowienia w trybie przyrostowym', () => {
    const pagesFor = (orderType) => requests.filter((r) => r.orderType === orderType).map((r) => r.page);
    /** Zwraca zbiór znanych identyfikatorów niezależnie od zapytania (sprawdzamy tylko, czy strona jest cała znana). */
    const knownOf = (known) => async (ids) => new Set(ids.filter((id) => known.has(id)));

    it('bez opcji pobiera cały dzień (wszystkie strony)', async () => {
        requests = [];
        const result = await fetchEzamowienia(DAY);
        assert.deepEqual(pagesFor('Delivery'), [1, 2, 3]);
        assert.equal(result.records.length, 3 * NOTICES_PER_TYPE);
        assert.deepEqual(result.errors, []);
    });

    it('przerywa po pierwszej stronie, gdy wszystkie jej ogłoszenia są już w bazie', async () => {
        requests = [];
        const known = new Set(['Delivery', 'Services', 'Works'].flatMap((type) => idsOf(type, [...Array(10).keys()])));
        const result = await fetchEzamowienia(DAY, { findKnownIds: knownOf(known) });
        for (const type of ['Delivery', 'Services', 'Works']) assert.deepEqual(pagesFor(type), [1]);
        assert.equal(result.records.length, 3 * 10, 'zwraca ogłoszenia z pobranej strony, zapis i tak pominie znane');
    });

    it('nowe ogłoszenia na pierwszej stronie wymuszają pobranie kolejnej', async () => {
        requests = [];
        // Znane od indeksu 3: strona 1 ma 3 nowe (0-2), strona 2 jest cała znana
        const known = new Set(['Delivery', 'Services', 'Works'].flatMap((type) => idsOf(type, [...Array(NOTICES_PER_TYPE).keys()].slice(3))));
        await fetchEzamowienia(DAY, { findKnownIds: knownOf(known) });
        for (const type of ['Delivery', 'Services', 'Works']) assert.deepEqual(pagesFor(type), [1, 2]);
    });

    it('gdy nic nie jest znane, pobiera wszystko tak jak w trybie pełnym', async () => {
        requests = [];
        const result = await fetchEzamowienia(DAY, { findKnownIds: knownOf(new Set()) });
        assert.deepEqual(pagesFor('Services'), [1, 2, 3]);
        assert.equal(result.records.length, 3 * NOTICES_PER_TYPE);
    });
});
