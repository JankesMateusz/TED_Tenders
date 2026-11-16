# Zamówienia TED: wspólna wyszukiwarka przetargów IT

Aplikacja dla małego, zaproszonego zespołu do przeglądania zamówień publicznych na sprzęt IT z **TED** i **eZamówień**. Wszyscy zalogowani widzą tę samą listę przetargów i te same statusy. Dane pobiera serwer (Cloud Functions) i zapisuje w Firestore; przeglądarka tylko je czyta.

## Funkcje

- **Logowanie i zaproszenia**: e-mail i hasło. Kont nie zakłada się samodzielnie: admin zaprasza osoby z panelu „Użytkownicy" i przekazuje im link do ustawienia hasła.
- **Wspólna lista**: przetargi z wybranego dnia lub zakresu dat. Przy wejściu, zmianie dnia i po kliknięciu „Odśwież" serwer dopisuje brakujące przetargi (dla zakresu pobiera po kolei dni, których jeszcze nie było).
- **Wspólne statusy**: do wpisania ✎ (niebieski), wpisany ✓ (zielony), do wyjaśnienia ? (bursztynowy), nie do wpisania ✕ (czerwony). Widoczne dla wszystkich; po najechaniu na kartę podpowiedź pokazuje, kto i kiedy ustawił status.
- **Zapisane (gwiazdka)**: indywidualne. Zagwiazdkowany przetarg zostaje na wspólnej liście (z wypełnioną gwiazdką), trafia też do zakładki „Zapisane” (niezależnie od zakresu dat) i nie wygasa.
- **Filtry**: źródło, typ zamówienia, zamawiający, miasto, kody CPV związane z IT, wyszukiwanie tekstowe, status. Zamawiających, miasta i kody CPV można wybierać po kilka, przy opcjach są liczniki wyników, a lista ma sortowanie (data publikacji, termin składania, zamawiający). Filtry i sortowanie są pamiętane w przeglądarce. Przycisk „Wyczyść filtry” zeruje je jednym kliknięciem.
- **Statystyki** wybranego zakresu: liczniki statusów, postęp przeglądania (ile przetargów czeka bez statusu; tylko desktop, z możliwością zwinięcia), top 10 miast, zamawiających i kodów CPV, podział na źródła i typy, wykresy. Elementy statystyk są klikalne i ustawiają odpowiedni filtr na liście. Liczniki pokazują zmianę względem poprzedniego dnia roboczego (dla zakresu dat: względem poprzedzającego okresu tej samej długości, do 30 dni wstecz).
- Motyw jasny/ciemny, układ responsywny.

Przetargi w bazie wygasają po 30 dniach od pierwszego zapisu (TTL). Zapisane kopie i konta zostają.

## Architektura

```
przeglądarka (React) ──czyta na żywo──> Firestore <──zapisuje── Cloud Functions ──> TED, eZamówienia
        │                                                              ▲
        └──────── refreshTenders / inviteUser (callable) ──────────────┘
```

- **Frontend** (`src/`): React 19, TypeScript, CSS Modules, Firebase SDK.
- **Functions** (`functions/`, Node 22, region `europe-central2`): `refreshTenders`, `scheduledRefresh` (cykliczne odświeżanie TED i eZamówień co 10 minut, 9:00-23:50, a w godzinie po północy domykanie poprzedniego dnia), `scheduledBazaRefresh` (pobieranie z Bazy Konkurencyjności raz dziennie o 8:00; Bazę można też odświeżyć ręcznym przyciskiem), `inviteUser`.
- **Firestore**: `tenders`, `refreshLog`, `users` (+ `users/{uid}/favorites`), `advertisers` (ręczne decyzje o ukrywaniu zamawiających z Bazy Konkurencyjności, po NIP), `comments`, `meta`. Reguły w `firestore.rules`, indeksy i polityki TTL w `firestore.indexes.json`.
- **Dostęp** daje wyłącznie custom claim `role` (`admin` lub `member`); samo zalogowanie nie wystarcza.

Szczegóły (model danych, decyzje, odkrycia o API źródeł): `docs/handoff.md` i `docs/plan.md`.

## Uruchomienie lokalne

Wymagane: Node.js 22+, npm, Java 21 (tylko dla emulatorów Firebase).

```bash
npm install
npm --prefix functions install
cp .env.example .env.local   # uzupełnij wartościami z konsoli Firebase (Project settings -> Your apps)
npm start                    # http://localhost:3000
```

W `.env.local`:

| Zmienna | Znaczenie |
|---|---|
| `REACT_APP_FIREBASE_*` | Publiczna konfiguracja webowa projektu Firebase (nie jest sekretem). |
| `REACT_APP_USE_EMULATORS` | `false` = połączenie z projektem Firebase, `true` = z lokalnymi emulatorami. |

Praca z emulatorami: `npm run emulators`, w `.env.local` ustaw `REACT_APP_USE_EMULATORS=true`. Pierwszego admina nadaje skrypt `functions/scripts/setAdmin.js` (wymaga podania `projectId`; na prawdziwym projekcie wypisuje link do ustawienia hasła).

Wszystkie prace i testy prowadzimy na projekcie testowym lub emulatorach. Polecenia `firebase deploy` zawsze z jawnym `--project`.

## Testy i kontrole

