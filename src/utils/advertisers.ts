import { Tender } from '../types/Tender';

/** Sektor zamawiającego ustalany automatycznie przez serwer (functions/tenders/sector.ts). */
export type BuyerSector = 'public' | 'municipal' | 'ngo' | 'private' | 'unknown';

/** Ręczna decyzja o zamawiającym; brak decyzji oznacza, że rozstrzyga sektor automatyczny. */
export type AdvertiserDecision = 'hidden' | 'visible';

/** Decyzje wszystkich osób, kluczem jest NIP zamawiającego. */
export type AdvertiserDecisions = Record<string, AdvertiserDecision>;

/** Sektory, które analityczka domyślnie ukrywa (nie obsługuje firm prywatnych i organizacji pozarządowych). */
const AUTO_HIDDEN_SECTORS: BuyerSector[] = ['private', 'ngo'];

export const isAdvertiserDecision = (value: unknown): value is AdvertiserDecision =>
    value === 'hidden' || value === 'visible';

/**
 * Czy ogłoszenie jest ukryte ze względu na zamawiającego. Ręczna decyzja zawsze wygrywa z automatem.
 * Ogłoszenia bez NIP-u (TED, eZamówienia) nie są nigdy ukrywane, bo nie dałoby się ich przywrócić.
 */
export const isHiddenAdvertiser = (tender: Tender, decisions: AdvertiserDecisions = {}): boolean => {
    if (!tender.buyerNip) return false;
    const decision = decisions[tender.buyerNip];
    if (decision) return decision === 'hidden';
    return tender.buyerSectorAuto !== undefined && AUTO_HIDDEN_SECTORS.includes(tender.buyerSectorAuto);
};
