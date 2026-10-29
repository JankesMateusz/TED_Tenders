import { TenderComment } from '../types/TenderComment';

/** Maksymalna długość komentarza (taki sam limit jest w regułach Firestore). */
export const MAX_COMMENT_LENGTH = 1000;

/** Komentarze pogrupowane według przetargu, od najstarszego do najnowszego. */
export const groupCommentsByTender = (comments: TenderComment[]): Record<string, TenderComment[]> => {
    const grouped: Record<string, TenderComment[]> = {};
    const sorted = [...comments].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime() || a.id.localeCompare(b.id)
    );
    for (const comment of sorted) {
        (grouped[comment.tenderId] ??= []).push(comment);
    }
    return grouped;
};

/** Tekst gotowy do zapisu albo null, gdy komentarz jest pusty lub za długi. */
export const normalizeCommentText = (text: string): string | null => {
    const trimmed = text.trim();
    return trimmed.length > 0 && trimmed.length <= MAX_COMMENT_LENGTH ? trimmed : null;
};
