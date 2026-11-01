# Przekazanie pracy: stan projektu i kolejne kroki

Ten plik jest dla agenta rozpoczynającego nową sesję. Czytaj go razem z `docs/CLAUDE.md` (zasady pracy), `docs/goals.md` (cel), `docs/plan.md` (etapy i ustalenia) oraz `docs/code-review-notes.md` (uwagi z przeglądu kodu). Stan na 2026-11-01 (po wdrożeniu na produkcję).

**Zadanie o Bazie Konkurencyjności:** cały dotychczasowy research (endpointy, struktura danych, wolumen, niewiadome, plan) jest w `docs/research-baza-konkurencyjnosci.md`. Przeczytaj go przed rozpoczęciem takiej pracy. Nie ma tam jeszcze żadnego kodu.

## 1. Projekt w skrócie

Aplikacja do przeglądania zamówień publicznych na sprzęt IT (TED i eZamówienia; Baza Konkurencyjności na razie nie jest zaimplementowana: nie ma oficjalnego API, a lista ogłoszeń wymaga logowania; właściciel nie odrzuca scrapingu i traktuje to jako R&D, patrz `docs/research-baza-konkurencyjnosci.md`). Analityk tworzy z niej raporty dla firm. Cel prac: kilka zaproszonych osób ma widzieć **wspólną** listę przetargów i **wspólne** oznaczenia (patrz `docs/goals.md`). Rozbudowa aplikacji dopiero po osiągnięciu tego minimum.

Użytkownik komunikuje się po polsku. Odpowiadaj po polsku, zwięźle, z uzasadnieniem istotnych decyzji technicznych. Commity są po angielsku.

## 2. Zasady współpracy ustalone w tej pracy

