// Test integracyjny triggera migawek ocen (TT-13) na emulatorach. Uruchamiany przez: npm run test:functions
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
const snapshotOf = async (id) => (await db.doc(`labelSnapshots/${id}`).get()).data();

const TENDER_ID = 'E_ZAMOWIENIA_2026_BZP_77_01';
const setStatus = (status) =>
    db.doc(`tenders/${TENDER_ID}`).update({
        status, statusBy: 'u1', statusByEmail: 'a@b.pl', statusAt: admin.firestore.Timestamp.now()
    });

describe('snapshotLabelOnStatusChange', () => {
    before(async () => {
        await db.doc(`tenders/${TENDER_ID}`).set({
            source: 'E_ZAMOWIENIA', publicationNumber: '2026/BZP 77/01', publicationDate: '2026-11-06', title: 'Laptopy',
            cpvCodes: ['30213300-8'], orderType: 'Delivery', buyerName: 'Gmina', labels: []
        });
    });

    it('zmiana etykiet nie tworzy migawki', async () => {
        await db.doc(`tenders/${TENDER_ID}`).update({ labels: ['simple'] });
        await sleep(2500);
        assert.equal(await snapshotOf(TENDER_ID), undefined);
    });

    it('ustawienie, zmiana i zdjęcie statusu dopisują historię, a migawka zostaje', async () => {
        await setStatus('toEnter');
        const first = await waitFor(() => snapshotOf(TENDER_ID));
        assert.equal(first.status, 'toEnter');
        assert.equal(first.title, 'Laptopy');

        await setStatus('notToEnter');
        await waitFor(async () => (await snapshotOf(TENDER_ID)).statusHistory.length === 2);

        await db.doc(`tenders/${TENDER_ID}`).update({
            status: admin.firestore.FieldValue.delete(), statusBy: admin.firestore.FieldValue.delete(),
            statusByEmail: admin.firestore.FieldValue.delete(), statusAt: admin.firestore.FieldValue.delete()
        });
        const last = await waitFor(async () => {
            const data = await snapshotOf(TENDER_ID);
            return data.statusHistory.length === 3 ? data : null;
        });
        assert.deepEqual(last.statusHistory.map((c) => c.status), ['toEnter', 'notToEnter', null]);
        assert.equal(last.status, null);
    });

    it('migawka przetrwa usunięcie przetargu (TTL)', async () => {
        await db.doc(`tenders/${TENDER_ID}`).delete();
        await sleep(1000);
        assert.ok(await snapshotOf(TENDER_ID));
    });
});
