// Jednorazowo uzupełnia `documentsUrl` (adres dokumentacji od zamawiającego) i `referenceNumber` (numer referencyjny sprawy) w zapisanych przetargach z TED
// (w `tenders` i w gwiazdkach użytkowników), które powstały, zanim aplikacja zaczęła czytać `document-url-lot`.
// Adres pobiera z TED i ustala tą samą funkcją co `refreshTenders`. Przetargi, których TED już nie zwraca,
// oraz te, w których zamawiający nie podał adresu, zostają bez zmian.
//
// Domyślnie tylko wypisuje, co by zmieniono. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillDocumentsUrl.js <projectId> [--apply] [--today]
// `--today` ogranicza zakres do przetargów opublikowanych dziś (czas warszawski) i gwiazdek z ich numerami.
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`).
const admin = require('firebase-admin');
const axios = require('axios');
const { extractDocumentsUrl, extractReferenceNumber } = require('../lib/tenders/ted.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
const onlyToday = flags.includes('--today');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillDocumentsUrl.js <projectId> [--apply] [--today]');
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

/** Dane z TED dla podanych numerów ogłoszeń: Map(numer -> { documentsUrl?, referenceNumber? }). Pola, których TED nie zwrócił, są pominięte. */
const fetchTedData = async (publicationNumbers) => {
  const data = new Map();
  for (const numbers of chunk(publicationNumbers, BATCH_SIZE)) {
    const response = await axios.post(
      TED_API_URL,
      { query: `publication-number IN (${numbers.join(' ')})`, fields: ['publication-number', 'document-url-lot', 'internal-identifier-proc'], page: 1, limit: BATCH_SIZE },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    for (const notice of response.data.notices ?? []) {
      const documentsUrl = extractDocumentsUrl(notice['document-url-lot']);
      const referenceNumber = extractReferenceNumber(notice['internal-identifier-proc']);
      data.set(notice['publication-number'], {
        ...(documentsUrl && { documentsUrl }),
        ...(referenceNumber && { referenceNumber }),
      });
    }
  }
  return data;
};

const writeUpdates = async (updates) => {
  for (const part of chunk(updates, WRITE_BATCH_SIZE)) {
    const batch = db.batch();
    for (const { ref, fields } of part) batch.update(ref, fields);
    await batch.commit();
  }
};

const run = async () => {
  let tendersQuery = db.collection('tenders').where('source', '==', 'TED');
  if (onlyToday) {
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' }); // YYYY-MM-DD
    console.log(`Tylko przetargi opublikowane dziś (${today}).`);
    tendersQuery = tendersQuery.where('publicationDate', '==', today);
  }
  const tenderDocs = (await tendersQuery.get()).docs;
  const todayNumbers = new Set(tenderDocs.map((doc) => doc.data().publicationNumber));

  const favoriteDocs = [];
  for (const user of await db.collection('users').listDocuments()) {
    const favorites = await user.collection('favorites').where('source', '==', 'TED').get();
    favoriteDocs.push(...favorites.docs.filter((doc) => !onlyToday || todayNumbers.has(doc.data().publicationNumber)));
  }

  const lacks = (doc) => !doc.data().documentsUrl || !doc.data().referenceNumber;
  const missing = [...tenderDocs, ...favoriteDocs].filter(lacks);
  const numbers = [...new Set(missing.map((doc) => doc.data().publicationNumber))];
  console.log(`Przetargi z TED: ${tenderDocs.length}, gwiazdki z TED: ${favoriteDocs.length}, bez adresu dokumentacji lub numeru referencyjnego: ${missing.length}`);

  const tedData = await fetchTedData(numbers);
  const updates = missing
    .map((doc) => {
      const found = tedData.get(doc.data().publicationNumber) ?? {};
      const fields = {};
      if (!doc.data().documentsUrl && found.documentsUrl) fields.documentsUrl = found.documentsUrl;
      if (!doc.data().referenceNumber && found.referenceNumber) fields.referenceNumber = found.referenceNumber;
      return { ref: doc.ref, fields };
    })
    .filter(({ fields }) => Object.keys(fields).length > 0);

  console.log(`TED zwrócił nowe dane dla ${updates.length} z ${missing.length} dokumentów.`);
  console.log(`Bez zmian (brak w TED lub zamawiający nie podał danych): ${missing.length - updates.length}`);

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
