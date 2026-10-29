import {
    Unsubscribe,
    collection,
    deleteDoc,
    deleteField,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { Tender } from '../types/Tender';
import { TenderStatus } from '../types/TenderStatus';
import { RefreshLogEntry } from './refreshPlan';
import { favoriteFromDoc, favoriteToDoc, tenderFromDoc } from './tenderMapping';

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
 * Nasłuchuje czasu ostatniego udanego odświeżenia (przez kogokolwiek). `null`, gdy w dzienniku nie ma
 * jeszcze wpisów (wpisy wygasają po miesiącu).
 */
export const subscribeToLastRefresh = (
    onData: (refreshedAt: Date | null) => void,
    onError: (error: Error) => void
): Unsubscribe =>
    onSnapshot(
        query(collection(db, 'refreshLog'), orderBy('refreshedAt', 'desc'), limit(1)),
        (snapshot) => onData(snapshot.empty ? null : snapshot.docs[0].data().refreshedAt.toDate()),
        onError
    );

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
        (snapshot) => onData(snapshot.docs.map((doc) => tenderFromDoc(doc.data(), doc.id))),
        onError
    );

/**
 * Ustawia wspólny status przetargu albo (dla `null`) go zdejmuje. Reguły wymagają, by autorem był
 * zalogowany użytkownik, a czas pochodził z serwera.
 */
export const setTenderStatus = async (
    tenderId: string,
    status: TenderStatus | null,
    user: { uid: string; email: string | null }
): Promise<void> => {
    const ref = doc(db, 'tenders', tenderId);
    if (status === null) {
        await updateDoc(ref, {
            status: deleteField(),
            statusBy: deleteField(),
            statusByEmail: deleteField(),
            statusAt: deleteField()
        });
        return;
    }
    await updateDoc(ref, {
        status,
        statusBy: user.uid,
        statusByEmail: user.email,
        statusAt: serverTimestamp()
    });
};

/** Nasłuchuje gwiazdek użytkownika (kopii przetargów bez ograniczenia czasowego). */
export const subscribeToFavorites = (
    uid: string,
    onData: (tenders: Tender[]) => void,
    onError: (error: Error) => void
): Unsubscribe =>
    onSnapshot(
        collection(db, 'users', uid, 'favorites'),
        (snapshot) => onData(snapshot.docs.map((favorite) => favoriteFromDoc(favorite.data(), favorite.id))),
        onError
    );

export const addFavorite = (uid: string, tender: Tender): Promise<void> =>
    setDoc(doc(db, 'users', uid, 'favorites', tender.id), { ...favoriteToDoc(tender), savedAt: serverTimestamp() });

export const removeFavorite = (uid: string, tenderId: string): Promise<void> =>
    deleteDoc(doc(db, 'users', uid, 'favorites', tenderId));
