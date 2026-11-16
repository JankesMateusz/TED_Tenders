#!/usr/bin/env node
// Import raportu MDP (xlsx) do schematu z db/migrations.
//
// Użycie:
//   node db/import/importMdpReport.mjs <raport.xlsx>                 suchy przebieg: tylko raport, nic nie jest zapisywane
//   node db/import/importMdpReport.mjs <raport.xlsx> --sql <plik>    dodatkowo zapisuje skrypt SQL do załadowania
//
// Skrypt SQL ładuje dane w jednej transakcji do pustej bazy (przerywa się, jeśli są już zamówienia) przez tabele
// tymczasowe i INSERT ... SELECT. Uruchamia się go przez psql, np.:
//   docker exec -i tenders-pg psql -U postgres -v ON_ERROR_STOP=1 -q < plik.sql
//
// Plik wynikowy zawiera dane osobowe z raportu, więc domyślne miejsce to docs/App/ (ignorowane przez git).
import { writeFileSync } from 'node:fs';
import { excelDateToIso, readFirstSheet } from './xlsx.mjs';
import {
    buyerDedupeKey,
    cleanDisplay,
    companyKey,
    contactIdentity,
    normalizeText,
    splitZip,
} from './normalize.mjs';

const HEADER_ROW = 2;
const FIRST_DATA_ROW = 3;
const IMPORT_ACTOR = 'import:mdp-report';
const INSERT_CHUNK = 300;

// Zakresy dat. Poza nimi wartość jest odrzucana (NULL) i liczona w raporcie. Zakres daty listu zgodny z CHECK w schemacie.
const DATE_RANGE = { min: '2000-01-01', max: '2100-12-31' };
const AWARD_DATE_RANGE = { min: '2015-01-01', max: '2100-12-31' };

// Kolumny raportu, które celowo nie trafiają do bazy (puste w 100% albo wyliczane).
const DROPPED_COLUMNS = ['Benchmark Bid', 'Comments Sales Team', 'Data wysłania pisma'];

// Pola zamówienia, które muszą być takie same we wszystkich pozycjach tego zamówienia.
const ORDER_LEVEL_COLUMNS = [
    'End-User bid numer', 'Date of MDP registration', 'SIWZ active link', 'Province', 'Town', 'Type of Account',
    'Official Name', 'Zip Code', 'Address Street & No.', 'PinC', 'Email', 'Publication Date', 'Bid Date',
    'Financing EU', 'Budget',
];

class Counter extends Map {
    add(key, n = 1) {
        this.set(key, (this.get(key) ?? 0) + n);
    }
    mostFrequent() {
        let best = null;
        let bestCount = -1;
        for (const [key, count] of this) {
            if (count > bestCount) {
                best = key;
                bestCount = count;
            }
        }
        return best;
    }
}

const issues = new Counter();
const issueSamples = new Map();
function noteIssue(label, sample) {
    issues.add(label);
    const samples = issueSamples.get(label) ?? [];
    if (samples.length < 3 && sample !== undefined) samples.push(sample);
    issueSamples.set(label, samples);
}

// --- Wczytanie raportu -------------------------------------------------------------------------------

function loadRecords(path) {
    const rows = readFirstSheet(path);
    const header = rows.find((r) => r.rowNumber === HEADER_ROW);
    if (!header || !Object.values(header.cells).includes('MDP ID')) {
        throw new Error(`Wiersz ${HEADER_ROW} nie wygląda na nagłówek raportu MDP (brak kolumny "MDP ID").`);
    }
    const names = header.cells;
    return rows
        .filter((r) => r.rowNumber >= FIRST_DATA_ROW)
        .map((r) => {
            const record = { _row: r.rowNumber };
            for (const [index, name] of Object.entries(names)) {
                const value = r.cells[index];
                if (value !== undefined && String(value).trim() !== '') record[name] = String(value).trim();
            }
            return record;
        })
        .filter((record) => Object.keys(record).length > 1);
}

// --- Parsowanie pól -----------------------------------------------------------------------------------

function parseDate(record, column, range, label = column) {
    const raw = record[column];
    if (raw === undefined) return null;
    const iso = excelDateToIso(raw);
    if (iso === null) {
        noteIssue(`${label}: nieparsowalna data`, raw);
        return null;
    }
    if (iso < range.min || iso > range.max) {
        noteIssue(`${label}: poza zakresem ${range.min}..${range.max}`, iso);
        return null;
    }
    return iso;
}

