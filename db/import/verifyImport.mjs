#!/usr/bin/env node
// Test w obie strony: porównuje widok v_report_flat (po imporcie) z oryginalnym raportem xlsx, kolumna po kolumnie.
//
// Użycie:
//   docker exec tenders-pg psql -U postgres -At -c "select json_agg(t) from v_report_flat t" \
//     | node db/import/verifyImport.mjs <raport.xlsx>
//
// Różnice dzielimy na oczekiwane (normalizacja zapisu, odrzucone wartości, wybór najczęstszego wariantu) i niezgodne.
// Przy niezgodnościach skrypt kończy się kodem 1. W przykładach wypisuje tylko ID pozycji, bez danych osobowych.
import { readFileSync } from 'node:fs';
import { excelDateToIso, readFirstSheet } from './xlsx.mjs';
import { cleanDisplay, companyKey, normalizeText, splitZip } from './normalize.mjs';

const HEADER_ROW = 2;
const FIRST_DATA_ROW = 3;
const DATE_RANGE = { min: '2000-01-01', max: '2100-12-31' };
const AWARD_DATE_RANGE = { min: '2015-01-01', max: '2100-12-31' };
const NOT_IMPORTED = ['Benchmark Bid', 'Comments Sales Team', 'Data wysłania pisma'];
const MAX_SAMPLES = 5;

function loadExcel(path) {
    const rows = readFirstSheet(path);
    const names = rows.find((r) => r.rowNumber === HEADER_ROW).cells;
    const byId = new Map();
    for (const row of rows.filter((r) => r.rowNumber >= FIRST_DATA_ROW)) {
        const record = {};
        for (const [index, name] of Object.entries(names)) {
            const value = row.cells[index];
            if (value !== undefined && String(value).trim() !== '') record[name] = String(value).trim();
        }
        if (record['ID']) byId.set(record['ID'], record);
    }
    return { columns: Object.values(names), byId };
}

const inRange = (iso, range) => iso !== null && iso >= range.min && iso <= range.max;
const dateExpectation = (range) => (raw) => {
    const iso = excelDateToIso(raw);
    return inRange(iso, range) ? iso : null;
};
const textOf = (raw) => cleanDisplay(raw);

// Każda reguła: expected(excelRaw, excelRecord) → wartość oczekiwana w widoku; opcjonalnie allowed(excelRaw, actual) →
// czy różnica jest dopuszczalnym wariantem zapisu (liczona osobno, nie jako niezgodność).
const RULES = {
    'MDP ID': { expected: (raw) => raw.padStart(4, '0') },
    'Date of MDP registration': { expected: dateExpectation(DATE_RANGE) },
    'Publication Date': { expected: dateExpectation(DATE_RANGE) },
    'Bid Date': { expected: dateExpectation(DATE_RANGE) },
    'Award Letter Date': { expected: dateExpectation(AWARD_DATE_RANGE) },
    'Qtty': { expected: (raw) => (/^\d+(\.0+)?$/.test(raw ?? '') ? Math.trunc(Number(raw)) : null) },
    'Tender / part value': { expected: (raw) => (/^\d+(\.\d+)?$/.test(raw ?? '') ? Number(Number(raw).toFixed(2)) : null) },
    'Zip Code': { expected: (raw) => splitZip(raw).zip },
    'Town': { expected: (raw, rec) => textOf(raw) ?? splitZip(rec['Zip Code']).rest, allowed: () => true },
    'Province': { expected: (raw) => textOf(raw)?.toLowerCase() ?? null },
    'Budget': { expected: (raw) => textOf(raw)?.replace(/(\sPLN)+$/i, ' PLN') ?? null },
    'Financing EU': { expected: (raw) => (raw ?? '').toLowerCase() },
    'Financing non-EU': { expected: (raw) => (raw ?? '').toLowerCase() },
    // Nazwy: dopuszczalna różnica w zapisie, jeśli klucz normalizacji jest ten sam (import wybiera najczęstszy zapis).
    // Pola kontaktu i adresu: przy sprzecznych albo brakujących wartościach w różnych wierszach tego samego kontaktu
    // lub zamawiającego import wybiera najczęstszą niepustą wartość. Liczba takich wierszy jest widoczna w kolumnie "dozwolone".
    'Phone': { expected: textOf, allowed: () => true },
    'Email2': { expected: textOf, allowed: () => true },
    'Fax': { expected: textOf, allowed: () => true },
    'Address Street & No.': { expected: textOf, allowed: () => true },
    'Official Name': { expected: textOf, allowed: (raw, actual) => normalizeText(raw) === normalizeText(actual) },
    'Winner': { expected: textOf, allowed: (raw, actual) => companyKey(raw) === companyKey(actual) },
    'Vendor': { expected: textOf, allowed: (raw, actual) => companyKey(raw) === companyKey(actual) },
};
const DEFAULT_RULE = { expected: textOf };

function comparable(value) {
    return value === undefined || value === '' ? null : value;
}

function main() {
    const sourcePath = process.argv[2];
    if (!sourcePath) {
        console.error('Użycie: ... | node db/import/verifyImport.mjs <raport.xlsx>');
        process.exit(2);
    }
    const excel = loadExcel(sourcePath);
    const viewRows = JSON.parse(readFileSync(0, 'utf8') || 'null') ?? [];
    const viewById = new Map(viewRows.map((r) => [r['ID'], r]));

    console.log(`Excel: ${excel.byId.size} pozycji, baza (v_report_flat): ${viewById.size} pozycji`);
    let failures = 0;

    const missing = [...excel.byId.keys()].filter((id) => !viewById.has(id));
    const extra = [...viewById.keys()].filter((id) => !excel.byId.has(id));
    console.log(`brakujące w bazie: ${missing.length}, nadmiarowe w bazie: ${extra.length}`);
    if (missing.length || extra.length) failures++;

    const columns = excel.columns.filter((c) => !NOT_IMPORTED.includes(c) && c in (viewRows[0] ?? {}));
    const skipped = excel.columns.filter((c) => !NOT_IMPORTED.includes(c) && !(c in (viewRows[0] ?? {})));
    if (skipped.length) {
        console.log(`kolumny raportu bez odpowiednika w widoku: ${skipped.join(', ')}`);
        failures++;
    }

    console.log('\nkolumna                      zgodne  dozwolone  niezgodne');
    for (const column of columns) {
        const rule = RULES[column] ?? DEFAULT_RULE;
        let exact = 0;
        let allowed = 0;
        const bad = [];
        for (const [id, record] of excel.byId) {
            const view = viewById.get(id);
            if (!view) continue;
            const expected = comparable(rule.expected(record[column], record));
            const actual = comparable(view[column]);
            if (String(expected) === String(actual)) exact++;
            else if (rule.allowed && actual !== null && rule.allowed(record[column], actual)) allowed++;
            else bad.push(id);
        }
        if (bad.length) failures++;
        console.log(`${column.padEnd(28)} ${String(exact).padStart(6)}  ${String(allowed).padStart(9)}  ${String(bad.length).padStart(9)}${bad.length ? `   np. ID ${bad.slice(0, MAX_SAMPLES).join(', ')}` : ''}`);
    }

    console.log(failures === 0 ? '\nWYNIK: zgodne (poza dozwolonymi wariantami zapisu).' : '\nWYNIK: są niezgodności, patrz wyżej.');
    process.exit(failures === 0 ? 0 : 1);
}

main();
