/**
 * Sektor zamawiającego, ustalany heurystycznie po nazwie. Aplikacja domyślnie ukrywa tylko `private` i `ngo`
 * (analityczka nie obsługuje firm prywatnych i organizacji pozarządowych), więc heurystyka jest ostrożna:
 * wszystko niejednoznaczne zostaje `unknown`, czyli widoczne. Ukrycie dobrego ogłoszenia kosztuje więcej niż
 * pokazanie zbędnego.
 */
export type BuyerSector = 'public' | 'municipal' | 'ngo' | 'private' | 'unknown';

/** Małe litery, bez interpunkcji i podwójnych spacji: "Sp. z o.o." i "sp z o o" wyglądają tak samo. */
const normalizeName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[.,;:"'„”“()\-–/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Spółki komunalne (wodociągi, usługi komunalne itd.) są obsługiwane, także w formie spółek z o.o. i S.A.
const MUNICIPAL_MARKERS = [
  'wodoci', 'wodno', 'kanaliz', 'komunal', 'komunln', 'oczyszczaln', 'ciepłown', 'gospodarki mieszkaniowej', 'zakład usług gminnych',
];

// Podmioty jednoznacznie publiczne. Szkół wyższych celowo tu nie ma: wiele z nich jest niepublicznych.
const PUBLIC_MARKERS = [
  'gmin', 'miejsk', 'powiat', 'starost', 'urząd', 'nadleśnict', 'kancelaria prezesa', 'ministerstw', 'wojewódzk',
  'sp zoz', 'samodzielny publiczny', 'zakład opieki zdrowotnej', 'ośrodek pomocy społecznej', 'zespół szkół', 'szkoła podstawowa',
];

const NGO_MARKERS = ['fundacj', 'stowarzyszeni', 'związek pracodawców', 'związek zawodowy'];

// Formy prawne firm (w tym zapisy ze skrótami i literówkami, które zdarzają się w Bazie: "Sp. zo.o.", "Sp. z o")
const PRIVATE_PATTERNS: RegExp[] = [
  /\bsp z o o\b/, /\bsp zo o\b/, /\bsp z oo\b/, /\bsp zoo\b/, /\bsp z o$/, /\bsp z o (sp k|spółka)/,
  /spółka z o(graniczoną)?\b/, /spółk\w* z ograniczoną/,
  /spółka akcyjna/, /\bs a\b/, /\bltd\b/,
  /\bsp k\b/, /spółka komandytowa/, /\bsp j\b/, /\bs c\b/, /spółka cywilna/,
  /przedsiębiorstwo handlowo usługowe/,
];

const includesAny = (text: string, markers: string[]): boolean => markers.some((marker) => text.includes(marker));

export const classifySector = (name: string | null | undefined): BuyerSector => {
  if (!name) return 'unknown';
  const text = normalizeName(name);
  // Kolejność ma znaczenie: znaczniki komunalne i publiczne wygrywają z formą prawną ("Zakład Gospodarki Komunalnej sp. z o.o.")
  if (includesAny(text, MUNICIPAL_MARKERS)) return 'municipal';
  if (includesAny(text, PUBLIC_MARKERS)) return 'public';
  if (includesAny(text, NGO_MARKERS)) return 'ngo';
  if (PRIVATE_PATTERNS.some((pattern) => pattern.test(text))) return 'private';
  return 'unknown';
};
