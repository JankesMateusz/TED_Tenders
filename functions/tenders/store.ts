import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { TenderRecord, TenderSource, tenderId } from './model';

const COLLECTION = 'tenders';
/** Przetargi wygasają (polityka TTL na polu `expireAt`) miesiąc po pierwszym zapisie. */
const RETENTION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Limit liczby dokumentów w jednym wywołaniu getAll. */
const READ_CHUNK_SIZE = 300;
const ALREADY_EXISTS = 6;
const MAX_WRITE_ATTEMPTS = 3;

/** Moment wygaśnięcia dokumentu zapisanego w podanej chwili (dla pól `expireAt` objętych polityką TTL). */
export const expiryFrom = (now: Date): Timestamp => Timestamp.fromMillis(now.getTime() + RETENTION_DAYS * DAY_MS);

export interface SaveResult {
  /** Ile przetargów dopisano, per źródło. */
  created: Record<TenderSource, number>;
  /** Ile przetargów już było w bazie. */
  existing: number;
}

/**
 * Dopisuje do bazy tylko te przetargi, których jeszcze w niej nie ma. Istniejących dokumentów nie dotyka,
 * więc wspólne oznaczenia (status) przetargów nigdy nie są nadpisywane.
 */
export const saveNewTenders = async (records: TenderRecord[], now: Date = new Date()): Promise<SaveResult> => {
  const db = getFirestore();
  const unique = new Map<string, TenderRecord>();
  for (const record of records) {
    unique.set(tenderId(record), record);
  }

  const ids = Array.from(unique.keys());
  const existingIds = new Set<string>();
  for (let start = 0; start < ids.length; start += READ_CHUNK_SIZE) {
    const refs = ids.slice(start, start + READ_CHUNK_SIZE).map((id) => db.collection(COLLECTION).doc(id));
    // fieldMask pusty: potrzebujemy tylko informacji, czy dokument istnieje
    const snapshots = await db.getAll(...refs, { fieldMask: [] });
    snapshots.forEach((snapshot) => snapshot.exists && existingIds.add(snapshot.id));
  }

  const fetchedAt = Timestamp.fromDate(now);
  const expireAt = expiryFrom(now);
  const created: Record<TenderSource, number> = { TED: 0, E_ZAMOWIENIA: 0 };

  const writer = db.bulkWriter();
  // Równoległe odświeżenie mogło w międzyczasie dopisać ten sam dokument; to nie jest błąd
  writer.onWriteError((error) => error.code !== ALREADY_EXISTS && error.failedAttempts < MAX_WRITE_ATTEMPTS);

  const pending: Promise<void>[] = [];
  for (const [id, record] of unique) {
    if (existingIds.has(id)) continue;
    pending.push(
      writer
        .create(db.collection(COLLECTION).doc(id), { ...record, fetchedAt, expireAt })
        .then(() => {
          created[record.source]++;
        })
        .catch((error) => {
          if (error?.code !== ALREADY_EXISTS) throw error;
        })
    );
  }
  await writer.close();
  await Promise.all(pending);

  return { created, existing: existingIds.size };
};
