import React from "react";
import styles from "./Header.module.css";
import { useTheme } from "../context/ThemeContext";
import UserMenu from "./UserMenu";
import ModuleMenu from "./ModuleMenu";
import DatePopover from "./DatePopover";
import { TenderSource } from "../types/TenderSource";
import { tenderSourceConfig } from "../utils/tenderSources";
import { formatRelativeTime } from "../utils/dateUtils";
import { PLACEHOLDER_TEXTS } from "../constants";

interface HeaderProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    useDateRange: boolean;
    setUseDateRange: (value: boolean) => void;
    tendersCountBySource: Record<TenderSource, number>;
    onAllTendersClick: () => void;
    onFilterClick: () => void;
    onRefresh: () => void;
    isFiltered: boolean;
    selectedSources: TenderSource[];
    isLoading: boolean;
    /** Trwa pobieranie nowych przetargów ze źródeł (nie blokuje przeglądania listy). */
    isRefreshing: boolean;
    /** Odświeżanie ze źródeł jest możliwe tylko dla dni z ostatniego miesiąca. */
    canRefresh: boolean;
    /** Kiedy ktokolwiek ostatnio pobrał nowe przetargi ze źródeł; null, gdy nieznane. */
    lastRefreshAt: Date | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const RefreshIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
    </svg>
);

const SearchIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
    </svg>
);

const MoonIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
);

const SunIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ 
    startDate, 
    endDate,
    setStartDate,
    setEndDate,
    useDateRange,
    setUseDateRange,
    tendersCountBySource,
    onAllTendersClick,
    onFilterClick,
    onRefresh,
    isFiltered,
    selectedSources,
    isLoading,
    isRefreshing,
    canRefresh,
    lastRefreshAt,
    searchQuery,
    onSearchChange,
    searchInputRef
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
                <ModuleMenu current="tenders" />
                <span className={styles.brandMark} aria-hidden="true">P</span>
                <h1 className={styles.title}>Przetargi</h1>
            </div>
            <div className={styles.search} role="search">
                <span className={styles.searchIcon}><SearchIcon /></span>
                <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder={PLACEHOLDER_TEXTS.SEARCH}
                    aria-label="Szukaj w przetargach (tytuł, zamawiający, miasto, numer, CPV)"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Delete' && searchQuery) {
                            e.preventDefault();
                            onSearchChange("");
                        }
                    }}
                />
                {searchQuery ? (
                    <button
                        type="button"
                        className={styles.clearSearchButton}
                        onClick={() => onSearchChange("")}
                        aria-label="Wyczyść wyszukiwanie"
                        title="Wyczyść wyszukiwanie"
                    >
                        ✕
                    </button>
                ) : (
                    <kbd className={styles.searchKey} aria-hidden="true">/</kbd>
                )}
            </div>
            <div className={styles.tenderInfo}>
                <div className={styles.tenderCounts}>
                    {[TenderSource.TED, TenderSource.E_ZAMOWIENIA, TenderSource.BAZA_KONKURENCYJNOSCI].map((source) => {
                        // Ukrywamy licznik, jeśli źródło jest odfiltrowane
                        if (!selectedSources.includes(source)) return null;

                        return (
                            <span key={source} className={styles.tenderCountItem}>
                                <span>{tenderSourceConfig[source].label}:</span>
                                <span className={styles.tenderCountValue}>{tendersCountBySource[source]}</span>
                            </span>
                        );
                    })}
                    <span className={styles.lastRefresh} title="Ostatnie udane pobranie nowych przetargów ze źródeł (przez dowolnego użytkownika)">
                        Ostatnia aktualizacja: {lastRefreshAt ? formatRelativeTime(lastRefreshAt) : 'brak danych'}
                    </span>
                </div>
            </div>
            <div className={styles.controls}>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isFiltered}
                    className={styles.switchToggle}
                    onClick={isFiltered ? onAllTendersClick : onFilterClick}
                    disabled={isLoading}
                    title={isFiltered ? "Pokazuję tylko ogłoszenia z kodami CPV z branży IT" : "Pokazuję wszystkie ogłoszenia, także spoza branży IT"}
                >
                    <span className={styles.switchTrack} aria-hidden="true">
                        <span className={styles.switchThumb} />
                    </span>
                    Tylko IT
                </button>
                <DatePopover
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    useDateRange={useDateRange}
                    setUseDateRange={setUseDateRange}
                />
                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.iconButton} ${isRefreshing ? styles.spinning : ''}`}
                        onClick={onRefresh}
                        disabled={isRefreshing || !canRefresh}
                        aria-label={isRefreshing ? "Pobieranie nowych przetargów…" : "Odśwież przetargi"}
                        aria-busy={isRefreshing}
                        title={canRefresh ? "Pobierz nowe przetargi" : "Odświeżanie dostępne dla dni z ostatniego miesiąca"}
                    >
                        <RefreshIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.iconButton}`}
                        onClick={toggleTheme}
                        aria-label={theme === 'light' ? "Włącz ciemny motyw" : "Włącz jasny motyw"}
                        title={theme === 'light' ? "Włącz ciemny motyw" : "Włącz jasny motyw"}
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                </div>
            </div>
            <UserMenu />
          </div>
        </header>
    );
};

export default Header;