import { useCallback, useEffect, useMemo, useState } from "react";
import { TenderSource } from "../types/TenderSource";
import { TenderLabel } from "../types/TenderLabel";
import { DocsFilter } from "../types/DocsCheck";
import { OrderType } from "../utils/tenderSources";
import { DEFAULT_ORDER_TYPES } from "../constants";
import { CpvCategoryKey } from "../utils/cpvCategories";
import { SortOrder, StatusFilters } from "../utils/tenderFilters";
import { ALL_SOURCES, NO_STATUS_FILTERS, loadFilters, saveFilters } from "../utils/persistedFilters";
import { ActiveFilterChip, buildActiveFilterChips } from "../utils/activeFilters";
import { toggleInArray } from "../utils/toggleInArray";
import { useAdvertiserDecisions } from "./useAdvertiserDecisions";
import type { StatisticsDrillDown } from "../components/StatisticsTab";

type AdvertiserDecisions = ReturnType<typeof useAdvertiserDecisions>["advertiserDecisions"];

/**
 * Stan wszystkich filtrów listy przetargów: panel filtrów, pasek boczny, wyszukiwarka, przełącznik "Wszystkie / IT"
 * i kategoria CPV ze statystyk. Filtry (poza frazą wyszukiwania) są zapamiętywane w przeglądarce osobno dla każdego konta.
 */
export const useTenderFilters = (uid: string | null, advertiserDecisions: AdvertiserDecisions) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    // Domyślnie tylko przetargi z kodami CPV związanymi z IT; przycisk „All tenders” pokazuje wszystkie branże
    const [isFiltered, setIsFiltered] = useState<boolean>(true);
    const [initialFilters] = useState(() => loadFilters(uid));
    const [selectedSources, setSelectedSources] = useState<TenderSource[]>(initialFilters.selectedSources);
    const [selectedOrderTypes, setSelectedOrderTypes] = useState<OrderType[]>(initialFilters.selectedOrderTypes);
    const [selectedBuyers, setSelectedBuyers] = useState<string[]>(initialFilters.selectedBuyers);
    const [selectedCities, setSelectedCities] = useState<string[]>(initialFilters.selectedCities);
    const [selectedCpvs, setSelectedCpvs] = useState<string[]>(initialFilters.selectedCpvs);
    // Kategoria CPV ze statystyk: dotyczy tylko bieżącej sesji, w przeciwieństwie do zapamiętywanych filtrów
    const [selectedCpvCategory, setSelectedCpvCategory] = useState<CpvCategoryKey | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialFilters.sortOrder);
    const [statusFilters, setStatusFilters] = useState<StatusFilters>(initialFilters.statusFilters);
    const [selectedLabels, setSelectedLabels] = useState<TenderLabel[]>(initialFilters.selectedLabels);
    const [selectedDocs, setSelectedDocs] = useState<DocsFilter[]>(initialFilters.selectedDocs);
    // Firmy prywatne i NGO są domyślnie ukryte; przełącznik w filtrach pokazuje je na czas przeglądania
    const [showHiddenAdvertisers, setShowHiddenAdvertisers] = useState<boolean>(false);

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

    const handleSourceToggle = (source: TenderSource) => setSelectedSources((prev) => toggleInArray(prev, source));
    const handleOrderTypeToggle = (orderType: OrderType) => setSelectedOrderTypes((prev) => toggleInArray(prev, orderType));
    const handleLabelToggle = (label: TenderLabel) => setSelectedLabels((prev) => toggleInArray(prev, label));
    const handleDocsToggle = (docs: DocsFilter) => setSelectedDocs((prev) => toggleInArray(prev, docs));
    const handleStatusFilterToggle = (filter: keyof StatusFilters) =>
        setStatusFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
    const handleShowAllStatuses = () =>
        setStatusFilters({ toEnter: true, entered: true, toClarify: true, notToEnter: true, unmarked: true });

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

    // Kliknięcie elementu statystyk ustawia odpowiadający mu filtr, zastępując poprzedni wybór tego samego rodzaju.
    // Przejście do listy przetargów jest po stronie wywołującego.
    const applyDrillDown = useCallback((target: StatisticsDrillDown) => {
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
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        isFiltered,
        setIsFiltered,
        selectedSources,
        selectedOrderTypes,
        selectedBuyers,
        setSelectedBuyers,
        selectedCities,
        setSelectedCities,
        statusFilters,
        selectedLabels,
        selectedDocs,
        sortOrder,
        setSortOrder,
        showHiddenAdvertisers,
        setShowHiddenAdvertisers,
        filterOptions,
        savedFilterOptions,
        hasActiveStatisticsFilters,
        activeChips,
        handleSourceToggle,
        handleOrderTypeToggle,
        handleLabelToggle,
        handleDocsToggle,
        handleStatusFilterToggle,
        handleShowAllStatuses,
        handleClearFilters,
        handleRemoveChip,
        applyDrillDown
    };
};
