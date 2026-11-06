import { normalizeWebAddress } from '../../tenders/webAddress';
import { fingerprintOf, hostOf, htmlToText, uniquePaths } from './common';
import { ExcludedFile, HttpClient, MAX_FILES, PlatformAdapter, ResolvedFile, ResolverError, ResolverResult } from './types';

// Adres można podmienić w testach (functions/.env.demo-tenders).
const BASE = (process.env.EZAMOWIENIA_BASE_URL ?? 'https://ezamowienia.gov.pl').replace(/\/$/, '');
const TENDER_ID_PATTERN = /ocds-\d+-[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/i;
const NOTICE_LINK_PATTERN = /\/notice-details\/id\/([0-9a-f-]+)/i;
const SELF_HOSTS = new Set(['ezamowienia.gov.pl', 'www.ezamowienia.gov.pl']);

interface NoticeDetails {
  tenderId?: string;
  publicationDate?: string;
}

interface TenderDocument {
  objectId: string;
  name?: string;
  fileName?: string;
  tenderDocumentState?: string;
  publishedDate?: string | null;
  deleteDate?: string | null;
}

export const noticeObjectId = (link: string): string | null => link.match(NOTICE_LINK_PATTERN)?.[1] ?? null;
export const tenderIdFromUrl = (url: string): string | null => url.match(TENDER_ID_PATTERN)?.[0] ?? null;
export const sourceUrlFor = (tenderId: string): string => `${BASE}/mp-client/search/list/${tenderId}`;

/** Adres z pola 3.1 „Adres strony internetowej prowadzonego postępowania” w HTML ogłoszenia BZP. */
export const extractProceedingUrl = (html: string): string | null => {
  const text = htmlToText(html);
  const match = text.match(/3\.1\.\)?\s*Adres strony internetowej prowadzonego post[ęe]powania\s*(\S+)/i);
  // Pusta sekcja zostawia kolejne pole („3.2.)"), które normalizator odrzuca
  return match ? normalizeWebAddress(match[1]) : null;
};

/** Lista dokumentów postępowania; pusta lista (jeszcze nic nie opublikowano) to nie błąd. */
export const resolveTenderDocuments = async (
  tenderId: string,
  http: HttpClient,
  noticePublishedAt?: string,
): Promise<ResolverResult> => {
  const response = await http.get<TenderDocument[]>(`${BASE}/mp-readmodels/api/Search/GetTenderDocuments?tenderId=${encodeURIComponent(tenderId)}`);
  const documents = Array.isArray(response.data) ? response.data : [];
  const sourceUrl = sourceUrlFor(tenderId);

  const files: ResolvedFile[] = [];
  const excluded: ExcludedFile[] = [];
  for (const document of documents) {
    const name = document.fileName || document.name || document.objectId;
    if (document.deleteDate) {
      excluded.push({ name, reason: 'deleted' });
    } else if (document.tenderDocumentState !== 'Published') {
      excluded.push({ name, reason: 'not-published' });
    } else {
      files.push({
        path: name,
        url: `${BASE}/mp-readmodels/api/Tender/DownloadDocument/${tenderId}/${document.objectId}`,
        platformFileId: document.objectId,
        ...(document.publishedDate ? { publishedAt: document.publishedDate } : {}),
      });
    }
  }

  if (files.length === 0) {
    return {
      status: 'NO_DOCUMENTS_YET',
      platform: 'ezamowienia',
      sourceUrl,
      note: excluded.length
        ? 'Brak opublikowanych dokumentów (pozostałe usunięte lub niepublikowane).'
        : 'Zamawiający nie opublikował jeszcze dokumentów.',
      ...(noticePublishedAt ? { noticePublishedAt } : {}),
    };
  }
  if (files.length > MAX_FILES) {
    throw new ResolverError(`Zbyt wiele plików w postępowaniu (${files.length}, limit ${MAX_FILES}).`);
  }
  const unique = uniquePaths(files);
  return {
    status: 'RESOLVED',
    platform: 'ezamowienia',
    sourceUrl,
    files: unique,
    excluded,
    fingerprint: fingerprintOf('ezamowienia', unique),
    ...(noticePublishedAt ? { noticePublishedAt } : {}),
  };
};

/** Przetarg z eZamówień (`objectId` z linku): metadane → `tenderId` → lista dokumentów. */
export const resolveNotice = async (
  objectId: string,
  http: HttpClient,
  /** Wywoływane, gdy lista jest pusta: sprawdza pole 3.1 (dokumentacja może leżeć na innej platformie). */
  onEmpty: (html: string, empty: ResolverResult) => Promise<ResolverResult>,
): Promise<ResolverResult> => {
  const details = (await http.get<NoticeDetails>(`${BASE}/mo-board/api/v1/Board/GetNoticeDetailsById?noticeId=${encodeURIComponent(objectId)}`)).data;
  if (!details?.tenderId) {
    return { status: 'NO_SOURCE_URL', note: 'eZamówienia nie zwróciły identyfikatora postępowania dla tego ogłoszenia.' };
  }
  const result = await resolveTenderDocuments(details.tenderId, http, details.publicationDate);
  if (result.status !== 'NO_DOCUMENTS_YET') return result;

  const html = (await http.get<string>(`${BASE}/mo-board/api/v1/Board/GetNoticeHtmlBodyById?noticeId=${encodeURIComponent(objectId)}`, { text: true })).data;
  return onEmpty(typeof html === 'string' ? html : '', result);
};

/** Adapter dla adresów postępowań na eZamówieniach (np. `documentsUrl` z TED). */
export const ezamowieniaAdapter: PlatformAdapter = {
  matches: (url) => SELF_HOSTS.has(hostOf(url) ?? '') && tenderIdFromUrl(url) !== null,
  resolve: (url, http) => resolveTenderDocuments(tenderIdFromUrl(url) as string, http),
};
