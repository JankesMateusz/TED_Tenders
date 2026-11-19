# Pomysły na rozwój aplikacji

Spisane z rozmowy 2026-11-17. To lista do oceny, nie plan wdrożenia. Nie powtarza pomysłów z `docs/review/feature-discovery-2026-11-08.md`, `docs/review/improvement-review-ux-automatyzacja-2026-11-08.md` ani etapów C–I z `docs/zamowienia/plan.md`.

Oznaczenia pewności: **Sprawdzone** (wywołane lub policzone na danych), **Założenie** (niesprawdzone).

## 1. Lista pomysłów

### Łączenie modułów Przetargi i Zamówienia

1. **Karta zamawiającego łącząca oba moduły.** Na karcie przetargu linia „znany zamawiający: 12 zamówień w 2026, głównie notebooki, ostatnio wygrał X", z linkiem do profilu (historia, kontakty, zwycięzcy). Mocniejsza wersja „pamięci zamawiającego", bo dane w Postgresie nie wygasają po 30 dniach. Ograniczenie: zamawiający w bazie nie mają NIP-u (patrz 2.2), więc dopasowanie idzie po nazwie.
2. **Globalna wyszukiwarka (Ctrl+K).** Jedno pole szukające w przetargach, zamówieniach, zamawiających i zwycięzcach, z przejściem do właściwego modułu.
3. **Oś czasu postępowania.** Publikacja, zmiany, ocena zespołu, wpis do bazy, rozstrzygnięcie, wysyłka do klienta w jednym widoku. Ma sens po etapach C i D.
4. **Wykrywanie powtórek postępowań.** Unieważniony przetarg wraca z nowym numerem; aplikacja podpowiada poprzednie zamówienie i pozwala skopiować pozycje. Zbadane, patrz 2.2.

### Szybsze wpisywanie

5. **Wklejanie pozycji z tabeli.** Tabela skopiowana z PDF-a lub Excela zamawiającego rozkłada się na wiersze pozycji do poprawienia.
6. **Kontakt z ogłoszenia jako podpowiedź.** Osoba kontaktowa i e-mail z ogłoszenia pobierane na żądanie przy wpisywaniu, bez zapisywania ich w Firestore.
7. **Zamawiający po NIP z rejestru GUS.** Autouzupełnianie nazwy i adresu, mniej duplikatów. Zbadane, patrz 2.1.

### Jakość danych i raportu

8. **Kontrola jakości danych przed raportem.** Reguły wyłapujące podejrzane wpisy: `Cancel` ze zwycięzcą, `Confirmed` bez zwycięzcy, wartość odstająca o rzędy wielkości, termin ofert przed publikacją.
9. **Sprawdzanie martwych linków.** Nocne zadanie oznacza zamówienia z niedziałającym linkiem do dokumentacji.
10. **Klasyfikacja sektora z GUS zamiast z nazwy.** Forma prawna, własności i finansowania z rejestru REGON w miejsce heurystyki w `functions/tenders/sector.ts`. Patrz 2.1.

### Wiedza rynkowa dla klientów

11. **Radar odnowień.** Z historii zamówień lista „prawdopodobne zakupy w najbliższych kwartałach" po zamawiającym i kategorii. Wymaga starszych lat (pytanie otwarte nr 10 w `plan.md`).
12. **Plany postępowań.** Sygnał o zakupie na miesiące przed ogłoszeniem. Zbadane, patrz 2.3.
13. **Liczba ofert jako miara konkurencji.** „Średnio 2,3 oferty na przetarg na notebooki". Ma sens razem z wynikami rozstrzygnięć.
14. **Mapa zamówień.** Polska po województwach, kolorowana liczbą zamówień lub ilością sprzętu.
15. **Pytania do bazy po polsku.** Pytanie tłumaczone na SQL na roli tylko do odczytu, z pokazaniem zapytania. Do modelu idzie schemat i pytanie, wyniki zostają w bazie.

### Praca analityczki i prezentacja POC

16. **Kolejka dopytań mailowych.** Gotowy mail do zamawiającego z listą pozycji, status „wysłano, brak odpowiedzi", przypomnienie. Zależy od pytania otwartego nr 8 (pisma).
17. **Tryb demo na danych syntetycznych i pomiar czasu wpisywania.** Wersja do pokazania firmie bez poufnego raportu oraz liczba „zamówienie w N minut zamiast M".

