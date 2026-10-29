import { canRefreshDay, daysToRefresh, listDays } from './refreshPlan';

const TODAY = '2026-10-29';

describe('canRefreshDay', () => {
    it('przyjmuje dzisiaj i dni z ostatnich 31 dni', () => {
        expect(canRefreshDay('2026-10-29', TODAY)).toBe(true);
        expect(canRefreshDay('2026-09-28', TODAY)).toBe(true);
    });

    it('odrzuca przyszłość i dni starsze niż 31', () => {
        expect(canRefreshDay('2026-10-30', TODAY)).toBe(false);
        expect(canRefreshDay('2026-09-27', TODAY)).toBe(false);
    });
});

describe('listDays', () => {
    it('zwraca dni włącznie z końcami, także przez granicę miesiąca', () => {
        expect(listDays('2026-10-30', '2026-11-02')).toEqual(['2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02']);
    });

    it('zwraca jeden dzień, gdy początek równa się końcowi', () => {
        expect(listDays('2026-10-29', '2026-10-29')).toEqual(['2026-10-29']);
    });

    it('zwraca pustą listę, gdy koniec jest przed początkiem', () => {
        expect(listDays('2026-10-29', '2026-10-28')).toEqual([]);
    });
});

describe('daysToRefresh', () => {
    it('pomija dni z kompletnym wpisem w dzienniku', () => {
        const log = { '2026-10-26': { complete: true }, '2026-10-27': { complete: true } };
        expect(daysToRefresh('2026-10-26', '2026-10-28', log, TODAY)).toEqual(['2026-10-28']);
    });

    it('ponawia dni z niekompletnym wpisem (pobrane w trakcie dnia)', () => {
        const log = { '2026-10-27': { complete: false } };
        expect(daysToRefresh('2026-10-26', '2026-10-27', log, TODAY)).toEqual(['2026-10-26', '2026-10-27']);
    });

    it('zawsze obejmuje dzisiejszy dzień', () => {
        const log = { [TODAY]: { complete: true } };
        expect(daysToRefresh('2026-10-28', TODAY, log, TODAY)).toEqual(['2026-10-28', TODAY]);
    });

    it('pomija dni, których serwer nie przyjmie', () => {
        expect(daysToRefresh('2026-09-20', '2026-09-29', {}, TODAY)).toEqual(['2026-09-28', '2026-09-29']);
        expect(daysToRefresh('2026-10-29', '2026-11-02', {}, TODAY)).toEqual([TODAY]);
    });

    it('dla pojedynczego dnia bez dziennika zwraca ten dzień', () => {
        expect(daysToRefresh('2026-10-27', '2026-10-27', {}, TODAY)).toEqual(['2026-10-27']);
    });
});
