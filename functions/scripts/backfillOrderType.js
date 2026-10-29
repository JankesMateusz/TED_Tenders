// Jednorazowo uzupełnia `orderType` w zapisanych przetargach z TED (w `tenders` i w gwiazdkach
// użytkowników), które powstały, zanim aplikacja zaczęła czytać `contract-nature`. Rodzaj pobiera z TED
// i ustala tą samą funkcją co `refreshTenders`. Przetargi, których TED już nie zwraca, zostają bez zmian.
//
// Domyślnie tylko wypisuje, co by zmieniono. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillOrderType.js <projectId> [--apply]
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`).
const admin = require('firebase-admin');
const axios = require('axios');
const { mapTedNotice } = require('../lib/tenders/ted.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillOrderType.js <projectId> [--apply]');
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

/** Rodzaj zamówienia z TED dla podanych numerów ogłoszeń: Map(numer -> 'Delivery' | 'Services' | 'Works'). */
const fetchOrderTypes = async (publicationNumbers) => {
  const orderTypes = new Map();
  for (const numbers of chunk(publicationNumbers, BATCH_SIZE)) {
    const response = await axios.post(
      TED_API_URL,
      { query: `publication-number IN (${numbers.join(' ')})`, fields: ['publication-number', 'contract-nature'], page: 1, limit: BATCH_SIZE },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    for (const notice of response.data.notices ?? []) {
      // Dla ogłoszeń zmieniających mapper zwraca null; takie nie trafiają do aplikacji
      const record = mapTedNotice(notice, '1970-01-01');
      if (record && record.orderType) orderTypes.set(record.publicationNumber, record.orderType);
    }
  }
  return orderTypes;
};

const writeUpdates = async (updates) => {
  for (const part of chunk(updates, WRITE_BATCH_SIZE)) {
    const batch = db.batch();
    for (const { ref, orderType } of part) batch.update(ref, { orderType });
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

  const missing = [...tenderDocs, ...favoriteDocs].filter((doc) => !doc.data().orderType);
  const numbers = [...new Set(missing.map((doc) => doc.data().publicationNumber))];
  console.log(`Przetargi z TED: ${tenderDocs.length}, gwiazdki z TED: ${favoriteDocs.length}, bez rodzaju: ${missing.length}`);

  const orderTypes = await fetchOrderTypes(numbers);
  const updates = missing
    .filter((doc) => orderTypes.has(doc.data().publicationNumber))
    .map((doc) => ({ ref: doc.ref, orderType: orderTypes.get(doc.data().publicationNumber) }));

  const counts = {};
  for (const { orderType } of updates) counts[orderType] = (counts[orderType] ?? 0) + 1;
  console.log(`TED zwrócił rodzaj dla ${updates.length} z ${missing.length} dokumentów:`, counts);
  console.log(`Bez zmian (brak w TED): ${missing.length - updates.length}`);

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
