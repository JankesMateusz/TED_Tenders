import React from 'react';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig, getOrderTypeConfig, OrderType } from '../utils/tenderSources';
import { DEFAULT_ORDER_TYPES, PLACEHOLDER_TEXTS } from '../constants';
import styles from './Tenders.module.css';

interface StatusFilters {
    favorites: boolean;
    toBeEntered: boolean;
    notToBeEntered: boolean;
    unmarked: boolean;
}

interface FiltersPanelProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    selectedSources: TenderSource[];
    onSourceToggle: (source: TenderSource) => void;
    selectedOrderTypes: OrderType[];
    onOrderTypeToggle: (orderType: OrderType) => void;
    statusFilters: StatusFilters;
    onStatusFilterChange: (filter: keyof StatusFilters) => void;
    toBeEnteredCount: number;
    notToBeEnteredCount: number;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
    searchQuery,
    onSearchChange,
    searchInputRef,
    selectedSources,
    onSourceToggle,
    selectedOrderTypes,
    onOrderTypeToggle,
    statusFilters,
    onStatusFilterChange,
    toBeEnteredCount,
    notToBeEnteredCount
}) => {
    return (
        <>
            <div className={styles.searchSection}>
                <div className={styles.searchInputWrapper}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={PLACEHOLDER_TEXTS.SEARCH}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Delete' && searchQuery) {
                                e.preventDefault();
                                onSearchChange("");
                            }
                        }}
                        className={styles.searchInput}
                    />
                    {searchQuery && (
                        <button
                            className={styles.clearSearchButton}
                            onClick={() => onSearchChange("")}
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
                                    onChange={() => onSourceToggle(source)}
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
                                        onChange={() => onOrderTypeToggle(orderType)}
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
                            onChange={() => onStatusFilterChange('favorites')}
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
                            onChange={() => onStatusFilterChange('toBeEntered')}
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
                            onChange={() => onStatusFilterChange('notToBeEntered')}
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
                            onChange={() => onStatusFilterChange('unmarked')}
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
        </>
    );
};
