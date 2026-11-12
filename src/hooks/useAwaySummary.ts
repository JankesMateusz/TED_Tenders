import { useCallback, useEffect, useState } from 'react';
import {
    Timestamp, collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
    AWAY_SUMMARY_ENABLED, AwayEvent, AwaySummary, HEARTBEAT_MS, MAX_EVENTS, buildSummary, isAwayLongEnough, isSummaryEmpty
} from '../utils/awaySummary';

/**
 * Podsumowanie „od ostatniej wizyty”: po powrocie na kartę (albo po wejściu do aplikacji) po dłuższej nieobecności
 * zlicza, co się zmieniło od `userState/{uid}.lastSeenAt`. Moment opuszczenia karty zapisujemy przy ukryciu,
 * a w trakcie pracy odświeżamy go co minutę (na wypadek zamknięcia karty bez zdarzenia).
 */
export const useAwaySummary = (): { summary: AwaySummary | null; dismiss: () => void } => {
    const { user } = useAuth();
    const uid = user?.uid;
    const [summary, setSummary] = useState<AwaySummary | null>(null);
    const dismiss = useCallback(() => setSummary(null), []);

    useEffect(() => {
        if (!AWAY_SUMMARY_ENABLED || !uid) return;
        const stateRef = doc(db, 'userState', uid);
        let cancelled = false;
        // Dopóki trwa sprawdzanie, nie nadpisujemy `lastSeenAt` (inaczej podsumowanie liczyłoby od „teraz”)
        let checking = false;

        const markSeen = () =>
            setDoc(stateRef, { lastSeenAt: serverTimestamp() }).catch((error) =>
                console.warn('Zapis ostatniej wizyty nie powiódł się:', error)
            );

        const check = async () => {
            if (checking) return;
            checking = true;
            try {
                const lastSeen = ((await getDoc(stateRef)).data()?.lastSeenAt as Timestamp | undefined)?.toDate() ?? null;
                if (cancelled || !lastSeen || !isAwayLongEnough(lastSeen, new Date())) return;

                const since = Timestamp.fromDate(lastSeen);
                const [newTenders, events] = await Promise.all([
                    getCountFromServer(query(collection(db, 'tenders'), where('fetchedAt', '>', since))),
                    getDocs(query(collection(db, 'events'), where('createdAt', '>', since), orderBy('createdAt', 'desc'), limit(MAX_EVENTS)))
                ]);
                if (cancelled) return;
                const result = buildSummary(
                    lastSeen,
                    newTenders.data().count,
                    events.docs.map((d) => ({ id: d.id, ...d.data() }) as AwayEvent),
                    uid
                );
                setSummary(isSummaryEmpty(result) ? null : result);
            } catch (error) {
                console.warn('Nie udało się przygotować podsumowania od ostatniej wizyty:', error);
            } finally {
                checking = false;
                if (!cancelled && document.visibilityState === 'visible') markSeen();
            }
        };

        const onVisibility = () => {
            if (document.visibilityState === 'hidden') {
                if (!checking) markSeen();
            } else {
                check();
            }
        };

        check();
        const timer = window.setInterval(() => {
            if (document.visibilityState === 'visible' && !checking) markSeen();
        }, HEARTBEAT_MS);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [uid]);

    return { summary, dismiss };
};
