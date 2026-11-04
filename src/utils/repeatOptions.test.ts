import { splitRepeatOptions } from './repeatOptions';

const opt = (name: string, count: number) => ({ name, count });
const none = () => false;

describe('powtarzający się zamawiający', () => {
    it('chowa pozycje z jednym ogłoszeniem i zachowuje kolejność', () => {
        const options = [opt('A', 6), opt('B', 2), opt('C', 1), opt('D', 1)];
        const { repeating, others } = splitRepeatOptions(options, none);
        expect(repeating.map((o) => o.name)).toEqual(['A', 'B']);
        expect(others.map((o) => o.name)).toEqual(['C', 'D']);
    });

    it('wybrane pozycje zostają widoczne, nawet z jednym lub zerem ogłoszeń', () => {
        const options = [opt('A', 3), opt('B', 1), opt('C', 0), opt('D', 1)];
        const { repeating, others } = splitRepeatOptions(options, (name) => name === 'B' || name === 'C');
        expect(repeating.map((o) => o.name)).toEqual(['A', 'B', 'C']);
        expect(others.map((o) => o.name)).toEqual(['D']);
    });

    it('gdy nikt się nie powtarza, pokazuje wszystkich i nie ma nic do rozwinięcia', () => {
        const options = [opt('A', 1), opt('B', 1)];
        const { repeating, others } = splitRepeatOptions(options, none);
        expect(repeating).toEqual(options);
        expect(others).toEqual([]);
    });

    it('pusta lista daje puste wyniki', () => {
        expect(splitRepeatOptions([], none)).toEqual({ repeating: [], others: [] });
    });

    it('wybrana pozycja z jednym ogłoszeniem nie liczy się jako powtarzająca', () => {
        const options = [opt('A', 1), opt('B', 1)];
        const { repeating, others } = splitRepeatOptions(options, (name) => name === 'A');
        expect(repeating).toEqual(options);
        expect(others).toEqual([]);
    });
});
