import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { isHiddenAdvertiser } from './advertisers';

const tender = (extra: Partial<Tender> = {}): Tender => ({
    id: 'BAZA_KONKURENCYJNOSCI_1',
    publicationNumber: '1',
    title: 'Dostawa komputerów',
    buyerName: 'Firma Sp. z o.o.',
    buyerCity: 'Poznań',
    publicationDate: '04-11-2026',
    deadlineDate: '18-11-2026',
    cpvCodes: [],
    link: 'https://example.com',
    source: TenderSource.BAZA_KONKURENCYJNOSCI,
    buyerNip: '1234567890',
    ...extra
});

describe('isHiddenAdvertiser', () => {
    it('automatycznie ukrywa firmy prywatne i organizacje pozarządowe', () => {
        expect(isHiddenAdvertiser(tender({ buyerSectorAuto: 'private' }))).toBe(true);
        expect(isHiddenAdvertiser(tender({ buyerSectorAuto: 'ngo' }))).toBe(true);
    });

    it('nie ukrywa podmiotów publicznych, komunalnych ani nieznanych', () => {
        for (const sector of ['public', 'municipal', 'unknown'] as const) {
            expect(isHiddenAdvertiser(tender({ buyerSectorAuto: sector }))).toBe(false);
        }
        expect(isHiddenAdvertiser(tender())).toBe(false);
    });

    it('ręczna decyzja wygrywa z automatem w obie strony', () => {
        expect(isHiddenAdvertiser(tender({ buyerSectorAuto: 'private' }), { '1234567890': 'visible' })).toBe(false);
        expect(isHiddenAdvertiser(tender({ buyerSectorAuto: 'public' }), { '1234567890': 'hidden' })).toBe(true);
        expect(isHiddenAdvertiser(tender({ buyerSectorAuto: 'unknown' }), { '1234567890': 'hidden' })).toBe(true);
    });

    it('decyzja o innym zamawiającym nie ma wpływu', () => {
        expect(isHiddenAdvertiser(tender({ buyerSectorAuto: 'private' }), { '9999999999': 'visible' })).toBe(true);
    });

    it('ogłoszenia bez NIP-u nie są nigdy ukrywane (nie dałoby się ich przywrócić)', () => {
        expect(isHiddenAdvertiser(tender({ buyerNip: undefined, buyerSectorAuto: 'private' }))).toBe(false);
        expect(isHiddenAdvertiser(tender({ buyerNip: undefined, source: TenderSource.TED }), {})).toBe(false);
    });
});
