import { logger } from 'firebase-functions';
import { HttpsError } from 'firebase-functions/v2/https';
import { Pool, QueryResult, QueryResultRow, types } from 'pg';

/** Minimalny interfejs zapytań: wystarcza i Pool, i Client, więc testy mogą podać własne połączenie. */
export interface Queryable {
  query<R extends QueryResultRow = any>(text: string, values?: unknown[]): Promise<QueryResult<R>>;
}

const DATE_OID = 1082;
const INT8_OID = 20;
const POOL_MAX = 2; // mała pula: darmowe bazy mają niski limit połączeń, a funkcje skalują się instancjami
const IDLE_TIMEOUT_MS = 10000;
const CONNECTION_TIMEOUT_MS = 5000;
const STATEMENT_TIMEOUT_MS = 10000;

// DATE zwracamy jako tekst "RRRR-MM-DD" (domyślnie pg robi z niego Date w strefie czasowej serwera, co przesuwa dni),
// a bigint (identyfikatory, liczniki) jako liczbę, bo wszystkie wartości mieszczą się w zakresie bezpiecznych liczb.
const typeParsers = {
  getTypeParser: (oid: number, format?: any) => {
    if (oid === DATE_OID) return (value: string) => value;
    if (oid === INT8_OID) return (value: string) => Number(value);
    return types.getTypeParser(oid, format);
  },
} as any;

export const createPool = (connectionString: string): Pool => {
  const pool = new Pool({
    connectionString,
    max: POOL_MAX,
    idleTimeoutMillis: IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    statement_timeout: STATEMENT_TIMEOUT_MS,
    application_name: 'tenders-orders',
    types: typeParsers,
  });
  // Błąd bezczynnego połączenia nie może zabić procesu; logujemy sam komunikat (bez adresu bazy).
  pool.on('error', (error) => logger.error('Błąd połączenia z bazą zamówień', { message: error.message }));
  return pool;
};

let sharedPool: Pool | undefined;

/** Pula współdzielona przez instancję funkcji. Adres bazy pochodzi z sekretu ORDERS_DATABASE_URL (nigdy z kodu). */
export const getPool = (): Pool => {
  if (!sharedPool) {
    const connectionString = process.env.ORDERS_DATABASE_URL;
    if (!connectionString) {
      throw new HttpsError('failed-precondition', 'Baza zamówień nie jest skonfigurowana.');
    }
    sharedPool = createPool(connectionString);
  }
  return sharedPool;
};
