/**
 * Parsuje datę w formacie DD-MM-YYYY na obiekt Date
 */
export const parseDate = (dateStr: string): Date => {
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

/**
 * Zamienia lokalną datę na dzień RRRR-MM-DD. W odróżnieniu od `toISOString()` nie przesuwa dnia
 * przez strefę czasową (po polskiej północy UTC bywa jeszcze poprzednim dniem).
 */
export const toDayString = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
};

/** Przesuwa dzień RRRR-MM-DD o podaną liczbę dni kalendarzowych. */
export const addDays = (day: string, offset: number): string => {
    const [year, month, date] = day.split('-').map(Number);
    return toDayString(new Date(year, month - 1, date + offset));
};

/** Opis czasu ostatniego odświeżenia: "dziś 14:32", "wczoraj 14:32" lub "27.10 14:32". */
export const formatLastRefresh = (refreshedAt: Date, now: Date = new Date()): string => {
    const time = `${String(refreshedAt.getHours()).padStart(2, '0')}:${String(refreshedAt.getMinutes()).padStart(2, '0')}`;
    const refreshedDay = toDayString(refreshedAt);
    const today = toDayString(now);
    if (refreshedDay === today) return `dziś ${time}`;
    if (refreshedDay === addDays(today, -1)) return `wczoraj ${time}`;
    return `${String(refreshedAt.getDate()).padStart(2, '0')}.${String(refreshedAt.getMonth() + 1).padStart(2, '0')} ${time}`;
};
