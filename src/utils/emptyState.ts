/**
 * Dlaczego lista przetargów jest pusta. Każda przyczyna ma inny komunikat i inną następną akcję,
 * więc puste miejsce nigdy nie mówi tylko "brak wyników".
 */
export type EmptyStateKind =
    /** W bazie nie ma ogłoszeń dla wybranego dnia (albo jeszcze ich nie pobrano). */
    | 'noData'
    /** Są ogłoszenia, ale wszystkie mają już status, a widać tylko nieocenione. */
    | 'queueEmpty'
    /** Filtry lub fraza wyszukiwania odrzucają wszystko. */
    | 'filtered'
    /** Przełącznik "Tylko IT" odrzuca wszystko. */
    | 'noIt'
    /** Ogłoszenia są, ale nie trafiają na tę listę (ukryci zamawiający, gwiazdki). */
    | 'other';

export interface EmptyStateInput {
    /** Ile ogłoszeń z wybranego zakresu dni może trafić na listę (bez własnych gwiazdek), przed filtrami. */
    rangeCount: number;
    isQueueEmpty: boolean;
    /** Czy cokolwiek zawęża listę: chipy filtrów albo fraza wyszukiwania. */
    hasActiveFilters: boolean;
    isItOnly: boolean;
}

export const getEmptyStateKind = ({ rangeCount, isQueueEmpty, hasActiveFilters, isItOnly }: EmptyStateInput): EmptyStateKind => {
    if (rangeCount === 0) return 'noData';
    if (isQueueEmpty) return 'queueEmpty';
    if (hasActiveFilters) return 'filtered';
    if (isItOnly) return 'noIt';
    return 'other';
};
