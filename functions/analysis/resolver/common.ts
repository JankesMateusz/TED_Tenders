import { createHash } from 'node:crypto';
import { Platform, ResolvedFile } from './types';

export const fingerprintOf = (platform: Platform, files: ResolvedFile[]): string => {
  const entries = files
    .map((file) => [file.platformFileId, file.publishedAt ?? '', file.path])
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return createHash('sha256').update(JSON.stringify([platform, entries])).digest('hex');
};

/** Zapewnia unikalne ścieżki w manifeście: powtórzoną nazwę dopisuje z numerem przed rozszerzeniem. */
export const uniquePaths = <T extends { path: string }>(files: T[]): T[] => {
  const seen = new Map<string, number>();
  return files.map((file) => {
    const count = (seen.get(file.path) ?? 0) + 1;
    seen.set(file.path, count);
    if (count === 1) return file;
    const dot = file.path.lastIndexOf('.');
    const hasExtension = dot > file.path.lastIndexOf('/') + 1;
    const path = hasExtension ? `${file.path.slice(0, dot)} (${count})${file.path.slice(dot)}` : `${file.path} (${count})`;
    return { ...file, path };
  });
};

const NAMED_ENTITIES: Record<string, string> = { nbsp: ' ', lt: '<', gt: '>', quot: '"', apos: "'", amp: '&', oacute: 'ó', Oacute: 'Ó' };

/** Jedno przejście, żeby zdekodowany znak (np. „&amp;lt;”) nie był dekodowany po raz drugi. Nieznana encja zostaje bez zmian. */
const decodeEntities = (text: string): string =>
  text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (entity, body: string) => {
    if (body[0] !== '#') return NAMED_ENTITIES[body] ?? entity;
    const code = body[1].toLowerCase() === 'x' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });

/** Zamienia fragment HTML na zwykły tekst (bez znaczników, z rozwiniętymi encjami, także numerycznymi jak „&#346;”). */
export const htmlToText = (html: string): string =>
  decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();

/** Wiersz listy postępowań zamawiającego (platformazakupowa.pl, ezamawiający, logintrade). */
export interface ProceedingRow {
  id: string;
  /** Nazwa lub opis z listy; zwykle zaczyna się od numeru sprawy. */
  name: string;
}

/** Numer sprawy krótszy niż to byłby zbyt łatwy do trafienia przypadkiem (np. „1/2026”). */
const MIN_REFERENCE_LENGTH = 5;
/** Do porównania tytułów bierzemy słowa dłuższe niż 3 znaki (pomija spójniki i przyimki). */
const MIN_TITLE_WORD_LENGTH = 4;
const TITLE_WORDS_MATCH_RATIO = 0.7;

const stripDiacritics = (text: string): string =>
  // „ł” nie rozkłada się w NFD, więc zamieniamy je osobno
  text.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Małe litery, bez znaków diakrytycznych, tylko litery i cyfry (do szukania numeru sprawy). */
export const normalizeCompact = (text: string): string => stripDiacritics(text).replace(/[^a-z0-9]+/g, '');

const significantWords = (text: string): string[] =>
  stripDiacritics(text)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= MIN_TITLE_WORD_LENGTH);

const titleMatches = (row: ProceedingRow, titleWords: string[]): boolean => {
  if (titleWords.length === 0) return false;
  const rowWords = new Set(significantWords(row.name));
  return titleWords.filter((word) => rowWords.has(word)).length / titleWords.length >= TITLE_WORDS_MATCH_RATIO;
};

/**
 * Wybiera z listy postępowań zamawiającego to, które odpowiada przetargowi; null, gdy nie ma dokładnie jednego kandydata.
 * 1) numer sprawy zawarty w nazwie dokładnie jednego wiersza; przy kilku trafieniach rozstrzyga zgodny tytuł;
 * 2) bez trafień po numerze: dokładnie jeden wiersz zgodny po tytule.
 * Nie zgadujemy: niejednoznaczność oznacza brak dopasowania.
 */
export const matchProceeding = (
  rows: ProceedingRow[],
  hints: { referenceNumber?: string | null; title?: string | null },
  /** false, gdy lista jest niepełna (np. tylko pierwsza strona): brakujący wiersz mógłby zmienić wynik, więc tytułowi nie ufamy. */
  titleFallback = true,
): ProceedingRow | null => {
  const reference = normalizeCompact(hints.referenceNumber ?? '');
  const titleWords = [...new Set(significantWords(hints.title ?? ''))];

  if (reference.length >= MIN_REFERENCE_LENGTH) {
    const byReference = rows.filter((row) => normalizeCompact(row.name).includes(reference));
    if (byReference.length === 1) return byReference[0];
    if (byReference.length > 1) {
      const narrowed = byReference.filter((row) => titleMatches(row, titleWords));
      return narrowed.length === 1 ? narrowed[0] : null;
    }
  }

  if (!titleFallback) return null;
  const byTitle = rows.filter((row) => titleMatches(row, titleWords));
  return byTitle.length === 1 ? byTitle[0] : null;
};

export const hostOf =(url: string): string | null => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
};
