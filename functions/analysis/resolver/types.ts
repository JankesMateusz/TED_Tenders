import type { TenderSource } from '../../tenders/model';

export type Platform = 'ezamowienia' | 'platformazakupowa';

export interface ResolvedFile {
  /** Ścieżka względna dla silnika: oryginalna nazwa z platformy (nie z Content-Disposition). */
  path: string;
  url: string;
  platformFileId: string;
  publishedAt?: string;
}

export interface ExcludedFile {
  name: string;
  reason: 'deleted' | 'not-published';
}

export type ResolverStatus = 'NO_SOURCE_URL' | 'NO_DOCUMENTS_YET' | 'UNSUPPORTED_PLATFORM' | 'PROFILE_NOT_MATCHED';

export type ResolverResult =
  | {
      status: 'RESOLVED';
      platform: Platform;
      /** Strona postępowania (dla UI). */
      sourceUrl: string;
      files: ResolvedFile[];
      excluded: ExcludedFile[];
      /** sha256(platforma, posortowane platformFileId + publishedAt + path). */
      fingerprint: string;
      /** Czas publikacji ogłoszenia (ISO), jeśli platforma go podaje; do warunku spokoju (plan 3.6). */
      noticePublishedAt?: string;
    }
  | {
      status: ResolverStatus;
      sourceUrl?: string;
      note: string;
      /** Znana platforma, na której leży (jeszcze pusta) dokumentacja. */
      platform?: Platform;
      noticePublishedAt?: string;
    };

/** Dane przetargu potrzebne resolverowi (podzbiór `TenderRecord`). */
export interface TenderContext {
  source: TenderSource;
  link: string;
  documentsUrl: string | null;
}

export interface HttpResponse<T = unknown> {
  status: number;
  data: T;
  /** Nagłówek Location przy przekierowaniu (gdy `followRedirects: false`). */
  location?: string;
}

export interface HttpRequestOptions {
  /** Odpowiedź jako tekst (HTML) zamiast JSON. */
  text?: boolean;
  /** Domyślnie true; false pozwala wykryć przekierowanie (np. na logowanie). */
  followRedirects?: boolean;
}

/** Wstrzykiwany klient HTTP: w produkcji `requestWithRetry`, w testach atrapa na zapisanych odpowiedziach. */
export interface HttpClient {
  get<T = unknown>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
}

/** Błąd sieci lub nieoczekiwana odpowiedź platformy: przejściowy, mapowany na `RESOLVER_ERROR`. */
export class ResolverError extends Error {
  constructor(
    message: string,
    readonly detail?: { url?: string; status?: number },
  ) {
    super(message);
    this.name = 'ResolverError';
  }
}

export interface PlatformAdapter {
  matches(url: string): boolean;
  resolve(url: string, http: HttpClient): Promise<ResolverResult>;
}

/** Maksymalna liczba plików w manifeście (ochrona przed błędem parsowania i nadmiernymi paczkami). */
export const MAX_FILES = 200;
