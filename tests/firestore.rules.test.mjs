// Testy reguł Firestore. Uruchamiane na emulatorze: npm run test:rules
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import {
    Timestamp, collection, deleteDoc, deleteField, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where
} from 'firebase/firestore';

let env;

before(async () => {
    env = await initializeTestEnvironment({
        projectId: 'demo-rules-test',
        firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 }
    });
});

after(async () => {
    await env.cleanup();
});

beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'users/member1'), { email: 'member@example.com', role: 'member' });
        await setDoc(doc(db, 'users/member2'), { email: 'other@example.com', role: 'member' });
    });
});

const dbFor = (uid, claims) => env.authenticatedContext(uid, claims).firestore();

describe('users', () => {
    it('niezalogowany nie czyta profili', async () => {
        await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users/member1')));
    });

    it('zalogowany bez roli (tryb otwarty) czyta własny profil', async () => {
        await assertSucceeds(getDoc(doc(dbFor('member1', {}), 'users/member1')));
    });

    it('członek czyta własny profil', async () => {
        await assertSucceeds(getDoc(doc(dbFor('member1', { role: 'member' }), 'users/member1')));
    });

    it('członek nie czyta cudzego profilu', async () => {
        await assertFails(getDoc(doc(dbFor('member1', { role: 'member' }), 'users/member2')));
    });

    it('admin czyta wszystkie profile', async () => {
        await assertSucceeds(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'users/member2')));
    });

    it('nikt nie zapisuje profili z klienta, także admin', async () => {
        await assertFails(setDoc(doc(dbFor('admin1', { role: 'admin' }), 'users/member1'), { role: 'admin' }));
        await assertFails(setDoc(doc(dbFor('member1', { role: 'member' }), 'users/member1'), { role: 'admin' }));
    });

    it('nieznana rola nie daje uprawnień admina', async () => {
        await assertFails(getDoc(doc(dbFor('member1', { role: 'guest' }), 'users/member2')));
    });
});

describe('tenders', () => {
    beforeEach(async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'tenders/TED_1'), { title: 'Przetarg' });
        });
    });

    it('członek i admin czytają przetargi', async () => {
        await assertSucceeds(getDoc(doc(dbFor('member1', { role: 'member' }), 'tenders/TED_1')));
        await assertSucceeds(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'tenders/TED_1')));
    });

    it('niezalogowany nie czyta przetargów, konto bez roli (tryb otwarty) czyta', async () => {
        await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'tenders/TED_1')));
        await assertSucceeds(getDoc(doc(dbFor('plain1', {}), 'tenders/TED_1')));
    });

    it('nikt nie zapisuje przetargów z klienta', async () => {
        await assertFails(setDoc(doc(dbFor('member1', { role: 'member' }), 'tenders/TED_2'), { title: 'x' }));
        await assertFails(setDoc(doc(dbFor('admin1', { role: 'admin' }), 'tenders/TED_1'), { title: 'x' }));
    });
});

