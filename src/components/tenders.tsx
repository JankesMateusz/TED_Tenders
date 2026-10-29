import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { isItRelatedCpv } from "../utils/cpvFilter";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { OrderType } from "../utils/tenderSources";
import { TenderSource } from "../types/TenderSource";
import { Tender } from "../types/Tender";
import { TenderComment } from "../types/TenderComment";
import { DEFAULT_ORDER_TYPES, MESSAGES } from "../constants";
import { toDayString } from "../utils/dateUtils";
import { calculateStatistics } from "../utils/calculateStatistics";
import { StatusFilters, filterAndSortTenders } from "../utils/tenderFilters";
import { TenderStatus } from "../types/TenderStatus";
import { fetchRefreshLog, refreshTendersForDay, subscribeToLastRefresh, subscribeToTenders } from "../utils/tendersApi";
import { canRefreshDay, daysToRefresh, listDays } from "../utils/refreshPlan";
import { useComments } from "../hooks/useComments";
import { StatisticsTab } from "./StatisticsTab";
import { FiltersPanel } from "./FiltersPanel";
import Header from "./header";
import BuyersSidebar from "./BuyersSidebar";
import TenderCard from "./TenderCard";
import styles from "./Tenders.module.css";

const REFRESH_ERROR_MESSAGES: Record<string, string> = {
    "functions/unavailable": "Nie udało się pobrać nowych przetargów ze źródeł. Spróbuj ponownie za chwilę.",
    "functions/permission-denied": "Brak uprawnień do odświeżania przetargów.",
    "functions/unauthenticated": "Sesja wygasła. Zaloguj się ponownie."
};
const REFRESH_IN_PROGRESS_CODE = "functions/resource-exhausted";
// Serwer odświeża jeden dzień naraz (blokada). Gdy zajmuje go ktoś inny, czekamy i ponawiamy.
const IN_PROGRESS_RETRY_DELAY_MS = 3000;
const IN_PROGRESS_MAX_ATTEMPTS = 6;
const IN_PROGRESS_MESSAGE = "Inne odświeżanie nadal trwa. Spróbuj ponownie za chwilę.";
const PARTIAL_FAILURE_MESSAGE = "Nie wszystkie źródła odpowiedziały. Spróbuj odświeżyć ponownie za chwilę.";
const GENERIC_REFRESH_ERROR = "Nie udało się odświeżyć przetargów.";
const LOAD_ERROR_MESSAGE = "Nie udało się wczytać przetargów z bazy.";
const REFRESHING_MESSAGE = "Pobieranie nowych przetargów";

