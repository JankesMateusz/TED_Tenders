import { DocsCheck, DocsFilter } from '../types/DocsCheck';
import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';

/** Kolejność tablicy to kolejność w menu filtra. */
export const DOCS_FILTERS: DocsFilter[] = ['available', 'none', 'otherPlatform'];

export const DOCS_FILTER_LABELS: Record<DocsFilter, string> = {
    available: 'Są dokumenty',
    none: 'Brak dokumentów',
    otherPlatform: 'Inna platforma'
};

export const isDocsFilter = (value: unknown): value is DocsFilter =>
    typeof value === 'string' && (DOCS_FILTERS as string[]).includes(value);

/** Do którego wyboru filtra „Dokumenty" należy przetarg; błąd sprawdzenia i brak sprawdzenia nie pasują do żadnego. */
export const docsFilterOf = (tender: Tender): DocsFilter | undefined => {
    switch (tender.docsCheck?.state) {
        case 'available':
            return 'available';
        case 'none':
            return 'none';
        case 'unsupported':
        case 'profile':
            return 'otherPlatform';
        default:
            return undefined;
    }
};

const PLATFORM_NAMES: Record<string, string> = {
    ezamowienia: 'eZamówienia',
    platformazakupowa: 'platformazakupowa.pl',
    bazakonkurencyjnosci: 'Baza Konkurencyjności'
};

/** Nazwa platformy do wyświetlenia: znana z adaptera, a dla nieobsługiwanych host adresu. */
export const platformName = (check: Pick<DocsCheck, 'platform' | 'sourceUrl'>): string => {
    if (check.platform && PLATFORM_NAMES[check.platform]) return PLATFORM_NAMES[check.platform];
    if (check.sourceUrl) {
        try {
            return new URL(check.sourceUrl).hostname.replace(/^www\./, '');
        } catch {
            // adres nieparsowalny: spadamy do ogólnej nazwy
        }
    }
    return 'innej platformie';
};

/** 1 plik, 2–4 pliki, 5+ i 12–14 plików. */
export const pluralizeFiles = (count: number): string => {
    const lastTwo = count % 100;
    const last = count % 10;
    if (count === 1) return 'plik';
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return 'pliki';
    return 'plików';
};

const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** „12:42" dla dzisiejszej godziny, „09.11 09:00" dla innego dnia. */
export const formatCheckTime = (at: Date, now: Date = new Date()): string => {
    const time = at.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    if (isSameDay(at, now)) return time;
    return `${at.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })} ${time}`;
};

/** Przetarg zapisany przed chwilą: sprawdzenie jest w drodze, więc pokazujemy „sprawdzam", a nie „nie sprawdzono". */
const RECENT_MS = 30 * 60 * 1000;

export type DocsBadgeTone = 'neutral' | 'warn';

export interface DocsBadgeInfo {
    text: string;
    /** Pełny opis w podpowiedzi. */
    title: string;
    /** Czy pokazać przycisk „Sprawdź teraz" (sprawdzenie ma sens, gdy dokumentów brak lub stan nieznany). */
    canCheckNow: boolean;
    tone: DocsBadgeTone;
}

/**
 * Dokąd prowadzi odnośnik do dokumentacji przetargu (przycisk na karcie i kopiowanie linków). Kolejność:
 * adres od zamawiającego (TED), potem strona postępowania ustalona przy sprawdzaniu (dla eZamówień to jedyne źródło),
 * a dla Bazy Konkurencyjności strona ogłoszenia, bo tam leży dokumentacja. Brak adresu to brak odnośnika, bez zgadywania.
 */
export const docsLinkUrl = (tender: Tender): string | undefined => {
    const url = tender.documentsUrl
        ?? tender.docsCheck?.sourceUrl
        ?? (tender.source === TenderSource.BAZA_KONKURENCYJNOSCI ? tender.link : undefined);
    return url && toPublicEzamowieniaUrl(url);
};

/**
 * Zamawiający wklejają do ogłoszeń adres z własnego panelu eZamówień (`/mp-client/tenders/<id>`), który bez
 * logowania przekierowuje na stronę logowania. Te same dokumenty są publicznie pod `/mp-client/search/list/<id>`.
 * Inne adresy zostają bez zmian.
 */
