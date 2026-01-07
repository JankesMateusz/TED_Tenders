import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { OrderType } from '../utils/tenderSources';

export interface Statistics {
    total: number;
    bySource: Record<TenderSource, number>;
    byOrderType: Partial<Record<OrderType, number>>;
    topCities: Array<{ city: string; count: number }>;
    topBuyers: Array<{ buyer: string; count: number }>;
    byStatus: {
        favorites: number;
        toBeEntered: number;
        notToBeEntered: number;
        unmarked: number;
    };
    deadlineStats: {
        upcoming: number; // deadline w ciągu 7 dni
        overdue: number; // przeterminowane
        total: number;
    };
    dateStats: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
}

const parseDate = (dateStr: string): Date => {
    if (!dateStr || dateStr === "Brak daty" || dateStr === "Błąd formatu daty") {
        return new Date(NaN);
    }
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);
            return new Date(year, month - 1, day);
        }
    } catch (error) {
        console.warn('Error parsing date:', dateStr, error);
    }
    return new Date(NaN);
};

export const calculateStatistics = (
    tenders: Tender[],
    isFavorite: (id: string) => boolean,
    isToBeEntered: (id: string) => boolean,
    isNotToBeEntered: (id: string) => boolean
): Statistics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const stats: Statistics = {
        total: tenders.length,
        bySource: {
            [TenderSource.TED]: 0,
            [TenderSource.E_ZAMOWIENIA]: 0,
            [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
        },
        byOrderType: {},
        topCities: [],
        topBuyers: [],
        byStatus: {
            favorites: 0,
            toBeEntered: 0,
            notToBeEntered: 0,
            unmarked: 0
        },
        deadlineStats: {
            upcoming: 0,
            overdue: 0,
            total: 0
        },
        dateStats: {
            today: 0,
            thisWeek: 0,
            thisMonth: 0
        }
    };
    
    const cityMap = new Map<string, number>();
    const buyerMap = new Map<string, number>();
    
    tenders.forEach(tender => {
        // By source
        stats.bySource[tender.source]++;
        
        // By order type
        if (tender.orderType) {
            stats.byOrderType[tender.orderType] = 
                (stats.byOrderType[tender.orderType] || 0) + 1;
        }
        
        // Top cities
        if (tender.buyerCity && tender.buyerCity !== 'Brak miasta') {
            cityMap.set(tender.buyerCity, (cityMap.get(tender.buyerCity) || 0) + 1);
        }
        
        // Top buyers
        if (tender.buyerName && tender.buyerName !== 'Brak danych') {
            buyerMap.set(tender.buyerName, (buyerMap.get(tender.buyerName) || 0) + 1);
        }
        
        // By status
        const isFav = isFavorite(tender.publicationNumber);
        const isToBe = isToBeEntered(tender.publicationNumber);
        const isNotToBe = isNotToBeEntered(tender.publicationNumber);
        
        if (isFav) stats.byStatus.favorites++;
        if (isToBe) stats.byStatus.toBeEntered++;
        if (isNotToBe) stats.byStatus.notToBeEntered++;
        if (!isFav && !isToBe && !isNotToBe) stats.byStatus.unmarked++;
        
        // Deadline stats
        const deadlineDate = parseDate(tender.deadlineDate);
        if (!isNaN(deadlineDate.getTime())) {
            stats.deadlineStats.total++;
            if (deadlineDate < today) {
                stats.deadlineStats.overdue++;
            } else if (deadlineDate <= sevenDaysFromNow) {
                stats.deadlineStats.upcoming++;
            }
        }
        
        // Date stats
        const pubDate = parseDate(tender.publicationDate);
        if (!isNaN(pubDate.getTime())) {
            if (pubDate >= today) stats.dateStats.today++;
            if (pubDate >= weekAgo) stats.dateStats.thisWeek++;
            if (pubDate >= monthAgo) stats.dateStats.thisMonth++;
        }
    });
    
    // Top cities (top 10)
    stats.topCities = Array.from(cityMap.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    // Top buyers (top 10)
    stats.topBuyers = Array.from(buyerMap.entries())
        .map(([buyer, count]) => ({ buyer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    return stats;
};

