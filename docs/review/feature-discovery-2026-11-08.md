# Feature Discovery (2026-11-08)

Dokument spisany z sesji doradczej (tryb Feature Discovery). To propozycje do oceny, nie plan wdrożenia. Pewność: **Potwierdzone** / **Hipoteza** / **Do walidacji**. Pomysły sprawdzono względem kodu i `handoff.md`, żeby nie proponować rzeczy, które już istnieją.

Powiązane: [review-projektu-2026-11-08.md](review-projektu-2026-11-08.md), [improvement-review-ux-automatyzacja-2026-11-08.md](improvement-review-ux-automatyzacja-2026-11-08.md).

## Executive Summary

Rdzeń triażu (statusy, etykiety, komentarze, filtry, statystyki) jest gotowy i nie wymaga rozbudowy. Największa niewykorzystana wartość to **dane, które aplikacja zbiera, ale zaraz wyrzuca**: przetargi i analizy wygasają po 30 dniach (TTL), zostają tylko migawki statusów w `labelSnapshots` (`functions/labels/labelSnapshot.ts`, bez TTL; pola: `source`, `publicationNumber`, `publicationDate`, `title`, `cpvCodes`, `orderType`, `buyerName`, historia statusów). Zespół co dzień ocenia dziesiątki ogłoszeń, a z tych ocen nie powstaje wiedza ani automatyzacja.

Trzy kierunki:
- **Odciążyć kolejkę**: pomoc w decyzji „wpisać / nie wpisać", bez kolejnej warstwy LLM.
- **Zamknąć pętlę**: dziś trzeba wejść do aplikacji, żeby dowiedzieć się, że coś jest nowe lub się zmieniło.
- **Zamienić ocenione dane w produkt dla analityka**: ona robi raporty dla firm, więc to jej faktyczny wynik pracy.

## Strengths (na czym można budować)

- Trwałe migawki ocen (`labelSnapshots`): gotowy zbiór treningowy i historia zamawiających (Potwierdzone).
- Pipeline analizy przyjmuje pliki po URL (`AnalyzeRequestFile.url` w `functions/analysis/contract.ts`) i zwraca ustrukturyzowane pozycje (kategoria, ilość, próg, flagi `bundled`, `option`, `quantity_conflict`) (Potwierdzone).
- Zaplanowane zadania i infrastruktura (Scheduler, Cloud Tasks, triggery Firestore) są gotowe, więc powiadomienia i monitoring kosztują mało.
- Obecność użytkowników (`presence/`) jest zbierana, ale pokazywana tylko adminowi.

## Feature Opportunities

