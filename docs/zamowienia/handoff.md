# Przekazanie pracy: moduł Zamówień

Dla agenta rozpoczynającego nową sesję. Stan na 2026-11-09. Czytaj w tej kolejności: `docs/CLAUDE.md` (zasady pracy), `docs/handoff.md` (ogólny stan projektu, środowisko Windows, workflow gałęzi i CI), **ten plik**, `docs/zamowienia/plan.md` (decyzje, plan etapów, pytania otwarte), `db/README.md` (baza, import, funkcje odczytu). Nie powielaj ich treści w nowych dokumentach.

## 1. O co chodzi

Narzeczona użytkownika wprowadza zamówienia publiczne w desktopowej aplikacji w pracy i wysyła klientom ogromny, rosnący raport Excel. Budujemy w tej aplikacji (TED_Tenders) moduł **Zamówienia** (POC): wprowadzanie danych, raporty i feed dla klientów, statystyki. Dane relacyjne są w PostgreSQL (Neon), nie w Firestore; dostęp przez Cloud Functions. Użytkownik pisze po polsku; odpowiadaj po polsku, zwięźle, commity po angielsku.

## 2. Stan prac

**Zrobione i wdrożone na środowisko testowe** (PR #12 scalony do `develop` 2026-11-08 jako `5996f31`; użytkownik potwierdził, że na wdrożonej aplikacji testowej widać menu i dane):

- **Baza:** schemat, liczniki numeracji, miękkie usuwanie, dziennik zmian, widoki `v_orders` i `v_report_flat`, słowniki (migracje 0001 do 0003). Cały raport 2026 jest zaimportowany lokalnie **i na Neon**: 7 773 zamówienia, 29 263 pozycje, 3 792 zamawiających, 5 182 kontakty, 1 379 zwycięzców, 330 vendorów. Weryfikator „w obie strony" na obu bazach: 41 kolumn × 29 263 wierszy bez niezgodności. Rozmiar bazy na Neon: 30 MB.
- **Funkcje** (`onCall`, `requireRole`, zwykły eksport w `functions/index.ts`): `getDictionaries`, `listOrders`, `getOrder`, `searchBuyers`, `getBuyer`. Tylko odczyt.
- **Frontend** (`src/features/orders/`): menu modułów (hamburger), **lista zamówień** (filtry: szukaj, rok, LoB, status pozycji, typ konta; stronicowanie kursorem; tabela na desktopie, karty poniżej 760 px) i **szczegóły zamówienia** (`#/zamowienia/ID`: zamówienie, zamawiający i kontakt, pozycje z grupami „przed" i „po rozstrzygnięciu", pisma). Wartość zamówienia celowo niepokazywana.
- **CI:** `deploy.yml` ustawia `REACT_APP_ENABLE_ORDERS` na `true` tylko dla gałęzi `develop` (środowisko testowe), dla `main` na `false`.

Użytkownik ocenił wygląd (desktop i mobile) jako dobry, bez uwag. Ciemnego motywu w wąskim widoku nie opisywał osobno.

**Niezrobione:** wszystkie zapisy (Etap C), wyniki i kolejka (D), czyszczenie duplikatów (E), raporty (F), statystyki (G), klienci i e-maile (H), runner migracji i CI z bazą (I). Kolejny krok to **Etap C** z `plan.md`.

**Git:** gałąź `feature/zamowienia-baza` jest scalona (można ją usunąć lokalnie i zdalnie za zgodą użytkownika). Dokumentację tej sesji dopisano na `docs/zamowienia-handoff` (z `develop`); **nowa praca nad funkcją: nowa gałąź z aktualnego `origin/develop`**. Użytkownik w tej sesji wyraźnie zlecał commity, push i PR; **pytaj przed commitem i pushem**, chyba że powie inaczej.

## 3. Środowiska i dostęp

| Zasób | Szczegóły |
|---|---|
| Neon | projekt `tenders-pg`, ID `snowy-meadow-47570929`, organizacja `org-patient-frost-62904969`, gałąź `production`, **Postgres 18**, region Frankfurt, darmowy plan (1 GB; używane 30 MB). Szacunek: ok. 150 MB na 5 lat (nie sprawdzono liczby zamówień z lat 2021 do 2025). |
| Sekret funkcji | `ORDERS_DATABASE_URL` w projekcie testowym `tenders-test-b5bb3`, wersja 1, adres **pooled**. **W produkcyjnym `tendersted` sekretu nie ma**: ustawić przed scaleniem `develop` do `main` (inaczej wdrożenie wszystkich funkcji tam się nie powiedzie). Użytkownik zdecydował, że to problem na później. |
| CI | konto `firebase-adminsdk-fbsvc@tenders-test-b5bb3.iam.gserviceaccount.com` ma rolę Secret Manager Admin na sekrecie `ORDERS_DATABASE_URL` (bez niej wdrożenie dawało 403). Dla produkcji będzie to samo. |
| Neon CLI | `npx neon@latest ...` (bez instalacji globalnej), zalogowane na komputerze użytkownika (profil DEFAULT). Adres bazy: `npx neon@latest connection-string --project-id snowy-meadow-47570929 [--pooled]`. **Adres zawiera hasło: trzymaj go tylko w zmiennej środowiskowej jednego polecenia, nigdy w pliku ani w odpowiedzi.** Nie używaj `neon init` ani `neon deploy` (zapisują hasło do `.env.local` i dopisują pliki do repo). |
| Lokalna baza | kontener `tenders-pg` (wolumen `tenders-pg-data`, `127.0.0.1:5433`, `--restart unless-stopped`). Sprawdź `docker ps`. |

**Migracje nie mają runnera.** Każdą nową migrację trzeba zastosować ręcznie **osobno lokalnie i na Neon**, inaczej wdrożone funkcje będą pracować na starym schemacie. Na hoście nie ma `psql`; wzorzec:
```bash
export NEON_URL="$(cd /tmp && npx --yes neon@latest connection-string --project-id snowy-meadow-47570929 | tail -1)"
docker exec -i -e NEON_URL tenders-pg sh -c 'psql "$NEON_URL" -v ON_ERROR_STOP=1 -q' < db/migrations/000N_nazwa.sql
```
Zmiany schematu najpierw na lokalnej bazie z testami SQL, dopiero potem na Neon. Nie rób destrukcyjnych operacji na Neon bez zgody użytkownika.

W Dockerze działają też cudze kontenery (`supabase_*_TED_Tenders` i `fachwycena-postgres`). Nie dotykaj ich.

## 4. Polecenia

```bash
# testy i kontrole (w katalogu projektu)
npm run test:orders                                  # 20 testów: walidacja + zapytania na lokalnym Postgresie
npm run test:unit                                    # 93
npm run test:functions                               # 46 (emulatory, wymaga Javy; tak samo jak w CI)
CI=true npx react-scripts test --watchAll=false      # frontend, 214 testów
npx tsc --noEmit -p .                                # typy frontendu
npm --prefix functions run build                     # typy i kompilacja funkcji (testy korzystają z functions/lib)
CI=true npm run build                                # build z lintem jako błędami (ostrzeżenia source map z react-datepicker są stare i nieszkodliwe)
```

**Uruchomienie aplikacji z danymi lokalnie** (emulatory + lokalna baza; bez zmiany `.env.local` użytkownika, który ma `REACT_APP_USE_EMULATORS=false` i nie ma flagi zamówień):
```bash
npm --prefix functions run build
ORDERS_DATABASE_URL=postgresql://postgres:dev@127.0.0.1:5433/postgres npx firebase emulators:start --project demo-tenders   # w tle: auth, functions, firestore (Java 21 jest)
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 node functions/scripts/setAdmin.js demo-tenders admin@test.pl haslo123             # konto admin (znika z emulatorem)
REACT_APP_FIREBASE_PROJECT_ID=demo-tenders REACT_APP_ENABLE_ORDERS=true REACT_APP_USE_EMULATORS=true BROWSER=none PORT=3000 npm start
```
**Pułapka:** bez nadpisania `REACT_APP_FIREBASE_PROJECT_ID=demo-tenders` emulator odpowiada „Not Found" na wywołania funkcji (identyfikator z `.env.local` jest prawdziwego projektu), a ekran pokazuje błąd słowników i pustą listę. Moduł Przetargi w emulatorze jest pusty (to oczekiwane). Zatrzymanie: tylko po PID (`taskkill //PID <pid> //T //F`) po sprawdzeniu linii poleceń procesu; szerokie zabicia są blokowane i mogłyby zatrzymać cudze procesy.

Dane poufne: raport Excel, zrzuty ekranu i wygenerowany `docs/App/import_mdp_2026.sql` leżą w `docs/App/`, ignorowanym przez git. **Nie commituj ich.** Użytkownik zgodził się na wgranie danych (w tym kontaktów urzędników) na Neon, bo są jawne; sam raport to jednak dane firmy narzeczonej (patrz `plan.md`, pkt 8). Plik SQL trzeba wygenerować ponownie po zmianie importera (`node db/import/importMdpReport.mjs docs/App/MDP_Raport_format_2026.xlsx --sql docs/App/import_mdp_2026.sql`).

Nieśledzone pliki `docs/failed.md`, `docs/raport_prawo_zamowien_2026_2027.md` i `docs/review/` należą do użytkownika. Nie ruszaj ich ani nie dodawaj do commitów.

## 5. Mapa plików

```
db/migrations/0001_init.sql         schemat, wyzwalacze, widoki, liczniki
db/migrations/0002_seed_dictionaries.sql   słowniki z Legendy (typy kont, LoB)
db/migrations/0003_lob_phone.sql    kategoria Phone
db/tests/                           testy SQL (w transakcji z wycofaniem)
db/import/                          importMdpReport.mjs, verifyImport.mjs, xlsx.mjs, normalize.mjs (+test)
functions/orders/                   db.ts (pula), validation.ts, queries.ts, callables.ts, types.ts
functions/index.ts                  zwykły eksport 5 funkcji zamówień (blok na końcu pliku)
tests/orders*.test.mjs              testy walidacji i zapytań
src/modules.ts, hooks/useHashRoute.ts, components/ModuleMenu.*   menu modułów i routing hashem
src/features/orders/                OrdersModule (router lista/szczegóły), OrdersList, OrderDetailsView,
                                    useOrdersList, useOrder, useDictionaries, ordersApi, ordersRoute (+ testy)
src/types/Orders.ts                 KOPIA functions/orders/types.ts: przy zmianie zsynchronizować oba pliki
.github/workflows/deploy.yml        flaga REACT_APP_ENABLE_ORDERS tylko dla develop
docs/zamowienia/                    ten handoff i plan.md
scripts/analyze_mdp_report.py       jednorazowa analiza raportu (Python, tylko do odczytu)
```

## 6. Pułapki poznane w tej pracy

- **Docker `--rm` kasuje dane** po `docker stop`. Baza jest na wolumenie.
- **`pg` zwraca `DATE` jako obiekt `Date` i `bigint` jako tekst.** Pula w `functions/orders/db.ts` ma własne parsery. Używaj `createPool`, nie gołego `new Pool`. `pg` ostrzega, że `sslmode=require` jest traktowany jak `verify-full` (tylko ostrzeżenie na przyszłą wersję, połączenie z Neon działa).
- **Kod błędu przy `ON DELETE RESTRICT` zależy od wersji Postgresa** (`23001` w PGlite, `23503` w Postgresie 17). Testy akceptują oba.
- **`Promise.all` na jednym kliencie transakcji** daje ostrzeżenie `pg`. W testach klient jest opakowany kolejką (`serialized` w `tests/orders.db.test.mjs`).
- **`node --test`:** `t.skip()` w hookach `beforeEach` jest zawodne; `setup` musi być w `try`, inaczej wyciek połączenia zawiesza pulę.
- **Windows:** importy ESM ścieżek bezwzględnych wymagają `file:///C:/...`. Do zapisu plików z polskimi cudzysłowami i `'` używaj narzędzi Write i Edit (skrypt Pythona w heredocu z `„..."` wywrócił się raz). Polecenia `sleep` w powłoce bywają blokowane. Ostrzeżenia `LF will be replaced by CRLF` są normalne.
- **CRA/Jest:** w projekcie nie ma `jest-dom` ani `setupTests`; asercje zwykłe. Mock modułu z `firebase` (np. `ordersApi`) robić **fabryką** (`jest.mock('./ordersApi', () => ({...}))`): automock ładuje prawdziwy moduł i `firebase.ts` rzuca `auth/invalid-api-key`. `functions/.env.demo-tenders` jest śledzony; nie wpisuj tam `ORDERS_DATABASE_URL`.
- **`requireMember` w `functions/access.ts` jest tymczasowo otwarte** (komentarz o cofnięciu commita „Temporarily open access"). Moduł zamówień używa `requireRole` (role `admin` i `member`; konto bez roli i anonimowe dostają 403).
- **Emulator funkcji nie weryfikuje podpisu tokenu:** do ręcznych wywołań wystarczy niepodpisany JWT z claimem `role`.
- **CI nie uruchamia `test:orders`** (potrzebuje bazy). Testy zapytań na prawdziwym Postgresie biegną tylko lokalnie; to znana luka (Etap I).
- **Błędy wdrożenia sekretów:** `firebase functions:secrets:get ORDERS_DATABASE_URL --project <p>` pokazuje tylko metadane (wersje), nie wartość, i nadaje się do sprawdzenia, czy sekret istnieje.
- **`scripts/__pycache__`** powstaje po uruchomieniu skryptów Pythona (usuwaj, nie commituj).

## 7. Znane ograniczenia interfejsu (nie błędy, do decyzji)

- Tabela pozycji ma 19 kolumn i przewija się poziomo; na telefonie jest mało wygodna (użytkownik uznał widok mobilny za dobry, ale nie oceniał zamówienia z 69 pozycjami).
- Po otwarciu zamówienia ze środka długiej listy strona może zostać przewinięta w dół (brak przewijania do góry; `jsdom` go nie obsługuje).
- Filtry listy są w stanie komponentu, nie w adresie. Lista zostaje zamontowana (ukryta) pod szczegółami, więc przy powrocie filtry zostają, ale po odświeżeniu strony znikają.
- Nawigacja klawiaturą po liście nie była osobno sprawdzana (linki i pola formularza są standardowe).

## 8. Konflikty z gałęzią `integracja-analiza`

Nasza gałąź jest już w `develop`, więc **to gałąź analizy musi dociągnąć `develop` i rozwiązać konflikty** (sprawdzone `git merge-tree` przed scaleniem; po scaleniu nie powtarzane): `.gitignore`, `functions/index.ts`, `functions/package.json`, `functions/package-lock.json`, wszystkie typu „obie strony dopisały w tym samym miejscu". Rozwiązanie: zachować obie strony, lockfile odtworzyć przez `npm install` w `functions/`. Przycisk „Wpisz do bazy" w `TenderCard.tsx` dodać dopiero po scaleniu analizy.

## 9. Status weryfikacji

| Obszar | Sprawdzone | Niesprawdzone |
|---|---|---|
| Schemat, import | testy SQL na Postgresie 17 i 18 (Neon), PGlite; porównanie z Excelem na obu bazach | wydajność przy większych danych |
| Funkcje | testy zapytań, HTTP na emulatorze, kod na Neon przez adres pooled, wdrożenie na projekt testowy i użycie z aplikacji (potwierdził użytkownik) | produkcja, `test:orders` w CI, limity i usypianie darmowego planu Neon (nie sprawdzano) |
| Frontend | 214 testów komponentów, `tsc`, build z lintem, oglądane przez użytkownika (desktop, mobile) | zamówienie z 69 pozycjami, klawiatura, ciemny motyw w szczegółach |

## 10. Od czego zacząć w nowej sesji

1. Przeczytaj dokumenty z listy na górze. Wykonaj `git fetch origin`, `git status`, `git log --oneline -9 origin/develop`. Utwórz gałąź na nową pracę z aktualnego `origin/develop`.
2. Sprawdź kontener (`docker ps`) i bazę: `docker exec tenders-pg psql -U postgres -At -c "select count(*) from orders"` (oczekiwane 7773). Jeśli puste: odtworzenie według `db/README.md`.
3. Zapytaj użytkownika o odpowiedzi na pytania otwarte z `plan.md` pkt 7 (od 3. w górę; 1. i 2. rozstrzygnięte).
4. Zacznij **Etap C** (wprowadzanie danych). Najpierw plan: funkcje zapisu w transakcji z `set_config('app.user_id', uid, true)`, przeniesienie `db/import/normalize.mjs` do `functions/orders/normalize.ts` ze wspólnymi wektorami testowymi, optymistyczna blokada `version`, role (patrz `plan.md`). Pamiętaj o ręcznym zastosowaniu ewentualnych migracji na lokalnej bazie **i** na Neon.
5. Po każdej porcji pracy raport w formacie z `docs/CLAUDE.md` (zmiany, pliki, weryfikacja z rzeczywistymi wynikami, ograniczenia, stan Git), z jawnym oddzieleniem tego, co sprawdzono testem, od tego, co wymaga oglądu w przeglądarce.
6. Nic na produkcję (`main`, `tendersted`) bez wyraźnej zgody. Nie ustawiaj sekretów produkcyjnych i nie wdrażaj bez użytkownika.
