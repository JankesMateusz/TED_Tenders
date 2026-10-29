// Nadaje rolę admina użytkownikowi (tworzy konto, jeśli go nie ma). Służy do założenia
// pierwszego administratora. Kolejne osoby zaprasza admin z poziomu aplikacji.
//
// Emulatory (uruchomione przez `npm run emulators`):
//   node functions/scripts/setAdmin.js <projectId> <email> <hasło>
// Prawdziwy projekt wymaga poświadczeń Admin SDK (GOOGLE_APPLICATION_CREDENTIALS
// lub `gcloud auth application-default login`) i nie przyjmuje hasła z argumentu.
const admin = require('firebase-admin');

const [projectId, email, password] = process.argv.slice(2);
if (!projectId || !email) {
  console.error('Użycie: node functions/scripts/setAdmin.js <projectId> <email> [hasło, tylko emulator]');
  process.exit(1);
}

const usingEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST);
if (usingEmulator) {
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
} else if (password) {
  console.error('Hasło można podać tylko dla emulatora. Na prawdziwym projekcie ustaw je linkiem z panelu admina.');
  process.exit(1);
}

admin.initializeApp({ projectId });

const run = async () => {
  let user;
  try {
    user = await admin.auth().getUserByEmail(email);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
    user = await admin.auth().createUser({ email, ...(password ? { password } : {}) });
    console.log(`Utworzono konto ${email}`);
  }

  await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
  await admin.firestore().doc(`users/${user.uid}`).set(
    { email, role: 'admin', createdAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log(`Użytkownik ${email} (${user.uid}) jest teraz administratorem.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