describe('wspólny status przetargu', () => {
    const member = { role: 'member', email: 'member@example.com' };
    const tenderRef = (db) => doc(db, 'tenders/TED_1');
    const statusFields = (overrides = {}) => ({
        status: 'toEnter',
        statusBy: 'member1',
        statusByEmail: 'member@example.com',
        statusAt: serverTimestamp(),
        ...overrides
    });

    beforeEach(async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'tenders/TED_1'), { title: 'Przetarg', buyerName: 'Urząd' });
        });
    });

    it('członek ustawia każdy z czterech statusów', async () => {
        for (const status of ['toEnter', 'entered', 'notToEnter', 'toClarify']) {
            await assertSucceeds(updateDoc(tenderRef(dbFor('member1', member)), statusFields({ status })));
        }
    });

    it('admin też może ustawić status', async () => {
        const admin = { role: 'admin', email: 'admin@example.com' };
        await assertSucceeds(updateDoc(tenderRef(dbFor('admin1', admin)), statusFields({
            statusBy: 'admin1',
            statusByEmail: 'admin@example.com'
        })));
    });

    it('członek zdejmuje status, także ustawiony przez kogoś innego', async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            await updateDoc(tenderRef(context.firestore()), {
                status: 'entered', statusBy: 'member2', statusByEmail: 'other@example.com', statusAt: new Date()
            });
        });
        await assertSucceeds(updateDoc(tenderRef(dbFor('member1', member)), {
            status: deleteField(), statusBy: deleteField(), statusByEmail: deleteField(), statusAt: deleteField()
        }));
    });

    it('zablokowana jest nieznana wartość statusu', async () => {
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), statusFields({ status: 'done' })));
    });

    it('zablokowane jest podszywanie się pod innego autora lub adres e-mail', async () => {
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), statusFields({ statusBy: 'member2' })));
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), statusFields({ statusByEmail: 'other@example.com' })));
    });

    it('zablokowany jest czas inny niż czas serwera', async () => {
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), statusFields({ statusAt: new Date('2020-01-01') })));
    });

    it('zablokowany jest niekompletny zestaw pól statusu', async () => {
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), { status: 'toEnter' }));
        await env.withSecurityRulesDisabled(async (context) => {
            await updateDoc(tenderRef(context.firestore()), {
                status: 'entered', statusBy: 'member1', statusByEmail: 'member@example.com', statusAt: new Date()
            });
        });
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), {
            status: deleteField(), statusBy: deleteField()
        }));
    });

    it('zablokowana jest zmiana innych pól razem ze statusem', async () => {
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), statusFields({ title: 'Podmieniony' })));
        await assertFails(updateDoc(tenderRef(dbFor('member1', member)), { title: 'Podmieniony' }));
    });

    it('niezalogowany nie ustawia statusu, a anonimowy ustawia go jako Gość', async () => {
        await assertSucceeds(updateDoc(tenderRef(dbFor('plain1', {})), statusFields({
            statusBy: 'plain1', statusByEmail: 'Gość'
        })));
        await assertFails(updateDoc(tenderRef(env.unauthenticatedContext().firestore()), statusFields()));
    });

    it('klient nie tworzy ani nie usuwa przetargów', async () => {
        await assertFails(setDoc(doc(dbFor('member1', member), 'tenders/TED_2'), statusFields()));
        await assertFails(deleteDoc(tenderRef(dbFor('admin1', { role: 'admin' }))));
    });
});

describe('ulubione (gwiazdki)', () => {
    const favorite = { title: 'Przetarg', publicationNumber: '1-2026' };

    it('właściciel zapisuje, czyta i usuwa własne gwiazdki', async () => {
        const ref = doc(dbFor('member1', { role: 'member' }), 'users/member1/favorites/TED_1');
        await assertSucceeds(setDoc(ref, favorite));
        await assertSucceeds(getDoc(ref));
        await assertSucceeds(deleteDoc(ref));
    });

    it('inny członek, nawet admin, nie czyta ani nie zapisuje cudzych gwiazdek', async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'users/member1/favorites/TED_1'), favorite);
        });
        const other = doc(dbFor('member2', { role: 'member' }), 'users/member1/favorites/TED_1');
        await assertFails(getDoc(other));
        await assertFails(setDoc(other, favorite));
        await assertFails(deleteDoc(other));
        await assertFails(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'users/member1/favorites/TED_1')));
    });

    it('niezalogowany nie ma dostępu do gwiazdek, a konto bez roli ma do własnych', async () => {
        await assertSucceeds(setDoc(doc(dbFor('member1', {}), 'users/member1/favorites/TED_1'), favorite));
        await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users/member1/favorites/TED_1')));
    });
});

