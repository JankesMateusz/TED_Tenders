// Testy czystej logiki sprawdzania dostępności dokumentacji (TT-15): harmonogram z oknem 9:00-24:00 i mapowanie wyniku resolvera.
// Wymagają zbudowanych funkcji: npm run test:unit
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    clampToWindow, firstCheckTime, isInsideWindow, MAX_CHECKS, nextCheckTime, warsawWallClockToUtc
} from '../functions/lib/analysis/docsCheck/schedule.js';
import { errorOutcome, isTerminalState, outcomeChanged, outcomeFromResult } from '../functions/lib/analysis/docsCheck/state.js';

const iso = (value) => new Date(value);
const at = (date) => date?.toISOString();

// Listopad 2026: czas zimowy (UTC+1); 2026-11-06 to piątek, 2026-11-09 poniedziałek.
describe('harmonogram sprawdzeń', () => {
    it('warsawWallClockToUtc uwzględnia czas zimowy i letni', () => {
        assert.equal(at(warsawWallClockToUtc('2026-11-06', 9)), '2026-11-06T08:00:00.000Z');
        assert.equal(at(warsawWallClockToUtc('2026-07-01', 9)), '2026-07-01T07:00:00.000Z');
    });

    it('pierwsze sprawdzenie w oknie zostaje, przed 9:00 przechodzi na 9:00 tego dnia', () => {
        assert.equal(at(firstCheckTime(iso('2026-11-06T10:00:00Z'))), '2026-11-06T10:00:00.000Z');
        assert.equal(at(firstCheckTime(iso('2026-11-06T22:30:00Z'))), '2026-11-06T22:30:00.000Z'); // 23:30 w Warszawie
        assert.equal(at(firstCheckTime(iso('2026-11-06T02:00:00Z'))), '2026-11-06T08:00:00.000Z'); // 03:00 -> 09:00
        assert.equal(at(firstCheckTime(iso('2026-11-06T07:59:00Z'))), '2026-11-06T08:00:00.000Z'); // 08:59 -> 09:00
        assert.equal(at(firstCheckTime(iso('2026-11-06T08:00:00Z'))), '2026-11-06T08:00:00.000Z'); // 09:00 zostaje
    });

    it('okno kończy się o północy: 23:59 jest w oknie, 00:00 nie', () => {
        assert.equal(isInsideWindow(iso('2026-11-06T22:59:00Z')), true);
        assert.equal(isInsideWindow(iso('2026-11-06T23:00:00Z')), false);
    });

    it('+1 h, +2 h, +4 h od poprzedniego sprawdzenia', () => {
        const now = iso('2026-11-06T10:00:00Z');
        assert.equal(at(nextCheckTime(1, now)), '2026-11-06T11:00:00.000Z');
        assert.equal(at(nextCheckTime(2, now)), '2026-11-06T12:00:00.000Z');
        assert.equal(at(nextCheckTime(3, now)), '2026-11-06T14:00:00.000Z');
    });

    it('termin po północy przechodzi na 9:00 kolejnego dnia kalendarzowego', () => {
        // piątek 22:00 w Warszawie + 4 h = sobota 02:00 -> sobota 9:00 (sprawdzenia 1-3 idą ciągiem, bez pomijania weekendu)
        assert.equal(at(nextCheckTime(3, iso('2026-11-06T21:00:00Z'))), '2026-11-07T08:00:00.000Z');
    });

    it('po czwartym sprawdzeniu: następny dzień roboczy o 9:00, pomijając weekend', () => {
        assert.equal(at(nextCheckTime(4, iso('2026-11-05T15:00:00Z'))), '2026-11-06T08:00:00.000Z'); // czwartek -> piątek
        assert.equal(at(nextCheckTime(4, iso('2026-11-06T15:00:00Z'))), '2026-11-09T08:00:00.000Z'); // piątek -> poniedziałek
        assert.equal(at(nextCheckTime(4, iso('2026-11-07T10:00:00Z'))), '2026-11-09T08:00:00.000Z'); // sobota -> poniedziałek
    });

    it('po piątym sprawdzeniu: tego dnia o 12:00, a gdy już po 12:00, za godzinę', () => {
        assert.equal(at(nextCheckTime(5, iso('2026-11-09T08:00:00Z'))), '2026-11-09T11:00:00.000Z');
        assert.equal(at(nextCheckTime(5, iso('2026-11-09T13:00:00Z'))), '2026-11-09T14:00:00.000Z');
    });

    it('po ostatnim sprawdzeniu brak kolejnego', () => {
        assert.equal(MAX_CHECKS, 6);
        assert.equal(nextCheckTime(6, iso('2026-11-09T11:00:00Z')), null);
    });

    it('żaden termin harmonogramu nie wypada poza oknem', () => {
        for (let hour = 0; hour < 24; hour++) {
            let moment = firstCheckTime(iso(`2026-11-06T${String(hour).padStart(2, '0')}:15:00Z`));
            assert.equal(isInsideWindow(moment), true);
            for (let check = 1; check < MAX_CHECKS; check++) {
                moment = nextCheckTime(check, moment);
                assert.equal(isInsideWindow(moment), true, `po sprawdzeniu ${check}, start ${hour}:15Z -> ${at(moment)}`);
            }
        }
    });

    it('clampToWindow nie zmienia terminów w oknie', () => {
        const moment = iso('2026-11-06T12:34:00Z');
        assert.equal(clampToWindow(moment), moment);
    });
});

