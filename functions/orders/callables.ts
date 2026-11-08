import { logger } from 'firebase-functions';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { REGION, requireRole } from '../access';
import { getPool } from './db';
import { getBuyer, getDictionaries, getOrder, listOrders, searchBuyers } from './queries';
import { parseBuyerSearchInput, parseId, parseListOrdersInput } from './validation';

// Funkcje odczytu modułu zamówień. Dane zawierają kontakty urzędników, więc wymagamy prawdziwego konta z rolą
// (requireRole odrzuca sesje anonimowe, w przeciwieństwie do tymczasowo otwartego requireMember).
// Przeglądarka nigdy nie łączy się z Postgresem: wszystko przechodzi przez te funkcje.

/** Adres bazy zamówień (np. z Neon). Lokalnie funkcje czytają go ze zmiennej środowiskowej ORDERS_DATABASE_URL. */
export const ordersDatabaseUrl = defineSecret('ORDERS_DATABASE_URL');

const options = { region: REGION, secrets: [ordersDatabaseUrl] };

/** Błędy walidacji i autoryzacji przechodzą dalej; błędy bazy logujemy bez szczegółów i zastępujemy ogólnym komunikatem. */
const guarded = async <T>(operation: string, run: () => Promise<T>): Promise<T> => {
  try {
    return await run();
  } catch (error: any) {
    if (error instanceof HttpsError) throw error;
    logger.error(`Błąd operacji bazy zamówień: ${operation}`, { code: error?.code, message: error?.message });
    throw new HttpsError('internal', 'Nie udało się pobrać danych zamówień.');
  }
};

const notFound = (what: string): never => {
  throw new HttpsError('not-found', `Nie znaleziono: ${what}.`);
};

export const getDictionariesCallable = onCall(options, (request) => {
  requireRole(request);
  return guarded('getDictionaries', () => getDictionaries(getPool()));
});

export const listOrdersCallable = onCall(options, (request) => {
  requireRole(request);
  const filters = parseListOrdersInput(request.data);
  return guarded('listOrders', () => listOrders(getPool(), filters));
});

export const getOrderCallable = onCall(options, (request) => {
  requireRole(request);
  const id = parseId(request.data);
  return guarded('getOrder', async () => (await getOrder(getPool(), id)) ?? notFound('zamówienie'));
});

export const searchBuyersCallable = onCall(options, (request) => {
  requireRole(request);
  const input = parseBuyerSearchInput(request.data);
  return guarded('searchBuyers', () => searchBuyers(getPool(), input));
});

export const getBuyerCallable = onCall(options, (request) => {
  requireRole(request);
  const id = parseId(request.data);
  return guarded('getBuyer', async () => (await getBuyer(getPool(), id)) ?? notFound('zamawiający'));
});
