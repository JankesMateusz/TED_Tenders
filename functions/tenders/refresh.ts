import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { REGION, requireMember } from '../access';
import { addDays, isValidDay, todayInWarsaw } from './dates';
import { fetchBaza } from './bazakonkurencyjnosci';
import { fetchEzamowienia } from './ezamowienia';
import { SourceResult, TENDER_SOURCES, TenderSource } from './model';
import { expiryFrom, saveNewTenders } from './store';
import { fetchTed } from './ted';

const LOCK_PATH = 'meta/refreshLock';
/** Znacznik ostatniego pobierania z Bazy Konkurencyjności (źródło odpytujemy rzadko, nie na każde odświeżenie). */
const BAZA_REFRESH_PATH = 'meta/bazaRefresh';
const BAZA_MIN_INTERVAL_MS = 5 * 60 * 1000;
const BAZA: TenderSource = 'BAZA_KONKURENCYJNOSCI';
/** Źródła odświeżane domyślnie (wejście do aplikacji, zadanie co 10 minut). Bazę pobieramy osobno, na żądanie i raz dziennie. */
const DEFAULT_SOURCES: TenderSource[] = ['TED', 'E_ZAMOWIENIA'];
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

export interface RefreshOptions {
  sources?: TenderSource[];
}

const FETCHERS: Record<TenderSource, (day: string) => Promise<SourceResult>> = {
  TED: fetchTed,
  E_ZAMOWIENIA: fetchEzamowienia,
  BAZA_KONKURENCYJNOSCI: fetchBaza,
};

/** Czy Baza była pobierana na tyle niedawno, że kolejne odpytanie źródła nie ma sensu. */
const bazaFetchedRecently = async (): Promise<boolean> => {
  const snapshot = await getFirestore().doc(BAZA_REFRESH_PATH).get();
  const refreshedAt: Timestamp | undefined = snapshot.data()?.refreshedAt;
  return Boolean(refreshedAt && Date.now() - refreshedAt.toMillis() < BAZA_MIN_INTERVAL_MS);
};

/**
 * Pobiera przetargi z wybranych źródeł (domyślnie TED i eZamówienia) z jednego dnia i dopisuje do bazy te,
 * których jeszcze w niej nie ma. Współdzielone przez wywołanie z aplikacji i zadania cykliczne; `requestedBy`
 * trafia do blokady i dziennika.
 */
export const refreshDay = async (day: string, requestedBy: string, options: RefreshOptions = {}) => {
  const requested = options.sources ?? DEFAULT_SOURCES;
  // Dzień pobrany po jego zakończeniu jest kompletny; pobrany w trakcie może nie mieć jeszcze późniejszych ogłoszeń
  const dayIsOver = todayInWarsaw() > day;

  await acquireLock(requestedBy);
  try {
    const skipped: TenderSource[] = [];
    let sources = requested;
    if (requested.includes(BAZA) && (await bazaFetchedRecently())) {
      skipped.push(BAZA);
      sources = requested.filter((source) => source !== BAZA);
    }

    const results = await Promise.all(sources.map((source) => FETCHERS[source](day)));
    const bySource = new Map<TenderSource, SourceResult>(sources.map((source, index) => [source, results[index]]));
    const errors = results.flatMap((result) => result.errors);
    const records = results.flatMap((result) => result.records);

    // Brak danych i błędy w źródłach oznaczają awarię, a nie pusty dzień
    if (records.length === 0 && errors.length > 0) {
      throw new HttpsError('unavailable', 'Nie udało się pobrać przetargów z żadnego źródła.');
    }

    const saved = await saveNewTenders(records);

    const now = new Date();
    // Zapis tylko po pełnym sukcesie, żeby dzień z brakującym źródłem został pobrany ponownie.
    // Dziennik dotyczy TED i eZamówień: nie zapisuje go przebieg samej Bazy, a jej błąd nie blokuje dnia.
    const coreSources = DEFAULT_SOURCES.filter((source) => bySource.has(source));
    const coreErrors = coreSources.flatMap((source) => bySource.get(source)!.errors);
    if (coreSources.length === DEFAULT_SOURCES.length && coreErrors.length === 0) {
      await getFirestore().doc(`${REFRESH_LOG_COLLECTION}/${day}`).set({
        day,
        complete: dayIsOver,
        refreshedAt: Timestamp.fromDate(now),
        refreshedBy: requestedBy,
        expireAt: expiryFrom(now),
      });
    }
    if (bySource.has(BAZA) && bySource.get(BAZA)!.errors.length === 0) {
      await getFirestore().doc(BAZA_REFRESH_PATH).set({ refreshedAt: Timestamp.fromDate(now), refreshedBy: requestedBy });
    }

    return {
      date: day,
      fetched: Object.fromEntries(sources.map((source) => [source, bySource.get(source)!.records.length])),
      created: saved.created,
      existing: saved.existing,
      errors,
      skipped,
    };
  } finally {
    await releaseLock();
  }
};

const parseSources = (requested: unknown): TenderSource[] | undefined => {
  if (requested === undefined || requested === null) return undefined;
  const valid =
    Array.isArray(requested) &&
    requested.length > 0 &&
    requested.every((source) => TENDER_SOURCES.includes(source as TenderSource));
  if (!valid) throw new HttpsError('invalid-argument', 'Nieprawidłowa lista źródeł.');
  return Array.from(new Set(requested as TenderSource[]));
};

/** Odświeżenie dnia (domyślnie dzisiejszego) na prośbę zalogowanego użytkownika z rolą. */
export const refreshTenders = onCall(
  { region: REGION, timeoutSeconds: FUNCTION_TIMEOUT_SECONDS, memory: '512MiB' },
  async (request) => {
    const uid = requireMember(request);
    return refreshDay(resolveDay(request.data?.date), uid, { sources: parseSources(request.data?.sources) });
  }
);

/** Przebieg zadania cyklicznego: błąd jest logowany, a zajęta blokada (trwa inne odświeżanie) pomijana. */
const runScheduledRefresh = async (label: string, sources?: TenderSource[]): Promise<void> => {
  try {
    const result = await refreshDay(todayInWarsaw(), SCHEDULER_UID, { sources });
    console.log(`${label} zakończone:`, JSON.stringify(result));
  } catch (error) {
    // Blokada zajęta (ręczne odświeżenie w toku) to nie błąd: kolejny przebieg nadrobi
    if (error instanceof HttpsError && error.code === 'resource-exhausted') {
      console.log(`Pominięto: ${label.toLowerCase()} (inne odświeżanie trwa).`);
      return;
    }
    console.error(`${label} nie powiodło się:`, error);
  }
};

/**
 * Cykliczne odświeżanie dzisiejszego dnia (TED i eZamówienia), żeby lista była aktualna bez otwartej aplikacji.
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
  () => runScheduledRefresh('Zaplanowane odświeżenie')
);

/**
 * Pobieranie z Bazy Konkurencyjności raz dziennie, o 8:00 czasu warszawskiego. Źródło nie ma oficjalnego API,
 * więc odpytujemy je rzadko (poza tym ręcznym przyciskiem w aplikacji). Obejmuje dzień bieżący i dwa poprzednie.
 */
export const scheduledBazaRefresh = onSchedule(
  {
    region: REGION,
    schedule: '0 8 * * *',
    timeZone: 'Europe/Warsaw',
    timeoutSeconds: FUNCTION_TIMEOUT_SECONDS,
    memory: '512MiB',
    retryCount: 0,
  },
  () => runScheduledRefresh('Zaplanowane pobieranie z Bazy Konkurencyjności', [BAZA])
);
