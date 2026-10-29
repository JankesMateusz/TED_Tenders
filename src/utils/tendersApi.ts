import { Unsubscribe, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { Tender } from '../types/Tender';
import { RefreshLogEntry } from './refreshPlan';
import { tenderFromDoc } from './tenderMapping';

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

/** Wpisy dziennika odświeżeń (które dni były już pobrane) dla dni z podanego zakresu, kluczem jest dzień. */
export const fetchRefreshLog = async (startDay: string, endDay: string): Promise<Record<string, RefreshLogEntry>> => {
    const snapshot = await getDocs(
        query(collection(db, 'refreshLog'), where('day', '>=', startDay), where('day', '<=', endDay))
    );
    const log: Record<string, RefreshLogEntry> = {};
    snapshot.forEach((doc) => {
        log[doc.data().day] = { complete: doc.data().complete === true };
    });
    return log;
};

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
