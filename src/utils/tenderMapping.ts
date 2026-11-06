import { Tender } from '../types/Tender';
import { TenderComment } from '../types/TenderComment';
import { TenderSource } from '../types/TenderSource';
import { isTenderStatus } from './tenderStatus';
import { normalizeLabels } from './tenderLabels';
import { DocsCheck, DocsCheckState } from '../types/DocsCheck';

const NO_DATE = 'Brak daty';
const NO_DEADLINE = 'Brak terminu';

/** Zamienia dzień zapisany w bazie (RRRR-MM-DD) na format wyświetlany w aplikacji (DD-MM-RRRR). */
export const formatDay = (day: unknown, fallback: string): string => {
    const match = typeof day === 'string' ? day.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
    return match ? `${match[3]}-${match[2]}-${match[1]}` : fallback;
};

/** Data z pola Firestore (Timestamp, a w kopii ulubionych także Date); brak lub błędna wartość to undefined. */
const dateFromTimestamp = (value: any): Date | undefined => {
    if (typeof value?.toDate === 'function') return value.toDate();
    return value instanceof Date ? value : undefined;
};

/** Pola statusu z dokumentu; nieznana wartość jest ignorowana. `statusAt` bywa chwilowo puste, zanim serwer nada czas. */
const statusFromDoc = (data: Record<string, any>): Pick<Tender, 'status' | 'statusByEmail' | 'statusAt'> => {
    if (!isTenderStatus(data.status)) return {};
    return {
        status: data.status,
        statusByEmail: data.statusByEmail ?? undefined,
        statusAt: typeof data.statusAt?.toDate === 'function' ? data.statusAt.toDate() : undefined
    };
};

/** Pola etykiet z dokumentu; brak znanych etykiet oznacza przetarg bez etykiet. */
const labelsFromDoc = (data: Record<string, any>): Pick<Tender, 'labels' | 'labelsByEmail' | 'labelsAt'> => {
    const labels = normalizeLabels(data.labels);
    if (labels.length === 0) return {};
    return {
        labels,
        labelsByEmail: data.labelsByEmail ?? undefined,
        labelsAt: typeof data.labelsAt?.toDate === 'function' ? data.labelsAt.toDate() : undefined
    };
};

const DOCS_CHECK_STATES: DocsCheckState[] = ['none', 'available', 'unsupported', 'profile', 'error'];

/** Pole `docsCheck` z dokumentu; nieznany stan oznacza brak informacji (przetarg wygląda na niesprawdzony). */
const docsCheckFromDoc = (value: any): DocsCheck | undefined => {
    if (!value || !DOCS_CHECK_STATES.includes(value.state)) return undefined;
    return {
        state: value.state,
        platform: value.platform ?? undefined,
        sourceUrl: value.sourceUrl ?? undefined,
        fileCount: typeof value.fileCount === 'number' ? value.fileCount : undefined,
        checks: typeof value.checks === 'number' ? value.checks : undefined,
        checkedAt: dateFromTimestamp(value.checkedAt),
        nextCheckAt: dateFromTimestamp(value.nextCheckAt)
    };
};

const docsCheckField = (value: any): Pick<Tender, 'docsCheck'> => {
    const docsCheck = docsCheckFromDoc(value);
    return docsCheck ? { docsCheck } : {};
};

/** Zamienia dokument z kolekcji `tenders` (o podanym identyfikatorze) na przetarg używany przez interfejs. */
export const tenderFromDoc = (data: Record<string, any>, id: string): Tender => ({
    id,
    publicationNumber: data.publicationNumber,
    title: data.title,
    buyerName: data.buyerName,
    buyerCity: data.buyerCity,
    publicationDate: formatDay(data.publicationDate, NO_DATE),
    publicationTime: data.publicationTime ?? undefined,
    deadlineDate: formatDay(data.deadlineDate, NO_DEADLINE),
    cpvCodes: Array.isArray(data.cpvCodes) ? data.cpvCodes : [],
    link: data.link,
    documentsUrl: data.documentsUrl ?? undefined,
    referenceNumber: data.referenceNumber ?? undefined,
    source: data.source as TenderSource,
    orderType: data.orderType ?? undefined,
    country: data.country,
    buyerMainActivity: data.buyerMainActivity ?? undefined,
    fetchedAt: dateFromTimestamp(data.fetchedAt),
    buyerNip: data.buyerNip ?? undefined,
    buyerSectorAuto: data.buyerSectorAuto ?? undefined,
    changeNoticeVersionIdentifier: null,
    ...(data.isIT === true && { isIT: true }),
    ...docsCheckField(data.docsCheck),
    ...statusFromDoc(data),
    ...labelsFromDoc(data)
});

/**
 * Kopia przetargu zapisywana przy oznaczeniu gwiazdką (`users/{uid}/favorites`). Ma format interfejsu,
 * bo służy tylko do wyświetlenia. Bez statusu i etykiet wspólnych (te żyją w `tenders`) i bez pól `undefined`,
 * których Firestore nie przyjmuje.
 */
export const favoriteToDoc = (tender: Tender): Record<string, unknown> => {
    const { id, status, statusByEmail, statusAt, labels, labelsByEmail, labelsAt, docsCheck, isIT, ...copy } = tender;
    return Object.fromEntries(Object.entries(copy).filter(([, value]) => value !== undefined));
};

export const favoriteFromDoc = (data: Record<string, any>, id: string): Tender => ({
    id,
    publicationNumber: data.publicationNumber,
    title: data.title,
    buyerName: data.buyerName,
    buyerCity: data.buyerCity,
    publicationDate: data.publicationDate,
    publicationTime: data.publicationTime,
    deadlineDate: data.deadlineDate,
    cpvCodes: Array.isArray(data.cpvCodes) ? data.cpvCodes : [],
    link: data.link,
    documentsUrl: data.documentsUrl ?? undefined,
    referenceNumber: data.referenceNumber ?? undefined,
    source: data.source as TenderSource,
    orderType: data.orderType,
    country: data.country,
    buyerMainActivity: data.buyerMainActivity,
    fetchedAt: dateFromTimestamp(data.fetchedAt),
    buyerNip: data.buyerNip ?? undefined,
    buyerSectorAuto: data.buyerSectorAuto ?? undefined,
    changeNoticeVersionIdentifier: null
});

/** Zamienia dokument z kolekcji `comments`. `createdAt` bywa chwilowo puste, zanim serwer nada czas (wtedy bierzemy bieżący). */
export const commentFromDoc = (data: Record<string, any>, id: string): TenderComment => ({
    id,
    tenderId: data.tenderId,
    text: data.text,
    authorUid: data.authorUid,
    authorEmail: data.authorEmail,
    createdAt: typeof data.createdAt?.toDate === 'function' ? data.createdAt.toDate() : new Date()
});
