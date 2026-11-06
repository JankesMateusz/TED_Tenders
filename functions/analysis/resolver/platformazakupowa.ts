import { fingerprintOf, hostOf, htmlToText, uniquePaths } from './common';
import { HttpClient, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

const HOSTS = new Set(['platformazakupowa.pl', 'www.platformazakupowa.pl', 'ww.platformazakupowa.pl']);
const TRANSACTION_PATH = /^\/transakcja\/(\d+)/;
const PROFILE_PATH = /^\/pn\//;
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

export const platformazakupowaAdapter: PlatformAdapter = {
  matches: (url) => HOSTS.has(hostOf(url) ?? ''),

  async resolve(url: string, http: HttpClient): Promise<ResolverResult> {
    const path = pathOf(url) ?? '';
    if (PROFILE_PATH.test(path)) {
      return {
        status: 'PROFILE_NOT_MATCHED',
        platform: 'platformazakupowa',
        sourceUrl: url,
        note: 'Adres prowadzi do profilu zamawiającego, a nie do konkretnego postępowania.',
      };
    }
    const transaction = path.match(TRANSACTION_PATH);
    if (!transaction) {
      return { status: 'UNSUPPORTED_PLATFORM', platform: 'platformazakupowa', sourceUrl: url, note: 'Nierozpoznany format adresu platformazakupowa.pl.' };
    }

    const sourceUrl = `${ORIGIN}/transakcja/${transaction[1]}`;
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
  },
};
