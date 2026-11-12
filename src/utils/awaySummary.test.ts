import { AwayEvent, MIN_AWAY_MS, buildSummary, formatAway, isAwayLongEnough, countNewSince, isNewSince, isSummaryEmpty, pluralPl, statusLabel } from './awaySummary';

const event = (over: Partial<AwayEvent>): AwayEvent => ({
    id: 'e', type: 'status_changed', tenderId: 't1', title: 'Laptopy', actorUid: 'other', actorEmail: 'a@b.pl', status: 'toEnter', ...over
});
const since = new Date('2026-11-12T08:00:00Z');

describe('isAwayLongEnough', () => {
    it('wymaga znanej wizyty i progu nieobecności', () => {
        const now = new Date(since.getTime() + MIN_AWAY_MS);
        expect(isAwayLongEnough(null, now)).toBe(false);
        expect(isAwayLongEnough(since, new Date(now.getTime() - 1))).toBe(false);
        expect(isAwayLongEnough(since, now)).toBe(true);
    });
});

describe('isNewSince', () => {
    it('oznacza tylko przetargi pobrane po ostatniej wizycie i tylko gdy znamy punkt odniesienia', () => {
        const after = new Date(since.getTime() + 1);
        expect(isNewSince(after, since)).toBe(true);
        expect(isNewSince(since, since)).toBe(false);
        expect(isNewSince(new Date(since.getTime() - 1), since)).toBe(false);
        expect(isNewSince(after, null)).toBe(false);
        expect(isNewSince(undefined, since)).toBe(false);
    });
});

describe('buildSummary', () => {
    it('pomija własne zmiany statusu', () => {
        const summary = buildSummary(since, [event({ actorUid: 'me' })], 'me');
        expect(summary.statusChanges).toEqual([]);
    });

    it('zostawia ostatnią zmianę statusu tego samego przetargu (zdarzenia od najnowszych)', () => {
        const newest = event({ id: 'new', status: 'entered' });
        const older = event({ id: 'old', status: 'toEnter' });
        expect(buildSummary(since, [newest, older], 'me').statusChanges).toEqual([newest]);
    });

    it('rozdziela zdarzenia dokumentów i nie dedupuje ich po statusie', () => {
        const docs = event({ id: 'd', type: 'docs_available', actorUid: null, status: null });
        const summary = buildSummary(since, [docs, event({ tenderId: 't2' })], 'me');
        expect(summary.docsAvailable).toEqual([docs]);
        expect(summary.statusChanges).toHaveLength(1);
    });

    it('rozpoznaje puste podsumowanie', () => {
        expect(isSummaryEmpty(buildSummary(since, [], 'me'), 0)).toBe(true);
        expect(isSummaryEmpty(buildSummary(since, [], 'me'), 1)).toBe(false);
    });
});

describe('formatowanie', () => {
    it('odmienia rzeczownik po liczbie', () => {
        const form = (n: number) => pluralPl(n, 'przetarg', 'przetargi', 'przetargów');
        expect([1, 2, 4, 5, 12, 14, 22, 25].map(form)).toEqual([
            'przetarg', 'przetargi', 'przetargi', 'przetargów', 'przetargów', 'przetargów', 'przetargi', 'przetargów'
        ]);
    });

    it('opisuje nieobecność w minutach, godzinach i dniach', () => {
        const ago = (ms: number) => formatAway(new Date(since.getTime() - ms), since);
        expect(ago(15 * 60000)).toBe('15 min');
        expect(ago(3 * 3600000)).toBe('3 godz.');
        expect(ago(72 * 3600000)).toBe('3 dni');
    });

    it('nazywa status, a nieznany opisuje ogólnie', () => {
        expect(statusLabel('toEnter')).toBe('Do wpisania');
        expect(statusLabel(null)).toBe('nowy status');
    });
});

describe('countNewSince', () => {
    const since = new Date('2026-01-01T10:00:00Z');
    it('liczy tylko przetargi pobrane po ostatniej wizycie', () => {
        const list = [
            { fetchedAt: new Date('2026-01-01T11:00:00Z') },
            { fetchedAt: new Date('2026-01-01T09:00:00Z') },
            {}
        ];
        expect(countNewSince(list, since)).toBe(1);
        expect(countNewSince(list, null)).toBe(0);
    });
});
