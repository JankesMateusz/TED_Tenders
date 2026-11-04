import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { isItRelatedCpv } from "../utils/cpvFilter";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { useAuth } from "../context/AuthContext";
import { OrderType } from "../utils/tenderSources";
import { TenderSource } from "../types/TenderSource";
import { Tender } from "../types/Tender";
import { TenderComment } from "../types/TenderComment";
import { DEFAULT_ORDER_TYPES, MESSAGES } from "../constants";
import { dayToDisplayDate, displayDateToDay, parseDate, toDayString } from "../utils/dateUtils";
import { calculateStatistics } from "../utils/calculateStatistics";
import { CpvCategoryKey } from "../utils/cpvCategories";
import { useRecentTenders } from "../hooks/useRecentTenders";
import TabBar, { panelId, tabId } from "./TabBar";
import { TREND_DAYS, countTendersByDay, lastDays } from "../utils/recentTrend";
import { SortOrder, countFacets, filterAndSortTenders, filterTenders } from "../utils/tenderFilters";
import { ALL_SOURCES, NO_STATUS_FILTERS, isQueueStatusFilter, loadFilters, saveFilters } from "../utils/persistedFilters";
import { fetchRefreshLog, refreshTendersForDay, subscribeToLastRefresh, subscribeToTenders } from "../utils/tendersApi";
import { canRefreshDay, daysToRefresh, listDays } from "../utils/refreshPlan";
import { useComments } from "../hooks/useComments";
import { useAdvertiserDecisions } from "../hooks/useAdvertiserDecisions";
import { isHiddenAdvertiser } from "../utils/advertisers";
import { usePreviousPeriod } from "../hooks/usePreviousPeriod";
import { useDayTenders, useRefreshedDays } from "../hooks/useHourlyDays";
import { describePeriod, getComparisonPeriod } from "../utils/comparison";
import { StatisticsTab, StatisticsDrillDown, StatisticsComparison } from "./StatisticsTab";
import { FiltersPanel } from "./FiltersPanel";
import { pluralizeTenders } from "../utils/pluralPl";
import { afterRemoval, nextActiveId } from "../utils/cardNavigation";
import { averageHourlyDistribution } from "../utils/hourlyAverage";
import { TENDER_STATUSES } from "../utils/tenderStatus";
import { ActiveFilterChip, buildActiveFilterChips } from "../utils/activeFilters";
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

/** Czy zdarzenie pochodzi z pola, w którym użytkownik pisze (skróty jednoklawiszowe nie mogą mu wtedy przeszkadzać). */
const isTypingTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** Czy otwarte jest menu lub okienko (status, filtry, komentarze); rozwijanie kodów CPV (`data-disclosure`) się nie liczy. */
const isPopupOpen = (): boolean =>
    document.querySelector('button[aria-expanded="true"]:not([data-disclosure])') !== null;

