import React from 'react';
import styles from './TenderTabs.module.css';

interface Tender {
    publicationNumber: string;
    title: string;
    publicationDate: string;
    deadlineDate: string;
    buyerCity: string;
    buyerName: string;
    cpvCodes: string[];
    link: string;
}

interface TenderTabsProps {
    tenders: Tender[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    onTabClose: (publicationNumber: string) => void;
}

const TenderTabs: React.FC<TenderTabsProps> = ({ tenders, activeTab, onTabChange, onTabClose }) => {
    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabsList}>
                {/* Lista przetargów jako pierwsza zakładka */}
                <div
                    className={`${styles.tab} ${activeTab === 'list' ? styles.activeTab : ''}`}
                    onClick={() => onTabChange('list')}
                >
                    <span className={styles.tabTitle}>Lista przetargów</span>
                </div>
                {/* Pozostałe zakładki */}
                {tenders.map((tender) => (
                    <div
                        key={tender.publicationNumber}
                        className={`${styles.tab} ${activeTab === tender.publicationNumber ? styles.activeTab : ''}`}
                        onClick={() => onTabChange(tender.publicationNumber)}
                    >
                        <span className={styles.tabTitle}>{tender.title}</span>
                        <button
                            className={styles.closeButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tender.publicationNumber);
                            }}
                            aria-label="Close tab"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TenderTabs; 