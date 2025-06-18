import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Header.module.css";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    totalTenders: number;
    onAllTendersClick: () => void;
    onFilterClick: () => void;
    isFiltered: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
    selectedDate, 
    setSelectedDate, 
    totalTenders,
    onAllTendersClick,
    onFilterClick,
    isFiltered
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Zamówienia TED</h1>
            <div className={styles.tenderInfo}>
                <span className={styles.tenderCount}>
                    Liczba przetargów: {totalTenders}
                </span>
                <span className={styles.filterStatus}>
                    ({isFiltered ? 'tylko IT' : 'wszystkie branże'})
                </span>
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