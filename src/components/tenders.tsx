import React, { useEffect, useState, useMemo, useCallback } from "react";
import { isItRelatedCpv } from "../utils/cpvFilter";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { useAuth } from "../context/AuthContext";
import { OrderType } from "../utils/tenderSources";
import { TenderSource } from "../types/TenderSource";
import { Tender } from "../types/Tender";
import { DEFAULT_ORDER_TYPES } from "../constants";
import { dayToDisplayDate, displayDateToDay, parseDate, toDayString } from "../utils/dateUtils";
import { calculateStatistics } from "../utils/calculateStatistics";
import { CpvCategoryKey } from "../utils/cpvCategories";
import { useRecentTenders } from "../hooks/useRecentTenders";
import TabBar, { panelId, tabId } from "./TabBar";
import { TREND_DAYS, countTendersByDay, lastDays } from "../utils/recentTrend";
import { SortOrder, countFacets, filterAndSortTenders, filterTenders } from "../utils/tenderFilters";
import { ALL_SOURCES, NO_STATUS_FILTERS, isQueueStatusFilter, loadFilters, saveFilters } from "../utils/persistedFilters";
import { canRefreshDay, listDays } from "../utils/refreshPlan";
import { refreshDayWithRetry } from "../utils/refreshWithRetry";
import { useTendersRefresh } from "../hooks/useTendersRefresh";
import { useTendersSubscription } from "../hooks/useTendersSubscription";
import { useCardShortcuts } from "../hooks/useCardShortcuts";
import { useComments } from "../hooks/useComments";
import { useAdvertiserDecisions } from "../hooks/useAdvertiserDecisions";
import { isHiddenAdvertiser } from "../utils/advertisers";
import { usePreviousPeriod } from "../hooks/usePreviousPeriod";
import { useDayTenders, useRefreshedDays } from "../hooks/useHourlyDays";
import { describePeriod, getComparisonPeriod } from "../utils/comparison";
import { StatisticsTab, StatisticsDrillDown, StatisticsComparison } from "./StatisticsTab";
import { FiltersPanel } from "./FiltersPanel";
import { averageHourlyDistribution } from "../utils/hourlyAverage";
import { ActiveFilterChip, buildActiveFilterChips } from "../utils/activeFilters";
import Header from "./header";
import BuyersSidebar from "./BuyersSidebar";
import { TendersList } from "./TendersList";
import styles from "./Tenders.module.css";

