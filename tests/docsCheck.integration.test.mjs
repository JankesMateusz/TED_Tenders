// Test integracyjny sprawdzania dostępności dokumentacji (TT-15) na emulatorze Firestore.
// Resolver i kolejka są atrapami: sprawdzamy orkiestrację (zapisy, kolejkowanie, idempotencję). Uruchamiany przez: npm run test:functions
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { beforeEach, describe, it } from 'node:test';

const PROJECT_ID = 'demo-tenders';
const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const admin = requireFromFunctions('firebase-admin');
admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const { processDocsCheck } = await import('../functions/lib/analysis/docsCheck/docsCheck.js');
const { ResolverError } = await import('../functions/lib/analysis/resolver/index.js');

const DOC_ID = 'E_ZAMOWIENIA_2026_BZP_88_01';
const NOW = new Date('2026-11-09T10:00:00Z'); // poniedziałek 11:00 w Warszawie

const none = { status: 'NO_DOCUMENTS_YET', note: 'n', platform: 'ezamowienia', sourceUrl: 'https://ezamowienia.gov.pl/x' };
const resolved = {
    status: 'RESOLVED', platform: 'ezamowienia', sourceUrl: 'https://ezamowienia.gov.pl/x', excluded: [], fingerprint: 'f',
    files: [{ path: 'a.pdf', url: 'u', platformFileId: '1', publishedAt: '2026-11-09T09:00:00' }]
};

const makeDeps = (results) => {
    const queued = [];
    let calls = 0;
    return {
        queued,
        get calls() { return calls; },
        resolve: async () => {
            const next = results[Math.min(calls++, results.length - 1)];
            if (next instanceof Error) throw next;
            return next;
        },
        enqueue: async (payload, when) => { queued.push({ ...payload, when }); },
        now: () => NOW
    };
};
const docsCheckOf = async () => (await db.doc(`tenders/${DOC_ID}`).get()).data().docsCheck;

describe('processDocsCheck', () => {
    beforeEach(async () => {
        await db.doc(`tenders/${DOC_ID}`).set({
            source: 'E_ZAMOWIENIA', publicationNumber: '2026/BZP 88/01', link: 'https://x/id/1', documentsUrl: null, isIT: true, title: 'Laptopy'
        });
    });

    it('brak dokumentów: zapisuje none, kolejkuje następne sprawdzenie +1 h', async () => {
        const deps = makeDeps([none]);
        await processDocsCheck({ docId: DOC_ID, check: 1 }, deps);

        const check = await docsCheckOf();
        assert.equal(check.state, 'none');
        assert.equal(check.platform, 'ezamowienia');
        assert.equal(check.checks, 1);
        assert.equal(check.nextCheckAt.toDate().toISOString(), '2026-11-09T11:00:00.000Z');
        assert.equal(deps.queued.length, 1);
        assert.equal(deps.queued[0].docId, DOC_ID);
        assert.equal(deps.queued[0].check, 2);
        assert.equal(deps.queued[0].when.toISOString(), '2026-11-09T11:00:00.000Z');
        assert.equal(check.firstSeenAt, undefined);
    });

    it('pliki się pojawiły: available z firstSeenAt, bez kolejkowania, kolejne zadania nic nie robią', async () => {
        await processDocsCheck({ docId: DOC_ID, check: 1 }, makeDeps([none]));
        const deps = makeDeps([resolved]);
        await processDocsCheck({ docId: DOC_ID, check: 2 }, deps);

        const check = await docsCheckOf();
        assert.equal(check.state, 'available');
        assert.equal(check.fileCount, 1);
        assert.equal(check.newestFileAt, '2026-11-09T09:00:00');
        assert.equal(check.nextCheckAt, null);
        assert.equal(check.firstSeenAt.toDate().toISOString(), NOW.toISOString());
        assert.equal(deps.queued.length, 0);

        const again = makeDeps([none]);
        await processDocsCheck({ docId: DOC_ID, check: 3 }, again);
        assert.equal(again.calls, 0, 'stan końcowy: resolver nie jest wołany');
        assert.equal((await docsCheckOf()).state, 'available');
    });

    it('ponowione zadanie tego samego sprawdzenia nie woła resolvera ani nie kolejkuje', async () => {
        await processDocsCheck({ docId: DOC_ID, check: 1 }, makeDeps([none]));
        const deps = makeDeps([none]);
        await processDocsCheck({ docId: DOC_ID, check: 1 }, deps);
        assert.equal(deps.calls, 0);
        assert.equal(deps.queued.length, 0);
    });

    it('błąd platformy to error (nie none) i zachowuje znaną platformę; sprawdzanie trwa', async () => {
        await processDocsCheck({ docId: DOC_ID, check: 1 }, makeDeps([none]));
        const deps = makeDeps([new ResolverError('timeout')]);
        await processDocsCheck({ docId: DOC_ID, check: 2 }, deps);

        const check = await docsCheckOf();
        assert.equal(check.state, 'error');
        assert.equal(check.platform, 'ezamowienia');
        assert.equal(deps.queued.length, 1);
    });

    it('nieoczekiwany błąd wychodzi na zewnątrz (ponowienie przez Cloud Tasks) i niczego nie zapisuje', async () => {
        const deps = makeDeps([new TypeError('bug')]);
        await assert.rejects(processDocsCheck({ docId: DOC_ID, check: 1 }, deps), TypeError);
        assert.equal(await docsCheckOf(), undefined);
        assert.equal(deps.queued.length, 0);
    });

    it('platforma nieobsługiwana: unsupported, bez ponawiania', async () => {
        const deps = makeDeps([{ status: 'UNSUPPORTED_PLATFORM', note: 'n', sourceUrl: 'https://inna.pl/x' }]);
        await processDocsCheck({ docId: DOC_ID, check: 1 }, deps);
        const check = await docsCheckOf();
        assert.equal(check.state, 'unsupported');
        assert.equal(check.sourceUrl, 'https://inna.pl/x');
        assert.equal(deps.queued.length, 0);
    });

    it('ostatnie sprawdzenie bez dokumentów czyści nextCheckAt i nie kolejkuje', async () => {
        await db.doc(`tenders/${DOC_ID}`).update({
            docsCheck: { state: 'none', platform: 'ezamowienia', sourceUrl: 'https://ezamowienia.gov.pl/x', checks: 5, nextCheckAt: admin.firestore.Timestamp.fromDate(NOW) }
        });
        const deps = makeDeps([none]);
        await processDocsCheck({ docId: DOC_ID, check: 6 }, deps);
        const check = await docsCheckOf();
        assert.equal(check.state, 'none');
        assert.equal(check.checks, 6);
        assert.equal(check.nextCheckAt, null);
        assert.equal(deps.queued.length, 0);
    });

    it('przetarg, którego już nie ma (TTL), jest pomijany', async () => {
        await db.doc(`tenders/${DOC_ID}`).delete();
        const deps = makeDeps([none]);
        await processDocsCheck({ docId: DOC_ID, check: 1 }, deps);
        assert.equal(deps.calls, 0);
    });
});
