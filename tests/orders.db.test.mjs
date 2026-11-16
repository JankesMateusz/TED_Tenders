// Testy zapytań modułu zamówień na prawdziwym Postgresie (np. kontener z db/README.md). Wymagają zbudowanych funkcji.
// Adres bazy: ORDERS_TEST_DATABASE_URL (domyślnie lokalny kontener tenders-pg). Gdy bazy nie ma, testy są pomijane z komunikatem.
//
// Każdy test działa w transakcji, którą wycofuje, więc baza (także z zaimportowanymi danymi) zostaje bez zmian.
// Dane testowe mają rok 2099 i wyróżniającą się nazwę, żeby nie mieszać się z danymi z importu.
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createPool } from '../functions/lib/orders/db.js';
import { getBuyer, getDictionaries, getOrder, listOrders, searchBuyers } from '../functions/lib/orders/queries.js';
import { parseListOrdersInput } from '../functions/lib/orders/validation.js';

const URL = process.env.ORDERS_TEST_DATABASE_URL ?? 'postgresql://postgres:dev@localhost:5433/postgres';
const TEST_YEAR = 2099;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Numer tygodnia ISO policzony niezależnie od bazy, żeby test nie był kołowy.
const isoWeek = (isoDate) => {
    const d = new Date(`${isoDate}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

// Funkcje zapytań wykonują część zapytań równolegle (na puli to osobne połączenia). Test używa jednego klienta
// z transakcją, więc kolejkujemy zapytania, zamiast wołać client.query() w trakcie innego zapytania.
const serialized = (client) => {
    let queue = Promise.resolve();
    return {
        query: (text, values) => {
            const run = queue.then(() => client.query(text, values));
            queue = run.catch(() => undefined);
            return run;
        },
    };
};

const pool = createPool(URL);

describe('zapytania modułu zamówień (Postgres)', { concurrency: false }, () => {
    let available = false;
    let skipReason = '';
    let client;
    let db;
    let ids;

    before(async () => {
        try {
            await pool.query('SELECT 1 FROM v_orders LIMIT 1');
            available = true;
        } catch (error) {
            skipReason = `brak bazy z migracjami pod ${URL.replace(/:[^:@/]*@/, ':***@')} (${error.code ?? error.message})`;
        }
    });
    after(() => pool.end());

    const setup = async () => {
        client = await pool.connect();
        db = serialized(client);
        await client.query('BEGIN');
        await client.query(`INSERT INTO lob_categories (code) VALUES ('MFP'), ('SRV') ON CONFLICT DO NOTHING`);
        await client.query(`INSERT INTO account_types (code) VALUES ('Local govt') ON CONFLICT DO NOTHING`);

        const buyerA = (await client.query(
            `INSERT INTO buyers (name, dedupe_key, street, zip_code, town, province, nip)
             VALUES ('Zzqx Urząd Testowy', 'zzqx urzad|99-001|a', 'Długa 1', '99-001', 'Testowo', 'mazowieckie', '1234567890')
             RETURNING id`)).rows[0].id;
        const buyerB = (await client.query(
            `INSERT INTO buyers (name, dedupe_key, zip_code, town) VALUES ('Zzqx Szkoła', 'zzqx szkola|99-002|', '99-002', 'Testowo')
             RETURNING id`)).rows[0].id;
        const contacts = (await client.query(
            `INSERT INTO buyer_contacts (buyer_id, full_name, email, phone) VALUES
               ($1, 'Anna Test', 'anna@test.example', '111'), ($1, 'Bartek Test', 'bartek@test.example', NULL),
               ($2, 'Cezary Test', 'cezary@test.example', NULL)
             RETURNING id`, [buyerA, buyerB])).rows.map((r) => r.id);
        const deletedContact = (await client.query(
            `INSERT INTO buyer_contacts (buyer_id, full_name, email, deleted_at) VALUES ($1, 'Usunięty Test', 'x@test.example', now())
             RETURNING id`, [buyerA])).rows[0].id;

        const order = async (mdp, buyer, contact, registeredOn, name) =>
            (await client.query(
                `INSERT INTO orders (year, mdp_number, registered_on, publication_date, bid_date, buyer_id, contact_id, name,
                                     account_type, end_user_bid_number, siwz_url)
                 VALUES ($1, $2, $3::date, $3::date - 3, $3::date + 5, $4, $5, $6, 'Local govt', $7, $8)
                 RETURNING id`,
                [TEST_YEAR, mdp, registeredOn, buyer, contact, name, `ZZ/${mdp}/2099`, `https://example.test/${mdp}`])).rows[0].id;
        const o1 = await order(1, buyerA, contacts[0], '2099-01-10', 'Drukarki dla urzędu');
        const o2 = await order(2, buyerA, null, '2099-01-12', 'Serwery');
        const o3 = await order(3, buyerB, contacts[2], '2099-01-12', '100% pewne zamówienie');

        const winner = (await client.query(`INSERT INTO winners (name, name_key) VALUES ('Zzqx Dealer', 'zzqx dealer') RETURNING id`)).rows[0].id;
        const vendor = (await client.query(`INSERT INTO vendors (name, name_key) VALUES ('Zzqx Vendor', 'zzqx vendor') RETURNING id`)).rows[0].id;
        await client.query(
            `INSERT INTO positions (order_id, position_number, lob_category, quantity, status, winner_id, vendor_id, part_value, attributes)
             VALUES ($1, 1, 'MFP', 41, 'Pending', $2, $3, 1500.50, '{"ram": "8 GB"}')`, [o1, winner, vendor]);
        await client.query(`INSERT INTO positions (order_id, position_number, lob_category, quantity, status) VALUES ($1, 2, 'SRV', 6, 'Confirmed')`, [o1]);
        await client.query(`INSERT INTO positions (order_id, position_number, lob_category, quantity, deleted_at) VALUES ($1, 3, 'MFP', 9, now())`, [o1]);
        await client.query(`INSERT INTO letters (order_id, mail_to, mail_cc) VALUES ($1, ARRAY['a@test.example'], ARRAY[]::text[])`, [o1]);

        ids = { buyerA, buyerB, o1, o2, o3, contacts, deletedContact };
    };

    const teardown = async () => {
        if (client) {
            await client.query('ROLLBACK');
            client.release();
            client = undefined;
        }
    };

    // Każdy test dostaje świeże dane w transakcji, którą na końcu wycofujemy.
    const dbTest = (name, fn) =>
        it(name, async (t) => {
            if (!available) {
                t.skip(skipReason);
                return;
            }
            try {
                await setup();
                await fn();
            } finally {
                await teardown();
            }
        });

    const list = (extra = {}) => listOrders(db, parseListOrdersInput({ year: TEST_YEAR, ...extra }));

    dbTest('sortuje od najnowszych, a stronicowanie kursorem niczego nie gubi ani nie dubluje', async () => {
        const first = await list({ limit: 2 });
        assert.deepEqual(first.items.map((i) => i.mdpId), ['0003', '0002']); // ten sam dzień: rozstrzyga id malejąco
        assert.ok(first.nextCursor);
        const second = await list({ limit: 2, cursor: first.nextCursor });
        assert.deepEqual(second.items.map((i) => i.mdpId), ['0001']);
        assert.equal(second.nextCursor, null);
    });

    dbTest('zwraca podsumowanie pozycji bez usuniętych', async () => {
        const [one] = (await list({ search: 'Drukarki' })).items;
        assert.equal(one.id, ids.o1);
        assert.equal(one.positionsCount, 2);
        assert.deepEqual(one.lobCategories, ['MFP', 'SRV']);
        assert.deepEqual(one.positionStatusCounts, { Pending: 1, Confirmed: 1 });
        assert.equal(one.positionsWithWinner, 1);
        assert.deepEqual(one.buyer, { id: ids.buyerA, name: 'Zzqx Urząd Testowy', town: 'Testowo', province: 'mazowieckie' });
        for (const field of [one.registeredOn, one.publicationDate, one.bidDate]) assert.match(field, DATE);
    });

    dbTest('filtruje po kategorii, statusie pozycji, zamawiającym i zakresie dat', async () => {
        assert.deepEqual((await list({ lobCategory: 'SRV' })).items.map((i) => i.id), [ids.o1]);
        assert.deepEqual((await list({ positionStatus: 'Confirmed' })).items.map((i) => i.id), [ids.o1]);
        assert.deepEqual((await list({ buyerId: ids.buyerB })).items.map((i) => i.id), [ids.o3]);
        assert.deepEqual((await list({ registeredFrom: '2099-01-11' })).items.map((i) => i.mdpId), ['0003', '0002']);
        assert.deepEqual((await list({ registeredTo: '2099-01-10' })).items.map((i) => i.mdpId), ['0001']);
        assert.equal((await list({ lobCategory: 'MFP', positionStatus: 'Confirmed' })).items.length, 0);
    });

    dbTest('wyszukiwanie: po nazwie zamawiającego, numerze przetargu i numerze MDP', async () => {
        assert.deepEqual((await list({ search: 'szkoła' })).items.map((i) => i.id), [ids.o3]);
        assert.deepEqual((await list({ search: 'ZZ/2/2099' })).items.map((i) => i.id), [ids.o2]);
        assert.ok((await list({ search: '3' })).items.some((i) => i.id === ids.o3));
    });

    dbTest('znaki specjalne LIKE w wyszukiwaniu są traktowane dosłownie', async () => {
        assert.equal((await list({ search: '%%' })).items.length, 0);
        assert.equal((await list({ search: '__' })).items.length, 0);
        assert.deepEqual((await list({ search: '100%' })).items.map((i) => i.id), [ids.o3]);
        assert.equal((await list({ search: "'; DROP TABLE orders; --" })).items.length, 0);
        assert.ok((await client.query('SELECT 1 FROM orders LIMIT 1')).rows.length >= 0);
    });

    dbTest('getOrder zwraca kompletne szczegóły z etykietami, kontaktem i pismami', async () => {
        const order = await getOrder(db, ids.o1);
        assert.equal(order.mdpId, '0001');
        assert.equal(order.statusLabel, 'Jeszcze nierozstrzygnięty');
        assert.equal(order.orderWeek, `ww${isoWeek('2099-01-10')}`);
        assert.equal(order.publicationQuarter, "Q1'99");
        assert.equal(order.siwzUrl, 'https://example.test/1');
        assert.equal(order.buyer.nip, '1234567890');
        assert.equal(order.contact.fullName, 'Anna Test');
        assert.deepEqual(order.positions.map((p) => p.positionNumber), [1, 2]); // pozycja 3 jest usunięta
        const [p1, p2] = order.positions;
        assert.equal(p1.winner.name, 'Zzqx Dealer');
        assert.equal(p1.vendor.name, 'Zzqx Vendor');
        assert.equal(p1.partValue, '1500.50');
        assert.deepEqual(p1.attributes, { ram: '8 GB' });
        assert.equal(p1.statusLabel, 'Przetarg w toku');
        assert.equal(p2.winner, null);
        assert.equal(order.letters.length, 1);
        assert.deepEqual(order.letters[0].mailTo, ['a@test.example']);
        assert.equal(order.contact === null, false);
        assert.equal((await getOrder(db, ids.o2)).contact, null);
    });

    dbTest('getOrder zwraca null dla nieistniejącego i usuniętego zamówienia', async () => {
        assert.equal(await getOrder(db, 999999999), null);
        await client.query('UPDATE orders SET deleted_at = now() WHERE id = $1', [ids.o2]);
        assert.equal(await getOrder(db, ids.o2), null);
        assert.ok(!(await list()).items.some((i) => i.id === ids.o2));
    });

    dbTest('searchBuyers: najpierw najliczniejsi, bez znaków wieloznacznych i po NIP-ie', async () => {
        const found = await searchBuyers(db, { query: 'zzqx', limit: 10 });
        assert.deepEqual(found.map((b) => b.id), [ids.buyerA, ids.buyerB]); // A ma 2 zamówienia, B jedno
        assert.equal(found[0].ordersCount, 2);
        assert.equal(found[0].contactsCount, 2); // usunięty kontakt nie liczy się
        assert.equal((await searchBuyers(db, { query: '%%', limit: 10 })).length, 0);
        assert.deepEqual((await searchBuyers(db, { query: '1234567890', limit: 10 })).map((b) => b.id), [ids.buyerA]);
        assert.deepEqual((await searchBuyers(db, { query: '99-002', limit: 10 })).map((b) => b.id), [ids.buyerB]);
        assert.equal((await searchBuyers(db, { query: 'zzqx', limit: 1 })).length, 1);
    });

    dbTest('getBuyer zwraca aktywne kontakty i ostatnie zamówienia', async () => {
        const buyer = await getBuyer(db, ids.buyerA);
        assert.deepEqual(buyer.contacts.map((c) => c.fullName), ['Anna Test', 'Bartek Test']);
        assert.equal(buyer.ordersCount, 2);
        assert.deepEqual(buyer.recentOrders.map((o) => o.mdpId), ['0002', '0001']);
        assert.equal(buyer.canonicalId, null);
        assert.equal(await getBuyer(db, 999999999), null);
        await client.query('UPDATE buyers SET deleted_at = now() WHERE id = $1', [ids.buyerB]);
        assert.equal(await getBuyer(db, ids.buyerB), null);
    });

    dbTest('getDictionaries zwraca słowniki z migracji i lata z zamówień', async () => {
        const dictionaries = await getDictionaries(db);
        const codes = (options) => options.map((o) => o.code);
        assert.ok(codes(dictionaries.lobCategories).includes('MFP'));
        assert.equal(dictionaries.lobCategories.find((o) => o.code === 'MFP').label, 'urządzenia wielofunkcyjne');
        assert.ok(codes(dictionaries.accountTypes).includes('Local govt'));
        assert.deepEqual(codes(dictionaries.positionStatuses), ['Pending', 'Confirmed', 'Refuse', 'Cancel']);
        assert.ok(codes(dictionaries.orderStatuses).includes('open'));
        assert.ok(dictionaries.years.includes(TEST_YEAR));
        assert.deepEqual(dictionaries.years, [...dictionaries.years].sort((a, b) => b - a));
    });

    dbTest('rekord uznany za duplikat wskazuje rekord główny', async () => {
        await client.query('UPDATE buyers SET merged_into_id = $1 WHERE id = $2', [ids.buyerA, ids.buyerB]);
        assert.equal((await getBuyer(db, ids.buyerB)).canonicalId, ids.buyerA);
        assert.equal((await getOrder(db, ids.o3)).buyer.canonicalId, ids.buyerA);
    });
});
