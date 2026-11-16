# Moduł Zamówień: plan realizacji

Stan na 2026-11-08. Dokument uzupełnia `docs/zamowienia/handoff.md` (stan prac, komendy, pułapki). Dokumentacja bazy, importu i funkcji odczytu jest w `db/README.md` i nie jest tu powielana.

## 1. Cel i zakres

Narzeczona użytkownika pracuje w firmie na desktopowej aplikacji (C++, SQL), w której wprowadza zamówienia publiczne (przetargi), a na koniec generuje raport w Excelu, wysyłany mailem klientom. Cel: **przenieść ten proces do aplikacji webowej** i go unowocześnić. Zakres docelowy:

1. Wprowadzanie danych: zamówienie, pozycje, zamawiający i osoby kontaktowe (PinC), pisma, wyniki rozstrzygnięć.
2. Raporty dla klientów: wycinki zamiast jednego, rosnącego w ciągu roku pliku Excel, eksport `.xlsx` w dotychczasowym układzie, feed klienta, automatyczne e-maile.
3. Statystyki (dziś 17 predefiniowanych zestawień) i baza zamawiających, zwycięzców i vendorów.
4. Integracja z listą przetargów (TED, eZamówienia, Baza Konkurencyjności) i z analizami dokumentacji (gałąź `integracja-analiza`).

To **POC**: pokazać, że można inaczej, i ewentualnie w przyszłości zintegrować z bazą firmy. Schematu bazy firmy nie znamy. Dane produkcyjne firmy (raport Excel) są poufne i zawierają dane osobowe urzędników.

Spójność z `docs/decyzja-backend-i-baza-danych.md`: tam rekomendowano „Firebase teraz, dane relacyjne od początku w schemacie relacyjnym za cienką warstwą dostępu". Moduł zamówień realizuje dokładnie ten wariant pośredni: Postgres dla danych relacyjnych, dostęp wyłącznie przez Cloud Functions, Firestore zostaje dla listy przetargów.

## 2. Ustalenia i ich uzasadnienie

