import { TenderComment } from '../types/TenderComment';
import { MAX_COMMENT_LENGTH, groupCommentsByTender, normalizeCommentText } from './comments';

const comment = (id: string, tenderId: string, minute: number): TenderComment => ({
    id,
    tenderId,
    text: `Komentarz ${id}`,
    authorUid: 'u1',
    authorEmail: 'a@example.com',
    createdAt: new Date(2026, 9, 29, 12, minute)
});

describe('groupCommentsByTender', () => {
    it('grupuje po przetargu i sortuje od najstarszego', () => {
        const grouped = groupCommentsByTender([comment('c', 'TED_1', 30), comment('a', 'TED_2', 5), comment('b', 'TED_1', 10)]);
        expect(grouped['TED_1'].map((c) => c.id)).toEqual(['b', 'c']);
        expect(grouped['TED_2'].map((c) => c.id)).toEqual(['a']);
    });

    it('przy tym samym czasie porządkuje po id, żeby kolejność była stabilna', () => {
        const grouped = groupCommentsByTender([comment('b', 'TED_1', 10), comment('a', 'TED_1', 10)]);
        expect(grouped['TED_1'].map((c) => c.id)).toEqual(['a', 'b']);
    });

    it('dla braku komentarzy zwraca pusty obiekt', () => {
        expect(groupCommentsByTender([])).toEqual({});
    });
});

describe('normalizeCommentText', () => {
    it('obcina białe znaki z brzegów', () => {
        expect(normalizeCommentText('  Do wyjaśnienia \n')).toBe('Do wyjaśnienia');
    });

    it('odrzuca pusty tekst i same białe znaki', () => {
        expect(normalizeCommentText('')).toBeNull();
        expect(normalizeCommentText('   \n ')).toBeNull();
    });

    it('odrzuca tekst dłuższy niż limit', () => {
        expect(normalizeCommentText('a'.repeat(MAX_COMMENT_LENGTH))).not.toBeNull();
        expect(normalizeCommentText('a'.repeat(MAX_COMMENT_LENGTH + 1))).toBeNull();
    });
});
