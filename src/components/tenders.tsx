import React, { useEffect, useState } from "react";
import { fetchTenders } from "../utils/fetchTenders";
import { filterTendersByCpvCodes, isItRelatedCpv, removeChangeNotices } from "../utils/cpvFilter";
import { getCpvName } from "../utils/cpvMapping";
import { useUserPreferences } from "../context/UserPreferencesContext";
import Header from "./header";
import EmailAlertDialog from "./EmailAlertDialog";
import TenderTabs from "./TenderTabs";
import styles from "./Tenders.module.css";

const Tenders: React.FC = () => {
    const [tenders, setTenders] = useState<any[]>([]);
    const [filteredTenders, setFilteredTenders] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [totalTenders, setTotalTenders] = useState<number>(0);
    const [isEmailAlertOpen, setIsEmailAlertOpen] = useState(false);
    const [openTabs, setOpenTabs] = useState<any[]>([]); // tylko przetargi
    const [activeTab, setActiveTab] = useState<string>('list'); // 'list' lub publicationNumber
    const { 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite,
        toggleTenderSelection,
        isTenderSelected
    } = useUserPreferences();
    const [expandedCpvCards, setExpandedCpvCards] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (!selectedDate) return;
        const loadTenders = async () => {
            setIsLoading(true);
            const formattedDate = selectedDate.toISOString().slice(0, 10);
            const data = await fetchTenders(formattedDate);
            const originalTenders = removeChangeNotices(data);
            setTenders(originalTenders);
            setFilteredTenders(isFiltered ? filterTendersByCpvCodes(originalTenders) : originalTenders);
            setTotalTenders(isFiltered ? filterTendersByCpvCodes(originalTenders).length : originalTenders.length);
            setIsLoading(false);
        };
        loadTenders();
    }, [selectedDate, isFiltered]);

    const handleAllTendersClick = () => setIsFiltered(false);
    const handleFilterClick = () => setIsFiltered(true);
    const handleOpenEmailAlert = () => setIsEmailAlertOpen(true);
    const handleCloseEmailAlert = () => setIsEmailAlertOpen(false);

    const getDisplayedCpvCodes = (tender: any): string[] => {
        const cpvCodes = isFiltered 
            ? tender.cpvCodes.filter((cpv: string) => isItRelatedCpv(cpv))
            : tender.cpvCodes;
        return Array.from(new Set(cpvCodes));
    };

    // Dodawanie przetargu do zakładek
    const handleTenderClick = (tender: any) => {
        if (!openTabs.find(tab => tab.publicationNumber === tender.publicationNumber)) {
            setOpenTabs(prev => [...prev, tender]);
        }
        setActiveTab(tender.publicationNumber);
    };

    // Zamknięcie zakładki przetargu
    const handleTabClose = (publicationNumber: string) => {
        setOpenTabs(prev => prev.filter(tab => tab.publicationNumber !== publicationNumber));
        if (activeTab === publicationNumber) {
            setActiveTab('list');
        }
    };

    // Zmiana aktywnej zakładki
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const displayedTenders = isFiltered ? filteredTenders : tenders;
    const activeTender = openTabs.find(tab => tab.publicationNumber === activeTab);

    return (
        <div>
            <Header 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
                totalTenders={totalTenders}
                onAllTendersClick={handleAllTendersClick}
                onFilterClick={handleFilterClick}
                isFiltered={isFiltered}
                onSetEmailAlert={handleOpenEmailAlert}
            />
            <EmailAlertDialog
                isOpen={isEmailAlertOpen}
                onClose={handleCloseEmailAlert}
                tenders={filteredTenders}
            />
            <TenderTabs
                tenders={openTabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onTabClose={handleTabClose}
            />
            <div className={styles.container}>
                {isLoading && (
                    <p className={styles.loading}>Ładowanie danych...</p>
                )}
                {activeTab === 'list' && (
                    <>
                        {displayedTenders.length === 0 && !isLoading && (
                            <p className={styles.message}>
                                {isFiltered 
                                    ? "Brak zamówień IT dla wybranej daty."
                                    : "Brak zamówień dla wybranej daty."
                                }
                            </p>
                        )}
                        <ul className={styles.tendersList}>
                            {displayedTenders.map((tender, index) => (
                                <li 
                                    key={index} 
                                    className={`${styles.tenderCard} ${isFavorite(tender.publicationNumber) ? styles.tenderCardFavorite : ''}`}
                                    onClick={() => handleTenderClick(tender)}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.publicationNumber}>
                                            Numer publikacji: {tender.publicationNumber}
                                        </div>
                                        <div className={styles.cardActions}>
                                            {isFiltered && (
                                                <button
                                                    className={`${styles.selectButton} ${isTenderSelected(tender.publicationNumber) ? styles.selectActive : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTenderSelection(tender.publicationNumber);
                                                    }}
                                                    aria-label={isTenderSelected(tender.publicationNumber) ? "Deselect tender" : "Select tender"}
                                                >
                                                    {isTenderSelected(tender.publicationNumber) ? '✉️' : '📩'}
                                                </button>
                                            )}
                                            <button
                                                className={`${styles.favoriteButton} ${isFavorite(tender.publicationNumber) ? styles.favoriteActive : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    isFavorite(tender.publicationNumber) 
                                                        ? removeFromFavorites(tender.publicationNumber)
                                                        : addToFavorites(tender);
                                                }}
                                                aria-label={isFavorite(tender.publicationNumber) ? "Remove from favorites" : "Add to favorites"}
                                            >
                                                {isFavorite(tender.publicationNumber) ? '★' : '☆'}
                                            </button>
                                        </div>
                                    </div>
                                    <h2 className={styles.title}>{tender.title}</h2>
                                    <div className={styles.info}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Data publikacji</span>
                                            <span className={styles.infoValue}>{tender.publicationDate}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Termin składania</span>
                                            <span className={styles.infoValue}>{tender.deadlineDate}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Miasto</span>
                                            <span className={styles.infoValue}>{tender.buyerCity}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Zamawiający</span>
                                            <span className={styles.infoValue}>{tender.buyerName}</span>
                                        </div>
                                    </div>
                                    <div className={styles.cpvSection}>
                                        {getDisplayedCpvCodes(tender).length > 0 && (
                                            <div className={styles.cpvContainer}>
                                                <button 
                                                    className={styles.cpvToggle}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedCpvCards(prev => ({
                                                            ...prev,
                                                            [tender.publicationNumber]: !prev[tender.publicationNumber]
                                                        }));
                                                    }}
                                                >
                                                    Kody CPV ({getDisplayedCpvCodes(tender).length})
                                                    {expandedCpvCards[tender.publicationNumber] ? ' ▼' : ' ▶'}
                                                </button>
                                                {expandedCpvCards[tender.publicationNumber] && (
                                                    <div className={styles.cpvCodes}>
                                                        {getDisplayedCpvCodes(tender).map((cpv: string, cpvIndex: number) => (
                                                            <div key={cpvIndex} className={styles.cpvCodeContainer}>
                                                                <span className={styles.cpvCode}>
                                                                    {cpv}
                                                                </span>
                                                                <span className={styles.cpvName}>
                                                                    {getCpvName(cpv)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <a 
                                        href={tender.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Zobacz ogłoszenie
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {activeTab !== 'list' && activeTender && (
                    <div className={styles.tenderDetails}>
                        <div className={styles.cardHeader}>
                            <div className={styles.publicationNumber}>
                                Numer publikacji: {activeTender.publicationNumber}
                            </div>
                            <div className={styles.cardActions}>
                                {isFiltered && (
                                    <button
                                        className={`${styles.selectButton} ${isTenderSelected(activeTender.publicationNumber) ? styles.selectActive : ''}`}
                                        onClick={() => toggleTenderSelection(activeTender.publicationNumber)}
                                        aria-label={isTenderSelected(activeTender.publicationNumber) ? "Deselect tender" : "Select tender"}
                                    >
                                        {isTenderSelected(activeTender.publicationNumber) ? '✉️' : '📩'}
                                    </button>
                                )}
                                <button
                                    className={`${styles.favoriteButton} ${isFavorite(activeTender.publicationNumber) ? styles.favoriteActive : ''}`}
                                    onClick={() => isFavorite(activeTender.publicationNumber) 
                                        ? removeFromFavorites(activeTender.publicationNumber)
                                        : addToFavorites(activeTender)
                                    }
                                    aria-label={isFavorite(activeTender.publicationNumber) ? "Remove from favorites" : "Add to favorites"}
                                >
                                    {isFavorite(activeTender.publicationNumber) ? '★' : '☆'}
                                </button>
                            </div>
                        </div>
                        <h2 className={styles.title}>{activeTender.title}</h2>
                        <div className={styles.info}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Data publikacji</span>
                                <span className={styles.infoValue}>{activeTender.publicationDate}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Termin składania</span>
                                <span className={styles.infoValue}>{activeTender.deadlineDate}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Miasto</span>
                                <span className={styles.infoValue}>{activeTender.buyerCity}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Zamawiający</span>
                                <span className={styles.infoValue}>{activeTender.buyerName}</span>
                            </div>
                        </div>
                        <div className={styles.cpvSection}>
                            {getDisplayedCpvCodes(activeTender).length > 0 && (
                                <div className={styles.cpvContainer}>
                                    <button 
                                        className={styles.cpvToggle}
                                        onClick={() => setExpandedCpvCards(prev => ({
                                            ...prev,
                                            [activeTender.publicationNumber]: !prev[activeTender.publicationNumber]
                                        }))}
                                    >
                                        Kody CPV ({getDisplayedCpvCodes(activeTender).length})
                                        {expandedCpvCards[activeTender.publicationNumber] ? ' ▼' : ' ▶'}
                                    </button>
                                    {expandedCpvCards[activeTender.publicationNumber] && (
                                        <div className={styles.cpvCodes}>
                                            {getDisplayedCpvCodes(activeTender).map((cpv: string, cpvIndex: number) => (
                                                <div key={cpvIndex} className={styles.cpvCodeContainer}>
                                                    <span className={styles.cpvCode}>
                                                        {cpv}
                                                    </span>
                                                    <span className={styles.cpvName}>
                                                        {getCpvName(cpv)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <a 
                            href={activeTender.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            Zobacz ogłoszenie
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tenders;