## 2. Ustalenia z researchu

### 2.1. GUS, API REGON (BIR1)

- **Dostępność (Sprawdzone):** usługa i dane są bezpłatne. Środowisko testowe działa od ręki z publicznym kluczem `abcde12345abcde12345` pod `https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc`; dane są z 19.10.2018 i mają zanonimizowane adresy.
- **Klucz produkcyjny (Sprawdzone):** jest konieczny. Klucz testowy na adresie produkcyjnym zwraca pusty identyfikator sesji. Wniosek mailem na `regon_bir@stat.gov.pl` z nazwą podmiotu i jego numerem REGON.
- **Osoba prywatna (Założenie):** nie znalazłem potwierdzenia, że klucz dostanie ktoś bez REGON-u, ani ile się czeka.
- **Protokół (Sprawdzone):** SOAP 1.2. `Zaloguj` zwraca `sid`, który idzie w nagłówku HTTP kolejnych wywołań. `DaneSzukajPodmioty` szuka po NIP, REGON lub KRS (także kilka NIP-ów naraz). `DanePobierzPelnyRaport` zwraca pełne dane po numerze REGON.
- **Pułapki (Sprawdzone):** wynik to XML zapisany jako tekst w kopercie SOAP; zły NIP i wygasła sesja dają tę samą pustą odpowiedź z HTTP 200, a powód trzeba doczytać przez `GetValue('KomunikatTresc')`.
- **Zawartość (Sprawdzone dla jednego podmiotu):** nazwa, adres, województwo, powiat, gmina, typ podmiotu; w pełnym raporcie telefon, e-mail, strona www, szczególna forma prawna, forma własności, forma finansowania.
- **Limity:** 6 000 zapytań na godzinę i 3 na sekundę w godzinach 8–17 (według strony GUS).
- **Do sprawdzenia przed budową:** `curl` z Git Bash odrzucił certyfikat serwera GUS, systemowy `curl` Windows połączył się poprawnie. Trzeba sprawdzić połączenie z Cloud Functions. Wartości pól dla spółek komunalnych i prywatnych operatorów są niesprawdzone (wymaga klucza produkcyjnego).
- **Alternatywa:** Wykaz podatników VAT (Ministerstwo Finansów) ma REST bez klucza, ale obejmuje tylko podatników VAT, więc pominie część jednostek budżetowych.
- **Klient Node:** pakiet `bir1` na npm (stan utrzymania nieoceniany).

### 2.2. Wykrywanie powtórek postępowań

Policzone 2026-11-17 na bazie Neon (7 773 zamówienia, publikacje od 2025-12-23 do 2026-11-07).

**Czy zjawisko istnieje (Sprawdzone):**

| Miara | Wartość |
|---|---|
| Zamówienia, w których wszystkie pozycje mają status `Cancel` | 1 351 (17% wszystkich) |
| Z nich mają późniejsze zamówienie tego samego zamawiającego w ciągu 7–180 dni, z identycznym zestawem kategorii LoB i identyczną sumą ilości | 758 (56%) |
| Mediana odstępu między unieważnionym a powtórką | 35 dni |
| Zamówienia wyglądające na powtórkę | 769 (ok. 10% wszystkich), 2 388 pozycji (ok. 8%) |
| Powtórki, które same zostały znów unieważnione | 188 |
| Ten sam warunek dla zamówień bez żadnej pozycji `Cancel` (tło) | ok. 4% |

Różnica 56% do 4% pokazuje, że reguła łapie prawdziwe powtórki, a nie przypadkowe podobieństwa.

**Ograniczenia danych (Sprawdzone):**

- `orders.name` jest puste we wszystkich 7 773 zamówieniach, więc w bazie nie ma tytułów do porównania. Dopasowanie musi iść po zamawiającym, kategoriach i ilościach.
- `buyers.nip` jest puste u wszystkich 3 792 zamawiających. Powiązanie przetargu z listy z zamawiającym w bazie musi iść po znormalizowanej nazwie.
- Numer przetargu zamawiającego (`end_user_bid_number`) jest w 7 530 zamówieniach; nie sprawdzałem, czy powtórki mają podobne numery.

