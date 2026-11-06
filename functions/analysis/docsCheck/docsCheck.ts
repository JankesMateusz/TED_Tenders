import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { getFunctions } from 'firebase-admin/functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onTaskDispatched } from 'firebase-functions/v2/tasks';
import { REGION, requireAdmin } from '../../access';
import { TenderRecord } from '../../tenders/model';
import { ResolverError, ResolverResult, resolveDocuments } from '../resolver';
import { clampToWindow, firstCheckTime, nextCheckTime } from './schedule';
import { DocsCheckOutcome, errorOutcome, isTerminalState, outcomeChanged, outcomeFromResult } from './state';

/**
 * Automatyczne sprawdzanie dostępności dokumentacji (TT-15, plan 3.7): dla każdego nowego przetargu IT
 * (`isIT === true`) trigger kolejkuje sprawdzenie w Cloud Tasks. Sprawdzenie uruchamia resolver (tylko lista plików,
 * nic nie jest pobierane) i zapisuje wynik w `tenders/{docId}.docsCheck`. Zapis tylko z serwera.
 * Limity (D15): kolejka z współbieżnością 1 i 1 zapytaniem/s, najwyżej 6 sprawdzeń na przetarg, okno 9:00-24:00.
 */
export const TASK_FUNCTION = 'checkDocumentsTask';

export interface CheckPayload {
  docId: string;
  /** Numer sprawdzenia, od 1. */
  check: number;
}

export interface DocsCheckDeps {
  resolve: (tender: TenderRecord) => Promise<ResolverResult>;
  enqueue: (payload: CheckPayload, when: Date) => Promise<void>;
  now: () => Date;
}

/** Identyfikator zadania: deduplikuje to samo sprawdzenie (litery, cyfry, `-` i `_`). */
const taskId = ({ docId, check }: CheckPayload): string => `${docId.replace(/[^A-Za-z0-9_-]/g, '_')}-${check}`;

export const enqueueCheck = async (payload: CheckPayload, when: Date): Promise<void> => {
  try {
    await getFunctions().taskQueue(`locations/${REGION}/functions/${TASK_FUNCTION}`).enqueue(payload, { scheduleTime: when, id: taskId(payload) });
  } catch (error) {
    // To samo sprawdzenie już czeka w kolejce (ponowione zdarzenie lub zadanie): nic do zrobienia
    if ((error as { code?: string }).code === 'functions/task-already-exists') return;
    throw error;
  }
};

const defaultDeps = (): DocsCheckDeps => ({ resolve: resolveDocuments, enqueue: enqueueCheck, now: () => new Date() });

const stored = (value: unknown): Partial<DocsCheckOutcome> & { checks?: number; firstSeenAt?: Timestamp; nextCheckAt?: Timestamp | null } | undefined =>
  value && typeof value === 'object' ? (value as never) : undefined;

