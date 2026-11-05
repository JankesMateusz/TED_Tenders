/**
 * Wspólne etykiety przetargu, widoczne dla wszystkich użytkowników. W przeciwieństwie do statusu
 * przetarg może mieć kilka etykiet naraz; wykluczają się tylko `simple` i `hard`.
 */
export type TenderLabel = 'important' | 'simple' | 'hard' | 'missingDocs';
