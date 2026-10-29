import axios from 'axios';
import { addDays, toWarsaw } from './dates';
import { OrderType, SourceResult, TenderRecord } from './model';

// Adres można podmienić w testach (functions/.env.demo-tenders).
const EZAMOWIENIA_API_URL =
  process.env.EZAMOWIENIA_API_URL ?? 'https://ezamowienia.gov.pl/mo-board/api/v1/Board/Search';
// API zwraca maksymalnie 10 rekordów na stronę, niezależnie od żądanego PageSize.
const PAGE_SIZE = 10;
const MAX_PAGES = 100;
const REQUEST_TIMEOUT_MS = 30000;
const ORDER_TYPES: OrderType[] = ['Delivery', 'Services', 'Works'];

interface EzamowieniaNotice {
  noticeNumber: string;
  publicationDate: string;
  submittingOffersDate: string | null;
  cpvCode: string;
  orderObject: string;
  organizationName: string;
  organizationCity: string;
  objectId: string;
}

/** Wyciąga kody CPV z tekstu w rodzaju "30213300-8 (Komputer),48000000-8 (Pakiety oprogramowania)". */
export const extractCpvCodes = (cpvString: string | null | undefined): string[] => {
  if (!cpvString) return [];
  const codes: string[] = [];
  for (const part of cpvString.split(',')) {
    const match = part.trim().match(/^(\d{8}(?:-\d+)?)/);
    if (match) codes.push(match[1]);
  }
  return codes;
};

/** Mapuje ogłoszenie eZamówień na przetarg. Zwraca null, gdy brakuje numeru lub poprawnej daty publikacji. */
export const mapEzamowieniaNotice = (raw: EzamowieniaNotice, orderType: OrderType): TenderRecord | null => {
  const published = toWarsaw(raw?.publicationDate);
  if (!raw?.noticeNumber || !published) return null;

  return {
    source: 'E_ZAMOWIENIA',
    publicationNumber: raw.noticeNumber,
    title: raw.orderObject || 'Brak tytułu',
    buyerName: raw.organizationName || 'Brak danych',
    buyerCity: raw.organizationCity || 'Brak miasta',
    country: 'Polska',
    publicationDate: published.date,
    publicationTime: published.time,
    deadlineDate: toWarsaw(raw.submittingOffersDate)?.date ?? null,
    cpvCodes: extractCpvCodes(raw.cpvCode),
    link: `https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/${raw.objectId}`,
    orderType,
    buyerMainActivity: null,
  };
};

/**
 * Pobiera przetargi jednego typu zamówienia z danego dnia (YYYY-MM-DD, czas Europe/Warsaw).
 *
 * Filtr dat API jest zawodny: zakres w formacie ISO z "Z" potrafi zwrócić również następny dzień,
 * a sama data (bez godziny) działa poprawnie. Pytamy więc o całe doby UTC (dzień poprzedni i wybrany),
 * co obejmuje polską dobę, a wyniki przycinamy do wybranego dnia po stronie serwera.
 */
const fetchOrderType = async (day: string, orderType: OrderType): Promise<TenderRecord[]> => {
  const records: TenderRecord[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const response = await axios.get(EZAMOWIENIA_API_URL, {
      params: {
        noticeType: 'ContractNotice',
        isTenderAmountBelowEU: 'true',
        publicationDateFrom: addDays(day, -1),
        publicationDateTo: day,
        orderType,
        SortingColumnName: 'PublicationDate',
        SortingDirection: 'DESC',
        PageNumber: page,
        PageSize: PAGE_SIZE,
      },
      timeout: REQUEST_TIMEOUT_MS,
    });

    const notices: EzamowieniaNotice[] = Array.isArray(response.data) ? response.data : [];
    let reachedOlderDay = false;

    for (const notice of notices) {
      const record = mapEzamowieniaNotice(notice, orderType);
      if (!record) continue;
      if (record.publicationDate === day) {
        records.push(record);
      } else if (record.publicationDate < day) {
        reachedOlderDay = true;
      }
    }

    // Wyniki są posortowane malejąco po dacie, więc po przekroczeniu początku dnia dalsze strony są zbędne
    if (notices.length < PAGE_SIZE || reachedOlderDay) break;
  }

  return records;
};

/** Pobiera przetargi z eZamówień dla wszystkich typów zamówień. Błąd jednego typu nie przekreśla pozostałych. */
export const fetchEzamowienia = async (day: string): Promise<SourceResult> => {
  const results = await Promise.allSettled(ORDER_TYPES.map((orderType) => fetchOrderType(day, orderType)));

  const records: TenderRecord[] = [];
  const errors: string[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      records.push(...result.value);
    } else {
      console.error(`Błąd pobierania przetargów z eZamówień (${ORDER_TYPES[index]}):`, result.reason);
      errors.push(`E_ZAMOWIENIA:${ORDER_TYPES[index]}`);
    }
  });
  return { records, errors };
};