describe('komentarze', () => {
    const member = { role: 'member', email: 'member@example.com' };
    const other = { role: 'member', email: 'other@example.com' };
    const DAY_MS = 24 * 60 * 60 * 1000;
    const comment = (overrides = {}) => ({
        tenderId: 'TED_1',
        publicationDate: '2026-10-28',
        text: 'Czy to obejmuje serwis?',
        authorUid: 'member1',
        authorEmail: 'member@example.com',
        createdAt: serverTimestamp(),
        expireAt: Timestamp.fromMillis(Date.now() + 30 * DAY_MS),
        ...overrides
    });

    beforeEach(async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            const db = context.firestore();
            await setDoc(doc(db, 'tenders/TED_1'), { title: 'Przetarg', publicationDate: '2026-10-28' });
            await setDoc(doc(db, 'comments/c1'), {
                ...comment(),
                createdAt: Timestamp.now()
            });
        });
    });

    it('członek dodaje komentarz do istniejącego przetargu', async () => {
        await assertSucceeds(setDoc(doc(dbFor('member1', member), 'comments/new1'), comment()));
        await assertSucceeds(setDoc(doc(dbFor('member2', other), 'comments/new2'), comment({ authorUid: 'member2', authorEmail: 'other@example.com' })));
    });

    it('członkowie czytają komentarze i zapytanie po zakresie dat', async () => {
        await assertSucceeds(getDoc(doc(dbFor('member2', other), 'comments/c1')));
        await assertSucceeds(getDocs(query(
            collection(dbFor('member2', other), 'comments'),
            where('publicationDate', '>=', '2026-10-01'),
            where('publicationDate', '<=', '2026-10-31')
        )));
    });

    it('niezalogowany nie czyta ani nie dodaje komentarzy, a anonimowy podpisuje się jako Gość', async () => {
        await assertSucceeds(getDoc(doc(dbFor('plain1', {}), 'comments/c1')));
        await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'comments/c1')));
        await assertSucceeds(setDoc(doc(dbFor('plain1', {}), 'comments/x'), comment({ authorUid: 'plain1', authorEmail: 'Gość' })));
        await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'comments/x'), comment()));
    });

    it('zablokowane jest podszywanie się pod innego autora lub adres e-mail', async () => {
        const db = dbFor('member1', member);
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ authorUid: 'member2' })));
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ authorEmail: 'other@example.com' })));
    });

    it('zablokowany jest komentarz do nieistniejącego przetargu lub z inną datą publikacji', async () => {
        const db = dbFor('member1', member);
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ tenderId: 'TED_404' })));
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ publicationDate: '2026-10-01' })));
    });

    it('zablokowany jest pusty, zbyt długi lub nietekstowy komentarz', async () => {
        const db = dbFor('member1', member);
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ text: '' })));
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ text: 'a'.repeat(1001) })));
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ text: 42 })));
        await assertSucceeds(setDoc(doc(db, 'comments/ok'), comment({ text: 'a'.repeat(1000) })));
    });

    it('zablokowany jest czas utworzenia inny niż czas serwera', async () => {
        await assertFails(setDoc(doc(dbFor('member1', member), 'comments/x'), comment({ createdAt: Timestamp.fromMillis(0) })));
    });

    it('wygaśnięcie musi być w przyszłości i nie dalej niż za 31 dni', async () => {
        const db = dbFor('member1', member);
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ expireAt: Timestamp.fromMillis(Date.now() - DAY_MS) })));
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ expireAt: Timestamp.fromMillis(Date.now() + 40 * DAY_MS) })));
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ expireAt: '2026-11-30' })));
    });

    it('zablokowane są brakujące i dodatkowe pola', async () => {
        const db = dbFor('member1', member);
        const { expireAt, ...withoutExpire } = comment();
        await assertFails(setDoc(doc(db, 'comments/x'), withoutExpire));
        await assertFails(setDoc(doc(db, 'comments/x'), comment({ pinned: true })));
    });

    it('komentarza nie można edytować, nawet własnego', async () => {
        await assertFails(updateDoc(doc(dbFor('member1', member), 'comments/c1'), { text: 'Zmiana' }));
        await assertFails(updateDoc(doc(dbFor('admin1', { role: 'admin' }), 'comments/c1'), { text: 'Zmiana' }));
    });

    it('autor usuwa własny komentarz, inni (także admin) cudzego nie', async () => {
        await assertFails(deleteDoc(doc(dbFor('member2', other), 'comments/c1')));
        await assertFails(deleteDoc(doc(dbFor('admin1', { role: 'admin', email: 'admin@example.com' }), 'comments/c1')));
        await assertSucceeds(deleteDoc(doc(dbFor('member1', member), 'comments/c1')));
    });
});

