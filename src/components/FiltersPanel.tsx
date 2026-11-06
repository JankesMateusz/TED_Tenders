import React from 'react';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig, getOrderTypeConfig, OrderType } from '../utils/tenderSources';
import { DEFAULT_ORDER_TYPES } from '../constants';
import { FacetCounts, SortOrder, StatusFilters } from '../utils/tenderFilters';
import { ALL_SOURCES } from '../utils/persistedFilters';
import { STATUS_CONFIG, TENDER_STATUSES, UNMARKED_COLOR } from '../utils/tenderStatus';
import { TenderLabel } from '../types/TenderLabel';
import { DocsFilter } from '../types/DocsCheck';
import { DOCS_FILTERS, DOCS_FILTER_LABELS } from '../utils/docsCheck';
import { LABEL_CONFIG, TENDER_LABELS } from '../utils/tenderLabels';
import { ActiveFilterChip } from '../utils/activeFilters';
import { ActiveFilterChips } from './ActiveFilterChips';
import { FilterPopover, FilterPopoverOption } from './FilterPopover';
import styles from './Tenders.module.css';

const STATUS_FILTER_KEYS: Array<keyof StatusFilters> = [...TENDER_STATUSES, 'unmarked'];

const statusOption = (key: keyof StatusFilters) =>
    key === 'unmarked'
        ? { label: 'Nieoznaczone', color: UNMARKED_COLOR }
        : { label: STATUS_CONFIG[key].label, color: STATUS_CONFIG[key].color };

const SORT_OPTIONS: Array<{ value: SortOrder; label: string }> = [
    { value: 'publication', label: 'Data publikacji (najnowsze)' },
    { value: 'publicationAsc', label: 'Data publikacji (najstarsze)' },
    { value: 'buyer', label: 'Zamawiający (A–Z)' },
    { value: 'buyerDesc', label: 'Zamawiający (Z–A)' }
];

