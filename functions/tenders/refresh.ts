import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { REGION, requireMember } from '../access';
import { addDays, isValidDay, todayInWarsaw } from './dates';
import { fetchEzamowienia } from './ezamowienia';
import { SourceResult } from './model';
import { expiryFrom, saveNewTenders } from './store';
import { fetchTed } from './ted';

const LOCK_PATH = 'meta/refreshLock';
const REFRESH_LOG_COLLECTION = 'refreshLog';
/** Blokada wygasa sama, gdyby funkcja przerwała pracę bez jej zwolnienia. */
const LOCK_TTL_MS = 6 * 60 * 1000;
const FUNCTION_TIMEOUT_SECONDS = 300;
/** Najstarszy dzień, który można odświeżyć (spójnie z miesięcznym okresem przechowywania). */
const MAX_PAST_DAYS = 31;
/** Identyfikator w blokadzie i dzienniku dla odświeżeń z harmonogramu. */
const SCHEDULER_UID = 'scheduler';

const acquireLock = async (uid: string): Promise<void> => {
  const db = getFirestore();
  const lockRef = db.doc(LOCK_PATH);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(lockRef);
    const lockedUntil: Timestamp | undefined = snapshot.data()?.lockedUntil;
    if (lockedUntil && lockedUntil.toMillis() > Date.now()) {
      throw new HttpsError('resource-exhausted', 'Odświeżanie już trwa. Spróbuj ponownie za chwilę.');
    }
    transaction.set(lockRef, { lockedUntil: Timestamp.fromMillis(Date.now() + LOCK_TTL_MS), lockedBy: uid });
  });
};

const releaseLock = async (): Promise<void> => {
  try {
    await getFirestore().doc(LOCK_PATH).delete();
  } catch (error) {
    console.warn('Nie udało się zwolnić blokady odświeżania (wygaśnie sama):', error);
  }
};

const resolveDay = (requested: unknown): string => {
  const today = todayInWarsaw();
  if (requested === undefined || requested === null) return today;
  if (!isValidDay(requested)) {
    throw new HttpsError('invalid-argument', 'Data musi mieć format RRRR-MM-DD.');
  }
  if (requested > today) {
    throw new HttpsError('invalid-argument', 'Nie można odświeżać przetargów z przyszłości.');
  }
  if (requested < addDays(today, -MAX_PAST_DAYS)) {
    throw new HttpsError('invalid-argument', `Można odświeżać tylko ostatnie ${MAX_PAST_DAYS} dni.`);
  }
  return requested;
};

/**
 * Pobiera przetargi z TED i eZamówień z jednego dnia i dopisuje do bazy te, których jeszcze w niej nie ma.
 * Współdzielone przez wywołanie z aplikacji i zadanie cykliczne; `requestedBy` trafia do blokady i dziennika.
 */
export const refreshDay = async (day: string, requestedBy: string) => {
  // Dzień pobrany po jego zakończeniu jest kompletny; pobrany w trakcie może nie mieć jeszcze późniejszych ogłoszeń
  const dayIsOver = todayInWarsaw() > day;

  await acquireLock(requestedBy);
  try {
    const [ted, ezamowienia]: SourceResult[] = await Promise.all([fetchTed(day), fetchEzamowienia(day)]);
    const errors = [...ted.errors, ...ezamowienia.errors];
    const records = [...ted.records, ...ezamowienia.records];

    // Brak danych i błędy w obu źródłach oznaczają awarię, a nie pusty dzień
    if (records.length === 0 && errors.length > 0) {
      throw new HttpsError('unavailable', 'Nie udało się pobrać przetargów z żadnego źródła.');
    }

    const saved = await saveNewTenders(records);

    // Zapis tylko po pełnym sukcesie, żeby dzień z brakującym źródłem został pobrany ponownie
    if (errors.length === 0) {
      const now = new Date();
      await getFirestore().doc(`${REFRESH_LOG_COLLECTION}/${day}`).set({
        day,
        complete: dayIsOver,
        refreshedAt: Timestamp.fromDate(now),
        refreshedBy: requestedBy,
        expireAt: expiryFrom(now),
      });
    }

    return {
      date: day,
      fetched: { TED: ted.records.length, E_ZAMOWIENIA: ezamowienia.records.length },
      created: saved.created,
      existing: saved.existing,
      errors,
    };
  } finally {
    await releaseLock();
  }
};

/** Odświeżenie dnia (domyślnie dzisiejszego) na prośbę zalogowanego użytkownika z rolą. */
export const refreshTenders = onCall(
  { region: REGION, timeoutSeconds: FUNCTION_TIMEOUT_SECONDS, memory: '512MiB' },
  async (request) => {
    const uid = requireMember(request);
    return refreshDay(resolveDay(request.data?.date), uid);
  }
);

/**
 * Cykliczne odświeżanie dzisiejszego dnia, żeby lista była aktualna bez otwartej aplikacji.
 * Harmonogram (cron, strefa czasowa) łatwo zmienić poniżej: co 10 minut, od 9:00 do 23:50 czasu warszawskiego.
 */
export const scheduledRefresh = onSchedule(
  {
    region: REGION,
    schedule: '*/10 9-23 * * *',
    timeZone: 'Europe/Warsaw',
    timeoutSeconds: FUNCTION_TIMEOUT_SECONDS,
    memory: '512MiB',
    retryCount: 0,
  },
  async () => {
    try {
      const result = await refreshDay(todayInWarsaw(), SCHEDULER_UID);
      console.log('Zaplanowane odświeżenie zakończone:', JSON.stringify(result));
    } catch (error) {
      // Blokada zajęta (ręczne odświeżenie w toku) to nie błąd: kolejny przebieg nadrobi
      if (error instanceof HttpsError && error.code === 'resource-exhausted') {
        console.log('Pominięto zaplanowane odświeżenie: inne odświeżanie trwa.');
        return;
      }
      console.error('Zaplanowane odświeżenie nie powiodło się:', error);
    }
  }
);
