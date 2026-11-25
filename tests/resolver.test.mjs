// Testy resolvera dokumentacji (TT-1) offline, na zapisanych odpowiedziach z tests/fixtures/resolver.
// Fixtures pochodzą z żywych odpowiedzi eZamówień i platformazakupowa.pl (2026-11-06).
// Wymagają zbudowanych funkcji: npm run test:unit
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { resolveDocuments, ResolverError } from '../functions/lib/analysis/resolver/index.js';
import { matchProceeding } from '../functions/lib/analysis/resolver/common.js';
import { extractFiles as extractEzamawiajacyFiles, extractList } from '../functions/lib/analysis/resolver/ezamawiajacy.js';
import { extractFiles as extractLogintradeFiles, extractList as extractLogintradeList } from '../functions/lib/analysis/resolver/logintrade.js';
import { extractFiles as extractSidasFiles } from '../functions/lib/analysis/resolver/sidaspzp.js';
import { extractFiles as extractEpropublicoFiles } from '../functions/lib/analysis/resolver/epropublico.js';
import { extractProceedingUrl, extractReferenceNumber } from '../functions/lib/analysis/resolver/ezamowienia.js';
import { assertSessionUrl } from '../functions/lib/analysis/resolver/httpClient.js';
import { extractFiles, extractProceedings } from '../functions/lib/analysis/resolver/platformazakupowa.js';
import { announcementId, extractFiles as extractBazaFiles } from '../functions/lib/analysis/resolver/bazakonkurencyjnosci.js';

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

    it('pusta lista i pole 3.1 wskazuje postępowanie na ezamawiającym: lista plików z tej strony', async () => {
        const page = fixture('ezm-postepowanie.html');
        const routes = [...ezRoutes({ docs: [], body: fixture('ez-body-other.html') }), ['/demand/334843/notice/public/details', { status: 302, data: '', location: '/pn/zus/demand/notice/public/1/details' }], ['/notice/public/1/details', ok(page)]];
        const result = await resolveDocuments(ez, fakeHttp(routes));
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'ezamawiajacy');
        assert.match(result.sourceUrl, /zus\.ezamawiajacy\.pl/);
    });

    it('pusta lista i adres w polu 3.1 bez https://: UNSUPPORTED_PLATFORM z linkiem', async () => {
        const result = await resolveDocuments(ez, fakeHttp(ezRoutes({ docs: [], body: fixture('ez-body-no-scheme.html') })));
        assert.equal(result.status, 'UNSUPPORTED_PLATFORM');
        assert.equal(result.sourceUrl, 'https://www.dzp.agh.edu.pl');
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

    it('pole 3.1 z adresem bez https:// (np. AGH) dostaje schemat, a tekst niebędący adresem jest odrzucany', () => {
        assert.equal(extractProceedingUrl(fixture('ez-body-no-scheme.html')), 'https://www.dzp.agh.edu.pl');
        const field = (value) => `<h3>3.1.) Adres strony internetowej prowadzonego postępowania</h3> ${value} <h3>3.2.) Zamawiający zastrzega dostęp</h3>`;
        assert.equal(extractProceedingUrl(field('https://x.pl/a?b=1.')), 'https://x.pl/a?b=1');
        assert.equal(extractProceedingUrl(field('zamowienia.uczelnia.pl/przetargi,')), 'https://zamowienia.uczelnia.pl/przetargi');
        assert.equal(extractProceedingUrl(field('Nie dotyczy')), null);
        assert.equal(extractProceedingUrl(field('brak.')), null);
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
        assert.equal((await resolveDocuments(ted('https://przetargi.example.pl/zapytania_email,1.html'), http)).status, 'UNSUPPORTED_PLATFORM');
        assert.equal((await resolveDocuments(ted('nie-adres'), http)).status, 'UNSUPPORTED_PLATFORM');
        assert.equal(http.requests.length, 0);
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

describe('resolver: Baza Konkurencyjności', () => {
    const baza = { source: 'BAZA_KONKURENCYJNOSCI', link: 'https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/297242', documentsUrl: null };
    const route = (value) => [['/api/announcements/297242', value]];

    it('zwraca manifest z attachments[] (prawdziwe ogłoszenie 297242, bez danych osobowych w fixture)', async () => {
        const http = fakeHttp(route(ok(json('baza-ogloszenie.json'))));
        const result = await resolveDocuments(baza, http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'bazakonkurencyjnosci');
        assert.equal(result.sourceUrl, 'https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/297242');
        assert.equal(result.files.length, 6);
        assert.equal(result.files[0].path, 'Zapytanie  ofertowe.pdf');
        assert.equal(result.files[0].url, 'https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/api/files/3190394');
        assert.equal(result.files[0].platformFileId, '3190394');
        assert.equal(result.files[0].publishedAt, '2026-11-06T11:42:15');
        assert.match(result.fingerprint, /^[0-9a-f]{64}$/);
        assert.equal(http.requests.length, 1);
    });

    it('odcisk nie zależy od kolejności plików i zmienia się po dodaniu pliku', async () => {
        const data = json('baza-ogloszenie.json');
        const withAttachments = (list) => ({ data: { advertisement: { ...data.data.advertisement, attachments: list } } });
        const all = data.data.advertisement.attachments;
        const first = await resolveDocuments(baza, fakeHttp(route(ok(withAttachments(all)))));
        const reversed = await resolveDocuments(baza, fakeHttp(route(ok(withAttachments([...all].reverse())))));
        const fewer = await resolveDocuments(baza, fakeHttp(route(ok(withAttachments(all.slice(1))))));
        assert.equal(first.fingerprint, reversed.fingerprint);
        assert.notEqual(first.fingerprint, fewer.fingerprint);
    });

    it('nie przepisuje danych osobowych i odrzuca załączniki bez poprawnego adresu pliku', () => {
        const files = extractBazaFiles([
            { name: 'Opis', file: { id: 1, name: 'opis.pdf', uri: '/api/files/1', created_at: '2026-11-06 10:00:00', created_by: { forename: 'Jan', surname: 'Kowalski' } } },
            { name: 'Obcy', file: { id: 2, name: 'x.pdf', uri: 'https://example.com/x.pdf' } },
            { name: 'Bez pliku' },
            { name: 'Duplikat', file: { id: 1, name: 'opis.pdf', uri: '/api/files/1' } },
            { name: 'Tylko opis', file: { id: 3, uri: '/api/files/3' }, origin: { publication_date: '2026-11-05' } }
        ]);
        assert.deepEqual(files.map((f) => f.path), ['opis.pdf', 'Tylko opis']);
        assert.equal(files[1].publishedAt, '2026-11-05');
        assert.ok(!JSON.stringify(files).includes('Kowalski'));
    });

    it('ogłoszenie bez załączników: NO_DOCUMENTS_YET', async () => {
        const result = await resolveDocuments(baza, fakeHttp(route(ok({ data: { advertisement: { id: 297242, attachments: [] } } }))));
        assert.equal(result.status, 'NO_DOCUMENTS_YET');
        assert.equal(result.platform, 'bazakonkurencyjnosci');
    });

    it('ogłoszenie usunięte z Bazy (404): NO_SOURCE_URL, bez ponawiania', async () => {
        const http = fakeHttp(route(new ResolverError('404', { status: 404 })));
        assert.equal((await resolveDocuments(baza, http)).status, 'NO_SOURCE_URL');
    });

    it('odpowiedź bez ogłoszenia i błąd sieci to wyjątek (stan error), nie "brak dokumentów"', async () => {
        await assert.rejects(resolveDocuments(baza, fakeHttp(route(ok({ data: {} })))), ResolverError);
        await assert.rejects(resolveDocuments(baza, fakeHttp(route(new ResolverError('500', { status: 500 })))), ResolverError);
    });

    it('limit liczby plików', async () => {
        const many = Array.from({ length: 201 }, (_, i) => ({ name: `p${i}`, file: { id: i + 1, name: `p${i}.pdf`, uri: `/api/files/${i + 1}` } }));
        await assert.rejects(resolveDocuments(baza, fakeHttp(route(ok({ data: { advertisement: { attachments: many } } })))), ResolverError);
    });

    it('link spoza Bazy lub bez numeru: NO_SOURCE_URL bez zapytań; adres Bazy w TED trafia do tego adaptera', async () => {
        const http = fakeHttp(route(ok(json('baza-ogloszenie.json'))));
        assert.equal((await resolveDocuments({ ...baza, link: '' }, http)).status, 'NO_SOURCE_URL');
        assert.equal(http.requests.length, 0);
        assert.equal(announcementId('https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/297242?sekcja=ogloszenie'), '297242');
        const fromTed = await resolveDocuments({ source: 'TED', link: 'https://ted.europa.eu/x', documentsUrl: baza.link }, http);
        assert.equal(fromTed.status, 'RESOLVED');
    });
});

describe('host przekierowań sesji (D16)', () => {
    it('przepuszcza platformę i SSO operatora', () => {
        assertSessionUrl('https://platformazakupowa.pl/transakcja/1');
        assertSessionUrl('https://accounts.opennexus.com/oauth2/authorize?prompt=none');
    });

    it('odrzuca inny host i http', () => {
        assert.throws(() => assertSessionUrl('https://example.com/login'), ResolverError);
        assert.throws(() => assertSessionUrl('https://platformazakupowa.pl.evil.com/'), ResolverError);
        assert.throws(() => assertSessionUrl('http://platformazakupowa.pl/transakcja/1'), ResolverError);
    });
});

describe('resolver: numer sprawy z ogłoszenia BZP (pole 4.1.2)', () => {
    const field = (value, colon = ':') => `<h3>4.1.1.) Nazwa</h3> Coś ${value === undefined ? '' : `<h3>4.1.2.) Numer referencyjny${colon}</h3> ${value}`} <h3>4.1.3.) Rodzaj zamówienia:</h3> Dostawy`;

    it('odczytuje numer z kropkami i spacjami (w prawdziwych ogłoszeniach etykieta ma dwukropek)', () => {
        assert.equal(extractReferenceNumber(field('ZP 271.12.2026')), 'ZP 271.12.2026');
        assert.equal(extractReferenceNumber(field('ZAM.271.1.44.2026')), 'ZAM.271.1.44.2026');
        assert.equal(extractReferenceNumber(field('DZP/12/2026', '')), 'DZP/12/2026');
    });

    it('puste pole albo brak pola: null', () => {
        assert.equal(extractReferenceNumber(field('')), null);
        assert.equal(extractReferenceNumber(field(undefined)), null);
        assert.equal(extractReferenceNumber(''), null);
    });
});

describe('dopasowanie postępowania z listy zamawiającego', () => {
    const rows = [
        { id: '1', name: 'ZP 271.12.2026 Dostawa sprzętu komputerowego dla szkół' },
        { id: '2', name: 'ZP 271.14.2026 Łódzka platforma wsparcia oprogramowania biurowego' },
        { id: '3', name: 'ZP 271.14.2026 Zakup licencji oprogramowania biurowego (część 2)' }
    ];

    it('po numerze sprawy, niezależnie od spacji, kropek i wielkości liter', () => {
        assert.equal(matchProceeding(rows, { referenceNumber: 'zp271.12.2026' })?.id, '1');
    });

    it('kilka wierszy z tym samym numerem: rozstrzyga tytuł, a bez niego brak dopasowania', () => {
        assert.equal(matchProceeding(rows, { referenceNumber: 'ZP 271.14.2026' }), null);
        assert.equal(matchProceeding(rows, { referenceNumber: 'ZP 271.14.2026', title: 'Zakup licencji oprogramowania biurowego' })?.id, '3');
    });

    it('bez numeru sprawy dopasowuje po tytule, ale tylko przy jednym kandydacie', () => {
        assert.equal(matchProceeding(rows, { title: 'Dostawa sprzętu komputerowego dla szkół podstawowych' })?.id, '1');
        assert.equal(matchProceeding(rows, { title: 'Dostawa oprogramowania biurowego' }), null);
    });

    it('znany numer sprawy, którego nie ma na liście: nie zgaduje po tytule (wcześniejszy zakup o podobnym tytule)', () => {
        assert.equal(matchProceeding(rows, { referenceNumber: 'ZP 999.1.2026', title: 'Dostawa sprzętu komputerowego dla szkół podstawowych' }), null);
        const bialystok = [{ id: 'old', name: 'ZK-DZP.262.41.2026 Dostawa sprzętu komputerowego na potrzeby Politechniki Białostockiej' }];
        const title = 'Dostawa sprzętu komputerowego na potrzeby Politechniki Białostockiej ZK-DZP.262.57.2026';
        assert.equal(matchProceeding(bialystok, { referenceNumber: 'ZK-DZP.262.57.2026', title }), null);
        // Po opublikowaniu postępowania numer trafia na listę i dopasowanie działa
        assert.equal(matchProceeding([...bialystok, { id: 'new', name: 'ZK-DZP.262.57.2026 Dostawa sprzętu komputerowego na potrzeby Politechniki Białostockiej' }], { referenceNumber: 'ZK-DZP.262.57.2026', title })?.id, 'new');
    });

    it('kilku kandydatów po tytule: wygrywa jedyny z pełnym trafieniem, a przy krótkim tytule brak rozstrzygnięcia', () => {
        const list = [
            { id: 'a', name: 'WEiTI/40/ZP/2026/1035 Dostawa sprzętu komputerowego na potrzeby projektu dla Instytutu Mikroelektroniki Wydziału Elektroniki i Technik Informacyjnych Politechniki Warszawskiej' },
            { id: 'b', name: 'WEiTI/38/ZP/2026/1034 Dostawa sprzętu komputerowego dla Instytutu Radioelektroniki i Technik Multimedialnych Politechniki Warszawskiej.' }
        ];
        const title = 'Dostawa sprzętu komputerowego dla Instytutu Radioelektroniki i Technik Multimedialnych Politechniki Warszawskiej';
        assert.equal(matchProceeding(list, { title })?.id, 'b');
        // Dwa pełne trafienia: nadal niejednoznaczne
        assert.equal(matchProceeding([...list, { id: 'c', name: `${list[1].name} (część 2)` }], { title }), null);
        // Krótki tytuł: pełne trafienie nie rozstrzyga
        assert.equal(matchProceeding([{ id: 'x', name: 'Dostawa sprzętu komputerowego dla szkół' }, { id: 'y', name: 'Dostawa sprzętu komputerowego dla szkół podstawowych' }], { title: 'Dostawa sprzętu komputerowego dla szkół' }), null);
    });

    it('normalizuje polskie znaki, w tym „ł”', () => {
        assert.equal(matchProceeding(rows, { title: 'Lodzka platforma wsparcia oprogramowania biurowego' })?.id, '2');
    });

    it('za krótki numer sprawy nie wystarcza, brak danych i pusta lista: null', () => {
        assert.equal(matchProceeding(rows, { referenceNumber: '12' }), null);
        assert.equal(matchProceeding(rows, {}), null);
        assert.equal(matchProceeding([], { referenceNumber: 'ZP 271.12.2026' }), null);
    });
});

describe('resolver: profil zamawiającego na platformazakupowa.pl', () => {
    const PROFILE = 'https://platformazakupowa.pl/pn/gmina_przyklad';
    const LIST_URL = `${PROFILE}/proceedings`;
    const ted = (documentsUrl, extra = {}) => ({ source: 'TED', link: 'https://ted.europa.eu/x', documentsUrl, ...extra });
    const routes = (list = fixture('pz-proceedings.html')) => [
        ['/proceedings', ok(list)],
        ['/transakcja/', ok(fixture('pz-transakcja.html'))]
    ];

    it('parsuje tylko pierwszą zakładkę (trwające)', () => {
        const parsed = extractProceedings(fixture('pz-proceedings.html'));
        assert.deepEqual(parsed.map((row) => row.id), ['1403900', '1403901', '1403902', '1403903']);
        assert.equal(parsed[0].name, 'ZP 271.12.2026 Dostawa sprzętu komputerowego dla szkół');
        assert.deepEqual(extractProceedings(fixture('pz-proceedings-empty.html')), []);
    });

    it('dopasowanie po numerze sprawy: lista plików wskazanego postępowania', async () => {
        const http = fakeHttp(routes());
        const result = await resolveDocuments(ted(PROFILE, { referenceNumber: 'ZP 271.12.2026', title: 'Dostawa sprzętu' }), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.sourceUrl, 'https://platformazakupowa.pl/transakcja/1403900');
        assert.deepEqual(http.requests, [LIST_URL, 'https://platformazakupowa.pl/transakcja/1403900']);
    });

    it('adres z końcówką /proceedings albo /login też prowadzi do dopasowania', async () => {
        for (const suffix of ['/proceedings', '/login']) {
            const result = await resolveDocuments(ted(`${PROFILE}${suffix}`, { referenceNumber: 'ZP 271.13.2026' }), fakeHttp(routes()));
            assert.equal(result.sourceUrl, 'https://platformazakupowa.pl/transakcja/1403901');
        }
    });

    it('dopasowanie tylko po tytule, gdy numeru sprawy brak', async () => {
        const result = await resolveDocuments(ted(PROFILE, { title: 'Remont dachu budynku urzędu miasta' }), fakeHttp(routes()));
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.sourceUrl, 'https://platformazakupowa.pl/transakcja/1403901');
    });

    it('niejednoznaczne trafienie, brak trafienia i pusta lista: PROFILE_NOT_MATCHED bez pobierania postępowania', async () => {
        const cases = [
            [{ referenceNumber: 'ZP 271.14.2026' }, fixture('pz-proceedings.html')],
            [{ referenceNumber: 'ZP 271.77.2026', title: 'Zupełnie inne zamówienie' }, fixture('pz-proceedings.html')],
            [{ referenceNumber: 'ZP 271.12.2026' }, fixture('pz-proceedings-empty.html')]
        ];
        for (const [hints, list] of cases) {
            const http = fakeHttp(routes(list));
            const result = await resolveDocuments(ted(PROFILE, hints), http);
            assert.equal(result.status, 'PROFILE_NOT_MATCHED');
            assert.equal(result.sourceUrl, PROFILE);
            assert.deepEqual(http.requests, [LIST_URL]);
        }
    });

    it('postępowanie z zakładki zakończonych nie jest brane pod uwagę', async () => {
        const result = await resolveDocuments(ted(PROFILE, { referenceNumber: 'ZP 271.99.2026' }), fakeHttp(routes()));
        assert.equal(result.status, 'PROFILE_NOT_MATCHED');
    });

    it('bez numeru sprawy i tytułu nie wysyła zapytania', async () => {
        const http = fakeHttp([]);
        assert.equal((await resolveDocuments(ted(PROFILE), http)).status, 'PROFILE_NOT_MATCHED');
        assert.equal(http.requests.length, 0);
    });

    it('przekierowanie zamiast listy to błąd platformy, nie brak dopasowania', async () => {
        const http = fakeHttp([['/proceedings', { status: 302, data: '', location: 'https://platformazakupowa.pl/login' }]]);
        await assert.rejects(resolveDocuments(ted(PROFILE, { referenceNumber: 'ZP 271.12.2026' }), http), ResolverError);
    });

    it('lista na kilku stronach: postępowanie ze strony 2 jest znalezione', async () => {
        const withPaging = (html, last) => `${html}<ul class="pagination"><li><a href="?page=2&&amp;tab=active&amp;query=">2</a></li><li><a href="?page=${last}&&amp;tab=active&amp;query=">${last}</a></li></ul>`;
        const page1 = withPaging(fixture('pz-proceedings.html'), 2);
        const page2 = fixture('pz-proceedings.html').replaceAll('1403900', '1409900').replace('ZP 271.12.2026', 'WEiTI/38/ZP/2026/1034');
        const http = fakeHttp([['?page=2', ok(page2)], ['/proceedings', ok(page1)], ['/transakcja/', ok(fixture('pz-transakcja.html'))]]);
        const result = await resolveDocuments(ted(PROFILE, { referenceNumber: 'WEiTI/38/ZP/2026/1034' }), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.sourceUrl, 'https://platformazakupowa.pl/transakcja/1409900');
        assert.deepEqual(http.requests, [LIST_URL, `${LIST_URL}?page=2&tab=active&query=&sort-field=endsAt&sort-type=DESC`, 'https://platformazakupowa.pl/transakcja/1409900']);
    });

    it('lista ucięta limitem stron: po samym tytule nie dopasowujemy', async () => {
        const html = `${fixture('pz-proceedings.html')}<a href="?page=50&amp;tab=active">50</a>`;
        const http = fakeHttp([['/proceedings', ok(html)], ['/transakcja/', ok(fixture('pz-transakcja.html'))]]);
        const byTitle = await resolveDocuments(ted(PROFILE, { title: 'Remont dachu budynku urzędu miasta' }), http);
        assert.equal(byTitle.status, 'PROFILE_NOT_MATCHED');
        assert.equal(http.requests.length, 10);
    });

    it('eZamówienia: numer sprawy z pola 4.1.2 ogłoszenia trafia do dopasowania profilu', async () => {
        const body = `${fixture('ez-body-profile.html')} <h3>4.1.2.) Numer referencyjny</h3> ZP 271.13.2026 <h3>4.1.3.) Rodzaj</h3> x`;
        const http = fakeHttp([...ezRoutes({ docs: [], body }), ...routes()]);
        const result = await resolveDocuments({ ...ez, title: 'Remont' }, http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.sourceUrl, 'https://platformazakupowa.pl/transakcja/1403901');
    });
});

describe('resolver: ezamawiający (Marketplanet)', () => {
    const HOST = 'https://klient.ezamawiajacy.pl';
    const BY_DEMAND = `${HOST}/pn/KLIENT/demand/333986/notice/public/details`;
    const CANONICAL = `${HOST}/pn/KLIENT/demand/notice/public/242550/details`;
    const ted = (documentsUrl, extra = {}) => ({ source: 'TED', link: 'https://ted.europa.eu/x', documentsUrl, ...extra });
    const redirect = (location) => ({ status: 302, data: '', location });
    const detailRoutes = (page = fixture('ezm-postepowanie.html')) => [
        ['/demand/333986/notice/public/details', redirect('/pn/KLIENT/demand/notice/public/242550/details')],
        ['/notice/public/242550/details', ok(page)]
    ];
    const listRoutes = (list = fixture('ezm-lista.html')) => [
        ['/servlet/HomeServlet', ok(fixture('ezm-start.html'))],
        ['/publicpzp/current/list', ok(list)],
        ['/details', ok(fixture('ezm-postepowanie.html'))]
    ];

    it('pliki z tabeli: nazwy, daty, kotwica wiersza; wiersz „Ogłoszenie” (id _-2) pominięty', () => {
        const files = extractEzamawiajacyFiles(fixture('ezm-postepowanie.html'), CANONICAL);
        assert.deepEqual(files.map((file) => file.platformFileId), ['2396170', '2396171', '2396172']);
        assert.deepEqual(files.map((file) => file.path), ['Specyfikacja warunków zamówienia - SWZ.docx', 'Opis przedmiotu zamówienia & załączniki.pdf', 'Wzór umowy.zip']);
        assert.equal(files[1].publishedAt, '2026-11-10T12:35:00');
        assert.equal(files[0].url, `${CANONICAL}#_2396170`);
        assert.ok(files.every((file) => !file.url.includes('/repository/download/')), 'nie zapisujemy tokenów pobrania');
    });

    it('lista postępowań: dekoduje encje numeryczne; niepełna lista (kolejne strony) jest rozpoznana', () => {
        const full = extractList(fixture('ezm-lista.html'));
        assert.deepEqual(full.rows.map((row) => row.id), ['242552', '242791', '242800']);
        assert.equal(full.rows[0].name, 'BZP.271.1.75.2026 Świadczenie usług wsparcia technicznego dla środowiska chmurowego');
        assert.equal(full.rows[1].name, 'BZP.271.1.76.2026 Wykonanie gadżetów z przeznaczeniem na cele promocyjne (6 części).');
        assert.equal(full.complete, true);
        assert.equal(extractList(fixture('ezm-lista.html').replace('z&nbsp;3', 'z&nbsp;9')).complete, false);
    });

    it('adres /demand/<id>/notice/public/details: przekierowanie, potem lista plików', async () => {
        const http = fakeHttp(detailRoutes());
        const result = await resolveDocuments(ted(BY_DEMAND), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'ezamawiajacy');
        assert.equal(result.sourceUrl, CANONICAL);
        assert.equal(result.files.length, 3);
        assert.deepEqual(http.requests, [BY_DEMAND, CANONICAL]);
    });

    it('adres docelowy ogłoszenia: jedno zapytanie; odcisk zależy od listy plików', async () => {
        const first = await resolveDocuments(ted(CANONICAL), fakeHttp(detailRoutes()));
        const http = fakeHttp(detailRoutes());
        await resolveDocuments(ted(CANONICAL), http);
        assert.deepEqual(http.requests, [CANONICAL]);
        const fewer = fixture('ezm-postepowanie.html').replace(/<tr class="fileDataRow" id="_2396172">[\s\S]*?<\/tr>/, '');
        const changed = await resolveDocuments(ted(CANONICAL), fakeHttp(detailRoutes(fewer)));
        assert.equal(changed.files.length, 2);
        assert.notEqual(first.fingerprint, changed.fingerprint);
    });

    it('zamowienia.um.warszawa.pl to ten sam silnik', async () => {
        const url = 'https://zamowienia.um.warszawa.pl/pn/umw/demand/notice/public/236895/details';
        const result = await resolveDocuments(ted(url), fakeHttp([['/236895/details', ok(fixture('ezm-postepowanie.html'))]]));
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'ezamawiajacy');
    });

    it('postępowanie bez dokumentów: NO_DOCUMENTS_YET', async () => {
        const result = await resolveDocuments(ted(CANONICAL), fakeHttp(detailRoutes(fixture('ezm-postepowanie-puste.html'))));
        assert.equal(result.status, 'NO_DOCUMENTS_YET');
        assert.equal(result.platform, 'ezamawiajacy');
    });

    it('postępowanie zakończone (przekierowanie na logowanie): wynik końcowy, nie błąd', async () => {
        const login = '/app/login?savedUrl=%2Fpn%2FKLIENT%2Fdemand%2Fnotice%2Fpublic%2F242550%2Fdetails&errorMsg=jsp.statuses.expired';
        const result = await resolveDocuments(ted(CANONICAL), fakeHttp([['/242550/details', redirect(login)]]));
        assert.equal(result.status, 'UNSUPPORTED_PLATFORM');
        assert.equal(result.platform, 'ezamawiajacy');
        assert.match(result.note, /logowanie/);
    });

    it('przekierowanie na inny host albo bez adresu to błąd platformy', async () => {
        await assert.rejects(resolveDocuments(ted(CANONICAL), fakeHttp([['/242550/details', redirect('https://example.com/x')]])), ResolverError);
        await assert.rejects(resolveDocuments(ted(CANONICAL), fakeHttp([['/242550/details', { status: 302, data: '' }]])), ResolverError);
        const loop = fakeHttp([['/242550/details', redirect('/pn/KLIENT/demand/notice/public/242550/details')]]);
        await assert.rejects(resolveDocuments(ted(CANONICAL), loop), ResolverError);
    });

    it('adres ogólny: strona główna → lista → dopasowanie po numerze sprawy → pliki', async () => {
        const http = fakeHttp(listRoutes());
        const result = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'BZP.271.1.76.2026' }), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.sourceUrl, `${HOST}/pn/KLIENT/demand/notice/public/242791/details`);
        assert.deepEqual(http.requests, [`${HOST}/servlet/HomeServlet`, `${HOST}/pn/KLIENT/demand/notice/publicpzp/current/list`, `${HOST}/pn/KLIENT/demand/notice/public/242791/details`]);
    });

    it('adres ogólny z identyfikatorem zamawiającego w ścieżce pomija stronę główną', async () => {
        const http = fakeHttp(listRoutes());
        const result = await resolveDocuments(ted(`${HOST}/pn/KLIENT/demand/notice/lowcost/current/list`, { referenceNumber: 'BZP.271.1.76.2026' }), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(http.requests.length, 2);
        assert.ok(!http.requests.some((request) => request.includes('HomeServlet')));
    });

    it('adres ogólny: brak numeru sprawy i tytułu, brak trafienia, brak odnośnika na stronie głównej: PROFILE_NOT_MATCHED', async () => {
        const none = fakeHttp([]);
        assert.equal((await resolveDocuments(ted(`${HOST}/`), none)).status, 'PROFILE_NOT_MATCHED');
        assert.equal(none.requests.length, 0);

        const noMatch = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'BZP.271.9.999.2026', title: 'Zupełnie inne zamówienie' }), fakeHttp(listRoutes()));
        assert.equal(noMatch.status, 'PROFILE_NOT_MATCHED');
        assert.equal(noMatch.platform, 'ezamawiajacy');

        const noLink = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'BZP.271.1.76.2026' }), fakeHttp([['/servlet/HomeServlet', ok('<html></html>')]]));
        assert.equal(noLink.status, 'PROFILE_NOT_MATCHED');
    });

    it('niepełna lista: dopasowanie po numerze działa, po samym tytule nie', async () => {
        const partial = fixture('ezm-lista.html').replace('z&nbsp;3', 'z&nbsp;9');
        const byNumber = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'BZP.271.1.76.2026' }), fakeHttp(listRoutes(partial)));
        assert.equal(byNumber.status, 'RESOLVED');
        const byTitle = await resolveDocuments(ted(`${HOST}/`, { title: 'Dostawa licencji oprogramowania biurowego' }), fakeHttp(listRoutes(partial)));
        assert.equal(byTitle.status, 'PROFILE_NOT_MATCHED');
        const byTitleFull = await resolveDocuments(ted(`${HOST}/`, { title: 'Dostawa licencji oprogramowania biurowego' }), fakeHttp(listRoutes()));
        assert.equal(byTitleFull.status, 'RESOLVED');
    });

    it('lista na kilku stronach: postępowanie z drugiej strony (GD_pagestart)', async () => {
        const page1 = fixture('ezm-lista.html').replace('z&nbsp;3', 'z&nbsp;4');
        const page2 = fixture('ezm-lista.html').replace('Pozycje&nbsp;1-3&nbsp;z&nbsp;3', 'Pozycje&nbsp;4-4&nbsp;z&nbsp;4')
            .replaceAll('242552', '252552').replaceAll('242791', '252791').replaceAll('242800', '252800').replaceAll('BZP.271.1.76.2026', 'ZI-1.271.89.2026');
        const http = fakeHttp([['GD_pagestart=3', ok(page2)], ...listRoutes(page1)]);
        const result = await resolveDocuments(ted(`${HOST}/pn/KLIENT/demand/notice/lowcost/current/list`, { referenceNumber: 'ZI-1.271.89.2026', title: 'Inny tytuł' }), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.sourceUrl, `${HOST}/pn/KLIENT/demand/notice/public/252791/details`);
        assert.ok(http.requests.includes(`${HOST}/pn/KLIENT/demand/notice/publicpzp/current/list?GD_pagestart=3`));
    });

    it('eZamówienia z adresem ezamawiającego w polu 3.1: numer sprawy z ogłoszenia', async () => {
        const body = `<h3>3.1.) Adres strony internetowej prowadzonego postępowania</h3> ${HOST}/ <h3>3.2.) Dostęp</h3> Nie <h3>4.1.2.) Numer referencyjny:</h3> BZP.271.1.76.2026 <h3>4.1.3.) Rodzaj:</h3> x`;
        const result = await resolveDocuments(ez, fakeHttp([...ezRoutes({ docs: [], body }), ...listRoutes()]));
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'ezamawiajacy');
    });

    it('www.ezamawiajacy.pl (witryna producenta) nie jest zamawiającym', async () => {
        const http = fakeHttp([]);
        assert.equal((await resolveDocuments(ted('https://www.ezamawiajacy.pl/', { referenceNumber: 'ZP 1/2026' }), http)).status, 'UNSUPPORTED_PLATFORM');
        assert.equal(http.requests.length, 0);
    });
});

