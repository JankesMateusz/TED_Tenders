import React, { useMemo } from "react";
import styles from "./BuyersSidebar.module.css";

//removed Buyer interface

interface BuyersSidebarProps {
    displayedTenders: any[];
    selectedBuyer: string | null;
    onBuyerSelect: (buyerName: string | null) => void;
}

const BuyersSidebar: React.FC<BuyersSidebarProps> = ({
    displayedTenders,
    selectedBuyer,
    onBuyerSelect
}) => {
    // Funkcja normalizująca nazwę zamawiającego
    const normalizeBuyerName = (name: string): string => {
        return name.trim().toLowerCase().replace(/\s+/g, ' ');
    };

    // Lista unikalnych zamawiających z widocznych przetargów
    const buyersList = useMemo(() => {
        const buyersMap = new Map<string, { name: string; count: number }>();
        
        displayedTenders.forEach(tender => {
            const buyerName = tender.buyerName;
            if (buyerName && buyerName !== "Brak danych") {
                const normalizedName = normalizeBuyerName(buyerName);
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

    const handleBuyerClick = (buyerName: string) => {
        // Normalizujemy również przy porównywaniu z selectedBuyer
        const normalizedSelected = selectedBuyer ? normalizeBuyerName(selectedBuyer) : null;
        const normalizedClicked = normalizeBuyerName(buyerName);
        
        onBuyerSelect(normalizedSelected === normalizedClicked ? null : buyerName);
    };

    const handleClearFilter = () => {
        onBuyerSelect(null);
    };

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>
                Zamawiający ({buyersList.length})
                {selectedBuyer && (
                    <button 
                        className={styles.clearFilterButton}
                        onClick={handleClearFilter}
                        title="Wyczyść filtr"
                    >
                        ✕
                    </button>
                )}
            </h3>
            {buyersList.length > 0 ? (
                <ul className={styles.buyersList}>
                    {buyersList.map((buyer, index) => {
                        const normalizedBuyerName = normalizeBuyerName(buyer.name);
                        const normalizedSelected = selectedBuyer ? normalizeBuyerName(selectedBuyer) : null;
                        const isSelected = normalizedSelected === normalizedBuyerName;
                        
                        return (
                            <li 
                                key={index} 
                                className={`${styles.buyerItem} ${isSelected ? styles.buyerItemSelected : ''}`}
                                onClick={() => handleBuyerClick(buyer.name)}
                            >
                                <span className={styles.buyerName}>{buyer.name}</span>
                                <span className={styles.buyerCount}>{buyer.count}</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles.noBuyers}>Brak zamawiających</p>
            )}
        </aside>
    );
};

export default BuyersSidebar;

