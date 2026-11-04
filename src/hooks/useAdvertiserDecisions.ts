import { useCallback, useEffect, useState } from 'react';
import { Tender } from '../types/Tender';
import { GUEST_LABEL, useAuth } from '../context/AuthContext';
import { AdvertiserDecision, AdvertiserDecisions } from '../utils/advertisers';
import { setAdvertiserDecision, subscribeToAdvertiserDecisions } from '../utils/tendersApi';

const LOAD_ERROR = 'Nie udało się wczytać listy ukrytych zamawiających.';
const SAVE_ERROR = 'Nie udało się zapisać decyzji o zamawiającym. Spróbuj ponownie.';

/**
 * Ręczne decyzje o ukrywaniu zamawiających (wspólne dla wszystkich osób, nasłuch na żywo) oraz zapis nowej decyzji.
 * Decyzja dotyczy zamawiającego (po NIP), więc obejmuje wszystkie jego ogłoszenia, także przyszłe.
 */
export const useAdvertiserDecisions = () => {
    const { user } = useAuth();
    const uid = user?.uid ?? null;
    const email = user ? user.email ?? GUEST_LABEL : null;
    const [decisions, setDecisions] = useState<AdvertiserDecisions>({});
    const [advertiserError, setAdvertiserError] = useState<string | null>(null);

    useEffect(() => {
        setDecisions({});
        if (!uid) return;
        return subscribeToAdvertiserDecisions(setDecisions, (error) => {
            console.error('Błąd wczytywania decyzji o zamawiających:', error);
            setAdvertiserError(LOAD_ERROR);
        });
    }, [uid]);

    /** Ukrywa lub przywraca zamawiającego ogłoszenia; bez NIP-u nie robi nic. */
    const setDecision = useCallback(async (tender: Tender, decision: AdvertiserDecision): Promise<void> => {
        if (!uid || !tender.buyerNip) return;
        setAdvertiserError(null);
        try {
            await setAdvertiserDecision(tender.buyerNip, tender.buyerName, decision, { uid, email });
        } catch (error) {
            console.error('Błąd zapisu decyzji o zamawiającym:', error);
            setAdvertiserError(SAVE_ERROR);
        }
    }, [uid, email]);

    return { advertiserDecisions: decisions, advertiserError, setAdvertiserDecision: setDecision };
};