const Tenders: React.FC = () => {
    const today = new Date();
    const [startDate, setStartDate] = useState<Date | null>(today);
    const [endDate, setEndDate] = useState<Date | null>(today);
    const [useDateRange, setUseDateRange] = useState<boolean>(false); // Domyślnie pojedynczy dzień
    const [searchQuery, setSearchQuery] = useState<string>("");
    // Domyślnie tylko przetargi z kodami CPV związanymi z IT; przycisk „All tenders” pokazuje wszystkie branże
    const [isFiltered, setIsFiltered] = useState<boolean>(true);
    const [tendersCountBySource, setTendersCountBySource] = useState<Record<TenderSource, number>>({
        [TenderSource.TED]: 0,
        [TenderSource.E_ZAMOWIENIA]: 0,
        [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
    });
    const { user } = useAuth();
    const uid = user?.uid ?? null;
    // Filtry (poza frazą wyszukiwania) są zapamiętywane w przeglądarce osobno dla każdego konta
    const [initialFilters] = useState(() => loadFilters(uid));
    const [selectedSources, setSelectedSources] = useState<TenderSource[]>(initialFilters.selectedSources);
    const [selectedOrderTypes, setSelectedOrderTypes] = useState<OrderType[]>(initialFilters.selectedOrderTypes);
    const [selectedBuyers, setSelectedBuyers] = useState<string[]>(initialFilters.selectedBuyers);
    const [selectedCities, setSelectedCities] = useState<string[]>(initialFilters.selectedCities);
    const [selectedCpvs, setSelectedCpvs] = useState<string[]>(initialFilters.selectedCpvs);
    // Kategoria CPV ze statystyk: dotyczy tylko bieżącej sesji, w przeciwieństwie do zapamiętywanych filtrów
    const [selectedCpvCategory, setSelectedCpvCategory] = useState<CpvCategoryKey | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialFilters.sortOrder);
    const { favorites, isFavorite, toggleFavorite, toggleStatus, actionError } = useUserPreferences();
    const [statusFilters, setStatusFilters] = useState(initialFilters.statusFilters);
    const [selectedLabels, setSelectedLabels] = useState(initialFilters.selectedLabels);
    const [selectedDocs, setSelectedDocs] = useState(initialFilters.selectedDocs);
    const [activeTab, setActiveTab] = useState<'tenders' | 'saved' | 'statistics'>('tenders');

    // Zakres dni do odczytu z bazy. W trybie pojedynczego dnia końcem jest zawsze początek.
    const startDay = startDate ? toDayString(startDate) : null;
    const endDay = useDateRange ? (endDate ? toDayString(endDate) : null) : startDay;
    const todayDay = toDayString(new Date());
    // Czy w wybranym zakresie jest choć jeden dzień, który serwer przyjmie do odświeżenia
    const canRefreshAny = Boolean(startDay && endDay && listDays(startDay, endDay).some((day) => canRefreshDay(day, todayDay)));

    const { commentsByTender, commentsError, addComment, deleteComment } = useComments(startDay, endDay);
    const { advertiserDecisions, advertiserError, setAdvertiserDecision } = useAdvertiserDecisions();
    // Firmy prywatne i NGO są domyślnie ukryte; przełącznik w filtrach pokazuje je na czas przeglądania
    const [showHiddenAdvertisers, setShowHiddenAdvertisers] = useState<boolean>(false);

    const { tenders, isLoading, loadError } = useTendersSubscription(startDay, endDay);

    const { isRefreshing, refreshError, refreshProgress, refresh, lastRefreshAt } = useTendersRefresh(startDay, endDay, useDateRange, todayDay);

    // Gdy przełączamy na pojedynczy dzień, ustaw endDate na startDate
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
            refresh(true);
        } else {
            setIsFiltered(false);
        }
    };

    const handleFilterClick = () => {
        // Filter tylko zmienia widok, nie odświeża danych
        setIsFiltered(true);
    };

    const handleRefresh = () => {
        refresh(true);
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

    const getDisplayedCpvCodes = (tender: Tender): string[] => {
        const cpvCodes = isFiltered
            ? tender.cpvCodes.filter((cpv: string) => isItRelatedCpv(cpv))
            : tender.cpvCodes;
        return Array.from(new Set(cpvCodes));
    };

    // Przetargi z bazy wspólnej po id; tylko dla nich można zmienić status (kopie z "Zapisane" mogły już wygasnąć)
    const liveTendersById = useMemo(() => new Map(tenders.map((tender) => [tender.id, tender])), [tenders]);

    // Własne gwiazdki znikają z głównej listy i są w zakładce "Zapisane", gdzie (jeśli przetarg jest
    // jeszcze w bazie) widać też aktualny wspólny status.
    const savedTenders = useMemo(
        () => favorites.map((favorite) => liveTendersById.get(favorite.id) ?? favorite),
        [favorites, liveTendersById]
    );
    const unsavedTenders = useMemo(() => tenders.filter((tender) => !isFavorite(tender.id)), [tenders, isFavorite]);

    useEffect(() => {
        saveFilters(uid, {
            selectedSources,
            selectedOrderTypes,
            selectedBuyers,
            selectedCities,
            selectedCpvs,
            statusFilters,
            selectedLabels,
            selectedDocs,
            sortOrder
        });
    }, [uid, selectedSources, selectedOrderTypes, selectedBuyers, selectedCities, selectedCpvs, statusFilters, selectedLabels, selectedDocs, sortOrder]);

    const filterOptions = useMemo(() => ({
        selectedSources,
        selectedOrderTypes,
        selectedBuyers,
        selectedCities,
        selectedCpvs,
        selectedCpvCategory,
        isFiltered,
        searchQuery,
        statusFilters,
        selectedLabels,
        selectedDocs,
        sortOrder,
        advertiserDecisions,
        showHiddenAdvertisers
    }), [selectedSources, selectedOrderTypes, selectedBuyers, selectedCities, selectedCpvs, selectedCpvCategory, isFiltered, searchQuery, statusFilters, selectedLabels, selectedDocs, sortOrder, advertiserDecisions, showHiddenAdvertisers]);

    // Zapisane (gwiazdką) zostają widoczne nawet po ukryciu zamawiającego: ktoś świadomie je wybrał
    const savedFilterOptions = useMemo(() => ({ ...filterOptions, showHiddenAdvertisers: true }), [filterOptions]);

    const applyFilters = useCallback((list: Tender[]) => filterAndSortTenders(list, filterOptions), [filterOptions]);

    // Statystyki opisują ocenę przetargów, więc ignorują filtr statusu: domyślny widok "Nieoznaczone" zostawiłby
    // w nich same nieoznaczone i wyzerował pozostałe statusy.
    const applyStatisticsFilters = useCallback((list: Tender[]) => filterTenders(list, filterOptions, 'status'), [filterOptions]);

    // Obie listy są filtrowane osobno, by licznik "Przetargi" nie zależał od aktywnej zakładki
    const filteredTenders = useMemo(() => applyFilters(unsavedTenders), [applyFilters, unsavedTenders]);
    const filteredSavedTenders = useMemo(() => filterAndSortTenders(savedTenders, savedFilterOptions), [savedTenders, savedFilterOptions]);
    const hiddenAdvertisersCount = useMemo(
        () => unsavedTenders.filter((tender) => isHiddenAdvertiser(tender, advertiserDecisions)).length,
        [unsavedTenders, advertiserDecisions]
    );
    const displayedTenders = activeTab === 'saved' ? filteredSavedTenders : filteredTenders;

    // Listy w panelu bocznym pomijają własny filtr (żeby dało się dobrać kolejne pozycje), ale uwzględniają resztę
    const activeTabTenders = activeTab === 'saved' ? savedTenders : unsavedTenders;
    const activeTabOptions = activeTab === 'saved' ? savedFilterOptions : filterOptions;
    const buyerOptionTenders = useMemo(
        () => filterTenders(activeTabTenders, activeTabOptions, 'buyer'),
        [activeTabTenders, activeTabOptions]
    );
    const cityOptionTenders = useMemo(
        () => filterTenders(activeTabTenders, activeTabOptions, 'city'),
        [activeTabTenders, activeTabOptions]
    );
    const facetCounts = useMemo(() => countFacets(activeTabTenders, activeTabOptions), [activeTabTenders, activeTabOptions]);

    // Filtry z panelu, paska bocznego i statystyk; przełącznik "Wszystkie / IT" w nagłówku to tryb widoku,
    // więc nie jest tu liczony ani czyszczony.
    const hasActiveStatisticsFilters =
        searchQuery.trim() !== "" ||
        selectedBuyers.length > 0 ||
        selectedCities.length > 0 ||
        selectedCpvs.length > 0 ||
        selectedCpvCategory !== null ||
        selectedSources.length !== ALL_SOURCES.length ||
        selectedOrderTypes.length !== DEFAULT_ORDER_TYPES.length;

    // Kolejka jest pusta, gdy są ogłoszenia pasujące do pozostałych filtrów, ale wszystkie mają już status
    const isQueueEmpty =
        isQueueStatusFilter(statusFilters) &&
        Object.values(facetCounts.statuses).some((count) => (count ?? 0) > 0);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedSources([...ALL_SOURCES]);
        setSelectedOrderTypes([...DEFAULT_ORDER_TYPES]);
        setSelectedBuyers([]);
        setSelectedCities([]);
        setSelectedCpvs([]);
        setSelectedCpvCategory(null);
        setStatusFilters(NO_STATUS_FILTERS);
        setSelectedLabels([]);
        setSelectedDocs([]);
    };

    const activeChips = useMemo(() => buildActiveFilterChips({
        statusFilters,
        selectedSources,
        selectedOrderTypes,
        selectedBuyers,
        selectedCities,
        selectedCpvs,
        selectedCpvCategory,
        selectedLabels,
        selectedDocs
    }), [statusFilters, selectedLabels, selectedDocs, selectedSources, selectedOrderTypes, selectedBuyers, selectedCities, selectedCpvs, selectedCpvCategory]);

    const handleRemoveChip = (chip: ActiveFilterChip) => {
        switch (chip.kind) {
            case 'status':
                setStatusFilters(prev => ({ ...prev, [chip.value as keyof typeof prev]: false }));
                break;
            case 'label':
                setSelectedLabels(prev => prev.filter(item => item !== chip.value));
                break;
            case 'docs':
                setSelectedDocs(prev => prev.filter(item => item !== chip.value));
                break;
            case 'allStatuses':
                setStatusFilters(NO_STATUS_FILTERS);
                break;
            case 'sources':
                setSelectedSources([...ALL_SOURCES]);
                break;
            case 'orderTypes':
                setSelectedOrderTypes([...DEFAULT_ORDER_TYPES]);
                break;
            case 'buyer':
                setSelectedBuyers(prev => prev.filter(item => item !== chip.value));
                break;
            case 'city':
                setSelectedCities(prev => prev.filter(item => item !== chip.value));
                break;
            case 'cpv':
                setSelectedCpvs(prev => prev.filter(item => item !== chip.value));
                break;
            case 'cpvCategory':
                setSelectedCpvCategory(null);
                break;
        }
    };

    // Kliknięcie elementu statystyk: ustawia odpowiadający mu filtr (zastępując poprzedni wybór tego samego
    // rodzaju) i przechodzi do listy, żeby od razu pokazać pasujące przetargi.
    const handleStatisticsDrillDown = (target: StatisticsDrillDown) => {
        switch (target.kind) {
            case 'source':
                setSelectedSources([target.source]);
                break;
            case 'orderType':
                setSelectedOrderTypes([target.orderType]);
                break;
            case 'status':
                setStatusFilters({ ...NO_STATUS_FILTERS, [target.status]: true });
                break;
            case 'city':
                setSelectedCities([target.city]);
                break;
            case 'buyer':
                setSelectedBuyers([target.buyer]);
                break;
            case 'cpv':
                setSelectedCpvs([target.code]);
                break;
            case 'cpvCategory':
                setSelectedCpvCategory(target.category);
                break;
        }
        setActiveTab('tenders');
    };

    const { activeTenderId, onActivate: handleActivateTender, searchInputRef } = useCardShortcuts({
        displayedTenders,
        activeTab,
        liveTendersById,
        toggleFavorite,
        toggleStatus
    });

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

    // Statystyki dotyczą przetargów z wybranego zakresu dat, bez własnych gwiazdek (te są w "Zapisane")
    const statistics = useMemo(
        () => calculateStatistics(applyStatisticsFilters(unsavedTenders)),
        [applyStatisticsFilters, unsavedTenders]
    );

    // Porównanie z poprzednim okresem: dane wczytujemy tylko, gdy otwarta jest zakładka statystyk
    const comparisonPeriod = useMemo(
        () => (startDay && endDay ? getComparisonPeriod(startDay, endDay, todayDay) : null),
        [startDay, endDay, todayDay]
    );
    const previousPeriod = usePreviousPeriod(
        activeTab === 'statistics' && comparisonPeriod?.ok ? comparisonPeriod : null,
        refreshDayWithRetry
    );
    // Te same filtry i wyłączenie własnych gwiazdek co w bieżących statystykach, żeby liczby były porównywalne
    const previousStatistics = useMemo(
        () => calculateStatistics(applyStatisticsFilters(previousPeriod.tenders.filter((tender) => !isFavorite(tender.id)))),
        [applyStatisticsFilters, previousPeriod.tenders, isFavorite]
    );
    // Wykres godzinowy: dropdown ma dni z całej bazy (według dziennika odświeżeń), a nie tylko z wybranego
    // zakresu. Dzień spoza zakresu doczytujemy dopiero po wybraniu, przetargi tylko tego jednego dnia.
    const isStatisticsTab = activeTab === 'statistics';
    const refreshedDays = useRefreshedDays(isStatisticsTab, todayDay);
    // Trend nowych ogłoszeń z ostatnich dni: te same filtry i wyłączenie własnych gwiazdek co w statystykach
    const recent = useRecentTenders(isStatisticsTab, todayDay, TREND_DAYS);
    const trend = useMemo(
        () => ({
            points: countTendersByDay(
                applyStatisticsFilters(recent.tenders.filter((tender) => !isFavorite(tender.id))),
                lastDays(todayDay, TREND_DAYS),
                recent.completeDays
            ),
            error: recent.error
        }),
        [applyStatisticsFilters, recent.tenders, recent.completeDays, recent.error, isFavorite, todayDay]
    );
    // Średnia godzinowa z tych samych 14 dni (te same dane i filtry co trend, bez dodatkowych zapytań do bazy)
    const hourlyAverage = useMemo(
        () => averageHourlyDistribution(
            applyStatisticsFilters(recent.tenders.filter((tender) => !isFavorite(tender.id))),
            lastDays(todayDay, TREND_DAYS),
            recent.completeDays
        ),
        [applyStatisticsFilters, recent.tenders, recent.completeDays, isFavorite, todayDay]
    );
    const [hourlyDay, setHourlyDay] = useState('');
    const hourlyExtraDay = useMemo(() => {
        const day = isStatisticsTab ? displayDateToDay(hourlyDay) : null;
        if (!day) return null;
        return startDay && endDay && day >= startDay && day <= endDay ? null : day;
    }, [isStatisticsTab, hourlyDay, startDay, endDay]);
    const extraDay = useDayTenders(hourlyExtraDay);
    const isExtraDayLoaded = hourlyExtraDay !== null && extraDay.loadedDay === hourlyExtraDay;
    const hourlyDistribution = useMemo(() => {
        // Te same filtry i wyłączenie własnych gwiazdek co w statystykach z wybranego zakresu
        const extra = isExtraDayLoaded
            ? calculateStatistics(applyStatisticsFilters(extraDay.tenders.filter((tender) => !isFavorite(tender.id))))
                .ezamowieniaHourlyDistribution
            : {};
        return { ...extra, ...statistics.ezamowieniaHourlyDistribution };
    }, [isExtraDayLoaded, extraDay.tenders, applyStatisticsFilters, isFavorite, statistics.ezamowieniaHourlyDistribution]);
    const hourlyDays = useMemo(() => {
        const days = new Set([...Object.keys(statistics.ezamowieniaHourlyDistribution), ...refreshedDays.map(dayToDisplayDate)]);
        return Array.from(days).sort((a, b) => parseDate(b).getTime() - parseDate(a).getTime());
    }, [statistics.ezamowieniaHourlyDistribution, refreshedDays]);

    let comparison: StatisticsComparison | null = null;
    if (comparisonPeriod && endDay) {
        if (!comparisonPeriod.ok) {
            comparison = { status: 'unavailable', reason: comparisonPeriod.reason };
        } else if (previousPeriod.missingDays === null) {
            comparison = previousPeriod.error
                ? { status: 'unavailable', reason: previousPeriod.error }
                : { status: 'loading' };
        } else {
            const label = describePeriod(comparisonPeriod.startDay, comparisonPeriod.endDay);
            comparison = previousPeriod.missingDays.length > 0
                ? {
                    status: 'missing',
                    label,
                    isFetching: previousPeriod.isFetching,
                    error: previousPeriod.error,
                    onFetch: previousPeriod.fetchMissing
                }
                : {
                    status: 'ready',
                    label,
                    statistics: previousStatistics,
                    isCurrentPeriodOngoing: endDay >= todayDay
                };
        }
    }

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
                isRefreshing={isRefreshing}
                canRefresh={canRefreshAny}
                lastRefreshAt={lastRefreshAt}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchInputRef={searchInputRef}
            />
            <div className={styles.tabsBar}>
                <div className={styles.tabsContainer}>
                    <TabBar
                        idPrefix="main"
                        ariaLabel="Widok aplikacji"
                        className={styles.tabs}
                        tabClassName={styles.tab}
                        activeTabClassName={styles.tabActive}
                        activeId={activeTab}
                        onChange={setActiveTab}
                        tabs={[
                            { id: 'tenders', label: <>Przetargi <span className={styles.tabCount}>{filteredTenders.length}</span></> },
                            { id: 'saved', label: <>Zapisane <span className={styles.tabCount}>{favorites.length}</span></> },
                            { id: 'statistics', label: 'Statystyki' }
                        ]}
                    />
                </div>
            </div>
            <div className={styles.mainContent}>
                {activeTab !== 'statistics' && (
                    <BuyersSidebar
                        buyerOptionTenders={buyerOptionTenders}
                        cityOptionTenders={cityOptionTenders}
                        selectedBuyers={selectedBuyers}
                        selectedCities={selectedCities}
                        onBuyersChange={setSelectedBuyers}
                        onCitiesChange={setSelectedCities}
                    />
                )}
                <div className={styles.contentArea}>
                    <div
                        className={styles.tabContent}
                        role="tabpanel"
                        id={panelId('main')}
                        aria-labelledby={tabId('main', activeTab)}
                    >
                        {activeTab !== 'statistics' ? (
                            <div className={styles.container}>
                                <FiltersPanel
                                    selectedSources={selectedSources}
                                    onSourceToggle={handleSourceToggle}
                                    selectedOrderTypes={selectedOrderTypes}
                                    onOrderTypeToggle={handleOrderTypeToggle}
                                    statusFilters={statusFilters}
                                    onStatusFilterChange={(filter) =>
                                        setStatusFilters(prev => ({...prev, [filter]: !prev[filter]}))
                                    }
                                    selectedLabels={selectedLabels}
                                    onLabelToggle={(label) =>
                                        setSelectedLabels(prev => prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label])
                                    }
                                    selectedDocs={selectedDocs}
                                    onDocsToggle={(docs) =>
                                        setSelectedDocs(prev => prev.includes(docs) ? prev.filter(item => item !== docs) : [...prev, docs])
                                    }
                                    onShowAllStatuses={() => setStatusFilters({ toEnter: true, entered: true, toClarify: true, notToEnter: true, unmarked: true })}
                                    facetCounts={facetCounts}
                                    sortOrder={sortOrder}
                                    onSortOrderChange={setSortOrder}
                                    activeChips={activeChips}
                                    onRemoveChip={handleRemoveChip}
                                    hasActiveFilters={activeChips.length > 0 || searchQuery.trim() !== ""}
                                    onClearFilters={handleClearFilters}
                                    hiddenAdvertisersCount={hiddenAdvertisersCount}
                                    showHiddenAdvertisers={showHiddenAdvertisers}
                                    onShowHiddenAdvertisersChange={setShowHiddenAdvertisers}
                                />
                                    <TendersList
                                        activeTab={activeTab}
                                        displayedTenders={displayedTenders}
                                        isLoading={isLoading}
                                        isRefreshing={isRefreshing}
                                        refreshProgress={refreshProgress}
                                        loadError={loadError}
                                        refreshError={refreshError}
                                        actionError={actionError}
                                        commentsError={commentsError}
                                        advertiserError={advertiserError}
                                        unmarkedCount={facetCounts.statuses.unmarked ?? 0}
                                        showQueueHint={isQueueStatusFilter(statusFilters)}
                                        isQueueEmpty={isQueueEmpty}
                                        isFiltered={isFiltered}
                                        favoritesCount={favorites.length}
                                        getDisplayedCpvCodes={getDisplayedCpvCodes}
                                        liveTendersById={liveTendersById}
                                        commentsByTender={commentsByTender}
                                        onAddComment={addComment}
                                        onDeleteComment={deleteComment}
                                        advertiserDecisions={advertiserDecisions}
                                        onSetAdvertiserDecision={setAdvertiserDecision}
                                        activeTenderId={activeTenderId}
                                        onActivateTender={handleActivateTender}
                                    />
                            </div>
                        ) : (
                            <StatisticsTab
                                statistics={statistics}
                                isDateRange={useDateRange}
                                onDrillDown={handleStatisticsDrillDown}
                                hasActiveFilters={hasActiveStatisticsFilters}
                                onClearFilters={handleClearFilters}
                                comparison={comparison}
                                trend={trend}
                                hourly={{
                                    days: hourlyDays,
                                    distribution: hourlyDistribution,
                                    average: hourlyAverage,
                                    isLoading: hourlyExtraDay !== null && !isExtraDayLoaded && !extraDay.error,
                                    error: extraDay.error,
                                    onSelectDay: setHourlyDay
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tenders;
