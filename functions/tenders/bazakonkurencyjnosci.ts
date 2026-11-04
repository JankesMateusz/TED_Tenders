import { isAxiosError } from 'axios';
import { addDays } from './dates';
import { requestWithRetry } from './http';
import { IT_CPV_CODES_8 } from './itCpvCodes';
import { OrderType, SourceResult, TenderRecord, tenderId } from './model';
import { findExistingIds } from './store';

// Adres można podmienić w testach (functions/.env.demo-tenders). Endpointy /api/* są nieudokumentowane i bez logowania.
const BAZA_API_URL =
  process.env.BAZA_API_URL ?? 'https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/api/announcements';
const BAZA_SITE_URL = 'https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia';
const SOURCE = 'BAZA_KONKURENCYJNOSCI';
// Tylko ASCII: nagłówki HTTP nie dopuszczają polskich znaków
const USER_AGENT = 'TED-Tenders/1.0 (private tool for a public procurement analyst)';
const REQUEST_TIMEOUT_MS = 30000;
// Spokojne tempo (regulamin: zakaz utrudniania działania Bazy): zapytania sekwencyjne z przerwą
const REQUEST_DELAY_MS = Number(process.env.BAZA_REQUEST_DELAY_MS ?? 400);
const SEARCH_PAGE_SIZE = 200;
const MAX_SEARCH_PAGES = 5;
/** Ogłoszenie pojawia się w wyszukiwaniu pod swoją datą publikacji, ale bywa że z opóźnieniem; sprawdzamy kilka dni wstecz. */
const LOOKBACK_DAYS = 2;
/** Ile ogłoszeń szczegółowo pobieramy w jednym przebiegu (mieści się w limicie czasu funkcji); resztę nadrobi następny. */
const MAX_DETAILS_PER_RUN = 100;
/** Kategoria ogłoszenia w Bazie (`category.id` pozycji zamówienia) na rodzaj zamówienia. */
const ORDER_TYPE_BY_CATEGORY: Record<number, OrderType> = { 1: 'Services', 2: 'Works', 3: 'Delivery' };
// Kolejność = pierwszeństwo: aplikacja dotyczy sprzętu IT, więc dostawa wygrywa z usługą i robotami (jak w TED)
const ORDER_TYPE_PRECEDENCE: OrderType[] = ['Delivery', 'Services', 'Works'];

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const extractOrderType = (orders: any[]): OrderType | null => {
  const found = new Set<OrderType | undefined>();
  for (const order of orders) {
    for (const item of order?.order_items ?? []) {
      found.add(ORDER_TYPE_BY_CATEGORY[Number(item?.category?.id)]);
    }
  }
  return ORDER_TYPE_PRECEDENCE.find((orderType) => found.has(orderType)) ?? null;
};

const extractCpvCodes = (orders: any[]): string[] => {
  const codes = new Set<string>();
  for (const order of orders) {
    for (const item of order?.order_items ?? []) {
      for (const cpv of item?.cpv_items ?? []) {
        const code = text(cpv?.code);
        if (code) codes.add(code);
      }
    }
  }
  return Array.from(codes);
};

/** Z wartości w rodzaju "2026-11-06 23:59:59" (czas lokalny) bierzemy samą datę. */
const dayPart = (value: unknown): string | null => {
  const match = typeof value === 'string' ? value.match(/^(\d{4}-\d{2}-\d{2})/) : null;
  return match ? match[1] : null;
};

/**
 * Mapuje szczegóły ogłoszenia z Bazy Konkurencyjności na przetarg. `id` to numer z wyszukiwania i adresu strony
 * (szczegóły mają też własny, wewnętrzny `id`, którego nie używamy). Zwraca null bez numeru lub daty publikacji.
 *
 * Czytamy tylko jawnie wymienione pola. Odpowiedź zawiera dane osobowe (`contact_persons`, `created_by`,
 * `modified_by`), których nie przepisujemy do bazy ani nie logujemy.
 */
