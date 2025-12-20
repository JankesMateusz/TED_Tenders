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
    // Lista unikalnych zamawiających z widocznych przetargów
    const buyersList = useMemo(() => {
        const buyersMap = new Map<string, number>();
        
        displayedTenders.forEach(tender => {
            const buyerName = tender.buyerName;
            if (buyerName && buyerName !== "Brak danych") {
                buyersMap.set(buyerName, (buyersMap.get(buyerName) || 0) + 1);
            }
        });
        
        // Sortowanie alfabetycznie
        return Array.from(buyersMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    }, [displayedTenders]);

    const handleBuyerClick = (buyerName: string) => {
        onBuyerSelect(selectedBuyer === buyerName ? null : buyerName);
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
                    {buyersList.map((buyer, index) => (
                        <li 
                            key={index} 
                            className={`${styles.buyerItem} ${selectedBuyer === buyer.name ? styles.buyerItemSelected : ''}`}
                            onClick={() => handleBuyerClick(buyer.name)}
                        >
                            <span className={styles.buyerName}>{buyer.name}</span>
                            <span className={styles.buyerCount}>{buyer.count}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noBuyers}>Brak zamawiających</p>
            )}
        </aside>
    );
};

export default BuyersSidebar;

