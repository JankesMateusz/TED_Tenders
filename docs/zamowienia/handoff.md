# Przekazanie pracy: moduł Zamówień

Dla agenta rozpoczynającego nową sesję. Stan na 2026-11-08. Czytaj w tej kolejności: `docs/CLAUDE.md` (zasady pracy), `docs/handoff.md` (ogólny stan projektu, środowisko Windows, workflow gałęzi i CI), **ten plik**, `docs/zamowienia/plan.md` (decyzje, plan etapów, pytania otwarte), `db/README.md` (baza, import, funkcje odczytu). Nie powielaj ich treści w nowych dokumentach.

## 1. O co chodzi

Narzeczona użytkownika wprowadza zamówienia publiczne w desktopowej aplikacji w pracy i wysyła klientom ogromny, rosnący raport Excel. Budujemy w tej aplikacji (TED_Tenders) moduł **Zamówienia** (POC): wprowadzanie danych, raporty i feed dla klientów, statystyki. Dane relacyjne są w PostgreSQL (nie w Firestore), dostęp przez Cloud Functions. Użytkownik pisze po polsku; odpowiadaj po polsku, zwięźle, commity po angielsku.

## 2. Stan prac

**Gałąź:** `feature/zamowienia-baza`, odchodzi od `origin/develop`, 0 commitów za nim, **nic nie wypchnięte** (gałąź nie ma upstreamu celowo, żeby `git push` nie trafił przypadkiem na `develop`).

| Commit | Zawartość |
|---|---|
| `4e67f01` | schemat + słowniki + testy SQL + skrypt analizy raportu + `docs/App/` w `.gitignore` |
| `613c950` | importer raportu xlsx, normalizacja, weryfikator „w obie strony" |
| `817baca` | instrukcja trwałego kontenera Postgresa |
| `4d9b471` | funkcje odczytu `functions/orders/` + `pg` w zależnościach |
| `63f82c2` | `getDictionaries` + eksport funkcji pod emulatorem |
| `3dac473` | migracja `0003`: kategoria `Phone` = smartfony |
| `12b257d` | menu modułów (hamburger), rejestr modułów, routing hashem, szkielet ekranu za flagą |

**Uwaga o commitach:** `docs/handoff.md` wymaga zgody przed commitem i pushem. Commity `4e67f01` i `613c950` zostały zrobione na wyraźne polecenie użytkownika; `4d9b471`, `63f82c2`, `3dac473` i `12b257d` agent zrobił w trakcie pracy bez osobnej prośby (po zaakceptowanym planie). Użytkownik może je przejrzeć, zmienić lub połączyć. **W nowej sesji pytaj przed każdym commitem i pushem**, chyba że użytkownik wyraźnie powie inaczej.

**Zrobione (działa i jest sprawdzone):**
- Baza: schemat, liczniki numeracji, miękkie usuwanie, dziennik zmian, widoki `v_orders` i `v_report_flat` (układ raportu Excel), słowniki. Lokalna baza zawiera cały raport 2026: 7 773 zamówienia, 29 263 pozycje, 3 792 zamawiających, 5 182 kontakty, 1 379 zwycięzców, 330 vendorów. Porównanie bazy z Excelem: 41 kolumn × 29 263 wierszy bez niezgodności.
- Funkcje (`onCall`, `requireRole`): `getDictionaries`, `listOrders`, `getOrder`, `searchBuyers`, `getBuyer`. Sprawdzone na emulatorze prawdziwymi wywołaniami HTTP: autoryzacja (brak tokenu 401; konto bez roli, anonimowe i z obcą rolą 403), walidacja 400, brak zasobu 404, dane z bazy.
- Frontend: hamburger po lewej w nagłówku przetargów, ekran „Zamówienia" (tylko szkielet z plakietką „Wersja robocza"), flaga `REACT_APP_ENABLE_ORDERS`. Przy fladze wyłączonej nagłówek jest bez zmian (test).

**Niezrobione:** lista zamówień w UI, szczegóły, wszystkie zapisy, wyniki i kolejka, czyszczenie duplikatów, raporty, statystyki, klienci i e-maile, wdrożenie (Neon, sekret, zwykły eksport funkcji). Kolejny krok to **Etap A** z `plan.md`.

**Czeka na użytkownika:** ocena wyglądu menu hamburger (układ, odstępy, ciemny motyw, wąski ekran). Agent nigdy nie oglądał interfejsu na żywo (`scripts/screenshot-app.js` nie umie się logować).

