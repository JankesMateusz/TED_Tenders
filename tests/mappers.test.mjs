// Testy jednostkowe dat i mapperów źródeł. Wymagają zbudowanych funkcji: npm run test:unit
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { addDays, dayFromTedDate, isValidDay, toWarsaw } from '../functions/lib/tenders/dates.js';
import { mapBazaNotice } from '../functions/lib/tenders/bazakonkurencyjnosci.js';
import { extractCpvCodes, mapEzamowieniaNotice } from '../functions/lib/tenders/ezamowienia.js';
import { IT_CPV_CODES_8 } from '../functions/lib/tenders/itCpvCodes.js';
import { buildInitialSnapshot, buildSnapshot, statusChanged, MAX_STATUS_HISTORY } from '../functions/lib/labels/labelSnapshot.js';
import { tenderId } from '../functions/lib/tenders/model.js';
import { classifySector } from '../functions/lib/tenders/sector.js';
import { mapTedNotice } from '../functions/lib/tenders/ted.js';

describe('dates', () => {
    it('zamienia czas UTC na polski (czas zimowy)', () => {
        assert.deepEqual(toWarsaw('2026-10-29T19:22:09.3570279Z'), { date: '2026-10-29', time: '20:22' });
    });

    it('przesuwa dzień po polskiej północy (czas letni i zimowy)', () => {
        assert.deepEqual(toWarsaw('2026-07-01T22:30:00Z'), { date: '2026-07-02', time: '00:30' });
        assert.deepEqual(toWarsaw('2026-10-28T23:30:00Z'), { date: '2026-10-29', time: '00:30' });
    });

    it('zwraca null dla pustych i błędnych dat', () => {
        assert.equal(toWarsaw(null), null);
        assert.equal(toWarsaw(''), null);
        assert.equal(toWarsaw('nie-data'), null);
    });

    it('przesuwa dni kalendarzowo', () => {
        assert.equal(addDays('2026-03-01', -1), '2026-02-28');
        assert.equal(addDays('2026-12-31', 1), '2027-01-01');
    });

    it('waliduje format dnia', () => {
        assert.equal(isValidDay('2026-10-29'), true);
        assert.equal(isValidDay('2026-02-30'), false);
        assert.equal(isValidDay('29-10-2026'), false);
        assert.equal(isValidDay(20261029), false);
    });

    it('wyciąga dzień z wartości TED', () => {
        assert.equal(dayFromTedDate('2026-10-28+01:00'), '2026-10-28');
        assert.equal(dayFromTedDate(['2026-11-20Z', '2026-11-21Z']), '2026-11-20');
        assert.equal(dayFromTedDate(undefined), null);
    });
});

describe('tenderId', () => {
    it('usuwa znaki niedozwolone w identyfikatorze dokumentu', () => {
        const id = tenderId({ source: 'E_ZAMOWIENIA', publicationNumber: '2026/BZP 00510442/01' });
        assert.equal(id, 'E_ZAMOWIENIA_2026_BZP_00510442_01');
    });

    it('zachowuje numery TED', () => {
        assert.equal(tenderId({ source: 'TED', publicationNumber: '745242-2026' }), 'TED_745242-2026');
    });
});

