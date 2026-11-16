import { TenderStatus } from '../types/TenderStatus';

export interface StatusConfig {
    label: string;
    icon: string;
    color: string;
}

/** Kolejność tablicy to kolejność przycisków na karcie i filtrów. */
export const TENDER_STATUSES: TenderStatus[] = ['toEnter', 'entered', 'toClarify', 'notToEnter'];

export const STATUS_CONFIG: Record<TenderStatus, StatusConfig> = {
    toEnter: { label: 'Do wpisania', icon: '✎', color: '#3498db' },
    entered: { label: 'Wpisany', icon: '✓', color: '#2ecc71' },
    toClarify: { label: 'Do wyjaśnienia', icon: '?', color: '#f39c12' },
    notToEnter: { label: 'Nie do wpisania', icon: '✕', color: '#e74c3c' }
};

/** Kolor filtra "Nieoznaczone" (przetarg bez statusu). */
export const UNMARKED_COLOR = '#7f8c8d';

export const isTenderStatus = (value: unknown): value is TenderStatus =>
    typeof value === 'string' && (TENDER_STATUSES as string[]).includes(value);

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Podpis pod statusem na karcie, np. "anna@example.com, 29.10 14:32"; bez daty zostaje sam autor. */
export const statusAuthorCaption = (byEmail?: string, at?: Date): string => {
    const author = byEmail ?? 'nieznany użytkownik';
    if (!at) return author;
    return `${author}, ${pad2(at.getDate())}.${pad2(at.getMonth() + 1)} ${pad2(at.getHours())}:${pad2(at.getMinutes())}`;
};

/**
 * Komunikat po zmianie statusu. Gdy zastępujemy status ustawiony przez kogoś innego, podaje jego autora,
 * żeby nadpisanie cudzej decyzji nie przechodziło bez śladu.
 */
export const describeStatusChange = (
    previous: { status?: TenderStatus; byEmail?: string },
    next: TenderStatus | null,
    myEmail: string | null
): string => {
    const previousLabel = previous.status ? STATUS_CONFIG[previous.status].label : null;
    const byOther = previous.byEmail !== myEmail;
    const author = previous.byEmail ?? 'nieznany użytkownik';
    if (next === null) {
        if (!previousLabel) return 'Usunięto status.';
        return byOther ? `Usunięto status „${previousLabel}”, ustawiony przez ${author}.` : `Usunięto status „${previousLabel}”.`;
    }
    const base = `Status: ${STATUS_CONFIG[next].label}.`;
    if (!previousLabel) return base;
    return byOther ? `${base} Zastąpiono „${previousLabel}” ustawiony przez ${author}.` : `${base} Wcześniej: „${previousLabel}”.`;
};

/** Podpowiedź przy statusie: kto go ustawił i kiedy, np. "Do wpisania: anna@example.com, 29.10.2026 14:32". */
export const statusTooltip = (status: TenderStatus, byEmail?: string, at?: Date): string => {
    const author = byEmail ?? 'nieznany użytkownik';
    const when = at
        ? `, ${at.toLocaleDateString('pl-PL')} ${at.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
        : '';
    return `${STATUS_CONFIG[status].label}: ${author}${when}`;
};
