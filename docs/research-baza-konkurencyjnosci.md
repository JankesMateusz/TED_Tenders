# Research: Baza Konkurencyjności jako źródło przetargów

Stan na 2026-10-30 (test z sekcji 6 wykonany, patrz 6a). **To jest research, nie implementacja: w kodzie nie ma jeszcze nic dotyczącego Bazy Konkurencyjności po stronie serwera.** Ten plik zbiera wszystko, co ustalono, żeby agent dostający zadanie „dodaj Bazę Konkurencyjności" nie musiał odkrywać tego od nowa. Czytaj go razem z `docs/handoff.md` (stan projektu i zasady pracy) i `docs/CLAUDE.md`.

## 1. Kontekst i decyzje użytkownika

- Baza (`https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/`) publikuje zapytania ofertowe beneficjentów funduszy UE (zasada konkurencyjności). Analityk przegląda ją obok TED i eZamówień, więc to brakujące źródło.
- Wcześniej pominięta, bo „wymaga scrapingu, a nie chciało się tego programować". Użytkownik wyjaśnił, że **nie odrzuca scrapingu**. Narzeczona korzysta w pracy z desktopowej aplikacji (C++, Windows), w której informatyk firmy ma już pobieranie z Bazy, więc da się to zrobić.
- Decyzja z 2026-10-30: **robimy to jako małe R&D, bez pośpiechu**, i czekamy na wynik jednego testu (sekcja 6) przed budową. Użytkownik wskazał to źródło jako pierwsze z listy usprawnień.
- Nie znamy regulaminu platformy i nie sprawdzaliśmy, czy dopuszcza automatyczne pobieranie. Do ustalenia przed wdrożeniem na produkcję (decyzja użytkownika).

## 2. Czego NIE ma (nie szukaj ponownie)

- Brak oficjalnego, udokumentowanego API, RSS, Swaggera, eksportu CSV/XML. `robots.txt`, `sitemap.xml`, `/rss`, `/swagger` zwracają ten sam szkielet aplikacji (SPA przechwytuje wszystkie ścieżki).
- Brak zbioru w katalogu `dane.gov.pl` (sprawdzone przez `https://api.dane.gov.pl/1.4/datasets?q=...`).
- **Lista ogłoszeń wymaga logowania:** `GET /api/announcements?...` zwraca `401 Unauthorized` w każdym wariancie (także z `mode=normal|visible|advertisements`). Frontend dokłada nagłówek `Authorization: Bearer` z Keycloaka (`id.funduszeeuropejskie.gov.pl`) i wylogowuje po 401. Logowanie na konto w ich systemie odradzamy: wymaga trzymania danych logowania i zapewne nie jest przewidziane regulaminem.
- Strona jest aplikacją JS (bundle `/assets/index-*.js`, ok. 5 MB), więc zwykłe pobranie HTML nie daje treści. Czytanie bundla pozwoliło znaleźć endpointy (poniżej).

## 3. Co działa publicznie (bez logowania)

| Endpoint | Wynik |
|---|---|
| `GET /api/announcements/{id}` | `200`, JSON ze szczegółami **jednego ogłoszenia o danym numerze**. Odpowiedź ma nagłówek `text/html`, ale treść to JSON (`{"status":"OK","data":{"advertisement":{...}}}`). Nieistniejący numer: `404` z `{"status":"Error","message":"Not Found"}` |
| `GET /api/dictionaries/search-filters` | słownik filtrów (województwa, kategorie zamówienia, programy) |

Pozostałe `/api/*` z bundla (np. `offerset`, `favorite-announcements`, `newsletter-filters`) to funkcje dla zalogowanych; nie sprawdzano ich.

## 4. Struktura ogłoszenia (`data.advertisement`)

Sprawdzono na 47 ogłoszeniach z 2026-10-29 (wszystkie `status.label == "PUBLISHED"`). Klucze najwyższego poziomu: `id`, `title`, `publication_date` (`YYYY-MM-DD`), `submission_deadline` (`YYYY-MM-DD HH:MM:SS`), `planned_sign_date`, `created_at`, `modified_at`, `status` (`{id, label, name}`), `partial_offer_allowed`, `supplementary_orders`, `terms_of_contract_change`, `contact_persons[]`, `advertiser_address_details`, `attachments[]`, `orders[]`, `created_by`, `modified_by`.