function parseInteger(record, column) {
    const raw = record[column];
    if (raw === undefined) return null;
    if (!/^\d+(\.0+)?$/.test(raw)) {
        noteIssue(`${column}: wartość nieliczbowa`, raw);
        return null;
    }
    return Math.trunc(Number(raw));
}

function parseMoney(record, column) {
    const raw = record[column];
    if (raw === undefined) return null;
    if (!/^\d+(\.\d+)?$/.test(raw)) {
        noteIssue(`${column}: wartość nieliczbowa`, raw);
        return null;
    }
    return Number(raw).toFixed(2);
}

function cleanBudget(raw) {
    const label = cleanDisplay(raw);
    if (label === null) return null;
    const fixed = label.replace(/(\sPLN)+$/i, ' PLN'); // "powyżej 930 960 PLN PLN" → "powyżej 930 960 PLN"
    if (fixed !== label) noteIssue('Budget: usunięto powtórzone "PLN"');
    return fixed;
}

function parseId(record) {
    const id = record['ID'];
    const mdp = record['MDP ID'];
    if (!id || !/^\d{9}$/.test(id) || !mdp || !/^\d+$/.test(mdp) || id.slice(2, 6) !== mdp.padStart(4, '0')) {
        throw new Error(`Wiersz ${record._row}: ID "${id}" nie pasuje do wzorca rr+MDP(4)+pozycja(3) albo do MDP ID "${mdp}".`);
    }
    return { year: 2000 + Number(id.slice(0, 2)), mdpNumber: Number(mdp), positionNumber: Number(id.slice(6)) };
}

// --- Budowa modelu ----------------------------------------------------------------------------------------

