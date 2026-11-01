import { useEffect, useState } from 'react';
import { Timestamp, collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

/** Jak często zalogowana karta zgłasza obecność. */
const HEARTBEAT_MS = 60 * 1000;
/** Po tylu ms bez pulsu osoba nie jest już liczona jako będąca na stronie. */
export const ONLINE_WINDOW_MS = 150 * 1000;
/** Dokument obecności sprząta TTL po tym czasie (reguły dopuszczają najwyżej 2 godziny). */
const DOC_TTL_MS = 60 * 60 * 1000;

/** Zgłasza obecność bieżącej karty w `presence/{uid}` (puls co minutę, tylko przy widocznej karcie). */
export const useReportPresence = (): void => {
    const { user } = useAuth();
    const uid = user?.uid;
    const isAnonymous = user?.isAnonymous ?? true;
    const email = user?.email ?? null;

    useEffect(() => {
        if (!uid) return;
        const ref = doc(db, 'presence', uid);

        const beat = () => {
            if (document.visibilityState !== 'visible') return;
            const data: Record<string, unknown> = {
                lastSeen: serverTimestamp(),
                expireAt: Timestamp.fromMillis(Date.now() + DOC_TTL_MS),
                isAnonymous
            };
            if (!isAnonymous && email) data.email = email;
            setDoc(ref, data).catch((error) => console.warn('Zgłoszenie obecności nie powiodło się:', error));
        };

        beat();
        const timer = window.setInterval(beat, HEARTBEAT_MS);
        document.addEventListener('visibilitychange', beat);
        return () => {
            window.clearInterval(timer);
            document.removeEventListener('visibilitychange', beat);
        };
    }, [uid, isAnonymous, email]);
};

export interface OnlineEntry {
    uid: string;
    isAnonymous: boolean;
    email: string | null;
    lastSeen: Date;
}

/** Na żywo lista osób na stronie (tylko dla admina: inni nie mają odczytu `presence`). */
export const useOnlineUsers = (enabled: boolean): OnlineEntry[] => {
    const [entries, setEntries] = useState<OnlineEntry[]>([]);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!enabled) return;
        const unsubscribe = onSnapshot(
            collection(db, 'presence'),
            (snapshot) => {
                setEntries(
                    snapshot.docs.flatMap((d) => {
                        const data = d.data();
                        const lastSeen = (data.lastSeen as Timestamp | null)?.toDate();
                        if (!lastSeen) return [];
                        return [{
                            uid: d.id,
                            isAnonymous: Boolean(data.isAnonymous),
                            email: (data.email as string | undefined) ?? null,
                            lastSeen
                        }];
                    })
                );
            },
            (error) => console.error('Nie udało się odczytać obecności:', error)
        );
        const timer = window.setInterval(() => setNow(Date.now()), 30 * 1000);
        return () => {
            unsubscribe();
            window.clearInterval(timer);
        };
    }, [enabled]);

    return entries
        .filter((entry) => now - entry.lastSeen.getTime() <= ONLINE_WINDOW_MS)
        .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
};
