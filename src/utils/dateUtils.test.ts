import { formatRelativeTime } from './dateUtils';

const NOW = new Date(2026, 9, 29, 15, 0);

describe('formatRelativeTime', () => {
    it('opisuje dzisiejsze odświeżenie samą godziną', () => {
        expect(formatRelativeTime(new Date(2026, 9, 29, 9, 5), NOW)).toBe('dziś 09:05');
    });

    it('opisuje wczorajsze odświeżenie, także przez granicę miesiąca', () => {
        expect(formatRelativeTime(new Date(2026, 9, 28, 14, 32), NOW)).toBe('wczoraj 14:32');
        expect(formatRelativeTime(new Date(2026, 9, 31, 23, 59), new Date(2026, 10, 1, 8, 0))).toBe('wczoraj 23:59');
    });

    it('starsze odświeżenie opisuje datą i godziną', () => {
        expect(formatRelativeTime(new Date(2026, 9, 27, 8, 0), NOW)).toBe('27.10 08:00');
    });
});