describe('resolver: logintrade', () => {
    const HOST = 'https://klient.logintrade.net';
    const PROCEEDING = `${HOST}/zapytania_email,245002,bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.html`;
    const ted = (documentsUrl, extra = {}) => ({ source: 'TED', link: 'https://ted.europa.eu/x', documentsUrl, ...extra });
    const listRoutes = (list = fixture('lt-lista.html'), page = fixture('lt-postepowanie.html')) => [
        ['/rejestracja/ustawowe.html', ok(list)],
        ['/zapytania_email,', ok(page)]
    ];

    it('załączniki: nazwy, daty, kotwica; adresów /DocumentService (zakazanych w robots.txt) nie zapisujemy', () => {
        const files = extractLogintradeFiles(fixture('lt-postepowanie.html'), PROCEEDING);
        assert.deepEqual(files.map((file) => file.platformFileId), ['1444913', '1444914', '1444915']);
        assert.deepEqual(files.map((file) => file.path), ['Załącznik nr 4 do SWZ_Wzór oświadczenia Wykonawcy.doc', 'Specyfikacja warunków zamówienia & załączniki.pdf', 'Wzór umowy.zip']);
        assert.equal(files[0].publishedAt, '2026-11-12T10:37:19');
        assert.equal(files[0].url, `${PROCEEDING}#attachment-1444913`);
        assert.ok(files.every((file) => !file.url.includes('DocumentService')));
        assert.deepEqual(extractLogintradeFiles(fixture('lt-postepowanie-puste.html'), PROCEEDING), []);
    });

    it('lista: znak sprawy z tytułem; stronicowanie rozpoznane po ?page=2', () => {
        const full = extractLogintradeList(fixture('lt-lista.html'));
        assert.equal(full.rows.length, 3);
        assert.equal(full.rows[1].name, 'DZP.231.18.2026 Świadczenie usług ratownictwa wodnego i pierwszej pomocy w zespole obiektów basenowych');
        assert.equal(full.rows[1].id, `${HOST}/zapytania_email,245002,bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.html`);
        assert.equal(full.complete, true);
        const more = fixture('lt-lista.html').replace('</ul>', '<li><a href="https://klient.logintrade.net/rejestracja/ustawowe.html?page=2">2</a></li></ul>');
        assert.equal(extractLogintradeList(more).complete, false);
    });

    it('adres postępowania: lista plików, jedno zapytanie', async () => {
        const http = fakeHttp(listRoutes());
        const result = await resolveDocuments(ted(PROCEEDING), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'logintrade');
        assert.equal(result.sourceUrl, PROCEEDING);
        assert.equal(result.files.length, 3);
        assert.deepEqual(http.requests, [PROCEEDING]);
    });

    it('postępowanie bez załączników: NO_DOCUMENTS_YET', async () => {
        const result = await resolveDocuments(ted(PROCEEDING), fakeHttp(listRoutes(undefined, fixture('lt-postepowanie-puste.html'))));
        assert.equal(result.status, 'NO_DOCUMENTS_YET');
        assert.equal(result.platform, 'logintrade');
    });

    it('adres ogólny: lista → dopasowanie po numerze sprawy → pliki', async () => {
        const http = fakeHttp(listRoutes());
        const result = await resolveDocuments(ted(`${HOST}/rejestracja/ustawowe.html`, { referenceNumber: 'DZP.231.18.2026' }), http);
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.sourceUrl, PROCEEDING);
        assert.deepEqual(http.requests, [`${HOST}/rejestracja/ustawowe.html`, PROCEEDING]);
    });

    it('adres ogólny: strona główna zamawiającego też prowadzi do listy', async () => {
        const result = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'DZP.231.18.2026' }), fakeHttp(listRoutes()));
        assert.equal(result.status, 'RESOLVED');
    });

    it('adres ogólny: brak danych, brak trafienia: PROFILE_NOT_MATCHED', async () => {
        const none = fakeHttp([]);
        assert.equal((await resolveDocuments(ted(`${HOST}/`), none)).status, 'PROFILE_NOT_MATCHED');
        assert.equal(none.requests.length, 0);

        const http = fakeHttp(listRoutes());
        const noMatch = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'DZP.999.1.2026', title: 'Zupełnie inne zamówienie' }), http);
        assert.equal(noMatch.status, 'PROFILE_NOT_MATCHED');
        assert.equal(noMatch.platform, 'logintrade');
        assert.deepEqual(http.requests, [`${HOST}/rejestracja/ustawowe.html`]);
    });

    it('niepełna lista: dopasowanie po numerze działa, po samym tytule nie', async () => {
        const partial = fixture('lt-lista.html').replace('</ul>', '<li><a href="?page=2">2</a></li></ul>');
        const byNumber = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'DZP.231.13.2026' }), fakeHttp(listRoutes(partial)));
        assert.equal(byNumber.status, 'RESOLVED');
        const byTitle = await resolveDocuments(ted(`${HOST}/`, { title: 'Dostawa sprzętu komputerowego dla szkół' }), fakeHttp(listRoutes(partial)));
        assert.equal(byTitle.status, 'PROFILE_NOT_MATCHED');
    });

    it('lista na kilku stronach: postępowanie z drugiej strony (?page=2)', async () => {
        const link = '<li><a href="?page=2">2</a></li></ul>';
        const page1 = fixture('lt-lista.html').replace('</ul>', link);
        const page2 = fixture('lt-lista.html').replace('</ul>', link)
            .replaceAll('245001', '255001').replaceAll('245002', '255002').replaceAll('245003', '255003').replace('DZP.231.18.2026', 'ZP.1.2026.77');
        const http = fakeHttp([['ustawowe.html?page=2', ok(page2)], ...listRoutes(page1)]);
        const result = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'ZP.1.2026.77', title: 'Inny tytuł' }), http);
        assert.equal(result.status, 'RESOLVED');
        assert.match(result.sourceUrl, /zapytania_email,255002,/);
    });

    it('odnośnik z listy na inny host albo o dziwnej postaci nie jest wykonywany', async () => {
        const evil = fixture('lt-lista.html').replace('https://klient.logintrade.net/zapytania_email,245002', 'https://example.com/zapytania_email,245002');
        const http = fakeHttp(listRoutes(evil));
        const result = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'DZP.231.18.2026' }), http);
        assert.equal(result.status, 'PROFILE_NOT_MATCHED');
        assert.deepEqual(http.requests, [`${HOST}/rejestracja/ustawowe.html`]);
    });

    it('przekierowanie na inny host to błąd platformy', async () => {
        const http = fakeHttp([['/zapytania_email,', { status: 302, data: '', location: 'https://example.com/x' }]]);
        await assert.rejects(resolveDocuments(ted(PROCEEDING), http), ResolverError);
    });

    it('www.logintrade.net (witryna producenta) nie jest zamawiającym', async () => {
        const http = fakeHttp([]);
        assert.equal((await resolveDocuments(ted('https://www.logintrade.net/', { referenceNumber: 'ZP 1/2026' }), http)).status, 'UNSUPPORTED_PLATFORM');
        assert.equal(http.requests.length, 0);
    });

    it('eZamówienia z adresem logintrade w polu 3.1: numer sprawy z ogłoszenia', async () => {
        const body = `<h3>3.1.) Adres strony internetowej prowadzonego postępowania</h3> ${HOST}/rejestracja/ustawowe.html <h3>3.2.) Dostęp</h3> Nie <h3>4.1.2.) Numer referencyjny:</h3> DZP.231.18.2026 <h3>4.1.3.) Rodzaj:</h3> x`;
        const result = await resolveDocuments(ez, fakeHttp([...ezRoutes({ docs: [], body }), ...listRoutes()]));
        assert.equal(result.status, 'RESOLVED');
        assert.equal(result.platform, 'logintrade');
    });
});

