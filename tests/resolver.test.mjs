// Testy resolvera dokumentacji (TT-1) offline, na zapisanych odpowiedziach z tests/fixtures/resolver.
// Fixtures pochodzą z żywych odpowiedzi eZamówień i platformazakupowa.pl (2026-11-06).
// Wymagają zbudowanych funkcji: npm run test:unit
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { resolveDocuments, ResolverError } from '../functions/lib/analysis/resolver/index.js';
import { extractProceedingUrl } from '../functions/lib/analysis/resolver/ezamowienia.js';
import { extractFiles } from '../functions/lib/analysis/resolver/platformazakupowa.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/resolver/${name}`, import.meta.url), 'utf8');
const json = (name) => JSON.parse(fixture(name));

const OBJECT_ID = '08df3bf7-1022-4aaa-c1c5-d5000193d991';
const TENDER_ID = 'ocds-148610-5b872046-7861-4d59-a28a-d041c73da713';
const EZ_LINK = `https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/${OBJECT_ID}`;
const ez = { source: 'E_ZAMOWIENIA', link: EZ_LINK, documentsUrl: null };

/** Atrapa klienta HTTP: odpowiedzi wg wzorca adresu; zapamiętuje zapytania. */
const fakeHttp = (routes) => {
    const requests = [];
    return {
        requests,
        async get(url, options = {}) {
            requests.push(url);
            const route = routes.find(([pattern]) => url.includes(pattern));
            if (!route) throw new ResolverError(`brak atrapy dla ${url}`);
            const value = typeof route[1] === 'function' ? route[1](options) : route[1];
            return value instanceof Error ? Promise.reject(value) : value;
        }
    };
};
const ok = (data) => ({ status: 200, data });

const ezRoutes = ({ docs = json('ez-documents.json'), body } = {}) => [
    ['GetNoticeDetailsById', ok(json('ez-notice-details.json'))],
    ['GetTenderDocuments', ok(docs)],
    ['GetNoticeHtmlBodyById', ok(body ?? fixture('ez-body-none.html'))]
];

