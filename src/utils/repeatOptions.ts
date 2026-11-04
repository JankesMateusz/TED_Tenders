/** Od tylu ogłoszeń zamawiający (albo miasto) uznawany jest za powtarzającego się. */
export const MIN_REPEAT_COUNT = 2;

export interface CountedOption {
    name: string;
    count: number;
}

/**
 * Dzieli opcje listy na te, które domyślnie widać (powtarzające się oraz wybrane), i resztę (jedno ogłoszenie).
 * Gdy nikt się nie powtarza, nie ma czego chować: wszystkie opcje zostają widoczne, żeby lista nie była pusta.
 */
export const splitRepeatOptions = <T extends CountedOption>(
    options: T[],
    isSelected: (name: string) => boolean
): { repeating: T[]; others: T[] } => {
    if (!options.some((option) => option.count >= MIN_REPEAT_COUNT)) {
        return { repeating: options, others: [] };
    }
    const keep = (option: T) => option.count >= MIN_REPEAT_COUNT || isSelected(option.name);
    return {
        repeating: options.filter(keep),
        others: options.filter((option) => !keep(option))
    };
};