function buildModel(records) {
    const orders = new Map();
    const positions = [];

    const buyers = new Map(); // klucz → liczniki pól
    const contacts = new Map(); // `${buyerKey}\u0000${identity}` → liczniki pól
    const winners = new Map();
    const vendors = new Map();
    const dictionaries = {
        lob: new Set(), account: new Set(), budget: new Set(), form: new Set(), os: new Set(), office: new Set(),
    };
    const orderInconsistencies = new Counter();
    const rawBuyerNames = new Set();

    function countField(map, key, field, value) {
        if (value === null || value === undefined) return;
        let entry = map.get(key);
        if (!entry) {
            entry = {};
            map.set(key, entry);
        }
        (entry[field] ??= new Counter()).add(value);
    }

    for (const record of records) {
        const { year, mdpNumber, positionNumber } = parseId(record);
        const orderKey = `${year}-${mdpNumber}`;

        const buyerName = cleanDisplay(record['Official Name']);
        if (buyerName === null) throw new Error(`Wiersz ${record._row}: brak nazwy zamawiającego.`);
        rawBuyerNames.add(buyerName);
        const { zip, rest } = splitZip(record['Zip Code']);
        const street = cleanDisplay(record['Address Street & No.']);
        const town = cleanDisplay(record['Town']) ?? rest;
        const province = cleanDisplay(record['Province'])?.toLowerCase() ?? null;
        const buyerKey = buyerDedupeKey({ name: buyerName, zip, street });

        countField(buyers, buyerKey, 'name', buyerName);
        countField(buyers, buyerKey, 'street', street);
        countField(buyers, buyerKey, 'zip', zip);
        countField(buyers, buyerKey, 'town', town);
        countField(buyers, buyerKey, 'province', province);

        const contactName = cleanDisplay(record['PinC']);
        const contactEmail = cleanDisplay(record['Email']);
        let contactIdentityKey = null;
        if (contactName !== null || contactEmail !== null) {
            contactIdentityKey = contactIdentity({ name: contactName, email: contactEmail });
            const contactKey = `${buyerKey}\u0000${contactIdentityKey}`;
            countField(contacts, contactKey, 'buyerKey', buyerKey);
            countField(contacts, contactKey, 'name', contactName);
            countField(contacts, contactKey, 'email', contactEmail);
            countField(contacts, contactKey, 'phone', cleanDisplay(record['Phone']));
            countField(contacts, contactKey, 'email2', cleanDisplay(record['Email2']));
            countField(contacts, contactKey, 'fax', cleanDisplay(record['Fax']));
        }

        const budget = cleanBudget(record['Budget']);
        const accountType = cleanDisplay(record['Type of Account']);

        if (!orders.has(orderKey)) {
            const registeredOn = parseDate(record, 'Date of MDP registration', DATE_RANGE);
            if (registeredOn === null) throw new Error(`Wiersz ${record._row}: brak poprawnej daty rejestracji MDP.`);
            orders.set(orderKey, {
                year,
                mdpNumber,
                endUserBidNumber: cleanDisplay(record['End-User bid numer']),
                registeredOn,
                publicationDate: parseDate(record, 'Publication Date', DATE_RANGE),
                bidDate: parseDate(record, 'Bid Date', DATE_RANGE),
                siwzUrl: cleanDisplay(record['SIWZ active link']),
                financingEu: (record['Financing EU'] ?? '').toLowerCase() === 'yes',
                budget,
                accountType,
                buyerKey,
                contactName: contactIdentityKey === null ? null : contactName,
                contactEmail: contactIdentityKey === null ? null : contactEmail,
                firstRecord: record,
            });
        } else {
            const first = orders.get(orderKey).firstRecord;
            for (const column of ORDER_LEVEL_COLUMNS) {
                if ((first[column] ?? '') !== (record[column] ?? '')) orderInconsistencies.add(column);
            }
        }

        const winnerName = cleanDisplay(record['Winner']);
        const winnerKey = winnerName === null ? null : companyKey(winnerName);
        if (winnerKey) countField(winners, winnerKey, 'name', winnerName);
        const vendorName = cleanDisplay(record['Vendor']);
        const vendorKey = vendorName === null ? null : companyKey(vendorName);
        if (vendorKey) countField(vendors, vendorKey, 'name', vendorName);

        const lob = cleanDisplay(record['Lob Category']);
        const os = cleanDisplay(record['OS']);
        const office = cleanDisplay(record['Office']);
        const finalOffice = cleanDisplay(record['Final Office']);
        const form = cleanDisplay(record['Forma nabycia']);
        if (lob) dictionaries.lob.add(lob);
        if (accountType) dictionaries.account.add(accountType);
        if (budget) dictionaries.budget.add(budget);
        if (form) dictionaries.form.add(form);
        if (os) dictionaries.os.add(os);
        for (const value of [office, finalOffice]) if (value) dictionaries.office.add(value);

        const attributes = {};
        for (const [column, key] of [['RAM', 'ram'], ['Build-in-storage', 'build_in_storage'], ['ISO 50001', 'iso_50001'], ['TCO', 'tco']]) {
            const value = cleanDisplay(record[column]);
            if (value !== null) attributes[key] = value;
        }

        positions.push({
            year,
            mdpNumber,
            positionNumber,
            legacyId: record['ID'],
            partLabel: cleanDisplay(record['Part']),
            lob,
            quantity: parseInteger(record, 'Qtty'),
            architecture: cleanDisplay(record['Architecture']),
            cpuNo: cleanDisplay(record['CPU_No']),
            os,
            office,
            initialBenchmark: cleanDisplay(record['Initial Benchmark']),
            form,
            remarks: cleanDisplay(record['Remarks']),
            attributes,
            status: cleanDisplay(record['Status']) ?? 'Pending',
            winnerKey,
            vendorKey,
            awardLetterDate: parseDate(record, 'Award Letter Date', AWARD_DATE_RANGE),
            finalOffice,
            partValue: parseMoney(record, 'Tender / part value'),
        });
    }

    return { orders, positions, buyers, contacts, winners, vendors, dictionaries, orderInconsistencies, rawBuyerNames };
}

function pick(entry, field) {
    return entry[field]?.mostFrequent() ?? null;
}

function finalizeBuyers(model) {
    const buyers = [];
    const conflicts = new Counter();
    for (const [key, entry] of model.buyers) {
        for (const field of ['town', 'province', 'street']) {
            if ((entry[field]?.size ?? 0) > 1) conflicts.add(field);
        }
        buyers.push({
            key,
            name: pick(entry, 'name'),
            street: pick(entry, 'street'),
            zip: pick(entry, 'zip'),
            town: pick(entry, 'town'),
            province: pick(entry, 'province'),
        });
    }
    buyers.sort((a, b) => a.key.localeCompare(b.key));
    return { buyers, conflicts };
}

