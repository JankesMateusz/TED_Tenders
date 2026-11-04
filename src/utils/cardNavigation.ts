export type NavigationAction = 'next' | 'prev';

/**
 * Id ogłoszenia, na które przechodzi aktywna karta po J (następne) lub K (poprzednie).
 * Bez aktywnej karty (albo gdy zniknęła z listy) trafia na pierwszą; na końcu listy zostaje na miejscu.
 */
export const nextActiveId = (
    ids: string[],
    currentId: string | null,
    action: NavigationAction
): string | null => {
    if (ids.length === 0) return null;
    const index = currentId === null ? -1 : ids.indexOf(currentId);
    if (index === -1) return ids[0];
    const target = action === 'next' ? index + 1 : index - 1;
    return ids[Math.min(Math.max(target, 0), ids.length - 1)];
};

/**
 * Która karta ma zostać aktywna, gdy aktywna zniknęła z listy (np. po ocenie w kolejce "Nieoznaczone"):
 * następna z dawnej listy albo, gdy była ostatnia, poprzednia. `ids` to lista sprzed zniknięcia.
 * Zwraca null, gdy `removedId` nie było na liście lub nie ma żadnej innej karty.
 */
export const afterRemoval = (ids: string[], removedId: string): string | null => {
    const index = ids.indexOf(removedId);
    if (index === -1) return null;
    return ids[index + 1] ?? ids[index - 1] ?? null;
};
