import { TenderLabel } from '../types/TenderLabel';

export interface LabelConfig {
    label: string;
    color: string;
}

/** Kolejność tablicy to kolejność w menu i na karcie. */
export const TENDER_LABELS: TenderLabel[] = ['important', 'simple', 'hard', 'missingDocs'];

export const LABEL_CONFIG: Record<TenderLabel, LabelConfig> = {
    important: { label: 'WAŻNY!', color: '#d63384' },
    simple: { label: 'PROSTY', color: '#16a085' },
    hard: { label: 'TRUDNY', color: '#8e44ad' },
    missingDocs: { label: 'BRAK DOKUMENTÓW', color: '#6c757d' }
};

/** Etykiety, które nie mogą występować razem (reguły Firestore pilnują tego samego). */
const EXCLUSIVE: Partial<Record<TenderLabel, TenderLabel>> = { simple: 'hard', hard: 'simple' };

export const isTenderLabel = (value: unknown): value is TenderLabel =>
    typeof value === 'string' && (TENDER_LABELS as string[]).includes(value);

/** Z surowej tablicy z bazy zostawia znane, niepowtarzające się etykiety w stałej kolejności. */
export const normalizeLabels = (value: unknown): TenderLabel[] => {
    if (!Array.isArray(value)) return [];
    return TENDER_LABELS.filter((label) => value.includes(label));
};

/** Dodaje etykietę (zdejmując wykluczającą ją) albo, gdy już jest, ją zdejmuje. */
export const toggleLabel = (current: TenderLabel[], label: TenderLabel): TenderLabel[] => {
    if (current.includes(label)) return current.filter((item) => item !== label);
    const rival = EXCLUSIVE[label];
    return TENDER_LABELS.filter((item) => item === label || (item !== rival && current.includes(item)));
};
