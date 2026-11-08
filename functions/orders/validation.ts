import { HttpsError } from 'firebase-functions/v2/https';

// Walidacja danych z przeglądarki na granicy systemu. Błędne dane kończą się błędem `invalid-argument`.

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;
export const MIN_SEARCH_LENGTH = 2;
const MAX_TEXT_LENGTH = 100;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface OrderListCursor {
  registeredOn: string;
  id: number;
}

export interface OrderListFilters {
  year?: number;
  status?: string;
  accountType?: string;
  lobCategory?: string;
  positionStatus?: string;
  buyerId?: number;
  search?: string;
  registeredFrom?: string;
  registeredTo?: string;
  limit: number;
  cursor?: OrderListCursor;
}

const invalid = (message: string): never => {
  throw new HttpsError('invalid-argument', message);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const optionalText = (data: Record<string, unknown>, key: string): string | undefined => {
  const value = data[key];
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return invalid(`Pole ${key} musi być tekstem.`);
  const trimmed = value.trim();
  if (trimmed.length > MAX_TEXT_LENGTH) return invalid(`Pole ${key} jest zbyt długie.`);
  return trimmed === '' ? undefined : trimmed;
};

const optionalInteger = (data: Record<string, unknown>, key: string, min: number, max: number): number | undefined => {
  const value = data[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    return invalid(`Pole ${key} musi być liczbą całkowitą z zakresu ${min}..${max}.`);
  }
  return value;
};

/** Poprawna data kalendarzowa "RRRR-MM-DD" (odrzuca np. 2026-02-31). */
export const isIsoDate = (value: string): boolean => {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const optionalDate = (data: Record<string, unknown>, key: string): string | undefined => {
  const value = optionalText(data, key);
  if (value !== undefined && !isIsoDate(value)) return invalid(`Pole ${key} musi być datą w formacie RRRR-MM-DD.`);
  return value;
};

export const encodeCursor = (cursor: OrderListCursor): string =>
  Buffer.from(JSON.stringify({ d: cursor.registeredOn, i: cursor.id }), 'utf8').toString('base64url');

export const decodeCursor = (raw: string): OrderListCursor => {
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (isRecord(parsed) && typeof parsed.d === 'string' && isIsoDate(parsed.d) && Number.isSafeInteger(parsed.i) && (parsed.i as number) > 0) {
      return { registeredOn: parsed.d, id: parsed.i as number };
    }
  } catch {
    // niżej zgłaszamy jeden, ogólny błąd
  }
  return invalid('Nieprawidłowy kursor stronicowania.');
};

export const parseListOrdersInput = (data: unknown): OrderListFilters => {
  const input = data === undefined || data === null ? {} : data;
  if (!isRecord(input)) return invalid('Dane żądania muszą być obiektem.');

  const cursorText = optionalText(input, 'cursor');
  const filters: OrderListFilters = {
    year: optionalInteger(input, 'year', 2000, 2100),
    status: optionalText(input, 'status'),
    accountType: optionalText(input, 'accountType'),
    lobCategory: optionalText(input, 'lobCategory'),
    positionStatus: optionalText(input, 'positionStatus'),
    buyerId: optionalInteger(input, 'buyerId', 1, Number.MAX_SAFE_INTEGER),
    search: optionalText(input, 'search'),
    registeredFrom: optionalDate(input, 'registeredFrom'),
    registeredTo: optionalDate(input, 'registeredTo'),
    limit: optionalInteger(input, 'limit', 1, MAX_PAGE_SIZE) ?? DEFAULT_PAGE_SIZE,
    cursor: cursorText === undefined ? undefined : decodeCursor(cursorText),
  };
  if (filters.registeredFrom && filters.registeredTo && filters.registeredFrom > filters.registeredTo) {
    return invalid('Data początkowa jest późniejsza niż końcowa.');
  }
  return filters;
};

export const parseId = (data: unknown): number => {
  if (!isRecord(data)) return invalid('Dane żądania muszą być obiektem.');
  const id = optionalInteger(data, 'id', 1, Number.MAX_SAFE_INTEGER);
  if (id === undefined) return invalid('Brak identyfikatora.');
  return id;
};

export interface BuyerSearchInput {
  query: string;
  limit: number;
}

const MAX_BUYER_SEARCH_LIMIT = 50;
const DEFAULT_BUYER_SEARCH_LIMIT = 20;

export const parseBuyerSearchInput = (data: unknown): BuyerSearchInput => {
  if (!isRecord(data)) return invalid('Dane żądania muszą być obiektem.');
  const query = optionalText(data, 'query');
  if (query === undefined || query.length < MIN_SEARCH_LENGTH) {
    return invalid(`Wpisz co najmniej ${MIN_SEARCH_LENGTH} znaki.`);
  }
  return { query, limit: optionalInteger(data, 'limit', 1, MAX_BUYER_SEARCH_LIMIT) ?? DEFAULT_BUYER_SEARCH_LIMIT };
};
