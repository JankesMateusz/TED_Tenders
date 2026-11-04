import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { TenderStatus } from '../types/TenderStatus';
import { OrderType } from '../utils/tenderSources';
import { isItRelatedCpv, normalizeCpv } from './cpvFilter';
import { CPV_CATEGORY_LABELS, CpvCategoryKey, getTenderCpvCategories } from './cpvCategories';
import { MIN_REPEAT_COUNT } from './repeatOptions';
import { normalizeName } from './stringUtils';

export interface Statistics {
    total: number;
    bySource: Record<TenderSource, number>;
    byOrderType: Partial<Record<OrderType, number>>;
    topCities: Array<{ city: string; count: number }>;
    /** Zamawiający z co najmniej MIN_REPEAT_COUNT ogłoszeniami (nazwy porównywane po normalizacji), od najliczniejszych, max 10. */
    repeatBuyers: Array<{ buyer: string; count: number }>;
    /** Kody CPV związane z IT; liczba przetargów, które zawierają dany kod (jeden przetarg może mieć kilka kodów). */
    topCpvCodes: Array<{ code: string; count: number }>;
    /** Co jest zamawiane: liczba przetargów w każdej kategorii CPV (jeden przetarg może być w kilku, więc sumy się nie dodają). */
    byCpvCategory: Array<{ key: CpvCategoryKey; label: string; count: number }>;
    /** Kto ustawił obecny status przetargów (ostatnia osoba, która go zmieniła), od najwięcej ocen. */
    byReviewer: Array<{ reviewer: string; count: number }>;
    ezamowieniaHourlyDistribution: Record<string, number[]>;
    dailyDistributionBySource: Record<string, Record<TenderSource, number>>;
    byStatus: Record<TenderStatus | 'unmarked', number>;
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

export const calculateStatistics = (tenders: Tender[]): Statistics => {
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
        repeatBuyers: [],
        topCpvCodes: [],
        byCpvCategory: [],
        byReviewer: [],
        ezamowieniaHourlyDistribution: {},
        dailyDistributionBySource: {},
        byStatus: {
            toEnter: 0,
            entered: 0,
            toClarify: 0,
            notToEnter: 0,
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
    // Klucz to znormalizowana nazwa; pokazujemy najdłuższy wariant (zwykle najpełniejszy), jak w panelu bocznym
    const buyerMap = new Map<string, { buyer: string; count: number }>();
    const cpvMap = new Map<string, number>();
    const categoryMap = new Map<CpvCategoryKey, number>();
    const reviewerMap = new Map<string, number>();
    const ezamowieniaHourlyMap = new Map<string, number[]>();
    const dailySourceMap = new Map<string, Record<TenderSource, number>>();
    
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
            const key = normalizeName(tender.buyerName);
            const displayName = tender.buyerName.trim().replace(/\s+/g, ' ');
            const existing = buyerMap.get(key);
            buyerMap.set(key, {
                buyer: existing && existing.buyer.length >= displayName.length ? existing.buyer : displayName,
                count: (existing?.count ?? 0) + 1
            });
        }

        // Top CPV: tylko kody IT (mają oficjalne nazwy); kod powtórzony w jednym przetargu liczy się raz
        new Set(tender.cpvCodes.filter(isItRelatedCpv).map(normalizeCpv)).forEach(code => {
            cpvMap.set(code, (cpvMap.get(code) || 0) + 1);
        });

        getTenderCpvCategories(tender.cpvCodes).forEach(category => {
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        // By status
        stats.byStatus[tender.status ?? 'unmarked']++;
        if (tender.status) {
            const reviewer = tender.statusByEmail ?? 'Nieznany użytkownik';
            reviewerMap.set(reviewer, (reviewerMap.get(reviewer) || 0) + 1);
        }
        
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

        // Hourly distribution for eZamówienia
        if (
            tender.source === TenderSource.E_ZAMOWIENIA &&
            tender.publicationTime &&
            tender.publicationDate &&
            tender.publicationDate !== 'Brak daty' &&
            tender.publicationDate !== 'Błąd formatu daty'
        ) {
            const [hourStr] = tender.publicationTime.split(':');
            const hour = Number(hourStr);
            if (!Number.isNaN(hour) && hour >= 0 && hour < 24) {
                if (!ezamowieniaHourlyMap.has(tender.publicationDate)) {
                    ezamowieniaHourlyMap.set(tender.publicationDate, Array(24).fill(0));
                }
                const buckets = ezamowieniaHourlyMap.get(tender.publicationDate);
                if (buckets) {
                    buckets[hour] += 1;
                }
            }
        }

        // Daily distribution by source
        if (tender.publicationDate && 
            tender.publicationDate !== 'Brak daty' && 
            tender.publicationDate !== 'Błąd formatu daty') {
            if (!dailySourceMap.has(tender.publicationDate)) {
                dailySourceMap.set(tender.publicationDate, {
                    [TenderSource.TED]: 0,
                    [TenderSource.E_ZAMOWIENIA]: 0,
                    [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
                });
            }
            const sourceCounts = dailySourceMap.get(tender.publicationDate);
            if (sourceCounts) {
                sourceCounts[tender.source] += 1;
            }
        }
    });
    
    // Top cities (top 10)
    stats.topCities = Array.from(cityMap.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    stats.repeatBuyers = Array.from(buyerMap.values())
        .filter(({ count }) => count >= MIN_REPEAT_COUNT)
        .sort((a, b) => b.count - a.count || a.buyer.localeCompare(b.buyer, 'pl'))
        .slice(0, 10);

    // Top CPV (top 10)
    stats.topCpvCodes = Array.from(cpvMap.entries())
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code))
        .slice(0, 10);

    stats.byCpvCategory = Array.from(categoryMap.entries())
        .map(([key, count]) => ({ key, label: CPV_CATEGORY_LABELS[key], count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pl'));

    stats.byReviewer = Array.from(reviewerMap.entries())
        .map(([reviewer, count]) => ({ reviewer, count }))
        .sort((a, b) => b.count - a.count || a.reviewer.localeCompare(b.reviewer, 'pl'));

    stats.ezamowieniaHourlyDistribution = Array.from(ezamowieniaHourlyMap.entries())
        .sort((a, b) => parseDate(b[0]).getTime() - parseDate(a[0]).getTime())
        .reduce((acc, [date, hours]) => {
            acc[date] = hours;
            return acc;
        }, {} as Record<string, number[]>);

    stats.dailyDistributionBySource = Object.fromEntries(
        Array.from(dailySourceMap.entries())
            .sort((a, b) => parseDate(a[0]).getTime() - parseDate(b[0]).getTime())
    );
    
    return stats;
};

