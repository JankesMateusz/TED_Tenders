import type React from 'react';

/**
 * Czy fokus przeszedł z kontenera na inny element strony (np. Tab z ostatniej pozycji menu).
 * `relatedTarget` jest puste przy przełączeniu okna albo kliknięciu w niefokusowalne miejsce (w Safari także przy
 * kliknięciu przycisku), więc takie zdarzenia ignorujemy; menu zamyka się wtedy kliknięciem poza nim lub Escape.
 */
export const focusLeftContainer = (event: React.FocusEvent<HTMLElement>): boolean => {
    const next = event.relatedTarget;
    return next instanceof Node && !event.currentTarget.contains(next);
};
