import { fetchSameHost, fingerprintOf, hostOf, uniquePaths } from './common';
import { ExcludedFile, HttpClient, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

/**
 * SIDAS PZP (Madkom): `zamowienia.sidaspzp.pl/zamowienia/<uuid>/pliki`. Strona jest publiczna (bez logowania), a lista
 * plików siedzi w JSON-ie `__NEXT_DATA__` (Next.js). Pliki tylko listujemy: adresu pobierania nie znamy i nie zapisujemy,
 * więc `ResolvedFile.url` to adres strony z kotwicą (`#file-<id>`). `robots.txt` platformy nie istnieje (404).
 */
const HOST = 'zamowienia.sidaspzp.pl';
const ORDER_PATH = /^\/zamowienia\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\/|$)/i;
const NEXT_DATA = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/;

interface RawFile {
  id?: unknown;
  name?: unknown;
  createdAt?: unknown;
}

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');
const asList = (value: unknown): Record<string, unknown>[] => (Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') : []);

/** Pliki ze strony `/pliki`: SWZ (termsOfReferences) i załączniki; usunięte lub nieaktywne trafiają do `excluded`. */
export const extractFiles = (html: string, pageUrl: string): { files: ResolvedFile[]; excluded: ExcludedFile[] } => {
  const raw = html.match(NEXT_DATA)?.[1];
  let pageProps: Record<string, unknown> | undefined;
  try {
    pageProps = raw ? (JSON.parse(raw)?.props?.pageProps as Record<string, unknown> | undefined) : undefined;
  } catch {
    pageProps = undefined;
  }
  if (!pageProps || !('attachments' in pageProps)) {
    throw new ResolverError('Strona SIDAS PZP ma nieoczekiwany układ (brak danych o załącznikach).', { url: pageUrl });
  }

  const base = pageUrl.split('#')[0];
  const files: ResolvedFile[] = [];
  const excluded: ExcludedFile[] = [];
  const seen = new Set<string>();

  const add = (file: RawFile | undefined, active: boolean, publishedAt: string) => {
    const id = asString(file?.id);
    const name = asString(file?.name);
    if (!id || seen.has(id)) return;
    seen.add(id);
    if (!active) {
      excluded.push({ name: name || id, reason: 'deleted' });
      return;
    }
    files.push({ path: name || id, url: `${base}#file-${id}`, platformFileId: id, ...(publishedAt ? { publishedAt } : {}) });
  };

  for (const item of asList(pageProps.termsOfReferences)) {
    const meta = (item.termsOfReference ?? {}) as Record<string, unknown>;
    const active = !meta.isDeleted && !meta.isInactivated && !meta.isPermanentlyDeleted;
    add(item.file as RawFile, active, asString(meta.createdAt));
  }
  for (const item of asList(pageProps.attachments)) {
    const meta = (item.attachment ?? {}) as Record<string, unknown>;
    const active = meta.status === 'active' && !meta.removedAt && !meta.inactivatedAt;
    add(item.file as RawFile, active, asString(meta.addedAt));
  }
  return { files, excluded };
};

export const sidasPzpAdapter: PlatformAdapter = {
  matches: (url) => hostOf(url) === HOST,

  async resolve(url: string, http: HttpClient): Promise<ResolverResult> {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return { status: 'UNSUPPORTED_PLATFORM', platform: 'sidaspzp', sourceUrl: url, note: 'Nierozpoznany adres SIDAS PZP.' };
    }
    const order = parsed.pathname.match(ORDER_PATH);
    if (!order) {
      // Strona główna zamawiającego i inne adresy: listy postępowań nie znamy, więc niczego nie zgadujemy
      return { status: 'PROFILE_NOT_MATCHED', platform: 'sidaspzp', sourceUrl: url, note: 'Adres nie prowadzi do konkretnego postępowania w SIDAS PZP.' };
    }

    const filesUrl = `${parsed.origin}/zamowienia/${order[1].toLowerCase()}/pliki`;
    const page = await fetchSameHost(filesUrl, http, { platformName: 'SIDAS PZP' });
    const { files, excluded } = extractFiles(page.kind === 'page' ? page.html : '', filesUrl);
    if (files.length === 0) {
      return { status: 'NO_DOCUMENTS_YET', platform: 'sidaspzp', sourceUrl: filesUrl, note: 'Na stronie postępowania nie ma jeszcze plików.' };
    }
    if (files.length > MAX_FILES) {
      throw new ResolverError(`Zbyt wiele plików w postępowaniu (${files.length}, limit ${MAX_FILES}).`);
    }
    const unique = uniquePaths(files);
    return { status: 'RESOLVED', platform: 'sidaspzp', sourceUrl: filesUrl, files: unique, excluded, fingerprint: fingerprintOf('sidaspzp', unique) };
  },
};