describe('resolver: eZamówienia', () => {
    it('zwraca manifest z listy dokumentów, bez pobierania plików', async () => {
        const http = fakeHttp(ezRoutes());
        const result = await resolveDocuments(ez, http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'ezamowienia');
        assert.equal(result.files.length, 4);
        assert.equal(result.files[0].path, 'Zał. nr 4 do SWZ - Projekt umowy.pdf');
        assert.equal(
            result.files[0].url,
            `https://ezamowienia.gov.pl/mp-readmodels/api/Tender/DownloadDocument/${TENDER_ID}/${TENDER_ID}_4`
        );
        assert.equal(result.sourceUrl, `https://ezamowienia.gov.pl/mp-client/search/list/${TENDER_ID}`);
        assert.equal(result.noticePublishedAt, '2026-11-06T11:14:02.3159331Z');
        assert.match(result.fingerprint, /^[0-9a-f]{64}$/);
        // lista pełna: ani HTML ogłoszenia, ani żadnego pobrania pliku
        assert.equal(http.requests.some((url) => url.includes('DownloadDocument') && !url.includes('GetTenderDocuments')), false);
        assert.equal(http.requests.some((url) => url.includes('GetNoticeHtmlBodyById')), false);
    });

    it('odcisk nie zależy od kolejności, a zmienia się po dodaniu pliku', async () => {
        const docs = json('ez-documents.json');
        const first = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs })));
        const reversed = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs: [...docs].reverse() })));
        assert.equal(first.fingerprint, reversed.fingerprint);
        const extra = { ...docs[0], objectId: `${TENDER_ID}_9`, fileName: 'Zmiana SWZ.pdf' };
        const changed = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs: [...docs, extra] })));
        assert.notEqual(first.fingerprint, changed.fingerprint);
    });

    it('wyklucza pliki usunięte i niepublikowane, ale je wykazuje', async () => {
        const docs = json('ez-documents.json');
        docs[0].deleteDate = '2026-11-06T12:00:00Z';
        docs[1].tenderDocumentState = 'Draft';
        const result = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs })));
        assert.equal(result.files.length, 2);
        assert.deepEqual(result.excluded.map((e) => e.reason), ['deleted', 'not-published']);
    });

    it('nadaje unikalne ścieżki powtórzonym nazwom', async () => {
        const docs = json('ez-documents.json');
        docs[1].fileName = docs[0].fileName;
        const result = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs })));
        const paths = result.files.map((f) => f.path);
        assert.equal(new Set(paths).size, paths.length);
        assert.ok(paths.includes('Zał. nr 4 do SWZ - Projekt umowy (2).pdf'));
    });

    it('pusta lista i pole 3.1 wskazuje samo eZamówienia: NO_DOCUMENTS_YET', async () => {
        const result = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs: json('ez-documents-empty.json'), body: fixture('ez-body-self.html') })));
        assert.equal(result.status, 'NO_DOCUMENTS_YET');
        assert.equal(result.platform, 'ezamowienia');
        assert.equal(result.noticePublishedAt, '2026-11-06T11:14:02.3159331Z');
    });

    it('pusta lista i pole 3.1 wskazuje profil platformazakupowa: PROFILE_NOT_MATCHED', async () => {
        const result = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs: [], body: fixture('ez-body-profile.html') })));
        assert.equal(result.status, 'PROFILE_NOT_MATCHED');
        assert.equal(result.sourceUrl, 'https://platformazakupowa.pl/pn/sm_wroclaw');
    });

    it('pusta lista i pole 3.1 wskazuje inną platformę: UNSUPPORTED_PLATFORM z linkiem', async () => {
        const result = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs: [], body: fixture('ez-body-other.html') })));
        assert.equal(result.status, 'UNSUPPORTED_PLATFORM');
        assert.match(result.sourceUrl, /ezamawiajacy\.pl/);
    });

    it('pusta lista i brak pola 3.1: NO_SOURCE_URL', async () => {
        const result = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs: [] })));
        assert.equal(result.status, 'NO_SOURCE_URL');
    });

    it('pusta lista i pole 3.1 wskazuje transakcję na platformazakupowa: pliki stamtąd', async () => {
        const http = fakeHttp([...ezRoutes({ docs: [], body: fixture('ez-body-transakcja.html') }), ['/transakcja/1403900', ok(fixture('pz-transakcja.html'))]]);
        const result = await resolveDocuments(ez, http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'platformazakupowa');
        assert.equal(result.files.length, 3);
    });

    it('link bez identyfikatora ogłoszenia: NO_SOURCE_URL', async () => {
        const result = await resolveDocuments({ ...ez, link: 'https://ezamowienia.gov.pl/' }, fakeHttp([]));
        assert.equal(result.status, 'NO_SOURCE_URL');
    });

    it('błąd sieci to wyjątek ResolverError, a nie stan "brak dokumentów"', async () => {
        const http = fakeHttp([['GetNoticeDetailsById', new ResolverError('503')]]);
        await assert.rejects(resolveDocuments(ez, http), ResolverError);
    });

    it('pole 3.1 wyciąga adres z HTML ogłoszenia', () => {
        assert.equal(extractProceedingUrl(fixture('ez-body-profile.html')), 'https://platformazakupowa.pl/pn/sm_wroclaw');
        assert.equal(extractProceedingUrl(fixture('ez-body-none.html')), null);
    });
});

