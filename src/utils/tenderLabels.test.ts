import { normalizeLabels, toggleLabel } from './tenderLabels';

describe('toggleLabel', () => {
    it('dodaje etykietę i zdejmuje ją przy ponownym wyborze', () => {
        expect(toggleLabel([], 'important')).toEqual(['important']);
        expect(toggleLabel(['important'], 'important')).toEqual([]);
    });

    it('PROSTY zdejmuje TRUDNY i odwrotnie, zostawiając pozostałe', () => {
        expect(toggleLabel(['hard', 'important'], 'simple')).toEqual(['important', 'simple']);
        expect(toggleLabel(['simple', 'missingDocs'], 'hard')).toEqual(['hard', 'missingDocs']);
    });

    it('WAŻNY! i BRAK DOKUMENTÓW łączą się z każdą inną', () => {
        expect(toggleLabel(['hard'], 'important')).toEqual(['important', 'hard']);
        expect(toggleLabel(['simple', 'important'], 'missingDocs')).toEqual(['important', 'simple', 'missingDocs']);
    });
});

describe('normalizeLabels', () => {
    it('odrzuca nieznane i powtórzone wartości oraz układa w stałej kolejności', () => {
        expect(normalizeLabels(['hard', 'x', 'important', 'hard'])).toEqual(['important', 'hard']);
        expect(normalizeLabels('important')).toEqual([]);
        expect(normalizeLabels(undefined)).toEqual([]);
    });
});