| Polecenie | Zakres |
|---|---|
| `npm run test:unit` | mappery źródeł i daty (po zbudowaniu funkcji) |
| `npm run test:rules` | reguły Firestore na emulatorze |
| `npm run test:functions` | `inviteUser` i `refreshTenders` na emulatorach, ze sztucznym serwerem udającym TED, eZamówienia i Bazę Konkurencyjności |
| `CI=true npx react-scripts test --watchAll=false` | testy frontendu (Jest) |
| `npx tsc --noEmit -p tsconfig.json` | typy frontendu |
| `npx eslint src --ext ts,tsx` | lint |

Testy emulatorów wymagają Javy w `PATH`.

## Build i wdrożenie

```bash
npm run build                                          # frontend do katalogu build/
npx firebase deploy --only firestore:rules,firestore:indexes --project <projekt>
npx firebase deploy --only functions --project <projekt>
```

Wdrożenia robi CI (`.github/workflows/deploy.yml`), a nie ręczne polecenia powyżej, które zostają na wypadek awarii CI. Push do `develop` lub `main` najpierw uruchamia testy (`tests.yml`), a po ich przejściu wdraża **hosting, funkcje oraz reguły i indeksy Firestore** na środowisko przypisane do gałęzi (opis niżej).

## Gałęzie i środowiska

| Gałąź | Środowisko GitHub | Projekt Firebase | Wdrożenie |
|---|---|---|---|
| `develop` | `test` | `tenders-test-b5bb3` | automatyczne po merge'u |
| `main` | `production` | `tendersted` | automatyczne po merge'u |

Sekrety (`FIREBASE_SERVICE_ACCOUNT` i sześć `REACT_APP_FIREBASE_*`) są zdefiniowane osobno w każdym środowisku (Settings → Environments), pod tymi samymi nazwami. O projekcie docelowym decyduje `REACT_APP_FIREBASE_PROJECT_ID` środowiska.

### Zwykły rozwój

1. Gałąź feature odchodzi od `develop` (`feature/...`, `fix/...`).
2. PR do **`develop`** (baza PR musi być `develop`, GitHub domyślnie proponuje `main`). Testy muszą przejść. Merge wdraża na `test`.
3. Wydanie: PR `develop` → `main`, scalany zwykłym merge commitem (nie squash, żeby gałęzie się nie rozjeżdżały). Merge wdraża na produkcję.
4. **Zaraz po wydaniu** wciągnij `main` z powrotem do `develop` (merge `main` → `develop`). Scalenie tworzy na `main` commit, którego `develop` nie ma. Bez tego kolejny PR `develop` → `main` pokazuje zbędne różnice, a gałęzie zaczynają się rozjeżdżać.

Hashe `git log main..develop` mówią prawdę tylko wtedy, gdy zawsze scalamy merge commitem. Squash i rebase tworzą nowe commity z inną historią, więc te same zmiany wyglądają wtedy na niewydane.

### Hotfix na produkcji

Hotfix idzie od `main`, a nie przez `develop`, bo `develop` zawiera niewydane zmiany.

1. `hotfix/opis` odchodzi od `main`.
2. PR do `main`. Merge wdraża na produkcję.
3. **Zaraz potem** wciągnij zmianę do `develop` (merge `main` → `develop`), inaczej poprawka zginie przy następnym wydaniu.

Zmiany reguł Firestore, indeksów i uprawnień traktujemy tak samo jak kod: zmiana w repozytorium i ta sama ścieżka, bez ręcznych poprawek w konsoli Firebase.

### Moduły niegotowe na produkcję

`develop` musi być zawsze bezpieczny do wdrożenia na `main`, więc kod, który wymaga infrastruktury istniejącej tylko na teście, ukrywamy na **obu** warstwach:

- **Interfejs:** flaga budowania `REACT_APP_ENABLE_*` (dla Zamówień `REACT_APP_ENABLE_ORDERS`), ustawiana w kroku „Build" w `deploy.yml`: `true` dla `develop`, `false` dla `main`.
- **Funkcje:** flaga interfejsu nie wystarczy, bo wdrożenie obejmuje wszystkie funkcje i brakujący sekret na prodzie je wywala. Funkcje Zamówień są eksportowane w `functions/index.ts` tylko, gdy istnieje plik `functions/orders.enabled`, który `deploy.yml` tworzy wyłącznie dla `develop`. Zmienna środowiskowa się do tego nie nadaje: Firebase CLI nie przekazuje jej do wykrywania funkcji podczas wdrożenia.

Nowy moduł z własną bazą lub sekretem dostaje taki sam przełącznik, zanim jego funkcje trafią do `develop`. Włączenie modułu na produkcji to osobna, świadoma zmiana: najpierw sekret i baza na prodzie, potem zdjęcie warunku `develop` w `deploy.yml`. Szczegóły dla Zamówień: `db/README.md`.

### Ochrona gałęzi

`main` i `develop` są chronione: zmiany wyłącznie przez PR, z przechodzącymi testami (`tests`), bez force-push. Szczegóły konfiguracji: Settings → Branches → Branch protection rules.

## Struktura

```
src/
├── components/   # Tenders (lista), TenderCard, FiltersPanel, StatisticsTab, logowanie, panel admina
├── context/      # AuthContext (logowanie, rola), UserPreferencesContext (statusy, zapisane), ThemeContext
├── utils/        # tendersApi (Firestore i funkcje), tenderMapping, tenderFilters, tenderStatus, cpvFilter, refreshPlan
└── types/
functions/        # Cloud Functions (TypeScript): refresh, inviteUser, mappery TED i eZamówień
tests/            # testy reguł, mapperów i funkcji (emulatory)
docs/             # zasady pracy, cel, plan, przekazanie pracy
```

## Licencja

MIT License