**Założenia:** status pozycji `Cancel` oznacza unieważnienie; „ten sam zamawiający" to rekord główny po `merged_into_id`. Nie oglądałem pojedynczych par, więc odsetek fałszywych trafień w ścisłej regule jest nieznany.

**Jak to zbudować:**

1. **W module Zamówienia, przy wpisywaniu (najprostsze):** po wyborze zamawiającego formularz pokazuje jego unieważnione zamówienia z ostatnich 180 dni i przycisk „Skopiuj pozycje z MDP X". Jedno zapytanie SQL, bez nowych danych. Wymaga zapisów z etapu C.
2. **Na karcie przetargu:** „ten zamawiający ma unieważnione zamówienie sprzed 35 dni (notebooki, 120 szt.)". Wymaga dopasowania zamawiającego po nazwie, czyli wspólnej normalizacji z `db/import/normalize.mjs`.
3. **Trwałe powiązanie:** kolumna wskazująca poprzednie podejście, przydatna do statystyk („ile przetargów udaje się za drugim razem").

**Ocena:** warte zrobienia w wariancie 1. Około co dziesiąte zamówienie dałoby się wpisać przez skopiowanie, a koszt to jedno zapytanie i jeden przycisk w formularzu, który i tak powstanie.

**Dostęp na produkcji i NIP (2026-11-17, z kodu i dokumentacji, bez nowych zapytań do bazy):**

- **Moduł Zamówienia jest wyłączony na produkcji w trzech miejscach (Sprawdzone w kodzie):** frontend (`REACT_APP_ENABLE_ORDERS` w `deploy.yml` jest `true` tylko dla `develop`), eksport funkcji (`functions/index.ts` eksportuje je tylko przy pliku `orders.enabled`, który CI tworzy tylko dla `develop`) i sekret `ORDERS_DATABASE_URL` (jest tylko w projekcie testowym).
- **Baza Neon nie jest ukryta.** To jedna baza niezależna od projektów Firebase. Produkcyjne funkcje mogłyby się z nią połączyć po ustawieniu sekretu w `tendersted`. Blokadą jest decyzja o dostępie, bo baza zawiera kontakty urzędników i poufne dane firmy, a nie kod.
- **Warianty na produkcję (Założenie, niewdrożone):** (A) funkcja dla zalogowanych z rolą (`requireRole`; `requireMember` jest tymczasowo otwarty na sesje anonimowe, więc go nie używać); (B) funkcja zwracająca tylko wynik („unieważnione 35 dni temu, notebooki, 120 szt.") przez osobną rolę Postgresa tylko do odczytu na widoku z minimum kolumn. Wariant 1 powyżej (formularz w module Zamówienia) działa na `develop` i niczego od produkcji nie wymaga.
- **NIP:** gałąź `feature/ezamowienia-buyer-nip` (commit `89791b0`) nie zmienia pobierania przetargów, tylko zapisuje `buyerNip` z pola `organizationNationalId` (przyjmuje wartości po normalizacji do 10 cyfr, odrzuca REGON). Dotyczy eZamówień i Bazy Konkurencyjności; TED nie ma NIP-u. Pomaga po stronie listy, ale `buyers.nip` w Postgresie jest nadal puste, więc dopasowanie po NIP-ie wymaga najpierw uzupełnienia danych.
- **Jak uzupełnić `buyers.nip` (Założenie):** przy zapisie przyciskiem „Wpisz do bazy" (`orders.source_tender_id` wskazuje przetarg z NIP-em); dla historii przez dopasowanie po nazwie albo API REGON (ścieżka „nazwa do NIP" niesprawdzona); z ogłoszeń o wyniku z oficjalnego API BZP. Unikalny indeks `buyers_nip_uq` wymaga wcześniejszego scalenia duplikatów po nazwie (`merged_into_id`); nie sprawdzano, ilu to dotyczy.
- **Nie sprawdzono:** odsetka fałszywych trafień reguły powtórek, ilu zamawiających z `buyers` da się dopasować do NIP-ów z przetargów.
- **Decyzja (2026-11-17):** pomysł odłożony.

### 2.3. Plany postępowań (eZamówienia)

**Co działa (Sprawdzone):**

- Lista opublikowanych planów jest dostępna z tego samego endpointu, którego aplikacja już używa: `GET /mo-board/api/v1/Board/Search?noticeType=TenderPlanNotice&publicationDateFrom=...&publicationDateTo=...`.
- Od 1 do 17 listopada 2026 było 2 016 publikacji, czyli ok. 120 dziennie. Numer ma postać `2026/BZP 00120679/02/P`, gdzie `/02/` to kolejna wersja planu (widziałem wersję 21).
- Każdy wpis zawiera nazwę zamawiającego, miasto, województwo, NIP (`organizationNationalId`) i datę publikacji.

**Co nie działa (Sprawdzone):**

- Wpis na liście nie ma treści planu: `orderObject`, `cpvCode` i `htmlBody` są puste.
- Endpointy szczegółów używane dla ogłoszeń nie zwracają treści planu: `Board/GetNoticeHtmlBodyById` daje pustą odpowiedź, `Board/GetNoticePdfById` błąd 500.
- Oficjalne API BZP (`/mo-board/api/v1/notice`) odrzuca typ `TenderPlanNotice`; plany nie należą do jego zakresu.
- API planów (API PP) jest dla systemów zamawiających: wymaga tokenu i przejścia testów integracyjnych, służy do publikowania własnego planu.

**Nierozstrzygnięte:** strona eZamówień pokazuje treść planu po kliknięciu, więc jakiś endpoint ją zwraca. Nie znalazłem go w kodzie publicznego klienta; najprościej podejrzeć go w zakładce Sieć przeglądarki przy otwieraniu planu.

**Ocena:** dziś da się zrobić tylko sygnał „zamawiający X opublikował lub zmienił plan", bez informacji, co planuje kupić. Pełna funkcja zależy od znalezienia endpointu z treścią. Nawet wtedy zostają dwa koszty: plany są aktualizowane wielokrotnie, więc trzeba porównywać wersje, oraz ok. 120 planów dziennie przy limicie 30 zapytań na minutę. Nie wiem, czy pozycje planu mają kody CPV; jeśli nie, filtr IT musiałby działać po słowach z opisu.

### 2.4. Odkrycie przy okazji: oficjalne API BZP

`GET https://ezamowienia.gov.pl/mo-board/api/v1/notice` to udokumentowane, publiczne API (bez wniosku i klucza, limit 30 zapytań na minutę z jednego adresu IP od 6.10.2026). W porównaniu z `Board/Search`, którego aplikacja używa dziś:

- strona do 500 rekordów zamiast 10 (**Sprawdzone** w specyfikacji, wywołane z `PageSize=1`),
- zwraca pełną treść ogłoszenia w `htmlBody` (37 tys. znaków w próbce), w której powinien być adres dokumentacji (**Założenie**, treści nie analizowałem),
- zwraca NIP zamawiającego,
- dla typu `TenderResultNotice` zwraca wynik postępowania i listę wykonawców z nazwą, miastem i NIP-em (**Sprawdzone** na jednym ogłoszeniu).

To otwiera trzy rzeczy z wcześniejszych list: link do dokumentacji dla eZamówień, wyniki rozstrzygnięć poniżej progów UE (pomysł 6 z feature discovery) i NIP zamawiających.

**Pomiar na jednym dniu, 2026-11-16 (Sprawdzone):**

- Jedno zapytanie o `ContractNotice` z `PageSize=500` zwróciło 500 ogłoszeń w 4,4 s, ale odpowiedź waży 16,7 MB (pełna treść każdego ogłoszenia). Dzień ma więcej niż 500 ogłoszeń; kolejne strony pobiera się parametrem `SearchAfter` (niesprawdzony).
- Wszystkie 500 miało treść i NIP zamawiającego.
- Pole „3.1.) Adres strony internetowej prowadzonego postępowania" miało adres http w 484 z 500 ogłoszeń (platformazakupowa.pl, logintrade, ezamowienia.gov.pl i inne).
- Treść ogłoszenia zawiera też: adres i e-mail zamawiającego, rodzaj zamawiającego, numer referencyjny, liczbę części oraz numer planu postępowań i identyfikator pozycji planu.
- Filtr `CpvCode` działa po stronie serwera: `TenderResultNotice` z kodem 30213100-6 dało 7 ogłoszeń.
- Ogłoszenie o wyniku zawiera dla każdej części: zawarcie umowy albo unieważnienie z przyczyną, liczbę ofert, cenę najniższą i najwyższą, cenę zwycięzcy, datę i wartość umowy, wykonawcę z NIP-em oraz numer pierwotnego ogłoszenia o zamówieniu (pole 2.14), po którym wynik da się powiązać z przetargiem.

