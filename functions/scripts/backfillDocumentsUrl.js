// Jednorazowo uzupełnia `documentsUrl` (adres dokumentacji od zamawiającego) w zapisanych przetargach z TED
// (w `tenders` i w gwiazdkach użytkowników), które powstały, zanim aplikacja zaczęła czytać `document-url-lot`.
// Adres pobiera z TED i ustala tą samą funkcją co `refreshTenders`. Przetargi, których TED już nie zwraca,
// oraz te, w których zamawiający nie podał adresu, zostają bez zmian.
//
// Domyślnie tylko wypisuje, co by zmieniono. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillDocumentsUrl.js <projectId> [--apply]
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`).
const admin = require('firebase-admin');
const axios = require('axios');
const { extractDocumentsUrl } = require('../lib/tenders/ted.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillDocumentsUrl.js <projectId> [--apply]');
  process.exit(1);
}

admin.initializeApp({ projectId });
const db = admin.firestore();

const TED_API_URL = 'https://api.ted.europa.eu/v3/notices/search';
const BATCH_SIZE = 100;
const WRITE_BATCH_SIZE = 400;

const chunk = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
};

/** Adresy dokumentacji z TED dla podanych numerów ogłoszeń: Map(numer -> adres). Bez wpisu, gdy zamawiający adresu nie podał. */
const fetchDocumentsUrls = async (publicationNumbers) => {
  const urls = new Map();
  for (const numbers of chunk(publicationNumbers, BATCH_SIZE)) {
    const response = await axios.post(
      TED_API_URL,
      { query: `publication-number IN (${numbers.join(' ')})`, fields: ['publication-number', 'document-url-lot'], page: 1, limit: BATCH_SIZE },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    for (const notice of response.data.notices ?? []) {
      const url = extractDocumentsUrl(notice['document-url-lot']);
      if (url) urls.set(notice['publication-number'], url);
    }
  }
  return urls;
};

const writeUpdates = async (updates) => {
  for (const part of chunk(updates, WRITE_BATCH_SIZE)) {
    const batch = db.batch();
    for (const { ref, documentsUrl } of part) batch.update(ref, { documentsUrl });
    await batch.commit();
  }
};

const run = async () => {
  const tenderDocs = (await db.collection('tenders').where('source', '==', 'TED').get()).docs;

  const favoriteDocs = [];
  for (const user of await db.collection('users').listDocuments()) {
    const favorites = await user.collection('favorites').where('source', '==', 'TED').get();
    favoriteDocs.push(...favorites.docs);
  }

  const missing = [...tenderDocs, ...favoriteDocs].filter((doc) => !doc.data().documentsUrl);
  const numbers = [...new Set(missing.map((doc) => doc.data().publicationNumber))];
  console.log(`Przetargi z TED: ${tenderDocs.length}, gwiazdki z TED: ${favoriteDocs.length}, bez adresu dokumentacji: ${missing.length}`);

  const urls = await fetchDocumentsUrls(numbers);
  const updates = missing
    .filter((doc) => urls.has(doc.data().publicationNumber))
    .map((doc) => ({ ref: doc.ref, documentsUrl: urls.get(doc.data().publicationNumber) }));

  console.log(`TED zwrócił adres dokumentacji dla ${updates.length} z ${missing.length} dokumentów.`);
  console.log(`Bez zmian (brak w TED lub zamawiający nie podał adresu): ${missing.length - updates.length}`);

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