describe('refreshLog', () => {
    beforeEach(async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'refreshLog/2026-10-28'), { day: '2026-10-28', complete: true });
        });
    });

    it('członek i konto bez roli (tryb otwarty) czytają dziennik, niezalogowany nie', async () => {
        await assertSucceeds(getDoc(doc(dbFor('member1', { role: 'member' }), 'refreshLog/2026-10-28')));
        await assertSucceeds(getDoc(doc(dbFor('plain1', {}), 'refreshLog/2026-10-28')));
        await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'refreshLog/2026-10-28')));
    });

    it('nikt nie zapisuje dziennika z klienta', async () => {
        await assertFails(setDoc(doc(dbFor('admin1', { role: 'admin' }), 'refreshLog/2026-10-28'), { complete: false }));
        await assertFails(setDoc(doc(dbFor('member1', { role: 'member' }), 'refreshLog/2026-10-27'), { complete: true }));
    });
});

describe('pozostałe kolekcje', () => {
    it('są zablokowane dla każdej roli, także blokada odświeżania', async () => {
        await assertFails(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'meta/refreshLock')));
        await assertFails(setDoc(doc(dbFor('member1', { role: 'member' }), 'meta/refreshLock'), { a: 1 }));
        await assertFails(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'inne/x')));
    });
});

describe('presence', () => {
    const beat = (extra = {}) => ({
        lastSeen: serverTimestamp(),
        expireAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000),
        isAnonymous: true,
        ...extra
    });
    const anon = (uid) => dbFor(uid, { firebase: { sign_in_provider: 'anonymous' } });

    it('gość zapisuje własny puls', async () => {
        await assertSucceeds(setDoc(doc(anon('g1'), 'presence/g1'), beat()));
    });

    it('nie zapisuje cudzego pulsu', async () => {
        await assertFails(setDoc(doc(anon('g1'), 'presence/g2'), beat()));
    });

    it('nie podszywa się pod zalogowanego (isAnonymous musi zgadzać się z tokenem)', async () => {
        await assertFails(setDoc(doc(anon('g1'), 'presence/g1'), beat({ isAnonymous: false, email: 'a@example.com' })));
    });

    it('zalogowany zapisuje puls z własnym e-mailem, nie cudzym', async () => {
        const db = dbFor('m1', { role: 'member', email: 'm@example.com', firebase: { sign_in_provider: 'password' } });
        await assertSucceeds(setDoc(doc(db, 'presence/m1'), beat({ isAnonymous: false, email: 'm@example.com' })));
        await assertFails(setDoc(doc(db, 'presence/m1'), beat({ isAnonymous: false, email: 'x@example.com' })));
    });

    it('czas pulsu musi być czasem serwera, a wygaśnięcie najwyżej za 2 godziny', async () => {
        await assertFails(setDoc(doc(anon('g1'), 'presence/g1'), beat({ lastSeen: Timestamp.fromMillis(1) })));
        await assertFails(setDoc(doc(anon('g1'), 'presence/g1'), beat({ expireAt: Timestamp.fromMillis(Date.now() + 5 * 3600 * 1000) })));
    });

    it('odczyt tylko dla admina', async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'presence/g1'), beat());
        });
        await assertSucceeds(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'presence/g1')));
        await assertFails(getDoc(doc(dbFor('m1', { role: 'member' }), 'presence/g1')));
        await assertFails(getDoc(doc(anon('g1'), 'presence/g1')));
    });
});
