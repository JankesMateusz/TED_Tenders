/** Liczba na wykresie godzinowym: całkowita bez zmian, średnia z jednym miejscem po przecinku. */
export const formatCount = (value: number): string =>
    Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',');
