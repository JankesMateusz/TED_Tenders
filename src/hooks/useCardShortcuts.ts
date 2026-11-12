import { useCallback, useEffect, useRef, useState } from "react";
import { Tender } from "../types/Tender";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { afterRemoval, nextActiveId } from "../utils/cardNavigation";
import { TENDER_STATUSES } from "../utils/tenderStatus";

/** Czy zdarzenie pochodzi z pola, w którym użytkownik pisze (skróty jednoklawiszowe nie mogą mu wtedy przeszkadzać). */
const isTypingTarget = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** Czy otwarte jest menu lub okienko (status, filtry, komentarze); rozwijanie kodów CPV (`data-disclosure`) się nie liczy. */
const isPopupOpen = (): boolean =>
    document.querySelector('button[aria-expanded="true"]:not([data-disclosure])') !== null;

type UserPreferences = ReturnType<typeof useUserPreferences>;

type Options = {
    displayedTenders: Tender[];
    activeTab: 'tenders' | 'saved' | 'statistics';
    liveTendersById: Map<string, Tender>;
    toggleFavorite: UserPreferences["toggleFavorite"];
    toggleStatus: UserPreferences["toggleStatus"];
};

/**
 * Skróty klawiszowe listy przetargów i aktywna karta, której one dotyczą (J/K, 1-4, 0, S; Ctrl+F i "/" przenoszą
 * fokus do wyszukiwarki, do której `searchInputRef` trzeba podpiąć).
 */
export const useCardShortcuts = ({ displayedTenders, activeTab, liveTendersById, toggleFavorite, toggleStatus }: Options) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    // Karta, której dotyczą skróty klawiszowe (J/K, 1-4, 0, S)
    const [activeTenderId, setActiveTenderId] = useState<string | null>(null);
    const previousIdsRef = useRef<string[]>([]);
    const handleActivateTender = useCallback(
        (id: string, toggle: boolean) => setActiveTenderId((current) => (toggle && current === id ? null : id)),
        []
    );

    // Obsługa skrótów klawiszowych
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+F lub Cmd+F (na Mac) - fokus na wyszukiwarkę
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    searchInputRef.current.select();
                }
            }
            // "/" - fokus na wyszukiwarkę, ale nie podczas pisania w polu (tam to zwykły znak)
            if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)) {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Gdy aktywna karta zniknęła z listy (np. po ocenie w kolejce), aktywna zostaje następna albo ostatnia
    useEffect(() => {
        const ids = displayedTenders.map((tender) => tender.id);
        setActiveTenderId((current) => {
            if (current === null || ids.includes(current)) return current;
            const successor = afterRemoval(previousIdsRef.current, current);
            return successor !== null && ids.includes(successor) ? successor : null;
        });
        previousIdsRef.current = ids;
    }, [displayedTenders]);

    // Kliknięcie poza kartami wyłącza aktywną kartę
    useEffect(() => {
        if (activeTenderId === null) return;
        const handleClick = (event: MouseEvent) => {
            if (event.target instanceof Element && event.target.closest('[data-tender-card]') === null) {
                setActiveTenderId(null);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [activeTenderId]);

    // Skróty do oceny: J/K, 1-4, 0, S. Nie działają w polach tekstowych, przy otwartym menu ani z Ctrl/Alt/Meta.
    useEffect(() => {
        if (activeTab === 'statistics') return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
            if (isTypingTarget(e.target) || isPopupOpen()) return;

            const key = e.key.toLowerCase();
            const ids = displayedTenders.map((tender) => tender.id);
            if (key === 'j' || key === 'k') {
                e.preventDefault();
                setActiveTenderId((current) => nextActiveId(ids, current, key === 'j' ? 'next' : 'prev'));
                return;
            }

            const tender = displayedTenders.find((item) => item.id === activeTenderId);
            if (!tender) return;
            if (key === 's') {
                e.preventDefault();
                toggleFavorite(tender);
                return;
            }
            // Status da się ustawić tylko dla ogłoszeń, które są jeszcze w bazie wspólnej (jak canSetStatus na karcie)
            if (!liveTendersById.has(tender.id)) return;
            if (key === '0') {
                e.preventDefault();
                if (tender.status) toggleStatus(tender, tender.status);
            } else if (/^[1-4]$/.test(key)) {
                e.preventDefault();
                toggleStatus(tender, TENDER_STATUSES[Number(key) - 1]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, displayedTenders, activeTenderId, liveTendersById, toggleFavorite, toggleStatus]);

    return { activeTenderId, onActivate: handleActivateTender, searchInputRef };
};
