// Test integracyjny funkcji inviteUser na emulatorach. Uruchamiany przez: npm run test:functions
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { initializeApp } from 'firebase/app';
import {
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';

const PROJECT_ID = 'demo-tenders';
const ADMIN = { email: 'admin@example.com', password: 'secret123' };

const app = initializeApp({ apiKey: 'fake-key', projectId: PROJECT_ID, authDomain: `${PROJECT_ID}.firebaseapp.com` });
const auth = getAuth(app);
connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
const functions = getFunctions(app, 'europe-central2');
connectFunctionsEmulator(functions, '127.0.0.1', 5001);
const inviteUser = httpsCallable(functions, 'inviteUser');

const expectCode = async (promise, code) => {
    await assert.rejects(promise, (error) => {
        assert.equal(error.code, `functions/${code}`);
        return true;
    });
};

before(() => {
    // Zmienne emulatorów ustawia firebase emulators:exec
    execFileSync('node', ['functions/scripts/setAdmin.js', PROJECT_ID, ADMIN.email, ADMIN.password], {
        stdio: 'inherit'
    });
});

describe('inviteUser', () => {
    it('odrzuca niezalogowanego', async () => {
        await signOut(auth);
        await expectCode(inviteUser({ email: 'x@example.com' }), 'unauthenticated');
    });

    it('odrzuca zalogowanego bez roli admina', async () => {
        await createUserWithEmailAndPassword(auth, 'plain@example.com', 'secret123');
        await expectCode(inviteUser({ email: 'x@example.com' }), 'permission-denied');
    });

    it('admin zaprasza nową osobę i dostaje link', async () => {
        await signInWithEmailAndPassword(auth, ADMIN.email, ADMIN.password);
        await auth.currentUser.getIdToken(true);

        const { data } = await inviteUser({ email: '  New.Person@Example.com ' });
        assert.equal(data.email, 'new.person@example.com');
        assert.equal(data.role, 'member');
        assert.match(data.link, /^https?:\/\//);
    });

    it('ponowne zaproszenie daje nowy link i nie zmienia roli', async () => {
        const { data } = await inviteUser({ email: 'new.person@example.com' });
        assert.equal(data.role, 'member');
        assert.match(data.link, /^https?:\/\//);
    });

    it('zaproszenie admina nie obniża jego roli', async () => {
        const { data } = await inviteUser({ email: ADMIN.email });
        assert.equal(data.role, 'admin');
    });

    it('odrzuca nieprawidłowy adres email', async () => {
        await expectCode(inviteUser({ email: 'to-nie-jest-email' }), 'invalid-argument');
        await expectCode(inviteUser({}), 'invalid-argument');
    });
});
