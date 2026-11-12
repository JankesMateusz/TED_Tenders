// Testy czystej logiki zdarzeń do podsumowania „od ostatniej wizyty”. Wymagają zbudowanych funkcji: npm run test:unit
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';
import { docsEvent, statusEvent } from '../functions/lib/notifications/events.js';

const { Timestamp } = createRequire(new URL('../functions/package.json', import.meta.url))('firebase-admin/firestore');

const at = Timestamp.fromMillis(1_800_000_000_000);
const tender = (over = {}) => ({ title: 'Laptopy', status: 'toEnter', statusBy: 'u1', statusByEmail: 'a@b.pl', statusAt: at, ...over });

describe('statusEvent', () => {
    it('zmiana statusu daje zdarzenie z autorem i identyfikatorem zależnym od czasu', () => {
        const event = statusEvent('T1', { status: undefined }, tender());
        assert.equal(event.id, 'status_T1_1800000000000');
        assert.deepEqual(event.data, {
            type: 'status_changed', tenderId: 'T1', title: 'Laptopy', actorUid: 'u1', actorEmail: 'a@b.pl', status: 'toEnter'
        });
    });

    it('ten sam status, zdjęcie statusu i brak dokumentu nie dają zdarzenia', () => {
        assert.equal(statusEvent('T1', tender(), tender({ labels: ['simple'] })), null);
        assert.equal(statusEvent('T1', tender(), { title: 'Laptopy' }), null);
        assert.equal(statusEvent('T1', tender(), undefined), null);
    });
});

describe('docsEvent', () => {
    const withDocs = (state) => ({ title: 'Serwery', docsCheck: { state } });

    it('pierwsze przejście na „available” daje zdarzenie, także z błędu i z „none”', () => {
        for (const before of [undefined, withDocs('none'), withDocs('error')]) {
            const event = docsEvent('T2', before, withDocs('available'));
            assert.equal(event.id, 'docs_T2');
            assert.equal(event.data.type, 'docs_available');
        }
    });

    it('brak zmiany albo inny stan końcowy nie dają zdarzenia', () => {
        assert.equal(docsEvent('T2', withDocs('available'), withDocs('available')), null);
        assert.equal(docsEvent('T2', withDocs('none'), withDocs('profile')), null);
    });
});
