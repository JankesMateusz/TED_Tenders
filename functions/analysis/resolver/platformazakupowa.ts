import { fingerprintOf, hostOf, htmlToText, matchProceeding, MAX_LIST_PAGES, ProceedingRow, uniquePaths } from './common';
import { HttpClient, MatchHints, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

const HOSTS = new Set(['platformazakupowa.pl', 'www.platformazakupowa.pl', 'ww.platformazakupowa.pl']);
const TRANSACTION_PATH = /^\/transakcja\/(\d+)/;
const PROFILE_PATH = /^\/pn\/([^/]+)/;
const ORIGIN = 'https://platformazakupowa.pl';
const ROW_PATTERN = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
const NAME_CELL_PATTERN = /<td[^>]*text-left[^>]*>([\s\S]*?)<\/td>/i;
const LINK_PATTERN = /href\s*=\s*["']([^"']*\/file\/get_new\/([^"'?#/]+))["']/i;
const PUBLISHED_PATTERN = /(\d{4}-\d{2}-\d{2})\s*(?:<[^>]*>\s*)*(\d{2}:\d{2}(?::\d{2})?)/;

/** Adres pliku z href (na stronie bywa względny wobec protokołu: `//platformazakupowa.pl/file/...`). */
const absoluteUrl = (href: string): string =>
  href.startsWith('//') ? `https:${href}` : /^https?:\/\//.test(href) ? href : `${ORIGIN}${href.startsWith('/') ? '' : '/'}${href}`;

/**
 * Pliki z tabeli „Załączniki do postępowania”. Wiersz ma nazwę pliku (komórka `text-left`), datę i godzinę
 * (czas polski, bez strefy; zapisujemy jako `RRRR-MM-DDTGG:MM:SS`) oraz link `/file/get_new/<hash>.<rozszerzenie>`.
 * Nazwę bierzemy z tabeli, bo nagłówek Content-Disposition ma zepsute polskie znaki, a hash nic nie mówi silnikowi.
 */
export const extractFiles = (html: string): ResolvedFile[] => {
  const byId = new Map<string, ResolvedFile>();
  for (const [, row] of html.matchAll(ROW_PATTERN)) {
    const link = row.match(LINK_PATTERN);
    if (!link || byId.has(link[2])) continue;
    const name = htmlToText((row.match(NAME_CELL_PATTERN)?.[1] ?? '').replace(/<[^>]+>/g, ''));
    const published = row.replace(NAME_CELL_PATTERN, '').match(PUBLISHED_PATTERN);
    byId.set(link[2], {
      path: name || link[2],
      url: absoluteUrl(link[1]),
      platformFileId: link[2],
      ...(published ? { publishedAt: `${published[1]}T${published[2].length === 5 ? `${published[2]}:00` : published[2]}` } : {}),
    });
  }
  return [...byId.values()];
};

const pathOf = (url: string): string | null => {
  try {
    return new URL(url).pathname;
  } catch {
    return null;
  }
};

const TRANSACTION_LINK_PATTERN = /href\s*=\s*["'][^"']*\/transakcja\/(\d+)/i;
const CELL_PATTERN = /<td[^>]*>([\s\S]*?)<\/td>/gi;
/** Początek panelu zakładki: pierwszy to „Do terminu składania” (trwające), kolejne ładują się osobno skryptem. */
const TAB_PANE_PATTERN = /<div[^>]*class\s*=\s*["'][^"']*\btab-pane\b/gi;

/**
 * Trwające postępowania z tabeli `/pn/<profil>/proceedings` (kolumny: ID, Nazwa, Prowadzący, Data Zakończenia, …).
 * Bierzemy tylko pierwszy panel zakładek; wiersz poznajemy po linku `/transakcja/<id>`, nazwa to druga komórka.
 */
export const extractProceedings = (html: string): ProceedingRow[] => {
  const panes = [...html.matchAll(TAB_PANE_PATTERN)].map((match) => match.index ?? 0);
  const firstPane = panes.length > 1 ? html.slice(panes[0], panes[1]) : panes.length === 1 ? html.slice(panes[0]) : html;

  const byId = new Map<string, ProceedingRow>();
  for (const [, row] of firstPane.matchAll(ROW_PATTERN)) {
    const id = row.match(TRANSACTION_LINK_PATTERN)?.[1];
    if (!id || byId.has(id)) continue;
    const cells = [...row.matchAll(CELL_PATTERN)].map((cell) => htmlToText(cell[1]));
    byId.set(id, { id, name: cells[1] ?? htmlToText(row) });
  }
  return [...byId.values()];
};

/** Numer ostatniej strony listy z paginacji (`?page=N`); 1, gdy paginacji nie ma. */
export const lastListPage = (html: string): number =>
  Math.max(1, ...[...html.matchAll(/[?&;]page=(\d+)/g)].map((match) => Number(match[1])));

const LIST_PAGE_QUERY = 'tab=active&query=&sort-field=endsAt&sort-type=DESC';

const resolveTransaction = async (transactionId: string, http: HttpClient): Promise<ResolverResult> => {
  const sourceUrl = `${ORIGIN}/transakcja/${transactionId}`;
  const response = await http.get<string>(sourceUrl, { text: true, session: true });
  if (response.status >= 300) {
    // Nie powinno się zdarzyć po przejściu łańcucha SSO z ciasteczkami; gdyby, to platforma blokuje dostęp, a nie brak plików.
    throw new ResolverError(
      `platformazakupowa.pl przekierowała zapytanie (${response.status}${response.location ? ` → ${response.location}` : ''}) zamiast zwrócić stronę postępowania.`,
      { url: sourceUrl, status: response.status },
    );
  }

  const files = extractFiles(typeof response.data === 'string' ? response.data : '');
  if (files.length === 0) {
    return { status: 'NO_DOCUMENTS_YET', platform: 'platformazakupowa', sourceUrl, note: 'Na stronie postępowania nie ma jeszcze załączników.' };
  }
  if (files.length > MAX_FILES) {
    throw new ResolverError(`Zbyt wiele plików w postępowaniu (${files.length}, limit ${MAX_FILES}).`);
  }
  const unique = uniquePaths(files);
  return { status: 'RESOLVED', platform: 'platformazakupowa', sourceUrl, files: unique, excluded: [], fingerprint: fingerprintOf('platformazakupowa', unique) };
};

/** Adres profilu zamawiającego: szukamy na liście jego trwających postępowań dokładnie jednego pasującego do przetargu. */
const resolveProfile = async (url: string, profile: string, http: HttpClient, hints?: MatchHints): Promise<ResolverResult> => {
  const notMatched = (note: string): ResolverResult => ({ status: 'PROFILE_NOT_MATCHED', platform: 'platformazakupowa', sourceUrl: url, note });
  // Bez numeru sprawy i tytułu nie ma czego dopasować, więc oszczędzamy zapytanie
  if (!hints?.referenceNumber && !hints?.title) return notMatched('Adres prowadzi do profilu zamawiającego, a nie do konkretnego postępowania.');

  const listUrl = `${ORIGIN}/pn/${profile}/proceedings`;
  const response = await http.get<string>(listUrl, { text: true, session: true });
  if (response.status >= 300) {
    throw new ResolverError(
      `platformazakupowa.pl przekierowała zapytanie (${response.status}${response.location ? ` → ${response.location}` : ''}) zamiast zwrócić listę postępowań.`,
      { url: listUrl, status: response.status },
    );
  }

  const firstPage = typeof response.data === 'string' ? response.data : '';
  const rows = new Map(extractProceedings(firstPage).map((row) => [row.id, row]));
  // Lista ma po 20 postępowań na stronę, a więksi zamawiający mają ich więcej: czytamy kolejne strony
  const last = lastListPage(firstPage);
  const pagesToRead = Math.min(last, MAX_LIST_PAGES);
  for (let page = 2; page <= pagesToRead; page++) {
    const next = await http.get<string>(`${listUrl}?page=${page}&${LIST_PAGE_QUERY}`, { text: true, session: true });
    if (next.status >= 300) {
      throw new ResolverError(`platformazakupowa.pl odpowiedziała ${next.status} na stronę ${page} listy postępowań.`, { url: listUrl, status: next.status });
    }
    for (const row of extractProceedings(typeof next.data === 'string' ? next.data : '')) rows.set(row.id, row);
  }

  // Lista ucięta limitem stron jest niepełna, więc po samym tytule nie dopasowujemy
  const match = matchProceeding([...rows.values()], hints, last <= pagesToRead);
  if (!match) return notMatched('Na liście trwających postępowań zamawiającego nie ma dokładnie jednego postępowania pasującego do przetargu.');
  return resolveTransaction(match.id, http);
};

export const platformazakupowaAdapter: PlatformAdapter = {
  matches: (url) => HOSTS.has(hostOf(url) ?? ''),

  async resolve(url: string, http: HttpClient, hints?: MatchHints): Promise<ResolverResult> {
    const path = pathOf(url) ?? '';
    const profile = path.match(PROFILE_PATH)?.[1];
    if (profile) return resolveProfile(url, profile, http, hints);

    const transaction = path.match(TRANSACTION_PATH);
    if (!transaction) {
      return { status: 'UNSUPPORTED_PLATFORM', platform: 'platformazakupowa', sourceUrl: url, note: 'Nierozpoznany format adresu platformazakupowa.pl.' };
    }
    return resolveTransaction(transaction[1], http);
  },
};