## 3. Środowisko i polecenia

Procesy uruchomione przez agenta w poprzedniej sesji (mogły już zostać zatrzymane, sprawdź):
- kontener Postgresa `tenders-pg` (wolumen `tenders-pg-data`, `127.0.0.1:5433`, `--restart unless-stopped`);
- serwer deweloperski na `http://localhost:3000` (PID 21368 w chwili pisania) uruchomiony z `REACT_APP_ENABLE_ORDERS=true`. Zatrzymaj tylko ten proces (po PID lub `taskkill /PID <pid> /T /F`). **Szerokie zabicia (`taskkill /IM java.exe`, `pkill firebase`) są blokowane przez klasyfikator uprawnień i mogłyby zatrzymać cudze procesy.**

W Dockerze działają też cudze kontenery (`supabase_*_TED_Tenders` i `fachwycena-postgres`). Nie dotykaj ich.

```bash
# baza
docker start tenders-pg                       # jeśli zatrzymana
docker exec -it tenders-pg psql -U postgres   # konsola SQL
# odtworzenie bazy od zera: db/README.md (migracje 0001 do 0003, testy SQL, potem import i weryfikator)

# testy i kontrole (w katalogu projektu)
npm run test:orders                                  # 20 testów: walidacja + zapytania na Postgresie
CI=true npx react-scripts test --watchAll=false      # frontend, 197 testów
npx tsc --noEmit -p .                                # typy frontendu
npm --prefix functions run build                     # typy i kompilacja funkcji (testy korzystają z functions/lib)
CI=true npm run build                                # build z lintem jako błędami

# emulator funkcji z lokalną bazą
ORDERS_DATABASE_URL=postgresql://postgres:dev@127.0.0.1:5433/postgres npx firebase emulators:start --only functions --project demo-tenders

# frontend z włączonym modułem (bez zmiany .env.local użytkownika)
REACT_APP_ENABLE_ORDERS=true BROWSER=none PORT=3000 npm start
```

Dane poufne: raport Excel, zrzuty ekranu i wygenerowany `docs/App/import_mdp_2026.sql` (zawiera dane osobowe urzędników) leżą w `docs/App/`, ignorowanym przez git. **Nie commituj ich ani nie wysyłaj do usług zewnętrznych.** Plik SQL trzeba wygenerować ponownie po zmianie importera (`node db/import/importMdpReport.mjs docs/App/MDP_Raport_format_2026.xlsx --sql docs/App/import_mdp_2026.sql`).

Nieśledzone pliki `docs/failed.md`, `docs/raport_prawo_zamowien_2026_2027.md` i `docs/review/` należą do użytkownika. Nie ruszaj ich.

## 4. Mapa plików

```
db/migrations/0001_init.sql         schemat, wyzwalacze, widoki, liczniki
db/migrations/0002_seed_dictionaries.sql   słowniki z Legendy (typy kont, LoB)
db/migrations/0003_lob_phone.sql    kategoria Phone
db/tests/                           testy SQL (w transakcji z wycofaniem)
db/import/                          importMdpReport.mjs, verifyImport.mjs, xlsx.mjs, normalize.mjs (+test)
functions/orders/                   db.ts (pula), validation.ts, queries.ts, callables.ts, types.ts
functions/index.ts                  blok eksportu funkcji zamówień tylko pod FUNCTIONS_EMULATOR=true
tests/orders*.test.mjs              testy walidacji i zapytań
src/modules.ts, hooks/useHashRoute.ts, components/ModuleMenu.*   menu modułów i routing hashem
src/features/orders/                szkielet modułu (OrdersModule)
src/App.tsx, components/header.tsx  jedyne zmiany w istniejącym kodzie frontendu
docs/zamowienia/                    ten handoff i plan.md
scripts/analyze_mdp_report.py       jednorazowa analiza raportu (Python, tylko do odczytu)
```

## 5. Pułapki poznane w tej pracy

