import { fingerprintOf, hostOf, htmlToText, uniquePaths } from './common';
import { HttpClient, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

const HOSTS = new Set(['platformazakupowa.pl', 'www.platformazakupowa.pl', 'ww.platformazakupowa.pl']);
const TRANSACTION_PATH = /^\/transakcja\/(\d+)/;
const PROFILE_PATH = /^\/pn\//;
const ORIGIN = 'https://platformazakupowa.pl';
const ANCHOR_PATTERN = /<a\b[^>]*\bhref\s*=\s*["']([^"']*\/file\/get_new\/([^"'?#/]+))[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;

/**
 * Pliki z tabeli „Załączniki do postępowania”: linki `/file/get_new/<hash>.<rozszerzenie>`.
 * Nazwę bierzemy z tekstu linku (nagłówek Content-Disposition ma zepsute polskie znaki), a gdy go brak, z hasha.
 */
export const extractFiles = (html: string): ResolvedFile[] => {
  const byId = new Map<string, ResolvedFile>();
  for (const match of html.matchAll(ANCHOR_PATTERN)) {
    const [, href, fileId, inner] = match;
    if (byId.has(fileId)) continue;
    const url = href.startsWith('http') ? href : `${ORIGIN}${href.startsWith('/') ? '' : '/'}${href}`;
    byId.set(fileId, { path: htmlToText(inner.replace(/<[^>]+>/g, '')) || fileId, url, platformFileId: fileId });
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
    const response = await http.get<string>(sourceUrl, { text: true, followRedirects: false });
    if (response.status >= 300) {
      // Obserwowane 2026-11-06: 302 na /sso/authorize?error=login_required. To blokada po stronie platformy, nie brak plików.
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
