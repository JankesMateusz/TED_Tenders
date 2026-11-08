import React, { useState } from 'react';
import { DictionaryOption, OrderListItem } from '../../types/Orders';
import { orderHash } from './ordersRoute';
import { useDictionaries } from './useDictionaries';
import { OrderFilters, useOrdersList } from './useOrdersList';
import styles from './OrdersList.module.css';

const labelFor = (options: DictionaryOption[] | undefined, code: string): string =>
    options?.find((o) => o.code === code)?.label ?? code;

const optionText = (o: DictionaryOption): string => (o.label && o.label !== o.code ? `${o.code} (${o.label})` : o.code);

const formatDate = (value: string | null): string => (value ? value : 'brak');

const statusSummary = (counts: Record<string, number>): string =>
    Object.entries(counts)
        .map(([status, n]) => `${status}: ${n}`)
        .join(', ');

interface SelectProps {
    label: string;
    value: string;
    options: { value: string; text: string }[];
    onChange: (value: string) => void;
}

const FilterSelect: React.FC<SelectProps> = ({ label, value, options, onChange }) => (
    <label className={styles.field}>
        <span>{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Wszystkie</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.text}
                </option>
            ))}
        </select>
    </label>
);

const OrderRow: React.FC<{ order: OrderListItem; lobLabels: DictionaryOption[] | undefined }> = ({ order, lobLabels }) => (
    <tr>
        <td data-label="MDP ID">
            <a href={orderHash(order.id)}>{order.mdpId}</a>
        </td>
        <td data-label="Nr przetargu">{order.endUserBidNumber ?? 'brak'}</td>
        <td data-label="Zamawiający">
            <div>{order.buyer.name}</div>
            {order.buyer.town && <div className={styles.muted}>{order.buyer.town}</div>}
        </td>
        <td data-label="Zarejestrowano">{formatDate(order.registeredOn)}</td>
        <td data-label="Termin ofert">{formatDate(order.bidDate)}</td>
        <td data-label="Kategorie LoB">
            {order.lobCategories.length === 0
                ? 'brak'
                : order.lobCategories.map((code) => (
                      <span key={code} className={styles.tag} title={labelFor(lobLabels, code)}>
                          {code}
                      </span>
                  ))}
        </td>
        <td data-label="Pozycje">
            <div>{order.positionsCount}</div>
            <div className={styles.muted}>{statusSummary(order.positionStatusCounts)}</div>
        </td>
        <td data-label="Status">{order.status}</td>
    </tr>
);

/** Przewijalna lista zamówień z filtrami (dane z bazy przez funkcję listOrders). */
const OrdersList: React.FC = () => {
    const [filters, setFilters] = useState<OrderFilters>({});
    const { dictionaries, error: dictionariesError } = useDictionaries();
    const { items, loading, loadingMore, error, hasMore, loadMore, retry } = useOrdersList(filters);

    const setFilter = <K extends keyof OrderFilters>(key: K, value: string) =>
        setFilters((current) => {
            const next = { ...current };
            if (value === '') delete next[key];
            else (next as Record<string, unknown>)[key] = key === 'year' ? Number(value) : value;
            return next;
        });

    const fromDictionary = (options: DictionaryOption[] | undefined) =>
        (options ?? []).map((o) => ({ value: o.code, text: optionText(o) }));

    return (
        <section aria-label="Lista zamówień">
            <div className={styles.filters} role="search">
                <label className={`${styles.field} ${styles.search}`}>
                    <span>Szukaj</span>
                    <input
                        type="search"
                        placeholder="MDP ID, nr przetargu, nazwa, zamawiający"
                        value={filters.search ?? ''}
                        onChange={(e) => setFilter('search', e.target.value)}
                    />
                </label>
                <FilterSelect
                    label="Rok"
                    value={filters.year?.toString() ?? ''}
                    options={(dictionaries?.years ?? []).map((y) => ({ value: String(y), text: String(y) }))}
                    onChange={(v) => setFilter('year', v)}
                />
                <FilterSelect
                    label="Kategoria LoB"
                    value={filters.lobCategory ?? ''}
                    options={fromDictionary(dictionaries?.lobCategories)}
                    onChange={(v) => setFilter('lobCategory', v)}
                />
                <FilterSelect
                    label="Status pozycji"
                    value={filters.positionStatus ?? ''}
                    options={fromDictionary(dictionaries?.positionStatuses)}
                    onChange={(v) => setFilter('positionStatus', v)}
                />
                <FilterSelect
                    label="Typ konta"
                    value={filters.accountType ?? ''}
                    options={fromDictionary(dictionaries?.accountTypes)}
                    onChange={(v) => setFilter('accountType', v)}
                />
            </div>
            {dictionariesError && <p className={styles.warning}>{dictionariesError} Filtry mogą być niepełne.</p>}

            {error && (
                <div className={styles.error} role="alert">
                    <span>{error}</span>
                    <button type="button" onClick={retry}>
                        Spróbuj ponownie
                    </button>
                </div>
            )}

            {loading && <p role="status">Ładowanie zamówień…</p>}
            {!loading && !error && items.length === 0 && <p role="status">Brak zamówień spełniających kryteria.</p>}

            {items.length > 0 && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">MDP ID</th>
                            <th scope="col">Nr przetargu</th>
                            <th scope="col">Zamawiający</th>
                            <th scope="col">Zarejestrowano</th>
                            <th scope="col">Termin ofert</th>
                            <th scope="col">Kategorie LoB</th>
                            <th scope="col">Pozycje</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((order) => (
                            <OrderRow key={order.id} order={order} lobLabels={dictionaries?.lobCategories} />
                        ))}
                    </tbody>
                </table>
            )}

            {hasMore && !loading && (
                <button type="button" className={styles.more} onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? 'Ładowanie…' : 'Pokaż więcej'}
                </button>
            )}
        </section>
    );
};

export default OrdersList;
