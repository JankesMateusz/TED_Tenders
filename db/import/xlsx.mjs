// Minimalny czytnik arkusza .xlsx bez zależności: rozpakowuje archiwum (zlib) i parsuje XML arkusza.
// Obsługuje to, czego używa raport MDP: ciągi współdzielone, komórki tekstowe i liczbowe. Nie jest ogólnym czytnikiem Excela.
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
const MAX_EOCD_SEARCH = 65557; // 22 bajty rekordu + maksymalny komentarz archiwum

function readZipEntries(buffer) {
    let eocd = -1;
    for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - MAX_EOCD_SEARCH); i--) {
        if (buffer.readUInt32LE(i) === EOCD_SIGNATURE) {
            eocd = i;
            break;
        }
    }
    if (eocd < 0) throw new Error('To nie jest poprawne archiwum zip (brak rekordu końca katalogu).');
    const count = buffer.readUInt16LE(eocd + 10);
    let offset = buffer.readUInt32LE(eocd + 16);
    const entries = new Map();
    for (let n = 0; n < count; n++) {
        if (buffer.readUInt32LE(offset) !== CENTRAL_SIGNATURE) throw new Error('Uszkodzony katalog centralny zip.');
        const method = buffer.readUInt16LE(offset + 10);
        const compressedSize = buffer.readUInt32LE(offset + 20);
        const nameLength = buffer.readUInt16LE(offset + 28);
        const extraLength = buffer.readUInt16LE(offset + 30);
        const commentLength = buffer.readUInt16LE(offset + 32);
        const localOffset = buffer.readUInt32LE(offset + 42);
        const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength);
        entries.set(name, { method, compressedSize, localOffset });
        offset += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
}

function readEntry(buffer, entries, name) {
    const entry = entries.get(name);
    if (!entry) throw new Error(`Brak pliku ${name} w archiwum.`);
    if (buffer.readUInt32LE(entry.localOffset) !== LOCAL_SIGNATURE) throw new Error('Uszkodzony nagłówek lokalny zip.');
    const nameLength = buffer.readUInt16LE(entry.localOffset + 26);
    const extraLength = buffer.readUInt16LE(entry.localOffset + 28);
    const start = entry.localOffset + 30 + nameLength + extraLength;
    const data = buffer.subarray(start, start + entry.compressedSize);
    if (entry.method === 0) return data.toString('utf8');
    if (entry.method === 8) return inflateRawSync(data).toString('utf8');
    throw new Error(`Nieobsługiwana metoda kompresji zip: ${entry.method}`);
}

function unescapeXml(text) {
    return text
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

function textOf(xml) {
    const withoutPhonetic = xml.replace(/<rPh[\s\S]*?<\/rPh>/g, '');
    return unescapeXml([...withoutPhonetic.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(''));
}

function columnIndex(letters) {
    let n = 0;
    for (const ch of letters) n = n * 26 + ch.charCodeAt(0) - 64;
    return n - 1;
}

/**
 * Zwraca wiersze pierwszego arkusza jako tablice komórek (indeks kolumny → tekst).
 * Wartości liczbowe i daty zostają tekstem z pliku (daty to numery seryjne Excela).
 */
export function readFirstSheet(path) {
    const buffer = readFileSync(path);
    const entries = readZipEntries(buffer);
    const sharedXml = entries.has('xl/sharedStrings.xml') ? readEntry(buffer, entries, 'xl/sharedStrings.xml') : '';
    const shared = [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1]));
    const sheet = readEntry(buffer, entries, 'xl/worksheets/sheet1.xml');

    const rows = [];
    for (const rowMatch of sheet.matchAll(/<row [^>]*?r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
        const cells = {};
        for (const cell of rowMatch[2].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
            const attrs = cell[2];
            const body = cell[3] ?? '';
            const valueMatch = /<v>([\s\S]*?)<\/v>/.exec(body);
            let value;
            if (/t="s"/.test(attrs)) {
                if (!valueMatch) continue;
                value = shared[Number(valueMatch[1])];
            } else if (/t="inlineStr"/.test(attrs)) {
                value = textOf(body);
            } else if (valueMatch) {
                value = unescapeXml(valueMatch[1]);
            } else {
                continue;
            }
            cells[columnIndex(cell[1])] = value;
        }
        rows.push({ rowNumber: Number(rowMatch[1]), cells });
    }
    return rows;
}

const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30);
const MS_PER_DAY = 86400000;

/** Numer seryjny daty Excela → "RRRR-MM-DD" (godzina po przecinku jest ucinana) albo null, gdy to nie liczba. */
export function excelDateToIso(serial) {
    if (serial === undefined || serial === null || !/^\d+(\.\d+)?$/.test(String(serial).trim())) return null;
    const date = new Date(EXCEL_EPOCH_MS + Math.trunc(Number(serial)) * MS_PER_DAY);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}
