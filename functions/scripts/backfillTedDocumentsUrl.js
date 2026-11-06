// Uzupełnia `documentsUrl` w przetargach z TED, które go nie mają, bo wcześniejszy mapper odrzucał adresy bez `https://`
// (np. TED zwraca `www.dzp.agh.edu.pl`). Odświeżanie nie nadpisuje istniejących przetargów, więc skrypt pobiera pole
// `document-url-lot` z TED od nowa i zapisuje tylko tam, gdzie wychodzi poprawny adres. Przetargom, które miały już wynik
// sprawdzania dokumentów bez adresu (`docsCheck.state` = `unsupported` bez `sourceUrl`), czyści `docsCheck`, żeby
// kolejne sprawdzenie (np. przycisk „Sprawdź dokumenty" w panelu admina) objęło je ponownie.
//
// Domyślnie tylko podsumowuje, co by zmienił. Zapis wymaga `--apply`.
//   npm --prefix functions run build
//   node functions/scripts/backfillTedDocumentsUrl.js <projectId> [--apply]
// Wymaga poświadczeń Admin SDK (`gcloud auth application-default login`). Zapytania do TED są publiczne, bez klucza.
const admin = require('firebase-admin');
const axios = require('axios');
const { extractDocumentsUrl } = require('../lib/tenders/ted.js');

const [projectId, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');
if (!projectId) {
  console.error('Użycie: node functions/scripts/backfillTedDocumentsUrl.js <projectId> [--apply]');
  process.exit(1);
}

admin.initializeApp({ projectId });
const db = admin.firestore();
const TED_API_URL = process.env.TED_API_URL ?? 'https://api.ted.europa.eu/v3/notices/search';
const CHUNK = 100;

const fetchDocumentUrls = async (publicationNumbers) => {
  const response = await axios.post(
    TED_API_URL,
    { query: `publication-number IN (${publicationNumbers.join(' ')})`, fields: ['publication-number', 'document-url-lot'], limit: CHUNK },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
  );
  return new Map((response.data?.notices ?? []).map((notice) => [notice['publication-number'], extractDocumentsUrl(notice['document-url-lot'])]));
};

const run = async () => {
  const docs = (await db.collection('tenders').where('source', '==', 'TED').get()).docs.filter((doc) => !doc.data().documentsUrl);
  console.log(`Przetargów TED bez documentsUrl: ${docs.length}`);

  const updates = [];
  for (let i = 0; i < docs.length; i += CHUNK) {
    const chunk = docs.slice(i, i + CHUNK);
    const urls = await fetchDocumentUrls(chunk.map((doc) => doc.data().publicationNumber));
    for (const doc of chunk) {
      const url = urls.get(doc.data().publicationNumber);
      if (url) updates.push({ ref: doc.ref, url, resetCheck: doc.data().docsCheck?.state === 'unsupported' && !doc.data().docsCheck.sourceUrl });
    }
  }
  console.log(`Do uzupełnienia: ${updates.length}, w tym ze skasowaniem wyniku sprawdzania: ${updates.filter((u) => u.resetCheck).length}`);
  if (!apply) {
    console.log('To był podgląd. Dodaj --apply, aby zapisać.');
    return;
  }

  for (let i = 0; i < updates.length; i += 400) {
    const batch = db.batch();
    for (const { ref, url, resetCheck } of updates.slice(i, i + 400)) {
      batch.update(ref, { documentsUrl: url, ...(resetCheck && { docsCheck: admin.firestore.FieldValue.delete() }) });
    }
    await batch.commit();
  }
  console.log(`Zapisano: ${updates.length}`);
};

run().catch((error) => { console.error(error); process.exit(1); });