**Decyzja (2026-11-17):** lista przetargów zostaje na `Board/Search`. Wyniki rozstrzygnięć z oficjalnego API są odłożone do czasu rozbudowy modułu Zamówień (etap D).

**Korekta po przeczytaniu kodu (2026-11-17):** planowane dociąganie adresu dokumentacji i NIP-u z oficjalnego API okazało się zbędne.

- Odnośnik do dokumentacji dla eZamówień już istnieje: sprawdzanie dokumentów (`functions/analysis/resolver/ezamowienia.ts`) czyta pole 3.1 ogłoszenia i zapisuje adres w `docsCheck.sourceUrl`, a `docsLinkUrl` w `src/utils/docsCheck.ts` używa go na karcie. Wcześniejsze stwierdzenie, że przycisk dokumentacji nie działa dla eZamówień, pochodziło z nieaktualnego `handoff.md`.
- NIP zamawiającego zwraca już `Board/Search` w polu `organizationNationalId` (90 z 90 ogłoszeń w próbie; jedno miało 9 cyfr, czyli REGON). Zapis NIP-u zrobiono na gałęzi `feature/ezamowienia-buyer-nip` bez dodatkowych zapytań; ukrywanie zamawiających zostało ograniczone do Bazy Konkurencyjności.
- Oficjalne API pozostaje przydatne do wyników rozstrzygnięć i do pełnej treści ogłoszenia (kontakt, liczba części, numer planu).

