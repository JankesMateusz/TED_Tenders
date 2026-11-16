// Uruchomienie: node --test db/import/normalize.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { buyerDedupeKey, cleanDisplay, companyKey, contactIdentity, normalizeStreet, normalizeText, splitZip } from './normalize.mjs';

test('warianty zapisu spółki z o.o. dają ten sam klucz', () => {
    const variants = [
        'Zakład Wodociągów i Kanalizacji Sp. z o.o.',
        'Zakład Wodociągów i Kanalizacji sp. z o.o.',
        'Zakład Wodociągów i Kanalizacji Sp. z o. o.',
        'Zakład Wodociągów i Kanalizacji Sp. z o .o.',
        'Zakład Wodociągów i Kanalizacji Sp. z o.o',
    ];
    assert.equal(new Set(variants.map(normalizeText)).size, 1);
});

test('cudzysłowy i literówka w znaku diakrytycznym nie rozdzielają nazw', () => {
    assert.equal(
        normalizeText('Miejski Ośrodek "Bystrzyca" w Lublinie'),
        normalizeText('Miejski Ośrodek „Bystrzyca” w Lublinie')
    );
    assert.equal(normalizeText('Zespoł Szkół'), normalizeText('Zespół Szkół'));
});

test('przedrostki ulic są pomijane, a numer domu zostaje', () => {
    assert.equal(normalizeStreet('ul. Marszałka Józefa Piłsudskiego 40'), normalizeStreet('Marszałka Józefa Piłsudskiego 40'));
    assert.notEqual(normalizeStreet('Długa 5'), normalizeStreet('Długa 6'));
});

test('splitZip rozdziela kod pocztowy i miejscowość', () => {
    assert.deepEqual(splitZip('63-304 Czermin'), { zip: '63-304', rest: 'Czermin' });
    assert.deepEqual(splitZip('70-421'), { zip: '70-421', rest: null });
    assert.deepEqual(splitZip('brak kodu'), { zip: 'brak kodu', rest: null });
    assert.deepEqual(splitZip(undefined), { zip: null, rest: null });
});

test('klucz zamawiającego rozróżnia jednostki o tej samej nazwie w różnych miejscach', () => {
    const a = buyerDedupeKey({ name: 'Przedsiębiorstwo Wodociągów Sp. z o.o.', zip: '10-001', street: 'ul. Długa 1' });
    const b = buyerDedupeKey({ name: 'Przedsiębiorstwo Wodociągów sp. z o.o.', zip: '20-002', street: 'Krótka 2' });
    const c = buyerDedupeKey({ name: 'Przedsiębiorstwo Wodociągów sp. z o.o.', zip: '10-001', street: 'Długa 1' });
    assert.notEqual(a, b);
    assert.equal(a, c);
});

test('tożsamość kontaktu ignoruje wielkość liter i otaczające spacje, ale nie diakrytyki', () => {
    assert.equal(contactIdentity({ name: ' Jan Kowalski ', email: 'JAN@X.PL' }), contactIdentity({ name: 'jan kowalski', email: 'jan@x.pl' }));
    assert.notEqual(contactIdentity({ name: 'Łukasz', email: 'a@x.pl' }), contactIdentity({ name: 'Lukasz', email: 'a@x.pl' }));
    assert.equal(contactIdentity({}), '|');
});

test('companyKey i cleanDisplay', () => {
    assert.equal(companyKey('  Web-Profit   Maciej Kuźlik '), 'web profit maciej kuzlik');
    assert.equal(cleanDisplay('  a   b '), 'a b');
    assert.equal(cleanDisplay('   '), null);
});