describe('mapowanie wyniku resolvera na stan docsCheck', () => {
    const resolved = (files, extra = {}) => ({
        status: 'RESOLVED', platform: 'ezamowienia', sourceUrl: 'https://ezamowienia.gov.pl/x', files, excluded: [], fingerprint: 'f', ...extra
    });
    const file = (publishedAt) => ({ path: 'a.pdf', url: 'u', platformFileId: 'id', ...(publishedAt && { publishedAt }) });

    it('RESOLVED: dostępne, z liczbą plików i datą najnowszego', () => {
        const outcome = outcomeFromResult(resolved([file('2026-11-06T08:00:00'), file('2026-11-06T09:30:00'), file()], { noticePublishedAt: '2026-11-06T07:00:00Z' }));
        assert.deepEqual(outcome, {
            state: 'available', platform: 'ezamowienia', sourceUrl: 'https://ezamowienia.gov.pl/x', fileCount: 3,
            newestFileAt: '2026-11-06T09:30:00', noticePublishedAt: '2026-11-06T07:00:00Z'
        });
    });

    it('RESOLVED bez dat plików nie ma newestFileAt (bez pól undefined)', () => {
        const outcome = outcomeFromResult(resolved([file()]));
        assert.equal('newestFileAt' in outcome, false);
        assert.equal(outcome.fileCount, 1);
    });

    it('NO_DOCUMENTS_YET to none z platformą, PROFILE_NOT_MATCHED to profile', () => {
        assert.deepEqual(outcomeFromResult({ status: 'NO_DOCUMENTS_YET', note: 'n', platform: 'ezamowienia', sourceUrl: 's' }), { state: 'none', platform: 'ezamowienia', sourceUrl: 's' });
        assert.deepEqual(outcomeFromResult({ status: 'PROFILE_NOT_MATCHED', note: 'n', sourceUrl: 'p' }), { state: 'profile', sourceUrl: 'p' });
    });

    it('platforma nieobsługiwana i brak adresu to unsupported', () => {
        assert.equal(outcomeFromResult({ status: 'UNSUPPORTED_PLATFORM', note: 'n', sourceUrl: 'x' }).state, 'unsupported');
        assert.equal(outcomeFromResult({ status: 'NO_SOURCE_URL', note: 'n' }).state, 'unsupported');
    });

    it('stany końcowe: tylko none i error są ponawiane', () => {
        assert.deepEqual(['none', 'error', 'available', 'unsupported', 'profile'].map(isTerminalState), [false, false, true, true, true]);
        assert.equal(errorOutcome().state, 'error');
    });

    it('outcomeChanged reaguje na widoczne pola, nie na daty publikacji ogłoszenia', () => {
        const base = { state: 'none', platform: 'ezamowienia', sourceUrl: 's' };
        assert.equal(outcomeChanged(undefined, base), true);
        assert.equal(outcomeChanged({ ...base }, { ...base }), false);
        assert.equal(outcomeChanged(base, { ...base, noticePublishedAt: 'x' }), false);
        assert.equal(outcomeChanged(base, { ...base, state: 'available', fileCount: 2 }), true);
    });
});
