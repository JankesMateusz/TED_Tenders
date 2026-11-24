import { fetchSameHost, fingerprintOf, hostOf, htmlToText, uniquePaths } from './common';
import { HttpClient, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

/**
 * e-ProPublico (Datacomp): `e-propublico.pl/Ogloszenia/Details/<uuid>`. Strona postępowania i lista dokumentów
 * (`/Ogloszenia/DokumentyZamowienia?przetargId=<uuid>`) są publiczne, bez logowania. Adres pobrania pliku
 * (`/Dokumenty/Download/<id>`) nie ma tokenu sesji, więc trafia do `ResolvedFile.url`.
 * `robots.txt` blokuje wymienione z nazwy boty AI i dopuszcza resztę (`User-agent: *`).
 */
const HOSTS = new Set(['e-propublico.pl', 'www.e-propublico.pl']);
const GUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const DETAILS_PATH = new RegExp(`^/Ogloszenia/Details/(${GUID})/?$`, 'i');
const DOCUMENTS_PATH = /^\/Ogloszenia\/DokumentyZamowienia\/?$/i;
const GUID_ONLY = new RegExp(`^${GUID}$`, 'i');

const SECTION_SPLIT = /<h5[^>]*\bsection-header\b[^>]*>/i;
const ROW = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
const DOWNLOAD_LINK = /<a[^>]*href\s*=\s*["']([^"']*\/Dokumenty\/Download\/([0-9a-f-]+))["'][^>]*>([\s\S]*?)<\/a>/i;
const CELL = /<td[^>]*>([\s\S]*?)<\/td>/gi;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Sekcja „Ogłoszenie” zawiera samo ogłoszenie o zamówieniu (jest od razu po publikacji), a nie dokumentację. */
const NOTICE_SECTION = 'ogloszenie';

const sectionTitle = (chunk: string): string =>
  htmlToText(chunk.slice(0, chunk.search(/<\/h5>/i) === -1 ? 0 : chunk.search(/<\/h5>/i)))
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Lista pokazuje nazwę bez rozszerzenia, a rozszerzenie w osobnej kolumnie „Typ”. */
const withExtension = (name: string, extension: string): string => {
  const ext = extension.trim().replace(/^\./, '');
  return !ext || name.toLowerCase().endsWith(`.${ext.toLowerCase()}`) ? name : `${name}.${ext}`;
};

/** Pliki z sekcji dokumentacji (bez sekcji „Ogłoszenie”). Brak sekcji na stronie to zmiana układu, a nie brak plików. */
export const extractFiles = (html: string, pageUrl: string): ResolvedFile[] => {
  const [, ...sections] = html.split(SECTION_SPLIT);
  if (sections.length === 0) {
    throw new ResolverError('Strona e-ProPublico ma nieoczekiwany układ (brak sekcji dokumentów).', { url: pageUrl });
  }

  const origin = new URL(pageUrl).origin;
  const byId = new Map<string, ResolvedFile>();
  for (const section of sections) {
    if (sectionTitle(section) === NOTICE_SECTION) continue;
    for (const [, row] of section.matchAll(ROW)) {
      const link = row.match(DOWNLOAD_LINK);
      if (!link || byId.has(link[2].toLowerCase())) continue;
      const cells = [...row.matchAll(CELL)].map((cell) => htmlToText(cell[1]));
      // Kolumny: wybór, nazwa (link), typ, rozmiar, data publikacji; data bez godziny i strefy
      const date = cells.find((cell) => DATE.test(cell));
      const name = htmlToText(link[3]);
      byId.set(link[2].toLowerCase(), {
        path: withExtension(name || link[2], cells[2] ?? ''),
        url: new URL(link[1], origin).toString(),
        platformFileId: link[2].toLowerCase(),
        ...(date ? { publishedAt: `${date}T00:00:00` } : {}),
      });
    }
  }
  return [...byId.values()];
};

export const epropublicoAdapter: PlatformAdapter = {
  matches: (url) => HOSTS.has(hostOf(url) ?? ''),

  async resolve(url: string, http: HttpClient): Promise<ResolverResult> {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return { status: 'UNSUPPORTED_PLATFORM', platform: 'epropublico', sourceUrl: url, note: 'Nierozpoznany adres e-ProPublico.' };
    }

    const queryId = parsed.searchParams.get('przetargId') ?? '';
    const id = parsed.pathname.match(DETAILS_PATH)?.[1] ?? (DOCUMENTS_PATH.test(parsed.pathname) && GUID_ONLY.test(queryId) ? queryId : undefined);
    if (!id) {
      // Strona główna, lista ogłoszeń zamawiającego i inne adresy: listy postępowań nie znamy, więc niczego nie zgadujemy
      return { status: 'PROFILE_NOT_MATCHED', platform: 'epropublico', sourceUrl: url, note: 'Adres nie prowadzi do konkretnego postępowania w e-ProPublico.' };
    }

    const documentsUrl = `${parsed.origin}/Ogloszenia/DokumentyZamowienia?przetargId=${id.toLowerCase()}`;
    const page = await fetchSameHost(documentsUrl, http, { platformName: 'e-ProPublico' });
    const files = extractFiles(page.kind === 'page' ? page.html : '', documentsUrl);
    if (files.length === 0) {
      return { status: 'NO_DOCUMENTS_YET', platform: 'epropublico', sourceUrl: documentsUrl, note: 'Na stronie postępowania nie ma jeszcze dokumentów (poza ogłoszeniem).' };
    }
    if (files.length > MAX_FILES) {
      throw new ResolverError(`Zbyt wiele plików w postępowaniu (${files.length}, limit ${MAX_FILES}).`);
    }
    const unique = uniquePaths(files);
    return { status: 'RESOLVED', platform: 'epropublico', sourceUrl: documentsUrl, files: unique, excluded: [], fingerprint: fingerprintOf('epropublico', unique) };
  },
};
