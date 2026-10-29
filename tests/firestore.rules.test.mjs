// Testy reguł Firestore. Uruchamiane na emulatorze: npm run test:rules
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

    it('zalogowany bez roli nie czyta nawet własnego profilu', async () => {
        await assertFails(getDoc(doc(dbFor('member1', {}), 'users/member1')));
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

    it('nieznana rola nie daje dostępu', async () => {
        await assertFails(getDoc(doc(dbFor('member1', { role: 'guest' }), 'users/member1')));
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

    it('niezalogowany i konto bez roli nie czytają przetargów', async () => {
        await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'tenders/TED_1')));
        await assertFails(getDoc(doc(dbFor('plain1', {}), 'tenders/TED_1')));
    });

    it('nikt nie zapisuje przetargów z klienta', async () => {
        await assertFails(setDoc(doc(dbFor('member1', { role: 'member' }), 'tenders/TED_2'), { title: 'x' }));
        await assertFails(setDoc(doc(dbFor('admin1', { role: 'admin' }), 'tenders/TED_1'), { title: 'x' }));
    });
});

describe('pozostałe kolekcje', () => {
    it('są zablokowane dla każdej roli, także blokada odświeżania', async () => {
        await assertFails(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'meta/refreshLock')));
        await assertFails(setDoc(doc(dbFor('member1', { role: 'member' }), 'meta/refreshLock'), { a: 1 }));
        await assertFails(getDoc(doc(dbFor('admin1', { role: 'admin' }), 'inne/x')));
    });
});
