# Plan: współdzielenie przetargów i oznaczeń (Firebase)

Cel (z `goals.md`): kilka zaproszonych osób widzi wspólną listę przetargów i wspólne oznaczenia. Rozbudowa dopiero po osiągnięciu tego minimum.

## Ustalone decyzje

- Odświeżanie na żądanie (wejście do aplikacji, odświeżenie strony, przycisk „odśwież"). Może to zrobić każdy zalogowany użytkownik.
- Oznaczenia „do wpisania", „nie do wpisania" i „do wyjaśnienia" są wspólne. Gwiazdka jest indywidualna (każdy ma własną).
- Logowanie: email i hasło. Zaproszenie: link wysłany mailem.
- W bazie zapisujemy wszystkie pobrane przetargi i trzymamy je miesiąc od zapisu. Wyjątek: przetargi z gwiazdką zostają, dopóki użytkownik sam jej nie usunie.
- Odświeżanie pobiera przetargi z jednego dnia: dzisiejszego albo wskazanego przez użytkownika. Powtórne odświeżenie dopisuje tylko te przetargi, których jeszcze nie ma w bazie (przetargi opublikowane po poprzednim odświeżeniu). Brak przetargów z danego dnia (urlop, święta) nie jest problemem.
- Zaczynamy od zera, bez migracji ulubionych i statusów z `localStorage`.
- Zaproszenie: konto tworzy admin, a zaproszona osoba dostaje od Firebase mail z linkiem do ustawienia hasła (standardowy szablon resetu hasła).
- Klucz TED: do wymiany za kilka miesięcy (nowy wniosek w TED). Endpoint `getApiKey` i proxy znikną w etapie 2.
- Firebase na planie Blaze. Prace i testy na osobnym projekcie testowym oraz w Firebase Emulator Suite, bez dotykania produkcji.
- `src/resources/kody_cpv_it.csv` jest zbędny. Źródłem prawdy dla CPV jest `src/utils/cpvFilter.ts`.

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

## Założenia do potwierdzenia

- Tryb zakresu dat w interfejsie zostaje jako przeglądanie tego, co już jest w bazie. Odświeżanie dotyczy zawsze jednego dnia.
- Przetarg z gwiazdką przetrwa miesiąc nawet wtedy, gdy nikt nie oznaczył go statusem. Status wspólny (`toEnter` itd.) po miesiącu znika razem z przetargiem, także gdy ktoś go gwiazdkował (kopia z gwiazdką zachowuje dane przetargu, ale bez wspólnego statusu).
- Klucz TED zostaje w Secret Managerze, a po etapie 2 jest używany tylko przez Cloud Function.
