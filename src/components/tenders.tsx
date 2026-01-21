import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { fetchTenders } from "../utils/fetchTenders";
import { fetchEzamowienia } from "../utils/fetchEzamowienia";
import { filterTendersByCpvCodes, isItRelatedCpv, removeChangeNotices } from "../utils/cpvFilter";
import { normalizeName } from "../utils/stringUtils";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { getSourceConfig, getOrderTypeConfig, OrderType } from "../utils/tenderSources";
import { TenderSource } from "../types/TenderSource";
import { Tender } from "../types/Tender";
import { DEFAULT_ORDER_TYPES, PLACEHOLDER_TEXTS, MESSAGES } from "../constants";
import { saveTendersToCache, getTendersFromCache } from "../utils/tendersCache";
import { calculateStatistics } from "../utils/calculateStatistics";
import { StatisticsTab } from "./StatisticsTab";
import Header from "./header";
import BuyersSidebar from "./BuyersSidebar";
import TenderCard from "./TenderCard";
import styles from "./Tenders.module.css";

const Tenders: React.FC = () => {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const today = new Date();
    const [startDate, setStartDate] = useState<Date | null>(today);
    const [endDate, setEndDate] = useState<Date | null>(today);
    const [useDateRange, setUseDateRange] = useState<boolean>(false); // Domyślnie pojedynczy dzień
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingProgress, setLoadingProgress] = useState<number>(0);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [tendersCountBySource, setTendersCountBySource] = useState<Record<TenderSource, number>>({
        [TenderSource.TED]: 0,
        [TenderSource.E_ZAMOWIENIA]: 0,
        [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
    });
    const [selectedSources, setSelectedSources] = useState<TenderSource[]>([
        TenderSource.TED,
        TenderSource.E_ZAMOWIENIA,
        TenderSource.BAZA_KONKURENCYJNOSCI
    ]);
    const [selectedOrderTypes, setSelectedOrderTypes] = useState<OrderType[]>([...DEFAULT_ORDER_TYPES]);
    const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const { 
        isFavorite,
        toggleToBeEntered,
        toggleNotToBeEntered,
        isToBeEntered,
        isNotToBeEntered,
        toBeEnteredTenders,
        notToBeEnteredTenders
    } = useUserPreferences();
    // expanded state for CPV cards is now managed inside TenderCard
    const [statusFilters, setStatusFilters] = useState<{
        favorites: boolean;
        toBeEntered: boolean;
        notToBeEntered: boolean;
        unmarked: boolean;
    }>({
        favorites: false,
        toBeEntered: false,
        notToBeEntered: false,
        unmarked: false
    });
    const [activeTab, setActiveTab] = useState<'tenders' | 'statistics'>('tenders');
    const prevValuesRef = useRef<{ startDate: Date | null; endDate: Date | null; useDateRange: boolean } | null>(null);
    const isInitialMount = useRef(true);
    const searchInputRef = useRef<HTMLInputElement>(null);


    // Funkcja do pobierania przetargów z API
    const fetchTendersFromAPI = useCallback(async (formattedStartDate: string, formattedEndDate: string): Promise<Tender[]> => {
        const results = await Promise.allSettled([
            fetchTenders(formattedStartDate, formattedEndDate),
            fetchEzamowienia(formattedStartDate, formattedEndDate)
        ]);
        
        let allTenders: Tender[] = [];
        
        // Przetwarzanie wyników z TED
        if (results[0].status === 'fulfilled') {
            allTenders = [...allTenders, ...results[0].value];
        } else {
            console.error("Błąd pobierania przetargów z TED:", results[0].reason);
        }
        
        // Przetwarzanie wyników z eZamówienia
        if (results[1].status === 'fulfilled') {
            allTenders = [...allTenders, ...results[1].value];
        } else {
            console.error("Błąd pobierania przetargów z eZamówienia:", results[1].reason);
        }
        
        return removeChangeNotices(allTenders);
    }, []);

    // Funkcja do odświeżania przetargów w tle (stale-while-revalidate)
    const refreshTendersInBackground = useCallback(async (formattedStartDate: string, formattedEndDate: string) => {
        try {
            const originalTenders = await fetchTendersFromAPI(formattedStartDate, formattedEndDate);
            
            // Zaktualizuj cache i state
            saveTendersToCache(formattedStartDate, formattedEndDate, originalTenders);
            setTenders(originalTenders);
        } catch (error) {
            console.error('Background refresh failed:', error);
        }
    }, [fetchTendersFromAPI]);

    // Funkcja do pobierania przetargów
    const loadTenders = useCallback(async (forceRefresh: boolean = false) => {
        if (!startDate) return;
        // Gdy pojedynczy dzień, używamy tej samej daty dla start i end
        const effectiveEndDate = useDateRange ? endDate : startDate;
        if (!effectiveEndDate) return;
        
        const formattedStartDate = startDate.toISOString().slice(0, 10);
        const formattedEndDate = effectiveEndDate.toISOString().slice(0, 10);
        
        // 1. Sprawdź cache (tylko jeśli nie wymuszamy odświeżenia)
        if (!forceRefresh) {
            const cachedTenders = getTendersFromCache(formattedStartDate, formattedEndDate);
            if (cachedTenders) {
                // Cache istnieje i jest świeży - użyj go natychmiast
                setTenders(cachedTenders);
                setIsLoading(false);
                
                // Odśwież w tle (stale-while-revalidate)
                refreshTendersInBackground(formattedStartDate, formattedEndDate);
                return;
            }
        }
        
        // 2. Brak cache, stary cache lub wymuszone odświeżenie - pobierz z API
        setIsLoading(true);
        setLoadingProgress(0);
        
        // Symulacja postępu
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 90) {
                    return prev;
                }
                return Math.min(prev + 10, 90);
            });
        }, 200);
        
        try {
            const originalTenders = await fetchTendersFromAPI(formattedStartDate, formattedEndDate);
            
            clearInterval(progressInterval);
            setLoadingProgress(100);
            
            setTenders(originalTenders);
            
            // 3. Zapisz do cache
            saveTendersToCache(formattedStartDate, formattedEndDate, originalTenders);
        } catch (error) {
            clearInterval(progressInterval);
            console.error("Błąd podczas pobierania przetargów:", error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setLoadingProgress(0), 300);
        }
    }, [startDate, endDate, useDateRange, fetchTendersFromAPI, refreshTendersInBackground]);

    // Pobieranie przetargów tylko gdy zmienia się startDate lub endDate (nie useDateRange)
    useEffect(() => {
        // Przy pierwszym renderze załaduj przetargi automatycznie
        if (isInitialMount.current) {
            isInitialMount.current = false;
            loadTenders();
            prevValuesRef.current = { startDate, endDate, useDateRange };
            return;
        }
        
        const prev = prevValuesRef.current;
        if (!prev) {
            prevValuesRef.current = { startDate, endDate, useDateRange };
            return;
        }
        
        const startDateChanged = prev.startDate?.getTime() !== startDate?.getTime();
        const endDateChanged = prev.endDate?.getTime() !== endDate?.getTime();
        const onlyDateRangeChanged = !startDateChanged && !endDateChanged && prev.useDateRange !== useDateRange;
        
        // Aktualizuj ref
        prevValuesRef.current = { startDate, endDate, useDateRange };
        
        // Jeśli zmieniło się tylko useDateRange (bez zmiany dat), nie pobieraj przetargów
        if (onlyDateRangeChanged) {
            return;
        }
        
        // W przeciwnym razie pobierz przetargi (zmiana dat)
        if (startDateChanged || endDateChanged) {
            loadTenders();
        }
    }, [startDate, endDate, useDateRange, loadTenders]);
    
    // Gdy przełączamy na pojedynczy dzień, ustaw endDate na startDate (bez pobierania)
    useEffect(() => {
        if (!useDateRange && startDate) {
            setEndDate(startDate);
        }
    }, [useDateRange, startDate]);
    
    // Gdy zmieniamy startDate w trybie pojedynczego dnia, aktualizuj endDate
    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        if (useDateRange) {
            setEndDate(null);
        } else if (date) {
            setEndDate(date);
        } else {
            setEndDate(null);
        }
    };

    const handleUseDateRangeChange = (value: boolean) => {
        setUseDateRange(value);
        if (value) {
            setEndDate(null);
        } else if (startDate) {
            setEndDate(startDate);
        } else {
            setEndDate(null);
        }
    };

    const handleAllTendersClick = () => {
        // Jeśli już jesteśmy w trybie "All tenders", odśwież dane
        if (!isFiltered) {
            loadTenders();
        } else {
            setIsFiltered(false);
        }
    };

    const handleFilterClick = () => {
        // Filter tylko zmienia widok, nie odświeża danych
        setIsFiltered(true);
    };

    const handleRefresh = () => {
        loadTenders(true); // Wymuś odświeżenie, ignoruj cache
    };

    const handleSourceToggle = (source: TenderSource) => {
        setSelectedSources(prev => 
            prev.includes(source)
                ? prev.filter(s => s !== source)
                : [...prev, source]
        );
    };

    const handleOrderTypeToggle = (orderType: OrderType) => {
        setSelectedOrderTypes(prev => 
            prev.includes(orderType)
                ? prev.filter(t => t !== orderType)
                : [...prev, orderType]
        );
    };

    const parseDate = (dateStr: string): Date => {
        // Format: DD-MM-YYYY
        if (!dateStr || dateStr === "Brak daty" || dateStr === "Błąd formatu daty") {
            return new Date(0); // Najstarsza możliwa data dla sortowania
        }
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const [day, month, year] = parts.map(Number);
                const date = new Date(year, month - 1, day);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        } catch (error) {
            console.warn('Error parsing date:', dateStr, error);
        }
        return new Date(0);
    };

    const getDisplayedCpvCodes = (tender: Tender): string[] => {
        const cpvCodes = isFiltered 
            ? tender.cpvCodes.filter((cpv: string) => isItRelatedCpv(cpv))
            : tender.cpvCodes;
        return Array.from(new Set(cpvCodes));
    };

    const displayedTenders = useMemo(() => {
        let result = [...tenders];
        
        // Filtrowanie po źródle
        result = result.filter(tender => selectedSources.includes(tender.source));
        
        // Filtrowanie po typie zamówienia (tylko dla eZamówienia)
        result = result.filter(tender => {
            if (tender.source === TenderSource.E_ZAMOWIENIA && tender.orderType) {
                return selectedOrderTypes.includes(tender.orderType);
            }
            // Dla innych źródeł (TED, Baza Konkurencyjności) nie filtrujemy po typie zamówienia
            return true;
        });
        
        // Filtrowanie po zamawiającym z użyciem znormalizowanej nazwy
        if (selectedBuyer) {
            const normalizedSelected = normalizeName(selectedBuyer);
            result = result.filter(tender => {
                const normalizedTenderName = normalizeName(tender.buyerName);
                return normalizedTenderName === normalizedSelected;
            });
        }
        
        // Filtrowanie po mieście z użyciem znormalizowanej nazwy
        if (selectedCity) {
            const normalizedSelected = normalizeName(selectedCity);
            result = result.filter(tender => {
                const normalizedTenderCity = normalizeName(tender.buyerCity);
                return normalizedTenderCity === normalizedSelected;
            });
        }
        
        // Filtrowanie po CPV jeśli włączone
        if (isFiltered) {
            result = filterTendersByCpvCodes(result);
        }
        
        // Filtrowanie po wyszukiwaniu
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
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
        const hasAnyStatusFilter = statusFilters.favorites || statusFilters.toBeEntered || statusFilters.notToBeEntered || statusFilters.unmarked;
        if (hasAnyStatusFilter) {
            result = result.filter(tender => {
                const isFav = isFavorite(tender.publicationNumber);
                const isToBe = isToBeEntered(tender.publicationNumber);
                const isNotToBe = isNotToBeEntered(tender.publicationNumber);
                const isUnmarked = !isFav && !isToBe && !isNotToBe;
                
                // OR logic - wystarczy że przetarg spełnia jeden z wybranych statusów
                return (statusFilters.favorites && isFav) ||
                       (statusFilters.toBeEntered && isToBe) ||
                       (statusFilters.notToBeEntered && isNotToBe) ||
                       (statusFilters.unmarked && isUnmarked);
            });
        }
        
        // Sortowanie po dacie publikacji (najnowsze na górze)
        result.sort((a, b) => {
            const dateA = parseDate(a.publicationDate);
            const dateB = parseDate(b.publicationDate);
            return dateB.getTime() - dateA.getTime();
        });
        
        return result;
    }, [tenders, selectedSources, selectedOrderTypes, selectedBuyer, selectedCity, isFiltered, searchQuery, statusFilters, isFavorite, isToBeEntered, isNotToBeEntered]);

    // Obsługa skrótów klawiszowych
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+F lub Cmd+F (na Mac) - fokus na wyszukiwarkę
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    searchInputRef.current.select();
                }
            }
            // (Ctrl+E export was removed)
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        // Liczenie przetargów per źródło
        const counts: Record<TenderSource, number> = {
            [TenderSource.TED]: 0,
            [TenderSource.E_ZAMOWIENIA]: 0,
            [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
        };
        
        displayedTenders.forEach(tender => {
            if (tender.source in counts) {
                counts[tender.source as TenderSource]++;
            }
        });
        
        setTendersCountBySource(counts);
    }, [displayedTenders]);

    // Liczenie przetargów oznaczonych jako "do wpisania" i "nie do wpisania"
    const toBeEnteredCount = useMemo(() => {
        return displayedTenders.filter(tender => toBeEnteredTenders.has(tender.publicationNumber)).length;
    }, [displayedTenders, toBeEnteredTenders]);

    const notToBeEnteredCount = useMemo(() => {
        return displayedTenders.filter(tender => notToBeEnteredTenders.has(tender.publicationNumber)).length;
    }, [displayedTenders, notToBeEnteredTenders]);

    // Oblicz statystyki
    const statistics = useMemo(() => {
        return calculateStatistics(
            displayedTenders,
            isFavorite,
            isToBeEntered,
            isNotToBeEntered
        );
    }, [displayedTenders, isFavorite, isToBeEntered, isNotToBeEntered]);

    return (
        <div className={styles.app}>
            <Header
                startDate={startDate}
                endDate={endDate}
                setStartDate={handleStartDateChange}
                setEndDate={setEndDate}
                useDateRange={useDateRange}
                setUseDateRange={handleUseDateRangeChange}
                tendersCountBySource={tendersCountBySource}
                onAllTendersClick={handleAllTendersClick}
                onFilterClick={handleFilterClick}
                onRefresh={handleRefresh}
                isFiltered={isFiltered}
                selectedSources={selectedSources}
                isLoading={isLoading}
            />
            <div className={styles.mainContent}>
                {activeTab === 'tenders' && (
                    <BuyersSidebar
                        displayedTenders={displayedTenders}
                        selectedBuyer={selectedBuyer}
                        selectedCity={selectedCity}
                        onBuyerSelect={setSelectedBuyer}
                        onCitySelect={setSelectedCity}
                    />
                )}
                <div className={styles.contentArea}>
                    <div className={styles.tabsContainer}>
                        <ul className={styles.tabs}>
                            <li>
                                <button
                                    className={`${styles.tab} ${activeTab === 'tenders' ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab('tenders')}
                                >
                                    Przetargi ({displayedTenders.length})
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`${styles.tab} ${activeTab === 'statistics' ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab('statistics')}
                                >
                                    Statystyki
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.tabContent}>
                        {activeTab === 'tenders' ? (
                            <div className={styles.container}>
                                <div className={styles.searchSection}>
                    <div className={styles.searchInputWrapper}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={PLACEHOLDER_TEXTS.SEARCH}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Delete' && searchQuery) {
                                    e.preventDefault();
                                    setSearchQuery("");
                                }
                            }}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                className={styles.clearSearchButton}
                                onClick={() => setSearchQuery("")}
                                aria-label="Wyczyść wyszukiwanie"
                                title="Wyczyść wyszukiwanie"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.filtersSection}>
                    <div className={styles.sourceFilters}>
                        <span className={styles.sourceFiltersLabel}>Źródła:</span>
                        {[TenderSource.TED, TenderSource.E_ZAMOWIENIA, TenderSource.BAZA_KONKURENCYJNOSCI].map((source) => {
                            const config = getSourceConfig(source);
                            const isSelected = selectedSources.includes(source);
                            return (
                                <label key={source} className={styles.sourceFilterLabel}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSourceToggle(source)}
                                        className={styles.sourceCheckbox}
                                    />
                                    <span 
                                        className={styles.sourceFilterBadge}
                                        style={{
                                            backgroundColor: isSelected ? config.backgroundColor : 'rgba(0, 0, 0, 0.1)',
                                            color: isSelected ? config.color : 'var(--text-secondary)',
                                            border: `1px solid ${isSelected ? config.backgroundColor : 'rgba(0, 0, 0, 0.2)'}`
                                        }}
                                    >
                                        {config.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                    {selectedSources.includes(TenderSource.E_ZAMOWIENIA) && (
                        <div className={styles.sourceFilters}>
                            <span className={styles.sourceFiltersLabel}>Typy:</span>
                            {DEFAULT_ORDER_TYPES.map((orderType) => {
                                const config = getOrderTypeConfig(orderType);
                                const isSelected = selectedOrderTypes.includes(orderType);
                                return (
                                    <label key={orderType} className={styles.sourceFilterLabel}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleOrderTypeToggle(orderType)}
                                            className={styles.sourceCheckbox}
                                        />
                                        <span 
                                            className={styles.sourceFilterBadge}
                                            style={{
                                                backgroundColor: isSelected ? config.backgroundColor : 'rgba(0, 0, 0, 0.1)',
                                                color: isSelected ? config.color : 'var(--text-secondary)',
                                                border: `1px solid ${isSelected ? config.backgroundColor : 'rgba(0, 0, 0, 0.2)'}`
                                            }}
                                        >
                                            {config.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                    <div className={styles.statusCounts}>
                        <span className={styles.statusCountItem}>
                            <span className={styles.statusCountLabel}>Do wpisania:</span>
                            <span className={styles.statusCountValue} style={{ color: '#2ecc71' }}>
                                {toBeEnteredCount}
                            </span>
                        </span>
                        <span className={styles.statusCountItem}>
                            <span className={styles.statusCountLabel}>Nie do wpisania:</span>
                            <span className={styles.statusCountValue} style={{ color: '#e74c3c' }}>
                                {notToBeEnteredCount}
                            </span>
                        </span>
                    </div>
                </div>
                <div className={styles.statusFiltersSection}>
                    <div className={styles.sourceFilters}>
                        <span className={styles.sourceFiltersLabel}>Filtruj po statusie:</span>
                        <label className={styles.sourceFilterLabel}>
                            <input
                                type="checkbox"
                                checked={statusFilters.favorites}
                                onChange={() => setStatusFilters(prev => ({...prev, favorites: !prev.favorites}))}
                                className={styles.sourceCheckbox}
                            />
                            <span 
                                className={styles.sourceFilterBadge}
                                style={{
                                    backgroundColor: statusFilters.favorites ? '#f39c12' : 'rgba(0, 0, 0, 0.1)',
                                    color: statusFilters.favorites ? '#ffffff' : 'var(--text-secondary)',
                                    border: `1px solid ${statusFilters.favorites ? '#f39c12' : 'rgba(0, 0, 0, 0.2)'}`
                                }}
                            >
                                Ulubione
                            </span>
                        </label>
                        <label className={styles.sourceFilterLabel}>
                            <input
                                type="checkbox"
                                checked={statusFilters.toBeEntered}
                                onChange={() => setStatusFilters(prev => ({...prev, toBeEntered: !prev.toBeEntered}))}
                                className={styles.sourceCheckbox}
                            />
                            <span 
                                className={styles.sourceFilterBadge}
                                style={{
                                    backgroundColor: statusFilters.toBeEntered ? '#2ecc71' : 'rgba(0, 0, 0, 0.1)',
                                    color: statusFilters.toBeEntered ? '#ffffff' : 'var(--text-secondary)',
                                    border: `1px solid ${statusFilters.toBeEntered ? '#2ecc71' : 'rgba(0, 0, 0, 0.2)'}`
                                }}
                            >
                                Do wpisania
                            </span>
                        </label>
                        <label className={styles.sourceFilterLabel}>
                            <input
                                type="checkbox"
                                checked={statusFilters.notToBeEntered}
                                onChange={() => setStatusFilters(prev => ({...prev, notToBeEntered: !prev.notToBeEntered}))}
                                className={styles.sourceCheckbox}
                            />
                            <span 
                                className={styles.sourceFilterBadge}
                                style={{
                                    backgroundColor: statusFilters.notToBeEntered ? '#e74c3c' : 'rgba(0, 0, 0, 0.1)',
                                    color: statusFilters.notToBeEntered ? '#ffffff' : 'var(--text-secondary)',
                                    border: `1px solid ${statusFilters.notToBeEntered ? '#e74c3c' : 'rgba(0, 0, 0, 0.2)'}`
                                }}
                            >
                                Nie do wpisania
                            </span>
                        </label>
                        <label className={styles.sourceFilterLabel}>
                            <input
                                type="checkbox"
                                checked={statusFilters.unmarked}
                                onChange={() => setStatusFilters(prev => ({...prev, unmarked: !prev.unmarked}))}
                                className={styles.sourceCheckbox}
                            />
                            <span 
                                className={styles.sourceFilterBadge}
                                style={{
                                    backgroundColor: statusFilters.unmarked ? '#95a5a6' : 'rgba(0, 0, 0, 0.1)',
                                    color: statusFilters.unmarked ? '#ffffff' : 'var(--text-secondary)',
                                    border: `1px solid ${statusFilters.unmarked ? '#95a5a6' : 'rgba(0, 0, 0, 0.2)'}`
                                }}
                            >
                                Nieoznaczone
                            </span>
                        </label>
                    </div>
                </div>
                {isLoading && (
                    <>
                        <div className={styles.progressBarContainer}>
                            <div 
                                className={styles.progressBar}
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                        <div className={styles.skeletonContainer}>
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className={styles.skeletonCard}>
                                    <div className={styles.skeletonHeader}>
                                        <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                        <div className={styles.skeletonLine} style={{ width: '20%' }} />
                                    </div>
                                    <div className={styles.skeletonBadge} />
                                    <div className={styles.skeletonTitle} />
                                    <div className={styles.skeletonInfo}>
                                        <div className={styles.skeletonLine} style={{ width: '30%' }} />
                                        <div className={styles.skeletonLine} style={{ width: '30%' }} />
                                        <div className={styles.skeletonLine} style={{ width: '30%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {displayedTenders.length === 0 && !isLoading && (
                    <p className={styles.message}>
                        {isFiltered ? MESSAGES.NO_IT_TENDERS : MESSAGES.NO_TENDERS}
                    </p>
                )}
                {!isLoading && (
                    <ul className={styles.tendersList}>
                        {displayedTenders.map((tender) => {
                            const cpvCodes = getDisplayedCpvCodes(tender);
                            return (
                                <TenderCard
                                    key={tender.publicationNumber}
                                    tender={tender}
                                    cpvCodes={cpvCodes}
                                    onToggleToBeEntered={toggleToBeEntered}
                                    onToggleNotToBeEntered={toggleNotToBeEntered}
                                    isToBeEntered={isToBeEntered}
                                    isNotToBeEntered={isNotToBeEntered}
                                />
                            );
                        })}
                    </ul>
                )}
                            </div>
                        ) : (
                            <StatisticsTab statistics={statistics} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tenders;