function finalizeContacts(model) {
    const contacts = [];
    const conflicts = new Counter();
    for (const entry of model.contacts.values()) {
        for (const field of ['phone', 'email2', 'fax']) {
            if ((entry[field]?.size ?? 0) > 1) conflicts.add(field);
        }
        contacts.push({
            buyerKey: pick(entry, 'buyerKey'),
            name: pick(entry, 'name'),
            email: pick(entry, 'email'),
            phone: pick(entry, 'phone'),
            email2: pick(entry, 'email2'),
            fax: pick(entry, 'fax'),
        });
    }
    contacts.sort((a, b) => `${a.buyerKey}|${a.email}|${a.name}`.localeCompare(`${b.buyerKey}|${b.email}|${b.name}`));
    return { contacts, conflicts };
}

function finalizeCompanies(map) {
    return [...map.entries()]
        .map(([key, entry]) => ({ key, name: pick(entry, 'name') }))
        .sort((a, b) => a.key.localeCompare(b.key));
}

// --- Raport z suchego przebiegu ------------------------------------------------------------------------------

function printReport(model, buyersInfo, contactsInfo, winners, vendors, recordCount) {
    const line = (text = '') => console.log(text);
    const orders = [...model.orders.values()];
    line('== Źródło ==');
    line(`  wiersze danych: ${recordCount}, zamówienia: ${orders.length}, pozycje: ${model.positions.length}`);
    line(`  pominięte kolumny: ${DROPPED_COLUMNS.join(', ')} (puste), Financing non-EU (odwrotność Financing EU), Order Week i Publication Quarter (wyliczane)`);

    line('\n== Zamawiający ==');
    const byNormalizedName = new Map();
    for (const buyer of buyersInfo.buyers) {
        const key = normalizeText(buyer.name);
        byNormalizedName.set(key, (byNormalizedName.get(key) ?? 0) + 1);
    }
    const sharedNames = [...byNormalizedName.entries()].filter(([, n]) => n > 1);
    line(`  zapisów nazwy w raporcie: ${model.rawBuyerNames.size}, zamawiających po deduplikacji (nazwa+kod+ulica): ${buyersInfo.buyers.length}`);
    line(`  nazw współdzielonych przez więcej niż jednego zamawiającego (inne adresy; oddziały albo możliwe duplikaty do przeglądu): ${sharedNames.length}`);
    for (const [name, n] of sharedNames.slice(0, 5)) line(`    np. "${name}" (${n} jednostki)`);
    line(`  pola o różnych wartościach w obrębie jednego zamawiającego (wybrano najczęstszą): ${JSON.stringify(Object.fromEntries(buyersInfo.conflicts))}`);

    line('\n== Kontakty (PinC) ==');
    const withoutContact = orders.filter((o) => o.contactName === null && o.contactEmail === null).length;
    line(`  kontakty po deduplikacji: ${contactsInfo.contacts.length}, zamówienia bez kontaktu: ${withoutContact}`);
    line(`  pola o różnych wartościach w obrębie jednego kontaktu (wybrano najczęstszą): ${JSON.stringify(Object.fromEntries(contactsInfo.conflicts))}`);

    line('\n== Firmy ==');
    line(`  zwycięzcy: ${winners.length}, vendorzy: ${vendors.length}`);

    line('\n== Słowniki zbudowane z danych ==');
    for (const [name, set] of Object.entries(model.dictionaries)) line(`  ${name}: ${set.size}`);

    line('\n== Niespójności i odrzucone wartości ==');
    if (model.orderInconsistencies.size === 0) line('  pola zamówienia są spójne we wszystkich jego pozycjach');
    else line(`  pola zamówienia różne między pozycjami: ${JSON.stringify(Object.fromEntries(model.orderInconsistencies))}`);
    if (issues.size === 0) line('  brak odrzuconych wartości');
    for (const [label, count] of [...issues.entries()].sort()) {
        line(`  ${label}: ${count}${issueSamples.get(label)?.length ? `  (np. ${issueSamples.get(label).join(', ')})` : ''}`);
    }

    const withValue = model.positions.filter((p) => p.partValue !== null).length;
    line('\n== Uwagi ==');
    line(`  pozycje z wartością: ${withValue}. Wartość trafia do positions.part_value bez zmian (import bez przeliczeń). orders.value_total i parts_count zostają puste do ustalenia reguły.`);
    line('  wszystkie zamówienia dostają status "open" (raport nie zawiera statusu zamówienia).');
}

