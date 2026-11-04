import { statusAuthorCaption } from './tenderStatus';

describe('statusAuthorCaption', () => {
    it('podaje autora oraz datę i godzinę w czasie lokalnym', () => {
        const at = new Date(2026, 9, 29, 14, 5);
        expect(statusAuthorCaption('anna@example.com', at)).toBe('anna@example.com, 29.10 14:05');
    });

    it('zostawia samego autora, gdy brak daty', () => {
        expect(statusAuthorCaption('anna@example.com')).toBe('anna@example.com');
    });

    it('podpisuje nieznanego autora', () => {
        expect(statusAuthorCaption(undefined, new Date(2026, 0, 2, 3, 4))).toBe('nieznany użytkownik, 02.01 03:04');
    });
});
