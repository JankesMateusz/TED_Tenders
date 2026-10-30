import { dayFromTedDate } from './dates';
import { requestWithRetry } from './http';
import { OrderType, SourceResult, TenderRecord } from './model';

// Adres można podmienić w testach (functions/.env.demo-tenders). Wyszukiwanie ogłoszeń jest w TED publiczne, bez klucza API.
const TED_API_URL = process.env.TED_API_URL ?? 'https://api.ted.europa.eu/v3/notices/search';
const PAGE_SIZE = 250;
const MAX_PAGES = 40;
const REQUEST_TIMEOUT_MS = 30000;

const FIELDS = [
  'notice-title',
  'classification-cpv',
  'publication-date',
  'publication-number',
  'buyer-city',
  'organisation-name-buyer',
  'authority-main-activity',
  'contract-nature',
  'change-notice-version-identifier',
  'deadline-receipt-tender-date-lot',
  'document-url-lot',
];

/** Zapytanie o ogłoszenia o udzielenie zamówienia z Polski opublikowane danego dnia (YYYY-MM-DD). */
const buildQuery = (day: string): string =>
  `buyer-country=POL AND publication-date=${day.replace(/-/g, '')} AND classification-cpv=teeq AND notice-type=cn-standard`;

const extractCountry = (title: string | undefined): string =>
  title?.split('–')[0].trim() || 'Nieznany kraj';

const extractActivity = (field: unknown): string | null => {
  const value = Array.isArray(field) ? field[0] : field;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const ORDER_TYPE_BY_NATURE: Record<string, OrderType> = {
  supplies: 'Delivery',
  services: 'Services',
  works: 'Works',
};
// Kolejność = pierwszeństwo: aplikacja dotyczy sprzętu IT, więc dostawa wygrywa z usługą i robotami
const ORDER_TYPE_PRECEDENCE: OrderType[] = ['Delivery', 'Services', 'Works'];

/**
 * `contract-nature` to tablica z rodzajem zamówienia każdego lotu, a jedno ogłoszenie może mieć loty
 * różnych rodzajów. Zwraca rodzaj o najwyższym pierwszeństwie albo null, gdy pole jest puste lub nieznane.
 */
const extractOrderType = (field: unknown): OrderType | null => {
  const natures: unknown[] = Array.isArray(field) ? field : [field];
  const found = new Set(natures.map((nature) => (typeof nature === 'string' ? ORDER_TYPE_BY_NATURE[nature] : undefined)));
  return ORDER_TYPE_PRECEDENCE.find((orderType) => found.has(orderType)) ?? null;
};

/**
 * `document-url-lot` to tablica adresów dokumentacji, po jednym na lot (często powtórzonych). Zwraca pierwszy
 * poprawny adres http(s) albo null; inne schematy (np. `javascript:`) są odrzucane, bo trafiają do linku w interfejsie.
 */
export const extractDocumentsUrl = (field: unknown): string | null => {
  const values: unknown[] = Array.isArray(field) ? field : [field];
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const url = value.trim();
    if (/^https?:\/\/\S+$/i.test(url)) return url;
  }
  return null;
};

/**
 * Mapuje ogłoszenie TED na przetarg. Zwraca null dla ogłoszeń bez numeru oraz dla ogłoszeń zmieniających
 * (z identyfikatorem wersji zmiany), których aplikacja nie pokazuje.
 */
export const mapTedNotice = (raw: any, fallbackDay: string): TenderRecord | null => {
  const publicationNumber = raw?.['publication-number'];
  if (!publicationNumber || raw['change-notice-version-identifier']) return null;

  const title: string | undefined = raw['notice-title']?.pol;

  return {
    source: 'TED',
    publicationNumber,
    title: title || 'Brak tytułu',
    buyerName: raw['organisation-name-buyer']?.pol?.[0] || 'Brak danych',
    buyerCity: raw['buyer-city']?.mul?.[0] || 'Brak miasta',
    country: extractCountry(title),
    publicationDate: dayFromTedDate(raw['publication-date']) ?? fallbackDay,
    publicationTime: null,
    deadlineDate: dayFromTedDate(raw['deadline-receipt-tender-date-lot']),
    cpvCodes: raw['classification-cpv'] || [],
    link: `https://ted.europa.eu/udl?uri=TED:NOTICE:${publicationNumber}:TEXT:PL:HTML`,
    documentsUrl: extractDocumentsUrl(raw['document-url-lot']),
    orderType: extractOrderType(raw['contract-nature']),
    buyerMainActivity: extractActivity(raw['authority-main-activity']),
  };
};

/** Pobiera wszystkie strony wyników TED dla danego dnia. Błąd zwraca w `errors`, nie rzuca. */
export const fetchTed = async (day: string): Promise<SourceResult> => {
  const records: TenderRecord[] = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await requestWithRetry<{ notices?: any[] }>({
        method: 'post',
        url: TED_API_URL,
        data: { query: buildQuery(day), fields: FIELDS, page, limit: PAGE_SIZE },
        headers: { 'Content-Type': 'application/json' },
        timeout: REQUEST_TIMEOUT_MS,
      });
      const notices: any[] = response.data?.notices ?? [];
      for (const notice of notices) {
        const record = mapTedNotice(notice, day);
        if (record) records.push(record);
      }
      if (notices.length < PAGE_SIZE) break;
    }
    return { records, errors: [] };
  } catch (error) {
    console.error('Błąd pobierania przetargów z TED:', error);
    return { records, errors: ['TED'] };
  }
};