describe('mapTedNotice', () => {
    const raw = {
        'publication-number': '745242-2026',
        'publication-date': '2026-10-28+01:00',
        'deadline-receipt-tender-date-lot': ['2026-11-20+01:00'],
        'classification-cpv': ['30213300', '48000000'],
        'notice-title': { pol: 'Polska – Dostawa komputerów' },
        'organisation-name-buyer': { pol: ['Gmina Przykład'] },
        'buyer-city': { mul: ['Przykład'] },
        'authority-main-activity': ['gen-pub'],
        'contract-nature': ['supplies', 'supplies'],
    };

    it('mapuje pola ogłoszenia', () => {
        assert.deepEqual(mapTedNotice(raw, '2000-01-01'), {
            source: 'TED',
            publicationNumber: '745242-2026',
            title: 'Polska – Dostawa komputerów',
            buyerName: 'Gmina Przykład',
            buyerCity: 'Przykład',
            country: 'Polska',
            publicationDate: '2026-10-28',
            publicationTime: null,
            deadlineDate: '2026-11-20',
            cpvCodes: ['30213300', '48000000'],
            link: 'https://ted.europa.eu/udl?uri=TED:NOTICE:745242-2026:TEXT:PL:HTML',
            documentsUrl: null,
            referenceNumber: null,
            orderType: 'Delivery',
            buyerMainActivity: 'gen-pub',
        });
    });

    it('usuwa z tytułu prefiks z krajem i kategorią, ale zachowuje kraj w osobnym polu', () => {
        const mapped = (title) => mapTedNotice({ ...raw, 'notice-title': { pol: title } }, '2026-10-28');
        const full = mapped('Polska – Serwery – Dostawa serwerów dla szkół');
        assert.equal(full.title, 'Dostawa serwerów dla szkół');
        assert.equal(full.country, 'Polska');
        // myślnik w samym tytule nie jest ucinany
        assert.equal(mapped('Polska – Serwery – Dostawa – część 1').title, 'Dostawa – część 1');
        // dwa człony: nie wiadomo, co jest prefiksem, więc bez zmian
        assert.equal(mapped('Polska – Dostawa komputerów').title, 'Polska – Dostawa komputerów');
        assert.equal(mapped('Dostawa komputerów').title, 'Dostawa komputerów');
        // zwykły łącznik w nazwie kategorii nie dzieli tytułu
        assert.equal(mapped('Polska – Sprzęt IT i oprogramowanie – Tytuł').title, 'Tytuł');
        assert.equal(mapTedNotice({ ...raw, 'notice-title': undefined }, '2026-10-28').title, 'Brak tytułu');
    });

    it('ustala rodzaj zamówienia z lotów, a dostawa ma pierwszeństwo', () => {
        const orderType = (nature) => mapTedNotice({ ...raw, 'contract-nature': nature }, '2026-10-28').orderType;
        assert.equal(orderType(['services', 'services']), 'Services');
        assert.equal(orderType(['works']), 'Works');
        assert.equal(orderType(['works', 'services']), 'Services');
        assert.equal(orderType(['works', 'services', 'supplies']), 'Delivery');
        assert.equal(orderType([]), null);
        assert.equal(orderType(['nieznany']), null);
        assert.equal(orderType(undefined), null);
    });

    it('bierze pierwszy poprawny adres dokumentacji i odrzuca niebezpieczne schematy', () => {
        const url = (field) => mapTedNotice({ ...raw, 'document-url-lot': field }, '2026-10-28').documentsUrl;
        assert.equal(url(['https://platformazakupowa.pl/pn/x', 'https://platformazakupowa.pl/pn/x']), 'https://platformazakupowa.pl/pn/x');
        assert.equal(url(['', 'javascript:alert(1)', ' http://e-propublico.pl ']), 'http://e-propublico.pl');
        assert.equal(url(['javascript:alert(1)']), null);
        assert.equal(url([]), null);
        assert.equal(url(undefined), null);
    });

    it('pomija ogłoszenia zmieniające i bez numeru', () => {
        assert.equal(mapTedNotice({ ...raw, 'change-notice-version-identifier': '2' }, '2026-10-28'), null);
        assert.equal(mapTedNotice({ ...raw, 'publication-number': undefined }, '2026-10-28'), null);
    });

    it('wstawia wartości domyślne dla brakujących pól', () => {
        const record = mapTedNotice({ 'publication-number': '1-2026' }, '2026-10-28');
        assert.equal(record.title, 'Brak tytułu');
        assert.equal(record.buyerName, 'Brak danych');
        assert.equal(record.buyerCity, 'Brak miasta');
        assert.equal(record.country, 'Nieznany kraj');
        assert.equal(record.publicationDate, '2026-10-28');
        assert.equal(record.deadlineDate, null);
        assert.deepEqual(record.cpvCodes, []);
        assert.equal(record.orderType, null);
        assert.equal(record.documentsUrl, null);
    });
});

