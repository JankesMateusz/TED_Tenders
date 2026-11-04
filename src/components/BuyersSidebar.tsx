import React, { useId, useMemo, useState, useRef } from "react";
import styles from "./BuyersSidebar.module.css";
import { normalizeName } from "../utils/stringUtils";
import { Tender } from "../types/Tender";
import { MESSAGES } from "../constants";
import { MIN_REPEAT_COUNT, splitRepeatOptions } from "../utils/repeatOptions";
import TabBar, { panelId } from "./TabBar";

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
 * Unikalne nazwy z przetargów z licznikami, od najliczniejszych (przy równej liczbie alfabetycznie). Nazwy porównujemy po normalizacji, a pokazujemy
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

    return Array.from(options.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pl'));
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
    // Domyślnie lista pokazuje tylko tych, którzy się powtarzają; reszta jest pod przyciskiem
    const [showAll, setShowAll] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    // Na wąskim ekranie panel jest zwinięty pod przyciskiem (na szerokim ten stan nic nie zmienia)
    const [isOpenOnNarrow, setIsOpenOnNarrow] = useState<boolean>(false);
    const sidebarId = useId();

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

    const list = activeView === "buyers" ? buyersList : citiesList;
    const hasQuery = searchQuery.trim() !== "";
    const { repeating, others } = useMemo(
        () => splitRepeatOptions(list, name => {
            const key = normalizeName(name);
            return currentSelected.some(selected => normalizeName(selected) === key);
        }),
        [list, currentSelected]
    );

    // Podczas wyszukiwania szukamy we wszystkich pozycjach, także tych z jednym ogłoszeniem
    const filteredList = useMemo(() => {
        if (!hasQuery) return showAll ? list : repeating;
        const query = normalizeName(searchQuery);
        return list.filter(item => normalizeName(item.name).includes(query));
    }, [hasQuery, showAll, list, repeating, searchQuery]);

    const subject = activeView === "buyers" ? "zamawiających" : "miast";

    const selectedCount = selectedBuyers.length + selectedCities.length;

    return (
        <>
        <button
            type="button"
            className={`${styles.narrowToggle} ${isOpenOnNarrow ? styles.narrowToggleOpen : ''}`}
            onClick={() => setIsOpenOnNarrow(prev => !prev)}
            aria-expanded={isOpenOnNarrow}
            aria-controls={sidebarId}
        >
            <span>Zamawiający i miasta{selectedCount > 0 ? ` (${selectedCount})` : ''}</span>
            <span aria-hidden="true">▾</span>
        </button>
        <aside id={sidebarId} className={`${styles.sidebar} ${isOpenOnNarrow ? styles.sidebarOpen : ''}`}>
            <div className={styles.headerRow}>
                <TabBar
                    idPrefix="sidebar"
                    ariaLabel="Lista do filtrowania"
                    className={styles.headerTabs}
                    tabClassName={styles.headerButton}
                    activeTabClassName={styles.headerButtonActive}
                    activeId={activeView}
                    onChange={setActiveView}
                    tabs={[
                        { id: "buyers", label: `Zamawiający (${buyersList.length})` },
                        { id: "cities", label: `Miasta (${citiesList.length})` }
                    ]}
                />
                {currentSelected.length > 0 && (
                    <button
                        type="button"
                        className={styles.clearFilterButton}
                        onClick={handleClearFilter}
                        aria-label={`Wyczyść wybór (${currentSelected.length})`}
                        title={`Wyczyść wybór (${currentSelected.length})`}
                    >
                        ✕
                    </button>
                )}
            </div>
            <div
                className={styles.panel}
                role="tabpanel"
                id={panelId("sidebar")}
                aria-labelledby={`sidebar-tab-${activeView}`}
            >
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
                            <li key={item.name}>
                                <button
                                    type="button"
                                    className={`${styles.buyerItem} ${isSelected ? styles.buyerItemSelected : ''}`}
                                    aria-pressed={isSelected}
                                    onClick={() => handleItemClick(item.name)}
                                >
                                    <span className={styles.buyerName}>{item.name}</span>
                                    <span className={styles.buyerCount}>{item.count}</span>
                                </button>
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
            {!hasQuery && others.length > 0 && (
                <>
                    <button
                        type="button"
                        className={styles.moreButton}
                        onClick={() => setShowAll(prev => !prev)}
                    >
                        {showAll
                            ? "Pokaż tylko powtarzających się"
                            : `Pokaż pozostałych (${others.length}) z jednym ogłoszeniem`}
                    </button>
                    <p className={styles.repeatNote}>
                        Domyślnie widać {subject} z co najmniej {MIN_REPEAT_COUNT} ogłoszeniami: to oni wracają.
                    </p>
                </>
            )}
            </div>
        </aside>
        </>
    );
};

export default BuyersSidebar;