- **Zamawiający:** `advertiser_address_details.name` (nazwa), `.identification_number` i `.identification_number_type` (np. `nip`), `.address.{country, voivodeship, poviat, commune, locality, street, number_description, ...}`.
- **Zamówienie:** `orders[]` (każde z `title`, `estimated_value` jako tekst `"9600,00"`, `evaluation_criteria`, `order_items[]`).
- **Pozycje:** `orders[].order_items[]` ma m.in. `description`, `category` (`{id, name}`), `subcategory` (`{id, name}`), `cpv_items[]` (`{id, code, name}`, np. `{"code":"80500000-9"}`), `fulfillment_places`, `warranty_period`.
- **Kategorie** (`category`): `1` = Usługa, `2` = Roboty budowlane, `3` = Dostawa. W próbce każda pozycja miała kategorię i każde ogłoszenie miało co najmniej jedno CPV.

### Propozycja mapowania na `TenderRecord` (`functions/tenders/model.ts`) — NIEZWERYFIKOWANA w kodzie
- `source`: nowa wartość `'BAZA_KONKURENCYJNOSCI'` (typ `TenderSource` w `model.ts` ma dziś tylko `TED` i `E_ZAMOWIENIA`; frontend ma już enum `BAZA_KONKURENCYJNOSCI`).
- `publicationNumber`: **do ustalenia** (patrz sekcja 6a): numer z URL-a (`/api/announcements/{numer}`) nie jest równy polu `id` w odpowiedzi (np. `296509` → `id` 393223). Roboczo kluczem powinien być numer z URL-a, bo to po nim iterujemy, ale nie sprawdzono, który z nich jest w linku do ogłoszenia (`tenderId()` da np. `BAZA_KONKURENCYJNOSCI_296563`).
- `title`: `title`; `buyerName`: `advertiser_address_details.name`; `buyerCity`: `address.locality`; `country`: `address.country` (np. „Polska").
- `publicationDate`: `publication_date`; `publicationTime`: `null`; `deadlineDate`: data z `submission_deadline` (część przed spacją; sprawdzić strefę czasową).
- `cpvCodes`: spłaszczone `cpv_items[].code` ze wszystkich pozycji wszystkich zamówień.
- `orderType`: z `category`, z tą samą regułą pierwszeństwa co dla TED (Delivery > Services > Works); wzorzec: `extractOrderType` w `functions/tenders/ted.ts`.
- `link`: prawdopodobnie `https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/{id}`. Wzorzec ścieżki `/ogloszenia/${id}` jest w bundlu, **ale nie sprawdzono**, czy ta strona otwiera się bez logowania.
- `buyerMainActivity`: `null`.

## 5. Numeracja i wolumen

- Numery rosną w czasie: ok. 100 000 → 2022-03, 250 000 → 2025-10, 280 000 → 2026-06, najwyższy znaleziony ok. **296 563** (2026-10-29). Daje to ok. 130–140 numerów dziennie.
- W oknie 65 kolejnych numerów (296 499–296 568): 47 istniejących, **18 zwróciło 404 (ok. 28%)**.
- Przybliżony udział IT: ok. 8 z 47 pasowało do listy CPV z `cpvFilter.ts` (liczba zawyżona, bo użyto luźnego dopasowania prefiksów; prawdziwy filtr to `src/utils/cpvFilter.ts`). W pobieraniu trzeba pobrać wszystkie numery i odfiltrować po naszej stronie; filtrowania po stronie ich serwera nie ma.
- Wniosek: ok. 135 lekkich żądań dziennie, narzut pomijalny. Kluczowe jest jedno: **luki w numeracji**.

## 6. Niewiadoma, od której zależy projekt kursora (do sprawdzenia jako pierwsze)

18 numerów dających 404 mogło być szkicami, ogłoszeniami usuniętymi lub wycofanymi albo jeszcze nieopublikowanymi. Jeśli któryś z nich **pojawia się później** pod tym samym (starszym) numerem, to pobieranie „tylko numerów wyższych od ostatniego" je zgubi. Poszlaka: numer 270 000 miał `created_at` 2026-03-19, a `publication_date` 2026-03-22.

**Test (wykonany, wynik w sekcji 6a):** 18 numerów, które 2026-10-29 wieczorem (w pierwotnej notatce błędnie: 2026-10-30 ok. 23:50) zwróciły 404 w oknie 296 499–296 568, to:
`296508, 296509, 296512, 296513, 296514, 296515, 296517, 296519, 296521, 296531, 296534, 296535, 296553, 296555, 296564, 296566, 296567, 296568`.
Należy pobrać je ponownie (np. po dobie lub dłużej) i sprawdzić, czy któreś już istnieją, oraz czy zmieniła się ich liczba w całym oknie.
- Jeśli **tak**: kursor musi ponawiać brakujące numery z ostatnich kilku–kilkunastu dni (np. lista „oczekujących" w dokumencie `meta`).
- Jeśli **nie**: wystarczy prosty kursor „ostatni sprawdzony numer".

### 6a. Wynik testu (2026-10-30, ok. 13:20): luki się wypełniają

Ponowne pobranie 18 numerów: **9 istnieje, 9 nadal zwraca 404.**
- Istnieją: 296509, 296512, 296517, 296519, 296521, 296534, 296535 (siedem poniżej dawnego maksimum 296563, czyli zwykły kursor „tylko wyższe" by je pominął) oraz 296567, 296568 (zwykłe nowe ogłoszenia powyżej maksimum).
- Nadal 404: 296508, 296513, 296514, 296515, 296531, 296553, 296555, 296564, 296566 (nieznane: szkice jeszcze nieopublikowane albo skasowane).
- Wszystkie nowo widoczne mają `status` `PUBLISHED`. Siedem z nich miało `created_at` 2026-10-29 (14:53–16:53), `publication_date` 2026-10-30 i `modified_at` rano 2026-10-30. Numer jest więc nadawany przy utworzeniu szkicu, a ogłoszenie staje się widoczne dopiero po publikacji, zwykle z opóźnieniem ok. doby.
- **Wniosek:** kursor musi trzymać listę „oczekujących" numerów (luk) z ostatnich kilku–kilkunastu dni i ponawiać je przy każdym pobraniu. Okno trzeba dobrać do opóźnienia publikacji; zmierzono tylko ok. 1 dnia, najdłuższego nie znamy (do sprawdzenia dla dziewięciu numerów, które nadal dają 404, po kilku dniach).
- **Numer z URL-a ≠ pole `id`:** `/api/announcements/296509` zwraca `id` 393223, `296512` → 393226, `296517` → 393232, `296519` → 393237, `296521` → 393240, `296534` → 393257, `296535` → 393258, `296567` → 393297, `296568` → 393377. Sekcje 4–5 zakładały, że `id` to numer; trzeba rozstrzygnąć, który jest w linku do strony ogłoszenia (`/ogloszenia/{...}`) i który jest stabilny.

## 7. Proponowany plan (niezaczęty)

1. ~~Wykonać test z sekcji 6~~ (zrobione, sekcja 6a: kursor z listą oczekujących). Wyjaśnić numer z URL-a a `id` i link do ogłoszenia.
2. Napisać `functions/tenders/bazakonkurencyjnosci.ts` w stylu `ted.ts`: mapper (`mapBazaNotice`) i `fetchBaza(...)` z `requestWithRetry` z `http.ts`; testy mappera w `tests/mappers.test.mjs` na zapisanych przykładach prawdziwych odpowiedzi (utworzyć fixture z 2–3 rekordów, bez danych osobowych kontaktów). Rozszerzyć typ `TenderSource` w `model.ts`.
3. Kursor w dokumencie `meta/` (np. `meta/bazaCursor`: ostatni sprawdzony numer, ewentualnie lista oczekujących). Dopiero potem włączyć do `refreshTenders` (obecnie odświeżanie jest po dniu, a źródło jest po numerach, więc trzeba zdecydować, jak to połączyć: np. pobrać wszystko od kursora i zapisać pod właściwymi `publicationDate`) oraz rozważyć zaplanowane uruchomienie raz dziennie.
4. Frontend ma już `TenderSource.BAZA_KONKURENCYJNOSCI`, konfigurację i filtry; sprawdzić `tenderMapping.ts` (mapowanie źródła) i `tenderFilters.ts`.
5. Backfill nie jest potrzebny na start (przechowujemy 30 dni, więc przy pierwszym uruchomieniu pobrać ok. 30 dni wstecz = ok. 4000 numerów; to największy jednorazowy koszt, ograniczyć tempem).

## 8. Zasady ostrożności przy dalszych zapytaniach do ich serwera

- Zapytania rzadkie i sekwencyjne: w rozpoznaniu użyto przerwy ok. 0,25–0,3 s między żądaniami i nagłówka `User-Agent`. Łącznie do tej pory wykonano ok. 130 żądań.
- Nie pobierać hurtowo ani równolegle; nie omijać zabezpieczeń; nie logować się na cudze konta.
- Kod produkcyjny: raz dziennie plus ręczne odświeżenie, wyraźny błąd źródła zamiast ciszy (jak `errors` w `SourceResult` dla TED), ponawianie z odstępami, limit żądań na jedno uruchomienie.

## 9. Jak odtworzyć rozpoznanie (skrypty nie są w repozytorium)

Użyte były krótkie skrypty Pythona z `urllib` w katalogu tymczasowym. Esencja: `GET https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/api/announcements/{id}` z `User-Agent: Mozilla/5.0`; odpowiedź `json.load`; sukces to `status == "OK"` i dane w `data.advertisement`. Górną granicę numerów znaleziono wyszukiwaniem binarnym po istnieniu numeru (uwaga: luki mogą ją zafałszować, więc po znalezieniu sprawdzić kilka sąsiednich).