- **Zasady z `docs/CLAUDE.md` obowiązują.** Najważniejsze: najpierw poznaj kod, ograniczaj zakres zmian, nie twierdź, że coś działa, jeśli tego nie sprawdziłeś, i raportuj uczciwie, co zweryfikowano, a co nie.
- **Commity i pushe tylko za wyraźną zgodą.** Dotychczas pytałem przed każdą porcją commitów i pushem. Commit message kończy się linią współautora podaną w system-reminderze sesji (do tej pory: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`).
- **Nic nie wdrażaj na produkcję bez wyraźnej zgody** (projekt `tendersted`, działa od 2026-11-01). Zmiany robimy i sprawdzamy na projekcie testowym `tenders-test-b5bb3` i na emulatorach. Każdy push do `main` uruchamia GitHub Actions i wdraża hosting na produkcję, także zmiana samej dokumentacji (patrz sekcja 8).
- Użytkownik pytany o decyzje odpowiada konkretnie. Nie pytaj o rzeczy, które da się rozstrzygnąć rozsądnym domyślnym wyborem; opisz założenie i idź dalej.
- Użytkownik sprawdza zmiany w przeglądarce sam i raportuje wyniki. Nie widziałeś interfejsu na żywo, więc zawsze zaznaczaj, co zweryfikowano tylko typami, buildem i testami. Reguły Firestore na projekt testowy wdrażaj dopiero po jego zgodzie (tak było dotąd), bo frontend z nowymi regułami zmienia to, co użytkownik zobaczy.
- Produkcja jest wdrożona i użytkownik potwierdził, że działa. Zapytaj o jego plany na kolejne funkcjonalności, zanim zaczniesz nową pracę.

## 3. Środowisko (Windows 11, PowerShell 5.1)

- **Katalog projektu:** `C:\Users\janke\Desktop\Projekty\TED_Tenders-main`. Repozytorium: `https://github.com/JankesMateusz/TED_Tenders.git`. Gałąź `feature/shared-tenders` została zmergowana do `main` (PR #4, 2026-11-01); `main` odpowiada teraz produkcji. Nową pracę rób na osobnej gałęzi odchodzącej od `main`. Na `origin` jest też stara gałąź `development`, niezwiązana z tymi pracami. Lokalna gałąź `master` to stary, zbędny commit z `git init` (zawiera `node_modules`); można ją usunąć za zgodą użytkownika.
- **Node 24, npm 11.** `npx firebase` to firebase-tools 14.4.0 (z `devDependencies`).
- **Java 21** (Microsoft OpenJDK) jest w `C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot\bin`, ale proces agenta jej nie widzi w `PATH`. Przed każdym poleceniem z emulatorami ustaw: `$env:PATH = 'C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot\bin;' + $env:PATH`.
- **`gcloud`** jest w `%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd` (poza `PATH` agenta). Poświadczenia aplikacji (ADC) są ustawione, więc skrypty z Admin SDK działają na projekcie testowym.
- **Firebase CLI:** użytkownik jest zalogowany. Aktywny projekt (`firebase use`) to alias `test` → `tenders-test-b5bb3`. Alias `default` to produkcja `tendersted`. **Zawsze podawaj `--project` jawnie** przy `deploy`.
- **Czynności interaktywne** (`firebase login`, `gcloud auth ...`) użytkownik wykonuje w osobnym terminalu; komenda `!` w sesji nie ma terminala interaktywnego.
- **Pułapki PowerShella 5.1:**
  - `2>&1` na poleceniach natywnych (git, node) wyświetla `NativeCommandError` mimo kodu wyjścia 0. Sprawdzaj `$LASTEXITCODE`.
  - Komunikaty commitów z cudzysłowami psują się; zapisuj je do pliku w katalogu scratchpad i używaj `git commit -F plik`. Nie tłum błędów przez `| Out-Null`, bo gubi to nieudane commity.
  - Ostrzeżenia `LF will be replaced by CRLF` są normalne (`core.autocrlf=true`, w repo jest `.gitattributes` z `* text=auto`).
  - Dynamiczny `import()` ścieżek Windows wymaga adresów `file://`; skrypty jednorazowe najlepiej kładź tymczasowo w `tests/` i usuwaj po użyciu (importy ESM jak w testach).
- `node --test` w Node 24 nie przyjmuje katalogu; podawaj pliki.

## 4. Projekty Firebase

| Projekt | Rola | Stan |
|---|---|---|
| `tenders-test-b5bb3` | testowy | Authentication (email i hasło) włączone, Firestore `(default)` w `europe-central2`, wdrożone funkcje `inviteUser`, `refreshTenders` i `listUsersStatus` (Node 22, `europe-central2`; `refreshTenders` zaktualizowany 2026-10-29 o `contract-nature`, a 2026-10-30 o `document-url-lot`), reguły (aktualne, w tym statusy, gwiazdki i komentarze) i indeksy z TTL (`tenders`, `refreshLog`, `comments`), polityka czyszczenia obrazów 1 dzień. Jest tu konto admina użytkownika (rola `admin`). Dane testowe (kilka tysięcy dokumentów `tenders`) wygasają same po 30 dniach. **Hosting testowy jest wyłączony** (2026-10-30, `firebase hosting:disable`; zbędny, bo aplikację testujemy lokalnie przez `npm start`, a `.env.local` wskazuje na ten projekt). Workflow GitHub Actions wdraża wyłącznie produkcję, test nie ma automatycznych wdrożeń. |
| `tendersted` | **produkcja** (wdrożona 2026-11-01) | Authentication (email i hasło) włączone, Firestore `(default)`, reguły i indeksy z TTL wdrożone, funkcje `inviteUser`, `refreshTenders` i `listUsersStatus` (Node 22, `europe-central2`), hosting wdrażany przez GitHub Actions po merge do `main`. Admin założony skryptem `setAdmin.js`. Stare funkcje `api` i `getApiKey` oraz sekret `API_KEY` usunięte. Polityka czyszczenia obrazów: 1 dzień. Użytkownik sprawdził w przeglądarce, że aplikacja działa. |

Pozostałe projekty na koncie (`tenders-app-32189`, `tendersapptests`) nie są częścią tych prac.

Konfiguracja webowa testowego projektu jest w `.env.local` (poza Gitem; wzór w `.env.example`). `REACT_APP_USE_EMULATORS=false` oznacza połączenie z projektem testowym, `true` z lokalnymi emulatorami.

## 5. Architektura (stan obecny)

**Przepływ:** przeglądarka czyta przetargi z Firestore (nasłuch na żywo). Przy wejściu, zmianie dnia i po kliknięciu „Odśwież" woła funkcję `refreshTenders`, która pobiera dane ze źródeł po stronie serwera i dopisuje tylko brakujące przetargi.

### Functions (`functions/`, TypeScript, Node 22, firebase-functions v6, firebase-admin v13)
- `index.ts`: `initializeApp()` i eksporty `inviteUser`, `listUsersStatus`, `refreshTenders`.
- `access.ts`: `REGION = 'europe-central2'`, `requireMember`, `requireAdmin` (rola z custom claim `role`).
- `users.ts`: `inviteUser` (tylko admin): zakłada konto, nadaje rolę `member` (istniejącej nie zmienia), zapisuje `users/{uid}`, zwraca link do ustawienia hasła, który admin przekazuje osobie ręcznie.
  - `listUsersStatus` (tylko admin): zwraca użytkowników z rolą (`customClaims.role`) i status aktywacji: `invited` (brak hasła), `password-set` (hasło jest, brak logowania), `active` (było logowanie), plus daty utworzenia i ostatniego logowania. Dane z Firebase Auth przez `listUsers`, nie z Firestore. Za logowanie uznaje tylko `lastSignInTime` różny od `creationTime`, bo emulator ustawia je równe dla kont, które nigdy się nie logowały (zachowania produkcji dla takich kont nie zweryfikowano). Panel admina (`AdminPanel.tsx`) bierze listę stąd i pokazuje przy kontach bez logowania przycisk „Nowy link” (ponowne wywołanie `inviteUser`, nie zmienia roli).
- `tenders/`:
  - `refresh.ts`: `refreshTenders({date?})` (rola admin lub member): dzień domyślnie dzisiejszy w `Europe/Warsaw`, dopuszczalne ostatnie 31 dni, bez przyszłości. Blokada `meta/refreshLock` (6 min, zwalniana w `finally`). Po w pełni udanym odświeżeniu zapis `refreshLog/{dzień}`.
  - `ted.ts` (czyta też `contract-nature` i wylicza `orderType`, `extractOrderType`; czyta `document-url-lot` i wylicza `documentsUrl`, `extractDocumentsUrl`), `ezamowienia.ts`: pobieranie i mapowanie do wspólnego modelu; `model.ts` (typ `TenderRecord`, `tenderId`); `dates.ts` (strefa Warsaw); `store.ts` (`saveNewTenders`); `http.ts` (ponawianie po 429/502/503/504).
- `scripts/backfillOrderType.js <projectId> [--apply]`: jednorazowe uzupełnienie `orderType` w zapisanych przetargach z TED (i gwiazdkach). Domyślnie tryb próbny. Uruchomiony 2026-10-29 na projekcie testowym (393 dokumenty uzupełnione); na produkcji niepotrzebny.
- `scripts/backfillDocumentsUrl.js <projectId> [--apply]`: to samo dla `documentsUrl` (adres dokumentacji od zamawiającego), w `tenders` i gwiazdkach z TED. Domyślnie tryb próbny. Uruchomiony 2026-10-30 na projekcie testowym (438 z 452 dokumentów uzupełnionych; 14 TED już nie zwraca albo zamawiający nie podał adresu; gwiazdek z TED tam nie było, więc ta część nie była sprawdzona). **Na produkcji trzeba go uruchomić** (patrz etap 5).
- `scripts/setAdmin.js`: nadaje rolę admina (tworzy konto, jeśli go nie ma). Wymaga podania `projectId`. Na emulatorze przyjmuje hasło (ustaw `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`), na prawdziwym projekcie wypisuje link do ustawienia hasła.
- `.env.demo-tenders`: ładowane tylko dla projektu `demo-tenders` (testy), kieruje źródła na lokalny serwer testowy i skraca opóźnienia ponawiania.
- Usunięte: `getApiKey`, `/tedProxy`, Express, Secret Manager (wyszukiwanie TED v3 jest publiczne, więc klucz nie jest potrzebny).

### Model danych (Firestore)
- `tenders/{źródło}_{numer}`: id z `/` i spacjami zamienionymi na `_` (numery eZamówień zawierają `/`). Pola: `source` (`TED` | `E_ZAMOWIENIA`), `publicationNumber`, `title`, `buyerName`, `buyerCity`, `country`, `publicationDate` (`YYYY-MM-DD`, czas warszawski), `publicationTime` (`HH:MM` lub `null`), `deadlineDate` (`YYYY-MM-DD` lub `null`), `cpvCodes[]`, `link`, `documentsUrl` (adres dokumentacji podany przez zamawiającego, tylko TED z `document-url-lot`; pierwszy poprawny adres http(s), `null` gdy brak i zawsze `null` dla eZamówień), `orderType` (`Delivery` | `Services` | `Works` lub `null`; dla TED z pola `contract-nature` lotów, reguła pierwszeństwa Delivery > Services > Works, patrz `ted.ts`), `buyerMainActivity`, `fetchedAt`, `expireAt` (TTL = pierwszy zapis + 30 dni). Tylko funkcja tworzy dokumenty i nigdy nie nadpisuje istniejących.
  - **Wspólny status** (ustawiany z klienta, opcjonalny): `status` (`toEnter` | `entered` | `toClarify` | `notToEnter`), `statusBy` (uid), `statusByEmail` (do podpowiedzi z autorem; członek nie czyta cudzych profili `users`), `statusAt` (czas serwera). Pola ustawia się albo usuwa wszystkie naraz; reguła sprawdza autora i e-mail względem tokenu logowania.
- `users/{uid}/favorites/{tenderId}`: gwiazdka. Kopia przetargu **w formacie interfejsu** (daty `DD-MM-RRRR`, bez `id` i bez pól statusu) plus `savedAt`. Bez TTL. Dostęp tylko właściciela (także admin nie czyta cudzych).
- `refreshLog/{YYYY-MM-DD}`: `day`, `complete` (dzień pobrany po jego zakończeniu), `refreshedAt`, `refreshedBy`, `expireAt` (TTL).
- `comments/{auto-id}`: wspólne komentarze do przetargów (wątek, wielu autorów). Pola: `tenderId` (id dokumentu w `tenders`), `publicationDate` (`YYYY-MM-DD`, musi zgadzać się z przetargiem), `text` (1–1000 znaków), `authorUid`, `authorEmail`, `createdAt` (czas serwera), `expireAt` (TTL: ok. 30 dni od utworzenia, reguły dopuszczają najwyżej 31). Jedna płaska kolekcja, żeby klient nasłuchiwał jednym zapytaniem po zakresie dat (`publicationDate`), tak jak przetargów. Komentarz wygasa razem z przetargiem; kopia z gwiazdką komentarzy nie zachowuje.
- `users/{uid}`: `email`, `role`, `createdAt`, `invitedBy`. Zapis tylko przez Functions.
- `meta/refreshLock`: blokada odświeżania, tylko serwer.
- Polityki TTL na polu `expireAt` kolekcji `tenders` i `refreshLog` są w `firestore.indexes.json`.

### Reguły (`firestore.rules`)
Dostęp daje wyłącznie custom claim `role` ∈ {`admin`, `member`} (samo zalogowanie nie wystarcza, bo konto może założyć każdy znający publiczny klucz API). `users`: odczyt własnego dokumentu lub wszystkich dla admina, zapis tylko przez Functions. `users/{uid}/favorites`: pełny dostęp tylko właściciela z rolą. `tenders`: odczyt dla członków; klient nie tworzy ani nie usuwa dokumentów, może jedynie zmienić pola statusu (`affectedKeys().hasOnly([...])`) na poprawny komplet albo je usunąć. `refreshLog`: odczyt dla członków, zapis tylko serwer. `comments`: odczyt dla członków; utworzenie tylko dla istniejącego przetargu z zgodnym `publicationDate`, z własnym uid i e-mailem z tokenu, `createdAt` = czas serwera, tekst 1–1000 znaków, `expireAt` w przyszłości i najdalej za 31 dni, dokładny zestaw pól; brak edycji; usuwa tylko autor (także admin cudzego nie usunie). Reszta zamknięta.

### Frontend (`src/`, React 19, CRA, TypeScript 4.9, CSS Modules)
- `firebase.ts`: inicjalizacja SDK (Auth, Firestore, Functions w `europe-central2`), łączenie z emulatorami przy `REACT_APP_USE_EMULATORS=true`.
- `context/AuthContext.tsx`, `components/LoginScreen.tsx`, `NoAccessScreen.tsx`, `UserBar.tsx`, `AdminPanel.tsx` (zaproszenia, lista użytkowników), `Auth.module.css`. `App.tsx` ma bramkę dostępu (logowanie → rola → aplikacja).
- `components/tenders.tsx`: główny komponent; nasłuch przetargów (`subscribeToTenders`), odświeżanie (`refresh`, w trybie zakresu po kolei brakujące dni z paskiem postępu, ponawianie przy zajętej blokadzie), filtry, statystyki.
- `utils/tendersApi.ts` (Firestore + callable), `tenderMapping.ts` (dokument → typ `Tender` w formacie interfejsu, daty `DD-MM-RRRR`), `refreshPlan.ts` (które dni pobrać), `dateUtils.ts` (`toDayString`, `addDays`, `parseDate`), `tenderFilters.ts` (filtrowanie i sortowanie po dacie, a w dniu po godzinie), `cpvCodes.ts` (**jedyne źródło prawdy: lista CPV IT wraz z oficjalnymi nazwami**), `cpvFilter.ts` i `cpvMapping.ts` (filtr i nazwa na karcie, oba z `cpvCodes.ts`). Kody o niskiej trafności (np. pomoce dydaktyczne, nadzór wideo) zostają celowo, bo zamawiający często błędnie klasyfikują przetargi ze sprzętem IT, `calculateStatistics.ts`.
- **Statusy i gwiazdki (etap 4):**
  - `types/TenderStatus.ts` i `utils/tenderStatus.ts`: jedyne źródło prawdy dla 4 statusów (nazwa, ikona, kolor: `toEnter` ✎ niebieski, `entered` ✓ zielony, `toClarify` ? bursztynowy, `notToEnter` ✕ czerwony) oraz podpowiedzi z autorem (`statusTooltip`).
  - `types/Tender.ts` ma `id` (id dokumentu; **kluczem w interfejsie jest `id`, nie `publicationNumber`**, bo numery nie są unikalne między źródłami) oraz opcjonalne `status`, `statusByEmail`, `statusAt`.
  - `context/UserPreferencesContext.tsx` (nazwa zachowana): nasłuch gwiazdek z `users/{uid}/favorites`, `toggleFavorite`, `toggleStatus` (ponowne wybranie statusu go zdejmuje), `actionError`. Status czytany jest z samego przetargu, nie z kontekstu.
  - `utils/tendersApi.ts`: `setTenderStatus`, `subscribeToFavorites`, `addFavorite`, `removeFavorite`; `tenderMapping.ts`: `favoriteToDoc` / `favoriteFromDoc`.
  - `TenderCard.tsx`: 4 przyciski statusu + gwiazdka; kolor karty przez zmienną CSS `--status-color`; podpowiedź (atrybut `title`) z autorem. `FiltersPanel.tsx`, `calculateStatistics.ts`, `StatisticsTab.tsx` generują statusy z konfiguracji.
  - `tenders.tsx`: zakładki **Przetargi / Zapisane / Statystyki**. Zagwiazdkowany przetarg znika z głównej listy użytkownika i jest w „Zapisane" (niezależnie od zakresu dat, te same filtry). Status można zmienić tylko dla przetargu, który jest jeszcze w bazie wspólnej w wybranym zakresie (`canSetStatus`); kopia z „Zapisane", której oryginał wygasł, ma samą gwiazdkę. Statystyki liczą listę główną (bez własnych gwiazdek).
  - Stare statusy i ulubione z `localStorage` zostały porzucone zgodnie z ustaleniem (bez migracji).
- **Statystyki (2026-10-30, zacommitowane i wypchnięte, nieoglądane przez agenta w przeglądarce):** użytkownik sprawdził i zaakceptował całość.
  - **Klikalne statystyki:** `StatisticsTab` dostaje `onDrillDown`; kliknięcie statusu, źródła, typu zamówienia, miasta, zamawiającego lub kodu CPV woła `handleStatisticsDrillDown` w `tenders.tsx`, które zastępuje filtr tego rodzaju i przełącza na zakładkę „Przetargi”. Typ `StatisticsDrillDown` jest w `StatisticsTab.tsx`.
  - **Statystyki liczą się z listy po filtrach** (`displayedTenders`), więc filtr ustawiony na liście zmienia też statystyki (np. filtr TED ukrywa wykres godzinowy eZamówień, bo ten potrzebuje eZamówień z godziną publikacji). Dlatego nad statystykami jest pomarańczowy pasek z przyciskiem „Wyczyść filtry”, gdy jakikolwiek filtr jest aktywny.
  - **Wyczyść filtry:** `FiltersPanel` (przycisk w sekcji statusów) → `handleClearFilters` w `tenders.tsx`: wyszukiwanie, źródła, typy, zamawiający, miasto, kod CPV, filtry statusu. **Nie rusza** przełącznika „Wszystkie / IT” w nagłówku (`isFiltered`, to tryb widoku) ani dat. `hasActiveFilters` też ich nie liczy.
  - **Filtry po usprawnieniach (2026-10-30, niezacommitowane do czasu zgody):** zamawiający, miasta i kody CPV to listy (`selectedBuyers/Cities/Cpvs`; pusta = brak filtra, wybrane pozycje łączy „lub”, różne filtry „oraz”). Panel boczny (`BuyersSidebar`) dostaje przetargi po wszystkich filtrach poza własnym (`filterTenders(..., skip)`), więc da się wybrać kilka pozycji; wybrane bez wyników zostają z zerem. Liczniki przy źródłach, typach i statusach (`countFacets`) liczą wynik po pozostałych filtrach, bez własnego. Sortowanie (`sortOrder`: publikacja / termin / zamawiający; po terminie: nadchodzące, potem przeterminowane, na końcu „Brak terminu”). Filtry i sortowanie pamięta `localStorage` (`src/utils/persistedFilters.ts`, klucz z uid konta); **nie** pamięta frazy wyszukiwania, dat ani trybu „Wszystkie / IT”. Tryb „Wszystkie / IT” zaczyna zawsze od IT (`isFiltered` domyślnie `true`); „All tenders” pokazuje wszystkie branże do przeładowania strony.
  - **Filtr po kodzie CPV:** nowy `selectedCpv` w `FilterOptions` (`tenderFilters.ts`), dopasowanie bez cyfry kontrolnej. Aktywny kod pokazuje znacznik nad listą (`FiltersPanel`), zdejmowany ✕.
  - **Top 10 kodów CPV (IT):** `topCpvCodes` w `calculateStatistics.ts`; liczone są tylko kody z `cpvCodes.ts` (mają oficjalne nazwy), kod powtórzony w jednym przetargu liczy się raz, przetarg z kilkoma kodami wchodzi do kilku pozycji.
  - **Postęp przeglądania:** `utils/statusFunnel.ts` (`buildStatusFunnel`) i sekcja na górze statystyk: wszystkie, ze statusem, bez statusu, każdy status; udziały względem wszystkich przetargów (statusy nie są zagnieżdżone, więc to nie jest prawdziwy lejek).
  - **Porównanie z poprzednim okresem:** `utils/comparison.ts` (`getComparisonPeriod`, `previousWorkingDay`, `describePeriod`, `formatDelta`) wybiera okres: dla jednego dnia poprzedni dzień roboczy (poniedziałek → piątek; święta nie są uwzględniane), dla zakresu okres tej samej długości tuż przed nim; poza 30 dniami wstecz (TTL) porównanie jest niedostępne. `hooks/usePreviousPeriod.ts` nasłuchuje przetargów tego okresu **tylko, gdy otwarta jest zakładka statystyk**, i sprawdza w `refreshLog`, czy wszystkie jego dni są kompletne. Gdy nie, widok **nie porównuje** (fałszywy spadek), tylko oferuje przycisk „Pobierz dane z tego okresu” (woła `refreshTenders` dla brakujących dni). Poprzedni okres jest filtrowany tymi samymi filtrami i bez gwiazdek użytkownika. Różnice pokazują: licznik wszystkich, kafelki statusów i źródła. Jeśli bieżący okres obejmuje dzisiaj, pasek dopisuje, że liczby jeszcze rosną.
- **Statystyki na telefonie i porządki w kafelkach (2026-10-30; tylko `StatisticsTab.tsx`, `StatisticsTab.module.css`, `tenders.tsx`; sprawdzone typami, lintem i testami, wyglądu w przeglądarce agent nie widział):**
  - **Mobile (`@media (max-width: 768px)`):** sekcja „Postęp przeglądania” ma klasę `desktopOnly` i jest ukryta. Wykres godzinowy eZamówień jest na mobile poziomy (`.hourlyRows`: godziny w pionie, słupek w prawo, liczba obok), a pionowy (`.hourlyChartVertical`) ukryty; na desktopie odwrotnie. Oba widoki renderują się z tych samych danych (`hourlyData`). Poprzednio pionowy wykres miał 24 kolumny po min. 36 px i na telefonie widać było tylko pierwsze godziny. Wykres „Porównanie źródeł w czasie” zostawiony z przewijaniem w poziomie.
  - **Usunięte kafelki:** „W tym tygodniu”, „Opublikowanych dzisiaj”, „Nadchodzących deadline” i „Zapisanych” (razem z propem `savedCount`). Powód: statystyki dostają tylko przetargi z wybranego dnia/zakresu, a te liczniki liczyły od bieżącej daty, więc przy jednym dniu dublowały „Wszystkich przetargów” albo pokazywały 0 po przełączeniu na wczoraj. Zostały „Wszystkich przetargów” i kafelki statusów. Pola `deadlineStats` i `dateStats` w `calculateStatistics.ts` są nadal liczone, ale nic ich nie wyświetla (można usunąć razem z testami, jeśli jakieś są).
  - **Zwijany „Postęp przeglądania”:** przycisk −/+ w prawym górnym rogu sekcji; stan w `localStorage` pod kluczem `statistics.funnelCollapsed` (globalny, nie per konto; przy zablokowanym `localStorage` działa do odświeżenia strony).
  - Uwaga z pracy: nie zapisuj plików CSS przez `Set-Content -Encoding UTF8` w PowerShell 5.1 (dodaje BOM) ani przez zakres indeksów, który może uciąć koniec pliku; do edycji używaj narzędzia Edit.
- **Link do dokumentacji (2026-10-30):** `Tender.documentsUrl` (opcjonalne, mapowane w `tenderFromDoc` i `favoriteFromDoc`). `TenderCard.tsx` pokazuje obok „Zobacz ogłoszenie” przycisk „Dokumentacja”, gdy adres istnieje; oba przyciski są w kontenerze `.links` (`flex`, `gap: 8px`, `flex-wrap`) w `Tenders.module.css`. Zaakceptowane przez użytkownika na localhost.
- **Czas ostatniej aktualizacji w headerze:** `subscribeToLastRefresh` (`tendersApi.ts`) nasłuchuje na żywo najnowszego wpisu `refreshLog` (po `refreshedAt`) i header pokazuje „Ostatnia aktualizacja: dziś 14:32” (`formatRelativeTime` w `dateUtils.ts`). Wpis powstaje tylko po w pełni udanym odświeżeniu (oba źródła), więc nieudane odświeżenie napisu nie zmienia. Pokazuje ostatnie odświeżenie dowolnego dnia, nie wybranego w kalendarzu.
- **Rodzaj zamówienia dla TED:** `orderType` jest teraz wyliczany także dla TED; `tenderFilters.ts` filtruje po typie dla wszystkich źródeł (przetargi bez znanego typu zostają widoczne), a przyciski „Typy” w `FiltersPanel.tsx` pokazują się, gdy wybrano TED lub eZamówienia.
- **Komentarze (dymek na karcie):** `CommentsPopover.tsx` + `Comments.module.css` (przycisk z licznikiem, okienko z wątkiem, pole na nowy komentarz, Ctrl+Enter, Escape/klik poza zamyka, ✕ przy własnych), `hooks/useComments.ts` (nasłuch zakresu dni, `addComment`, `deleteComment`, `commentsError`), `utils/tendersApi.ts` (`subscribeToComments`, `addComment`, `deleteComment`), `utils/comments.ts` (grupowanie, `normalizeCommentText`, `MAX_COMMENT_LENGTH`), `types/TenderComment.ts`, `commentFromDoc` w `tenderMapping.ts`. `TenderCard` pokazuje dymek tylko gdy `canComment` (= przetarg jest jeszcze na wspólnej liście, jak przy statusie). Błędy komentarzy wyświetla `tenders.tsx` obok pozostałych komunikatów.

## 6. Testy i weryfikacja

| Polecenie | Zakres | Wynik (ostatnio uruchomione 2026-10-29/30; `test:functions` nie był uruchamiany po zmianie `contract-nature`) |
|---|---|---|
| `npm run test:unit` | mappery, daty (po zbudowaniu funkcji) | 17/17 |
| `npm run test:rules` | reguły Firestore na emulatorze (w tym statusy, gwiazdki i komentarze) | 37/37 |
| `npm run test:functions` | `inviteUser` + `listUsersStatus` + `refreshTenders` na emulatorach, z lokalnym serwerem udającym TED i eZamówienia | 22/22 (2026-11-01) |
| `$env:CI='true'; npx react-scripts test --watchAll=false` | testy frontendu (Jest): mapowanie, statusy, kopia gwiazdki, filtry (w tym typ zamówienia), statystyki, plan odświeżania, komentarze, formatowanie czasu | 69/69 |
| `npx tsc --noEmit -p tsconfig.json` | typy frontendu | bez błędów |
| `npx eslint src --ext ts,tsx` | lint | bez ostrzeżeń |
| `$env:CI='false'; npm run build` | build | przechodzi (ostrzeżenia o mapach źródeł `react-datepicker` są stare); w buildzie nie ma już pliku `config/api.ts` |

Testy emulatorów wymagają Javy w `PATH` (sekcja 3). Test integracyjny już raz wykrył realny błąd (`admin.firestore.FieldValue` jest `undefined` przy `import * as admin` w firebase-admin 13; używaj importów modułowych `firebase-admin/firestore`, `/auth`).

Na prawdziwych API (projekt testowy) `refreshTenders` zweryfikowano ręcznie: ok. 900 przetargów dziennie (ok. 75–90 z TED, reszta z eZamówień), 2–4 s na dzień, drugie wywołanie dopisuje 0.

**Zweryfikowane przez użytkownika w przeglądarce (projekt testowy):** pobieranie dnia i zakresu dat, statusy (4 stany, kolory, podpowiedź z autorem), gwiazdki i zakładka „Zapisane", współdzielenie statusów między dwoma kontami. Poprawiony został błąd licznika „Przetargi" zmieniającego się z zakładką (`5a95234`).

Po etapie 4 użytkownik sprawdził w przeglądarce i zaakceptował: napis o ostatniej aktualizacji, rodzaj zamówienia z TED (znaczniki i filtr) oraz komentarze (dodawanie, widoczność dla drugiej osoby). Przy pierwszym teście komentarzy okienko było puste mimo zapisów; nie udało się tego odtworzyć (testy w headless Chrome na buildzie i na serwerze dev przeszły), a po chwili zaczęło działać. Hipoteza: nasłuch otwarty przed wdrożeniem reguł dostał `permission-denied` i nie wznawia się bez przeładowania strony. Niezweryfikowana.

**Niezweryfikowane lub czekające na użytkownika:**
- Ścieżka ponawiania po 429 przetestowana tylko atrapą; na prawdziwym TED jeszcze nie wystąpiła (wcześniej raz wystąpił sam 429).
- Workflow GitHub Actions został uruchomiony 2026-11-01 i po poprawce przechodzi (patrz etap 5).
- Układ na telefonie i w ciemnym motywie dla nowych elementów (4 przyciski statusu, zakładka „Zapisane”, okienko komentarzy, napis o aktualizacji w headerze) nie był oglądany przez agenta; użytkownik zaakceptował całość bez uwag.
- Po testach UI agenta mogły zostać puste dokumenty `users/{uid}` po tymczasowych kontach testowych w projekcie testowym (konta usunięto, usunięcie dokumentów zablokował klasyfikator uprawnień). Nieszkodliwe; można usunąć po uzgodnieniu z użytkownikiem.

## 7. Odkrycia o źródłach danych (ważne, nie do powtórnego odkrywania)

- **TED v3 search działa bez klucza API.** Zapytanie bez nagłówka `Authorization` zwraca dane. Zapytanie: `buyer-country=POL AND publication-date=RRRRMMDD AND classification-cpv=teeq AND notice-type=cn-standard` (zachowane z oryginału). Strona 250. TED zwraca `429` przy kilku odświeżeniach pod rząd.
- **eZamówienia (`mo-board/api/v1/Board/Search`):** maks. 10 rekordów na stronę niezależnie od `PageSize`. **Filtr dat w formacie ISO z `Z` jest zawodny** (zwraca też następny dzień), więc używamy samych dat (dzień poprzedni i wybrany), a wynik przycinamy do dnia w `Europe/Warsaw`. Daty z API mają 7 cyfr ułamka sekundy, więc są ucinane do milisekund przed parsowaniem. Poprzednia wersja frontendu zawyżała przez to liczbę przetargów dla dni z przeszłości.
- **Linki do dokumentacji (zbadane 2026-10-30):**
  - **TED:** pole `document-url-lot` (BT-15) jest tablicą adresów, po jednym na lot, często powtórzonych (w jednym ogłoszeniu ponad 100 razy). Dla ogłoszeń z PL z 2026-10-29 było wypełnione w 96 ze 100 (po mapperze 72 z 74). `document-restricted-url-lot` było puste wszędzie; `submission-url-lot` (adres składania ofert) bywa wypełnione, ale go nie używamy. Adresy prowadzą na platformy zamawiających (platformazakupowa.pl, e-propublico, logintrade, czasem ezamowienia.gov.pl).
  - **eZamówienia:** `Board/Search` nie zwraca adresu dokumentacji (`htmlBody` i `pdfUrl` są `null`). Zwraca `tenderId` (`ocds-148610-...`). `https://ezamowienia.gov.pl/mp-client/search/list/<tenderId>` otwiera stronę postępowania (sprawdził użytkownik), ale dokumenty bywają tam puste, bo nie każdy zamawiający publikuje je w eZamówieniach. `https://ezamowienia.gov.pl/mp-client/tenders/<tenderId>` przekierowuje na stronę główną (nie używać). Prawdziwy adres dokumentacji jest w treści ogłoszenia BZP; czy da się go wziąć z osobnego endpointu szczegółów, **nie sprawdzono**.
  - **Pułapka testowa:** `ezamowienia.gov.pl/mp-client/...` to aplikacja jednostronicowa i zwraca HTTP 200 z identyczną treścią (2343 bajty) dla każdego adresu, także z fałszywym ID. Test samym HTTP nic nie mówi o tym, czy link działa; trzeba otworzyć go w przeglądarce.
- Stare pola/ID: oryginalna klasa `Notice` i dd-MM-yyyy zostały zastąpione; `Tender` w interfejsie nadal ma daty `DD-MM-RRRR`, mapowane w `tenderMapping.ts`.

## 8. Kolejne kroki

### Etapy 0–4 i późniejsze usprawnienia: zrobione
Szczegóły w `docs/plan.md` (sekcja „Status"). Etap 4 (wspólne statusy, indywidualne gwiazdki, zakładka „Zapisane") jest wdrożony na projekt testowy i sprawdzony przez użytkownika.

Po etapie 4 dodano (2026-10-29/30, wszystko zacommitowane i wypchnięte): czas ostatniej aktualizacji w headerze, rodzaj zamówienia z TED (z backfillem na projekcie testowym i wdrożeniem `refreshTenders`), komentarze do przetargów (reguły + TTL wdrożone na projekt testowy), a potem usprawnienia statystyk (klikalne elementy, przycisk „Wyczyść filtry”, top kody CPV, postęp przeglądania, porównanie z poprzednim dniem roboczym; wszystko tylko we frontendzie, bez zmian reguł i funkcji). Opis w sekcji 5.

Potem (2026-10-30) link do dokumentacji z TED (`documentsUrl`, przycisk „Dokumentacja”, skrypt `backfillDocumentsUrl.js`). Przed wdrożeniem na produkcję (2026-11-01) uruchomiono wszystkie testy lokalnie: `test:unit` 17/17, `test:rules` 37/37, `test:functions` 20/20, Jest 69/69, `tsc` bez błędów, build przechodzi. Backfill `documentsUrl` na produkcji jest zbędny, bo Firestore produkcyjny był nowy i pusty.

### Następne zadanie wybrane przez użytkownika: Baza Konkurencyjności (research zrobiony, kod nie)
Użytkownik wybrał to źródło jako pierwsze z listy usprawnień. Stan i plan: `docs/research-baza-konkurencyjnosci.md`. Pierwszy krok: test, czy numery, które 2026-10-30 zwracały 404, pojawiły się później (decyduje o projekcie kursora; sekcja 6 tamtego pliku). Użytkownik zaznaczył „nie spieszy mi się”: nie buduj, dopóki nie wskaże zadania.

### Porządki z etapu 5: zrobione
- `README.md` przepisany (logowanie, Firebase, emulatory, testy, wdrożenie).
- Usunięto pozostałości klucza TED: `scripts/createApiConfig.js` (zapisywał klucz do pliku `build/static/js/config/api.ts`, który trafiał na hosting), jego wywołanie w `npm run build`, krok „Create API config" w workflow i wpis w `.gitignore`. Klucz TED nie jest już nigdzie potrzebny.
- Workflow `firebase-deploy.yml` buduje teraz z sekretami `REACT_APP_FIREBASE_*` (do ustawienia w repozytorium, patrz niżej).

### Etap 5: wdrożenie na produkcję (ZROBIONE 2026-11-01)
Projekt produkcyjny to `tendersted`. Zrobione, w tej kolejności:
- Użytkownik włączył Authentication (email i hasło) i Firestore, dodał sekrety `REACT_APP_FIREBASE_*` w repozytorium (`FIREBASE_SERVICE_ACCOUNT` i `FIREBASE_PROJECT_ID` istniały i wskazują `tendersted`).
- Na wyraźną zgodę wdrożono na `tendersted` reguły, indeksy (TTL) i funkcje `inviteUser`, `refreshTenders`. Pełne `firebase deploy --only functions` odmawia, dopóki w projekcie są funkcje spoza kodu (`api`, `getApiKey`), więc wdrażano po nazwach (`--only functions:inviteUser,functions:refreshTenders`). `inviteUser` przy pierwszej próbie nie powstała (409 przy tworzeniu bucketu źródeł, wyścig z drugą funkcją); ponowienie samej funkcji przeszło.
- Admin założony skryptem `setAdmin.js <projectId> <email>` (użytkownik, osobny terminal). Użytkownik usunął stare funkcje `api` i `getApiKey` (`npx firebase functions:delete ... --region us-central1`; `firebase` nie jest globalne, trzeba `npx`) oraz sekret `API_KEY`.
- PR #4 zmergowany do `main`. Pierwsze uruchomienie workflow wywaliło się na `npm ci` (Node 20 / npm 10 odrzuca lockfile wygenerowany przez npm 11: brak `@types/node@26` i `undici-types`). Poprawka: `node-version: '24'` w `firebase-deploy.yml` (commit `efba7d9`); workflow przeszedł na zielono, a użytkownik potwierdził, że aplikacja działa. Polityka czyszczenia obrazów (1 dzień) już istniała.
- **Do zrobienia przez użytkownika:** unieważnić klucz TED w portalu TED (był publicznie dostępny przez `getApiKey`; nowa wersja go nie używa). Nie wiadomo, czy zrobione. Alert budżetowy: nie potwierdzono.
- **Sprawdzone przez użytkownika na produkcji:** logowanie admina, odświeżanie przetargów oraz zapraszanie innych osób przez `inviteUser` działają.
- Każdy push do `main` (także zmiana samej dokumentacji) wdraża hosting na produkcję. Reguły i funkcje nadal wdraża się ręcznie, z jawnym `--project`, po wyraźnej zgodzie użytkownika.

### Status aktywacji kont w panelu admina (ZROBIONE 2026-11-01)
- Dodano funkcję `listUsersStatus` i przycisk „Nowy link” w `AdminPanel.tsx` (commit `a9e2a71` w `main`). Użytkownik sprawdził na produkcji, że lista ze statusami działa.
- **Kolejność wdrożenia ma znaczenie:** workflow wdraża tylko hosting, więc funkcję trzeba wdrożyć ręcznie: `npx firebase deploy --only functions:listUsersStatus --project tendersted` (i `--project tenders-test-b5bb3` dla testu). Frontend bez wdrożonej funkcji pokazuje w oknie „Użytkownicy” błąd `functions/internal` (wywołanie nieistniejącej funkcji). Funkcja jest wdrożona na obu projektach.
- Uwaga: aktywny projekt CLI w tym katalogu to `test`, więc `firebase functions:list` i `functions:log` bez `--project` dotyczą testu, nie produkcji.
- Przy wdrożeniu na `tendersted` CLI zgłosiło „No cleanup policy detected for repositories in europe-central2” i zakończyło się błędem przy ustawianiu polityki (funkcja została wdrożona). Polityka dla `europe-central2` prawdopodobnie nie jest ustawiona (wcześniejsza notatka o polityce 1 dzień mogła dotyczyć innego regionu). Do ustawienia: `npx firebase functions:artifacts:setpolicy --project tendersted` (opcjonalne, chodzi o niewielki koszt obrazów).

### TYMCZASOWO: otwarty dostęp bez logowania (gałąź `temp/open-access`)
- Na prośbę użytkownika logowanie jest na kilka dni wyłączone. Aplikacja loguje odwiedzających **anonimowo** (Firebase Anonymous Auth), bez ekranu logowania; anonimowy ma rolę `member` po stronie UI. Reguły Firestore (`hasRole()` = `request.auth != null`) i `requireMember` w funkcjach wpuszczają każdego zalogowanego, także anonimowo. W statusach i komentarzach anonimowy podpisuje się jako „Gość”. Gwiazdki są per przeglądarka (uid anonimowy), a po wyczyszczeniu danych strony znikają.
- **Wymaga ręcznie:** włączenia Anonymous w Firebase Console (Authentication → Sign-in method) oraz wdrożenia reguł i funkcji (`firestore:rules`, `functions:refreshTenders`) na właściwy projekt. Bez włączonego Anonymous aplikacja pokaże zwykły ekran logowania.
- **Skutki:** każdy, kto zna adres, czyta przetargi i komentarze, zapisuje statusy i komentarze oraz może uruchomić pobieranie z TED. Panel „Użytkownicy” widać tylko po zalogowaniu kontem admina (sesja admina zalogowanego wcześniej zostaje, wylogowany nie ma jak się zalogować).
- **Obecność i logowanie z poziomu aplikacji:** każda karta zapisuje puls co minutę w `presence/{uid}` (`lastSeen`, `expireAt` z TTL, `isAnonymous`, `email`); odczyt ma tylko admin. Panel „Użytkownicy” pokazuje sekcję „Teraz na stronie” (puls młodszy niż 2,5 min), a przycisk ma licznik. Gość widzi w pasku „Zaloguj się” (okno logowania), dzięki czemu admin może wejść na dowolnym urządzeniu. Wymaga wdrożenia reguł i indeksów (`firestore:rules,firestore:indexes`) oraz hostingu.
- **Powrót do logowania:** `git revert` commita „Temporarily open access” i ponowne wdrożenie reguł oraz funkcji (`npx firebase deploy --only firestore:rules,functions:refreshTenders --project tendersted`) i hostingu (push do `main`). Opcjonalnie wyłączyć Anonymous w konsoli i usunąć konta anonimowe.

### Znane drobiazgi (poza zakresem, do decyzji użytkownika)
- `axios` jest w `dependencies`, ale nic w `src/` go nie używa; `puppeteer` (devDependency) służy tylko skryptowi `scripts/generate-favicon.js`.
- Zakładka „Zapisane (n)" pokazuje liczbę wszystkich gwiazdek, a „Przetargi (n)" liczbę po filtrach.

### Pomysły na później (poza minimum, bez decyzji)
Link do dokumentacji dla eZamówień: sprawdzić, czy endpoint szczegółów ogłoszenia BZP zwraca adres dokumentacji (pole „adres strony prowadzonego postępowania”), i ocenić koszt zapytań (Board/Search daje 10 rekordów na stronę, więc osobne wołanie na każde ogłoszenie to setki zapytań dziennie). Do tego czasu dla eZamówień jest tylko link do ogłoszenia.

Lista z rozmowy z 2026-10-30 (poza Bazą Konkurencyjności, którą użytkownik już wybrał): zaplanowane pobieranie raz dziennie z powiadomieniem e-mail o nowych przetargach; widok terminów składania ofert dla statusów „do wpisania”; zapisane filtry; eksport zaznaczonych przetargów do CSV/Excela z komentarzami; dłuższe przechowywanie przetargów ze statusem „wpisane”; historia zmian statusu; wyłączanie użytkowników w panelu admina; wsparcie usług serwisowych/dzierżawy (np. środowisko wydruku) w TED — użytkownik chce to zbadać dopiero na konkretnym przykładzie przetargu, który się nie załapał.

Starsze pomysły: Baza Konkurencyjności (scraping, świadomie pominięta); usuwanie lub wyłączanie użytkowników z panelu admina; historia zmian statusu; zapytania po stronie serwera, gdyby koszt odczytów zakresów miesięcznych (kilkanaście tysięcy dokumentów na wczytanie) zaczął przeszkadzać.

## 9. Szybki start nowej sesji

1. Przeczytaj `docs/CLAUDE.md`, `docs/goals.md`, `docs/plan.md` i ten plik. Jeśli zadanie dotyczy Bazy Konkurencyjności, przeczytaj też `docs/research-baza-konkurencyjnosci.md`. `git status` i `git log --oneline -15` na gałęzi `feature/shared-tenders`.
2. Sprawdź środowisko: Java w `PATH` (sekcja 3), `npx firebase use` (powinno być `test`), `npm run test:unit`.
3. Zapytaj użytkownika, co chce zrobić dalej: produkcja działa od 2026-11-01, więc kolejne funkcjonalności i usprawnienia (jeszcze nie opisane) idą na osobnej gałęzi, sprawdzane najpierw na projekcie testowym. Nową pracę planuj w małych krokach (reguły i testy reguł → model i kontekst → interfejs), tak jak etapy 1–4, i pamiętaj o zasadach z sekcji 2.
