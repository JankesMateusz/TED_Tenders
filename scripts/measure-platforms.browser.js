/*
 * Pomiar: na jakich platformach leży dokumentacja przetargów IT z eZamówień.
 * Kontekst i cel: docs/research-dokumentacja-przetargow.md (sekcje 5 i 13, pytanie 2).
 *
 * JAK URUCHOMIĆ (to skrypt do konsoli PRZEGLĄDARKI, nie do Node'a):
 *   1. Otwórz https://ezamowienia.gov.pl/mo-client-board/bzp/list (musi być ten origin,
 *      inaczej przeglądarka zablokuje zapytania przez CORS).
 *   2. Otwórz konsolę (F12), wklej CAŁY plik i naciśnij Enter.
 *   3. Poczekaj. Postęp widać w konsoli; 100 ogłoszeń to ok. 1-2 minuty.
 *   Wynik: tabela w konsoli + JSON w window.__platformMeasurement (kopiuj: copy(JSON.stringify(window.__platformMeasurement))).
 *
 * Skrypt tylko czyta (GET), po jednym zapytaniu naraz, z przerwą między zapytaniami.
 * Niczego nie pobiera z plików dokumentacji, tylko sprawdza listę dokumentów i pole 3.1.
 */
(async () => {
  // ---- Ustawienia ----
  const DATE_FROM = '2026-10-26'; // początek zakresu dat publikacji
  const DATE_TO = '2026-11-04'; //   koniec zakresu (włącznie)
  const TARGET_PER_TYPE = 40; //     tyle ogłoszeń IT zebrać z KAŻDEGO typu zamówienia (próbka nie jest zdominowana przez jeden typ)
  const MAX_PAGES_PER_TYPE = 150; // bezpiecznik (API zwraca 10 rekordów na stronę)
  const DELAY_MS = 250; //           przerwa między zapytaniami
  const ORDER_TYPES = ['Delivery', 'Services', 'Works'];

  // Kody CPV IT: kopia z functions/tenders/itCpvCodes.ts (dopasowanie dokładne, 8 cyfr bez cyfry kontrolnej).
  const IT_CPV = new Set([
    '30120000','30121000','30121100','30121200','30121300','30121400','30121430','30124000','30124500','30125110',
    '30192113','30192320','30200000','30210000','30211000','30211100','30211200','30211300','30211400','30211500',
    '30212000','30213000','30213100','30213200','30213300','30213400','30213500','30214000','30215000','30215100',
    '30216000','30216100','30216110','30216120','30216130','30216200','30216300','30220000','30221000','30230000',
    '30231000','30231100','30231200','30231300','30231310','30231320','30232000','30232100','30232110','30232120',
    '30232130','30232140','30232150','30232600','30232700','30233000','30233100','30233110','30233120','30233130',
    '30233131','30233132','30233140','30233141','30233150','30233160','30233170','30234000','30234500','30236000',
    '32250000','32322000','32323000','32323500','32330000','32420000','32500000','32550000','38520000','39162100',
    '39162110','42962000','48000000','48100000','48190000','48200000','48300000','48310000','48400000','48500000',
    '48600000','48700000','48770000','48800000','48820000','48821000','48822000','48823000','48824000','48825000',
    '48900000','50300000','50310000','50312000','50313000','50313200','50320000','50323100','50323200','50324000',
    '50330000','64212000','72100000','72110000','72120000','72130000','72263000','72268000','72610000',
  ]);

  const BASE = 'https://ezamowienia.gov.pl/';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const getJson = async (url) => {
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status} dla ${url}`);
    return res.json();
  };
  const getText = async (url) => {
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status} dla ${url}`);
    return res.text();
  };

  const isIt = (cpvString) =>
    (cpvString || '')
      .split(',')
      .some((part) => {
        const m = part.trim().match(/^(\d{8})/);
        return m !== null && IT_CPV.has(m[1]);
      });

  // ---- 1. Zbieranie ogłoszeń IT ----
  const notices = new Map(); // objectId -> ogłoszenie (deduplikacja)
  for (const orderType of ORDER_TYPES) {
    let collectedForType = 0;
    for (let page = 1; page <= MAX_PAGES_PER_TYPE && collectedForType < TARGET_PER_TYPE; page++) {
      const params = new URLSearchParams({
        noticeType: 'ContractNotice',
        isTenderAmountBelowEU: 'true',
        publicationDateFrom: DATE_FROM,
        publicationDateTo: DATE_TO,
        orderType,
        SortingColumnName: 'PublicationDate',
        SortingDirection: 'DESC',
        PageNumber: String(page),
        PageSize: '10',
      });
      let rows;
      try {
        rows = await getJson(`${BASE}mo-board/api/v1/Board/Search?${params}`);
      } catch (e) {
        console.warn(`Board/Search ${orderType} str. ${page}:`, e.message);
        break;
      }
      if (!Array.isArray(rows) || rows.length === 0) break;
      for (const row of rows) {
        if (collectedForType < TARGET_PER_TYPE && isIt(row.cpvCode) && !notices.has(row.objectId)) {
          notices.set(row.objectId, { ...row, orderType });
          collectedForType++;
        }
      }
      if (rows.length < 10) break;
      await sleep(DELAY_MS);
    }
    console.log(`${orderType}: zebrano ${collectedForType} ogłoszeń IT (razem ${notices.size})`);
  }

  // ---- 2. Dla każdego: pole 3.1 + lista dokumentów eZamówień ----
  const classify = (url) => {
    if (!url) return 'brak pola 3.1';
    let host;
    try {
      host = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
    } catch {
      return 'nieparsowalny adres';
    }
    if (host.endsWith('ezamowienia.gov.pl')) return 'eZamówienia';
    if (host.endsWith('platformazakupowa.pl')) return 'platformazakupowa.pl';
    if (host.endsWith('eb2b.com.pl')) return 'eb2b.com.pl';
    if (host.endsWith('ezamawiajacy.pl')) return 'ezamawiajacy.pl';
    if (host.endsWith('e-propublico.pl')) return 'e-propublico.pl';
    if (host.endsWith('logintrade.net')) return 'logintrade';
    return `inna: ${host}`;
  };

  const results = [];
  let done = 0;
  for (const notice of notices.values()) {
    const row = {
      noticeNumber: notice.noticeNumber,
      buyer: notice.organizationName,
      orderType: notice.orderType,
      // Tytuł i CPV zapisujemy, żeby ta sama próbka posłużyła do oceny wstępnego klasyfikatora (research, sekcja 14).
      title: notice.orderObject,
      cpv: notice.cpvCode,
      url31: null,
      platform: null,
      ezDocsCount: null,
      error: null,
    };
    try {
      const html = await getText(`${BASE}mo-board/api/v1/Board/GetNoticeHtmlBodyById?noticeId=${notice.objectId}`);
      const text = new DOMParser().parseFromString(html, 'text/html').body.textContent.replace(/\s+/g, ' ');
      const m = text.match(/3\.1\.?\)?\s*Adres strony internetowej prowadzonego post[ęe]powania\s*(\S+)/i);
      row.url31 = m ? m[1].replace(/[),.;]+$/, '') : null;
      row.platform = classify(row.url31);
      await sleep(DELAY_MS);

      // Lista dokumentów sprawdzana zawsze: pokazuje, czy eZamówienia faktycznie mają pliki,
      // także gdy pole 3.1 wskazuje inną platformę.
      if (notice.tenderId) {
        const docs = await getJson(`${BASE}mp-readmodels/api/Search/GetTenderDocuments?tenderId=${notice.tenderId}`);
        row.ezDocsCount = Array.isArray(docs) ? docs.filter((d) => d.tenderDocumentState === 'Published').length : null;
        await sleep(DELAY_MS);
      }
    } catch (e) {
      row.error = e.message;
    }
    results.push(row);
    if (++done % 10 === 0) console.log(`Przetworzono ${done}/${notices.size}`);
  }

  // ---- 3. Podsumowanie ----
  const counts = {};
  for (const r of results) {
    // Ogłoszenie z eZamówień bez opublikowanych plików liczymy osobno: tam przycisk by nie zadziałał.
    const key = r.error
      ? 'BŁĄD zapytania'
      : r.platform === 'eZamówienia' && r.ezDocsCount === 0
        ? 'eZamówienia, ale lista dokumentów pusta'
        : r.platform;
    counts[key] = (counts[key] || 0) + 1;
  }
  const summary = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([platforma, liczba]) => ({
      platforma,
      liczba,
      procent: `${((liczba / results.length) * 100).toFixed(0)}%`,
    }));

  // Rozkład platform osobno dla każdego typu zamówienia.
  const byType = {};
  for (const r of results) {
    byType[r.orderType] ??= {};
    byType[r.orderType][r.platform] = (byType[r.orderType][r.platform] || 0) + 1;
  }

  console.log(`Zakres dat: ${DATE_FROM}..${DATE_TO}, ogłoszeń IT: ${results.length}`);
  console.table(summary);
  console.log('Rozkład platform wg typu zamówienia:');
  console.log(JSON.stringify(byType, null, 2));
  console.log('Szczegóły (pierwsze 30):');
  console.table(results.slice(0, 30).map(({ title, cpv, ...rest }) => rest));
  window.__platformMeasurement = { dateFrom: DATE_FROM, dateTo: DATE_TO, summary, byType, results };
  console.log('Pełny wynik: window.__platformMeasurement. Skopiuj: copy(JSON.stringify(window.__platformMeasurement))');
})();
