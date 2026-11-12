import { toggleInArray } from './toggleInArray';

describe('toggleInArray', () => {
    it('adds a missing item at the end', () => {
        expect(toggleInArray(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
    });

    it('removes an item that is already present', () => {
        expect(toggleInArray(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
    });

    it('works on an empty list', () => {
        expect(toggleInArray([], 'a')).toEqual(['a']);
    });

    it('does not mutate the input', () => {
        const input = ['a', 'b'];
        toggleInArray(input, 'a');
        toggleInArray(input, 'c');
        expect(input).toEqual(['a', 'b']);
    });
});
