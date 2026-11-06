import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { REGION } from '../access';

/**
 * Migawki ocen przetargów (TT-13, ścieżka P0 z planu integracji).
 *
 * Status przetargu (`toEnter`/`entered`/`notToEnter`/`toClarify`) wygasa razem z przetargiem po 30 dniach.
 * To jedyny zbiór przetargów ocenionych przez ludzi, więc każdą zmianę statusu zapisujemy do kolekcji
 * `labelSnapshots` BEZ TTL. Zapis tylko z serwera (reguły: odczyt i zapis z klienta zabroniony).
 * Zero kosztu: trigger dostaje dokument w zdarzeniu, nie ma zadania Schedulera ani dodatkowych odczytów przetargu.
 */
export const LABEL_SNAPSHOTS_COLLECTION = 'labelSnapshots';
/** Ile ostatnich zmian statusu trzymamy w jednej migawce. */
export const MAX_STATUS_HISTORY = 20;

export interface StatusChange {
  /** Nowy status; null = status zdjęto. */
  status: string | null;
  at: Timestamp | null;
  by: string | null;
  byEmail: string | null;
}

/** Pola przetargu kopiowane do migawki (metadane potrzebne do oceny wstępnej klasyfikacji). */
const TENDER_FIELDS = ['source', 'publicationNumber', 'publicationDate', 'title', 'cpvCodes', 'orderType', 'buyerName'] as const;

type Data = Record<string, unknown>;

const statusOf = (data: Data | undefined): string | null =>
  typeof data?.status === 'string' ? data.status : null;

/** Zmiana statusu opisana polami przetargu po zdarzeniu. */
export const statusChangeFrom = (after: Data): StatusChange => ({
  status: statusOf(after),
  at: (after.statusAt as Timestamp | undefined) ?? null,
  by: (after.statusBy as string | undefined) ?? null,
  byEmail: (after.statusByEmail as string | undefined) ?? null,
});

/** Czy zdarzenie zmienia status (ustawienie, zmiana albo zdjęcie); zmiany samych etykiet są pomijane. */
export const statusChanged = (before: Data | undefined, after: Data | undefined): boolean =>
  !!after && statusOf(before) !== statusOf(after);

const sameChange = (a: StatusChange | undefined, b: StatusChange): boolean =>
  !!a && a.status === b.status && (a.at?.toMillis() ?? null) === (b.at?.toMillis() ?? null);

/**
 * Nowa zawartość migawki po zmianie statusu. `existing` to dotychczasowa migawka (albo undefined).
 * Zwraca null, gdy ta sama zmiana jest już na końcu historii (ponowne dostarczenie zdarzenia).
 */
export const buildSnapshot = (docId: string, after: Data, existing: Data | undefined): Data | null => {
  const change = statusChangeFrom(after);
  const history = ((existing?.statusHistory as StatusChange[] | undefined) ?? []);
  if (sameChange(history[history.length - 1], change)) return null;

  const snapshot: Data = { docId };
  for (const field of TENDER_FIELDS) snapshot[field] = after[field] ?? null;
  snapshot.status = change.status;
  snapshot.statusAt = change.at;
  snapshot.statusHistory = [...history, change].slice(-MAX_STATUS_HISTORY);
  return snapshot;
};

/** Migawka początkowa dla przetargu, który ma już status (skrypt startowy). Przetargi bez statusu: null. */
export const buildInitialSnapshot = (docId: string, tender: Data): Data | null =>
  statusOf(tender) === null ? null : buildSnapshot(docId, tender, undefined);

export const writeSnapshot = async (docId: string, after: Data): Promise<boolean> => {
  const db = getFirestore();
  const ref = db.collection(LABEL_SNAPSHOTS_COLLECTION).doc(docId);
  return db.runTransaction(async (transaction) => {
    const existing = (await transaction.get(ref)).data();
    const snapshot = buildSnapshot(docId, after, existing);
    if (!snapshot) return false;
    transaction.set(ref, snapshot);
    return true;
  });
};

export const snapshotLabelOnStatusChange = onDocumentUpdated(
  { document: 'tenders/{docId}', region: REGION, retry: true },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after || !statusChanged(before, after)) return;
    await writeSnapshot(event.params.docId, after);
  },
);
