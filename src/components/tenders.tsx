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
        isTenderSelected,
        toggleToBeEntered,
        toggleNotToBeEntered,
        isToBeEntered,
        isNotToBeEntered
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

    const displayedTenders = isFiltered ? filteredTenders : tenders;

    return (
        <div className={styles.app}>
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
                tenders={displayedTenders}
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
                        <li 
                            key={index} 
                            className={`${styles.tenderCard} 
                                ${isFavorite(tender.publicationNumber) ? styles.tenderCardFavorite : ''}
                                ${isToBeEntered(tender.publicationNumber) ? styles.tenderCardToBeEntered : ''}
                                ${isNotToBeEntered(tender.publicationNumber) ? styles.tenderCardNotToBeEntered : ''}
                            `}
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
                                            title={isTenderSelected(tender.publicationNumber) ? "Deselect tender" : "Select tender"}
                                        >
                                            {isTenderSelected(tender.publicationNumber) ? '✉️' : '📩'}
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.statusButton} ${isToBeEntered(tender.publicationNumber) ? styles.toBeEnteredActive : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleToBeEntered(tender.publicationNumber);
                                        }}
                                        aria-label={isToBeEntered(tender.publicationNumber) ? "Remove from to be entered" : "Mark as to be entered"}
                                        title={isToBeEntered(tender.publicationNumber) ? "Remove from to be entered" : "Mark as to be entered"}
                                    >
                                        {isToBeEntered(tender.publicationNumber) ? '✓' : '✓'}
                                    </button>
                                    <button
                                        className={`${styles.statusButton} ${isNotToBeEntered(tender.publicationNumber) ? styles.notToBeEnteredActive : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleNotToBeEntered(tender.publicationNumber);
                                        }}
                                        aria-label={isNotToBeEntered(tender.publicationNumber) ? "Remove from not to be entered" : "Mark as not to be entered"}
                                        title={isNotToBeEntered(tender.publicationNumber) ? "Remove from not to be entered" : "Mark as not to be entered"}
                                    >
                                        {isNotToBeEntered(tender.publicationNumber) ? '✕' : '✕'}
                                    </button>
                                    <button
                                        className={`${styles.favoriteButton} ${isFavorite(tender.publicationNumber) ? styles.favoriteActive : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            isFavorite(tender.publicationNumber) 
                                                ? removeFromFavorites(tender.publicationNumber)
                                                : addToFavorites(tender);
                                        }}
                                        aria-label={isFavorite(tender.publicationNumber) ? "Remove from favorites" : "Add to favorites"}
                                        title={isFavorite(tender.publicationNumber) ? "Remove from favorites" : "Add to favorites"}
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