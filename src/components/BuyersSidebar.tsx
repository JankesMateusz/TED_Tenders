import React, { useMemo, useState, useRef } from "react";
import styles from "./BuyersSidebar.module.css";
import { normalizeName } from "../utils/stringUtils";
import { Tender } from "../types/Tender";
import { MESSAGES } from "../constants";

type ViewType = "buyers" | "cities";

interface BuyersSidebarProps {
    /** Przetargi dla listy zamawiających: po wszystkich filtrach poza wyborem zamawiających. */
    buyerOptionTenders: Tender[];
    /** Przetargi dla listy miast: po wszystkich filtrach poza wyborem miast. */
    cityOptionTenders: Tender[];
    selectedBuyers: string[];
    selectedCities: string[];
    onBuyersChange: (buyers: string[]) => void;
    onCitiesChange: (cities: string[]) => void;
}

interface Option {
    name: string;
    count: number;
}

/**
 * Unikalne nazwy z przetargów z licznikami, alfabetycznie. Nazwy porównujemy po normalizacji, a pokazujemy
 * najdłuższy wariant (zwykle najpełniejszy). Wybrane pozycje bez przetargów zostają na liście z zerem,
 * żeby dało się je odznaczyć.
 */
const buildOptions = (
    tenders: Tender[],
    getName: (tender: Tender) => string | undefined,
    emptyValue: string,
    selected: string[]
): Option[] => {
    const options = new Map<string, Option>();

    tenders.forEach(tender => {
        const name = getName(tender);
        if (!name || name === emptyValue) return;
        const key = normalizeName(name);
        const existing = options.get(key);
        options.set(key, {
            name: existing && existing.name.length >= name.length ? existing.name : name,
            count: (existing?.count ?? 0) + 1
        });
    });

    selected.forEach(name => {
        const key = normalizeName(name);
        if (!options.has(key)) options.set(key, { name, count: 0 });
    });

    return Array.from(options.values()).sort((a, b) => a.name.localeCompare(b.name, 'pl'));
};

const BuyersSidebar: React.FC<BuyersSidebarProps> = ({
    buyerOptionTenders,
    cityOptionTenders,
    selectedBuyers,
    selectedCities,
    onBuyersChange,
    onCitiesChange
}) => {
    const [activeView, setActiveView] = useState<ViewType>("buyers");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const buyersList = useMemo(
        () => buildOptions(buyerOptionTenders, tender => tender.buyerName, "Brak danych", selectedBuyers),
        [buyerOptionTenders, selectedBuyers]
    );
    const citiesList = useMemo(
        () => buildOptions(cityOptionTenders, tender => tender.buyerCity, "Brak miasta", selectedCities),
        [cityOptionTenders, selectedCities]
    );

    const currentSelected = activeView === "buyers" ? selectedBuyers : selectedCities;

    // Kliknięcie dodaje pozycję do wyboru albo ją usuwa
    const handleItemClick = (name: string) => {
        const key = normalizeName(name);
        const isSelected = currentSelected.some(item => normalizeName(item) === key);
        const next = isSelected
            ? currentSelected.filter(item => normalizeName(item) !== key)
            : [...currentSelected, name];
        if (activeView === "buyers") {
            onBuyersChange(next);
        } else {
            onCitiesChange(next);
        }
    };

    const handleClearFilter = () => {
        if (activeView === "buyers") {
            onBuyersChange([]);
        } else {
            onCitiesChange([]);
        }
    };

    // Filtrowana lista na podstawie wyszukiwania
    const filteredList = useMemo(() => {
        const list = activeView === "buyers" ? buyersList : citiesList;
        if (!searchQuery.trim()) {
            return list;
        }
        
        const query = normalizeName(searchQuery);
        return list.filter(item => 
            normalizeName(item.name).includes(query)
        );
    }, [activeView, buyersList, citiesList, searchQuery]);

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
                {currentSelected.length > 0 && (
                    <button 
                        className={styles.clearFilterButton}
                        onClick={handleClearFilter}
                        title={`Wyczyść wybór (${currentSelected.length})`}
                    >
                        ✕
                    </button>
                )}
            </div>
            <div className={styles.searchContainer}>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={activeView === "buyers" ? "Szukaj zamawiającego..." : "Szukaj miasta..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            {filteredList.length > 0 ? (
                <ul className={styles.buyersList}>
                    {filteredList.map((item) => {
                        const normalizedName = normalizeName(item.name);
                        const isSelected = currentSelected.some(selected => normalizeName(selected) === normalizedName);
                        
                        return (
                            <li 
                                key={item.name} 
                                className={`${styles.buyerItem} ${isSelected ? styles.buyerItemSelected : ''}`}
                                onClick={() => handleItemClick(item.name)}
                            >
                                <span className={styles.buyerName}>{item.name}</span>
                                <span className={styles.buyerCount}>{item.count}</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles.noBuyers}>
                    {searchQuery.trim() 
                        ? `Brak wyników dla "${searchQuery}"`
                        : (activeView === "buyers" ? MESSAGES.NO_BUYERS : MESSAGES.NO_CITIES)
                    }
                </p>
            )}
        </aside>
    );
};

export default BuyersSidebar;
