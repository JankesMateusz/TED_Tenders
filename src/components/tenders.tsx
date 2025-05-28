import React, { useEffect, useState } from "react";
import { fetchTenders } from "../utils/fetchTenders";
import { filterTendersByCpvCodes, isItRelatedCpv, removeChangeNotices } from "../utils/cpvFilter";
import { getCpvName } from "../utils/cpvMapping";
import { useUserPreferences } from "../context/UserPreferencesContext";
import Header from "./header";
import EmailAlertDialog from "./EmailAlertDialog";
import styles from "./Tenders.module.css";

const Tenders: React.FC = () => {
    const [tenders, setTenders] = useState<any[]>([]);
    const [filteredTenders, setFilteredTenders] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [totalTenders, setTotalTenders] = useState<number>(0);
    const [isEmailAlertOpen, setIsEmailAlertOpen] = useState(false);
    const { 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite,
        toggleTenderSelection,
        isTenderSelected
    } = useUserPreferences();

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

    const handleAllTendersClick = () => {
        setIsFiltered(false);
    };

    const handleFilterClick = () => {
        setIsFiltered(true);
    };

    const handleOpenEmailAlert = () => {
        setIsEmailAlertOpen(true);
    };

    const handleCloseEmailAlert = () => {
        setIsEmailAlertOpen(false);
    };

    const [expandedCpvCards, setExpandedCpvCards] = useState<{[key: string]: boolean}>({});

    const toggleCpvExpand = (publicationNumber: string) => {
        setExpandedCpvCards(prev => ({
            ...prev,
            [publicationNumber]: !prev[publicationNumber]
        }));
    };

    const displayedTenders = isFiltered ? filteredTenders : tenders;

    const getDisplayedCpvCodes = (tender: any): string[] => {
        const cpvCodes = isFiltered 
            ? tender.cpvCodes.filter((cpv: string) => isItRelatedCpv(cpv))
            : tender.cpvCodes;
        
        // Remove duplicates
        return Array.from(new Set(cpvCodes));
    };

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
            <div className={styles.container}>
                {isLoading && (
                    <p className={styles.loading}>Ładowanie danych...</p>
                )}

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
                        <li key={index} className={`${styles.tenderCard} ${isFavorite(tender.publicationNumber) ? styles.tenderCardFavorite : ''}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.publicationNumber}>
                                    Numer publikacji: {tender.publicationNumber}
                                </div>
                                <div className={styles.cardActions}>
                                    {isFiltered && (
                                        <button
                                            className={`${styles.selectButton} ${isTenderSelected(tender.publicationNumber) ? styles.selectActive : ''}`}
                                            onClick={() => toggleTenderSelection(tender.publicationNumber)}
                                            aria-label={isTenderSelected(tender.publicationNumber) ? "Deselect tender" : "Select tender"}
                                        >
                                            {isTenderSelected(tender.publicationNumber) ? '✉️' : '📩'}
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.favoriteButton} ${isFavorite(tender.publicationNumber) ? styles.favoriteActive : ''}`}
                                        onClick={() => isFavorite(tender.publicationNumber) 
                                            ? removeFromFavorites(tender.publicationNumber)
                                            : addToFavorites(tender)
                                        }
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
                                            onClick={() => toggleCpvExpand(tender.publicationNumber)}
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
                            >
                                Zobacz ogłoszenie
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tenders;