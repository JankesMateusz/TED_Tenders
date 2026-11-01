/** Wspólny status przetargu, widoczny dla wszystkich użytkowników. Statusy wzajemnie się wykluczają. */
export type TenderStatus = 'toEnter' | 'entered' | 'toClarify' | 'notToEnter';
