// Testy reguł `events` i `userState`. Uruchamiane na emulatorze: npm run test:rules
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { Timestamp, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';

let env;

before(async () => {
    env = await initializeTestEnvironment({
        projectId: 'demo-rules-test',
        firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 }
    });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'events/e1'), { type: 'docs_available', tenderId: 'T1', createdAt: Timestamp.now() });
        await setDoc(doc(context.firestore(), 'userState/u1'), { lastSeenAt: Timestamp.now() });
    });
});

const dbFor = (uid) => env.authenticatedContext(uid, {}).firestore();

describe('events', () => {
    it('zalogowany czyta zdarzenia, niezalogowany nie', async () => {
        await assertSucceeds(getDocs(collection(dbFor('u1'), 'events')));
        await assertFails(getDocs(collection(env.unauthenticatedContext().firestore(), 'events')));
    });

    it('klient nie zapisuje zdarzeń', async () => {
        await assertFails(setDoc(doc(dbFor('u1'), 'events/e2'), { type: 'docs_available', createdAt: serverTimestamp() }));
    });
});

describe('userState', () => {
    it('właściciel zapisuje i czyta własne lastSeenAt', async () => {
        await assertSucceeds(setDoc(doc(dbFor('u1'), 'userState/u1'), { lastSeenAt: serverTimestamp() }));
        await assertSucceeds(getDoc(doc(dbFor('u1'), 'userState/u1')));
    });

    it('lastSeenAt musi być czasem serwera, a dokument nie może mieć innych pól', async () => {
        await assertFails(setDoc(doc(dbFor('u1'), 'userState/u1'), { lastSeenAt: Timestamp.fromMillis(1) }));
        await assertFails(setDoc(doc(dbFor('u1'), 'userState/u1'), { lastSeenAt: serverTimestamp(), extra: 1 }));
    });

    it('cudzy dokument jest niedostępny', async () => {
        await assertFails(getDoc(doc(dbFor('u2'), 'userState/u1')));
        await assertFails(setDoc(doc(dbFor('u2'), 'userState/u1'), { lastSeenAt: serverTimestamp() }));
    });
});
