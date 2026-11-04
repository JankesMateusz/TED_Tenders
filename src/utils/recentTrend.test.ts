import { Tender } from '../types/Tender';
import { countTendersByDay, lastDays } from './recentTrend';

const tender = (publicationDate: string) => ({ publicationDate }) as Tender;

describe('lastDays', () => {
    it('zwraca dni od najstarszego do dnia końcowego włącznie, także przez granicę miesiąca', () => {
        expect(lastDays('2026-11-02', 4)).toEqual(['2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02']);
    });
});

describe('countTendersByDay', () => {
    it('liczy przetargi w dniach i zostawia zera dla dni bez publikacji', () => {
        const points = countTendersByDay(
            [tender('03-11-2026'), tender('03-11-2026'), tender('01-11-2026'), tender('15-10-2026')],
            ['2026-11-01', '2026-11-02', '2026-11-03'],
            new Set(['2026-11-01', '2026-11-03'])
        );
        expect(points).toEqual([
            { day: '2026-11-01', count: 1, complete: true },
            { day: '2026-11-02', count: 0, complete: false },
            { day: '2026-11-03', count: 2, complete: true }
        ]);
    });
});
