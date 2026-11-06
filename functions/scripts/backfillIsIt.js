// Uzupełnia (lub przelicza) flagę `isIT` w istniejących przetargach. Odświeżanie nie nadpisuje przetargów,
// więc skrypt trzeba uruchomić po wdrożeniu flagi oraz po każdej zmianie listy kodów IT (functions/tenders/itCpvCodes.ts).
// Zmienia wyłącznie pole `isIT`, i tylko tam, gdzie brakuje go lub różni się od wyniku z `cpvCodes`.
//
// Domyślnie tylko podsumowuje, co by zmienił. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillIsIt.js <projectId> [--apply]
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`).
const admin = require('firebase-admin');
const { isItTender } = require('../lib/tenders/itCpvCodes.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillIsIt.js <projectId> [--apply]');
  process.exit(1);
}

admin.initializeApp({ projectId });
const db = admin.firestore();
const BATCH_SIZE = 400;

const run = async () => {
  const docs = (await db.collection('tenders').get()).docs;
  const toUpdate = [];
  let it = 0;
  for (const doc of docs) {
    const expected = isItTender(Array.isArray(doc.data().cpvCodes) ? doc.data().cpvCodes : []);
    if (expected) it++;
    if (doc.data().isIT !== expected) toUpdate.push({ ref: doc.ref, isIT: expected });
  }
  console.log(`Przetargów: ${docs.length}, w tym IT: ${it}, do zmiany: ${toUpdate.length}`);
  if (!apply) {
    console.log('To był podgląd. Dodaj --apply, aby zapisać.');
    return;
  }
  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    const batch = db.batch();
    toUpdate.slice(i, i + BATCH_SIZE).forEach(({ ref, isIT }) => batch.update(ref, { isIT }));
    await batch.commit();
  }
  console.log(`Zapisano: ${toUpdate.length}`);
};

run().catch((error) => { console.error(error); process.exit(1); });