const NO_SAVED_TENDERS_MESSAGE = "Nie masz jeszcze zapisanych przetargów. Oznacz przetarg gwiazdką, aby trafił do tej zakładki.";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Odświeża dzień; jeśli serwer jest zajęty odświeżaniem innej osoby, czeka i ponawia. */
const refreshDayWithRetry = async (day: string, sources?: string[]) => {
    for (let attempt = 1; ; attempt++) {
        try {
            return await refreshTendersForDay(day, sources);
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
    // expanded state for CPV cards is now managed inside TenderCard
    const [statusFilters, setStatusFilters] = useState(initialFilters.statusFilters);
    const [activeTab, setActiveTab] = useState<'tenders' | 'saved' | 'statistics'>('tenders');
    const searchInputRef = useRef<HTMLInputElement>(null);
    // Karta, której dotyczą skróty klawiszowe (J/K, 1-4, 0, S)
    const [activeTenderId, setActiveTenderId] = useState<string | null>(null);
    const previousIdsRef = useRef<string[]>([]);

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
    const { advertiserDecisions, advertiserError, setAdvertiserDecision } = useAdvertiserDecisions();
    // Firmy prywatne i NGO są domyślnie ukryte; przełącznik w filtrach pokazuje je na czas przeglądania
    const [showHiddenAdvertisers, setShowHiddenAdvertisers] = useState<boolean>(false);

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
    // `includeBaza`: tylko na ręczną prośbę; Baza Konkurencyjności nie ma oficjalnego API, więc nie odpytujemy jej
    // przy każdym wejściu do aplikacji (poza tym pobiera ją zadanie raz dziennie).
    const refresh = useCallback(async (includeBaza: boolean = false) => {
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
                // Baza szuka ogłoszeń z kilku dni naraz, więc w zakresie pytamy o nią tylko przy ostatnim dniu
                const withBaza = includeBaza && index === days.length - 1;
                const result = await refreshDayWithRetry(
                    days[index],
                    withBaza ? [TenderSource.TED, TenderSource.E_ZAMOWIENIA, TenderSource.BAZA_KONKURENCYJNOSCI] : undefined
                );
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
            sortOrder
        });
    }, [uid, selectedSources, selectedOrderTypes, selectedBuyers, selectedCities, selectedCpvs, statusFilters, sortOrder]);

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
        sortOrder,
        advertiserDecisions,
        showHiddenAdvertisers
    }), [selectedSources, selectedOrderTypes, selectedBuyers, selectedCities, selectedCpvs, selectedCpvCategory, isFiltered, searchQuery, statusFilters, sortOrder, advertiserDecisions, showHiddenAdvertisers]);

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
    const hasActiveFilters = hasActiveStatisticsFilters || Object.values(statusFilters).some(Boolean);

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
    };

    const activeChips = useMemo(() => buildActiveFilterChips({
        statusFilters,
        selectedSources,
        selectedOrderTypes,
        selectedBuyers,
        selectedCities,
        selectedCpvs,
        selectedCpvCategory
    }), [statusFilters, selectedSources, selectedOrderTypes, selectedBuyers, selectedCities, selectedCpvs, selectedCpvCategory]);

    const handleRemoveChip = (chip: ActiveFilterChip) => {
        switch (chip.kind) {
            case 'status':
                setStatusFilters(prev => ({ ...prev, [chip.value as keyof typeof prev]: false }));
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
            // "/" - fokus na wyszukiwarkę, ale nie podczas pisania w polu (tam to zwykły znak)
            if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)) {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
            }
            // (Ctrl+E export was removed)
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Gdy aktywna karta zniknęła z listy (np. po ocenie w kolejce), aktywna zostaje następna albo ostatnia
    useEffect(() => {
        const ids = displayedTenders.map((tender) => tender.id);
        setActiveTenderId((current) => {
            if (current === null || ids.includes(current)) return current;
            const successor = afterRemoval(previousIdsRef.current, current);
            return successor !== null && ids.includes(successor) ? successor : null;
        });
        previousIdsRef.current = ids;
    }, [displayedTenders]);

    // Skróty do oceny: J/K, 1-4, 0, S. Nie działają w polach tekstowych, przy otwartym menu ani z Ctrl/Alt/Meta.
    useEffect(() => {
        if (activeTab === 'statistics') return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
            if (isTypingTarget(e.target) || isPopupOpen()) return;

            const key = e.key.toLowerCase();
            const ids = displayedTenders.map((tender) => tender.id);
            if (key === 'j' || key === 'k') {
                e.preventDefault();
                setActiveTenderId((current) => nextActiveId(ids, current, key === 'j' ? 'next' : 'prev'));
                return;
            }

            const tender = displayedTenders.find((item) => item.id === activeTenderId);
            if (!tender) return;
            if (key === 's') {
                e.preventDefault();
                toggleFavorite(tender);
                return;
            }
            // Status da się ustawić tylko dla ogłoszeń, które są jeszcze w bazie wspólnej (jak canSetStatus na karcie)
            if (!liveTendersById.has(tender.id)) return;
            if (key === '0') {
                e.preventDefault();
                if (tender.status) toggleStatus(tender, tender.status);
            } else if (/^[1-4]$/.test(key)) {
                e.preventDefault();
                toggleStatus(tender, TENDER_STATUSES[Number(key) - 1]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, displayedTenders, activeTenderId, liveTendersById, toggleFavorite, toggleStatus]);

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
                            { id: 'tenders', label: `Przetargi (${filteredTenders.length})` },
                            { id: 'saved', label: `Zapisane (${favorites.length})` },
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
                                    onShowAllStatuses={() => setStatusFilters({ toEnter: true, entered: true, toClarify: true, notToEnter: true, unmarked: true })}
                                    facetCounts={facetCounts}
                                    sortOrder={sortOrder}
                                    onSortOrderChange={setSortOrder}
                                    activeChips={activeChips}
                                    onRemoveChip={handleRemoveChip}
                                    hasActiveFilters={hasActiveFilters}
                                    onClearFilters={handleClearFilters}
                                    hiddenAdvertisersCount={hiddenAdvertisersCount}
                                    showHiddenAdvertisers={showHiddenAdvertisers}
                                    onShowHiddenAdvertisersChange={setShowHiddenAdvertisers}
                                />
                {(activeTab === 'saved' || (activeTab === 'tenders' && !isLoading)) && (
                    <div className={styles.queueHeader}>
                        {activeTab === 'saved' ? (
                            <span className={styles.queueHint}>{MESSAGES.SAVED_HINT}</span>
                        ) : (
                            <>
                                <span>
                                    <strong>{displayedTenders.length} {pluralizeTenders(displayedTenders.length)}</strong>
                                    {' · '}do przejrzenia: <strong>{facetCounts.statuses.unmarked ?? 0}</strong>
                                </span>
                                {isQueueStatusFilter(statusFilters) && (
                                    <span className={styles.queueHint}>{MESSAGES.QUEUE_HINT}</span>
                                )}
                                <span className={`${styles.queueHint} ${styles.queueHintFull}`}>{MESSAGES.SHORTCUTS_HINT}</span>
                            </>
                        )}
                    </div>
                )}
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
                {advertiserError && <p className={styles.message} role="alert">{advertiserError}</p>}
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
                        {isQueueEmpty
                            ? MESSAGES.QUEUE_EMPTY
                            : isFiltered ? MESSAGES.NO_IT_TENDERS : MESSAGES.NO_TENDERS}
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
                                    advertiserHidden={isHiddenAdvertiser(tender, advertiserDecisions)}
                                    onSetAdvertiserDecision={setAdvertiserDecision}
                                    isActive={tender.id === activeTenderId}
                                    onActivate={setActiveTenderId}
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
