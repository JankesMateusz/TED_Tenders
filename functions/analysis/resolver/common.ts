import { createHash } from 'node:crypto';
import { HttpClient, Platform, ResolvedFile, ResolverError } from './types';

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
/** Od tylu słów tytułu pełne trafienie rozstrzyga między kilkoma kandydatami. */
const MIN_TITLE_WORDS_FOR_EXACT = 5;

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
 * 2) numer sprawy znany, ale bez trafień: brak dopasowania (postępowania jeszcze nie ma na liście);
 * 3) numeru sprawy brak (lub za krótki): dokładnie jeden wiersz zgodny po tytule.
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
    // Znany numer sprawy, którego nie ma na liście: postępowanie jeszcze nie zostało opublikowane. Tytuły zakupów tego
    // samego zamawiającego bywają powtarzalne („Dostawa sprzętu komputerowego…”), więc tytuł wskazałby wcześniejsze postępowanie.
    return null;
  }

  if (!titleFallback) return null;
  const byTitle = rows.filter((row) => titleMatches(row, titleWords));
  if (byTitle.length === 1) return byTitle[0];
  // Kilku kandydatów powyżej progu (np. podobne zakupy tego samego zamawiającego): wygrywa jedyny, który zawiera
  // wszystkie słowa tytułu. Przy krótkim tytule pełne trafienie nic nie dowodzi, więc wtedy nie rozstrzygamy.
  if (byTitle.length > 1 && titleWords.length >= MIN_TITLE_WORDS_FOR_EXACT) {
    const exact = byTitle.filter((row) => {
      const rowWords = new Set(significantWords(row.name));
      return titleWords.every((word) => rowWords.has(word));
    });
    if (exact.length === 1) return exact[0];
  }
  return null;
};

/** Ile stron listy postępowań czytamy najwyżej (zabezpieczenie przed nadmiarem zapytań do platformy). */
export const MAX_LIST_PAGES = 10;

export type FetchedPage = { kind: 'page'; url: string; html: string } | { kind: 'stopped'; url: string };

const MAX_REDIRECTS = 3;

/**
 * Pobiera publiczną stronę (bez ciasteczek), przechodząc przekierowania ręcznie. Przekierowanie na inny host to zmiana
 * zachowania platformy i ma być widoczne jako błąd. `stopAt` pozwala uznać przekierowanie za wynik, a nie awarię
 * (np. na logowanie): wtedy zwracamy `stopped` z adresem docelowym.
 */
export const fetchSameHost = async (
  url: string,
  http: HttpClient,
  options: { platformName: string; stopAt?: (next: URL) => boolean },
): Promise<FetchedPage> => {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await http.get<string>(current, { text: true, followRedirects: false });
    if (response.status < 300) return { kind: 'page', url: current, html: typeof response.data === 'string' ? response.data : '' };
    if (!response.location) {
      throw new ResolverError(`${options.platformName} odpowiedział ${response.status} bez adresu przekierowania.`, { url: current, status: response.status });
    }

    const next = new URL(response.location, current);
    if (next.hostname.toLowerCase() !== new URL(current).hostname.toLowerCase()) {
      throw new ResolverError(`${options.platformName} przekierował na inny host: ${next.hostname}.`, { url: current, status: response.status });
    }
    if (options.stopAt?.(next)) return { kind: 'stopped', url: next.toString() };
    current = next.toString();
  }
  throw new ResolverError(`Zbyt wiele przekierowań na stronie: ${options.platformName}.`, { url });
};

export const hostOf = (url: string): string | null => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
};