interface FiltersPanelProps {
    selectedSources: TenderSource[];
    onSourceToggle: (source: TenderSource) => void;
    selectedOrderTypes: OrderType[];
    onOrderTypeToggle: (orderType: OrderType) => void;
    statusFilters: StatusFilters;
    onStatusFilterChange: (filter: keyof StatusFilters) => void;
    onShowAllStatuses: () => void;
    selectedLabels: TenderLabel[];
    onLabelToggle: (label: TenderLabel) => void;
    selectedDocs: DocsFilter[];
    onDocsToggle: (docs: DocsFilter) => void;
    facetCounts: FacetCounts;
    sortOrder: SortOrder;
    onSortOrderChange: (order: SortOrder) => void;
    /** Chipy wszystkiego, co zawęża listę (poza frazą wyszukiwania) i usuwanie pojedynczego chipa. */
    activeChips: ActiveFilterChip[];
    onRemoveChip: (chip: ActiveFilterChip) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    /** Ile ogłoszeń ukrywają decyzje o zamawiających (firmy prywatne i NGO); przełącznik pojawia się, gdy są takie ogłoszenia. */
    hiddenAdvertisersCount: number;
    showHiddenAdvertisers: boolean;
    onShowHiddenAdvertisersChange: (show: boolean) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
    selectedSources,
    onSourceToggle,
    selectedOrderTypes,
    onOrderTypeToggle,
    statusFilters,
    onStatusFilterChange,
    onShowAllStatuses,
    selectedLabels,
    onLabelToggle,
    selectedDocs,
    onDocsToggle,
    facetCounts,
    sortOrder,
    onSortOrderChange,
    activeChips,
    onRemoveChip,
    hasActiveFilters,
    onClearFilters,
    hiddenAdvertisersCount,
    showHiddenAdvertisers,
    onShowHiddenAdvertisersChange
}) => {
    const statusOptions: FilterPopoverOption[] = STATUS_FILTER_KEYS.map((key) => ({
        key,
        ...statusOption(key),
        count: facetCounts.statuses[key] ?? 0,
        checked: statusFilters[key]
    }));

    const labelOptions: FilterPopoverOption[] = TENDER_LABELS.map((label) => ({
        key: label,
        label: LABEL_CONFIG[label].label,
        color: LABEL_CONFIG[label].color,
        count: facetCounts.labels[label] ?? 0,
        checked: selectedLabels.includes(label)
    }));

    const docsOptions: FilterPopoverOption[] = DOCS_FILTERS.map((docs) => ({
        key: docs,
        label: DOCS_FILTER_LABELS[docs],
        count: facetCounts.docs[docs] ?? 0,
        checked: selectedDocs.includes(docs)
    }));

    const sourceOptions: FilterPopoverOption[] = ALL_SOURCES.map((source) => {
        const config = getSourceConfig(source);
        return {
            key: source,
            label: config.label,
            color: config.backgroundColor,
            count: facetCounts.sources[source] ?? 0,
            checked: selectedSources.includes(source)
        };
    });

    const orderTypeOptions: FilterPopoverOption[] = DEFAULT_ORDER_TYPES.map((orderType) => {
        const config = getOrderTypeConfig(orderType);
        return {
            key: orderType,
            label: config.label,
            color: config.backgroundColor,
            count: facetCounts.orderTypes[orderType] ?? 0,
            checked: selectedOrderTypes.includes(orderType)
        };
    });

    // Znaczek pokazuje liczbę wybranych tylko wtedy, gdy wybór coś zawęża
    const narrowedBadge = (selected: number, total: number): number | undefined =>
        selected < total ? selected : undefined;
    const selectedStatusCount = STATUS_FILTER_KEYS.filter((key) => statusFilters[key]).length;

    return (
        <>
            <div className={styles.toolbar}>
                <FilterPopover
                    label="Status"
                    options={statusOptions}
                    onToggle={(key) => onStatusFilterChange(key as keyof StatusFilters)}
                    badge={selectedStatusCount}
                >
                    <button type="button" className={styles.popoverFooter} onClick={onShowAllStatuses}>
                        Pokaż wszystkie statusy
                    </button>
                </FilterPopover>
                <FilterPopover
                    label="Etykiety"
                    options={labelOptions}
                    onToggle={(key) => onLabelToggle(key as TenderLabel)}
                    badge={selectedLabels.length > 0 ? selectedLabels.length : undefined}
                />
                <FilterPopover
                    label="Dokumenty"
                    options={docsOptions}
                    onToggle={(key) => onDocsToggle(key as DocsFilter)}
                    badge={selectedDocs.length > 0 ? selectedDocs.length : undefined}
                />
                <FilterPopover
                    label="Źródło"
                    options={sourceOptions}
                    onToggle={(key) => onSourceToggle(key as TenderSource)}
                    badge={narrowedBadge(selectedSources.length, ALL_SOURCES.length)}
                />
                <FilterPopover
                    label="Typ"
                    options={orderTypeOptions}
                    onToggle={(key) => onOrderTypeToggle(key as OrderType)}
                    badge={narrowedBadge(selectedOrderTypes.length, DEFAULT_ORDER_TYPES.length)}
                />

                {(hiddenAdvertisersCount > 0 || showHiddenAdvertisers) && (
                    <label className={styles.plainCheckbox} title="Firmy prywatne i organizacje pozarządowe (ogłoszenia z Bazy Konkurencyjności) są domyślnie ukryte">
                        <input
                            type="checkbox"
                            checked={showHiddenAdvertisers}
                            onChange={(e) => onShowHiddenAdvertisersChange(e.target.checked)}
                        />
                        <span>
                            Pokaż ukrytych zamawiających ({hiddenAdvertisersCount})
                            <span className={styles.plainCheckboxHint}> – z Bazy Konkurencyjności</span>
                        </span>
                    </label>
                )}

                <div className={styles.toolbarSort}>
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
            </div>

            <ActiveFilterChips
                chips={activeChips}
                onRemove={onRemoveChip}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={onClearFilters}
            />
        </>
    );
};
