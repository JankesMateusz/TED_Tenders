// Test integracyjny triggera zdarzeń do podsumowania „od ostatniej wizyty” na emulatorach. Uruchamiany przez: npm run test:functions
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { before, describe, it } from 'node:test';

const PROJECT_ID = 'demo-tenders';
const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const admin = requireFromFunctions('firebase-admin');
admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitFor = async (check, timeoutMs = 15000) => {
    const start = Date.now();
    for (;;) {
        const value = await check();
        if (value) return value;
        if (Date.now() - start > timeoutMs) throw new Error('Przekroczono czas oczekiwania');
        await sleep(200);
    }
};
const eventsOf = async (tenderId) => (await db.collection('events').where('tenderId', '==', tenderId).get()).docs.map((d) => d.data());

const TENDER_ID = 'E_ZAMOWIENIA_2026_BZP_99_01';
const tender = () => db.doc(`tenders/${TENDER_ID}`);

describe('recordTenderEvents', () => {
    before(async () => {
        await tender().set({
            source: 'E_ZAMOWIENIA', publicationNumber: '2026/BZP 99/01', publicationDate: '2026-11-12', title: 'Serwery', isIT: false, labels: []
        });
    });

    it('zmiana etykiet nie tworzy zdarzenia', async () => {
        await tender().update({ labels: ['simple'] });
        await sleep(2500);
        assert.deepEqual(await eventsOf(TENDER_ID), []);
    });

    it('ustawienie statusu zapisuje zdarzenie z autorem i TTL', async () => {
        await tender().update({ status: 'toEnter', statusBy: 'u1', statusByEmail: 'a@b.pl', statusAt: admin.firestore.Timestamp.now() });
        const [event] = await waitFor(async () => {
            const found = (await eventsOf(TENDER_ID)).filter((e) => e.type === 'status_changed');
            return found.length ? found : null;
        });
        assert.equal(event.actorUid, 'u1');
        assert.equal(event.status, 'toEnter');
        assert.equal(event.title, 'Serwery');
        assert.ok(event.expireAt.toMillis() > event.createdAt.toMillis());
    });

    it('pierwsze „available” w docsCheck zapisuje jedno zdarzenie, kolejne zapisy go nie dublują', async () => {
        await tender().update({ docsCheck: { state: 'none', checks: 1 } });
        await tender().update({ docsCheck: { state: 'available', checks: 2, fileCount: 3 } });
        await waitFor(async () => (await eventsOf(TENDER_ID)).some((e) => e.type === 'docs_available'));
        await tender().update({ docsCheck: { state: 'available', checks: 2, fileCount: 4 } });
        await sleep(2500);
        assert.equal((await eventsOf(TENDER_ID)).filter((e) => e.type === 'docs_available').length, 1);
    });
});
