// Test integracyjny refreshTenders na emulatorach, z lokalnym serwerem udającym TED, eZamówienia i Bazę Konkurencyjności.
// Adresy źródeł pochodzą z functions/.env.demo-tenders. Uruchamiany przez: npm run test:functions
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import { createRequire } from 'node:module';
import { after, before, describe, it } from 'node:test';
import { initializeApp } from 'firebase/app';
import {
    connectAuthEmulator,
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { addDays, todayInWarsaw } from '../functions/lib/tenders/dates.js';

const PROJECT_ID = 'demo-tenders';
const STUB_PORT = 9199;
const DAY_MS = 24 * 60 * 60 * 1000;
const ADMIN = { email: 'admin@example.com', password: 'secret123' };
const MEMBER = { email: 'member@example.com', password: 'secret123' };

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const admin = requireFromFunctions('firebase-admin');
admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const app = initializeApp({ apiKey: 'fake-key', projectId: PROJECT_ID, authDomain: `${PROJECT_ID}.firebaseapp.com` });
const auth = getAuth(app);
connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
const functions = getFunctions(app, 'europe-central2');
connectFunctionsEmulator(functions, '127.0.0.1', 5001);
const refreshTenders = httpsCallable(functions, 'refreshTenders');

const today = todayInWarsaw();
const yesterday = addDays(today, -1);

// ---- Dane serwera udającego źródła ----

const tedNotice = (number, extra = {}) => ({
    'publication-number': number,
    'publication-date': `${today}+01:00`,
    'notice-title': { pol: `Polska – Ogłoszenie ${number}` },
    'organisation-name-buyer': { pol: ['Gmina Testowa'] },
    'buyer-city': { mul: ['Testowo'] },
    'classification-cpv': ['30213300'],
    ...extra
});

const ezNotice = (number, publicationDate) => ({
    noticeNumber: `2026/BZP ${number}/01`,
    publicationDate,
    submittingOffersDate: `${addDays(today, 7)}T11:00:00Z`,
    cpvCode: '30213300-8 (Komputer)',
    orderObject: `Zamówienie ${number}`,
    organizationName: 'Gmina Testowa',
    organizationCity: 'Testowo',
    objectId: `obj-${number}`
});

const stub = {
    tedFails: false,
    ezFails: false,
    // Ile kolejnych zapytań do TED ma dostać 429, zanim źródło zacznie odpowiadać
    tedRateLimited: 0,
    tedRequests: 0,
    tedNotices: [tedNotice('100001-2026'), tedNotice('100002-2026'), tedNotice('100003-2026', { 'change-notice-version-identifier': '2' })],
    // 11 w dniu odświeżania (wymusza drugą stronę) + 1 z poprzedniego dnia, który trzeba odfiltrować
    ezByType: {
        Delivery: [
            ...Array.from({ length: 11 }, (_, i) => ezNotice(`D${String(i).padStart(2, '0')}`, `${today}T10:${String(59 - i).padStart(2, '0')}:00.1234567Z`)),
            ezNotice('DOLD', `${yesterday}T12:00:00Z`)
        ],
        Services: [ezNotice('S00', `${today}T09:00:00Z`)],
        Works: []
    },
    ezRequests: [],
    // Baza Konkurencyjności: identyfikatory z wyszukiwania, ogłoszenia z 404 przy szczegółach i zapisane zapytania
    bazaFails: false,
    bazaIds: [900001, 900002],
    bazaGoneIds: [],
    // Ogłoszenia zmienione po pierwszej publikacji: wersja z dzisiaj, ale opublikowane wcześniej
    bazaOriginalDates: { 900002: addDays(today, -5) },
    bazaSearches: [],
    bazaDetailRequests: []
};

const bazaDetail = (id) => ({
    id: id + 100000,
    advertisement: { id, publication_date: stub.bazaOriginalDates[id] ?? today },
    title: `Ogłoszenie Bazy ${id}`,
    publication_date: today,
    submission_deadline: `${addDays(today, 7)} 12:00:00`,
    advertiser_address_details: {
        name: 'Gmina Testowa',
        identification_number_type: 'nip',
        identification_number: '1234567890',
        address: { country: 'Polska', locality: 'Testowo' }
    },
    orders: [{ order_items: [{ category: { id: 3 }, cpv_items: [{ code: '30213300-8' }] }] }],
    // Dane osobowe, które nie mogą trafić do bazy
    contact_persons: [{ first_name: 'Jan', last_name: 'Tajny', phone: '600100200', email: 'tajny@example.com' }],
    created_by: { first_name: 'Anna', last_name: 'Ukryta' }
});

const readBody = (request) =>
    new Promise((resolve) => {
        let data = '';
        request.on('data', (chunk) => (data += chunk));
        request.on('end', () => resolve(data));
    });

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${STUB_PORT}`);
    const send = (status, body) => {
        response.writeHead(status, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(body));
    };

    if (url.pathname === '/ted' && request.method === 'POST') {
        const body = JSON.parse(await readBody(request));
        stub.tedRequests++;
        if (stub.tedFails) return send(500, { error: 'boom' });
        if (stub.tedRateLimited > 0) {
            stub.tedRateLimited--;
            return send(429, { error: 'Too Many Requests' });
        }
        return send(200, { notices: body.page === 1 ? stub.tedNotices : [] });
    }

    if (url.pathname === '/ezamowienia' && request.method === 'GET') {
        const orderType = url.searchParams.get('orderType');
        const page = Number(url.searchParams.get('PageNumber'));
        stub.ezRequests.push(Object.fromEntries(url.searchParams));
        if (stub.ezFails) return send(500, { error: 'boom' });
        return send(200, (stub.ezByType[orderType] ?? []).slice((page - 1) * 10, page * 10));
    }

    if (url.pathname === '/baza/search' && request.method === 'GET') {
        if (stub.bazaFails) return send(500, { error: 'boom' });
        stub.bazaSearches.push(url.searchParams);
        return send(200, {
            status: 'OK',
            data: { advertisements: stub.bazaIds.map((id) => ({ id })), meta: { total: stub.bazaIds.length } }
        });
    }

    const bazaMatch = url.pathname.match(/^\/baza\/(\d+)$/);
    if (bazaMatch && request.method === 'GET') {
        const id = Number(bazaMatch[1]);
        stub.bazaDetailRequests.push(id);
        if (stub.bazaGoneIds.includes(id) || !stub.bazaIds.includes(id)) return send(404, {});
        return send(200, { status: 'OK', data: { advertisement: bazaDetail(id) } });
    }

    return send(404, {});
});

// ---- Pomocnicze ----

const expectCode = async (promise, code) => {
    await assert.rejects(promise, (error) => {
        assert.equal(error.code, `functions/${code}`);
        return true;
    });
};

const signInAs = async ({ email, password }) => {
    await signOut(auth);
    await signInWithEmailAndPassword(auth, email, password);
    await auth.currentUser.getIdToken(true);
};

before(async () => {
    await new Promise((resolve) => server.listen(STUB_PORT, '127.0.0.1', resolve));
    execFileSync('node', ['functions/scripts/setAdmin.js', PROJECT_ID, ADMIN.email, ADMIN.password], { stdio: 'inherit' });
    const member = await admin.auth().createUser(MEMBER);
    await admin.auth().setCustomUserClaims(member.uid, { role: 'member' });
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
});

describe('refreshTenders', () => {
    it('odrzuca niezalogowanego (tryb otwarty: konto bez roli jest dopuszczone)', async () => {
        await signOut(auth);
        await expectCode(refreshTenders({}), 'unauthenticated');
    });

    it('odrzuca nieprawidłowe daty', async () => {
        await signInAs(MEMBER);
        await expectCode(refreshTenders({ date: 'wczoraj' }), 'invalid-argument');
        await expectCode(refreshTenders({ date: addDays(today, 1) }), 'invalid-argument');
        await expectCode(refreshTenders({ date: addDays(today, -40) }), 'invalid-argument');
    });

    it('zapisuje przetargi z obu źródeł, z drugą stroną i bez ogłoszeń zmieniających oraz z innych dni', async () => {
        const { data } = await refreshTenders({});

        assert.equal(data.date, today);
        assert.deepEqual(data.fetched, { TED: 2, E_ZAMOWIENIA: 12 });
        assert.deepEqual(data.created, { TED: 2, E_ZAMOWIENIA: 12, BAZA_KONKURENCYJNOSCI: 0 });
        assert.equal(data.existing, 0);
        assert.deepEqual(data.errors, []);

        const deliveryPages = stub.ezRequests.filter((r) => r.orderType === 'Delivery').map((r) => r.PageNumber);
        assert.deepEqual(deliveryPages, ['1', '2']);
        // Zakres jako same daty: dzień poprzedni i wybrany (filtr ISO z "Z" w API eZamówień jest zawodny)
        assert.equal(stub.ezRequests[0].publicationDateFrom, yesterday);
        assert.equal(stub.ezRequests[0].publicationDateTo, today);

        assert.equal((await db.collection('tenders').get()).size, 14);
    });

    it('zapisuje poprawny dokument z datą wygaśnięcia po miesiącu', async () => {
        const doc = await db.doc('tenders/E_ZAMOWIENIA_2026_BZP_D00_01').get();
        assert.ok(doc.exists);
        const record = doc.data();
        assert.equal(record.source, 'E_ZAMOWIENIA');
        assert.equal(record.publicationDate, today);
        assert.match(record.publicationTime, /^\d{2}:\d{2}$/);
        assert.equal(record.orderType, 'Delivery');
        assert.deepEqual(record.cpvCodes, ['30213300-8']);

        const days = (record.expireAt.toMillis() - Date.now()) / DAY_MS;
        assert.ok(days > 29.9 && days <= 30, `expireAt za ${days} dni`);

        assert.equal((await db.doc('meta/refreshLock').get()).exists, false, 'blokada powinna zostać zwolniona');
    });

    it('przy ponownym odświeżeniu dopisuje tylko nowe i nie rusza istniejących (status zostaje)', async () => {
        await db.doc('tenders/TED_100001-2026').update({ status: 'toEnter' });
        stub.tedNotices.push(tedNotice('100004-2026'));

        const { data } = await refreshTenders({});

        assert.deepEqual(data.created, { TED: 1, E_ZAMOWIENIA: 0, BAZA_KONKURENCYJNOSCI: 0 });
        assert.equal(data.existing, 14);
        assert.equal((await db.doc('tenders/TED_100001-2026').get()).data().status, 'toEnter');
        assert.equal((await db.collection('tenders').get()).size, 15);
    });

    it('przy awarii jednego źródła zapisuje drugie i zgłasza błąd', async () => {
        stub.tedFails = true;
        stub.ezByType.Works.push(ezNotice('W00', `${today}T08:00:00Z`));

        const { data } = await refreshTenders({});

        assert.deepEqual(data.errors, ['TED']);
        assert.deepEqual(data.created, { TED: 0, E_ZAMOWIENIA: 1, BAZA_KONKURENCYJNOSCI: 0 });
        stub.tedFails = false;
    });

    it('zgłasza awarię, gdy żadne źródło nie odpowiada, i zwalnia blokadę', async () => {
        stub.tedFails = true;
        stub.ezFails = true;
        await expectCode(refreshTenders({}), 'unavailable');
        stub.tedFails = false;
        stub.ezFails = false;

        const { data } = await refreshTenders({});
        assert.deepEqual(data.errors, []);
    });

    it('ponawia zapytanie, gdy TED ogranicza tempo (429), i kończy sukcesem', async () => {
        stub.tedNotices.push(tedNotice('100005-2026'));
        stub.tedRateLimited = 2;
        stub.tedRequests = 0;

        const { data } = await refreshTenders({});

        assert.deepEqual(data.errors, []);
        assert.equal(data.created.TED, 1);
        assert.equal(stub.tedRequests, 3, 'dwa odrzucone zapytania i jedno udane');
    });

    it('zgłasza błąd źródła, gdy 429 trwa mimo ponawiania', async () => {
        stub.tedRateLimited = 100;
        stub.tedRequests = 0;

        const { data } = await refreshTenders({});

        assert.deepEqual(data.errors, ['TED']);
        assert.equal(stub.tedRequests, 4, 'pierwsze zapytanie i trzy ponowienia');
        stub.tedRateLimited = 0;
    });

    it('nie pozwala na równoległe odświeżanie', async () => {
        await db.doc('meta/refreshLock').set({
            lockedUntil: admin.firestore.Timestamp.fromMillis(Date.now() + 60000),
            lockedBy: 'ktoś-inny'
        });
        await expectCode(refreshTenders({}), 'resource-exhausted');
        await db.doc('meta/refreshLock').delete();

        const { data } = await refreshTenders({});
        assert.deepEqual(data.errors, []);
    });

    it('pozwala odświeżyć wskazany dzień z przeszłości i oznacza go jako kompletny w dzienniku', async () => {
        const { data } = await refreshTenders({ date: yesterday });
        assert.equal(data.date, yesterday);
        assert.deepEqual(data.fetched.E_ZAMOWIENIA, 1);

        const log = (await db.doc(`refreshLog/${yesterday}`).get()).data();
        assert.equal(log.day, yesterday);
        assert.equal(log.complete, true);
        const days = (log.expireAt.toMillis() - Date.now()) / DAY_MS;
        assert.ok(days > 29.9 && days <= 30, `expireAt dziennika za ${days} dni`);
    });

    it('dzisiejszy dzień jest w dzienniku jako niekompletny', async () => {
        const log = (await db.doc(`refreshLog/${today}`).get()).data();
        assert.equal(log.day, today);
        assert.equal(log.complete, false);
        assert.ok(log.refreshedBy);
    });

    it('nie zapisuje dziennika, gdy odświeżenie się nie powiodło', async () => {
        const failedDay = addDays(today, -2);
        stub.tedFails = true;
        stub.ezFails = true;
        await expectCode(refreshTenders({ date: failedDay }), 'unavailable');
        stub.tedFails = false;
        stub.ezFails = false;

        assert.equal((await db.doc(`refreshLog/${failedDay}`).get()).exists, false);
    });

    it('nie zapisuje dziennika dnia, w którym jedno ze źródeł zawiodło', async () => {
        // Wczoraj ma dane w stubie eZamówień, więc awaria samego TED to częściowy sukces, a nie "unavailable"
        await db.doc(`refreshLog/${yesterday}`).delete();
        stub.tedFails = true;
        const { data } = await refreshTenders({ date: yesterday });
        stub.tedFails = false;

        assert.deepEqual(data.errors, ['TED']);
        assert.equal((await db.doc(`refreshLog/${yesterday}`).get()).exists, false);
    });
});

describe('Baza Konkurencyjności', () => {
    const BAZA = 'BAZA_KONKURENCYJNOSCI';
    const makeBazaStale = () =>
        db.doc('meta/bazaRefresh').set({ refreshedAt: admin.firestore.Timestamp.fromMillis(Date.now() - 10 * 60 * 1000) });

    it('odrzuca nieprawidłową listę źródeł', async () => {
        await expectCode(refreshTenders({ sources: [] }), 'invalid-argument');
        await expectCode(refreshTenders({ sources: ['NIEZNANE'] }), 'invalid-argument');
        await expectCode(refreshTenders({ sources: 'TED' }), 'invalid-argument');
    });

    it('domyślne odświeżenie nie odpytuje Bazy', () => {
        assert.equal(stub.bazaSearches.length, 0);
        assert.equal(stub.bazaDetailRequests.length, 0);
    });

    it('pobiera nowe ogłoszenia z Bazy na żądanie, bez danych osobowych i bez dziennika dnia', async () => {
        await db.doc(`refreshLog/${today}`).delete();

        const { data } = await refreshTenders({ sources: [BAZA] });

        assert.deepEqual(data.fetched, { [BAZA]: 2 });
        assert.equal(data.created[BAZA], 2);
        assert.deepEqual(data.errors, []);
        assert.deepEqual(data.skipped, []);

        const search = stub.bazaSearches[0];
        assert.equal(search.get('status[0]'), 'PUBLISHED');
        assert.equal(search.get('publicationDateRange[from]'), addDays(today, -2));
        assert.equal(search.get('publicationDateRange[to]'), today);
        assert.equal([...search.keys()].filter((key) => key.startsWith('cpvItem[')).length, 119);

        const doc = await db.doc('tenders/BAZA_KONKURENCYJNOSCI_900001').get();
        assert.ok(doc.exists);
        const record = doc.data();
        assert.equal(record.source, BAZA);
        assert.equal(record.buyerNip, '1234567890');
        assert.equal(record.orderType, 'Delivery');
        assert.equal(record.deadlineDate, addDays(today, 7));
        assert.equal(record.publicationDate, today);
        // Zmienione ogłoszenie ma datę pierwszej publikacji, nie dzisiejszą datę wersji
        assert.equal((await db.doc('tenders/BAZA_KONKURENCYJNOSCI_900002').get()).data().publicationDate, addDays(today, -5));
        const serialized = JSON.stringify(record);
        for (const secret of ['Tajny', '600100200', 'tajny@example.com', 'Ukryta']) {
            assert.equal(serialized.includes(secret), false, secret);
        }

        assert.equal((await db.doc('meta/bazaRefresh').get()).exists, true);
        assert.equal((await db.doc(`refreshLog/${today}`).get()).exists, false, 'dziennik dotyczy TED i eZamówień');
    });

    it('w ciągu 5 minut pomija Bazę, a TED i eZamówienia odświeża normalnie', async () => {
        const searches = stub.bazaSearches.length;

        const { data } = await refreshTenders({ sources: ['TED', 'E_ZAMOWIENIA', BAZA] });

        assert.deepEqual(data.skipped, [BAZA]);
        assert.deepEqual(Object.keys(data.fetched).sort(), ['E_ZAMOWIENIA', 'TED']);
        assert.equal(stub.bazaSearches.length, searches);
    });

    it('po upływie 5 minut pobiera szczegóły tylko nowych ogłoszeń', async () => {
        await makeBazaStale();
        stub.bazaIds.push(900003);
        stub.bazaDetailRequests.length = 0;

        const { data } = await refreshTenders({ sources: [BAZA] });

        assert.deepEqual(stub.bazaDetailRequests, [900003]);
        assert.equal(data.created[BAZA], 1);
    });

    it('pomija ogłoszenie wycofane między wyszukiwaniem a pobraniem szczegółów (404)', async () => {
        await makeBazaStale();
        stub.bazaIds.push(900004);
        stub.bazaGoneIds.push(900004);

        const { data } = await refreshTenders({ sources: [BAZA] });

        assert.deepEqual(data.errors, []);
        assert.equal(data.created[BAZA], 0);
        stub.bazaIds.pop();
        stub.bazaGoneIds.length = 0;
    });

    it('awaria Bazy nie psuje TED i eZamówień, ale jest zgłoszona i nie przesuwa znacznika', async () => {
        await makeBazaStale();
        const marker = (await db.doc('meta/bazaRefresh').get()).data().refreshedAt.toMillis();
        stub.bazaFails = true;

        const { data } = await refreshTenders({ sources: ['TED', 'E_ZAMOWIENIA', BAZA] });
        stub.bazaFails = false;

        assert.deepEqual(data.errors, [BAZA]);
        assert.equal((await db.doc(`refreshLog/${today}`).get()).exists, true, 'dzień TED i eZamówień jest kompletny mimo błędu Bazy');
        assert.equal((await db.doc('meta/bazaRefresh').get()).data().refreshedAt.toMillis(), marker);
    });

    it('sam błąd Bazy to awaria "unavailable", a blokada zostaje zwolniona', async () => {
        await makeBazaStale();
        stub.bazaFails = true;
        await expectCode(refreshTenders({ sources: [BAZA] }), 'unavailable');
        stub.bazaFails = false;

        assert.equal((await db.doc('meta/refreshLock').get()).exists, false);
    });
});
