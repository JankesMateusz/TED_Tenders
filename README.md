# Zamówienia TED: wspólna wyszukiwarka przetargów IT

Aplikacja dla małego, zaproszonego zespołu do przeglądania zamówień publicznych na sprzęt IT z **TED** i **eZamówień**. Wszyscy zalogowani widzą tę samą listę przetargów i te same statusy. Dane pobiera serwer (Cloud Functions) i zapisuje w Firestore; przeglądarka tylko je czyta.

## Funkcje

- **Logowanie i zaproszenia**: e-mail i hasło. Kont nie zakłada się samodzielnie: admin zaprasza osoby z panelu „Użytkownicy" i przekazuje im link do ustawienia hasła.
- **Wspólna lista**: przetargi z wybranego dnia lub zakresu dat. Przy wejściu, zmianie dnia i po kliknięciu „Odśwież" serwer dopisuje brakujące przetargi (dla zakresu pobiera po kolei dni, których jeszcze nie było).
- **Wspólne statusy**: do wpisania ✎ (niebieski), wpisany ✓ (zielony), do wyjaśnienia ? (bursztynowy), nie do wpisania ✕ (czerwony). Widoczne dla wszystkich; po najechaniu na kartę podpowiedź pokazuje, kto i kiedy ustawił status.
- **Zapisane (gwiazdka)**: indywidualne. Zagwiazdkowany przetarg trafia do zakładki „Zapisane" (niezależnie od zakresu dat) i nie wygasa.
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
- **Functions** (`functions/`, Node 22, region `europe-central2`): `refreshTenders`, `inviteUser`.
- **Firestore**: `tenders`, `refreshLog`, `users` (+ `users/{uid}/favorites`), `meta`. Reguły w `firestore.rules`, indeksy i polityki TTL w `firestore.indexes.json`.
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
| `npm run test:functions` | `inviteUser` i `refreshTenders` na emulatorach, ze sztucznym serwerem udającym TED i eZamówienia |
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

Push do `main` uruchamia GitHub Actions (`.github/workflows/firebase-deploy.yml`), które buduje frontend i **wdraża sam hosting na produkcję**. Reguły i funkcje wdraża się osobno poleceniami powyżej. Workflow wymaga sekretów repozytorium `REACT_APP_FIREBASE_*` (te same wartości co w `.env.local`), `FIREBASE_SERVICE_ACCOUNT` i `FIREBASE_PROJECT_ID`.

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
