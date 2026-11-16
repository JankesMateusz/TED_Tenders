import { describeStatusChange, statusAuthorCaption } from './tenderStatus';

describe('describeStatusChange', () => {
    const me = 'ja@example.com';

    it('opisuje pierwsze ustawienie statusu', () => {
        expect(describeStatusChange({}, 'entered', me)).toBe('Status: Wpisany.');
    });

    it('przy nadpisaniu cudzego statusu podaje jego autora', () => {
        expect(describeStatusChange({ status: 'toEnter', byEmail: 'anna@example.com' }, 'entered', me)).toBe(
            'Status: Wpisany. Zastąpiono „Do wpisania” ustawiony przez anna@example.com.'
        );
    });

    it('przy zmianie własnego statusu nie obwinia nikogo', () => {
        expect(describeStatusChange({ status: 'toEnter', byEmail: me }, 'entered', me)).toBe(
            'Status: Wpisany. Wcześniej: „Do wpisania”.'
        );
    });

    it('przy zdjęciu cudzego statusu podaje autora, przy własnym nie', () => {
        expect(describeStatusChange({ status: 'entered', byEmail: 'anna@example.com' }, null, me)).toBe(
            'Usunięto status „Wpisany”, ustawiony przez anna@example.com.'
        );
        expect(describeStatusChange({ status: 'entered', byEmail: me }, null, me)).toBe('Usunięto status „Wpisany”.');
    });

    it('nie zakłada autora, gdy go nie znamy', () => {
        expect(describeStatusChange({ status: 'toClarify' }, 'entered', me)).toBe(
            'Status: Wpisany. Zastąpiono „Do wyjaśnienia” ustawiony przez nieznany użytkownik.'
        );
    });
});

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
