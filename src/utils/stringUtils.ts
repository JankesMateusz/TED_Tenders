/**
 * Normalizuje nazwę poprzez usunięcie nadmiarowych spacji i konwersję na małe litery
 * @param name - Nazwa do normalizacji
 * @returns Znormalizowana nazwa
 */
export const normalizeName = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
};

