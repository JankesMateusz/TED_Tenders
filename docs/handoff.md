# Przekazanie pracy: stan projektu i kolejne kroki

Ten plik jest dla agenta rozpoczynającego nową sesję. Czytaj go razem z `docs/CLAUDE.md` (zasady pracy), `docs/goals.md` (cel), `docs/plan.md` (etapy i ustalenia) oraz `docs/code-review-notes.md` (uwagi z przeglądu kodu). Stan na 2026-10-29.

## 1. Projekt w skrócie

Aplikacja do przeglądania zamówień publicznych na sprzęt IT (TED i eZamówienia; Baza Konkurencyjności jest świadomie pominięta, bo wymaga web scrapingu, a właściciel nie chce tego robić). Analityk tworzy z niej raporty dla firm. Cel prac: kilka zaproszonych osób ma widzieć **wspólną** listę przetargów i **wspólne** oznaczenia (patrz `docs/goals.md`). Rozbudowa aplikacji dopiero po osiągnięciu tego minimum.

Użytkownik komunikuje się po polsku. Odpowiadaj po polsku, zwięźle, z uzasadnieniem istotnych decyzji technicznych. Commity są po angielsku.

## 2. Zasady współpracy ustalone w tej pracy

- **Zasady z `docs/CLAUDE.md` obowiązują.** Najważniejsze: najpierw poznaj kod, ograniczaj zakres zmian, nie twierdź, że coś działa, jeśli tego nie sprawdziłeś, i raportuj uczciwie, co zweryfikowano, a co nie.
- **Commity i pushe tylko za wyraźną zgodą.** Dotychczas pytałem przed każdą porcją commitów i pushem. Commit message kończy się linią współautora podaną w system-reminderze sesji (do tej pory: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`).
- **Nic nie wdrażaj na produkcję** (projekt `tendersted`). Wszystko robimy na projekcie testowym `tenders-test-b5bb3` i na emulatorach. Merge do `main` uruchamia GitHub Actions i wdraża hosting na produkcję (patrz sekcja 8).
- Użytkownik pytany o decyzje odpowiada konkretnie. Nie pytaj o rzeczy, które da się rozstrzygnąć rozsądnym domyślnym wyborem; opisz założenie i idź dalej.
- Użytkownik sprawdza zmiany w przeglądarce sam i raportuje wyniki. Nie widziałeś interfejsu na żywo, więc zawsze zaznaczaj, co zweryfikowano tylko typami, buildem i testami.

## 3. Środowisko (Windows 11, PowerShell 5.1)

- **Katalog projektu:** `C:\Users\janke\Desktop\Projekty\TED_Tenders-main`. Repozytorium: `https://github.com/JankesMateusz/TED_Tenders.git`. Gałąź robocza: `feature/shared-tenders` (wypchnięta na `origin`, 13 commitów przed `main`). `main` nie ruszamy do etapu 5. Lokalna gałąź `master` to stary, zbędny commit z `git init` (zawiera `node_modules`); można ją usunąć za zgodą użytkownika.
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
| `tenders-test-b5bb3` | testowy | Authentication (email i hasło) włączone, Firestore `(default)` w `europe-central2`, wdrożone funkcje `inviteUser` i `refreshTenders` (Node 22, `europe-central2`), reguły i indeksy z TTL, polityka czyszczenia obrazów 1 dzień. Jest tu konto admina użytkownika (rola `admin`). Dane testowe (kilka tysięcy dokumentów `tenders`) wygasają same po 30 dniach. |
| `tendersted` | **produkcja** | Stary kod: hosting, funkcje `api` (`/tedProxy`, `/health`) i `getApiKey` w `us-central1` oraz sekret `API_KEY` w Secret Managerze. **Publiczny `getApiKey` zwraca klucz TED każdemu.** Nie ma tam Authentication ani Firestore skonfigurowanych pod nową wersję. |

Pozostałe projekty na koncie (`tenders-app-32189`, `tendersapptests`) nie są częścią tych prac.

Konfiguracja webowa testowego projektu jest w `.env.local` (poza Gitem; wzór w `.env.example`). `REACT_APP_USE_EMULATORS=false` oznacza połączenie z projektem testowym, `true` z lokalnymi emulatorami.

## 5. Architektura (stan obecny)

**Przepływ:** przeglądarka czyta przetargi z Firestore (nasłuch na żywo). Przy wejściu, zmianie dnia i po kliknięciu „Odśwież" woła funkcję `refreshTenders`, która pobiera dane ze źródeł po stronie serwera i dopisuje tylko brakujące przetargi.

### Functions (`functions/`, TypeScript, Node 22, firebase-functions v6, firebase-admin v13)
- `index.ts`: `initializeApp()` i eksporty `inviteUser`, `refreshTenders`.
- `access.ts`: `REGION = 'europe-central2'`, `requireMember`, `requireAdmin` (rola z custom claim `role`).
- `users.ts`: `inviteUser` (tylko admin): zakłada konto, nadaje rolę `member` (istniejącej nie zmienia), zapisuje `users/{uid}`, zwraca link do ustawienia hasła, który admin przekazuje osobie ręcznie.
- `tenders/`:
  - `refresh.ts`: `refreshTenders({date?})` (rola admin lub member): dzień domyślnie dzisiejszy w `Europe/Warsaw`, dopuszczalne ostatnie 31 dni, bez przyszłości. Blokada `meta/refreshLock` (6 min, zwalniana w `finally`). Po w pełni udanym odświeżeniu zapis `refreshLog/{dzień}`.
  - `ted.ts`, `ezamowienia.ts`: pobieranie i mapowanie do wspólnego modelu; `model.ts` (typ `TenderRecord`, `tenderId`); `dates.ts` (strefa Warsaw); `store.ts` (`saveNewTenders`); `http.ts` (ponawianie po 429/502/503/504).
- `scripts/setAdmin.js`: nadaje rolę admina (tworzy konto, jeśli go nie ma). Wymaga podania `projectId`. Na emulatorze przyjmuje hasło (ustaw `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`), na prawdziwym projekcie wypisuje link do ustawienia hasła.
- `.env.demo-tenders`: ładowane tylko dla projektu `demo-tenders` (testy), kieruje źródła na lokalny serwer testowy i skraca opóźnienia ponawiania.
- Usunięte: `getApiKey`, `/tedProxy`, Express, Secret Manager (wyszukiwanie TED v3 jest publiczne, więc klucz nie jest potrzebny).

### Model danych (Firestore)
- `tenders/{źródło}_{numer}`: id z `/` i spacjami zamienionymi na `_` (numery eZamówień zawierają `/`). Pola: `source` (`TED` | `E_ZAMOWIENIA`), `publicationNumber`, `title`, `buyerName`, `buyerCity`, `country`, `publicationDate` (`YYYY-MM-DD`, czas warszawski), `publicationTime` (`HH:MM` lub `null`), `deadlineDate` (`YYYY-MM-DD` lub `null`), `cpvCodes[]`, `link`, `orderType` (`Delivery` | `Services` | `Works` lub `null`), `buyerMainActivity`, `fetchedAt`, `expireAt` (TTL = pierwszy zapis + 30 dni). Tylko funkcja tworzy dokumenty i nigdy nie nadpisuje istniejących.
- `refreshLog/{YYYY-MM-DD}`: `day`, `complete` (dzień pobrany po jego zakończeniu), `refreshedAt`, `refreshedBy`, `expireAt` (TTL).
- `users/{uid}`: `email`, `role`, `createdAt`, `invitedBy`. Zapis tylko przez Functions.
- `meta/refreshLock`: blokada odświeżania, tylko serwer.
- Polityki TTL na polu `expireAt` kolekcji `tenders` i `refreshLog` są w `firestore.indexes.json`.

### Reguły (`firestore.rules`)
Dostęp daje wyłącznie custom claim `role` ∈ {`admin`, `member`} (samo zalogowanie nie wystarcza, bo konto może założyć każdy znający publiczny klucz API). `users`: odczyt własnego dokumentu lub wszystkich dla admina. `tenders` i `refreshLog`: odczyt dla członków. Wszystkie zapisy z klienta zablokowane; reszta zamknięta.

### Frontend (`src/`, React 19, CRA, TypeScript 4.9, CSS Modules)
- `firebase.ts`: inicjalizacja SDK (Auth, Firestore, Functions w `europe-central2`), łączenie z emulatorami przy `REACT_APP_USE_EMULATORS=true`.
- `context/AuthContext.tsx`, `components/LoginScreen.tsx`, `NoAccessScreen.tsx`, `UserBar.tsx`, `AdminPanel.tsx` (zaproszenia, lista użytkowników), `Auth.module.css`. `App.tsx` ma bramkę dostępu (logowanie → rola → aplikacja).
- `components/tenders.tsx`: główny komponent; nasłuch przetargów (`subscribeToTenders`), odświeżanie (`refresh`, w trybie zakresu po kolei brakujące dni z paskiem postępu, ponawianie przy zajętej blokadzie), filtry, statystyki.
- `utils/tendersApi.ts` (Firestore + callable), `tenderMapping.ts` (dokument → typ `Tender` w formacie interfejsu, daty `DD-MM-RRRR`), `refreshPlan.ts` (które dni pobrać), `dateUtils.ts` (`toDayString`, `addDays`, `parseDate`), `tenderFilters.ts` (filtrowanie i sortowanie po dacie, a w dniu po godzinie), `cpvFilter.ts` (**jedyne źródło prawdy dla listy CPV IT**; plik CSV z CPV jest zbędny), `calculateStatistics.ts`.
- **Statusy i gwiazdki są nadal lokalne** (`context/UserPreferencesContext.tsx`, `localStorage`). To zakres etapu 4.

## 6. Testy i weryfikacja

| Polecenie | Zakres | Wynik na koniec etapu 3 |
|---|---|---|
| `npm run test:unit` | mappery, daty (po zbudowaniu funkcji) | 15/15 |
| `npm run test:rules` | reguły Firestore na emulatorze | 13/13 |
| `npm run test:functions` | `inviteUser` + `refreshTenders` na emulatorach, z lokalnym serwerem udającym TED i eZamówienia | 20/20 |
| `$env:CI='true'; npx react-scripts test --watchAll=false` | testy frontendu (Jest) | 15/15 |
| `npx tsc --noEmit -p tsconfig.json` | typy frontendu | bez błędów |
| `npx eslint src --ext ts,tsx` | lint | bez ostrzeżeń |
| `$env:CI='false'; npx react-scripts build` | build | przechodzi (ostrzeżenia o mapach źródeł `react-datepicker` są stare) |

Testy emulatorów wymagają Javy w `PATH` (sekcja 3). Test integracyjny już raz wykrył realny błąd (`admin.firestore.FieldValue` jest `undefined` przy `import * as admin` w firebase-admin 13; używaj importów modułowych `firebase-admin/firestore`, `/auth`).

Na prawdziwych API (projekt testowy) `refreshTenders` zweryfikowano ręcznie: ok. 900 przetargów dziennie (ok. 75–90 z TED, reszta z eZamówień), 2–4 s na dzień, drugie wywołanie dopisuje 0.

**Niezweryfikowane lub czekające na użytkownika:**
- Wygląd i działanie interfejsu w przeglądarce nie były widziane przez agenta. Użytkownik sprawdził pobieranie pojedynczego dnia (działa), a tryb zakresu po poprawce (`a7b9528`) czeka na jego potwierdzenie.
- Zaproszenie drugiej osoby z panelu admina na wdrożonej funkcji nie zostało potwierdzone przez użytkownika (działa w testach na emulatorze).
- Ścieżka ponawiania po 429 przetestowana tylko atrapą; na prawdziwym TED jeszcze nie wystąpiła (wcześniej raz wystąpił sam 429).

## 7. Odkrycia o źródłach danych (ważne, nie do powtórnego odkrywania)

- **TED v3 search działa bez klucza API.** Zapytanie bez nagłówka `Authorization` zwraca dane. Zapytanie: `buyer-country=POL AND publication-date=RRRRMMDD AND classification-cpv=teeq AND notice-type=cn-standard` (zachowane z oryginału). Strona 250. TED zwraca `429` przy kilku odświeżeniach pod rząd.
- **eZamówienia (`mo-board/api/v1/Board/Search`):** maks. 10 rekordów na stronę niezależnie od `PageSize`. **Filtr dat w formacie ISO z `Z` jest zawodny** (zwraca też następny dzień), więc używamy samych dat (dzień poprzedni i wybrany), a wynik przycinamy do dnia w `Europe/Warsaw`. Daty z API mają 7 cyfr ułamka sekundy, więc są ucinane do milisekund przed parsowaniem. Poprzednia wersja frontendu zawyżała przez to liczbę przetargów dla dni z przeszłości.
- Stare pola/ID: oryginalna klasa `Notice` i dd-MM-yyyy zostały zastąpione; `Tender` w interfejsie nadal ma daty `DD-MM-RRRR`, mapowane w `tenderMapping.ts`.

## 8. Kolejne kroki

### Etap 4: wspólne statusy i indywidualne gwiazdki (następny)
Założenia ustalone z użytkownikiem:
- Wspólny status przetargu: `toEnter` („do wpisania"), `notToEnter` („nie do wpisania"), `toClarify` („do wyjaśnienia", nowy trzeci stan). Wzajemnie wykluczające się. Widoczne u wszystkich. Przechowywane w dokumencie przetargu (pola `status`, `statusBy`, `statusAt`), więc znikają razem z przetargiem po miesiącu. Odświeżenie nie nadpisuje tych pól (funkcja tworzy tylko nowe dokumenty).
- Gwiazdka jest **indywidualna**: `users/{uid}/favorites/{tenderId}` z **pełną kopią przetargu** z chwili oznaczenia i **bez TTL**; zostaje, dopóki użytkownik jej sam nie usunie (przetarg z gwiazdką przeżywa usunięcie oryginału z `tenders`).
- Reguły: klient może zmieniać tylko pola `status`, `statusBy`, `statusAt` istniejącego przetargu (np. `request.resource.data.diff(resource.data).affectedKeys().hasOnly([...])`), z dozwolonymi wartościami i `statusBy == request.auth.uid`; ulubione tylko właściciel. Dopisz testy reguł.
- Do przepisania: `UserPreferencesContext` (dziś `localStorage`), przyciski w `TenderCard.tsx`, filtry statusów w `FiltersPanel.tsx` (dodać „do wyjaśnienia"), licznik i statystyki w `calculateStatistics.ts`/`tenders.tsx`, mapowanie statusu w `tenderMapping.ts`. Użytkownik zaczyna od zera, **bez migracji** danych z `localStorage`.
- **Otwarte pytanie do użytkownika (jeszcze bez odpowiedzi):** jak ma wyglądać trzeci stan i informacja, kto ustawił wspólny status. Proponowana odpowiedź domyślna: dopasować do istniejących przycisków na karcie i pokazać autora w podpowiedzi lub drobnym tekście.
- **Do przemyślenia:** gwiazdkowane przetargi starsze niż miesiąc nie są w `tenders`, więc obecny filtr „ulubione" (działa na przetargach z wybranego zakresu dat) ich nie pokaże. Prawdopodobnie potrzebny osobny widok „Ulubione" czytający z `users/{uid}/favorites` niezależnie od zakresu dat.

### Etap 5: porządki i wdrożenie na produkcję
- Zaktualizować `README.md` (jest nieaktualny: wspomina `EmailAlertDialog`, powiadomienia email, `services/`; brakuje opisu logowania, emulatorów, testów, zmiennych `REACT_APP_FIREBASE_*`).
- Usunąć pozostałości klucza TED w buildzie: `scripts/createApiConfig.js` (uruchamiany w `npm run build`) i krok „Create API config" w `.github/workflows/firebase-deploy.yml`.
- Przygotować produkcję: decyzja, czy używać projektu `tendersted`, czy nowego; włączyć Authentication (email i hasło) i Firestore (region `europe-central2`); wdrożyć reguły, indeksy (TTL), funkcje; **usunąć stare funkcje** `api` i `getApiKey` z `us-central1` (np. `firebase functions:delete`); założyć pierwszego admina skryptem `setAdmin.js` (ADC); dodać domenę produkcyjną w Authentication → Authorized domains; dodać do CI zmienne `REACT_APP_FIREBASE_*` (publiczna konfiguracja webowa) tak, by `npm run build` je dostał; ustawić alert budżetowy; sprawdzić, że `runtime` i `predeploy` w `firebase.json` działają przy wdrożeniu produkcyjnym.
- Przejrzeć diff do `main`: commit `1bdf845` przestaje śledzić `functions/node_modules`, więc PR pokaże ok. 5900 usuniętych plików (zamierzone). Dopiero po przygotowaniu produkcji otworzyć PR i zmergować, bo merge uruchamia wdrożenie hosting na produkcję.
- Zebrać końcowy raport zgodnie z `docs/CLAUDE.md`.

### Pomysły na później (poza minimum, bez decyzji)
Baza Konkurencyjności (scraping, świadomie pominięta); usuwanie lub wyłączanie użytkowników z panelu admina; historia zmian statusu; zapytania po stronie serwera, gdyby koszt odczytów zakresów miesięcznych (kilkanaście tysięcy dokumentów na wczytanie) zaczął przeszkadzać.

## 9. Szybki start nowej sesji

1. Przeczytaj `docs/CLAUDE.md`, `docs/goals.md`, `docs/plan.md` i ten plik. `git status` i `git log --oneline -15` na gałęzi `feature/shared-tenders`.
2. Sprawdź środowisko: Java w `PATH` (sekcja 3), `npx firebase use` (powinno być `test`), `npm run test:unit`.
3. Zapytaj użytkownika o potwierdzenie testu trybu zakresu dat i o odpowiedź na otwarte pytanie z etapu 4, a potem zaplanuj etap 4 w małych krokach (reguły i testy reguł → model i kontekst → interfejs), tak jak etapy 1–3.
