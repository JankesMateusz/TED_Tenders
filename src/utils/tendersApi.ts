import { Unsubscribe, collection, onSnapshot, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { Tender } from '../types/Tender';
import { addDays, toDayString } from './dateUtils';
import { tenderFromDoc } from './tenderMapping';

/** Ile dni wstecz serwer pozwala odświeżać (functions/tenders/refresh.ts). */
const MAX_REFRESH_PAST_DAYS = 31;

export interface RefreshResult {
    date: string;
    fetched: Record<string, number>;
    created: Record<string, number>;
    existing: number;
    /** Źródła, które nie odpowiedziały (przetargi z pozostałych zostały zapisane). */
    errors: string[];
}

const refreshTendersCallable = httpsCallable<{ date: string }, RefreshResult>(functions, 'refreshTenders');

/** Prosi serwer o pobranie przetargów z danego dnia (RRRR-MM-DD) i dopisanie nowych do bazy. */
export const refreshTendersForDay = async (day: string): Promise<RefreshResult> =>
    (await refreshTendersCallable({ date: day })).data;

/** Czy serwer przyjmie odświeżenie tego dnia (nie z przyszłości i nie starsze niż miesiąc). */
export const canRefreshDay = (day: string, today: string = toDayString(new Date())): boolean =>
    day <= today && day >= addDays(today, -MAX_REFRESH_PAST_DAYS);

/**
 * Nasłuchuje przetargów opublikowanych w podanym zakresie dni (włącznie). Zmiany, także od innych
 * użytkowników, trafiają do `onData` na bieżąco.
 */
export const subscribeToTenders = (
    startDay: string,
    endDay: string,
    onData: (tenders: Tender[]) => void,
    onError: (error: Error) => void
): Unsubscribe =>
    onSnapshot(
        query(collection(db, 'tenders'), where('publicationDate', '>=', startDay), where('publicationDate', '<=', endDay)),
        (snapshot) => onData(snapshot.docs.map((doc) => tenderFromDoc(doc.data()))),
        onError
    );
