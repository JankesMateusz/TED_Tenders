import React from 'react';
import { Statistics } from '../../utils/calculateStatistics';
import { TenderSource } from '../../types/TenderSource';
import { OrderType, getOrderTypeConfig, getSourceConfig } from '../../utils/tenderSources';
import { STATUS_CONFIG, TENDER_STATUSES } from '../../utils/tenderStatus';
import { DeltaBadge } from './DeltaBadge';
import { ShareBar } from './RankedList';
import type { StatisticsComparison, StatisticsDrillDown } from './types';
import styles from '../StatisticsTab.module.css';

interface SummaryCardsProps {
    statistics: Statistics;
    /** `null`, gdy nie ma wybranego zakresu dat. */
    comparison: StatisticsComparison | null;
    onDrillDown: (target: StatisticsDrillDown) => void;
}

/** Postęp oceniania, karty z liczbami (razem i po statusach) oraz podział na źródła i typy zamówień. */
export const SummaryCards: React.FC<SummaryCardsProps> = ({ statistics, comparison, onDrillDown }) => {
    const previous = comparison?.status === 'ready' ? comparison.statistics : null;
    const isPeriodOngoing = comparison?.status === 'ready' && comparison.isCurrentPeriodOngoing;
    const reviewedCount = statistics.total - statistics.byStatus.unmarked;
    const reviewedPercent = statistics.total > 0 ? Math.round((reviewedCount / statistics.total) * 100) : 0;

    return (
        <>
            {statistics.total > 0 && (
                <div className={styles.progress}>
                    <div className={styles.progressHeader}>
                        <span><strong>{reviewedCount}</strong> z {statistics.total} ocenionych</span>
                        <span>{reviewedPercent}%</span>
                    </div>
                    <div
                        className={styles.progressTrack}
                        role="progressbar"
                        aria-label="Postęp oceniania przetargów"
                        aria-valuemin={0}
                        aria-valuemax={statistics.total}
                        aria-valuenow={reviewedCount}
                    >
                        <span className={styles.progressBar} style={{ width: `${reviewedPercent}%` }} />
                    </div>
                </div>
            )}

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.total}</div>
                    <DeltaBadge current={statistics.total} previous={previous?.total} isPeriodOngoing={isPeriodOngoing} />
                    <div className={styles.statLabel}>Wszystkich przetargów</div>
                </div>

                {TENDER_STATUSES.map((status) => (
                    <button
                        key={status}
                        type="button"
                        className={`${styles.statCard} ${styles.clickable} ${statistics.byStatus[status] === 0 ? styles.statCardZero : ''}`}
                        onClick={() => onDrillDown({ kind: 'status', status })}
                    >
                        <div className={styles.statValue} style={{ color: STATUS_CONFIG[status].color }}>
                            {statistics.byStatus[status]}
                        </div>
                        <DeltaBadge
                            current={statistics.byStatus[status]}
                            previous={previous?.byStatus[status]}
                            isPeriodOngoing={isPeriodOngoing}
                        />
                        <div className={styles.statLabel}>{STATUS_CONFIG[status].label}</div>
                    </button>
                ))}
            </div>

            <div className={styles.sectionsGrid}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Według źródła</h3>
                    <div className={styles.sourceStats}>
                        {Object.entries(statistics.bySource).map(([source, count]) => {
                            const config = getSourceConfig(source as TenderSource);
                            return (
                                <button
                                    key={source}
                                    type="button"
                                    className={`${styles.sourceItem} ${styles.clickable}`}
                                    onClick={() => onDrillDown({ kind: 'source', source: source as TenderSource })}
                                >
                                    <span
                                        className={styles.sourceBadge}
                                        style={{
                                            backgroundColor: config.backgroundColor,
                                            color: config.color
                                        }}
                                    >
                                        {config.label}
                                    </span>
                                    <span className={styles.sourceCount}>
                                        {count}{' '}
                                        <DeltaBadge
                                            current={count}
                                            previous={previous?.bySource[source as TenderSource]}
                                            isPeriodOngoing={isPeriodOngoing}
                                        />
                                    </span>
                                    <ShareBar count={count} total={statistics.total} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {Object.keys(statistics.byOrderType).length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Według typu zamówienia</h3>
                        <div className={styles.orderTypeStats}>
                            {Object.entries(statistics.byOrderType).map(([type, count]) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`${styles.orderTypeItem} ${styles.clickable}`}
                                    onClick={() => onDrillDown({ kind: 'orderType', orderType: type as OrderType })}
                                >
                                    <span className={styles.orderTypeLabel}>{getOrderTypeConfig(type as OrderType).label}</span>
                                    <span className={styles.orderTypeCount}>{count}</span>
                                    <ShareBar count={count} total={statistics.total} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
