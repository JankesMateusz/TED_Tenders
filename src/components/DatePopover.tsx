import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { DATE_FORMAT, PLACEHOLDER_TEXTS } from '../constants';
import styles from './Header.module.css';

// Polskie nazwy miesięcy i dni w kalendarzu, tydzień zaczyna się od poniedziałku
registerLocale('pl', pl);

type ActiveField = 'start' | 'end';

interface DatePopoverProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    useDateRange: boolean;
    setUseDateRange: (value: boolean) => void;
}

const formatDate = (date: Date | null, empty: string): string => (date ? format(date, DATE_FORMAT) : empty);

const CalendarIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
);

/**
 * Wybór daty albo zakresu dat w jednym przycisku. Klik rozwija panel w dół: przełącznik "Zakres dat", przy zakresie
 * dwa pola jedno pod drugim ("Od" u góry, "Do" pod nim) i jeden kalendarz pod aktywnym polem.
 * Wybór daty w trybie zakresu przechodzi od "Od" do "Do", a wybór ostatniej daty zamyka panel.
 */
const DatePopover: React.FC<DatePopoverProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    useDateRange,
    setUseDateRange
}) => {
    const [open, setOpen] = useState(false);
    const [activeField, setActiveField] = useState<ActiveField>('start');
    const [shiftX, setShiftX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const panelId = useId();
    const shiftRef = useRef(0);

    // Panel nie może wyjść poza ekran (na wąskim ekranie przycisk jest daleko od lewej krawędzi): przesuwamy go w poziomie
    useLayoutEffect(() => {
        if (!open) {
            shiftRef.current = 0;
            setShiftX(0);
            return;
        }
        const rect = panelRef.current?.getBoundingClientRect();
        if (!rect) return;
        // Położenie bez bieżącego przesunięcia: pomiar uwzględnia już poprzednie translateX
        const left = rect.left - shiftRef.current;
        const right = rect.right - shiftRef.current;
        const margin = 8;
        let shift = Math.min(0, window.innerWidth - margin - right);
        if (left + shift < margin) shift = margin - left;
        shiftRef.current = shift;
        setShiftX(shift);
    }, [open, useDateRange]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        const handleClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [open]);

    const toggleOpen = () => {
        setActiveField('start');
        setOpen((prev) => !prev);
    };

    const handleToggleRange = (value: boolean) => {
        setActiveField('start');
        setUseDateRange(value);
    };

    const handleCalendarChange = (date: Date | null) => {
        if (!useDateRange || activeField === 'start') {
            setStartDate(date);
            if (!useDateRange) {
                setOpen(false);
            } else if (date) {
                setActiveField('end');
            }
            return;
        }
        setEndDate(date);
        if (date) setOpen(false);
    };

    const isEndActive = useDateRange && activeField === 'end';
    const triggerLabel = useDateRange
        ? `${formatDate(startDate, 'od…')} – ${formatDate(endDate, 'do…')}`
        : formatDate(startDate, PLACEHOLDER_TEXTS.DATE_PICKER);

    return (
        <div ref={containerRef} className={styles.datePopover}>
            <button
                ref={triggerRef}
                type="button"
                className={`${styles.button} ${styles.dateTrigger} ${open ? styles.dateTriggerOpen : ''}`}
                onClick={toggleOpen}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                aria-label={`${useDateRange ? 'Zakres dat' : 'Data'}: ${triggerLabel}`}
            >
                <CalendarIcon />
                <span>{triggerLabel}</span>
                <span aria-hidden="true">▾</span>
            </button>

            {open && (
                <div
                    ref={panelRef}
                    id={panelId}
                    className={styles.datePanel}
                    style={shiftX !== 0 ? { transform: `translateX(${shiftX}px)` } : undefined}
                    role="group"
                    aria-label="Wybór dat"
                >
                    <label className={styles.dateRangeCheckbox}>
                        <input
                            type="checkbox"
                            checked={useDateRange}
                            onChange={(e) => handleToggleRange(e.target.checked)}
                            className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxLabel}>Zakres dat</span>
                    </label>

                    {useDateRange && (
                        <div className={styles.dateFields}>
                            {(['start', 'end'] as const).map((field) => (
                                <button
                                    key={field}
                                    type="button"
                                    className={`${styles.dateField} ${activeField === field ? styles.dateFieldActive : ''}`}
                                    onClick={() => setActiveField(field)}
                                    aria-pressed={activeField === field}
                                >
                                    <span className={styles.dateFieldLabel}>{field === 'start' ? 'Od' : 'Do'}</span>
                                    <span>{formatDate(field === 'start' ? startDate : endDate, 'wybierz datę')}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <DatePicker
                        key={`${useDateRange}-${activeField}`}
                        inline
                        locale="pl"
                        selected={isEndActive ? endDate : startDate}
                        onChange={handleCalendarChange}
                        openToDate={(isEndActive ? endDate ?? startDate : startDate) ?? undefined}
                        selectsStart={useDateRange && activeField === 'start'}
                        selectsEnd={isEndActive}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={isEndActive ? startDate ?? undefined : undefined}
                    />
                </div>
            )}
        </div>
    );
};

export default DatePopover;