describe('resolver: TED', () => {
    const ted = (documentsUrl) => ({ source: 'TED', link: 'https://ted.europa.eu/x', documentsUrl });

    it('bez documentsUrl: NO_SOURCE_URL', async () => {
        assert.equal((await resolveDocuments(ted(null), fakeHttp([]))).status, 'NO_SOURCE_URL');
    });

    it('documentsUrl na transakcję platformazakupowa', async () => {
        const http = fakeHttp([['/transakcja/1403900', ok(fixture('pz-transakcja.html'))]]);
        const result = await resolveDocuments(ted('https://platformazakupowa.pl/transakcja/1403900'), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'platformazakupowa');
    });

    it('documentsUrl na postępowanie w eZamówieniach (tenderId w adresie)', async () => {
        const http = fakeHttp([['GetTenderDocuments', ok(json('ez-documents.json'))]]);
        const result = await resolveDocuments(ted(`https://ezamowienia.gov.pl/mp-client/search/list/${TENDER_ID}`), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'ezamowienia');
        assert.equal(http.requests.length, 1);
    });

    it('documentsUrl na profil, nieobsługiwaną platformę i nieparsowalny adres', async () => {
        const http = fakeHttp([]);
        assert.equal((await resolveDocuments(ted('https://platformazakupowa.pl/pn/gmina_dydnia'), http)).status, 'PROFILE_NOT_MATCHED');
        assert.equal((await resolveDocuments(ted('https://pzdw.logintrade.net/zapytania_email,1.html'), http)).status, 'UNSUPPORTED_PLATFORM');
        assert.equal((await resolveDocuments(ted('nie-adres'), http)).status, 'UNSUPPORTED_PLATFORM');
        assert.equal(http.requests.length, 0);
    });

    it('Baza Konkurencyjności jest poza zakresem', async () => {
        const result = await resolveDocuments({ source: 'BAZA_KONKURENCYJNOSCI', link: '', documentsUrl: null }, fakeHttp([]));
        assert.equal(result.status, 'UNSUPPORTED_PLATFORM');
    });
});

describe('resolver: platformazakupowa.pl', () => {
    const ted = { source: 'TED', link: '', documentsUrl: 'https://platformazakupowa.pl/transakcja/1403900' };

    it('wyciąga nazwy, daty i adresy z wierszy tabeli (fragment prawdziwej strony), bez duplikatów i obcych linków', () => {
        const files = extractFiles(fixture('pz-transakcja.html'));
        assert.deepEqual(files.map((f) => f.path), [
            'Ogłoszenie o zamówieniu.pdf',
            'SWZ_142.pdf',
            'Załącznik nr 1 do SWZ - Opis przedmiotu zamówienia.pdf'
        ]);
        assert.equal(files[0].url, 'https://platformazakupowa.pl/file/get_new/9ea53b0089ef98140ff139b85ed8d697.pdf');
        assert.equal(files[0].platformFileId, '9ea53b0089ef98140ff139b85ed8d697.pdf');
        assert.equal(files[0].publishedAt, '2026-11-06T12:41:00');
    });

    it('strona bez załączników: NO_DOCUMENTS_YET', async () => {
        const http = fakeHttp([['/transakcja/', ok(fixture('pz-transakcja-empty.html'))]]);
        assert.equal((await resolveDocuments(ted, http)).status, 'NO_DOCUMENTS_YET');
    });

    it('przekierowanie na logowanie to błąd (RESOLVER_ERROR), a nie "brak dokumentów"', async () => {
        const http = fakeHttp([['/transakcja/', { status: 302, data: '', location: 'https://platformazakupowa.pl/sso/authorize?error=login_required' }]]);
        await assert.rejects(resolveDocuments(ted, http), (error) => error instanceof ResolverError && /login_required/.test(error.message));
    });

    it('prosi klienta o sesję z ciasteczkami (łańcuch SSO)', async () => {
        let seen;
        const http = fakeHttp([['/transakcja/', (options) => ((seen = options), ok(fixture('pz-transakcja.html')))]]);
        await resolveDocuments(ted, http);
        assert.equal(seen.session, true);
    });

    it('limit liczby plików', async () => {
        const many = Array.from({ length: 201 }, (_, i) => `<tr><td class="text-left">p${i}.pdf</td><td><a href="//platformazakupowa.pl/file/get_new/h${i}.pdf"></a></td></tr>`).join('');
        const http = fakeHttp([['/transakcja/', ok(`<html>${many}</html>`)]]);
        await assert.rejects(resolveDocuments(ted, http), ResolverError);
    });
});
