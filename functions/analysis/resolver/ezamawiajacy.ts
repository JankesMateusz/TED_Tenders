import { fetchSameHost, FetchedPage, fingerprintOf, hostOf, htmlToText, matchProceeding, ProceedingRow, uniquePaths } from './common';
import { HttpClient, MatchHints, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

/**
 * ezamawiający (Marketplanet): osobna subdomena na zamawiającego plus `zamowienia.um.warszawa.pl` (ten sam silnik).
 * Pliki tylko listujemy. Adresy pobrania mają token związany z sesją strony, więc nie nadają się do zapisania;
 * w `ResolvedFile.url` jest adres strony postępowania z kotwicą wiersza (`#_<id>`).
 */
const WARSAW_HOST = 'zamowienia.um.warszawa.pl';

// „www” to witryna producenta platformy, a nie zamawiający
const isEzamawiajacyHost = (host: string): boolean => (host.endsWith('.ezamawiajacy.pl') && host !== 'www.ezamawiajacy.pl') || host === WARSAW_HOST;

/** `/pn/<klient>/demand/<id>/notice/public/details` (przekierowuje) i adres docelowy `/pn/<klient>/demand/notice/public/<idOgłoszenia>/details`. */
const DETAIL_PATHS = [/^\/pn\/[^/]+\/demand\/\d+\/notice\/public\/details\/?$/, /^\/pn\/[^/]+\/demand\/notice\/public\/\d+\/details\/?$/];
const CLIENT_PATH = /^\/pn\/([^/]+)/;
const HOME_CLIENT_LINK = /\/pn\/([^/"'?]+)\/demand\/notice\/publicpzp\/current\/list/i;

const FILE_ROW = /<tr([^>]*\bfileDataRow\b[^>]*)>([\s\S]*?)<\/tr>/gi;
const DATA_ROW = /<tr([^>]*\bdataRow\b[^>]*)>([\s\S]*?)<\/tr>/gi;
// Wiersz „Ogłoszenie” / „Dane kontaktowe” ma id `_-2`, więc `\d+` go odrzuca: to podgląd ogłoszenia, nie plik
const FILE_ID = /\bid\s*=\s*["']_(\d+)["']/i;
const ROW_ID = /\bid\s*=\s*["'](\d+)["']/i;
const NAME_CELL = /<td[^>]*class\s*=\s*["'][^"']*\btext\b[^"']*\blong\b[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi;
const CELL = /<td[^>]*>([\s\S]*?)<\/td>/gi;
const PUBLISHED = /<td[^>]*date-time[^>]*>\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/i;
const LIST_COUNTER = /Pozycje\s+\d+-(\d+)\s+z\s+(\d+)/i;

/** Pliki z tabeli „Dokumenty zamówienia”; czas publikacji jest polski, bez strefy (`RRRR-MM-DDTGG:MM:00`). */
export const extractFiles = (html: string, pageUrl: string): ResolvedFile[] => {
  const base = pageUrl.split('#')[0];
  const byId = new Map<string, ResolvedFile>();
  for (const [, attributes, row] of html.matchAll(FILE_ROW)) {
    const id = attributes.match(FILE_ID)?.[1];
    if (!id || byId.has(id)) continue;
    // Pierwsza komórka „text long” to nazwa, druga (zwykle pusta) to opis
    const name = [...row.matchAll(NAME_CELL)].map((cell) => htmlToText(cell[1])).find(Boolean);
    const published = row.match(PUBLISHED);
    byId.set(id, {
      path: name || id,
      url: `${base}#_${id}`,
      platformFileId: id,
      ...(published ? { publishedAt: `${published[1]}T${published[2]}:00` } : {}),
    });
  }
  return [...byId.values()];
};

/** Wiersze listy postępowań: identyfikator ogłoszenia, a jako nazwa numer sprawy z opisem. `complete` = lista nie ma kolejnych stron. */
export const extractList = (html: string): { rows: ProceedingRow[]; complete: boolean } => {
  const rows: ProceedingRow[] = [];
  for (const [, attributes, row] of html.matchAll(DATA_ROW)) {
    const id = attributes.match(ROW_ID)?.[1];
    if (!id) continue;
    const cells = [...row.matchAll(CELL)].map((cell) => htmlToText(cell[1]));
    rows.push({ id, name: `${cells[0] ?? ''} ${cells[1] ?? ''}`.trim() });
  }
  const counter = htmlToText(html).match(LIST_COUNTER);
  // Bez licznika nie wiemy, że są kolejne strony
  return { rows, complete: !counter || Number(counter[2]) <= rows.length };
};

/** Strony są publiczne (bez ciasteczek); przekierowanie na logowanie oznacza, że postępowania nie ma publicznie (np. zakończone), a to nie awaria. */
const fetchPage = (url: string, http: HttpClient): Promise<FetchedPage> =>
  fetchSameHost(url, http, { platformName: 'ezamawiający', stopAt: (next) => next.pathname.startsWith('/app/login') });

const resolveDetail = async (url: string, http: HttpClient): Promise<ResolverResult> => {
  const page = await fetchPage(url, http);
  if (page.kind === 'stopped') {
    return {
      status: 'UNSUPPORTED_PLATFORM',
      platform: 'ezamawiajacy',
      sourceUrl: url,
      note: 'Strona postępowania przekierowuje na logowanie (np. postępowanie zakończone): dokumentacja nie jest publicznie dostępna.',
    };
  }

  const files = extractFiles(page.html, page.url);
  if (files.length === 0) {
    return { status: 'NO_DOCUMENTS_YET', platform: 'ezamawiajacy', sourceUrl: page.url, note: 'Na stronie postępowania nie ma jeszcze dokumentów.' };
  }
  if (files.length > MAX_FILES) {
    throw new ResolverError(`Zbyt wiele plików w postępowaniu (${files.length}, limit ${MAX_FILES}).`);
  }
  const unique = uniquePaths(files);
  return { status: 'RESOLVED', platform: 'ezamawiajacy', sourceUrl: page.url, files: unique, excluded: [], fingerprint: fingerprintOf('ezamawiajacy', unique) };
};

/** Adres ogólny (strona główna, panel, aplikacja): z listy trwających postępowań zamawiającego wybieramy pasujące do przetargu. */
const resolveFromList = async (url: string, http: HttpClient, hints?: MatchHints): Promise<ResolverResult> => {
  const notMatched = (note: string): ResolverResult => ({ status: 'PROFILE_NOT_MATCHED', platform: 'ezamawiajacy', sourceUrl: url, note });
  // Bez numeru sprawy i tytułu nie ma czego dopasować, więc oszczędzamy zapytania
  if (!hints?.referenceNumber && !hints?.title) return notMatched('Adres prowadzi do strony zamawiającego, a nie do konkretnego postępowania.');

  const origin = new URL(url).origin;
  let client = new URL(url).pathname.match(CLIENT_PATH)?.[1];
  if (!client) {
    // Identyfikator zamawiającego w ścieżkach `/pn/<klient>/…` jest tylko w odnośnikach strony głównej
    const home = await fetchPage(`${origin}/servlet/HomeServlet`, http);
    client = home.kind === 'page' ? home.html.match(HOME_CLIENT_LINK)?.[1] : undefined;
    if (!client) return notMatched('Na stronie głównej zamawiającego nie ma odnośnika do listy postępowań.');
  }

  const list = await fetchPage(`${origin}/pn/${client}/demand/notice/publicpzp/current/list`, http);
  if (list.kind !== 'page') return notMatched('Lista postępowań zamawiającego wymaga logowania.');
  const { rows, complete } = extractList(list.html);
  const match = matchProceeding(rows, hints, complete);
  if (!match) return notMatched('Na liście trwających postępowań zamawiającego nie ma dokładnie jednego postępowania pasującego do przetargu.');
  return resolveDetail(`${origin}/pn/${client}/demand/notice/public/${match.id}/details`, http);
};

export const ezamawiajacyAdapter: PlatformAdapter = {
  matches: (url) => isEzamawiajacyHost(hostOf(url) ?? ''),

  async resolve(url: string, http: HttpClient, hints?: MatchHints): Promise<ResolverResult> {
    let path: string;
    try {
      path = new URL(url).pathname;
    } catch {
      return { status: 'UNSUPPORTED_PLATFORM', platform: 'ezamawiajacy', sourceUrl: url, note: 'Nierozpoznany adres ezamawiającego.' };
    }
    if (DETAIL_PATHS.some((pattern) => pattern.test(path))) return resolveDetail(url, http);
    return resolveFromList(url, http, hints);
  },
};
