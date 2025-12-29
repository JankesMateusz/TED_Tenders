import React, { useMemo, useState } from "react";
import styles from "./BuyersSidebar.module.css";
import { normalizeName } from "../utils/stringUtils";
import { Tender } from "../types/Tender";
import { MESSAGES } from "../constants";

type ViewType = "buyers" | "cities";

interface BuyersSidebarProps {
    displayedTenders: Tender[];
    selectedBuyer: string | null;
    selectedCity: string | null;
    onBuyerSelect: (buyerName: string | null) => void;
    onCitySelect: (cityName: string | null) => void;
}

const BuyersSidebar: React.FC<BuyersSidebarProps> = ({
    displayedTenders,
    selectedBuyer,
    selectedCity,
    onBuyerSelect,
    onCitySelect
}) => {
    const [activeView, setActiveView] = useState<ViewType>("buyers");

    // Lista unikalnych zamawiających z widocznych przetargów
    const buyersList = useMemo(() => {
        const buyersMap = new Map<string, { name: string; count: number }>();
        
        displayedTenders.forEach(tender => {
            const buyerName = tender.buyerName;
            if (buyerName && buyerName !== "Brak danych") {
                const normalizedName = normalizeName(buyerName);
                const existing = buyersMap.get(normalizedName);
                
                if (existing) {
                    // Zwiększ licznik i zachowaj najdłuższą wersję nazwy (zazwyczaj najbardziej kompletna)
                    buyersMap.set(normalizedName, {
                        name: buyerName.length > existing.name.length ? buyerName : existing.name,
                        count: existing.count + 1
                    });
                } else {
                    buyersMap.set(normalizedName, {
                        name: buyerName,
                        count: 1
                    });
                }
            }
        });
        
        // Sortowanie alfabetycznie
        return Array.from(buyersMap.values())
            .sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    }, [displayedTenders]);

    // Lista unikalnych miast z widocznych przetargów
    const citiesList = useMemo(() => {
        const citiesMap = new Map<string, { name: string; count: number }>();
        
        displayedTenders.forEach(tender => {
            const cityName = tender.buyerCity;
            if (cityName && cityName !== "Brak miasta") {
                const normalizedName = normalizeName(cityName);
                const existing = citiesMap.get(normalizedName);
                
                if (existing) {
                    citiesMap.set(normalizedName, {
                        name: cityName.length > existing.name.length ? cityName : existing.name,
                        count: existing.count + 1
                    });
                } else {
                    citiesMap.set(normalizedName, {
                        name: cityName,
                        count: 1
                    });
                }
            }
        });
        
        // Sortowanie alfabetycznie
        return Array.from(citiesMap.values())
            .sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    }, [displayedTenders]);

    const handleBuyerClick = (buyerName: string) => {
        // Normalizujemy również przy porównywaniu z selectedBuyer
        const normalizedSelected = selectedBuyer ? normalizeName(selectedBuyer) : null;
        const normalizedClicked = normalizeName(buyerName);
        
        onBuyerSelect(normalizedSelected === normalizedClicked ? null : buyerName);
    };

    const handleCityClick = (cityName: string) => {
        const normalizedSelected = selectedCity ? normalizeName(selectedCity) : null;
        const normalizedClicked = normalizeName(cityName);
        
        onCitySelect(normalizedSelected === normalizedClicked ? null : cityName);
    };

    const handleClearFilter = () => {
        if (activeView === "buyers") {
            onBuyerSelect(null);
        } else {
            onCitySelect(null);
        }
    };

    const currentSelected = activeView === "buyers" ? selectedBuyer : selectedCity;
    const currentList = activeView === "buyers" ? buyersList : citiesList;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.headerRow}>
                <h3 
                    className={`${styles.headerButton} ${activeView === "buyers" ? styles.headerButtonActive : ''}`}
                    onClick={() => setActiveView("buyers")}
                >
                    Zamawiający ({buyersList.length})
                </h3>
                <h3 
                    className={`${styles.headerButton} ${activeView === "cities" ? styles.headerButtonActive : ''}`}
                    onClick={() => setActiveView("cities")}
                >
                    Miasta ({citiesList.length})
                </h3>
                {currentSelected && (
                    <button 
                        className={styles.clearFilterButton}
                        onClick={handleClearFilter}
                        title="Wyczyść filtr"
                    >
                        ✕
                    </button>
                )}
            </div>
            {currentList.length > 0 ? (
                <ul className={styles.buyersList}>
                    {currentList.map((item) => {
                        const normalizedName = normalizeName(item.name);
                        const normalizedSelected = currentSelected ? normalizeName(currentSelected) : null;
                        const isSelected = normalizedSelected === normalizedName;
                        
                        return (
                            <li 
                                key={item.name} 
                                className={`${styles.buyerItem} ${isSelected ? styles.buyerItemSelected : ''}`}
                                onClick={() => activeView === "buyers" ? handleBuyerClick(item.name) : handleCityClick(item.name)}
                            >
                                <span className={styles.buyerName}>{item.name}</span>
                                <span className={styles.buyerCount}>{item.count}</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles.noBuyers}>
                    {activeView === "buyers" ? MESSAGES.NO_BUYERS : MESSAGES.NO_CITIES}
                </p>
            )}
        </aside>
    );
};

export default BuyersSidebar;