export const mapBazaNotice = (raw: any, id: number | string): TenderRecord | null => {
  const publicationNumber = String(id ?? '').trim();
  const publicationDate = dayPart(raw?.publication_date);
  if (!publicationNumber || !publicationDate) return null;

  const buyer = raw?.advertiser_address_details;
  const nip = buyer?.identification_number_type === 'nip' ? text(buyer?.identification_number) : null;
  const orders: any[] = Array.isArray(raw?.orders) ? raw.orders : [];
  const link = `${BAZA_SITE_URL}/${publicationNumber}`;

  return {
    source: SOURCE,
    publicationNumber,
    title: text(raw?.title) ?? 'Brak tytułu',
    buyerName: text(buyer?.name) ?? 'Brak danych',
    buyerCity: text(buyer?.address?.locality) ?? 'Brak miasta',
    country: text(buyer?.address?.country) ?? 'Polska',
    publicationDate,
    publicationTime: null,
    deadlineDate: dayPart(raw?.submission_deadline),
    cpvCodes: extractCpvCodes(orders),
    link,
    // Dokumentacja leży na stronie ogłoszenia, czyli pod tym samym adresem co `link`: osobny przycisk byłby zbędny
    documentsUrl: null,
    orderType: extractOrderType(orders),
    buyerMainActivity: null,
    buyerNip: nip,
  };
};

/** Ogłoszenia IT opublikowane w podanym zakresie dni, od najnowszych. Wyszukiwarka widzi tylko ogłoszenia otwarte. */
const searchAnnouncementIds = async (fromDay: string, toDay: string): Promise<number[]> => {
  const ids: number[] = [];
  for (let page = 1; page <= MAX_SEARCH_PAGES; page++) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(SEARCH_PAGE_SIZE),
      sort: 'publicationDate',
      'status[0]': 'PUBLISHED',
      'publicationDateRange[from]': fromDay,
      'publicationDateRange[to]': toDay,
    });
    IT_CPV_CODES_8.forEach((code, index) => params.append(`cpvItem[${index}]`, code));

    if (page > 1) await sleep(REQUEST_DELAY_MS);
    const response = await requestWithRetry<{ data?: { advertisements?: { id?: number }[] } }>({
      method: 'get',
      url: `${BAZA_API_URL}/search`,
      params,
      headers: { 'User-Agent': USER_AGENT },
      timeout: REQUEST_TIMEOUT_MS,
    });
    const advertisements = response.data?.data?.advertisements;
    // Zmiana kształtu odpowiedzi (np. wymóg logowania) ma być błędem, a nie pustym dniem
    if (!Array.isArray(advertisements)) throw new Error('Nieoczekiwany kształt odpowiedzi wyszukiwania Bazy Konkurencyjności');
    for (const advertisement of advertisements) {
      if (typeof advertisement?.id === 'number') ids.push(advertisement.id);
    }
    if (advertisements.length < SEARCH_PAGE_SIZE) break;
  }
  return ids;
};

/**
 * Pobiera z Bazy Konkurencyjności nowe ogłoszenia IT z dnia `day` i dwóch poprzednich (ogłoszenia pojawiają się
 * z opóźnieniem). Szczegóły pobiera tylko dla ogłoszeń, których nie ma jeszcze w bazie. Błąd zwraca w `errors`, nie rzuca.
 */
export const fetchBaza = async (
  day: string,
  findExisting: (ids: string[]) => Promise<Set<string>> = findExistingIds
): Promise<SourceResult> => {
  const records: TenderRecord[] = [];
  try {
    const found = await searchAnnouncementIds(addDays(day, -LOOKBACK_DAYS), day);
    const idByTenderId = new Map(found.map((id) => [tenderId({ source: SOURCE, publicationNumber: String(id) }), id]));
    const existing = await findExisting(Array.from(idByTenderId.keys()));
    const newIds = Array.from(idByTenderId).filter(([key]) => !existing.has(key)).map(([, id]) => id);
    if (newIds.length > MAX_DETAILS_PER_RUN) {
      console.warn(`Baza Konkurencyjności: ${newIds.length} nowych ogłoszeń, w tym przebiegu pobieram ${MAX_DETAILS_PER_RUN}.`);
    }

    for (const id of newIds.slice(0, MAX_DETAILS_PER_RUN)) {
      await sleep(REQUEST_DELAY_MS);
      try {
        const response = await requestWithRetry<{ data?: { advertisement?: unknown } }>({
          method: 'get',
          url: `${BAZA_API_URL}/${id}`,
          headers: { 'User-Agent': USER_AGENT },
          timeout: REQUEST_TIMEOUT_MS,
        });
        const record = mapBazaNotice(response.data?.data?.advertisement, id);
        if (record) records.push(record);
      } catch (error) {
        // Ogłoszenie wycofane między wyszukiwaniem a pobraniem szczegółów nie blokuje reszty
        if (isAxiosError(error) && error.response?.status === 404) continue;
        throw error;
      }
    }
    return { records, errors: [] };
  } catch (error) {
    // Bez treści odpowiedzi w logu: zawiera dane osobowe
    console.error('Błąd pobierania ogłoszeń z Bazy Konkurencyjności:', error instanceof Error ? error.message : error);
    return { records, errors: [SOURCE] };
  }
};
