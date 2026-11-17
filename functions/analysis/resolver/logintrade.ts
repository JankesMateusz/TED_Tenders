import { fetchSameHost, fingerprintOf, hostOf, htmlToText, matchProceeding, ProceedingRow, uniquePaths } from './common';
import { HttpClient, MatchHints, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

/**
 * logintrade: osobna subdomena `<zamawiający>.logintrade.net`. Pliki tylko listujemy. `robots.txt` platformy zabrania
 * `/DocumentService` i `/zalaczniki/`, czyli adresów samych plików, więc nie zapisujemy ich w manifeście:
 * `ResolvedFile.url` to adres strony postępowania z kotwicą załącznika (`#attachment-<id>`).
 */
const PROCEEDING_PATH = /^\/zapytania_email,(\d+),[0-9a-f]+\.html$/i;
const LIST_PATH = '/rejestracja/ustawowe.html';

// „www” to witryna producenta platformy, a nie zamawiający
const isLogintradeHost = (host: string): boolean => host.endsWith('.logintrade.net') && host !== 'www.logintrade.net';

const ATTACHMENT = /<div[^>]*\bclass\s*=\s*["']attachment["'][^>]*\bdata-id\s*=\s*["'](\d+)["'][^>]*>([\s\S]*?)(?=<div[^>]*\bclass\s*=\s*["']attachment["']|$)/gi;
const ATTACHMENT_NAME = /class\s*=\s*["']attachment-name["'][^>]*>([\s\S]*?)<\/span>/i;
const ATTACHMENT_DATE = /class\s*=\s*["']attachment-date["'][^>]*>\s*(\d{2})\.(\d{2})\.(\d{4})\s*-\s*(\d{2}:\d{2}:\d{2})/i;
const ROW = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
const ROW_LINK = /<td[^>]*class\s*=\s*["'][^"']*\bprzetarg\b[^"']*["'][^>]*>\s*<a[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i;
const ROW_REFERENCE = /<td[^>]*przetarg_znak[^>]*>([\s\S]*?)<\/td>/i;
const NEXT_PAGE = /[?&]page=2\b/;

/** Załączniki z sekcji „Załączniki” strony postępowania; czas publikacji jest polski, bez strefy (`RRRR-MM-DDTGG:MM:SS`). */
export const extractFiles = (html: string, pageUrl: string): ResolvedFile[] => {
  const base = pageUrl.split('#')[0];
  // Tylko lista załączników postępowania; wcześniej na stronie mogą być inne elementy o podobnych klasach
  const start = html.indexOf('id="attachmentList"');
  const byId = new Map<string, ResolvedFile>();
  for (const [, id, block] of (start >= 0 ? html.slice(start) : '').matchAll(ATTACHMENT)) {
    if (byId.has(id)) continue;
    const name = htmlToText(block.match(ATTACHMENT_NAME)?.[1] ?? '');
    const date = block.match(ATTACHMENT_DATE);
    byId.set(id, {
      path: name || id,
      url: `${base}#attachment-${id}`,
      platformFileId: id,
      ...(date ? { publishedAt: `${date[3]}-${date[2]}-${date[1]}T${date[4]}` } : {}),
    });
  }
  return [...byId.values()];
};

/**
 * Wiersze listy postępowań (`/rejestracja/ustawowe.html`): `id` to adres postępowania, a nazwa to znak sprawy z tytułem.
 * `complete` = lista nie ma kolejnych stron (`?page=N`).
 */
export const extractList = (html: string): { rows: ProceedingRow[]; complete: boolean } => {
  const rows: ProceedingRow[] = [];
  for (const [, row] of html.matchAll(ROW)) {
    const link = row.match(ROW_LINK);
    if (!link) continue;
    const reference = htmlToText(row.match(ROW_REFERENCE)?.[1] ?? '');
    rows.push({ id: link[1], name: `${reference} ${htmlToText(link[2])}`.trim() });
  }
  return { rows, complete: !NEXT_PAGE.test(html) };
};

const fetchPage = (url: string, http: HttpClient) => fetchSameHost(url, http, { platformName: 'logintrade' });

const resolveProceeding = async (url: string, http: HttpClient): Promise<ResolverResult> => {
  const page = await fetchPage(url, http);
  // Bez `stopAt` strona zawsze jest typu `page`
  const html = page.kind === 'page' ? page.html : '';
  const files = extractFiles(html, url);
  if (files.length === 0) {
    return { status: 'NO_DOCUMENTS_YET', platform: 'logintrade', sourceUrl: url, note: 'Na stronie postępowania nie ma jeszcze załączników.' };
  }
  if (files.length > MAX_FILES) {
    throw new ResolverError(`Zbyt wiele plików w postępowaniu (${files.length}, limit ${MAX_FILES}).`);
  }
  const unique = uniquePaths(files);
  return { status: 'RESOLVED', platform: 'logintrade', sourceUrl: url, files: unique, excluded: [], fingerprint: fingerprintOf('logintrade', unique) };
};

/** Adres ogólny (strona główna, lista, regulamin): z listy postępowań zamawiającego wybieramy pasujące do przetargu. */
const resolveFromList = async (url: string, http: HttpClient, hints?: MatchHints): Promise<ResolverResult> => {
  const notMatched = (note: string): ResolverResult => ({ status: 'PROFILE_NOT_MATCHED', platform: 'logintrade', sourceUrl: url, note });
  // Bez numeru sprawy i tytułu nie ma czego dopasować, więc oszczędzamy zapytanie
  if (!hints?.referenceNumber && !hints?.title) return notMatched('Adres prowadzi do strony zamawiającego, a nie do konkretnego postępowania.');

  const origin = new URL(url).origin;
  const list = await fetchPage(`${origin}${LIST_PATH}`, http);
  const { rows, complete } = extractList(list.kind === 'page' ? list.html : '');
  const match = matchProceeding(rows, hints, complete);
  if (!match) return notMatched('Na liście postępowań zamawiającego nie ma dokładnie jednego postępowania pasującego do przetargu.');

  // Adres z cudzej strony trzymamy w ryzach: tylko ten sam host i postać adresu postępowania
  const target = new URL(match.id, origin);
  if (target.origin !== origin || !PROCEEDING_PATH.test(target.pathname)) {
    return notMatched('Odnośnik do postępowania na liście ma nieoczekiwaną postać.');
  }
  return resolveProceeding(target.toString(), http);
};

export const logintradeAdapter: PlatformAdapter = {
  matches: (url) => isLogintradeHost(hostOf(url) ?? ''),

  async resolve(url: string, http: HttpClient, hints?: MatchHints): Promise<ResolverResult> {
    let path: string;
    try {
      path = new URL(url).pathname;
    } catch {
      return { status: 'UNSUPPORTED_PLATFORM', platform: 'logintrade', sourceUrl: url, note: 'Nierozpoznany adres logintrade.' };
    }
    if (PROCEEDING_PATH.test(path)) return resolveProceeding(url, http);
    return resolveFromList(url, http, hints);
  },
};
