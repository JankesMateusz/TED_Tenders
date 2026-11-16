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
    SEARCH: "Szukaj: laptop, serwer, CPV…",
    DATE_PICKER: "Wybierz datę",
    DATE_FROM: "Od",
    DATE_TO: "Do"
} as const;

export const MESSAGES = {
    LOADING: "Ładowanie danych...",
    NO_BUYERS: "Brak zamawiających",
    NO_CITIES: "Brak miast",
    // Puste stany listy: osobny komunikat dla każdej przyczyny (patrz utils/emptyState.ts)
    EMPTY_NO_DATA: "Brak ogłoszeń dla wybranej daty.",
    EMPTY_QUEUE: "Kolejka jest pusta: wszystkie pasujące ogłoszenia mają już status.",
    EMPTY_FILTERED: "Żadne ogłoszenie nie pasuje do wybranych filtrów ani frazy.",
    EMPTY_NO_IT: "W wybranym okresie nie ma ogłoszeń z kodami CPV z branży IT.",
    EMPTY_OTHER: "Brak ogłoszeń do pokazania. Ogłoszenia z gwiazdką są w zakładce „Zapisane”, a ukryci zamawiający są pominięci.",
    QUEUE_CHIP: "Tylko nieocenione",
    QUEUE_CHIP_TITLE: "Domyślny widok: ogłoszenia, których nikt jeszcze nie ocenił",
    SHORTCUTS_HINT: "Skróty: J — następne, K — poprzednie, 1–4 — status, 0 — usuń status, S — gwiazdka, U — cofnij, / — szukaj.",
    SHORTCUTS_OFF_HINT: "Skróty klawiszowe są wyłączone.",
    SHORTCUTS_TITLE: "Skróty: J/K, 1–4, 0, S, U, /",
    SAVED_HINT: "Gwiazdka jest prywatna, status jest wspólny dla zespołu."
} as const;