// --- Generowanie SQL -----------------------------------------------------------------------------------------------

function lit(value) {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    // standard_conforming_strings = on, więc wystarczy podwoić apostrofy. NUL jest niedozwolony w tekście Postgresa.
    return `'${String(value).replace(/\0/g, '').replace(/'/g, "''")}'`;
}

function insertRows(table, columns, rows) {
    const statements = [];
    for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
        const chunk = rows.slice(i, i + INSERT_CHUNK).map((row) => `(${row.map(lit).join(', ')})`);
        statements.push(`INSERT INTO ${table} (${columns.join(', ')}) VALUES\n${chunk.join(',\n')};`);
    }
    return statements.join('\n');
}

function sortedValues(set) {
    return [...set].sort((a, b) => a.localeCompare(b));
}

function generateSql(model, buyersInfo, contactsInfo, winners, vendors, sourceName) {
    const out = [];
    const orders = [...model.orders.values()].sort((a, b) => a.year - b.year || a.mdpNumber - b.mdpNumber);
    const positions = [...model.positions].sort((a, b) => a.year - b.year || a.mdpNumber - b.mdpNumber || a.positionNumber - b.positionNumber);
    const auditedTables = ['buyers', 'buyer_contacts', 'orders', 'positions'];

    out.push(`-- Wygenerowane przez db/import/importMdpReport.mjs ze źródła: ${sourceName}`);
    out.push('-- Zawiera dane osobowe z raportu. Nie dodawać do repozytorium.');
    out.push('SET standard_conforming_strings = on;');
    out.push('BEGIN;');
    out.push(`DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM orders) THEN
        RAISE EXCEPTION 'Baza zawiera już zamówienia, import przerwany (ładujemy tylko do pustej bazy).';
    END IF;
END $$;`);
    // Wyzwalacze dziennika zmian zostają wyłączone na czas importu (dziesiątki tysięcy wpisów bez wartości).
    // Zamiast nich powstaje jeden wpis zbiorczy na końcu.
    for (const table of auditedTables) out.push(`ALTER TABLE ${table} DISABLE TRIGGER ${table}_audit;`);

    out.push('-- Słowniki: wartości spoza Legendy dopisujemy bez opisu.');
    out.push(insertRows('lob_categories', ['code'], sortedValues(model.dictionaries.lob).map((v) => [v])).replace(/;$/gm, ' ON CONFLICT DO NOTHING;'));
    out.push(insertRows('account_types', ['code'], sortedValues(model.dictionaries.account).map((v) => [v])).replace(/;$/gm, ' ON CONFLICT DO NOTHING;'));
    out.push(insertRows('budget_brackets', ['label'], sortedValues(model.dictionaries.budget).map((v) => [v])));
    out.push(insertRows('acquisition_forms', ['label'], sortedValues(model.dictionaries.form).map((v) => [v])));
    out.push(insertRows('os_options', ['label'], sortedValues(model.dictionaries.os).map((v) => [v])));
    out.push(insertRows('office_options', ['label'], sortedValues(model.dictionaries.office).map((v) => [v])));

    out.push(insertRows('winners', ['name', 'name_key'], winners.map((w) => [w.name, w.key])));
    out.push(insertRows('vendors', ['name', 'name_key'], vendors.map((v) => [v.name, v.key])));

    out.push(`DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM (VALUES ${sortedValues(new Set(buyersInfo.buyers.map((b) => b.province).filter(Boolean))).map((p) => `(${lit(p)})`).join(', ')}) AS v(p)
               WHERE p NOT IN (SELECT code FROM provinces)) THEN
        RAISE EXCEPTION 'W raporcie są województwa spoza słownika provinces.';
    END IF;
END $$;`);

    out.push('CREATE TEMP TABLE imp_buyers (dedupe_key text, name text, street text, zip_code text, town text, province text) ON COMMIT DROP;');
    out.push(insertRows('imp_buyers', ['dedupe_key', 'name', 'street', 'zip_code', 'town', 'province'],
        buyersInfo.buyers.map((b) => [b.key, b.name, b.street, b.zip, b.town, b.province])));
    out.push(`INSERT INTO buyers (name, dedupe_key, street, zip_code, town, province, created_by)
SELECT name, dedupe_key, street, zip_code, town, province, ${lit(IMPORT_ACTOR)} FROM imp_buyers ORDER BY dedupe_key;`);

    out.push('CREATE TEMP TABLE imp_contacts (buyer_key text, full_name text, email text, phone text, email2 text, fax text) ON COMMIT DROP;');
    out.push(insertRows('imp_contacts', ['buyer_key', 'full_name', 'email', 'phone', 'email2', 'fax'],
        contactsInfo.contacts.map((c) => [c.buyerKey, c.name, c.email, c.phone, c.email2, c.fax])));
    out.push(`INSERT INTO buyer_contacts (buyer_id, full_name, email, phone, email2, fax, created_by)
SELECT b.id, c.full_name, c.email, c.phone, c.email2, c.fax, ${lit(IMPORT_ACTOR)}
  FROM imp_contacts c JOIN buyers b ON b.dedupe_key = c.buyer_key
 ORDER BY b.id, c.email, c.full_name;`);

    out.push(`CREATE TEMP TABLE imp_orders (year smallint, mdp_number integer, end_user_bid_number text, registered_on date,
    publication_date date, bid_date date, siwz_url text, financing_eu boolean, budget text, account_type text,
    buyer_key text, contact_name text, contact_email text) ON COMMIT DROP;`);
    out.push(insertRows('imp_orders',
        ['year', 'mdp_number', 'end_user_bid_number', 'registered_on', 'publication_date', 'bid_date', 'siwz_url', 'financing_eu', 'budget', 'account_type', 'buyer_key', 'contact_name', 'contact_email'],
        orders.map((o) => [o.year, o.mdpNumber, o.endUserBidNumber, o.registeredOn, o.publicationDate, o.bidDate, o.siwzUrl, o.financingEu, o.budget, o.accountType, o.buyerKey, o.contactName, o.contactEmail])));
    out.push(`INSERT INTO orders (year, mdp_number, end_user_bid_number, registered_on, publication_date, bid_date, siwz_url,
                    financing_eu, budget_bracket_id, account_type, buyer_id, contact_id, created_by)
SELECT o.year, o.mdp_number, o.end_user_bid_number, o.registered_on, o.publication_date, o.bid_date, o.siwz_url,
       o.financing_eu, bb.id, o.account_type, b.id, c.id, ${lit(IMPORT_ACTOR)}
  FROM imp_orders o
  JOIN buyers b ON b.dedupe_key = o.buyer_key
  LEFT JOIN budget_brackets bb ON bb.label = o.budget
  LEFT JOIN buyer_contacts c ON c.buyer_id = b.id
       AND lower(coalesce(c.email, '')) = lower(coalesce(o.contact_email, ''))
       AND lower(coalesce(c.full_name, '')) = lower(coalesce(o.contact_name, ''))
       AND (o.contact_email IS NOT NULL OR o.contact_name IS NOT NULL)
 ORDER BY o.year, o.mdp_number;`);

    out.push(`CREATE TEMP TABLE imp_positions (year smallint, mdp_number integer, position_number integer, legacy_id text, part_label text,
    lob_category text, quantity integer, architecture text, cpu_no text, os text, office text, initial_benchmark text,
    form text, remarks text, attributes text, status text, winner_key text, vendor_key text, award_letter_date date,
    final_office text, part_value numeric) ON COMMIT DROP;`);
    out.push(insertRows('imp_positions',
        ['year', 'mdp_number', 'position_number', 'legacy_id', 'part_label', 'lob_category', 'quantity', 'architecture', 'cpu_no', 'os', 'office', 'initial_benchmark', 'form', 'remarks', 'attributes', 'status', 'winner_key', 'vendor_key', 'award_letter_date', 'final_office', 'part_value'],
        positions.map((p) => [p.year, p.mdpNumber, p.positionNumber, p.legacyId, p.partLabel, p.lob, p.quantity, p.architecture, p.cpuNo, p.os, p.office, p.initialBenchmark, p.form, p.remarks, JSON.stringify(p.attributes), p.status, p.winnerKey, p.vendorKey, p.awardLetterDate, p.finalOffice, p.partValue])));
    out.push(`INSERT INTO positions (order_id, position_number, legacy_id, part_label, lob_category, quantity, architecture, cpu_no,
                       os_id, office_id, initial_benchmark, acquisition_form_id, remarks, attributes, status, winner_id,
                       vendor_id, award_letter_date, final_office_id, part_value, created_by)
SELECT o.id, p.position_number, p.legacy_id, p.part_label, p.lob_category, p.quantity, p.architecture, p.cpu_no,
       os.id, oo.id, p.initial_benchmark, af.id, p.remarks, p.attributes::jsonb, p.status, w.id,
       v.id, p.award_letter_date, fo.id, p.part_value, ${lit(IMPORT_ACTOR)}
  FROM imp_positions p
  JOIN orders o ON o.year = p.year AND o.mdp_number = p.mdp_number
  LEFT JOIN os_options os ON os.label = p.os
  LEFT JOIN office_options oo ON oo.label = p.office
  LEFT JOIN office_options fo ON fo.label = p.final_office
  LEFT JOIN acquisition_forms af ON af.label = p.form
  LEFT JOIN winners w ON w.name_key = p.winner_key
  LEFT JOIN vendors v ON v.name_key = p.vendor_key
 ORDER BY p.year, p.mdp_number, p.position_number;`);

    for (const table of auditedTables) out.push(`ALTER TABLE ${table} ENABLE TRIGGER ${table}_audit;`);
    out.push('SELECT sync_counters();');
    out.push(`INSERT INTO audit_log (actor, entity, entity_id, action, changes)
VALUES (${lit(IMPORT_ACTOR)}, 'import', 0, 'INSERT', jsonb_build_object(
    'source', ${lit(sourceName)},
    'buyers', (SELECT count(*) FROM buyers), 'contacts', (SELECT count(*) FROM buyer_contacts),
    'orders', (SELECT count(*) FROM orders), 'positions', (SELECT count(*) FROM positions)));`);
    out.push(`DO $$
DECLARE
    expected_orders integer := ${orders.length};
    expected_positions integer := ${positions.length};
BEGIN
    IF (SELECT count(*) FROM orders) <> expected_orders OR (SELECT count(*) FROM positions) <> expected_positions THEN
        RAISE EXCEPTION 'Liczba zaimportowanych wierszy nie zgadza się z raportem (zamówienia: %, pozycje: %).',
            (SELECT count(*) FROM orders), (SELECT count(*) FROM positions);
    END IF;
END $$;`);
    out.push('COMMIT;');
    out.push('ANALYZE;');
    out.push(`SELECT (SELECT count(*) FROM buyers) AS buyers, (SELECT count(*) FROM buyer_contacts) AS contacts,
       (SELECT count(*) FROM orders) AS orders, (SELECT count(*) FROM positions) AS positions,
       (SELECT count(*) FROM winners) AS winners, (SELECT count(*) FROM vendors) AS vendors;`);
    return out.join('\n') + '\n';
}

