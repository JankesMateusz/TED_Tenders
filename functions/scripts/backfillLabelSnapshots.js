// Jednorazowo kopiuje statusy już ustawionych przetargów do `labelSnapshots` (TT-13), żeby nie stracić ocen sprzed
// wdrożenia triggera. Tworzy tylko brakujące migawki; istniejących (np. z triggera) nie rusza.
//
// Domyślnie tylko wypisuje, co by zapisano. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillLabelSnapshots.js <projectId> [--apply]
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`).
const admin = require('firebase-admin');
const { buildInitialSnapshot, LABEL_SNAPSHOTS_COLLECTION } = require('../lib/labels/labelSnapshot.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillLabelSnapshots.js <projectId> [--apply]');
  process.exit(1);
}

admin.initializeApp({ projectId });
const db = admin.firestore();

const run = async () => {
  const tenders = (await db.collection('tenders').where('status', 'in', ['toEnter', 'entered', 'notToEnter', 'toClarify']).get()).docs;
  let created = 0;
  let skipped = 0;
  for (const doc of tenders) {
    const ref = db.collection(LABEL_SNAPSHOTS_COLLECTION).doc(doc.id);
    const snapshot = buildInitialSnapshot(doc.id, doc.data());
    if (!snapshot) continue;
    console.log(`${doc.id}: ${snapshot.status}`);
    if (!apply) { created++; continue; }
    try {
      await ref.create(snapshot); // create() nie nadpisze istniejącej migawki
      created++;
    } catch (error) {
      if (error.code === 6) skipped++; else throw error;
    }
  }
  console.log(`${apply ? 'Zapisano' : 'Do zapisu'}: ${created}, pominięto (już istnieją): ${skipped}, przetargów ze statusem: ${tenders.length}`);
  if (!apply) console.log('To był podgląd. Dodaj --apply, aby zapisać.');
};

run().catch((error) => { console.error(error); process.exit(1); });
