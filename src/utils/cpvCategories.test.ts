import { IT_CPV_CODES } from './cpvCodes';
import { getCpvCategory, getTenderCpvCategories, tenderHasCpvCategory, CPV_CATEGORY_LABELS } from './cpvCategories';

describe('kategorie CPV', () => {
    it('przypisuje typowe kody do właściwych kategorii', () => {
        expect(getCpvCategory('30213100-6')).toBe('computers');
        expect(getCpvCategory('30231300')).toBe('displays');
        expect(getCpvCategory('30232110')).toBe('printing');
        expect(getCpvCategory('30121100')).toBe('printing');
        expect(getCpvCategory('48000000')).toBe('software');
        expect(getCpvCategory('50312000')).toBe('service');
        expect(getCpvCategory('32420000')).toBe('network');
    });

    it('kod bez dopasowania trafia do "Pozostałe"', () => {
        expect(getCpvCategory('39162100')).toBe('other');
        expect(getCpvCategory('99999999')).toBe('other');
    });

    it('każdy kod z listy IT ma kategorię z polską etykietą', () => {
        for (const code of Object.keys(IT_CPV_CODES)) {
            expect(CPV_CATEGORY_LABELS[getCpvCategory(code)]).toBeTruthy();
        }
    });

    it('przetarg z kilkoma kodami jednej kategorii liczy się w niej raz', () => {
        expect(getTenderCpvCategories(['30213100-6', '30213300-8', '48000000-8']).sort()).toEqual(['computers', 'software']);
    });

    it('pomija kody spoza listy IT', () => {
        expect(getTenderCpvCategories(['45000000-7'])).toEqual([]);
        expect(tenderHasCpvCategory(['45000000-7', '30213100-6'], 'computers')).toBe(true);
        expect(tenderHasCpvCategory(['45000000-7'], 'other')).toBe(false);
    });
});
