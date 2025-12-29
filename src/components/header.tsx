import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Header.module.css";
import { useTheme } from "../context/ThemeContext";
import { TenderSource } from "../types/TenderSource";
import { tenderSourceConfig } from "../utils/tenderSources";
import { DATE_FORMAT, PLACEHOLDER_TEXTS } from "../constants";

interface HeaderProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    useDateRange: boolean;
    setUseDateRange: (value: boolean) => void;
    tendersCountBySource: Record<TenderSource, number>;
    onAllTendersClick: () => void;
    onFilterClick: () => void;
    isFiltered: boolean;
    selectedSources: TenderSource[];
}

const Header: React.FC<HeaderProps> = ({ 
    startDate, 
    endDate,
    setStartDate,
    setEndDate,
    useDateRange,
    setUseDateRange,
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
                    <label className={styles.datePickerLabel}>
                        {useDateRange ? "Zakres dat:" : "Data:"}
                    </label>
                    {useDateRange ? (
                        <div className={styles.dateRangeContainer}>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat={DATE_FORMAT}
                                placeholderText={PLACEHOLDER_TEXTS.DATE_FROM}
                                className={styles.dateInput}
                            />
                            <span className={styles.dateSeparator}>-</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate || undefined}
                                dateFormat={DATE_FORMAT}
                                placeholderText={PLACEHOLDER_TEXTS.DATE_TO}
                                className={styles.dateInput}
                            />
                        </div>
                    ) : (
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat={DATE_FORMAT}
                            placeholderText={PLACEHOLDER_TEXTS.DATE_PICKER}
                            className={styles.dateInput}
                        />
                    )}
                    <label className={styles.dateRangeCheckbox}>
                        <input
                            type="checkbox"
                            checked={useDateRange}
                            onChange={(e) => setUseDateRange(e.target.checked)}
                            className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxLabel}>Zakres dat</span>
                    </label>
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