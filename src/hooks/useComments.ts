import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tender } from '../types/Tender';
import { TenderComment } from '../types/TenderComment';
import { useAuth } from '../context/AuthContext';
import { groupCommentsByTender, normalizeCommentText } from '../utils/comments';
import { addComment, deleteComment, subscribeToComments } from '../utils/tendersApi';

const LOAD_ERROR = 'Nie udało się wczytać komentarzy.';
const SAVE_ERROR = 'Nie udało się zapisać komentarza. Spróbuj ponownie.';
const DELETE_ERROR = 'Nie udało się usunąć komentarza. Spróbuj ponownie.';

/**
 * Komentarze do przetargów z podanego zakresu dni (nasłuch na żywo, także zmiany innych osób) oraz
 * dodawanie i usuwanie. Zakres jest ten sam co przy przetargach, `null` oznacza brak zakresu.
 */
export const useComments = (startDay: string | null, endDay: string | null) => {
    const { user } = useAuth();
    const uid = user?.uid ?? null;
    const email = user?.email ?? null;
    const [comments, setComments] = useState<TenderComment[]>([]);
    const [commentsError, setCommentsError] = useState<string | null>(null);

    useEffect(() => {
        setComments([]);
        if (!uid || !startDay || !endDay) return;
        return subscribeToComments(startDay, endDay, setComments, (error) => {
            console.error('Błąd wczytywania komentarzy:', error);
            setCommentsError(LOAD_ERROR);
        });
    }, [uid, startDay, endDay]);

    const commentsByTender = useMemo(() => groupCommentsByTender(comments), [comments]);

    /** Zwraca true, gdy komentarz został zapisany; pusty lub za długi tekst nie jest wysyłany. */
    const add = useCallback(async (tender: Tender, text: string): Promise<boolean> => {
        const normalized = normalizeCommentText(text);
        if (!uid || !normalized) return false;
        setCommentsError(null);
        try {
            await addComment(tender, normalized, { uid, email });
            return true;
        } catch (error) {
            console.error('Błąd zapisu komentarza:', error);
            setCommentsError(SAVE_ERROR);
            return false;
        }
    }, [uid, email]);

    const remove = useCallback(async (comment: TenderComment): Promise<void> => {
        if (comment.authorUid !== uid) return;
        setCommentsError(null);
        try {
            await deleteComment(comment.id);
        } catch (error) {
            console.error('Błąd usuwania komentarza:', error);
            setCommentsError(DELETE_ERROR);
        }
    }, [uid]);

    return { commentsByTender, commentsError, addComment: add, deleteComment: remove };
};
