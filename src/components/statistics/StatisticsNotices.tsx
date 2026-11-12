import React from 'react';
import type { StatisticsComparison } from '../StatisticsTab';
import styles from '../StatisticsTab.module.css';

interface StatisticsNoticesProps {
    /** Czy lista, z której liczone są statystyki, jest zawężona filtrami. */
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    /** `null`, gdy nie ma wybranego zakresu dat. */
    comparison: StatisticsComparison | null;
}

/** Komunikaty nad statystykami: że lista jest przefiltrowana oraz jak wygląda porównanie z poprzednim okresem. */
export const StatisticsNotices: React.FC<StatisticsNoticesProps> = ({ hasActiveFilters, onClearFilters, comparison }) => (
    <>
        {hasActiveFilters && (
            <div className={styles.filterNotice} role="status">
                <span>Statystyki dotyczą przefiltrowanej listy (aktywne są filtry).</span>
                <button type="button" onClick={onClearFilters}>Wyczyść filtry</button>
            </div>
        )}
        {comparison && (
            <div className={styles.comparisonNotice} role="status">
                {comparison.status === 'unavailable' && <span>Porównanie niedostępne: {comparison.reason}</span>}
                {comparison.status === 'loading' && <span>Wczytywanie danych do porównania...</span>}
                {comparison.status === 'missing' && (
                    <>
                        <span>
                            Porównanie z: <strong>{comparison.label}</strong>. Brakuje kompletnych danych z tego okresu,
                            więc liczby byłyby zaniżone.
                            {comparison.error && <> {comparison.error}</>}
                        </span>
                        <button type="button" onClick={comparison.onFetch} disabled={comparison.isFetching}>
                            {comparison.isFetching ? 'Pobieranie...' : 'Pobierz dane z tego okresu'}
                        </button>
                    </>
                )}
                {comparison.status === 'ready' && (
                    <span>
                        Zmiana względem: <strong>{comparison.label}</strong>
                        {comparison.isCurrentPeriodOngoing && '. Bieżący okres jeszcze trwa, więc pokazujemy liczby z poprzedniego okresu zamiast różnicy.'}
                    </span>
                )}
            </div>
        )}
    </>
);
