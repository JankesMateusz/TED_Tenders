import React, { useEffect, useState, useMemo, useCallback } from "react";
import { isItRelatedCpv } from "../utils/cpvFilter";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { useAuth } from "../context/AuthContext";
import { TenderSource } from "../types/TenderSource";
import { Tender } from "../types/Tender";
import { toDayString } from "../utils/dateUtils";
import TabBar, { panelId, tabId } from "./TabBar";
import { countFacets, filterAndSortTenders, filterTenders } from "../utils/tenderFilters";
import { isQueueStatusFilter } from "../utils/persistedFilters";
import { canRefreshDay, listDays } from "../utils/refreshPlan";
import { useTendersRefresh } from "../hooks/useTendersRefresh";
import { useTendersSubscription } from "../hooks/useTendersSubscription";
import { useCardShortcuts } from "../hooks/useCardShortcuts";
import { useTenderFilters } from "../hooks/useTenderFilters";
import { useStatisticsData } from "../hooks/useStatisticsData";
import { useComments } from "../hooks/useComments";
import { useAdvertiserDecisions } from "../hooks/useAdvertiserDecisions";
import { isHiddenAdvertiser } from "../utils/advertisers";
import { StatisticsTab, StatisticsDrillDown } from "./StatisticsTab";
import { FiltersPanel } from "./FiltersPanel";
import Header from "./header";
import BuyersSidebar from "./BuyersSidebar";
import { TendersList } from "./TendersList";
import styles from "./Tenders.module.css";

const Tenders: React.FC = () => {
    const today = new Date();
    const [startDate, setStartDate] = useState<Date | null>(today);
    const [endDate, setEndDate] = useState<Date | null>(today);
    const [useDateRange, setUseDateRange] = useState<boolean>(false); // Domyślnie pojedynczy dzień
    const { user } = useAuth();
    const uid = user?.uid ?? null;
    const { favorites, isFavorite, toggleFavorite, toggleStatus, actionError } = useUserPreferences();
    const [activeTab, setActiveTab] = useState<'tenders' | 'saved' | 'statistics'>('tenders');

    // Zakres dni do odczytu z bazy. W trybie pojedynczego dnia końcem jest zawsze początek.
    const startDay = startDate ? toDayString(startDate) : null;
    const endDay = useDateRange ? (endDate ? toDayString(endDate) : null) : startDay;
    const todayDay = toDayString(new Date());
    // Czy w wybranym zakresie jest choć jeden dzień, który serwer przyjmie do odświeżenia
    const canRefreshAny = Boolean(startDay && endDay && listDays(startDay, endDay).some((day) => canRefreshDay(day, todayDay)));

    const { commentsByTender, commentsError, addComment, deleteComment } = useComments(startDay, endDay);
    const { advertiserDecisions, advertiserError, setAdvertiserDecision } = useAdvertiserDecisions();
    const filters = useTenderFilters(uid, advertiserDecisions);
    const {
        searchQuery,
        isFiltered,
        selectedSources,
        selectedBuyers,
        selectedCities,
        statusFilters,
        filterOptions,
        savedFilterOptions,
        hasActiveStatisticsFilters,
        activeChips,
        handleClearFilters
    } = filters;

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
            filters.setIsFiltered(false);
        }
    };

    const handleFilterClick = () => {
        // Filter tylko zmienia widok, nie odświeża danych
        filters.setIsFiltered(true);
    };

    const handleRefresh = () => {
        refresh(true);
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

    const applyFilters = useCallback((list: Tender[]) => filterAndSortTenders(list, filterOptions), [filterOptions]);

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

    // Kolejka jest pusta, gdy są ogłoszenia pasujące do pozostałych filtrów, ale wszystkie mają już status
    const isQueueEmpty =
        isQueueStatusFilter(statusFilters) &&
        Object.values(facetCounts.statuses).some((count) => (count ?? 0) > 0);

    // Kliknięcie elementu statystyk ustawia odpowiadający mu filtr i przechodzi do listy, żeby od razu pokazać
    // pasujące przetargi.
    const handleStatisticsDrillDown = (target: StatisticsDrillDown) => {
        filters.applyDrillDown(target);
        setActiveTab('tenders');
    };

    const { activeTenderId, onActivate: handleActivateTender, searchInputRef } = useCardShortcuts({
        displayedTenders,
        activeTab,
        liveTendersById,
        toggleFavorite,
        toggleStatus
    });

    const tendersCountBySource = useMemo(() => {
        const counts: Record<TenderSource, number> = {
            [TenderSource.TED]: 0,
            [TenderSource.E_ZAMOWIENIA]: 0,
            [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
        };
        displayedTenders.forEach((tender) => {
            if (tender.source in counts) {
                counts[tender.source as TenderSource]++;
            }
        });
        return counts;
    }, [displayedTenders]);

    const { statistics, comparison, trend, hourly } = useStatisticsData({
        isStatisticsTab: activeTab === 'statistics',
        startDay,
        endDay,
        todayDay,
        unsavedTenders,
        filterOptions,
        isFavorite
    });

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
                onSearchChange={filters.setSearchQuery}
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
                        onBuyersChange={filters.setSelectedBuyers}
                        onCitiesChange={filters.setSelectedCities}
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
                                    onSourceToggle={filters.handleSourceToggle}
                                    selectedOrderTypes={filters.selectedOrderTypes}
                                    onOrderTypeToggle={filters.handleOrderTypeToggle}
                                    statusFilters={statusFilters}
                                    onStatusFilterChange={filters.handleStatusFilterToggle}
                                    selectedLabels={filters.selectedLabels}
                                    onLabelToggle={filters.handleLabelToggle}
                                    selectedDocs={filters.selectedDocs}
                                    onDocsToggle={filters.handleDocsToggle}
                                    onShowAllStatuses={filters.handleShowAllStatuses}
                                    facetCounts={facetCounts}
                                    sortOrder={filters.sortOrder}
                                    onSortOrderChange={filters.setSortOrder}
                                    activeChips={activeChips}
                                    onRemoveChip={filters.handleRemoveChip}
                                    hasActiveFilters={activeChips.length > 0 || searchQuery.trim() !== ""}
                                    onClearFilters={handleClearFilters}
                                    hiddenAdvertisersCount={hiddenAdvertisersCount}
                                    showHiddenAdvertisers={filters.showHiddenAdvertisers}
                                    onShowHiddenAdvertisersChange={filters.setShowHiddenAdvertisers}
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
                                hourly={hourly}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tenders;
