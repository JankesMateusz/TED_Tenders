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

export const isTenderStatus = (value: unknown): value is TenderStatus =>
    typeof value === 'string' && (TENDER_STATUSES as string[]).includes(value);

/** Podpowiedź przy statusie: kto go ustawił i kiedy, np. "Do wpisania: anna@example.com, 29.10.2026 14:32". */
export const statusTooltip = (status: TenderStatus, byEmail?: string, at?: Date): string => {
    const author = byEmail ?? 'nieznany użytkownik';
    const when = at
        ? `, ${at.toLocaleDateString('pl-PL')} ${at.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
        : '';
    return `${STATUS_CONFIG[status].label}: ${author}${when}`;
};
