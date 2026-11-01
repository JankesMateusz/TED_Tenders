import { describePeriod, formatDelta, getComparisonPeriod, previousWorkingDay } from './comparison';

describe('poprzedni dzień roboczy', () => {
    it('dla poniedziałku jest to piątek', () => {
        expect(previousWorkingDay('2026-10-26')).toBe('2026-10-23');
    });

    it('dla soboty i niedzieli jest to piątek', () => {
        expect(previousWorkingDay('2026-10-24')).toBe('2026-10-23');
        expect(previousWorkingDay('2026-10-25')).toBe('2026-10-23');
    });

    it('w środku tygodnia jest to dzień wcześniej', () => {
        expect(previousWorkingDay('2026-10-29')).toBe('2026-10-28');
    });
});

describe('okres porównawczy', () => {
    const today = '2026-10-30';

    it('dla jednego dnia wybiera poprzedni dzień roboczy', () => {
        expect(getComparisonPeriod('2026-10-26', '2026-10-26', today)).toEqual({
            ok: true,
            startDay: '2026-10-23',
            endDay: '2026-10-23'
        });
    });

    it('dla zakresu wybiera bezpośrednio poprzedzający okres tej samej długości', () => {
        expect(getComparisonPeriod('2026-10-20', '2026-10-26', today)).toEqual({
            ok: true,
            startDay: '2026-10-13',
            endDay: '2026-10-19'
        });
    });

    it('jest niedostępny, gdy poprzedni okres wypada poza 30 dni wstecz', () => {
        expect(getComparisonPeriod('2026-10-05', '2026-10-30', today).ok).toBe(false);
        expect(getComparisonPeriod('2026-09-30', '2026-09-30', today).ok).toBe(false);
    });

    it('dopuszcza okres zaczynający się dokładnie 30 dni wstecz', () => {
        expect(getComparisonPeriod('2026-10-01', '2026-10-01', today).ok).toBe(true);
    });
});

describe('opis i różnica', () => {
    it('opisuje dzień z nazwą dnia tygodnia, a zakres datami', () => {
        expect(describePeriod('2026-10-23', '2026-10-23')).toBe('piątek 23-10-2026');
        expect(describePeriod('2026-10-13', '2026-10-19')).toBe('13-10-2026 – 19-10-2026');
    });

    it('formatuje różnicę ze znakiem', () => {
        expect(formatDelta(8, 5)).toBe('+3');
        expect(formatDelta(2, 5)).toBe('−3');
        expect(formatDelta(4, 4)).toBe('bez zmian');
    });
});
