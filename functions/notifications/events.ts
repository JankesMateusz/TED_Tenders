import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { REGION } from '../access';

/**
 * Zdarzenia do podsumowania „od ostatniej wizyty”. Jedna wspólna kolekcja `events` (jeden zapis na zdarzenie,
 * niezależnie od liczby użytkowników); klient grupuje wpisy nowsze niż jego `lastSeenAt`. Zapis tylko z serwera.
 * Wpisy mają deterministyczny identyfikator, więc ponowne dostarczenie zdarzenia nie tworzy duplikatu.
 * Nowych przetargów nie zapisujemy jako zdarzeń: klient liczy je z `tenders.fetchedAt`.
 */
export const EVENTS_COLLECTION = 'events';
/** Wpis wygasa przez TTL na `expireAt`; podsumowanie obejmuje najwyżej ten okres. */
export const EVENT_TTL_DAYS = 30;

export type EventType = 'status_changed' | 'docs_available';

export interface TenderEvent {
  id: string;
  data: {
    type: EventType;
    tenderId: string;
    title: string | null;
    /** Kto wywołał zdarzenie (tylko zmiana statusu); klient pomija własne zdarzenia. */
    actorUid: string | null;
    actorEmail: string | null;
    /** Nowy status (tylko zmiana statusu). */
    status: string | null;
  };
}

type Data = Record<string, unknown>;

const text = (value: unknown): string | null => (typeof value === 'string' && value !== '' ? value : null);
const docsState = (data: Data | undefined): string | null => text((data?.docsCheck as Data | undefined)?.state);

/**
 * Ktoś ustawił albo zmienił status przetargu. Zdjęcie statusu nie jest zdarzeniem.
 * Identyfikator zawiera czas zmiany, więc kolejne zmiany tego samego przetargu to osobne wpisy.
 */
export const statusEvent = (docId: string, before: Data | undefined, after: Data | undefined): TenderEvent | null => {
  const status = text(after?.status);
  if (!after || !status || status === text(before?.status)) return null;
  const at = after.statusAt instanceof Timestamp ? after.statusAt.toMillis() : 'x';
  return {
    id: `status_${docId}_${at}`,
    data: {
      type: 'status_changed',
      tenderId: docId,
      title: text(after.title),
      actorUid: text(after.statusBy),
      actorEmail: text(after.statusByEmail),
      status,
    },
  };
};

/** Sprawdzanie dokumentacji po raz pierwszy znalazło dokumenty (wcześniej ich nie było albo nie dało się ich odczytać). */
export const docsEvent = (docId: string, before: Data | undefined, after: Data | undefined): TenderEvent | null => {
  if (!after || docsState(after) !== 'available' || docsState(before) === 'available') return null;
  return {
    id: `docs_${docId}`,
    data: { type: 'docs_available', tenderId: docId, title: text(after.title), actorUid: null, actorEmail: null, status: null },
  };
};

const expiry = (now: Date): Timestamp => Timestamp.fromMillis(now.getTime() + EVENT_TTL_DAYS * 24 * 60 * 60 * 1000);

/** Zapisuje zdarzenie; gdy wpis o tym identyfikatorze już istnieje (ponowione zdarzenie), nic nie robi. */
export const writeEvent = async (event: TenderEvent, now: Date = new Date()): Promise<boolean> => {
  try {
    await getFirestore()
      .collection(EVENTS_COLLECTION)
      .doc(event.id)
      .create({ ...event.data, createdAt: Timestamp.fromDate(now), expireAt: expiry(now) });
    return true;
  } catch (error) {
    if ((error as { code?: number }).code === 6) return false; // ALREADY_EXISTS
    throw error;
  }
};

/**
 * Jeden trigger na zmianę przetargu zapisuje oba rodzaje zdarzeń (status i dokumenty).
 * Bez `retry`: nowa funkcja z polityką ponowień wymaga `--force` w nieinteraktywnym wdrożeniu CI. Zdarzenia służą
 * tylko do podsumowania, a identyfikatory są deterministyczne, więc ewentualne ponowienie można dodać później.
 */
export const recordTenderEvents = onDocumentUpdated(
  { document: 'tenders/{docId}', region: REGION },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    const docId = event.params.docId;
    for (const item of [statusEvent(docId, before, after), docsEvent(docId, before, after)]) {
      if (item) await writeEvent(item);
    }
  },
);
