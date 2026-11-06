/**
 * Wynik automatycznego sprawdzania dostępności dokumentacji (`tenders/{docId}.docsCheck`, zapis tylko z serwera).
 * Brak pola przy przetargu IT oznacza, że jeszcze nie sprawdzono.
 */
export type DocsCheckState = 'none' | 'available' | 'unsupported' | 'profile' | 'error';

export interface DocsCheck {
    state: DocsCheckState;
    /** `ezamowienia` lub `platformazakupowa`, gdy znamy platformę z adapterem. */
    platform?: string;
    /** Strona postępowania lub dokumentacji na platformie. */
    sourceUrl?: string;
    fileCount?: number;
    /** Ile sprawdzeń wykonano (najwyżej 6) i kiedy ostatnie oraz następne; `nextCheckAt` brak, gdy sprawdzanie zakończone. */
    checks?: number;
    checkedAt?: Date;
    nextCheckAt?: Date;
}

/** Wartości filtra „Dokumenty": są, brak (jeszcze nie opublikowane), na platformie, której nie obsługujemy. */
export type DocsFilter = 'available' | 'none' | 'otherPlatform';
