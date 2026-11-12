/** Zwraca kopię listy bez `item`, jeśli już na niej jest, a w przeciwnym razie z `item` dopisanym na końcu. */
export const toggleInArray = <T,>(list: readonly T[], item: T): T[] =>
    list.includes(item) ? list.filter((existing) => existing !== item) : [...list, item];