describe('resolver: SIDAS PZP', () => {
    const HOST = 'https://zamowienia.sidaspzp.pl';
    const UUID = '0a25e1d6-9add-4f18-8a07-742bd37ce041';
    const FILES_URL = `${HOST}/zamowienia/${UUID}/pliki`;
    const ted = (documentsUrl, extra = {}) => ({ source: 'TED', link: 'https://ted.europa.eu/x', documentsUrl, ...extra });

    it('pliki z __NEXT_DATA__: SWZ i załączniki; usunięty trafia do excluded; adresu pobierania nie zapisujemy', () => {
        const { files, excluded } = extractSidasFiles(fixture('sidas-pliki.html'), FILES_URL);
        assert.deepEqual(files.map((file) => file.path), ['SWZ.pdf', '1. załącznik_nr_1_oferta.doc', '1a. Formularz cenowy & wycena.xlsx', 'Wzór umowy.pdf']);
        assert.deepEqual(excluded, [{ name: 'Stary wzór umowy.pdf', reason: 'deleted' }]);
        assert.equal(files[0].url, `${FILES_URL}#file-aaaaaaaa-0000-4000-8000-000000000001`);
        assert.equal(files[0].publishedAt, '2026-11-12T10:15:50+01:00');
    });

    it('strona bez danych Next.js to błąd platformy, a nie „brak plików”', () => {
        assert.throws(() => extractSidasFiles('<html><body>Zmiana układu</body></html>', FILES_URL), ResolverError);
    });

    it('adres postępowania (także bez /pliki): jedno zapytanie o /pliki', async () => {
        for (const url of [FILES_URL, `${HOST}/zamowienia/${UUID}`, `${HOST}/zamowienia/${UUID}/szczegoly?x=1`]) {
            const http = fakeHttp([['/pliki', ok(fixture('sidas-pliki.html'))]]);
            const result = await resolveDocuments(ted(url), http);
            assert.equal(result.status, 'RESOLVED');
            assert.equal(result.platform, 'sidaspzp');
            assert.equal(result.sourceUrl, FILES_URL);
            assert.equal(result.files.length, 4);
            assert.deepEqual(http.requests, [FILES_URL]);
        }
    });

    it('postępowanie bez plików: NO_DOCUMENTS_YET', async () => {
        const result = await resolveDocuments(ted(FILES_URL), fakeHttp([['/pliki', ok(fixture('sidas-pliki-puste.html'))]]));
        assert.equal(result.status, 'NO_DOCUMENTS_YET');
        assert.equal(result.platform, 'sidaspzp');
    });

    it('adres ogólny: PROFILE_NOT_MATCHED bez zapytań', async () => {
        const http = fakeHttp([]);
        const result = await resolveDocuments(ted(`${HOST}/`, { referenceNumber: 'IZP.272.1.2026' }), http);
        assert.equal(result.status, 'PROFILE_NOT_MATCHED');
        assert.equal(result.platform, 'sidaspzp');
        assert.equal(http.requests.length, 0);
    });

    it('przekierowanie na inny host to błąd platformy', async () => {
        const http = fakeHttp([['/pliki', { status: 302, data: '', location: 'https://example.com/x' }]]);
        await assert.rejects(resolveDocuments(ted(FILES_URL), http), ResolverError);
    });

    it('inne hosty sidaspzp.pl (np. app.) nie są stroną postępowań', async () => {
        const http = fakeHttp([]);
        assert.equal((await resolveDocuments(ted('https://app.sidaspzp.pl/'), http)).status, 'UNSUPPORTED_PLATFORM');
        assert.equal(http.requests.length, 0);
    });
});