// --- Uruchomienie -----------------------------------------------------------------------------------------------------

function main() {
    const args = process.argv.slice(2);
    const sqlFlag = args.indexOf('--sql');
    const sqlPath = sqlFlag >= 0 ? args[sqlFlag + 1] : null;
    const sourcePath = args.find((arg, i) => !arg.startsWith('--') && (sqlFlag < 0 || i !== sqlFlag + 1));
    if (!sourcePath || (sqlFlag >= 0 && !sqlPath)) {
        console.error('Użycie: node db/import/importMdpReport.mjs <raport.xlsx> [--sql <plik.sql>]');
        process.exit(2);
    }

    const records = loadRecords(sourcePath);
    const model = buildModel(records);
    const buyersInfo = finalizeBuyers(model);
    const contactsInfo = finalizeContacts(model);
    const winners = finalizeCompanies(model.winners);
    const vendors = finalizeCompanies(model.vendors);
    printReport(model, buyersInfo, contactsInfo, winners, vendors, records.length);

    if (sqlPath) {
        const sourceName = sourcePath.split(/[\\/]/).pop();
        writeFileSync(sqlPath, generateSql(model, buyersInfo, contactsInfo, winners, vendors, sourceName), 'utf8');
        console.log(`\nZapisano skrypt SQL: ${sqlPath}`);
    } else {
        console.log('\nSuchy przebieg: nic nie zapisano (dodaj --sql <plik>, aby wygenerować skrypt ładujący).');
    }
}

main();
