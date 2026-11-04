// Jednorazowo uzupełnia `buyerSectorAuto` w zapisanych ogłoszeniach z Bazy Konkurencyjności (w `tenders` i w gwiazdkach
// użytkowników), które powstały, zanim aplikacja zaczęła klasyfikować zamawiających. Sektor ustala tą samą funkcją
// co `refreshTenders` (po nazwie zamawiającego), więc skrypt nie odpytuje żadnego zewnętrznego API.
//
// Domyślnie tylko wypisuje, co by zmieniono. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillBuyerSector.js <projectId> [--apply]
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`).
const admin = require('firebase-admin');
const { classifySector } = require('../lib/tenders/sector.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillBuyerSector.js <projectId> [--apply]');
  process.exit(1);
}

admin.initializeApp({ projectId });
const db = admin.firestore();

const SOURCE = 'BAZA_KONKURENCYJNOSCI';
const WRITE_BATCH_SIZE = 400;

const chunk = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
};

const writeUpdates = async (updates) => {
  for (const part of chunk(updates, WRITE_BATCH_SIZE)) {
    const batch = db.batch();
    for (const { ref, buyerSectorAuto } of part) batch.update(ref, { buyerSectorAuto });
    await batch.commit();
  }
};

const run = async () => {
  const tenderDocs = (await db.collection('tenders').where('source', '==', SOURCE).get()).docs;

  const favoriteDocs = [];
  for (const user of await db.collection('users').listDocuments()) {
    const favorites = await user.collection('favorites').where('source', '==', SOURCE).get();
    favoriteDocs.push(...favorites.docs);
  }

  const missing = [...tenderDocs, ...favoriteDocs].filter((doc) => doc.data().buyerSectorAuto === undefined);
  console.log(`Ogłoszenia z Bazy: ${tenderDocs.length}, gwiazdki z Bazy: ${favoriteDocs.length}, bez sektora: ${missing.length}`);

  const updates = missing.map((doc) => ({ ref: doc.ref, buyerSectorAuto: classifySector(doc.data().buyerName) }));
  const counts = {};
  for (const { buyerSectorAuto } of updates) counts[buyerSectorAuto] = (counts[buyerSectorAuto] ?? 0) + 1;
  console.log('Sektory do zapisania:', counts);

  if (!apply) {
    console.log('Tryb próbny, nic nie zapisano. Dodaj --apply, żeby zapisać.');
    return;
  }
  await writeUpdates(updates);
  console.log(`Zapisano ${updates.length} dokumentów.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
