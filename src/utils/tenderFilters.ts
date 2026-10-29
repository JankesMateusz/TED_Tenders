import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { TenderStatus } from '../types/TenderStatus';
import { OrderType } from './tenderSources';
import { filterTendersByCpvCodes } from './cpvFilter';
import { normalizeName } from './stringUtils';
import { parseDate } from './dateUtils';

interface FilterOptions {
    selectedSources: TenderSource[];
    selectedOrderTypes: OrderType[];
    selectedBuyer: string | null;
    selectedCity: string | null;
    isFiltered: boolean;
    searchQuery: string;
    statusFilters: StatusFilters;
}

/** Które statusy (lub brak statusu) mają być widoczne; gdy żaden nie jest wybrany, filtr jest wyłączony. */
export type StatusFilters = Record<TenderStatus | 'unmarked', boolean>;

/**
 * Filtruje i sortuje przetargi według podanych kryteriów
 */
export const filterAndSortTenders = (
    tenders: Tender[],
    options: FilterOptions
): Tender[] => {
    let result = [...tenders];
    
    // Filtrowanie po źródle
    result = result.filter(tender => options.selectedSources.includes(tender.source));
    
    // Filtrowanie po typie zamówienia; przetargi bez znanego typu (np. starsze zapisy z TED) zostają widoczne
    result = result.filter(tender => !tender.orderType || options.selectedOrderTypes.includes(tender.orderType));
    
    // Filtrowanie po zamawiającym z użyciem znormalizowanej nazwy
    if (options.selectedBuyer) {
        const normalizedSelected = normalizeName(options.selectedBuyer);
        result = result.filter(tender => {
            const normalizedTenderName = normalizeName(tender.buyerName);
            return normalizedTenderName === normalizedSelected;
        });
    }
    
    // Filtrowanie po mieście z użyciem znormalizowanej nazwy
    if (options.selectedCity) {
        const normalizedSelected = normalizeName(options.selectedCity);
        result = result.filter(tender => {
            const normalizedTenderCity = normalizeName(tender.buyerCity);
            return normalizedTenderCity === normalizedSelected;
        });
    }
    
    // Filtrowanie po CPV jeśli włączone
    if (options.isFiltered) {
        result = filterTendersByCpvCodes(result);
    }
    
    // Filtrowanie po wyszukiwaniu
    if (options.searchQuery.trim()) {
        const query = options.searchQuery.trim().toLowerCase();
        result = result.filter(tender => {
            // Wyszukiwanie po tytule
            if (tender.title?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po zamawiającym
            if (tender.buyerName?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po mieście
            if (tender.buyerCity?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po numerze publikacji
            if (tender.publicationNumber?.toLowerCase().includes(query)) return true;
            // Wyszukiwanie po kodach CPV
            if (tender.cpvCodes?.some((cpv: string) => cpv.toLowerCase().includes(query))) return true;
            return false;
        });
    }
    
    // Filtrowanie po statusach (OR - wystarczy jeden wybrany status)
    if (Object.values(options.statusFilters).some(Boolean)) {
        result = result.filter(tender => options.statusFilters[tender.status ?? 'unmarked']);
    }
    
    // Sortowanie po dacie publikacji (najnowsze na górze), w obrębie dnia po godzinie (jeśli źródło ją podaje)
    result.sort((a, b) => {
        const dateA = parseDate(a.publicationDate);
        const dateB = parseDate(b.publicationDate);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime();
        }
        return (b.publicationTime ?? '').localeCompare(a.publicationTime ?? '');
    });
    
    return result;
};
