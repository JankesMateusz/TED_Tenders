import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';

const NO_DATE = 'Brak daty';
const NO_DEADLINE = 'Brak terminu';

/** Zamienia dzień zapisany w bazie (RRRR-MM-DD) na format wyświetlany w aplikacji (DD-MM-RRRR). */
export const formatDay = (day: unknown, fallback: string): string => {
    const match = typeof day === 'string' ? day.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
    return match ? `${match[3]}-${match[2]}-${match[1]}` : fallback;
};

/** Zamienia dokument z kolekcji `tenders` na przetarg używany przez interfejs. */
export const tenderFromDoc = (data: Record<string, any>): Tender => ({
    publicationNumber: data.publicationNumber,
    title: data.title,
    buyerName: data.buyerName,
    buyerCity: data.buyerCity,
    publicationDate: formatDay(data.publicationDate, NO_DATE),
    publicationTime: data.publicationTime ?? undefined,
    deadlineDate: formatDay(data.deadlineDate, NO_DEADLINE),
    cpvCodes: Array.isArray(data.cpvCodes) ? data.cpvCodes : [],
    link: data.link,
    source: data.source as TenderSource,
    orderType: data.orderType ?? undefined,
    country: data.country,
    buyerMainActivity: data.buyerMainActivity ?? undefined,
    changeNoticeVersionIdentifier: null
});
