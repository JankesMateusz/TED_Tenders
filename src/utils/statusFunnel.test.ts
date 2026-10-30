import { buildStatusFunnel } from './statusFunnel';

describe('lejek statusów', () => {
    it('liczy przejrzane, nieoznaczone i udziały względem wszystkich przetargów', () => {
        const rows = buildStatusFunnel(8, { toEnter: 2, entered: 1, toClarify: 1, notToEnter: 0, unmarked: 4 });
        expect(rows.map(({ key, count, percent }) => [key, count, percent])).toEqual([
            ['total', 8, 100],
            ['reviewed', 4, 50],
            ['unmarked', 4, 50],
            ['toEnter', 2, 25],
            ['entered', 1, 12.5],
            ['toClarify', 1, 12.5],
            ['notToEnter', 0, 0]
        ]);
    });

    it('przy pustej liście nie dzieli przez zero', () => {
        const rows = buildStatusFunnel(0, { toEnter: 0, entered: 0, toClarify: 0, notToEnter: 0, unmarked: 0 });
        expect(rows.every((r) => r.count === 0 && r.percent === 0)).toBe(true);
    });
});