| Decyzja | Uzasadnienie |
|---|---|
| **Postgres, nie Firestore** | Dane są silnie relacyjne (zamawiający → kontakty, zamówienie → pozycje → wyniki), potrzebne są agregacje (17 widoków statystyk) i raporty przekrojowe. Schemat zbliżony do tego, co prawdopodobnie ma firma. |
| **Lokalnie Docker, Neon później** | Konto Neon nie jest jeszcze założone. Wszystko budujemy na lokalnym kontenerze (`tenders-pg`). Neon preferowany nad Supabase, bo to czysty Postgres (Supabase dokłada własne Auth/RLS, kolidujące z Firebase Auth). Limity darmowych planów **nie były sprawdzone**. |
| **Przeglądarka nie łączy się z bazą** | Wszystko przez Cloud Functions (`onCall`) z `requireRole`. Adres bazy w sekrecie `ORDERS_DATABASE_URL`. |
| **`requireRole`, nie `requireMember`** | `requireMember` jest na `develop` tymczasowo otwarte (przepuszcza anonimów i konta bez roli). Funkcje zamówień zwracają kontakty urzędników. |
| **Usuwanie miękkie, brak kasowania fizycznego** | Stara aplikacja „wywalała się" po usunięciu pozycji z zapisanego przetargu (użytkowniczka boi się usuwać). Klucze obce `ON DELETE RESTRICT`, `deleted_at`, cofanie jednym kliknięciem, dziennik zmian. |
| **Identyfikatory bez znaczenia, numery z liczników** | Stara aplikacja ma „Usuń (najnowszy)", co sugeruje numerację „max+1" wrażliwą na usunięcia. U nas `next_mdp_number`, `next_position_number`, luki są dopuszczalne. |
| **Duplikaty zamawiających grupujemy, nie scalamy** | Duplikaty powstawały celowo (zmiana adresu, komórki urzędu zamawiające osobno, „dla pewności nowa pozycja"). Zamówienia zostają przy rekordzie historycznym, rekordy tej samej organizacji wskazują rekord główny (dziś kolumna `buyers.merged_into_id`). Decyzję podejmuje człowiek, zawsze odwracalnie. |
| **Import bez przeliczeń** | `Tender / part value` trafia 1:1 do `positions.part_value`. Reguły wartości dopiero po odpowiedziach użytkowniczki. |
| **Wszystkie zamówienia mają status `open`** | Raport Excel nie ma statusu zamówienia (tylko statusy pozycji). Znamy z zrzutu tylko „Jeszcze nierozstrzygnięty". |
| **Status zamówienia zostaje `open` (decyzja 2026-11-08)** | Hipoteza użytkownika: pole jest w praktyce zapomniane. Zrzut z listą Pending/Refuse/Confirmed/Cancel dotyczy statusów pozycji (zgodne z bazą). Do doprecyzowania później. |
| **Wartość zamówienia zostaje pusta (decyzja 2026-11-08)** | Reguła nieznana, a POC jej nie potrzebuje. `value_total` pusty, `part_value` 1:1 z importu; reguła dojdzie jako migracja z przeliczeniem. UI pokazuje „brak". |
| **Menu modułów: hamburger po lewej** | Skaluje się na kolejne moduły (zamiast zakładek w `tenders.tsx`, którego nagłówek jest w całości o przetargach). Rejestr w `src/modules.ts`, adresy z hashem (`#/zamowienia`), flaga `REACT_APP_ENABLE_ORDERS`. Przy wyłączonej fladze nagłówek przetargów jest bez zmian. |
| **Funkcje zamówień eksportowane zwykle (od 2026-11-09)** | Wcześniej tylko w emulatorze, bo bez sekretu `ORDERS_DATABASE_URL` wdrożenie wszystkich funkcji by się nie powiodło. Sekret jest ustawiony w projekcie testowym `tenders-test-b5bb3`. **W produkcyjnym `tendersted` go nie ma: ustawić przed scaleniem do `main`.** |
| **Neon: projekt `tenders-pg`, Postgres 18, Frankfurt (decyzja 2026-11-09)** | Baza z migracjami 0001 do 0003 i importem raportu 2026 (7 773 zamówienia, 29 263 pozycje), weryfikator bez niezgodności, testy SQL przechodzą też na 18. Funkcje używają adresu pooled (sekret), migracje i import adresu direct. |
| **Dane osobowe urzędników: bez anonimizacji (zgoda użytkownika 2026-11-09)** | Dane są jawne (strony urzędów, dokumenty, raporty), firma ich nie anonimizuje. Zostaje kwestia poufności samego raportu firmy (ryzyka, pkt 8). |
| **Kolumny celowo pominięte** | `Benchmark Bid`, `Comments Sales Team`, `Data wysłania pisma` (puste w 100%), `Financing non-EU` (zawsze odwrotność `Financing EU`; odtwarzana tylko w widoku eksportu), `Order Week` i `Publication Quarter` (wyliczane; tydzień = ISO z daty rejestracji, kwartał z daty publikacji, zgodność 100%). |
| **RAM, storage, ISO 50001, TCO w `positions.attributes` (JSONB)** | Rzadkie parametry zależne od kategorii (RAM i storage dla smartfonów, ISO i TCO to certyfikaty wymagane przez zamawiającego). Nowy parametr to nowy klucz, nie migracja. |

## 3. Stan na dziś (zrobione)

Gałąź `feature/zamowienia-baza` (odchodzi od `origin/develop`, 0 commitów za nim):

| Commit | Zawartość |
|---|---|
| `4e67f01` | Schemat (`db/migrations/0001_init.sql`), słowniki z Legendy (`0002`), testy SQL, skrypt analizy raportu, `docs/App/` w `.gitignore` |
| `613c950` | Import raportu: czytnik xlsx bez zależności, normalizacja, importer z suchym przebiegiem i generatorem SQL, weryfikator „w obie strony" |
| `817baca` | Instrukcja trwałego kontenera Postgresa z wolumenem |
| `4d9b471` | Funkcje odczytu `functions/orders/` (lista, szczegóły, wyszukiwanie zamawiających), testy, `pg` w zależnościach |
| `63f82c2` | `getDictionaries` i eksport funkcji pod emulatorem |
| `3dac473` | Migracja `0003`: kategoria `Phone` (smartfony) |
| `12b257d` | Menu modułów (hamburger), rejestr modułów, routing hashem, szkielet ekranu „Zamówienia" za flagą |

Co jest w lokalnej bazie (kontener `tenders-pg`, wolumen `tenders-pg-data`): 7 773 zamówienia, 29 263 pozycje, 3 792 zamawiających, 5 182 kontakty, 1 379 zwycięzców, 330 vendorów (raport 2026). Weryfikacja „w obie strony": 41 kolumn × 29 263 wierszy bez niezgodności (dozwolone różnice to normalizacja zapisu i wybór najczęstszego wariantu).

Testy: 20 w `npm run test:orders` (9 walidacji + 11 zapytań na prawdziwym Postgresie), 197 w całym frontendzie (w tym 13 dla menu i rejestru modułów), 93 w `npm run test:unit`, 19 sprawdzeń SQL schematu (`db/tests/0001`), asercje słowników (`db/tests/0002`) i 7 testów normalizacji (`db/import/normalize.test.mjs`). Warstwa `onCall` sprawdzona HTTP-em na emulatorze (autoryzacja, walidacja, dane).

**Niezweryfikowane przez agenta:** wygląd interfejsu (skrypt zrzutów nie umie się logować; użytkownik ocenia menu w przeglądarce), działanie na telefonie i w ciemnym motywie, wdrożenie na projekt testowy, praca na Neon, CI z bazą.

## 4. Architektura docelowa

```
przeglądarka (React, src/features/orders)
   │  httpsCallable (Firebase Auth, rola admin|member; później client)
   ▼
Cloud Functions (functions/orders): walidacja, autoryzacja, transakcje
   │  pg (pula 2 połączenia), SET app.user_id = <uid> na czas transakcji
   ▼
PostgreSQL (lokalnie Docker, docelowo Neon): schemat db/migrations
   └─ wyzwalacze: wersja i updated_at, dziennik zmian (audit_log)

Firestore (bez zmian): lista przetargów TED / eZamówienia / Baza, statusy, gwiazdki
```

Granice modułu: kod frontendu w `src/features/orders/`, funkcje w `functions/orders/`, baza w `db/`. Dotyka istniejącego kodu tylko w `App.tsx`, `header.tsx`, `functions/index.ts` i (później) `TenderCard.tsx`.

## 5. Plan etapów

Kolejność i zależności: **A → B → I-light → C → D → E**, potem F, G, H. Etap I-light (Neon + sekret + zwykły eksport funkcji) warto wyciągnąć zaraz po B, żeby użytkownik oglądał dane na wdrożonej aplikacji testowej bez lokalnych emulatorów. Etap E (czyszczenie zamawiających) jest niezależny od C i D.

### Etap A: lista zamówień (UI), następny do zrobienia

**Cel:** na ekranie „Zamówienia" widać przewijalną, filtrowalną listę zamówień z bazy.

Zadania:
1. `src/features/orders/ordersApi.ts`: typowane `httpsCallable` dla `getDictionaries`, `listOrders`, `getOrder`, `searchBuyers`, `getBuyer`. Typy odpowiedzi w `src/types/Orders.ts` jako kopia `functions/orders/types.ts` (aplikacja nie może importować z `functions/`; komentarz o konieczności synchronizacji).
2. Hooki: `useDictionaries` (jednorazowo, z cache), `useOrdersList(filtry)` z kursorem, debounce wyszukiwania (ok. 300 ms), resetem listy przy zmianie filtrów i ignorowaniem spóźnionych odpowiedzi (numer żądania), stanami ładowania i błędu.
3. Komponenty: pasek filtrów (rok, kategoria LoB, status pozycji, typ konta, wyszukiwanie), tabela na desktopie i karty na wąskim ekranie, „Pokaż więcej", stany: ładowanie, błąd, brak wyników. Kolumny: MDP ID, nr przetargu, zamawiający i miasto, data rejestracji, termin ofert, kategorie LoB (z `description` jako tooltip), podsumowanie pozycji (`positionStatusCounts`), status.
4. Stan w adresie: wybrane zamówienie w ścieżce (`#/zamowienia/123`), filtry w zapytaniu hasha albo w `sessionStorage` (do rozstrzygnięcia przy implementacji; zachować przycisk „wstecz").
5. Środowisko lokalne: `.env.local` z `REACT_APP_ENABLE_ORDERS=true` i `REACT_APP_USE_EMULATORS=true`; emulatory Auth + Functions (+ Firestore, jeśli ma działać moduł Przetargi; wymaga Javy, patrz `docs/handoff.md` pkt 3); konto w emulatorze Auth z claimem `role` (sprawdzić, czy `functions/scripts/setAdmin.js` obsługuje emulator, inaczej skrypt zasiewający). Alternatywa: wdrożony projekt testowy po etapie I-light.
6. Testy: React Testing Library na atrapie `ordersApi` (filtry, kursor, stany), pełny `react-scripts test`, `tsc`, `npm run build`.

Gotowe, gdy: 7 773 zamówień da się przejść stronami bez duplikatów, każdy filtr działa i się łączy z innymi, stany ładowania, błędu i braku danych są obsłużone, nawigacja klawiaturą działa, ciemny motyw i wąski ekran zostały obejrzane przez użytkownika.

Ryzyka: konfiguracja konta z rolą w emulatorze; z `REACT_APP_USE_EMULATORS=true` moduł Przetargi widzi pusty Firestore (to oczekiwane).

### Etap B: szczegóły zamówienia (tylko odczyt)

Układ master-detail: lista po lewej i szczegóły po prawej (szeroki ekran), osobny ekran na telefonie. Sekcje odpowiadają trzem zakładkom starej aplikacji, ale na jednej stronie: **Zamówienie** (numery, daty, link SIWZ i dodatkowe, finansowanie UE, budżet, typ konta, flagi „Poza UZP" i „Lenovo top ten", komentarz), **Zamawiający i PinC** (adres, NIP, kontakt z `mailto:` i telefonem, `canonicalId` jako informacja o grupie), **Pozycje** (tabela z nagłówkiem grupowym „przed" i „po rozstrzygnięciu", `attributes`, zwycięzca, vendor, status z opisem), **Pisma**. Linki zewnętrzne z `rel="noopener noreferrer"`. Puste wartości jako „brak", nie puste komórki. Głęboki link `#/zamowienia/ID`.

Gotowe, gdy: dla zamówienia z 69 pozycjami (MDP 7773 ma 4, największe w danych 69) widok jest czytelny i przewijalny, a nieistniejące ID pokazuje komunikat „Nie znaleziono".

### Etap I-light: wdrożenie odczytu na projekt testowy

Wymaga działań użytkownika (konto Neon, sekret). Kroki: założyć projekt Neon (region UE) i bazę; zastosować migracje i import na Neon (z `docs/App/import_mdp_2026.sql`, dane osobowe: decyzja o anonimizacji, patrz pkt 8); `firebase functions:secrets:set ORDERS_DATABASE_URL --project tenders-test-b5bb3` (użytkownik); zamienić blok warunkowego eksportu w `functions/index.ts` na zwykły eksport; PR do `develop` (CI wdroży na projekt testowy); w CI dla środowiska testowego ustawić `REACT_APP_ENABLE_ORDERS=true` (do uzgodnienia). Sprawdzić limity darmowego planu przed decyzją (**nie sprawdzone**). Gotowe, gdy: użytkownik widzi listę zamówień na wdrożonej aplikacji testowej, a wdrożenie pozostałych funkcji nie zostało zakłócone.

### Etap C: wprowadzanie danych (zapisy)

Funkcje zapisu (wszystkie w transakcji, z `set_config('app.user_id', uid, true)`, numeracja z liczników, optymistyczna blokada `version`): `createOrder`, `updateOrder`, `deleteOrder`/`restoreOrder`, `createPosition`, `updatePosition`, `deletePosition`/`restorePosition`, `createBuyer`, `createContact`, `updateContact`. Konflikt wersji zwraca czytelny błąd (`failed-precondition`) i prosi o odświeżenie.

Wymagania, które wynikają z pracy użytkowniczki (ok. 740 zamówień miesięcznie, wiele pozycji w zamówieniu): **szybkość wpisywania** (tabela pozycji z nawigacją Tab, „Duplikuj" pozycję i zamówienie, jawne „Zapisz" i ostrzeżenie o niezapisanych zmianach), **wybór zamawiającego, potem jego kontaktu** (kontakty tylko tego zamawiającego, dodanie nowego w locie; klucz złożony w bazie to wymusza), **walidacja po obu stronach** (zakresy dat zgodne z CHECK w bazie; ostrzeżenie, gdy termin ofert jest wcześniejszy niż publikacja), **cofanie** usunięcia.

Normalizacja kluczy (`dedupe_key`, `name_key`, tożsamość kontaktu) musi być identyczna jak w imporcie. Przenieść `db/import/normalize.mjs` do `functions/orders/normalize.ts` ze wspólnymi wektorami testowymi, żeby wpis ręczny trafiał na ten sam klucz.

**„Wpisz do bazy" na karcie przetargu** (`TenderCard.tsx`): wstępnie wypełnia zamówienie z dokumentu Firestore (nazwa, zamawiający, NIP `buyerNip`, daty, linki, `source_tender_id`), dopasowuje zamawiającego po NIP lub kluczu i po utworzeniu może ustawić wspólny status przetargu na „wpisany" (do decyzji). **Dodać na samym końcu, po scaleniu gałęzi analizy do `develop`**, bo ta gałąź zmienia ten plik (+15 linii).

Role: na start `admin` i `member` mogą wszystko. Czy część „po rozstrzygnięciu" ma być ograniczona do analityczki: pytanie otwarte (pkt 7).

Testy: SQL i integracyjne na prawdziwym Postgresie (rollback po teście): licznik pod współbieżnością, konflikt wersji, miękkie usunięcie i przywrócenie, autor w `audit_log`, walidacje. Gotowe, gdy: użytkowniczka potrafi wprowadzić zamówienie od zera i zduplikować istniejące szybciej niż w starej aplikacji (ocena użytkownika).

### Etap D: wyniki rozstrzygnięć i kolejka analityczki

Pola po rozstrzygnięciu (zwycięzca, vendor, status pozycji, data listu, `Final Office`, wartość) wypełnia osobna osoba (analityczka), często po mailowym dopytywaniu zamawiających, więc większość pól bywa pusta. Zadania: wybór zwycięzcy i vendora z podpowiedziami (`pg_trgm`, żeby nie mnożyć wariantów zapisu) i możliwością dodania nowego z normalizacją; **reguła wartości** (po odpowiedzi użytkowniczki: `orders.value_total` i `parts_count` kontra `part_value`; migracja i przeliczenie importu); widok „kolejka do sprawdzenia": zamówienia z terminem ofert w przeszłości, mające pozycje `Pending` bez zwycięzcy (stare statystyki 12 i 13); filtr „bez wyniku" na liście. Gotowe, gdy analityczka może przejść kolejkę i uzupełnić wyniki bez opuszczania modułu.

### Etap E: przegląd i czyszczenie duplikatów zamawiających

Narzędzie do człowieka, nie automat. Kandydaci: 43 nazwy współdzielone przez kilka jednostek (z raportu importu), podobne adresy (`pg_trgm`), wspólny e-mail kontaktu. Akcje: „ta sama organizacja" (ustawia rekord główny), „to różne jednostki" (zapamiętana decyzja negatywna, np. tabela `buyer_not_duplicates`, żeby kandydat nie wracał), cofnięcie. Decyzje do podjęcia przy implementacji: zmiana nazwy kolumny `merged_into_id` na `canonical_id` (nazwa „merged" sugeruje fizyczne scalenie; migracja `0004` + kod), widok `v_buyers_canonical`, statystyki grupujące po rekordzie głównym, czyszczenie zdublowanych kontaktów. Wszystko z wpisem w `audit_log`. Gotowe, gdy: użytkowniczka przejrzy 43 grupy i może to cofnąć.

### Etap F: raporty i eksport

Zastępuje wysyłanie jednego rosnącego pliku. Model: definicja raportu zapisana per klient (filtry: kategoria LoB, region, typ konta, okres, wybór kolumn), widok raportu z filtrami, **eksport `.xlsx` w dotychczasowym układzie** (46 kolumn, nagłówek grupowy „Pre Bid Verification" w A1 i „Post Bid Verification" w AC1, z widoku `v_report_flat`), raport różnicowy „nowe i zmienione od ostatniej wizyty lub wysyłki" (na podstawie `updated_at` albo `audit_log`). Do rozstrzygnięcia: biblioteka do zapisu xlsx (np. `exceljs` po stronie funkcji, strumieniowo; 29 tys. wierszy; limit pamięci i czasu funkcji) kontra CSV. **Weryfikacja:** wygenerowany plik wczytać `db/import/xlsx.mjs` i porównać z `v_report_flat` (analogicznie do `verifyImport.mjs`). Zależy od etapu D (wartości).

### Etap G: statystyki

Odtworzenie stopniowo 17 zestawień starej aplikacji (zrzut: rok × kwartały × miesiące; parametry: rok, kategoria LoB, typ konta, status zamówienia, status pozycji). Znamy tytuły ucięte na zrzucie (m.in. „Tenders miesiącami", „Liczba zamówień wg dni", „LoB Category miesiącami", „Tendersy aktywne", „Ostatnio wysłane pisma", „Qtty wg Zamawiających / Winnera / Vendorów", „Tenders z ostatnich 7 dni", „Kolejka do sprawdzania", „Największe zamówienia i rozstrzygnięcia w..."): **pełne tytuły i definicje trzeba uzyskać od użytkowniczki**. Zapytania agregujące w SQL z indeksami; widoki zmaterializowane tylko, jeśli zmierzymy problem. Zestawienia z wartością zależą od reguły wartości (etap D). Historia 2016 do 2025 wymaga starszych plików (w raporcie 2026 jest tylko ten rok); import jest zaprojektowany tak, by przyjąć kolejny rok.

### Etap H: klienci, feed i e-maile

Wymaga osobnego projektu bezpieczeństwa: rola `client` i przypisanie konta do organizacji klienta; funkcje zawsze filtrują dane po definicjach raportów danego klienta (nigdy po stronie przeglądarki); osobny widok „portal klienta" widoczny tylko dla klientów. Wysyłka e-mail: dostawca do wyboru (Firebase nie wysyła maili; opcje: Resend, SendGrid, SMTP), koszt i dostarczalność (SPF, DKIM), harmonogram (`onSchedule` jest już używany w funkcjach), szablony, rezygnacja z subskrypcji, tabela `report_deliveries` (co, komu, kiedy; to nie to samo co tabela `letters`, czyli pisma do zamawiających). Dane osobowe i RODO. **Przed wdrożeniem obowiązkowy przegląd bezpieczeństwa** (skille `security-review` i `diff-review`).

### Etap I: wdrożenie i operacje

Runner migracji (dziś migracje stosujemy ręcznie `psql`): prosty skrypt z tabelą `schema_migrations` i sumami kontrolnymi; kopie zapasowe (sprawdzić, co daje wybrany plan Neon; w razie braku regularny `pg_dump`); CI z kontenerem Postgresa uruchamiający `test:orders` i testy SQL (uwaga: `.github/workflows` zmieniała też gałąź analizy); lista kontrolna przed produkcją: decyzja o anonimizacji i RODO, przegląd ról, monitoring, alert kosztowy, flaga wyłączona domyślnie. **Nic na produkcję (`main`, projekt `tendersted`) bez wyraźnej zgody użytkownika.** Długoterminowo: warstwa dostępu pozwala podmienić magazyn, jeśli firma udostępni swój schemat (samą strukturę bez danych, za zgodą właściciela); do tego czasu nie łączymy się z żadnym systemem firmy.

## 6. Praca równoległa z gałęzią `integracja-analiza`

Gałąź analizy (ostatni znany commit `3dfd396`, tylko lokalna, brak `origin/integracja-analiza`) scalała się z `origin/develop` bez konfliktów (sprawdzone dla `develop` w stanie `9185da1`; od tego czasu `develop` dostał tylko zmiany dokumentacji, ponowne sprawdzenie nie było robione). **Z naszą gałęzią są konflikty w czterech plikach** (sprawdzone `git merge-tree`, 2026-11-08), wszystkie typu „obie strony dopisały w tym samym miejscu":

| Plik | Po stronie analizy | Rozwiązanie |
|---|---|---|
| `.gitignore` | `analizy-*.csv` na końcu | zachować obie |
| `functions/index.ts` | `export { analyzeTender, cancelAnalysisWait, runAnalysis } from ...` | zachować obie |
| `functions/package.json` | `google-auth-library` | zachować obie zależności |
| `functions/package-lock.json` | j.w. | po rozwiązaniu `package.json` uruchomić `npm install` w `functions/`, nie edytować ręcznie |

Skrypt testowy `test:orders` w głównym `package.json` celowo wstawiony daleko od linii `test:unit`, którą zmieniła analiza (brak konfliktu). `App.tsx` i `header.tsx` analiza nie zmieniała. Najpoważniejszy punkt styku to `TenderCard.tsx` (przycisk „Wpisz do bazy", etap C). Zasada: kto pierwszy wejdzie do `develop` PR-em, drugi dociąga zmiany (`git merge origin/develop`) i rozwiązuje powyższe; przed PR sprawdzić `git merge-tree --write-tree --name-only origin/develop <gałąź>`.

## 7. Pytania otwarte (do użytkowniczki lub analityczki)

1. **Statusy zamówienia:** co zawiera lista rozwijana „Status" na ekranie zamówienia (zrzut ekranu rozwiniętej listy wystarczy). Dziś znamy tylko „Jeszcze nierozstrzygnięty". Blokuje: etap D i widok „otwarte".
2. **Wartość zamówienia:** wartość = kwota, z jaką wygrał zwycięzca, podzielona przez liczbę części (średnia na część). W danych 65% zamówień wielopozycyjnych ma tę samą kwotę w każdym wierszu, 35% ma różne, a liczba części nie równa się liczbie pozycji (w 1 243 zamówieniach jest mniej części niż pozycji, w 1 686 pole `Part` jest puste). Czy kwota jest powielana per część, per pozycję, czy bywa wpisana inaczej? Czy zamówienie MDP 3345 (suma 2,76 mld) jest prawdziwe? Blokuje: etapy D, F (wartości), G.
3. **Status `Pending` ze zwycięzcą:** 57% pozycji `Pending` ma już zwycięzcę. Czy zwycięzca pochodzi z ogłoszenia o wyniku, zanim zamawiający potwierdzi informację? Oraz 70 pozycji `Cancel` ze zwycięzcą i 11 `Confirmed` bez zwycięzcy: błąd czy sytuacja dopuszczalna?
4. **Vendor:** wpisy specjalne („nie wymagali podania modeli", „Assembled-Web Profi", „NTT"): czy to osobne pojęcia? Czy vendor jest zawsze wybierany z listy?
5. **Duplikaty zamawiających:** kto zatwierdza scalanie i według jakich reguł (np. zmiana adresu to ta sama organizacja; komórka urzędu to osobna jednostka?).
6. **Role:** czy analityczka ma osobne uprawnienia do wypełniania części „po rozstrzygnięciu"? Kto może usuwać?
7. **Klienci:** co dokładnie dostają (całość czy wycinek: LoB, region)? Czy wszyscy widzą to samo? Czy raporty mają być wysyłane automatycznie i jak często?
8. **Pisma:** co oznacza „Wyślij pismo" i „Powiadomienie email" (do kogo, z jakim szablonem, co znaczy „Confirm date")? Dziś mamy tylko tabelę `letters`.
9. **Pola:** znaczenie „Poza UZP" i „Lenovo top ten" (są w schemacie jako flagi, nie ma ich w raporcie).
10. **Starsze lata:** czy istnieją pliki raportów 2016 do 2025?
11. **Pełne tytuły** 17 zestawień statystyk i ich definicje.
12. **Dostęp do schematu bazy firmy:** czy da się uzyskać sam schemat (bez danych) za wiedzą właściciela?

## 8. Ryzyka

- **Dane osobowe (RODO):** raport zawiera imiona, telefony i e-maile urzędników. Lokalna baza i plik importu leżą w `docs/App/` (ignorowane przez git). Przed załadowaniem na Neon lub do chmury zdecydować: anonimizacja kontaktów albo zgoda i podstawa prawna. Dopóki nie ma decyzji, dane osobowe zostają lokalnie.
- **Poufność danych firmy:** pliki z `docs/App/` nie mogą trafić do repozytorium ani na zewnętrzne usługi.
- **Utrata danych w Dockerze:** kontener bez wolumenu (`--rm`) kasuje bazę. Już raz się to zdarzyło; teraz jest wolumen `tenders-pg-data`, a odtworzenie trwa kilka sekund (migracje + import).
- **Limity darmowego Neon:** niesprawdzone. Dane są małe (dziesiątki MB), ale usypianie bazy wydłuża pierwsze zapytanie.
- **Konflikty z gałęzią analizy:** opisane w pkt 6.
- **Duplikacja typów** frontend/backend: kopie w `src/types/Orders.ts` i `functions/orders/types.ts`. Rozważyć wspólne źródło, jeśli typów będzie przybywać.
- **Zależność od `requireMember` otwartego tymczasowo:** moduł go nie używa, ale to osobny temat na `develop` (komentarz w `functions/access.ts`).
- **Skala frontendu:** `tenders.tsx` ma 880 linii. Nie rozbudowywać go o zamówienia.

## 9. Strategia testów i jakość

- Nowe funkcje, nowe testy: SQL (transakcja z wycofaniem) dla schematu, integracyjne na prawdziwym Postgresie (rollback) dla funkcji, React Testing Library dla UI. W projekcie nie ma `jest-dom` ani `setupTests`: asercje zwykłe (`innerHTML`, `getAttribute`).
- Przed zakończeniem etapu: `npm run test:orders`, `CI=true npx react-scripts test --watchAll=false`, `npx tsc --noEmit -p .`, `npm --prefix functions run build`, `CI=true npm run build` (lint jako błędy). Dla zmian schematu dodatkowo świeża baza: migracje, testy SQL, import, weryfikator.
- Raport końcowy etapu w formacie z `docs/CLAUDE.md` (zmiany, pliki, weryfikacja, ograniczenia, stan Git), z jawnym rozróżnieniem „sprawdzone testem" i „nieoglądane w przeglądarce".

## 10. Poza zakresem (na razie)

Integracja z bazą firmy (brak schematu), płatności, wielu najemców, aplikacja mobilna, import starszych lat (do czasu plików), migracja przetargów z Firestore do Postgresa.
