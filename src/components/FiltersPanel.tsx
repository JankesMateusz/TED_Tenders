import React from 'react';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig, getOrderTypeConfig, OrderType } from '../utils/tenderSources';
import { DEFAULT_ORDER_TYPES, PLACEHOLDER_TEXTS } from '../constants';
import { FacetCounts, SortOrder, StatusFilters } from '../utils/tenderFilters';
import { STATUS_CONFIG, TENDER_STATUSES } from '../utils/tenderStatus';
import { getCpvName } from '../utils/cpvMapping';
import styles from './Tenders.module.css';

const STATUS_FILTER_OPTIONS: Array<{ key: keyof StatusFilters; label: string; color: string }> = [
    ...TENDER_STATUSES.map((status) => ({ key: status, ...STATUS_CONFIG[status] })),
    { key: 'unmarked', label: 'Nieoznaczone', color: '#95a5a6' }
];

const SORT_OPTIONS: Array<{ value: SortOrder; label: string }> = [
    { value: 'publication', label: 'Data publikacji (najnowsze)' },
    { value: 'deadline', label: 'Termin składania (najbliższy)' },
    { value: 'buyer', label: 'Zamawiający (A–Z)' }
];

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
    facetCounts: FacetCounts;
    sortOrder: SortOrder;
    onSortOrderChange: (order: SortOrder) => void;
    selectedCpvs: string[];
    onRemoveCpv: (code: string) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
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
    facetCounts,
    sortOrder,
    onSortOrderChange,
    selectedCpvs,
    onRemoveCpv,
    hasActiveFilters,
    onClearFilters
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
            
            {selectedCpvs.map((code) => (
                <div key={code} className={styles.activeCpvFilter}>
                    <span>CPV: {getCpvName(code)} ({code})</span>
                    <button
                        type="button"
                        onClick={() => onRemoveCpv(code)}
                        aria-label={`Usuń filtr kodu CPV ${code}`}
                        title="Usuń filtr kodu CPV"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <div className={styles.sortSection}>
                <label className={styles.sortLabel} htmlFor="sort-order">Sortuj:</label>
                <select
                    id="sort-order"
                    className={styles.sortSelect}
                    value={sortOrder}
                    onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
                >
                    {SORT_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
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
                                    {config.label} ({facetCounts.sources[source] ?? 0})
                                </span>
                            </label>
                        );
                    })}
                </div>
                
                {(selectedSources.includes(TenderSource.E_ZAMOWIENIA) || selectedSources.includes(TenderSource.TED)) && (
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
                                        {config.label} ({facetCounts.orderTypes[orderType] ?? 0})
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div className={styles.statusFiltersSection}>
                <div className={styles.sourceFilters}>
                    <span className={styles.sourceFiltersLabel}>Filtruj po statusie:</span>
                    {STATUS_FILTER_OPTIONS.map(({ key, label, color }) => (
                        <label key={key} className={styles.sourceFilterLabel}>
                            <input
                                type="checkbox"
                                checked={statusFilters[key]}
                                onChange={() => onStatusFilterChange(key)}
                                className={styles.sourceCheckbox}
                            />
                            <span
                                className={styles.sourceFilterBadge}
                                style={{
                                    backgroundColor: statusFilters[key] ? color : 'rgba(0, 0, 0, 0.1)',
                                    color: statusFilters[key] ? '#ffffff' : 'var(--text-secondary)',
                                    border: `1px solid ${statusFilters[key] ? color : 'rgba(0, 0, 0, 0.2)'}`
                                }}
                            >
                                {label} ({facetCounts.statuses[key] ?? 0})
                            </span>
                        </label>
                    ))}
                    <button
                        type="button"
                        className={styles.clearFiltersButton}
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                    >
                        Wyczyść filtry
                    </button>
                </div>
            </div>
        </>
    );
};
