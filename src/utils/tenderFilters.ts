import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
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
    statusFilters: {
        favorites: boolean;
        toBeEntered: boolean;
        notToBeEntered: boolean;
        unmarked: boolean;
    };
    isFavorite: (id: string) => boolean;
    isToBeEntered: (id: string) => boolean;
    isNotToBeEntered: (id: string) => boolean;
}

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
    
    // Filtrowanie po typie zamówienia (tylko dla eZamówienia)
    result = result.filter(tender => {
        if (tender.source === TenderSource.E_ZAMOWIENIA && tender.orderType) {
            return options.selectedOrderTypes.includes(tender.orderType);
        }
        // Dla innych źródeł (TED, Baza Konkurencyjności) nie filtrujemy po typie zamówienia
        return true;
    });
    
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
    const hasAnyStatusFilter = options.statusFilters.favorites || 
                               options.statusFilters.toBeEntered || 
                               options.statusFilters.notToBeEntered || 
                               options.statusFilters.unmarked;
    if (hasAnyStatusFilter) {
        result = result.filter(tender => {
            const isFav = options.isFavorite(tender.publicationNumber);
            const isToBe = options.isToBeEntered(tender.publicationNumber);
            const isNotToBe = options.isNotToBeEntered(tender.publicationNumber);
            const isUnmarked = !isFav && !isToBe && !isNotToBe;
            
            // OR logic - wystarczy że przetarg spełnia jeden z wybranych statusów
            return (options.statusFilters.favorites && isFav) ||
                   (options.statusFilters.toBeEntered && isToBe) ||
                   (options.statusFilters.notToBeEntered && isNotToBe) ||
                   (options.statusFilters.unmarked && isUnmarked);
        });
    }
    
    // Sortowanie po dacie publikacji (najnowsze na górze)
    result.sort((a, b) => {
        const dateA = parseDate(a.publicationDate);
        const dateB = parseDate(b.publicationDate);
        return dateB.getTime() - dateA.getTime();
    });
    
    return result;
};
