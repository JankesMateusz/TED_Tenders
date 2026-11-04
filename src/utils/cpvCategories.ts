import { isItRelatedCpv, normalizeCpv } from './cpvFilter';

/**
 * Kategorie "co jest zamawiane", do których grupujemy kody CPV z listy IT (src/utils/cpvCodes.ts).
 * Kolejność ma znaczenie: kod trafia do pierwszej kategorii, której prefiks pasuje, więc węższe prefiksy
 * stoją przed szerszymi (np. 30231 "monitory" przed 3023 "sprzęt związany z komputerami").
 * Zmiana podziału to edycja tej jednej tabeli.
 */
const CATEGORIES = [
    { key: 'computers', label: 'Komputery i stacje robocze', prefixes: ['3020', '3021'] },
    { key: 'displays', label: 'Monitory i wyświetlacze', prefixes: ['30231'] },
    { key: 'printing', label: 'Drukarki, kopiarki i materiały eksploatacyjne', prefixes: ['301', '30192', '302321', '42962'] },
    { key: 'scanners', label: 'Skanery i czytniki', prefixes: ['30216', '385'] },
    { key: 'storage', label: 'Pamięć masowa i pozostały sprzęt komputerowy', prefixes: ['3022', '3023'] },
    { key: 'network', label: 'Sieci i telekomunikacja', prefixes: ['322', '324', '325', '642', '50330'] },
    { key: 'multimedia', label: 'Multimedia i wideo', prefixes: ['323'] },
    { key: 'software', label: 'Oprogramowanie i jego wdrożenia', prefixes: ['48', '722'] },
    { key: 'service', label: 'Serwis, konserwacja i doradztwo IT', prefixes: ['503', '721', '726'] }
] as const;

export type CpvCategoryKey = (typeof CATEGORIES)[number]['key'] | 'other';

const OTHER = { key: 'other' as const, label: 'Pozostałe (np. pomoce dydaktyczne)' };

export const CPV_CATEGORY_LABELS: Record<CpvCategoryKey, string> = {
    ...(Object.fromEntries(CATEGORIES.map(({ key, label }) => [key, label])) as Record<string, string>),
    [OTHER.key]: OTHER.label
} as Record<CpvCategoryKey, string>;

export const getCpvCategory = (code: string): CpvCategoryKey => {
    const normalized = normalizeCpv(code);
    const match = CATEGORIES.find(({ prefixes }) => prefixes.some((prefix) => normalized.startsWith(prefix)));
    return match ? match.key : OTHER.key;
};

/** Kategorie, do których należą kody IT przetargu; kilka kodów z jednej kategorii liczy się raz. */
export const getTenderCpvCategories = (cpvCodes: string[]): CpvCategoryKey[] =>
    Array.from(new Set(cpvCodes.filter(isItRelatedCpv).map(getCpvCategory)));

export const tenderHasCpvCategory = (cpvCodes: string[], category: CpvCategoryKey): boolean =>
    cpvCodes.some((code) => isItRelatedCpv(code) && getCpvCategory(code) === category);
