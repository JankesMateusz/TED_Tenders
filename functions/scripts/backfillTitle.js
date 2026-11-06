// Jednorazowo skraca tytuły zapisanych przetargów z TED ("Polska – Serwery – Tytuł" -> "Tytuł"), tak jak robi to teraz
// `refreshTenders` dla nowych przetargów (w `tenders` i w gwiazdkach użytkowników).
//
// Rusza tylko tytuły w starym formacie: pierwszy człon musi być równy zapisanemu krajowi dokumentu. Dzięki temu
// ponowne uruchomienie jest bezpieczne i nie ucina tytułów, które już są skrócone, a same zawierają myślniki.
//
// Domyślnie tylko wypisuje, co by zmieniono. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillTitle.js <projectId> [--apply]
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`).
const admin = require('firebase-admin');
const { stripTitlePrefix } = require('../lib/tenders/ted.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillTitle.js <projectId> [--apply]');
  process.exit(1);
}

admin.initializeApp({ projectId });
const db = admin.firestore();

const TITLE_SEPARATOR = ' – ';
const DEFAULT_COUNTRY = 'Polska';
const WRITE_BATCH_SIZE = 400;

const chunk = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
};

/** Nowy tytuł albo null, gdy dokument nie jest w starym formacie ("Kraj – Kategoria – Tytuł") lub nic by się nie zmieniło. */
const newTitleFor = (data) => {
  if (typeof data.title !== 'string') return null;
  const firstPart = data.title.split(TITLE_SEPARATOR)[0];
  if (firstPart !== (data.country ?? DEFAULT_COUNTRY)) return null;
  const stripped = stripTitlePrefix(data.title);
  return stripped !== data.title ? stripped : null;
};

const run = async () => {
  const tenderDocs = (await db.collection('tenders').where('source', '==', 'TED').get()).docs;

  const favoriteDocs = [];
  for (const user of await db.collection('users').listDocuments()) {
    const favorites = await user.collection('favorites').where('source', '==', 'TED').get();
    favoriteDocs.push(...favorites.docs);
  }

  const updates = [...tenderDocs, ...favoriteDocs]
    .map((doc) => ({ ref: doc.ref, from: doc.data().title, title: newTitleFor(doc.data()) }))
    .filter((update) => update.title !== null);

  console.log(`Przetargi z TED: ${tenderDocs.length}, gwiazdki z TED: ${favoriteDocs.length}`);
  console.log(`Do skrócenia: ${updates.length}, bez zmian: ${tenderDocs.length + favoriteDocs.length - updates.length}`);
  for (const { from, title } of updates.slice(0, 5)) console.log(`  "${from}"\n    -> "${title}"`);

  if (!apply) {
    console.log('Tryb próbny, nic nie zapisano. Dodaj --apply, żeby zapisać.');
    return;
  }
  for (const part of chunk(updates, WRITE_BATCH_SIZE)) {
    const batch = db.batch();
    for (const { ref, title } of part) batch.update(ref, { title });
    await batch.commit();
  }
  console.log(`Zapisano ${updates.length} dokumentów.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