describe('eZamówienia', () => {
    const raw = {
        noticeNumber: '2026/BZP 00510442/01',
        publicationDate: '2026-10-29T19:22:09.3570279Z',
        submittingOffersDate: '2026-11-06T11:00:00Z',
        cpvCode: '34144210-3 (Wozy strażackie)',
        orderObject: 'Zakup samochodu',
        organizationName: 'Gmina Rędziny',
        organizationCity: 'Rędziny',
        objectId: '08df35f1-ed3f-ef38-cfcf-e60001f8c1d8',
    };

    it('mapuje pola ogłoszenia z datami w czasie polskim', () => {
        assert.deepEqual(mapEzamowieniaNotice(raw, 'Delivery'), {
            source: 'E_ZAMOWIENIA',
            publicationNumber: '2026/BZP 00510442/01',
            title: 'Zakup samochodu',
            buyerName: 'Gmina Rędziny',
            buyerCity: 'Rędziny',
            country: 'Polska',
            publicationDate: '2026-10-29',
            publicationTime: '20:22',
            deadlineDate: '2026-11-06',
            cpvCodes: ['34144210-3'],
            link: 'https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08df35f1-ed3f-ef38-cfcf-e60001f8c1d8',
            documentsUrl: null,
            orderType: 'Delivery',
            buyerMainActivity: null,
        });
    });

    it('pomija ogłoszenia bez numeru lub z błędną datą', () => {
        assert.equal(mapEzamowieniaNotice({ ...raw, noticeNumber: '' }, 'Works'), null);
        assert.equal(mapEzamowieniaNotice({ ...raw, publicationDate: 'x' }, 'Works'), null);
    });

    it('ustawia brak terminu, gdy ogłoszenie go nie ma', () => {
        assert.equal(mapEzamowieniaNotice({ ...raw, submittingOffersDate: null }, 'Works').deadlineDate, null);
    });

    it('wyciąga kody CPV z tekstu', () => {
        assert.deepEqual(extractCpvCodes('30213300-8 (Komputer),48000000-8 (Pakiety)'), ['30213300-8', '48000000-8']);
        assert.deepEqual(extractCpvCodes('30213300 (Komputer)'), ['30213300']);
        assert.deepEqual(extractCpvCodes(''), []);
        assert.deepEqual(extractCpvCodes(null), []);
    });
});

