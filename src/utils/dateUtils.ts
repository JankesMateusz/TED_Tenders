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
