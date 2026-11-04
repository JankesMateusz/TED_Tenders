/**
 * Stałe używane w aplikacji
 */

export const DEFAULT_ORDER_TYPES: Array<"Delivery" | "Services" | "Works"> = [
    "Delivery",
    "Services",
    "Works"
];

export const PAGE_SIZE = {
    TED: 250,
    E_ZAMOWIENIA: 10
} as const;

export const SCROLL_THRESHOLD = 200;

export const DATE_FORMAT = "dd-MM-yyyy";

export const PLACEHOLDER_TEXTS = {
    SEARCH: "Szukaj w przetargach (tytuł, zamawiający, miasto, numer, CPV)...",
    DATE_PICKER: "Wybierz datę",
    DATE_FROM: "Od",
    DATE_TO: "Do"
} as const;

export const MESSAGES = {
    NO_TENDERS: "Brak zamówień dla wybranej daty.",
    NO_IT_TENDERS: "Brak zamówień IT dla wybranej daty.",
    LOADING: "Ładowanie danych...",
    NO_BUYERS: "Brak zamawiających",
    NO_CITIES: "Brak miast",
    QUEUE_EMPTY: "Kolejka jest pusta: wszystkie pasujące ogłoszenia są ocenione. Zmień filtr statusu, żeby je zobaczyć.",
    QUEUE_HINT: "Domyślnie widzisz kolejkę: ogłoszenia, których nikt jeszcze nie ocenił.",
    SAVED_HINT: "Gwiazdka jest prywatna, status jest wspólny dla zespołu."
} as const;

