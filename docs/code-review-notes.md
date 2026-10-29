# Uwagi z przeglądu kodu

Data przeglądu: 2026-10-29. Zakres: kod źródłowy w `src/`, `functions/`, `scripts/`, workflow GitHub Actions, `firebase.json`. Nie przeglądano CSS, lockfile'i, `functions/lib` (build), grafik oraz komponentów `FiltersPanel`, `TenderCard`, `StatisticsTab`, `BuyersSidebar`, `header`.

Repozytorium źródłowe jest na GitHubie (ten folder to pobrana kopia, stąd brak `.git`).

## Architektura w skrócie

- Frontend: React 19 + TypeScript (Create React App), hosting na Firebase Hosting, deploy przez GitHub Actions.
- `src/components/tenders.tsx`: główny komponent. Przy zmianie daty pobiera równolegle dane z TED i eZamówień, zapisuje je do cache w `localStorage` (TTL 30 min, odświeżanie w tle).
- TED (`src/utils/fetchTenders.tsx`): zapytania przez proxy (Cloud Function `/tedProxy`), które dokłada klucz API z Secret Managera. Filtr: kupujący z Polski, `cn-standard`, `classification-cpv=teeq`. Stronicowanie po 250.
- eZamówienia (`src/utils/fetchEzamowienia.tsx`): publiczne API wywoływane bezpośrednio z przeglądarki, osobno dla Delivery / Services / Works. Parametr `isTenderAmountBelowEU=true` ogranicza wyniki do zamówień poniżej progów UE. Stronicowanie po 10.
- Filtr IT (`src/utils/cpvFilter.ts`): twardo zakodowana tablica kodów CPV, dopasowanie po prefiksie.
- Stan użytkownika (`src/context/UserPreferencesContext.tsx`): ulubione, „do wpisania", „nie do wpisania" w `localStorage`, bez backendu.
- Filtrowanie i sortowanie: `src/utils/tenderFilters.ts` (czysta funkcja).

## Bezpieczeństwo (do naprawy w pierwszej kolejności)

> Stan na koniec etapu 2 (docs/plan.md): punkty 1, 3, 4 i 5 są rozwiązane w kodzie (usunięto `getApiKey` i proxy, nowe funkcje wymagają logowania i roli). Zmiany działają na razie tylko w projekcie testowym; **produkcja nadal ma stary kod**, więc luka z punktu 1 jest tam otwarta do czasu wdrożenia. Punkt 2 (klucz w buildzie frontendu: `scripts/createApiConfig.js`, workflow GitHub Actions) jest do posprzątania w etapie 5.

1. **Publiczny endpoint `getApiKey`** (`functions/index.ts`): funkcja HTTP bez uwierzytelniania zwraca wartość `API_KEY` z Secret Managera. Każdy znający URL może pobrać klucz TED. Do usunięcia, a klucz warto zrotować.
2. **Klucz TED w buildzie frontendu**: workflow `.github/workflows/firebase-deploy.yml` i `scripts/createApiConfig.js` zapisują `TED_API_KEY` do plików konfiguracyjnych. Wygląda to na pozostałość sprzed proxy. Do zweryfikowania, czy `src/config/api.ts` jest gdziekolwiek importowany. Jeśli trafia do bundla, klucz jest jawny.
3. **Proxy bez ograniczeń**: `cors` z `origin: true` oraz ręczne nagłówki `Access-Control-Allow-Origin: *`. Każdy może zużywać limit zapytań do TED. Warto ograniczyć origin do domeny aplikacji i rozważyć limity zapytań lub App Check.
4. **Proxy przekazuje `req.body` bez walidacji** do `api.ted.europa.eu`. Warto ograniczyć dozwolone pola i zapytania.
5. **Wyciek szczegółów błędów**: proxy zwraca `error.message` klientowi.

## Zgodność z projektem i dokumentacją

- **Baza Konkurencyjności**: źródło istnieje w enumie `TenderSource`, w konfiguracji i filtrach, ale nie ma fetchera. Brak API, wymagałaby web scrapingu, więc świadomie nie została zaimplementowana.
- **README** jest nieaktualny: wymienia `EmailAlertDialog`, powiadomienia email i katalog `services/`, których nie ma w kodzie (w kodzie są komentarze „email alerts removed"). Opis struktury projektu nie zgadza się z rzeczywistością.
- `src/resources/kody_cpv_it.csv` leży w repo, ale nie jest widocznie używany. Lista CPV jest zdublowana na stałe w `cpvFilter.ts`. Do sprawdzenia, które źródło jest aktualne.
- `firebase.json` wskazuje runtime `nodejs18`.

## Jakość kodu

- Lista kodów CPV w `cpvFilter.ts` zawiera duplikaty i warianty z błędnymi sufiksami kontrolnymi (np. `30200000-0` obok `30200000-1`) oraz kod ze spacją na końcu (`"48770000 "`). Dopasowanie po prefiksie sprawia, że warianty z sufiksem są zbędne.
- `PAGE_SIZE` jest zdefiniowany lokalnie w `fetchTenders.tsx` i `fetchEzamowienia.tsx`, mimo że `src/constants/index.ts` ma tę wartość.
- Klasa `Notice` jest dopasowana do formatu TED. `fetchEzamowienia` udaje ten format, a potem nadpisuje pola. Czystsze byłyby osobne mappery do wspólnego typu `Tender`.
- `UserPreferencesContext`: `JSON.parse` z `localStorage` bez `try/catch`. Uszkodzony wpis wywali aplikację przy starcie. Ulubione przechowują całe obiekty `Tender`.
- Daty: `startDate.toISOString().slice(0, 10)` w `tenders.tsx` konwertuje do UTC, co w strefie czasowej Polski może przesunąć dzień. Do sprawdzenia przy lokalnej północy.
- `fetchTenders` i `fetchEzamowieniaByOrderType` połykają błędy i zwracają `[]`, więc użytkownik nie odróżni awarii od braku wyników.
- Pobieranie stron w pętli sekwencyjnie. eZamówienia ma `PageSize=10`, więc dla większych zakresów dat to wiele żądań.
- Brak testów mimo zainstalowanych bibliotek testowych.
- Nazwy plików: `tenders.tsx` i `header.tsx` małą literą, reszta komponentów wielką.
