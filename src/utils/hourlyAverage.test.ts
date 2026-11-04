import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { averageHourlyDistribution } from './hourlyAverage';

const ez = (publicationDate: string, publicationTime?: string, source = TenderSource.E_ZAMOWIENIA): Tender =>
    ({ id: `${publicationDate}-${publicationTime}`, source, publicationDate, publicationTime }) as Tender;

const days = ['2026-11-02', '2026-11-03', '2026-11-04'];

describe('średni rozkład godzinowy', () => {
    it('uśrednia po dniach z kompletnym pobraniem i wskazuje najlepszą godzinę', () => {
        const tenders = [
            ez('02-11-2026', '10:05'),
            ez('02-11-2026', '10:40'),
            ez('03-11-2026', '10:15'),
            ez('03-11-2026', '14:00'),
            ez('04-11-2026', '09:00') // dzień niekompletny: pomijany
        ];
        const result = averageHourlyDistribution(tenders, days, new Set(['2026-11-02', '2026-11-03']));
        expect(result?.dayCount).toBe(2);
        expect(result?.values[10]).toBe(1.5);
        expect(result?.values[14]).toBe(0.5);
        expect(result?.values[9]).toBe(0);
        expect(result?.peakHour).toBe(10);
    });

    it('kompletny dzień bez ogłoszeń zaniża średnią', () => {
        const result = averageHourlyDistribution([ez('02-11-2026', '10:00')], days, new Set(['2026-11-02', '2026-11-03']));
        expect(result?.values[10]).toBe(0.5);
    });

    it('bez kompletnych dni zwraca null', () => {
        expect(averageHourlyDistribution([ez('02-11-2026', '10:00')], days, new Set())).toBeNull();
        expect(averageHourlyDistribution([], [], new Set(['2026-11-02']))).toBeNull();
    });

    it('pomija inne źródła, ogłoszenia bez godziny, godziny spoza zakresu i dni spoza listy', () => {
        const tenders = [
            ez('02-11-2026', '10:00', TenderSource.TED),
            ez('02-11-2026'),
            ez('02-11-2026', '25:00'),
            ez('02-11-2026', 'xx:00'),
            ez('01-11-2026', '10:00')
        ];
        const result = averageHourlyDistribution(tenders, days, new Set(['2026-11-02', '2026-11-01']));
        expect(result?.dayCount).toBe(1);
        expect(result?.values.every((value) => value === 0)).toBe(true);
        expect(result?.peakHour).toBeNull();
    });

    it('przy remisie najlepszą godziną jest wcześniejsza', () => {
        const result = averageHourlyDistribution(
            [ez('02-11-2026', '08:00'), ez('02-11-2026', '15:00')],
            days,
            new Set(['2026-11-02'])
        );
        expect(result?.peakHour).toBe(8);
    });
});
