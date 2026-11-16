// Normalizacja tekstów do wykrywania duplikatów (zamawiający, kontakty, firmy).
// Ta sama logika musi być użyta w formularzach aplikacji, żeby wpis ręczny trafiał na ten sam klucz co import.

/** Tekst bez wielkości liter, znaków diakrytycznych i interpunkcji, z pojedynczymi spacjami. */
export function normalizeText(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .normalize('NFKD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .replace(/ł/g, 'l') // ł nie rozkłada się w NFKD
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim();
}

// Przedrostki ulic, które w jednym zapisie są, a w drugim ich nie ma ("ul. Długa 5" i "Długa 5").
const STREET_PREFIXES = new Set(['ul', 'ulica', 'al', 'aleja', 'aleje', 'pl', 'plac', 'os', 'osiedle']);

export function normalizeStreet(value) {
    return normalizeText(value)
        .split(' ')
        .filter((token) => token !== '' && !STREET_PREFIXES.has(token))
        .join(' ');
}

const ZIP_PATTERN = /^\s*(\d{2}-\d{3})\s*(.*)$/;

/** Pole "Zip Code" w raporcie ma postać "63-304 Czermin". Zwraca kod i resztę (miejscowość). */
export function splitZip(value) {
    const text = (value ?? '').trim();
    const match = ZIP_PATTERN.exec(text);
    if (!match) return { zip: text || null, rest: null };
    return { zip: match[1], rest: match[2].trim() || null };
}

/**
 * Klucz zamawiającego: nazwa + kod pocztowy + ulica po normalizacji.
 * Sama nazwa nie wystarcza (ta sama nazwa bywa używana przez jednostki w różnych miastach).
 */
export function buyerDedupeKey({ name, zip, street }) {
    return `${normalizeText(name)}|${zip ?? ''}|${normalizeStreet(street)}`;
}

/** Klucz firmy (zwycięzca, vendor). */
export function companyKey(name) {
    return normalizeText(name);
}

/** Tożsamość kontaktu w obrębie zamawiającego. Musi odpowiadać indeksowi buyer_contacts_identity_uq (lower, bez normalizacji). */
export function contactIdentity({ name, email }) {
    return `${(name ?? '').trim().toLowerCase()}|${(email ?? '').trim().toLowerCase()}`;
}

/** Zapis do wyświetlania: przycięty, ze zredukowanymi powtórzonymi spacjami. */
export function cleanDisplay(value) {
    const text = (value ?? '').replace(/\s+/g, ' ').trim();
    return text === '' ? null : text;
}