const NO_SAVED_TENDERS_MESSAGE = "Nie masz jeszcze zapisanych przetargów. Oznacz przetarg gwiazdką, aby trafił do tej zakładki.";
const NO_STATUS_FILTERS: StatusFilters = {
    toEnter: false,
    entered: false,
    toClarify: false,
    notToEnter: false,
    unmarked: false
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Odświeża dzień; jeśli serwer jest zajęty odświeżaniem innej osoby, czeka i ponawia. */
const refreshDayWithRetry = async (day: string) => {
    for (let attempt = 1; ; attempt++) {
        try {
            return await refreshTendersForDay(day);
        } catch (error) {
            const code = (error as { code?: string })?.code;
            if (code !== REFRESH_IN_PROGRESS_CODE || attempt >= IN_PROGRESS_MAX_ATTEMPTS) {
                throw error;
            }
            await sleep(IN_PROGRESS_RETRY_DELAY_MS);
        }
    }
};

// Stała referencja, żeby karty bez komentarzy nie renderowały się od nowa przy każdej zmianie
const NO_COMMENTS: TenderComment[] = [];

const Tenders: React.FC = () => {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const today = new Date();
    const [startDate, setStartDate] = useState<Date | null>(today);
    const [endDate, setEndDate] = useState<Date | null>(today);
    const [useDateRange, setUseDateRange] = useState<boolean>(false); // Domyślnie pojedynczy dzień
    const [searchQuery, setSearchQuery] = useState<string>("");
    // True do czasu pierwszej odpowiedzi bazy dla wybranego zakresu dat
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // True, gdy serwer pobiera nowe przetargi ze źródeł (lista pokazuje w tym czasie to, co już jest w bazie)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshError, setRefreshError] = useState<string | null>(null);
    // Postęp odświeżania wielu dni (tryb zakresu); null, gdy odświeżany jest jeden dzień lub nic
    const [refreshProgress, setRefreshProgress] = useState<{ done: number; total: number } | null>(null);
    const refreshRunId = useRef(0);
    // Czas ostatniego udanego odświeżenia przez kogokolwiek; null, gdy nieznany
    const [lastRefreshAt, setLastRefreshAt] = useState<Date | null>(null);
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
    const { favorites, isFavorite, actionError } = useUserPreferences();
    // expanded state for CPV cards is now managed inside TenderCard
    const [statusFilters, setStatusFilters] = useState<StatusFilters>(NO_STATUS_FILTERS);
    const [activeTab, setActiveTab] = useState<'tenders' | 'saved' | 'statistics'>('tenders');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Zakres dni do odczytu z bazy. W trybie pojedynczego dnia końcem jest zawsze początek.
    const startDay = startDate ? toDayString(startDate) : null;
    const endDay = useDateRange ? (endDate ? toDayString(endDate) : null) : startDay;
    const todayDay = toDayString(new Date());
    // Czy w wybranym zakresie jest choć jeden dzień, który serwer przyjmie do odświeżenia
    const canRefreshAny = Boolean(startDay && endDay && listDays(startDay, endDay).some((day) => canRefreshDay(day, todayDay)));

    useEffect(
        () =>
            subscribeToLastRefresh(setLastRefreshAt, (error) =>
                console.error("Błąd wczytywania czasu ostatniego odświeżenia:", error)
            ),
        []
    );

    const { commentsByTender, commentsError, addComment, deleteComment } = useComments(startDay, endDay);

    // Nasłuch przetargów z bazy dla wybranego zakresu dat (zmiany od innych użytkowników widać na bieżąco)
    useEffect(() => {
        if (!startDay || !endDay) {
            setTenders([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setLoadError(null);
        return subscribeToTenders(
            startDay,
            endDay,
            (loadedTenders) => {
                setTenders(loadedTenders);
                setIsLoading(false);
            },
            (error) => {
                console.error("Błąd wczytywania przetargów z bazy:", error);
                setLoadError(LOAD_ERROR_MESSAGE);
                setIsLoading(false);
            }
        );
    }, [startDay, endDay]);

    // Prosi serwer o pobranie nowych przetargów: dla pojedynczego dnia tego dnia, dla zakresu po kolei
    // wszystkich dni, których jeszcze nie pobrano. Wyniki pojawiają się na liście przez nasłuch bazy.
    const refresh = useCallback(async () => {
        if (!startDay || !endDay) return;

        // Nowe wywołanie (np. zmiana dnia) przerywa poprzednie po zakończeniu bieżącego dnia
        const runId = ++refreshRunId.current;
        const isCurrentRun = () => runId === refreshRunId.current;

        setIsRefreshing(true);
        setRefreshError(null);
        setRefreshProgress(null);
        try {
            // Pojedynczy dzień odświeżamy zawsze; zakres tylko w brakujących dniach
            const log = useDateRange ? await fetchRefreshLog(startDay, endDay) : {};
            const days = daysToRefresh(startDay, endDay, log, todayDay);

            let hadPartialFailure = false;
            for (let index = 0; index < days.length; index++) {
                if (!isCurrentRun()) return;
                setRefreshProgress({ done: index, total: days.length });
                const result = await refreshDayWithRetry(days[index]);
                hadPartialFailure = hadPartialFailure || result.errors.length > 0;
            }

            if (isCurrentRun() && hadPartialFailure) {
                setRefreshError(PARTIAL_FAILURE_MESSAGE);
            }
        } catch (error) {
            if (!isCurrentRun()) return;
            const code = (error as { code?: string })?.code ?? "";
            console.error("Błąd odświeżania przetargów:", error);
            setRefreshError(
                code === REFRESH_IN_PROGRESS_CODE ? IN_PROGRESS_MESSAGE : REFRESH_ERROR_MESSAGES[code] ?? GENERIC_REFRESH_ERROR
            );
        } finally {
            if (isCurrentRun()) {
                setIsRefreshing(false);
                setRefreshProgress(null);
            }
        }
    }, [startDay, endDay, useDateRange, todayDay]);

    // Odświeżenie przy wejściu do aplikacji i po zmianie dnia
    useEffect(() => {
        refresh();
    }, [refresh]);

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
            refresh();
        } else {
            setIsFiltered(false);
        }
    };

    const handleFilterClick = () => {
        // Filter tylko zmienia widok, nie odświeża danych
        setIsFiltered(true);
    };

    const handleRefresh = () => {
        refresh();
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

    const applyFilters = useCallback((list: Tender[]) => filterAndSortTenders(list, {
        selectedSources,
        selectedOrderTypes,
        selectedBuyer,
        selectedCity,
        isFiltered,
        searchQuery,
        statusFilters
    }), [selectedSources, selectedOrderTypes, selectedBuyer, selectedCity, isFiltered, searchQuery, statusFilters]);

    // Obie listy są filtrowane osobno, by licznik "Przetargi" nie zależał od aktywnej zakładki
    const filteredTenders = useMemo(() => applyFilters(unsavedTenders), [applyFilters, unsavedTenders]);
    const filteredSavedTenders = useMemo(() => applyFilters(savedTenders), [applyFilters, savedTenders]);
    const displayedTenders = activeTab === 'saved' ? filteredSavedTenders : filteredTenders;

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

    // Liczba przetargów z każdym wspólnym statusem na wyświetlanej liście
    const statusCounts = useMemo(() => {
        const counts = { toEnter: 0, entered: 0, toClarify: 0, notToEnter: 0 } as Record<TenderStatus, number>;
        displayedTenders.forEach((tender) => {
            if (tender.status) counts[tender.status]++;
        });
        return counts;
    }, [displayedTenders]);

    // Statystyki dotyczą przetargów z wybranego zakresu dat, bez własnych gwiazdek (te są w "Zapisane")
    const statistics = useMemo(() => calculateStatistics(displayedTenders), [displayedTenders]);

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
            />
            <div className={styles.mainContent}>
                {activeTab !== 'statistics' && (
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
                                    Przetargi ({filteredTenders.length})
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`${styles.tab} ${activeTab === 'saved' ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab('saved')}
                                >
                                    Zapisane ({favorites.length})
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
                        {activeTab !== 'statistics' ? (
                            <div className={styles.container}>
                                <FiltersPanel
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    searchInputRef={searchInputRef}
                                    selectedSources={selectedSources}
                                    onSourceToggle={handleSourceToggle}
                                    selectedOrderTypes={selectedOrderTypes}
                                    onOrderTypeToggle={handleOrderTypeToggle}
                                    statusFilters={statusFilters}
                                    onStatusFilterChange={(filter) =>
                                        setStatusFilters(prev => ({...prev, [filter]: !prev[filter]}))
                                    }
                                    statusCounts={statusCounts}
                                />
                {activeTab === 'tenders' && isLoading && (
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
                )}
                {activeTab === 'tenders' && loadError && <p className={styles.message} role="alert">{loadError}</p>}
                {activeTab === 'tenders' && refreshError && <p className={styles.message} role="alert">{refreshError}</p>}
                {actionError && <p className={styles.message} role="alert">{actionError}</p>}
                {commentsError && <p className={styles.message} role="alert">{commentsError}</p>}
                {activeTab === 'tenders' && isRefreshing && !isLoading && (
                    <p className={styles.message}>
                        {REFRESHING_MESSAGE}
                        {refreshProgress && refreshProgress.total > 1
                            ? ` (${refreshProgress.done + 1}/${refreshProgress.total})`
                            : "..."}
                    </p>
                )}
                {activeTab === 'tenders' && displayedTenders.length === 0 && !isLoading && !isRefreshing && !loadError && (
                    <p className={styles.message}>
                        {isFiltered ? MESSAGES.NO_IT_TENDERS : MESSAGES.NO_TENDERS}
                    </p>
                )}
                {activeTab === 'saved' && favorites.length === 0 && (
                    <p className={styles.message}>{NO_SAVED_TENDERS_MESSAGE}</p>
                )}
                {(activeTab === 'saved' || !isLoading) && (
                    <ul className={styles.tendersList}>
                        {displayedTenders.map((tender) => {
                            const cpvCodes = getDisplayedCpvCodes(tender);
                            return (
                                <TenderCard
                                    key={tender.id}
                                    tender={tender}
                                    cpvCodes={cpvCodes}
                                    canSetStatus={liveTendersById.has(tender.id)}
                                    comments={commentsByTender[tender.id] ?? NO_COMMENTS}
                                    canComment={liveTendersById.has(tender.id)}
                                    onAddComment={addComment}
                                    onDeleteComment={deleteComment}
                                />
                            );
                        })}
                    </ul>
                )}
                            </div>
                        ) : (
                            <StatisticsTab
                                statistics={statistics}
                                isDateRange={useDateRange}
                                savedCount={favorites.length}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tenders;
