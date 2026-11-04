import { pluralizeTenders } from './pluralPl';

describe('odmiana słowa "ogłoszenie"', () => {
    it.each([
        [0, 'ogłoszeń'],
        [1, 'ogłoszenie'],
        [2, 'ogłoszenia'],
        [4, 'ogłoszenia'],
        [5, 'ogłoszeń'],
        [12, 'ogłoszeń'],
        [22, 'ogłoszenia'],
        [58, 'ogłoszeń'],
        [101, 'ogłoszeń']
    ])('%i: %s', (count, expected) => {
        expect(pluralizeTenders(count)).toBe(expected);
    });
});