describe('mapBazaNotice (Baza Konkurencyjności)', () => {
    const readFixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/baza/${name}`, import.meta.url), 'utf8'));
    const details = readFixture('details.json');

    it('mapuje szczegóły ogłoszenia na przetarg, z numerem z wyszukiwania', () => {
        const record = mapBazaNotice(details[1], 296954);
        assert.equal(record.source, 'BAZA_KONKURENCYJNOSCI');
        assert.equal(record.publicationNumber, '296954');
        assert.equal(record.buyerName, 'Gmina Zawonia');
        assert.equal(record.buyerCity, 'Zawonia');
        assert.equal(record.country, 'Polska');
        assert.equal(record.publicationDate, '2026-11-03');
        assert.equal(record.deadlineDate, '2026-11-18');
        assert.equal(record.publicationTime, null);
        assert.equal(record.buyerNip, '9151603787');
        assert.equal(record.link, 'https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/296954');
        assert.equal(record.documentsUrl, null, 'dokumentacja jest na stronie ogłoszenia, więc bez osobnego linku');
        assert.ok(record.cpvCodes.length > 0);
        assert.ok(record.cpvCodes.every((code) => /^\d{8}-\d$/.test(code)), 'kody CPV z cyfrą kontrolną');
    });

    it('bierze datę pierwszej publikacji, a nie datę bieżącej wersji ogłoszenia', () => {
        // Ogłoszenie 296206 opublikowano 2026-10-27, a 2026-11-04 zamawiający opublikował jego nową wersję
        assert.equal(details[2].publication_date, '2026-11-04');
        assert.equal(mapBazaNotice(details[2], 296206).publicationDate, '2026-10-27');
    });

    it('bez daty pierwszej publikacji używa daty bieżącej wersji', () => {
        const { advertisement, ...withoutOriginal } = details[2];
        assert.equal(mapBazaNotice(withoutOriginal, 296206).publicationDate, '2026-11-04');
    });

    it('wybiera rodzaj zamówienia z pierwszeństwem: dostawa, usługa, roboty', () => {
        const withCategories = (...ids) => ({
            ...details[0],
            orders: [{ order_items: ids.map((id) => ({ category: { id }, cpv_items: [] })) }],
        });
        assert.equal(mapBazaNotice(withCategories(2, 1, 3), 1).orderType, 'Delivery');
        assert.equal(mapBazaNotice(withCategories(2, 1), 1).orderType, 'Services');
        assert.equal(mapBazaNotice(withCategories(2), 1).orderType, 'Works');
        assert.equal(mapBazaNotice(withCategories(9), 1).orderType, null);
    });

    it('odrzuca ogłoszenia bez numeru lub daty publikacji', () => {
        assert.equal(mapBazaNotice(details[0], ''), null);
        assert.equal(mapBazaNotice({ ...details[0], publication_date: undefined, advertisement: { id: 1 } }, 1), null);
        assert.equal(mapBazaNotice(undefined, 1), null);
    });

    it('nie przepisuje danych osobowych z odpowiedzi', () => {
        const withPersonalData = {
            ...details[0],
            contact_persons: [{ first_name: 'Jan', last_name: 'Kowalski', phone: '600700800', email: 'jan@example.com' }],
            created_by: { first_name: 'Anna', last_name: 'Nowak' },
            modified_by: { first_name: 'Anna', last_name: 'Nowak' },
        };
        const serialized = JSON.stringify(mapBazaNotice(withPersonalData, 1));
        for (const secret of ['Kowalski', '600700800', 'jan@example.com', 'Nowak']) {
            assert.equal(serialized.includes(secret), false, secret);
        }
    });

    it('nie ustawia NIP-u, gdy identyfikator nie jest NIP-em', () => {
        const other = { ...details[0], advertiser_address_details: { ...details[0].advertiser_address_details, identification_number_type: 'regon' } };
        assert.equal(mapBazaNotice(other, 1).buyerNip, null);
    });

    it('lista kodów IT dla wyszukiwarki zgadza się z IT_CPV_CODES z aplikacji', () => {
        const frontendSource = readFileSync(new URL('../src/utils/cpvCodes.ts', import.meta.url), 'utf8');
        const frontendCodes = [...frontendSource.matchAll(/^\s+"(\d{8})":/gm)].map((match) => match[1]);
        assert.equal(frontendCodes.length, 119);
        assert.deepEqual([...IT_CPV_CODES_8].sort(), frontendCodes.sort());
    });
});

const readFixtureDetails = () => JSON.parse(readFileSync(new URL('./fixtures/baza/details.json', import.meta.url), 'utf8'));

describe('classifySector', () => {
    const sectorOf = (name) => classifySector(name);

    it('rozpoznaje spółki komunalne mimo formy prawnej firmy (nie są ukrywane)', () => {
        // Znany błąd prostej heurystyki z research v2: spółki sp. z o.o. bez słowa "gmina" wpadały do prywatnych
        assert.equal(sectorOf('Przedsiębiorstwo Wodno-Kanalizacyjne Wołów Spółka z o. o.'), 'municipal');
        assert.equal(sectorOf('Katowickie Wodociągi S.A.'), 'municipal');
        assert.equal(sectorOf('Zakład Gospodarki Komunalnej w Wieliczce sp. z o.o.'), 'municipal');
        assert.equal(sectorOf('Bychawskie Przedsiębiorstwo Komunalne Sp. z o.o.'), 'municipal');
        assert.equal(sectorOf('Zakład Usług Gminnych Gmina Ełk Sp. z o. o.'), 'municipal');
    });

    it('rozpoznaje podmioty publiczne', () => {
        for (const name of ['Gmina Zawonia', 'Urząd Miejski w Gnieźnie', 'Powiat Ostrowski', 'Nadleśnictwo Zwierzyniec',
            'Kancelaria Prezesa Rady Ministra', 'SP ZOZ Szpital Kolejowy w Wilkowicach-Bystrej', 'Szkoła Podstawowa w Żmudzi']) {
            assert.equal(sectorOf(name), 'public', name);
        }
    });

    it('rozpoznaje organizacje pozarządowe', () => {
        for (const name of ['Fundacja "Merkury"', 'FUNDACJA NIEPODLEGŁOŚCI', 'Stowarzyszenie na Rzecz Edukacji "Pomost"',
            'Świętokrzyski Związek Pracodawców Prywatnych Lewiatan']) {
            assert.equal(sectorOf(name), 'ngo', name);
        }
    });

    it('rozpoznaje firmy po formie prawnej, także przy skrótach i literówkach', () => {
        for (const name of ['Centrum Medyczne Tommed Sp. z o.o.', 'CENTERMED Sp. zo.o.', 'Beskidzkie Centrum Medyczne Sp. z o',
            'Etmus Sp z o.o.', 'BITSTREAM SPÓŁKA AKCYJNA', 'Next Mobile Prosta Spółka Akcyjna', 'Abego S.C. Radosław Czeczotka, Rafał Socha',
            'CLIMATIC Sp. z o.o. Sp.k.', '"UNI-MED" spółka z ograniczoną odpowiedzialnością']) {
            assert.equal(sectorOf(name), 'private', name);
        }
    });

    it('niejednoznaczne zostawia jako nieznane, czyli widoczne', () => {
        for (const name of ['Krajowa Izba Fizjoterapeutów', 'Uniwersytet VIZJA', 'Politechnika Śląska', 'Klaster Innowacji Społecznych',
            'Drewnolit - Cezary Rułka', 'Mały Inżynier Ewa Bednarek', 'Zespół Opolskich Parków Krajobrazowych']) {
            assert.equal(sectorOf(name), 'unknown', name);
        }
        assert.equal(sectorOf(''), 'unknown');
        assert.equal(sectorOf(null), 'unknown');
        assert.equal(sectorOf(undefined), 'unknown');
    });

    it('znacznik publiczny lub komunalny wygrywa z formą prawną i z organizacją pozarządową', () => {
        assert.equal(sectorOf('Fundacja Szpitala Powiatowego'), 'public');
        assert.equal(sectorOf('Gminne Przedsiębiorstwo Gospodarki Komunalnej spółka z ograniczoną odpowiedzialnością'), 'municipal');
    });

    it('mapper Bazy zapisuje sektor automatyczny', () => {
        const record = mapBazaNotice(readFixtureDetails()[1], 296954);
        assert.equal(record.buyerSectorAuto, 'public');
    });
});

describe('labelSnapshot', () => {
    const at = (ms) => ({ toMillis: () => ms });
    const tender = (extra = {}) => ({
        source: 'E_ZAMOWIENIA', publicationNumber: '2026/BZP 1/01', publicationDate: '2026-11-06', title: 'Laptopy',
        cpvCodes: ['30213300-8'], orderType: 'Delivery', buyerName: 'Gmina', buyerCity: 'X', labels: ['simple'], ...extra
    });
    const withStatus = (status, ms) => tender({ status, statusAt: at(ms), statusBy: 'u1', statusByEmail: 'a@b.pl' });

    it('wykrywa tylko zmiany statusu, nie etykiet', () => {
        assert.equal(statusChanged(tender(), tender({ labels: ['hard'] })), false);
        assert.equal(statusChanged(tender(), withStatus('toEnter', 1)), true);
        assert.equal(statusChanged(withStatus('toEnter', 1), tender()), true);
        assert.equal(statusChanged(withStatus('toEnter', 1), withStatus('entered', 2)), true);
        assert.equal(statusChanged(withStatus('toEnter', 1), undefined), false);
    });

    it('tworzy migawkę z metadanymi i pierwszym wpisem historii', () => {
        const snap = buildSnapshot('E_x', withStatus('toEnter', 1), undefined);
        assert.equal(snap.docId, 'E_x');
        assert.equal(snap.title, 'Laptopy');
        assert.deepEqual(snap.cpvCodes, ['30213300-8']);
        assert.equal(snap.status, 'toEnter');
        assert.equal(snap.statusHistory.length, 1);
        assert.equal(snap.buyerCity, undefined);
        assert.equal(snap.labels, undefined);
    });

    it('dopisuje zmiany do historii, a zdjęcie statusu nie kasuje historii', () => {
        const first = buildSnapshot('E_x', withStatus('toEnter', 1), undefined);
        const second = buildSnapshot('E_x', withStatus('notToEnter', 2), first);
        const cleared = buildSnapshot('E_x', tender(), second);
        assert.deepEqual(cleared.statusHistory.map((c) => c.status), ['toEnter', 'notToEnter', null]);
        assert.equal(cleared.status, null);
    });

    it('ponowne dostarczenie tego samego zdarzenia niczego nie dopisuje', () => {
        const first = buildSnapshot('E_x', withStatus('toEnter', 1), undefined);
        assert.equal(buildSnapshot('E_x', withStatus('toEnter', 1), first), null);
    });

    it('ogranicza historię do ostatnich zmian', () => {
        let snap;
        for (let i = 1; i <= MAX_STATUS_HISTORY + 5; i++) snap = buildSnapshot('E_x', withStatus(i % 2 ? 'toEnter' : 'entered', i), snap);
        assert.equal(snap.statusHistory.length, MAX_STATUS_HISTORY);
    });

    it('migawka startowa tylko dla przetargów ze statusem', () => {
        assert.equal(buildInitialSnapshot('E_x', tender()), null);
        assert.equal(buildInitialSnapshot('E_x', withStatus('entered', 1)).status, 'entered');
    });
});
