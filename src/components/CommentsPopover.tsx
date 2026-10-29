import React, { useEffect, useRef, useState } from 'react';
import { TenderComment } from '../types/TenderComment';
import { MAX_COMMENT_LENGTH } from '../utils/comments';
import { formatRelativeTime } from '../utils/dateUtils';
import styles from './Comments.module.css';

type Props = {
    comments: TenderComment[];
    /** Uid zalogowanej osoby; tylko własne komentarze można usunąć. */
    currentUid: string | null;
    /** Zwraca true, gdy komentarz został zapisany (wtedy pole się czyści). */
    onAdd: (text: string) => Promise<boolean>;
    onDelete: (comment: TenderComment) => void;
};

/** Przycisk z dymkiem i liczbą komentarzy oraz okienko z wątkiem i polem na nowy komentarz. */
const CommentsPopover: React.FC<Props> = ({ comments, currentUid, onAdd, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState('');
    const [saving, setSaving] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Zamknięcie klawiszem Escape lub kliknięciem poza okienkiem
    useEffect(() => {
        if (!open) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        const handleClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [open]);

    // Po otwarciu i po nowym komentarzu lista przewija się do najnowszego
    useEffect(() => {
        if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [open, comments.length]);

    const submit = async () => {
        if (saving || draft.trim().length === 0) return;
        setSaving(true);
        const saved = await onAdd(draft);
        setSaving(false);
        if (saved) setDraft('');
    };

    const count = comments.length;
    const label = count > 0 ? `Komentarze (${count})` : 'Dodaj komentarz';

    return (
        <div
            ref={containerRef}
            className={styles.container}
            // Puste title wyłącza podpowiedź karty (autor statusu) nad okienkiem
            title=""
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className={`${styles.commentButton} ${count > 0 ? styles.commentButtonActive : ''}`}
                onClick={() => setOpen((prev) => !prev)}
                aria-label={label}
                aria-expanded={open}
                title={label}
            >
                💬
                {count > 0 && <span className={styles.commentCount}>{count}</span>}
            </button>

            {open && (
                <div className={styles.popover} role="dialog" aria-label="Komentarze do przetargu">
                    {count === 0 ? (
                        <p className={styles.empty}>Brak komentarzy.</p>
                    ) : (
                        <ul className={styles.list} ref={listRef}>
                            {comments.map((comment) => (
                                <li key={comment.id} className={styles.comment}>
                                    <div className={styles.commentMeta}>
                                        <span className={styles.author}>{comment.authorEmail}</span>
                                        <span className={styles.time}>{formatRelativeTime(comment.createdAt)}</span>
                                        {comment.authorUid === currentUid && (
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => onDelete(comment)}
                                                aria-label="Usuń komentarz"
                                                title="Usuń komentarz"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <p className={styles.text}>{comment.text}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                    <textarea
                        className={styles.input}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                submit();
                            }
                        }}
                        placeholder="Napisz komentarz (Ctrl+Enter wysyła)"
                        maxLength={MAX_COMMENT_LENGTH}
                        rows={3}
                        aria-label="Treść komentarza"
                    />
                    <button
                        className={styles.submitButton}
                        onClick={submit}
                        disabled={saving || draft.trim().length === 0}
                    >
                        {saving ? 'Zapisywanie…' : 'Dodaj'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentsPopover;
