/** Forma słowa "ogłoszenie" dla danej liczby: 1 ogłoszenie, 2–4 ogłoszenia, 5+ i 12–14 ogłoszeń. */
export const pluralizeTenders = (count: number): string => {
    const lastTwo = count % 100;
    const last = count % 10;
    if (count === 1) return 'ogłoszenie';
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return 'ogłoszenia';
    return 'ogłoszeń';
};
