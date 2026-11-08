export const ORDERS_HASH = '#/zamowienia';

/** Id zamówienia z hasha (`#/zamowienia/123`) albo null, gdy hash wskazuje listę lub jest niepoprawny. */
export const orderIdFromHash = (hash: string): number | null => {
    const match = /^#\/zamowienia\/(\d+)\/?$/.exec(hash);
    if (!match) return null;
    const id = Number(match[1]);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

export const orderHash = (id: number): string => `${ORDERS_HASH}/${id}`;

/** Zwraca adres tylko dla http(s). Adresy z danych (SIWZ itp.) są niezaufane: `javascript:` itp. nie mogą trafić do linku. */
export const safeHttpUrl = (value: string | null | undefined): string | null => {
    if (!value) return null;
    try {
        const url = new URL(value.trim());
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
    } catch {
        return null;
    }
};
