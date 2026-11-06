import { fingerprintOf, hostOf, uniquePaths } from './common';
import { HttpClient, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

const HOST = 'bazakonkurencyjnosci.funduszeeuropejskie.gov.pl';
const ORIGIN = `https://${HOST}`;
// Adres API można podmienić w testach (jak w functions/tenders/bazakonkurencyjnosci.ts). Endpointy /api/* są nieudokumentowane i bez logowania.
const API_URL = process.env.BAZA_API_URL ?? `${ORIGIN}/api/announcements`;
const SITE_URL = `${ORIGIN}/ogloszenia`;
const ANNOUNCEMENT_PATH = /^\/ogloszenia\/(\d+)\/?$/;
/** Plik załącznika: `file.uri` ma postać `/api/files/<id>`; inne wartości odrzucamy, żeby manifest nie wskazywał obcych adresów. */
const FILE_URI = /^\/api\/files\/(\d+)$/;

interface BazaAttachment {
  name?: unknown;
  file?: { id?: unknown; name?: unknown; uri?: unknown; created_at?: unknown };
  origin?: { publication_date?: unknown };
}

const text = (value: unknown): string | null => (typeof value === 'string' && value.trim() ? value.trim() : null);

/** Data pliku jako `RRRR-MM-DDTGG:MM:SS` (Baza podaje `RRRR-MM-DD GG:MM:SS` w czasie polskim, bez strefy). */
const publishedAtOf = (attachment: BazaAttachment): string | undefined => {
  const created = text(attachment.file?.created_at);
  if (created) return created.replace(' ', 'T');
  return text(attachment.origin?.publication_date) ?? undefined;
};

/**
 * Pliki z `attachments[]` szczegółów ogłoszenia. Nazwę bierzemy z `file.name` (z rozszerzeniem), a gdy jej brak, z opisu
 * załącznika. Pomijamy wpisy bez poprawnego `file.uri`. Danych osobowych (autor pliku) nie czytamy.
 */
export const extractFiles = (attachments: unknown): ResolvedFile[] => {
  if (!Array.isArray(attachments)) return [];
  const byId = new Map<string, ResolvedFile>();
  for (const attachment of attachments as BazaAttachment[]) {
    const uri = text(attachment?.file?.uri);
    const match = uri?.match(FILE_URI);
    if (!match || byId.has(match[1])) continue;
    const publishedAt = publishedAtOf(attachment);
    byId.set(match[1], {
      path: text(attachment.file?.name) ?? text(attachment.name) ?? match[1],
      url: `${ORIGIN}${uri}`,
      platformFileId: match[1],
      ...(publishedAt ? { publishedAt } : {}),
    });
  }
  return [...byId.values()];
};

export const announcementId = (url: string): string | null => {
  try {
    return new URL(url).pathname.match(ANNOUNCEMENT_PATH)?.[1] ?? null;
  } catch {
    return null;
  }
};

export const bazaAdapter: PlatformAdapter = {
  matches: (url) => hostOf(url) === HOST,

  async resolve(url: string, http: HttpClient): Promise<ResolverResult> {
    const id = announcementId(url);
    if (!id) {
      return { status: 'UNSUPPORTED_PLATFORM', platform: 'bazakonkurencyjnosci', sourceUrl: url, note: 'Nierozpoznany format adresu Bazy Konkurencyjności.' };
    }

    const sourceUrl = `${SITE_URL}/${id}`;
    let response;
    try {
      response = await http.get<{ data?: { advertisement?: { attachments?: unknown } } }>(`${API_URL}/${id}`);
    } catch (error) {
      // Ogłoszenie wycofane z Bazy: nie ma czego sprawdzać, ponowienie niczego nie zmieni
      if (error instanceof ResolverError && error.detail?.status === 404) {
        return { status: 'NO_SOURCE_URL', platform: 'bazakonkurencyjnosci', sourceUrl, note: 'Ogłoszenia nie ma już w Bazie Konkurencyjności.' };
      }
      throw error;
    }

    const advertisement = response.data?.data?.advertisement;
    if (!advertisement) {
      // Zmieniony format odpowiedzi to awaria do zauważenia (stan `error`), a nie "brak dokumentów"
      throw new ResolverError('Baza Konkurencyjności zwróciła odpowiedź bez ogłoszenia.', { url: `${API_URL}/${id}`, status: response.status });
    }

    const files = extractFiles(advertisement.attachments);
    if (files.length === 0) {
      return { status: 'NO_DOCUMENTS_YET', platform: 'bazakonkurencyjnosci', sourceUrl, note: 'Ogłoszenie nie ma jeszcze załączników.' };
    }
    if (files.length > MAX_FILES) {
      throw new ResolverError(`Zbyt wiele plików w ogłoszeniu (${files.length}, limit ${MAX_FILES}).`);
    }
    const unique = uniquePaths(files);
    return { status: 'RESOLVED', platform: 'bazakonkurencyjnosci', sourceUrl, files: unique, excluded: [], fingerprint: fingerprintOf('bazakonkurencyjnosci', unique) };
  },
};