describe('resolver: e-ProPublico', () => {
    const HOST = 'https://e-propublico.pl';
    const ID = '53f4170b-933b-48cb-889d-e2f4b48998dc';
    const DOCS_URL = `${HOST}/Ogloszenia/DokumentyZamowienia?przetargId=${ID}`;
    const ted = (documentsUrl, extra = {}) => ({ source: 'TED', link: 'https://ted.europa.eu/x', documentsUrl, ...extra });

    it('pliki z sekcji dokumentacji: bez sekcji „Ogłoszenie”, rozszerzenie z kolumny „Typ”, adres pobrania bezpośredni', () => {
        const files = extractEpropublicoFiles(fixture('epropublico-dokumenty.html'), DOCS_URL);
        assert.equal(files.length, 7);
        assert.ok(!files.some((file) => file.path.startsWith('Ogłoszenie')));
        const opis = files.find((file) => file.path === '5_Opis przedmiotu zamówienia.zip');
        assert.ok(opis);
        assert.equal(opis.url, `${HOST}/Dokumenty/Download/11ca3cc7-204d-0845-9d9f-55f8a4f27c57`);
        assert.equal(opis.platformFileId, '11ca3cc7-204d-0845-9d9f-55f8a4f27c57');
        assert.equal(opis.publishedAt, '2026-11-24T00:00:00');
    });

    it('strona bez sekcji to błąd platformy, a nie „brak plików”', () => {
        assert.throws(() => extractEpropublicoFiles('<html><body>Zmiana układu</body></html>', DOCS_URL), ResolverError);
    });

    it('adres szczegółów lub listy dokumentów: jedno zapytanie o listę dokumentów', async () => {
        for (const url of [`${HOST}/Ogloszenia/Details/${ID.toUpperCase()}`, DOCS_URL, `${HOST}/Ogloszenia/DokumentyZamowienia?przetargId=${ID.toUpperCase()}`]) {
            const http = fakeHttp([['/DokumentyZamowienia', ok(fixture('epropublico-dokumenty.html'))]]);
            const result = await resolveDocuments(ted(url), http);
            assert.equal(result.status, 'RESOLVED');
            assert.equal(result.platform, 'epropublico');
            assert.equal(result.sourceUrl, DOCS_URL);
            assert.equal(result.files.length, 7);
            assert.deepEqual(http.requests, [DOCS_URL]);
        }
    });

    it('tylko ogłoszenie, bez dokumentacji: NO_DOCUMENTS_YET', async () => {
        const result = await resolveDocuments(ted(DOCS_URL), fakeHttp([['/DokumentyZamowienia', ok(fixture('epropublico-dokumenty-puste.html'))]]));
        assert.equal(result.status, 'NO_DOCUMENTS_YET');
        assert.equal(result.platform, 'epropublico');
    });

    it('adres ogólny: PROFILE_NOT_MATCHED bez zapytań', async () => {
        for (const url of [`${HOST}/`, `${HOST}/Zamawiajacy/AktualneOgloszenia?zamawiajacyId=${ID}`, `${HOST}/Ogloszenia/DokumentyZamowienia?przetargId=x`]) {
            const http = fakeHttp([]);
            const result = await resolveDocuments(ted(url, { referenceNumber: 'CRZP/218/2026/AZP' }), http);
            assert.equal(result.status, 'PROFILE_NOT_MATCHED');
            assert.equal(result.platform, 'epropublico');
            assert.equal(http.requests.length, 0);
        }
    });

    it('przekierowanie na inny host to błąd platformy', async () => {
        const http = fakeHttp([['/DokumentyZamowienia', { status: 302, data: '', location: 'https://example.com/x' }]]);
        await assert.rejects(resolveDocuments(ted(DOCS_URL), http), ResolverError);
    });
});
