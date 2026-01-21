import React from 'react';
import { Statistics } from '../utils/calculateStatistics';
import { TenderSource } from '../types/TenderSource';
import { getSourceConfig } from '../utils/tenderSources';
import styles from './StatisticsTab.module.css';

const ACTIVITY_LABELS: Record<string, string> = {
    health: 'Zdrowie',
    'general-public-services': 'Administracja publiczna',
    defence: 'Obrona',
    'public-order-and-safety': 'Porządek i bezpieczeństwo',
    environment: 'Środowisko',
    'economic-and-financial-affairs': 'Sprawy gospodarczo-finansowe',
    'housing-and-community-amenities': 'Budownictwo i infrastruktura komunalna',
    'recreation-culture-and-religion': 'Rekreacja, kultura i religia',
    education: 'Edukacja',
    'social-protection': 'Ochrona socjalna',
    other: 'Inne'
};

const formatActivityLabel = (rawKey: string): string => {
    const normalizedKey = rawKey.toLowerCase();
    if (ACTIVITY_LABELS[normalizedKey]) {
        return ACTIVITY_LABELS[normalizedKey];
    }
    return normalizedKey
        .split('-')
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
};

interface StatisticsTabProps {
    statistics: Statistics;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ statistics }) => {
    const buyerActivityEntries = Object.entries(statistics.byBuyerActivity);
    const hasBuyerActivity = buyerActivityEntries.length > 0;

    return (
        <div className={styles.statisticsContainer}>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.total}</div>
                    <div className={styles.statLabel}>Wszystkich przetargów</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: '#f39c12' }}>
                        {statistics.byStatus.favorites}
                    </div>
                    <div className={styles.statLabel}>Ulubionych</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: '#2ecc71' }}>
                        {statistics.byStatus.toBeEntered}
                    </div>
                    <div className={styles.statLabel}>Do wpisania</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: '#e74c3c' }}>
                        {statistics.deadlineStats.upcoming}
                    </div>
                    <div className={styles.statLabel}>Nadchodzących deadline</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.dateStats.today}</div>
                    <div className={styles.statLabel}>Opublikowanych dzisiaj</div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{statistics.dateStats.thisWeek}</div>
                    <div className={styles.statLabel}>W tym tygodniu</div>
                </div>
            </div>
            
            <div className={styles.sectionsGrid}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Według źródła</h3>
                    <div className={styles.sourceStats}>
                        {Object.entries(statistics.bySource).map(([source, count]) => {
                            const config = getSourceConfig(source as TenderSource);
                            return (
                                <div key={source} className={styles.sourceItem}>
                                    <span 
                                        className={styles.sourceBadge}
                                        style={{
                                            backgroundColor: config.backgroundColor,
                                            color: config.color
                                        }}
                                    >
                                        {config.label}
                                    </span>
                                    <span className={styles.sourceCount}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {Object.keys(statistics.byOrderType).length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Według typu zamówienia</h3>
                        <div className={styles.orderTypeStats}>
                            {Object.entries(statistics.byOrderType).map(([type, count]) => (
                                <div key={type} className={styles.orderTypeItem}>
                                    <span className={styles.orderTypeLabel}>{type}</span>
                                    <span className={styles.orderTypeCount}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasBuyerActivity && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Według działalności zamawiającego</h3>
                        <div className={styles.orderTypeStats}>
                            {buyerActivityEntries.map(([activity, count]) => (
                                <div key={activity} className={styles.orderTypeItem}>
                                    <span className={styles.orderTypeLabel}>{formatActivityLabel(activity)}</span>
                                    <span className={styles.orderTypeCount}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className={styles.sectionsGrid}>
                {statistics.topCities.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Top 10 miast</h3>
                        <ul className={styles.list}>
                            {statistics.topCities.map(({ city, count }, index) => (
                                <li key={city} className={styles.listItem}>
                                    <span className={styles.listRank}>{index + 1}.</span>
                                    <span className={styles.listName}>{city}</span>
                                    <span className={styles.listCount}>{count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {statistics.topBuyers.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Top 10 zamawiających</h3>
                        <ul className={styles.list}>
                            {statistics.topBuyers.map(({ buyer, count }, index) => (
                                <li key={buyer} className={styles.listItem}>
                                    <span className={styles.listRank}>{index + 1}.</span>
                                    <span className={styles.listName}>{buyer}</span>
                                    <span className={styles.listCount}>{count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

