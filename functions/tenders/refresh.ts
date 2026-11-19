import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { REGION, requireMember } from '../access';
import { addDays, isValidDay, todayInWarsaw } from './dates';
import { fetchBaza } from './bazakonkurencyjnosci';
import { fetchEzamowienia } from './ezamowienia';
import { FetchOptions, SourceResult, TENDER_SOURCES, TenderSource } from './model';
import { expiryFrom, findExistingIds, saveNewTenders } from './store';
import { isFullSweepRun, scheduledRefreshTarget } from './schedule';
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
  /**
   * Tryb przyrostowy: źródła mogą przerwać pobieranie na pierwszej stronie znanych ogłoszeń, zamiast pobierać
   * cały dzień. Dotyczy tylko bieżącego dnia; dzień zakończony zawsze pobieramy w całości.
   */
  incremental?: boolean;
}

const FETCHERS: Record<TenderSource, (day: string, options: FetchOptions) => Promise<SourceResult>> = {
  TED: fetchTed,
  E_ZAMOWIENIA: fetchEzamowienia,
  // Baza ma własne sprawdzanie znanych ogłoszeń (drugi parametr), więc opcje trybu przyrostowego jej nie dotyczą
  BAZA_KONKURENCYJNOSCI: (day) => fetchBaza(day),
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
  const incremental = Boolean(options.incremental) && !dayIsOver;
  const fetchOptions: FetchOptions = incremental ? { findKnownIds: findExistingIds } : {};

  await acquireLock(requestedBy);
  try {
    const skipped: TenderSource[] = [];
    let sources = requested;
    if (requested.includes(BAZA) && (await bazaFetchedRecently())) {
      skipped.push(BAZA);
      sources = requested.filter((source) => source !== BAZA);
    }

    // Czas etapów trafia do logu, żeby przy spowolnieniu było widać, czy zawiniło źródło, czy zapis
    const timings: Record<string, number> = {};
    const results = await Promise.all(
      sources.map(async (source) => {
        const startedAt = Date.now();
        try {
          return await FETCHERS[source](day, fetchOptions);
        } finally {
          timings[source] = Date.now() - startedAt;
        }
      })
    );
    const bySource = new Map<TenderSource, SourceResult>(sources.map((source, index) => [source, results[index]]));
    const errors = results.flatMap((result) => result.errors);
    const records = results.flatMap((result) => result.records);

    // Brak danych i błędy w źródłach oznaczają awarię, a nie pusty dzień
    if (records.length === 0 && errors.length > 0) {
      throw new HttpsError('unavailable', 'Nie udało się pobrać przetargów z żadnego źródła.');
    }

    const saveStartedAt = Date.now();
    const saved = await saveNewTenders(records);
    console.log(
      `Czasy odświeżenia ${day} (ms, ${incremental ? 'przyrostowo' : 'pełne'}): ${JSON.stringify({
        ...timings,
        zapis: Date.now() - saveStartedAt,
      })}`
    );

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
      incremental,
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

/** Czy dziennik potwierdza, że dzień został pobrany po jego zakończeniu. */
const isDayComplete = async (day: string): Promise<boolean> => {
  const snapshot = await getFirestore().doc(`${REFRESH_LOG_COLLECTION}/${day}`).get();
  return snapshot.data()?.complete === true;
};

/**
 * Przebieg zadania cyklicznego: błąd jest logowany, a zajęta blokada (trwa inne odświeżanie) pomijana.
 * Z `finalizePreviousDay` przebieg w godzinie po północy domyka poprzedni dzień (patrz `scheduledRefreshTarget`);
 * gdy dziennik już go oznacza jako kompletny, kolejne przebiegi tej godziny nic nie robią, a po błędzie ponawiają.
 */
const runScheduledRefresh = async (
  label: string,
  sources?: TenderSource[],
  finalizePreviousDay = false
): Promise<void> => {
  try {
    const target = finalizePreviousDay ? scheduledRefreshTarget() : { day: todayInWarsaw(), finalizing: false };
    if (target.finalizing && (await isDayComplete(target.day))) {
      console.log(`Pominięto: ${label.toLowerCase()} (dzień ${target.day} jest już kompletny).`);
      return;
    }
    // Przebieg o pełnej godzinie i domknięcie dnia pobierają wszystko, pozostałe tylko nowe ogłoszenia
    const incremental = !target.finalizing && !isFullSweepRun();
    const result = await refreshDay(target.day, SCHEDULER_UID, { sources, incremental });
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
 * Zadanie cykliczne zwykle kończy się w kilka-kilkanaście sekund. Krótszy limit niż w wywołaniu z aplikacji
 * ogranicza koszt, gdy źródło zwolni (Cloud Run liczy każdą sekundę, także oczekiwania na odpowiedź).
 */
const SCHEDULED_TIMEOUT_SECONDS = 120;

const SCHEDULE_OPTIONS = {
  region: REGION,
  timeZone: 'Europe/Warsaw',
  timeoutSeconds: SCHEDULED_TIMEOUT_SECONDS,
  memory: '512MiB' as const,
  retryCount: 0,
};

/**
 * Cykliczne odświeżanie dzisiejszego dnia (TED i eZamówienia), żeby lista była aktualna bez otwartej aplikacji.
 * Harmonogram (cron, strefa czasowa) łatwo zmienić poniżej: co 10 minut, od 9:00 do 23:50 czasu warszawskiego,
 * tylko w dni robocze (w weekendy ogłoszeń prawie nie ma; w razie potrzeby odświeża się je ręcznie).
 */
export const scheduledRefresh = onSchedule(
  { ...SCHEDULE_OPTIONS, schedule: '*/10 9-23 * * 1-5' },
  () => runScheduledRefresh('Zaplanowane odświeżenie', undefined, true)
);

/**
 * W godzinie po północy (0:00-0:50) domyka poprzedni dzień, żeby wykres trendu nie pokazywał zakończonych dni
 * jako niekompletnych. Działa wtorek-sobota, czyli po dniach roboczych (sobota po północy domyka piątek).
 */
export const scheduledRefreshFinalize = onSchedule(
  { ...SCHEDULE_OPTIONS, schedule: '*/10 0 * * 2-6' },
  () => runScheduledRefresh('Zaplanowane domknięcie dnia', undefined, true)
);

/**
 * Pobieranie z Bazy Konkurencyjności co godzinę, od 9:00 do 23:00 czasu warszawskiego, tylko w dni robocze.
 * Źródło nie ma oficjalnego API, więc nie odpytujemy go częściej (poza ręcznym przyciskiem w aplikacji).
 * Obejmuje dzień bieżący i dwa poprzednie.
 */
export const scheduledBazaRefresh = onSchedule(
  { ...SCHEDULE_OPTIONS, schedule: '0 9-23 * * 1-5' },
  () => runScheduledRefresh('Zaplanowane pobieranie z Bazy Konkurencyjności', [BAZA])
);
