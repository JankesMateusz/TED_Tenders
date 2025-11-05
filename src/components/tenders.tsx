import React, { useEffect, useState, useMemo } from "react";
import { fetchTenders } from "../utils/fetchTenders";
import { fetchEzamowienia } from "../utils/fetchEzamowienia";
import { filterTendersByCpvCodes, isItRelatedCpv, removeChangeNotices } from "../utils/cpvFilter";
import { getCpvName } from "../utils/cpvMapping";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { getSourceConfig, getOrderTypeConfig, OrderType } from "../utils/tenderSources";
import { TenderSource } from "../types/TenderSource";
import Header from "./header";
import styles from "./Tenders.module.css";

const Tenders: React.FC = () => {
    const [tenders, setTenders] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [tendersCountBySource, setTendersCountBySource] = useState<Record<TenderSource, number>>({
        [TenderSource.TED]: 0,
        [TenderSource.E_ZAMOWIENIA]: 0,
        [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
    });
    const [selectedSources, setSelectedSources] = useState<TenderSource[]>([
        TenderSource.TED,
        TenderSource.E_ZAMOWIENIA,
        TenderSource.BAZA_KONKURENCYJNOSCI
    ]);
    const [selectedOrderTypes, setSelectedOrderTypes] = useState<OrderType[]>([
        "Delivery",
        "Services",
        "Works"
    ]);
    const { 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite,
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
            
            // Pobieranie równolegle z TED i eZamówienia
            const results = await Promise.allSettled([
                fetchTenders(formattedDate),
                fetchEzamowienia(formattedDate)
            ]);
            
            let allTenders: any[] = [];
            
            // Przetwarzanie wyników z TED
            if (results[0].status === 'fulfilled') {
                allTenders = [...allTenders, ...results[0].value];
            } else {
                console.error("Błąd pobierania przetargów z TED:", results[0].reason);
            }
            
            // Przetwarzanie wyników z eZamówienia
            if (results[1].status === 'fulfilled') {
                allTenders = [...allTenders, ...results[1].value];
            } else {
                console.error("Błąd pobierania przetargów z eZamówienia:", results[1].reason);
            }
            
            const originalTenders = removeChangeNotices(allTenders);
            setTenders(originalTenders);
            setIsLoading(false);
        };
        loadTenders();
    }, [selectedDate]);

    const handleAllTendersClick = () => setIsFiltered(false);
    const handleFilterClick = () => setIsFiltered(true);

    const handleSourceToggle = (source: TenderSource) => {
        setSelectedSources(prev => 
            prev.includes(source)
                ? prev.filter(s => s !== source)
                : [...prev, source]
        );
    };

    const handleOrderTypeToggle = (orderType: OrderType) => {
        setSelectedOrderTypes(prev => 
            prev.includes(orderType)
                ? prev.filter(t => t !== orderType)
                : [...prev, orderType]
        );
    };

    const parseDate = (dateStr: string): Date => {
        // Format: DD-MM-YYYY
        if (!dateStr || dateStr === "Brak daty" || dateStr === "Błąd formatu daty") {
            return new Date(0); // Najstarsza możliwa data dla sortowania
        }
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const [day, month, year] = parts.map(Number);
                const date = new Date(year, month - 1, day);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        } catch (error) {
            console.warn('Error parsing date:', dateStr, error);
        }
        return new Date(0);
    };

    const getDisplayedCpvCodes = (tender: any): string[] => {
        const cpvCodes = isFiltered 
            ? tender.cpvCodes.filter((cpv: string) => isItRelatedCpv(cpv))
            : tender.cpvCodes;
        return Array.from(new Set(cpvCodes));
    };

    const displayedTenders = useMemo(() => {
        let result = [...tenders];
        
        // Filtrowanie po źródle
        result = result.filter(tender => selectedSources.includes(tender.source));
        
        // Filtrowanie po typie zamówienia (tylko dla eZamówienia)
        result = result.filter(tender => {
            if (tender.source === TenderSource.E_ZAMOWIENIA && tender.orderType) {
                return selectedOrderTypes.includes(tender.orderType);
            }
            // Dla innych źródeł (TED, Baza Konkurencyjności) nie filtrujemy po typie zamówienia
            return true;
        });
        
        // Filtrowanie po CPV jeśli włączone
        if (isFiltered) {
            result = filterTendersByCpvCodes(result);
        }
        
        // Sortowanie po dacie publikacji (najnowsze na górze)
        result.sort((a, b) => {
            const dateA = parseDate(a.publicationDate);
            const dateB = parseDate(b.publicationDate);
            return dateB.getTime() - dateA.getTime();
        });
        
        return result;
    }, [tenders, selectedSources, selectedOrderTypes, isFiltered]);

    useEffect(() => {
        // Liczenie przetargów per źródło
        const counts: Record<TenderSource, number> = {
            [TenderSource.TED]: 0,
            [TenderSource.E_ZAMOWIENIA]: 0,
            [TenderSource.BAZA_KONKURENCYJNOSCI]: 0
        };
        
        displayedTenders.forEach(tender => {
            if (tender.source in counts) {
                counts[tender.source as TenderSource]++;
            }
        });
        
        setTendersCountBySource(counts);
    }, [displayedTenders]);

    return (
        <div className={styles.app}>
            <Header
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                tendersCountBySource={tendersCountBySource}
                onAllTendersClick={handleAllTendersClick}
                onFilterClick={handleFilterClick}
                isFiltered={isFiltered}
                selectedSources={selectedSources}
            />
            <div className={styles.container}>
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
                                        onChange={() => handleSourceToggle(source)}
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
                                        {config.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                    {selectedSources.includes(TenderSource.E_ZAMOWIENIA) && (
                        <div className={styles.sourceFilters}>
                            <span className={styles.sourceFiltersLabel}>Typy:</span>
                            {(["Delivery", "Services", "Works"] as OrderType[]).map((orderType) => {
                                const config = getOrderTypeConfig(orderType);
                                const isSelected = selectedOrderTypes.includes(orderType);
                                return (
                                    <label key={orderType} className={styles.sourceFilterLabel}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleOrderTypeToggle(orderType)}
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
                                            {config.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
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
                            <div className={styles.badgesContainer}>
                                <span className={styles.sourceBadge} style={{
                                    backgroundColor: getSourceConfig(tender.source).backgroundColor,
                                    color: getSourceConfig(tender.source).color
                                }}>
                                    {getSourceConfig(tender.source).label}
                                </span>
                                {tender.orderType && (
                                    <span className={styles.orderTypeBadge} style={{
                                        backgroundColor: getOrderTypeConfig(tender.orderType as OrderType).backgroundColor,
                                        color: getOrderTypeConfig(tender.orderType as OrderType).color
                                    }}>
                                        {getOrderTypeConfig(tender.orderType as OrderType).label}
                                    </span>
                                )}
                            </div>
                            <h2 className={styles.title}>
                                {tender.title}
                            </h2>
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