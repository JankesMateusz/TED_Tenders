# Lista przetargów: plan poprawek UX

Plan wynika z krytyki ekranu listy przetargów z 16.11.2026 (wynik 21/40, trzy problemy P1).

- Raport z uzasadnieniem i wskazaniami plików: `.impeccable/critique/2026-11-16T13-17-43Z__src-components-tenders-tsx.md`
- Opis systemu wizualnego: `DESIGN.md` i `.impeccable/design.json`

## Ustalenia

- Zakres: wszystkie znalezione problemy (P1, P2, P3 i drobne obserwacje).
- Zaczynamy od zaufania do wspólnych statusów.
- Ikona statusu ma być wyświetlana w aplikacji. `DESIGN.md` już ją opisuje, więc dokument zostaje bez zmian.
- Do decyzji: czy zapis statusu ma przejść na transakcję chroniącą przed nadpisaniem cudzej zmiany. To zmiana w `src/utils/tendersApi.ts` i ewentualnie w regułach Firestore.

## Kolejność

Każdy krok to jedna komenda w Claude Code, uruchamiana w katalogu projektu. Warto dopisać „według ostatniej krytyki", żeby sesja zaczęła od przeczytania raportu.

### 1. `/impeccable harden tenders` — zaufanie do wspólnego stanu

- Komunikat z „Cofnij" po każdej zmianie statusu, z nazwą osoby, której status nadpisano.
- Brak automatycznego przeskoku aktywnej karty, gdy zniknęła przez cudzą zmianę.
- „Ukryj zamawiającego" przeniesione do menu „⋮", z cofnięciem i zasięgiem napisanym wprost.
- Ikona statusu na przycisku i w menu, razem z cyframi 1–4.
- Potwierdzenie usunięcia komentarza.

### 2. `/impeccable adapt tenders` — telefon

- Jeden przycisk „Filtry (n)" otwierający panel zamiast pięciu filtrów, przełącznika i sortowania.
- Wyszukiwarka jako rozwijana ikona.
- Podpowiedź o skrótach klawiszowych ukryta na dotyku.
- Zawijanie rzędu akcji karty.
- Większa plakietka dokumentów (dziś około 20 px wysokości).

### 3. `/impeccable audit tenders` — klawiatura i czytnik ekranu

- Prawdziwy fokus przenoszony przez J/K.
- Pełna etykieta przycisku statusu (status, autor, czas).
- Zamykanie menu po utracie fokusu.
- Przejmowanie i oddawanie fokusu w komentarzach.
- Ustawienie wyłączające skróty jednoklawiszowe.

### 4. `/impeccable clarify tenders` — teksty

- Poprawiona podpowiedź J/K (J to następne, K to poprzednie).
- Puste stany zależne od przyczyny, z akcjami „Wyczyść filtry", „Pokaż ocenione", „Spróbuj ponownie".
- Chip dla domyślnej kolejki nieocenionych.

### 5. `/impeccable polish tenders` — wykończenie

- Konflikt CSS w panelu zamawiających (`src/components/BuyersSidebar.module.css:163-175`).
- Kontrast plakietki „Nowy", etykiety „PROSTY" i aktywnej zakładki w ciemnym motywie.
- Promienie i rozmiary pisma z tokenów.
- Surowe kolory kalendarza.
- Usunięcie martwego CSS.

## Po poprawkach

`/impeccable critique tenders` pokaże zmianę wyniku względem 21/40.