### 1. Poranny digest (Medium–High, S–M)
**Problem:** praca jest dzienna, a nic nie mówi, że czeka coś nowego. **Pomysł:** o 8:30 jedna wiadomość (e-mail lub Telegram) z liczbą nieocenionych, listą ważnych (wg CPV lub słów kluczowych) i linkiem do kolejki. **Dlaczego teraz:** `scheduledBazaRefresh` działa o 8:00, więc dane są świeże. **Częściowo istnieje:** nie (w handoffie jako „pomysł na później"). **80/20:** bot Telegram lub zwykły e-mail, bez konfigurowania preferencji.

### 2. Sugestia triażu z własnej historii, bez LLM (High, M) — mniej oczywiste
**Problem:** większość ogłoszeń jest oczywista („tonery", „monitoring"), a każde pochłania uwagę. **Pomysł:** prosty scoring z `labelSnapshots` na karcie: „podobne do 7 wcześniej oznaczonych WPISAĆ, 0 ODPUŚCIĆ". Podobieństwo z kodów CPV, zamawiającego i słów z tytułu (naiwny Bayes lub liczniki). Wynik to szara podpowiedź, nie decyzja, plus opcja „zwiń przetargi z wysokim prawdopodobieństwem ODPUŚCIĆ". **Uwaga:** w `handoff.md` zdecydowano, że nie będzie oceny dopasowania do IT, więc to ma być uczenie się z decyzji zespołu, nie ocena merytoryczna. **Do walidacji:** offline, na zebranych migawkach policzyć trafność; jeśli poniżej ok. 85%, zrezygnować. Koszt modelu: zero.

### 3. Pamięć zamawiającego na karcie (Medium, S–M)
„Ten zamawiający: 3 ogłoszenia w 90 dniach, 2× WPISAĆ, ostatnio w październiku", z komentarzem ostatniej osoby. Dane z `labelSnapshots` po `buyerName` (lepiej po NIP, gdzie jest). Rozwiązuje utratę wiedzy po 30 dniach. Powiązane z istniejącym `repeatBuyers` w statystykach: ten sam sygnał, ale na karcie w momencie decyzji.

### 4. „Koszyk raportu" (High, M)
**Problem:** ostatni krok pracy analityka (raport dla firm) jest ręczny. **Pomysł:** zaznaczone ogłoszenia ze statusem „wpisane" → tabela (zamawiający, tytuł, CPV, link, komentarze, wykryte pozycje z analizy: kategoria × ilość) jako CSV lub gotowy dokument. Eksport CSV analiz (TT-11) jest, ale tylko na potrzeby pilotażu. **80/20:** sam CSV z komentarzami, bez szablonów.

### 5. Wykrywanie zmian i sprostowań ocenionych ogłoszeń (Medium, M) — mniej oczywiste
**Problem:** zamawiający zmienia SWZ lub dodaje dokumenty po ocenie, a zespół tego nie widzi. Częściowo robi to dziś sprawdzanie dokumentacji (TT-14, „stale detection") i zmiana daty publikacji w Bazie. **Pomysł:** ujednolicony znaczek „zmienione po ocenie" na karcie i w digeście dla statusów „wpisane" / „do wyjaśnienia". Zbadać `GetTenderLinkedNotices` w eZamówieniach (**niezbadane**, Do walidacji).

### 6. Wyniki rozstrzygnięć: kto wygrał i za ile (High wartość, L, Do walidacji) — niestandardowe
Po kilku tygodniach TED publikuje ogłoszenie o wyniku (`can-standard`) z wykonawcą i ceną; TED API działa bez klucza. Dla analityka raportów dla firm to bardzo cenne dane (kto wygrywa przetargi IT, w jakich cenach). Wymaga trwałego powiązania poza TTL i innego zapytania. Hipoteza: rynek poniżej progów UE (BZP/eZamówienia) da się objąć gorzej niż TED. **Zacząć od prototypu skryptem** na ok. 20 starych ogłoszeniach i sprawdzić, ile wyników faktycznie się znajdzie.

### 7. Indeks rynku z analiz (Medium–High, M–L, Do walidacji) — niestandardowe
Agregacja pozycji z analiz po miesiącach, regionach i kategoriach („ile laptopów zamówiono w tym kwartale"). Problem: `analyses` wygasa razem z przetargiem, więc potrzebny osobny trwały dokument agregatów (np. `marketStats/{miesiąc}`) i kontrola jakości (flagi `quantity_conflict`, `bundled`, `option`). Warto tylko, jeśli pilotaż potwierdzi wiarygodność wyników.

### 8. Analiza dowolnego linku / ręcznie dodane ogłoszenie (Medium, S–M) — niestandardowe
Usługi serwisowe/dzierżawa „które się nie załapały" oraz platformy poza trzema źródłami. Zamiast kolejnego scrapera: przycisk „Dodaj ogłoszenie z linku" tworzący kartę (tytuł, zamawiający, link, ręczny CPV), na której można uruchomić istniejącą analizę po URL. **Częściowo istnieje:** resolver dokumentów (`functions/analysis/resolver/*`).

### 9. Wyciszone słowa i CPV (Medium, S)
Rozszerzenie istniejącego ukrywania zamawiających (`advertisers/{nip}`) o wspólną listę wyciszonych fraz („toner", „drukarki 3D"). Jedno kliknięcie na karcie: „ukryj podobne". Zmniejsza szum bardziej niż kolejne filtry. Ryzyko: ukrycie dobrego ogłoszenia (stosować zasadę z filtra sektora: wątpliwe zostają widoczne).

### Czego nie dodawać
Czatu z dokumentacją, kolejnych źródeł danych, wskaźników pilności terminów (wprost wykluczone w założeniach produktowych), przydzielania zadań (przy dwóch osobach status z autorem wystarcza), pełnego systemu powiadomień z preferencjami.

## Prioritization

| Rekomendacja | Priorytet | Wartość (user / biznes) | Nakład | Złożoność | Ryzyko |
|---|---|---|---|---|---|
| Sugestia triażu z historii (2) | **High** | Wysoka / Wysoka | M | Średnia | Niskie, jeśli tylko podpowiedź |
| Koszyk raportu (4) | **High** | Wysoka / Wysoka | M | Niska | Niskie |
| Wyniki rozstrzygnięć (6), po prototypie | **High** (warunkowo) | Wysoka / Wysoka | L | Wysoka | Średnie (pokrycie danych) |
| Poranny digest (1) | Medium | Wysoka / Średnia | S–M | Niska | Niskie |
| Pamięć zamawiającego (3) | Medium | Średnia / Średnia | S–M | Niska | Niskie |
| Wyciszone frazy (9) | Medium | Średnia / Niska | S | Niska | Niskie |
| Zmiany po ocenie (5) | Medium | Średnia / Średnia | M | Średnia | Średnie (niezbadane API) |
| Dodaj ogłoszenie z linku (8) | Medium | Średnia / Niska | S–M | Niska | Niskie |
| Indeks rynku (7) | Medium | Średnia / Wysoka | M–L | Średnia | Wysokie (jakość danych) |

Uzasadnienie pozycji High:
- **Sugestia triażu**: celuje w najczęstszą czynność (przeglądanie kolejki), wykorzystuje dane, które już są, a przy pomyłce kosztuje tylko zignorowaną podpowiedź. Najpierw offline test trafności na istniejących migawkach.
- **Koszyk raportu**: zamyka przepływ pracy kończący się raportami dla firm; najjaśniejszy, mierzalny efekt.
- **Rozstrzygnięcia**: największy potencjał zmiany charakteru produktu (z listy do triażu w źródło wiedzy rynkowej), ale to na razie hipoteza; prototyp jednorazowym skryptem przed jakąkolwiek budową.

## Final Assessment

Aplikacja ma dojrzałą warstwę pobierania i triażu. Brakuje jej **pamięci** i **wyjścia**: wiedza zespołu ginie po 30 dniach i nie wraca do pracy ani do raportu. Pozycje 2 i 4 dają najwięcej przy rozsądnym nakładzie i nie wymagają LLM ani nowych źródeł. Wyniki rozstrzygnięć to najciekawszy, ale niepewny pomysł, wart jednego wieczoru prototypu.

Sugerowany pierwszy krok: skrypt mierzący trafność podpowiedzi triażu na istniejących migawkach, zanim powstanie jakikolwiek UI.