/** Jedno sprawdzenie: resolver → kolejne sprawdzenie w kolejce → zapis. Idempotentne przy ponowieniu zadania. */
export const processDocsCheck = async ({ docId, check }: CheckPayload, deps: DocsCheckDeps = defaultDeps()): Promise<void> => {
  const ref = getFirestore().doc(`tenders/${docId}`);
  const snapshot = await ref.get();
  if (!snapshot.exists) return; // przetarg wygasł (TTL)

  const tender = snapshot.data() as TenderRecord & { docsCheck?: unknown };
  const previous = stored(tender.docsCheck);
  if (previous?.state && isTerminalState(previous.state)) return;
  // To sprawdzenie zostało już zapisane (ponowione zadanie): zapis jest ostatnim krokiem, więc nic nie zostało pominięte
  if (previous?.checks !== undefined && previous.checks >= check) return;

  let outcome: DocsCheckOutcome;
  try {
    outcome = outcomeFromResult(await deps.resolve(tender));
  } catch (error) {
    if (!(error instanceof ResolverError)) throw error;
    // Awaria platformy to `error`, nie „brak dokumentów"; zachowujemy to, co o platformie już wiemy
    outcome = { ...errorOutcome(), ...(previous?.platform && { platform: previous.platform }), ...(previous?.sourceUrl && { sourceUrl: previous.sourceUrl }) };
  }

  const now = deps.now();
  const next = isTerminalState(outcome.state) ? null : nextCheckTime(check, now);
  // Kolejka przed zapisem: gdy zapis się nie uda, ponowienie zadania doda to samo zadanie (deduplikacja po identyfikatorze)
  if (next) await deps.enqueue({ docId, check: check + 1 }, next);

  // Zapis przy zmianie widocznego stanu oraz podczas trwającego sprawdzania (UI pokazuje „następne sprawdzenie"), z wyczyszczeniem po ostatnim
  if (!outcomeChanged(previous, outcome) && !next && !previous?.nextCheckAt) return;
  const firstSeenAt = previous?.firstSeenAt ?? (outcome.state === 'available' ? Timestamp.fromDate(now) : undefined);
  try {
    await ref.update({
      docsCheck: {
        ...outcome,
        checks: check,
        checkedAt: Timestamp.fromDate(now),
        nextCheckAt: next ? Timestamp.fromDate(next) : null,
        ...(firstSeenAt && { firstSeenAt }),
      },
    });
  } catch (error) {
    if ((error as { code?: number }).code === 5) return; // dokument usunięty w trakcie sprawdzania
    throw error;
  }
};

/** Kolejka sprawdzeń: współbieżność 1 i 1 zapytanie/s (D15). */
export const checkDocumentsTask = onTaskDispatched<CheckPayload>(
  {
    region: REGION,
    retryConfig: { maxAttempts: 3, minBackoffSeconds: 60 },
    rateLimits: { maxConcurrentDispatches: 1, maxDispatchesPerSecond: 1 },
    timeoutSeconds: 120,
  },
  async (request) => {
    const { docId, check } = request.data ?? {};
    if (typeof docId !== 'string' || !docId || !Number.isInteger(check) || check < 1) return;
    await processDocsCheck({ docId, check });
  },
);

/** Nowy przetarg IT dostaje pierwsze sprawdzenie (poza oknem: o 9:00). */
export const enqueueDocsCheckOnCreate = onDocumentCreated({ document: 'tenders/{docId}', region: REGION, retry: true }, async (event) => {
  if (event.data?.data()?.isIT !== true) return;
  await enqueueCheck({ docId: event.params.docId, check: 1 }, firstCheckTime(new Date()));
});

const MAX_ENQUEUE = 1000;

/**
 * Jednorazowo kolejkuje pierwsze sprawdzenie dla istniejących przetargów IT, które jeszcze go nie mają
 * (po wdrożeniu triggera). Tylko admin. `sinceDay` (YYYY-MM-DD) ogranicza do świeższych przetargów.
 */
export const enqueueDocsChecks = onCall<{ sinceDay?: string; limit?: number }>({ region: REGION, timeoutSeconds: 300 }, async (request) => {
  requireAdmin(request);
  const { sinceDay, limit } = request.data ?? {};
  if (sinceDay !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(sinceDay)) throw new HttpsError('invalid-argument', 'sinceDay ma mieć postać RRRR-MM-DD.');
  const max = Math.min(Number.isInteger(limit) ? (limit as number) : MAX_ENQUEUE, MAX_ENQUEUE);

  const docs = (await getFirestore().collection('tenders').where('isIT', '==', true).get()).docs;
  const when = clampToWindow(new Date());
  let enqueued = 0;
  for (const doc of docs) {
    if (enqueued >= max) break;
    const data = doc.data();
    if (data.docsCheck || (sinceDay && data.publicationDate < sinceDay)) continue;
    await enqueueCheck({ docId: doc.id, check: 1 }, when);
    enqueued++;
  }
  return { enqueued, candidates: docs.length };
});