export const toPublicEzamowieniaUrl = (url: string): string => {
    try {
        const parsed = new URL(url);
        const match = parsed.pathname.match(/^\/mp-client\/tenders\/(ocds-[A-Za-z0-9-]+)/);
        if (parsed.hostname === 'ezamowienia.gov.pl' && match) return `${parsed.origin}/mp-client/search/list/${match[1]}`;
    } catch {
        // adres nieparsowalny zostaje jak był
    }
    return url;
};

const FINAL_CHECK_NOTE = 'Automatyczne sprawdzanie zakończone.';

/**
 * Treść plakietki stanu dokumentów na karcie przetargu (plan 3.7 i 12.2). Zwraca null, gdy plakietki nie ma:
 * automatyczne sprawdzanie dotyczy tylko przetargów IT (albo takich, które już mają wynik).
 */
export const docsBadge = (tender: Tender, now: Date = new Date()): DocsBadgeInfo | null => {
    const check = tender.docsCheck;
    if (!check) {
        if (!tender.isIT) return null;
        const justAdded = tender.fetchedAt !== undefined && now.getTime() - tender.fetchedAt.getTime() < RECENT_MS;
        return justAdded
            ? { text: '📄 sprawdzam dokumenty…', title: 'Automatyczne sprawdzanie dokumentów rozpocznie się za chwilę.', canCheckNow: true, tone: 'neutral' }
            : { text: '📄 dokumenty nie były sprawdzane', title: 'Ten przetarg nie był jeszcze automatycznie sprawdzany pod kątem dokumentów.', canCheckNow: true, tone: 'neutral' };
    }

    const checkedAt = check.checkedAt ? `Ostatnie sprawdzenie: ${formatCheckTime(check.checkedAt, now)}.` : '';
    const progress = check.checks ? ` Sprawdzeń: ${check.checks}.` : '';
    const next = check.nextCheckAt
        ? `Następne sprawdzenie: ${formatCheckTime(check.nextCheckAt, now)}.`
        : FINAL_CHECK_NOTE;

    switch (check.state) {
        case 'available': {
            const count = check.fileCount ?? 0;
            const files = `${count} ${pluralizeFiles(count)}`;
            return {
                text: `📄 ${files} · ${platformName(check)}`,
                title: `Dokumentacja jest dostępna na platformie (${platformName(check)}). ${checkedAt} Sama lista plików nie dowodzi, że dokumentacja jest kompletna.`.trim(),
                canCheckNow: false,
                tone: 'neutral'
            };
        }
        case 'none':
            return {
                text: check.nextCheckAt
                    ? `📄 brak dokumentów · następne sprawdzenie ${formatCheckTime(check.nextCheckAt, now)}`
                    : `📄 brak dokumentów · sprawdzono ${check.checkedAt ? formatCheckTime(check.checkedAt, now) : ''}`.trim(),
                title: `Zamawiający nie dodał jeszcze plików. ${checkedAt}${progress} ${next}`.trim(),
                canCheckNow: true,
                tone: 'warn'
            };
        case 'unsupported':
        case 'profile': {
            const where = platformName(check);
            return {
                text: `📄 dokumenty na ${where}`,
                title: check.state === 'profile'
                    ? 'Link prowadzi do profilu zamawiającego, a nie do konkretnego postępowania. Dokumentów nie sprawdzamy automatycznie.'
                    : 'Dokumentacja leży na platformie, której nie sprawdzamy automatycznie.',
                canCheckNow: false,
                tone: 'neutral'
            };
        }
        case 'error':
            return {
                text: check.nextCheckAt
                    ? `📄 nie udało się sprawdzić · ponowię ${formatCheckTime(check.nextCheckAt, now)}`
                    : '📄 nie udało się sprawdzić dokumentów',
                title: `Platforma nie odpowiedziała poprawnie, więc nie wiadomo, czy są dokumenty. ${checkedAt}${progress} ${next}`.trim(),
                canCheckNow: true,
                tone: 'warn'
            };
    }
};
