import { IT_CPV_CODES } from './cpvCodes';
import { isItRelatedCpv, filterTendersByCpvCodes } from './cpvFilter';
import { getCpvName } from './cpvMapping';

describe('cpvFilter', () => {
    it('akceptuje kod z sufiksem i bez, także z błędnym sufiksem', () => {
        expect(isItRelatedCpv('30213000')).toBe(true);
        expect(isItRelatedCpv('30213000-5')).toBe(true);
        expect(isItRelatedCpv('30213000-0')).toBe(true);
    });

    it('odrzuca kody spoza listy, puste i prefiksy', () => {
        expect(isItRelatedCpv('45000000-7')).toBe(false);
        expect(isItRelatedCpv('')).toBe(false);
        expect(isItRelatedCpv('3021')).toBe(false);
    });

    it('filtruje przetargi, jeśli którykolwiek kod jest IT', () => {
        const tenders = [{ cpvCodes: ['45000000'] }, { cpvCodes: ['45000000', '48820000-2'] }];
        expect(filterTendersByCpvCodes(tenders)).toEqual([tenders[1]]);
    });

    it('każdy kod z listy ma 8 cyfr i nazwę', () => {
        for (const [code, name] of Object.entries(IT_CPV_CODES)) {
            expect(code).toMatch(/^\d{8}$/);
            expect(name.trim()).not.toBe('');
        }
    });
});

describe('getCpvName', () => {
    it('zwraca nazwę niezależnie od sufiksu', () => {
        expect(getCpvName('48820000-2')).toBe('Serwery');
        expect(getCpvName('48820000')).toBe('Serwery');
    });

    it('dla nieznanego kodu zwraca ten kod', () => {
        expect(getCpvName('45000000-7')).toBe('45000000-7');
    });
});
