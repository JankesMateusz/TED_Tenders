import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Header.module.css";
import { useTheme } from "../context/ThemeContext";
import { TenderSource } from "../types/TenderSource";
import { tenderSourceConfig } from "../utils/tenderSources";

interface HeaderProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    tendersCountBySource: Record<TenderSource, number>;
    onAllTendersClick: () => void;
    onFilterClick: () => void;
    isFiltered: boolean;
    selectedSources: TenderSource[];
}

const Header: React.FC<HeaderProps> = ({ 
    selectedDate, 
    setSelectedDate, 
    tendersCountBySource,
    onAllTendersClick,
    onFilterClick,
    isFiltered,
    selectedSources
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Przetargi</h1>
            <div className={styles.tenderInfo}>
                <div className={styles.tenderCounts}>
                    {[TenderSource.TED, TenderSource.E_ZAMOWIENIA, TenderSource.BAZA_KONKURENCYJNOSCI].map((source) => {
                        const isSelected = selectedSources.includes(source);
                        
                        // Ukrywamy licznik jeśli źródło jest odfiltrowane
                        if (!isSelected) return null;
                        
                        const config = tenderSourceConfig[source];
                        const count = tendersCountBySource[source];
                        
                        return (
                            <span key={source} className={styles.tenderCountItem}>
                                <span className={styles.tenderCountLabel}>{config.label}:</span>
                                <span className={styles.tenderCountValue}>{count}</span>
                            </span>
                        );
                    })}
                    <span className={styles.filterStatus}>
                        ({isFiltered ? 'tylko IT' : 'wszystkie branże'})
                    </span>
                </div>
            </div>
            <div className={styles.controls}>
                <div className={styles.datePicker}>
                    <label className={styles.datePickerLabel}>Wybierz datę:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Wybierz datę"
                    />
                </div>
                <div className={styles.buttons}>
                    <button 
                        className={`${styles.button} ${!isFiltered ? styles.buttonActive : styles.buttonPrimary}`}
                        onClick={onAllTendersClick}
                    >
                        All tenders
                    </button>
                    <button 
                        className={`${styles.button} ${isFiltered ? styles.buttonActive : styles.buttonSecondary}`}
                        onClick={onFilterClick}
                    >
                        Filter
                    </button>
                    <button
                        className={`${styles.button} ${styles.themeToggle}`}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;