- **Docker `--rm` kasuje dane** po `docker stop` (zdarzyło się raz). Baza jest teraz na wolumenie.
- **`pg` zwraca `DATE` jako obiekt `Date` i `bigint` jako tekst.** Pula w `functions/orders/db.ts` ma własne parsery (daty jako `RRRR-MM-DD`, bigint jako liczba). Używaj `createPool`, nie gołego `new Pool`.
- **Kod błędu przy `ON DELETE RESTRICT` zależy od wersji Postgresa** (`23001` w PGlite, `23503` w Postgresie 17). Testy akceptują oba.
- **`Promise.all` na jednym kliencie transakcji** daje ostrzeżenie `pg` o zagnieżdżonych zapytaniach. W testach klient jest opakowany kolejką (`serialized` w `tests/orders.db.test.mjs`); na puli produkcyjnej zapytania idą równolegle.
- **`node --test`:** `t.skip()` w hookach `beforeEach` jest zawodne; użyj opakowania na pojedynczy test. `setup` musi być w `try`, inaczej wyciek połączenia zawiesza pulę (tak było).
- **Windows:** importy ESM ścieżek bezwzględnych wymagają adresów `file:///C:/...`. Wielolinijkowe `heredoc` z `'` w tej powłoce potrafią się wywrócić: do zapisu plików używaj narzędzia Write. Polecenia `sleep` w powłoce są blokowane (użyj `run_in_background` albo pętli z Monitor). Ostrzeżenia `LF will be replaced by CRLF` są normalne.
- **CRA/Jest:** w projekcie nie ma `jest-dom` ani `setupTests`; asercje zwykłe. `functions/.env.demo-tenders` jest śledzony (testy integracyjne emulatorów); nie wpisuj tam `ORDERS_DATABASE_URL`, podawaj zmienną w poleceniu.
- **`requireMember` w `functions/access.ts` jest tymczasowo otwarte** (komentarz o cofnięciu commita „Temporarily open access"). Moduł zamówień używa `requireRole`. Użytkownik wyłączył logowanie anonimowe w testowym projekcie Firebase (zostaje e-mail i hasło); stan produkcji nieznany.
- **Emulator funkcji nie weryfikuje podpisu tokenu:** do ręcznych wywołań wystarczy niepodpisany JWT z potrzebnymi claimami (`role`).
- **Plik `scripts/__pycache__`** powstaje po uruchomieniu skryptów Pythona (usuwaj, nie commituj).

## 6. Konflikty z gałęzią `integracja-analiza`

Sprawdzone `git merge-tree` (2026-11-08): konflikty w `.gitignore`, `functions/index.ts`, `functions/package.json`, `functions/package-lock.json`, wszystkie typu „obie strony dopisały w tym samym miejscu". Rozwiązanie: zachować obie strony, lockfile odtworzyć przez `npm install` w `functions/`. Szczegóły w `plan.md`, pkt 6. Przycisk „Wpisz do bazy" w `TenderCard.tsx` dodać dopiero po scaleniu analizy.

## 7. Status weryfikacji

| Obszar | Sprawdzone | Niesprawdzone |
|---|---|---|
| Schemat, import | testy SQL na Postgresie 17 i PGlite, porównanie z Excelem | Neon, wydajność przy większych danych |
| Funkcje | testy zapytań, wywołania HTTP na emulatorze | wdrożenie na projekt testowy, praca na Neon, CI z bazą |
| Frontend | testy komponentów, `tsc`, build z lintem, pełne testy frontendu | wygląd na żywo, telefon, ciemny motyw, przepływ z emulatorem Auth |

## 8. Od czego zacząć w nowej sesji

1. Przeczytaj dokumenty z listy na górze. Wykonaj `git status`, `git log --oneline -9`, `git fetch origin` i sprawdź, czy `develop` nie ruszył (`git rev-list --count HEAD..origin/develop`).
2. Sprawdź kontener (`docker ps`) i uruchom go, jeśli nie działa. Zweryfikuj bazę: `docker exec tenders-pg psql -U postgres -At -c "select count(*) from orders"` (oczekiwane 7773). Jeśli puste: odtworzenie według `db/README.md`.
3. Zapytaj użytkownika o opinię o menu i o odpowiedzi na pytania otwarte z `plan.md` pkt 7 (najpierw statusy zamówienia i reguła wartości).
4. Zacznij **Etap A** (lista zamówień). Sprawdź najpierw, czy `functions/scripts/setAdmin.js` pozwala założyć konto z rolą w emulatorze Auth; jeśli nie, dodaj skrypt zasiewający.
5. Po każdej porcji pracy raport w formacie z `docs/CLAUDE.md` (zmiany, pliki, weryfikacja z rzeczywistymi wynikami, ograniczenia, stan Git), z jawnym oddzieleniem tego, co sprawdzono testem, od tego, co wymaga oglądu w przeglądarce.
6. Nic na produkcję (`main`, `tendersted`) bez wyraźnej zgody. Nie zakładaj konta Neon, nie ustawiaj sekretów i nie wdrażaj bez użytkownika.