**Pobieranie pojedynczego ogłoszenia (Sprawdzone):**

- `NoticeType=ContractNotice&NoticeNumber=<numer>&PublicationDateFrom=...&PublicationDateTo=...&PageSize=1` zwraca jedno ogłoszenie: ok. 40 KB, 0,3–0,6 s.
- Numer działa z końcówką wersji i bez niej (`2026/BZP 00540905/01` i `2026/BZP 00540905`).
- Zakres dat jest obowiązkowy (bez niego HTTP 400) i musi obejmować dzień publikacji; zły dzień daje pustą listę. Zakres może być szeroki (sprawdzony cały rok).
- Stronicowanie: `SearchAfter` przyjmuje `objectId` ostatniego rekordu poprzedniej strony.
- `CpvCode` przyjmuje jeden kod albo prefiks (`302` dało 22 ogłoszenia); lista kodów po przecinku zwraca pusty wynik.

**Uwagi:** NIP wykonawcy bywa zapisany z przedrostkiem („NIP 5861584525"), więc wymaga normalizacji. Dane są w HTML-u z numerowanymi etykietami, więc potrzebny jest parser pól po numerach sekcji. Rozmiar odpowiedzi wymaga uwagi przy pamięci funkcji.

## 3. Źródła

- API REGON, GUS: https://api.stat.gov.pl/Home/RegonApi
- Klient `bir1`: https://npmjs.com/package/bir1
- Wykaz podatników VAT, KAS: https://www.gov.pl/web/kas/jak-korzystac-z-wykazu
- Integracja z Platformą e-Zamówienia (lista API, limity, załączniki): https://ezamowienia.gov.pl/pl/integracja/
- Załącznik 3, instrukcja API BZP: https://media.ezamowienia.gov.pl/pod/2022/08/Zalacznik-3-Instrukcja-integracji-z-API-BZP.zip
- Załącznik 4, instrukcja API PP: https://media.ezamowienia.gov.pl/pod/2023/03/Zalacznik-4-Instrukcja-integracji-z-API-PP.zip
