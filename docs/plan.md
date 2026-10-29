# Plan: współdzielenie przetargów i oznaczeń (Firebase)

> Nowa sesja agenta: zacznij od `docs/handoff.md` (stan środowiska, architektura, testy, następne kroki).

Cel (z `goals.md`): kilka zaproszonych osób widzi wspólną listę przetargów i wspólne oznaczenia. Rozbudowa dopiero po osiągnięciu tego minimum.

## Ustalone decyzje

- Odświeżanie na żądanie (wejście do aplikacji, odświeżenie strony, przycisk „odśwież"). Może to zrobić każdy zalogowany użytkownik.
- Oznaczenia „do wpisania", „nie do wpisania" i „do wyjaśnienia" są wspólne. Gwiazdka jest indywidualna (każdy ma własną).
- Logowanie: email i hasło. Zaproszenie: link wysłany mailem.
- W bazie zapisujemy wszystkie pobrane przetargi i trzymamy je miesiąc od zapisu. Wyjątek: przetargi z gwiazdką zostają, dopóki użytkownik sam jej nie usunie.
- Odświeżanie pobiera przetargi z jednego dnia: dzisiejszego albo wskazanego przez użytkownika. Powtórne odświeżenie dopisuje tylko te przetargi, których jeszcze nie ma w bazie (przetargi opublikowane po poprzednim odświeżeniu). Brak przetargów z danego dnia (urlop, święta) nie jest problemem.
- Zaczynamy od zera, bez migracji ulubionych i statusów z `localStorage`.
- Zaproszenie: admin wpisuje email w panelu „Użytkownicy", funkcja `inviteUser` zakłada konto z rolą `member` i zwraca link do ustawienia hasła, który admin przekazuje osobie ręcznie (zamknięty zespół, bez wysyłki maili).
- Nowe funkcje działają w regionie `europe-central2`, a Functions w runtime Node 22.
- Klucz TED: do wymiany za kilka miesięcy (nowy wniosek w TED). Endpoint `getApiKey` i proxy znikną w etapie 2.
- Firebase na planie Blaze. Prace i testy na osobnym projekcie testowym oraz w Firebase Emulator Suite, bez dotykania produkcji.
- Źródłem prawdy dla CPV jest `src/utils/cpvCodes.ts` (plik CSV usunięty).

## Architektura docelowa

- **Firebase Authentication** (email i hasło) + **custom claims** z rolą (`admin` / `member`).
- **Cloud Firestore** jako wspólna baza.
- **Cloud Functions**:
  - `refreshTenders` (callable, wymaga zalogowania i roli): pobiera dane z TED i eZamówień po stronie serwera, mapuje je na wspólny model i zapisuje w Firestore. Klucz TED z Secret Managera, bez przekazywania go do przeglądarki.
  - `inviteUser` (callable, tylko admin): tworzy konto z rolą i wysyła zaproszenie.
- **Frontend** czyta przetargi z Firestore. Nie pobiera już danych bezpośrednio z TED/eZamówień i nie używa `tendersCache.ts`.
- Po przeniesieniu pobierania na serwer proxy `/tedProxy` i endpoint `getApiKey` przestają być potrzebne i można je usunąć.

## Model danych (propozycja)

`tenders/{source}_{publicationNumber}`:
- pola przetargu (tytuł, zamawiający, miasto, CPV, link, typ zamówienia, termin),
- `publicationDate` jako tekst ISO `YYYY-MM-DD` (możliwy do filtrowania i sortowania; obecny format `DD-MM-YYYY` tego nie umożliwia) oraz `publicationTime`,
- `source`, `fetchedAt`, `expireAt` (TTL = moment pierwszego zapisu + 30 dni, odświeżenie go nie przedłuża),
- `status`: `toEnter` | `notToEnter` | `toClarify` | brak, a do tego `statusBy` i `statusAt`. Status znika razem z dokumentem po miesiącu.

`users/{uid}/favorites/{tenderId}`: indywidualne gwiazdki. Dokument zawiera pełną kopię przetargu z chwili oznaczenia i nie ma TTL, więc gwiazdkowany przetarg przeżywa usunięcie oryginału z `tenders`. Usuwa go tylko użytkownik.

`users/{uid}`: email, rola, data utworzenia.

Odświeżenie tworzy tylko nowe dokumenty. Identyfikator dokumentu jest deterministyczny (`{source}_{publicationNumber}`), więc funkcja sprawdza, które identyfikatory już istnieją, i dopisuje wyłącznie brakujące. Istniejących dokumentów, a zwłaszcza pól `status*`, nie nadpisuje.

## Zasady dostępu (Security Rules)

- Konto może założyć każdy, kto zna klucz API Firebase, więc reguły nie mogą sprawdzać tylko `request.auth != null`. Dostęp dają dopiero custom claims (`role`).
- Przetargi: odczyt dla członków. Zapis całych dokumentów tylko przez Functions. Klient może zmieniać wyłącznie pola `status*`.
- Gwiazdki: tylko właściciel.
- `users`: odczyt własnego dokumentu, zapis tylko przez Functions.

## Etapy

0. **Środowisko:** osobny projekt Firebase `dev`, aliasy w `.firebaserc`, Emulator Suite (Auth, Firestore, Functions), praca na osobnej gałęzi. Uwaga: workflow GitHub Actions wdraża na produkcję po pushu do `main`/`master`.
1. **Konta i dostęp:** ekran logowania, pierwszy admin, `inviteUser`, reguły dostępu, minimalny panel admina (zaproś osobę).
2. **Pobieranie po stronie serwera:** `refreshTenders(dzień)`, mappery TED i eZamówień do wspólnego typu, dopisywanie tylko nowych przetargów, `expireAt`, blokada równoległych odświeżeń. Usunięcie `getApiKey` i `/tedProxy`.
3. **Frontend na Firestore:** odczyt przetargów dla wybranego dnia lub zakresu, przycisk „odśwież" wywołuje funkcję, usunięcie bezpośrednich zapytań i cache w `localStorage`.
4. **Oznaczenia:** wspólny `status` (3 stany) i indywidualne gwiazdki, filtry i statystyki na nowym modelu.
5. **Porządki i wdrożenie:** testy reguł na emulatorze, testy mapperów, aktualizacja README, indeksy Firestore, alert budżetowy, wdrożenie na produkcję.

Każdy etap ma kończyć się działającą, sprawdzoną funkcją, którą da się przejrzeć osobno.

## Status

- Etap 0 (środowisko): zrobiony.
- Etap 1 (konta, role, zaproszenia, reguły): zrobiony i wdrożony na projekt testowy `tenders-test-b5bb3`.
- Etap 2 (pobieranie po stronie serwera): zrobiony i wdrożony na projekt testowy. `refreshTenders` zweryfikowany na prawdziwych API (74 przetargi TED + 847 eZamówień z jednego dnia w ok. 4 s, drugie odświeżenie dopisuje 0). Stary proxy i `getApiKey` usunięte z kodu. **Produkcja nadal działa na starym kodzie** i nie należy jej wdrażać przed etapem 3.
- Etap 3 (frontend na Firestore): zrobiony. Aplikacja czyta przetargi z bazy (nasłuch na żywo), a przy wejściu, zmianie dnia i po kliknięciu „Odśwież" prosi serwer o dopisanie nowych. Reguły z odczytem `tenders` wdrożone na projekt testowy. **Nie sprawdzono wizualnie w przeglądarce** (tylko typy, lint, build, testy jednostkowe i odczyt z prawdziwej bazy).
- Etap 4 (wspólne statusy i gwiazdki): zrobiony, wdrożony na projekt testowy i sprawdzony przez użytkownika w przeglądarce (dwa konta). Cztery wzajemnie wykluczające się statusy: `toEnter` (niebieski, ✎), `entered` (zielony, ✓), `toClarify` (bursztynowy, ?), `notToEnter` (czerwony, ✕); definicje w `src/utils/tenderStatus.ts`. Pola statusu w dokumencie przetargu: `status`, `statusBy`, `statusByEmail` (do podpowiedzi z autorem, bo członek nie czyta cudzych profili), `statusAt`. Gwiazdka to kopia przetargu w `users/{uid}/favorites` (bez TTL); gwiazdkowany przetarg znika z głównej listy użytkownika i jest w zakładce „Zapisane" (niezależnie od zakresu dat). Status można zmienić tylko dla przetargu, który jest jeszcze w bazie wspólnej.
- Etap 5, porządki: zrobione (README przepisany, usunięte pozostałości klucza TED z `npm run build`, workflow i `.gitignore`; workflow buduje z sekretami `REACT_APP_FIREBASE_*`).
- Etap 5, wdrożenie na produkcję: **wstrzymane na prośbę użytkownika** (planuje kolejne funkcjonalności). Lista kroków w `docs/handoff.md`, sekcja 8.
- Po etapie 4 (2026-10-29/30), zrobione i wdrożone na projekt testowy: czas ostatniej aktualizacji w headerze, rodzaj zamówienia z TED (`contract-nature`, reguła Delivery > Services > Works, filtr dla wszystkich źródeł), komentarze do przetargów (wspólny wątek, kolekcja `comments` z TTL, brak edycji, usuwa tylko autor). Szczegóły w `docs/handoff.md`, sekcja 5.
- Baza Konkurencyjności: **research zrobiony, kodu brak.** Źródło wybrane przez użytkownika jako następne. Lista wymaga logowania, ale szczegóły ogłoszenia po numerze są publiczne (`/api/announcements/{id}`), więc możliwe jest pobieranie po kolejnych numerach. Wszystko w `docs/research-baza-konkurencyjnosci.md`.

## Ustalenia z etapu 3

- Dokumenty z bazy są mapowane na dotychczasowy typ `Tender` (daty `DD-MM-RRRR`), więc filtry, statystyki i karty działają bez zmian.
- Tryb zakresu dat sam dociąga brakujące dni (patrz niżej, „Zakres dat"); odświeżanie ze źródeł działa tylko dla dni z ostatnich 31 dni, dla starszych aplikacja tylko czyta z bazy.
- Wejście do aplikacji pokazuje od razu to, co jest w bazie, a odświeżenie idzie w tle. Równoległe odświeżenie przez inną osobę nie jest traktowane jako błąd.
- Daty wybierane w interfejsie liczone są lokalnie (`toDayString`), a nie przez `toISOString`, które potrafiło przesunąć dzień.
- Zakres miesiąca to kilka–kilkanaście tysięcy odczytów dokumentów na każde wczytanie (jeden dzień to ok. 900). Przy kilku użytkownikach mieści się w darmowym limicie Firestore lub kosztuje grosze; gdyby to się zmieniło, trzeba ograniczyć zakres lub dodać zapytania po stronie serwera.
- Usunięte: `fetchTenders`, `fetchEzamowienia`, `tendersCache`, klasa `Notice`, `removeChangeNotices` oraz wpis `proxy` w `package.json`.

### Zakres dat (poprawka po pierwszym teście w przeglądarce)

Pierwsza wersja trybu zakresu tylko czytała z bazy, więc dni, których nikt wcześniej nie otworzył, były puste. Teraz:
- Serwer po w pełni udanym odświeżeniu zapisuje `refreshLog/{dzień}` z polem `complete` (dzień pobrany po jego zakończeniu) i `expireAt` (TTL jak przetargi). Dzień, w którym któreś źródło zawiodło, nie dostaje wpisu.
- Klient w trybie zakresu pobiera po kolei dni bez kompletnego wpisu oraz dzisiejszy (`src/utils/refreshPlan.ts`), z postępem „3/7". Pojedynczy dzień jest odświeżany zawsze.
- Jeśli serwer jest zajęty odświeżaniem innej osoby, klient czeka 3 s i ponawia (maks. 6 prób).
- Koszt: dzień to ok. 2–4 s i ok. 400–900 zapisów, więc cały miesiąc za pierwszym razem to ok. 2 minuty i kilkanaście tysięcy zapisów.
- TED zwrócił `429 Too Many Requests` przy kilku odświeżeniach pod rząd, więc zapytania do TED i eZamówień są ponawiane z narastającym opóźnieniem (1, 3, 8 s, z uwzględnieniem `Retry-After`). Ścieżkę ponawiania pokrywają testy z atrapą; na prawdziwym TED nie udało się jej jeszcze wywołać.

## Ustalenia z etapu 2

- Wyszukiwanie TED v3 działa bez klucza API, więc `refreshTenders` nie używa klucza ani Secret Managera. Gdyby TED zaczął go wymagać, trzeba dodać `defineSecret` i nagłówek `Authorization`.
- Filtr dat API eZamówień jest zawodny: zakres ISO z `Z` potrafi zwrócić również następny dzień (542 rekordy zamiast 138 dla jednego dnia). Sama data bez godziny działa poprawnie. Serwer pyta więc o doby UTC (dzień poprzedni i wybrany) i przycina wyniki do dnia w strefie `Europe/Warsaw`. Obecny frontend używa formatu ISO, więc dotychczas zawyżał liczbę przetargów dla dni z przeszłości.
- API eZamówień zwraca maksymalnie 10 rekordów na stronę, niezależnie od `PageSize`.
- Identyfikator dokumentu: `{źródło}_{numer}` ze znakami `/` i spacjami zamienionymi na `_` (numery eZamówień zawierają `/`).
- Dane testowe w projekcie testowym (ok. 900 dokumentów z 2026-10-29) wygasną same po 30 dniach.

## Założenia do potwierdzenia

- Tryb zakresu dat w interfejsie zostaje jako przeglądanie tego, co już jest w bazie. Odświeżanie dotyczy zawsze jednego dnia.
- Przetarg z gwiazdką przetrwa miesiąc nawet wtedy, gdy nikt nie oznaczył go statusem. Status wspólny (`toEnter` itd.) po miesiącu znika razem z przetargiem, także gdy ktoś go gwiazdkował (kopia z gwiazdką zachowuje dane przetargu, ale bez wspólnego statusu).
- Klucz TED zostaje w Secret Managerze, a po etapie 2 jest używany tylko przez Cloud Function.
