import { STATUS_CONFIG, isTenderStatus } from './tenderStatus';

/** Podsumowanie „od ostatniej wizyty” jest ukryte, dopóki nie włączymy go flagą (domyślnie tylko środowisko testowe). */
export const AWAY_SUMMARY_ENABLED = process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true';

/** Krótsza nieobecność (przełączenie na inną kartę) nie wywołuje podsumowania: zmiany spływają na żywo. */
export const MIN_AWAY_MS = 5 * 60 * 1000;
/** Ile najnowszych zdarzeń pobieramy do podsumowania (limit kosztu odczytu). */
export const MAX_EVENTS = 100;
/** Jak często aktywna karta odświeża `lastSeenAt` (żeby zamknięcie karty bez zdarzenia nie zawyżało nieobecności). */
export const HEARTBEAT_MS = 60 * 1000;

export type AwayEventType = 'status_changed' | 'docs_available';

export interface AwayEvent {
    id: string;
    type: AwayEventType;
    tenderId: string;
    title: string | null;
    actorUid: string | null;
    actorEmail: string | null;
    status: string | null;
}

export interface AwaySummary {
    since: Date;
    /** Zmiany statusu zrobione przez inne osoby. */
    statusChanges: AwayEvent[];
    docsAvailable: AwayEvent[];
}

export const isAwayLongEnough = (lastSeen: Date | null, now: Date): boolean =>
    lastSeen !== null && now.getTime() - lastSeen.getTime() >= MIN_AWAY_MS;

/**
 * Składa podsumowanie. Własne zmiany statusu są pomijane. Gdy przetarg zmienił status kilka razy,
 * zostaje tylko ostatnia zmiana (zdarzenia przychodzą od najnowszych).
 */
export const buildSummary = (since: Date, events: AwayEvent[], ownUid: string): AwaySummary => {
    const seenStatus = new Set<string>();
    const statusChanges: AwayEvent[] = [];
    const docsAvailable: AwayEvent[] = [];
    for (const event of events) {
        if (event.type === 'status_changed') {
            if (event.actorUid === ownUid || seenStatus.has(event.tenderId)) continue;
            seenStatus.add(event.tenderId);
            statusChanges.push(event);
        } else if (event.type === 'docs_available') {
            docsAvailable.push(event);
        }
    }
    return { since, statusChanges, docsAvailable };
};

/** Czy przetarg pobrano po ostatniej wizycie (plakietka „Nowy”). Bez punktu odniesienia albo bez daty pobrania: nie. */
export const isNewSince = (fetchedAt: Date | undefined, since: Date | null): boolean =>
    fetchedAt !== undefined && since !== null && fetchedAt.getTime() > since.getTime();

/** Ile przetargów z podanej listy jest „nowych” (te same, które dostają plakietkę „Nowy”). */
export const countNewSince = (tenders: { fetchedAt?: Date }[], since: Date | null): number =>
    tenders.reduce((count, tender) => (isNewSince(tender.fetchedAt, since) ? count + 1 : count), 0);

/** Nowe przetargi liczy lista (z jej filtrami), więc baner jest pusty dopiero, gdy nie ma też ich. */
export const isSummaryEmpty = (summary: AwaySummary, newTenders: number): boolean =>
    newTenders === 0 && summary.statusChanges.length === 0 && summary.docsAvailable.length === 0;

/** Odmiana rzeczownika po liczbie: 1 przetarg, 2–4 przetargi, 5+ przetargów (z wyjątkiem 12–14). */
export const pluralPl = (count: number, one: string, few: string, many: string): string => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (count === 1) return one;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
    return many;
};

export const statusLabel = (status: string | null): string =>
    isTenderStatus(status) ? STATUS_CONFIG[status].label : 'nowy status';

/** Jak dawno, np. "15 min", "3 godz.", "2 dni"; do podpisu „od Twojej ostatniej wizyty”. */
export const formatAway = (since: Date, now: Date): string => {
    const minutes = Math.max(1, Math.round((now.getTime() - since.getTime()) / 60000));
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 48) return `${hours} godz.`;
    return `${Math.round(hours / 24)} dni`;
};
