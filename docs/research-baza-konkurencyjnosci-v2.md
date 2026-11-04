# Research v2: Baza Konkurencyjności, publiczne wyszukiwanie, załączniki i granice

Stan na 2026-11-04. **To jest research, nie implementacja: w kodzie nie ma jeszcze nic dotyczącego Bazy Konkurencyjności.** Plik uzupełnia i w kilku miejscach **koryguje** `docs/research-baza-konkurencyjnosci.md` (dalej: v1). Czytaj v1 dla historii rozpoznania (mapowanie pól, test luk), a ten plik dla aktualnego stanu wiedzy i rekomendacji. Powiązane: `docs/research-dokumentacja-przetargow.md` (pobieranie dokumentacji i integracja z Tender Explorerem), `docs/handoff.md`, `docs/CLAUDE.md`.

## 1. Najważniejsze ustalenia (TL;DR)

1. **Lista ogłoszeń jest publiczna.** v1 uznał, że wymaga logowania (bo `GET /api/announcements?...` daje 401). To był zły endpoint. Publiczna wyszukiwarka serwisu używa **`GET /api/announcements/search`**, który działa **bez logowania** i ma filtry po dacie publikacji, kodach CPV i kategorii oraz sortowanie po dacie.
2. **Enumeracja numerów (plan z v1) jest zbędna.** Jedno zapytanie na dzień z listą 119 kodów IT z projektu (`IT_CPV_CODES`) zwraca od razu tylko ogłoszenia IT z tego dnia. Znika problem „luk" i listy oczekujących numerów oraz ok. 135-176 zapytań dziennie (zastępuje je 1-3 zapytania + po jednym zapytaniu o szczegóły na każde nowe ogłoszenie IT, ok. 5-40 dziennie).
3. **Załączniki (dokumentacja) pobierają się anonimowo** (`/api/files/<id>`). Każde z 27 zbadanych ogłoszeń IT miało załączniki (161 plików: głównie PDF i DOCX, 3 ZIP-y). To otwiera drogę do integracji z Tender Explorerem dla tego źródła, bez rozwiązywania problemu różnych platform z innych źródeł.
4. **Regulamin nie zakazuje automatycznego pobierania, ale stawia warunki** (sekcja 7): ponowne wykorzystanie wymaga podania źródła (pełna nazwa ministerstwa), daty pozyskania i informacji o przetworzeniu; zakazane są działania utrudniające działanie Bazy. **To nie jest porada prawna.** Nie ma oficjalnego API ani zgody na integrację, więc ryzyko jest „nieformalne": zalecane jest krótkie pytanie do ministerstwa (adres w sekcji 7).
5. **Numer z URL-a to `id` z wyników wyszukiwania.** Pole `id` w odpowiedzi szczegółowej (`/api/announcements/{numer}`) jest wewnętrznym identyfikatorem (v1 miał to jako niewiadomą).

## 2. Co zmienia się względem v1

| v1 (2026-10-30) | v2 (2026-11-04) |
|---|---|
| „Lista ogłoszeń wymaga logowania" (sekcja 2) | **Nieprawda dla wyszukiwarki**: `/api/announcements/search` działa anonimowo. 401 dotyczy tylko `/api/announcements?...` (funkcje dla zalogowanych). |
| Odkrywanie ogłoszeń przez iterowanie po numerach, kursor + lista oczekujących (sekcje 5-7) | **Niepotrzebne.** Wyszukiwanie po dacie publikacji i CPV. |
| Numer z URL-a a pole `id` (niewiadoma, sekcja 6a) | Numer w URL-u (np. `296124`) = `id` z wyników wyszukiwania i z linku `/ogloszenia/296124`. Pole `data.advertisement.id` w szczegółach (np. `392667`) to inny, wewnętrzny numer (`attachments[].origin.id`). |
| Opóźnienie publikacji ok. 1 doby (6a) | **Do kilku dni:** z 9 numerów wciąż dających 404, po kolejnych 5 dniach 4 się pojawiły, 5 nadal nie istnieje. Patrz sekcja 6. |
| Udział IT ok. 8/47 (luźne dopasowanie CPV) | Dokładny filtr CPV z projektu: **ok. 15-16%** ogłoszeń (27/176 dla 2026-11-03; 173/1063 wszystkich aktualnie otwartych). Patrz sekcja 5. |
| Brak informacji o załącznikach | Pobierają się anonimowo, sekcja 4. |
| Regulamin „nie sprawdzony" | Przeczytany, sekcja 7. |
| Mapowanie na `TenderRecord` (sekcja 4 v1) | **Nadal aktualne** dla pól ze szczegółów; patrz sekcja 8 (jak łączyć z wyszukiwaniem). |

## 3. Publiczne API (zweryfikowane 2026-11-04, z przeglądarki)

Wszystko `GET`, bez logowania, origin `https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl`. Odpowiedzi to JSON `{"status":"OK","data":{...}}`, choć nagłówek `Content-Type` to `text/html`. Nagłówków limitujących (`Retry-After`, `X-RateLimit-*`) nie zaobserwowano; nie testowano limitów.

### 3.1 Wyszukiwanie: `/api/announcements/search`

Parametry (nazwy z kodu aplikacji i potwierdzone zapytaniami):

| Parametr | Znaczenie | Sprawdzone |
|---|---|---|
| `status[0]=PUBLISHED` | **wymagany**; bez niego `500 Internal Server Error` | tak |
| `page`, `limit` | paginacja; `limit=1000` zadziałał (zwrócił wszystkie 176 wyników dnia); UI używa 20 | tak (górny limit nieznany) |
| `sort` | `publicationDate` (malejąco: najnowsze pierwsze), `submissionDeadline`, `default` | tak |
| `query` | fraza pełnotekstowa (odpowiedź zawiera `<mark>` w tytule) | tak |
| `publicationDateRange[from]`, `publicationDateRange[to]` | format `YYYY-MM-DD`, włącznie; ten sam dzień w obu = jeden dzień | tak |
| `submissionDeadlineRange[from/to]` | analogicznie dla terminu składania ofert | tylko z kodu |
| `cpvItem[0..n]` | kody CPV; **akceptuje 8 cyfr bez cyfry kontrolnej** (`30213000`); błędna cyfra kontrolna (`30213000-9`) daje 0 wyników; kilka kodów = **OR** (`30213000` + `30213100` = 25 > 9) | tak |
| `category` | etykieta kategorii, np. `Dostawa` (85 z 176 w dniu 2026-11-03) | tak |
| `subcategory`, `programme[]`, `fulfillmentPlaces[]`, `advertiserName`, `advertiserIdentificationNumber`, `full_number` | z kodu aplikacji | nie testowano |

**Filtr CPV działa na dokładne kody.** Wszystkie 27 ogłoszeń zwróconych dla listy 119 kodów IT z projektu miało w szczegółach co najmniej jeden kod z tej listy (dokładne dopasowanie jak w `isItRelatedCpv`). `30000000-9` (poziom nadrzędny, którego żadne ogłoszenie nie ma wprost) zwróciło 0. Cała lista 119 kodów mieści się w jednym zapytaniu (część `cpvItem` ma ok. 3 KB) i `200 OK`. **Nie sprawdzono**, czy bardzo długi URL zadziała zawsze (np. za proxy); w razie problemów dzielić listę na grupy.

**Odpowiedź:** `data.advertisements[]` oraz `data.meta.total`. Pola elementu: `id` (numer ogłoszenia, ten sam co w URL-u), `title` (przy użyciu `query` tablica z tytułem i podtytułem oraz `<mark>`; **kształt bez `query` nie zbadany**), `content` (fragment opisu), `advertiser_name`, `is_mine`, `publication_date` (`YYYY-MM-DD`), `submission_deadline` (`YYYY-MM-DD HH:MM:SS`, strefa nie podana), `fulfillment_place` (np. „Stęszew, wielkopolskie": **miejsce realizacji, nie siedziba zamawiającego**), `favorite`. **Brak** kodów CPV, kategorii i adresu zamawiającego: do mapowania potrzebne są szczegóły (3.2).

**Wyszukiwanie widzi tylko ogłoszenia, które nadal przyjmują oferty (pomiar).** Zakres dat z września 2026, stycznia 2025 i marca 2023 zwrócił 0, a wszystkich ogłoszeń ze statusem `PUBLISHED` bez filtra dat było 1063. Wniosek (nieweryfikowany w dokumentacji): `status=PUBLISHED` oznacza w praktyce ogłoszenia otwarte, a zamknięte po terminie znikają z wyszukiwania. Dla naszego zastosowania (aktualne przetargi) to nie przeszkadza, ale **backfill historyczny nie jest możliwy tą drogą**, a dni sprzed kilku dni są zaniżone (patrz tabela w sekcji 5).

### 3.2 Szczegóły: `/api/announcements/{numer}` (jak w v1)

`200` z `data.advertisement` dla istniejącego numeru, `404` dla nieistniejącego. Struktura i mapowanie na `TenderRecord` opisane w v1, sekcja 4 (nadal aktualne). Dodatkowo: `attachments[]` (sekcja 4), `status.label` (`PUBLISHED`), `created_at`, `modified_at`, `publication_date`.

### 3.3 Strona ogłoszenia

`https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/<numer>` otwiera się **anonimowo** (sprawdzone dla `296124`: pełna treść, lista załączników z przyciskami „Pobierz", przycisk „Podejrzyj inne wersje", pełny numer ogłoszenia w rodzaju `2026-125078-296124`). To jest właściwy `link` do `TenderRecord`.

## 4. Załączniki (dokumentacja)

- W szczegółach: `attachments[]`, każdy z `name` (opis, np. „Zapytanie ofertowe"), `file.name` (nazwa pliku), `file.id` i **`file.uri` = `/api/files/<file.id>`**, `file.created_at`, `origin.publication_date`.
- **Pobranie anonimowe zweryfikowane:** `GET /api/files/3166067` bez ciasteczek zwróciło `200`, `application/pdf`, nagłówek `Content-Disposition` z nazwą, prawdziwy PDF (1,29 MB, nagłówek `%PDF-1.5`).
- Próbka 27 ogłoszeń IT z dnia 2026-11-03: **wszystkie miały załączniki**, łącznie 161 plików (średnio ok. 6 na ogłoszenie): PDF 79, DOCX 73, DOC 5, ZIP 3, XLSX 1. Nie mierzono rozmiarów.
- Ogłoszenia mają **wersje** („obowiązująca wersja z dn. ...", „podejrzyj inne wersje"). Nie zbadano, czy `attachments[]` zawiera pliki ze starszych wersji ani jak wykrywać zmianę ogłoszenia po publikacji (data publikacji się nie zmienia; zmienia się `modified_at`). Dla analizy dokumentacji potrzebne jest ponowne sprawdzenie szczegółów dla ogłoszeń, które nas interesują (np. z gwiazdką), zanim wynik analizy uzna się za aktualny.
- **Dane osobowe w odpowiedziach:** `contact_persons[]` (imię, nazwisko, telefon, e-mail; obecne we wszystkich 27 badanych), `attachments[].file.created_by` (imię i nazwisko osoby wgrywającej), `created_by`, `modified_by`. **Nie przepisywać do `TenderRecord` ani do bazy** (sekcja 7).
- Tender Explorer: ten sam pipeline (`archive`, `extract`, OCR, triaż) obsługuje PDF, DOCX, DOC, XLSX i ZIP, więc ta paczka formatów jest dla niego typowa. Kolejność i role plików (zapytanie ofertowe, OPZ, formularz cenowy, oświadczenia) odpowiadają jego triażowi.

## 5. Wolumen (pomiar 2026-11-04, wyszukiwanie z dokładną listą CPV IT)

Liczba ogłoszeń o danej `publication_date`, które **w chwili pomiaru (2026-11-04, południe) były jeszcze widoczne**:

| Dzień | Wszystkich | Z CPV IT |
|---|---|---|
| 2026-10-26 (pon.) | 33* | 4* |
| 2026-10-27 (wt.) | 62* | 4* |
| 2026-10-28 (śr.) | 142 | 41 |
| 2026-10-29 (czw.) | 122 | 10 |
| 2026-10-30 (pt.) | 132 | 21 |
| 2026-10-31 (sob.) | 10 | 0 |
| 2026-11-01 (niedz.) | 10 | 1 |
| 2026-11-02 (pon.) | 153 | 29 |
| 2026-11-03 (wt.) | 176 | 27 |
| 2026-11-04 (śr., niepełny dzień) | 40 | 7 |

\* Dni najstarsze są **zaniżone**, bo część ogłoszeń zdążyła już zamknąć przyjmowanie ofert i zniknęła z wyszukiwania (sekcja 3.1).

Wnioski (szacunek): w dni robocze ok. 120-180 nowych ogłoszeń, z tego **ok. 10-40 z CPV IT** (średnio ok. 15-16% wszystkich: 27/176 dla 3.11; 173/1063 wszystkich otwartych). Weekend: pojedyncze sztuki. Do odfiltrowania dalej (lista CPV ma celowo niską precyzję, zob. komentarz w `src/utils/cpvCodes.ts`): wśród tytułów z 3.11 widać rzeczy niezwiązane z IT (np. wyposażenie laboratorium, urządzenie laserowe do cięcia).

## 6. Opóźnienie publikacji i „luki" w numeracji (retest testu z v1)

9 numerów z v1, które nadal dawały 404 w dniu 2026-10-30, sprawdzone ponownie 2026-11-04:
- **Teraz istnieją 4**: `296513` (pub. 2026-11-02), `296514` (11-02), `296515` (11-02), `296564` (11-01). Utworzone (`created_at`) 2026-10-29, opublikowane po **3-4 dniach** (`publication_date` i `modified_at` zgodne z datą publikacji).
- **Nadal 404: 5** (`296508`, `296531`, `296553`, `296555`, `296566`): prawdopodobnie szkice nigdy nieopublikowane lub usunięte (niepotwierdzone).

Znaczenie: numer jest nadawany przy utworzeniu szkicu, a ogłoszenie pojawia się dopiero po publikacji, nawet kilka dni później. Gdyby zostać przy enumeracji z v1, okno oczekujących numerów musiałoby wynosić co najmniej tydzień. **Wyszukiwanie po dacie publikacji tego problemu nie ma**: ogłoszenie pojawia się pod swoim `publication_date`. Jedyna pozostała czułość: ogłoszenie opublikowane „wstecznie" (z datą wcześniejszą niż widoczność). W danych nie zaobserwowano; dla pewności odświeżanie powinno obejmować ostatnie 2-3 dni, nie tylko bieżący.

## 7. Regulamin i granice tego, co możemy robić

Przeczytany 2026-11-04: `https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/regulamin` (obowiązuje od 2025-10-08, ostatnia aktualizacja strony 2026-05-13). **To opis mojego odczytu, nie porada prawna.** Dokumentu „Warunki ponownego wykorzystania informacji sektora publicznego" MFiPR, do którego odsyła regulamin, nie udało się pobrać (adres spoza listy dozwolonych); jego istotę (trzy warunki poniżej) podaje sam regulamin.

Co regulamin mówi (parafraza, odwołania do rozdziałów):
- **Rozdz. II pkt 4:** celem Bazy jest powszechnie dostępne odszukiwanie i czytanie ogłoszeń przez oferentów.
- **Rozdz. II pkt 5:** kto wykorzystuje treści Bazy w innym celu, musi przestrzegać „Warunków ponownego wykorzystania informacji sektora publicznego" MFiPR, czyli: (5.1) podać źródło, **pełną nazwę Ministerstwa** (obecnie: Ministerstwo Funduszy i Polityki Regionalnej), (5.2) podać **datę pozyskania** informacji, (5.3) poinformować o **przetworzeniu**, jeśli zaszło. Niedotrzymanie jest opisane jako działanie bezprawne.
- **Rozdz. III pkt 7-8:** zabronione są czynności, które mogą utrudniać działanie Bazy; administrator może zablokować konto.
- **Rozdz. III pkt 11:** zamieszczając materiały, użytkownik zgadza się na ich wgląd przez internautów.
- **Rozdz. VIII pkt 5, 13:** internauta odpowiada za ponowne wykorzystanie danych; Ministerstwo nie odpowiada za cudze naruszenia.
- **Rozdz. V pkt 11-13 i załącznik nr 2:** dane osób do kontaktu (imię, nazwisko, telefon, e-mail) są publikowane z uzasadnienia przejrzystości. Dla nas to dane osobowe (RODO).
- **Nie znalazłem** w regulaminie ani zakazu automatycznego pobierania/scrapingu, ani wyraźnego zezwolenia na nie, ani informacji o oficjalnym API, ani opłat. `robots.txt` nie istnieje w użytecznej postaci (v1: SPA zwraca szkielet dla każdej ścieżki).

Wnioski praktyczne (zalecane zasady, jeśli źródło zostanie wdrożone):
1. **Pokazywać atrybucję** w interfejsie przy ogłoszeniach z tego źródła: „Źródło: Baza Konkurencyjności, Ministerstwo Funduszy i Polityki Regionalnej, pobrano <data>". Gdy dane są przetwarzane (filtry, mapowanie, analiza Tender Explorera), zaznaczyć, że to przetworzenie. Mamy już `fetchedAt` w modelu.
2. **Nie zapisywać danych osobowych**: nie mapować `contact_persons`, `created_by`, `modified_by` i autorów plików. `TenderRecord` ich nie ma i nie powinien mieć.
3. **Spokojne tempo:** zapytania sekwencyjne, przerwy ok. 0,3-0,5 s (tak przeprowadzono pomiary), jedno odświeżenie dziennie lub na żądanie, bez równoległości; uczciwy `User-Agent` z kontaktem. Wzorzec pobierania: 1-3 zapytania wyszukiwania + zapytania o szczegóły tylko dla nowych ogłoszeń. Zwrócić uwagę na rozdz. III pkt 7.
4. **Nie przechowywać plików załączników** poza czasem analizy (zob. architektura w `research-dokumentacja-przetargow.md`). Załączniki to treści osób trzecich (zamawiających); regulamin zakłada ich publiczny wgląd, ale nie przesądza o kopiowaniu.
5. **Zapytać ministerstwo** przed wdrożeniem produkcyjnym. Kontakt z regulaminu i strony głównej: `konkurencyjnosc@mfipr.gov.pl` (wsparcie dla oferentów). Proponowana treść pytania: kim jesteśmy (prywatne narzędzie pomocnicze dla analityka zamówień), co chcemy robić (pobierać metadane ogłoszeń i załączniki publiczne, raz dziennie, niski wolumen, z atrybucją), czy istnieje oficjalne API/eksport, czy mają zastrzeżenia. Odpowiedź (lub jej brak) zapisać w tym pliku.
6. Pamiętać o zastrzeżeniu z rozdz. III pkt 12: Ministerstwo może zmienić działanie Bazy bez uprzedzenia. Endpointy `/api/*` są nieudokumentowane i mogą się zmienić lub zacząć wymagać logowania. Potrzebny test wykrywający zmianę (np. `search` zwraca 200 i `data.meta.total`).

## 8. Proponowana architektura odświeżania (zastępuje sekcję 7 v1)

Źródło pasuje do istniejącego odświeżania po dniu (`refreshTenders(dzień)`), bo wyszukiwanie ma zakres po `publication_date`. Szkic (niezaimplementowany):

1. Dla dnia `D` oraz `D-1` i `D-2` (na ewentualne opóźnienia) wywołać `search` z `status[0]=PUBLISHED`, `sort=publicationDate`, `limit` rzędu 200 (nie 1000 bez potrzeby), zakresem dat i listą `cpvItem[]` z `IT_CPV_CODES` (8 cyfr).
2. Z wyników wziąć `id`. Zbudować identyfikator `BAZA_KONKURENCYJNOSCI_<id>` (przez `tenderId()` po rozszerzeniu `TenderSource`). Sprawdzić, które już są w Firestore (jak dla TED i eZamówień: „dopisuj tylko nowe, nie nadpisuj `status*`").
3. Dla **nowych** ogłoszeń pobrać `/api/announcements/{id}` (ok. 5-40 dziennie) i zmapować (v1 sekcja 4), z poprawkami:
   - `publicationNumber` = `id` z wyszukiwania (numer z URL-a),
   - `link` = `https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/<id>` (zweryfikowane: otwiera się anonimowo),
   - `buyerCity` z `advertiser_address_details.address.locality` (a **nie** z `fulfillment_place` z wyszukiwania, które jest miejscem realizacji),
   - `cpvCodes` z `orders[].order_items[].cpv_items[].code` (w `TenderRecord` w formacie z cyfrą kontrolną, jak dla TED/eZ; porównania w aplikacji i tak normalizują przez `normalizeCpv`),
   - `orderType` z `category` (`1` Usługa, `2` Roboty, `3` Dostawa) z regułą pierwszeństwa jak w `extractOrderType`,
   - `deadlineDate` z części daty `submission_deadline`; **strefa czasowa nieznana** (wartość wygląda na czas lokalny), przed zapisem sprawdzić na kilku ogłoszeniach,
   - `documentsUrl` = link do strony ogłoszenia; lista plików (`attachments[].file`) przydaje się dopiero przy analizie.
4. Błąd źródła zgłaszać jawnie w `errors` (jak `SourceResult` dla TED), z ponawianiem (`requestWithRetry`).
5. Kursor, lista oczekujących numerów i enumeracja z v1 **nie są potrzebne**. Meta-dokument nie jest wymagany.
6. Frontend ma już `TenderSource.BAZA_KONKURENCYJNOSCI` (v1, pkt 4); sprawdzić `tenderMapping.ts` i `tenderFilters.ts`. Dodać atrybucję (sekcja 7).
7. Testy: mapper na zapisanych odpowiedziach (fixture bez danych osobowych), test kontraktowy na kształt odpowiedzi `search` (klucze `data.advertisements`, `data.meta.total`) oraz test wykrywający 401 lub zmianę kształtu.

Integracja z Tender Explorerem: `file.uri` + `file.name` wystarczą do pobrania dokumentacji na żądanie. Dla tego źródła **nie ma problemu różnych platform**: dokumentacja leży w Bazie. Reszta architektury jak w `research-dokumentacja-przetargow.md`.

## 9. Czego NIE sprawdzono (ryzyka)

- Czy te adresy odpowiadają **z Cloud Functions / Cloud Run** (pomiary z przeglądarki; v1 używał skryptów Pythona z `urllib`, więc spoza przeglądarki źródło też odpowiada, ale z adresów Google Cloud nie sprawdzono). Brak informacji o filtrowaniu ruchu z adresów chmurowych.
- Limity zapytań i reakcja na większy ruch (nie testowano; wykonano ok. 80 zapytań API sekwencyjnie z przerwami, odpowiedzi `200`, z wyjątkiem 5 spodziewanych `404` dla nieistniejących numerów i jednego celowego `500` dla zapytania bez `status`).
- Górny limit `limit`, zachowanie przy kilkuset wynikach, kształt `title` bez `query`, wartości `status` poza `PUBLISHED` (czy istnieje dostęp do zamkniętych), semantyka `submissionDeadlineRange`, `category`, `subcategory`, `programme`.
- Strefa czasowa `submission_deadline`.
- Rozmiary i liczba plików w dużych ogłoszeniach (ZIP-y: zawartość nie badana).
- Pliki ze starszych wersji ogłoszenia i sposób wykrywania zmian po publikacji.
- Poprawność tezy, że wyszukiwanie ukrywa ogłoszenia zamknięte (wnioskowana z pomiarów, nie z dokumentacji).
- Treść „Warunków ponownego wykorzystania informacji sektora publicznego" MFiPR (poza trzema warunkami z regulaminu) oraz ewentualne szczególne wymagania dla danych zawierających dane osobowe lub utwory (załączniki).
- Odpowiedź ministerstwa na pytanie o dopuszczalność (jeszcze nie zadane).

## 10. Następne kroki (kolejność)

1. Zapytać ministerstwo (sekcja 7, pkt 5) i zapisać odpowiedź.
2. Dopracować brakujące pomiary z sekcji 9 (limit `limit`, `title` bez `query`, strefa czasowa), najlepiej na emulatorze lub w teście integracyjnym.
3. Dodać `BAZA_KONKURENCYJNOSCI` do `TenderSource`, napisać `functions/tenders/bazakonkurencyjnosci.ts` (mapper + `fetchBaza(day)`) i testy według sekcji 8. Najpierw na projekcie testowym `tenders-test-b5bb3`; zgodnie z zasadami z `handoff.md` bez wdrożenia na produkcję bez zgody.
4. Dodać atrybucję w interfejsie.
5. Dopiero potem integracja dokumentacji z Tender Explorerem.

## 11. Jak odtworzyć pomiary (przeglądarka, origin Bazy)

Powłoka agenta nie sięga tej domeny; użyj konsoli przeglądarki na dowolnej stronie `https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/`:

```js
// wyszukiwanie: jeden dzień, lista CPV (kody 8-cyfrowe z IT_CPV_CODES)
const codes = ['30213000', '30213100' /* ... 119 kodów z src/utils/cpvCodes.ts */];
const cpvq = codes.map((c, i) => `cpvItem%5B${i}%5D=${c}`).join('&');
const day = '2026-11-03';
const url = '/api/announcements/search?page=1&limit=200&sort=publicationDate&status%5B0%5D=PUBLISHED&' + cpvq +
  `&publicationDateRange%5Bfrom%5D=${day}&publicationDateRange%5Bto%5D=${day}`;
const { data } = await (await fetch(url)).json();   // data.meta.total, data.advertisements[]
// szczegóły
const detail = (await (await fetch('/api/announcements/' + data.advertisements[0].id)).json()).data.advertisement;
// plik (bez ciasteczek)
const f = detail.attachments[0].file; // f.uri === '/api/files/<id>'
const resp = await fetch(f.uri, { credentials: 'omit' }); // application/pdf itp.
```

Nazwy parametrów wyszukiwarki zostały odczytane z kodu aplikacji (`/assets/index-*.js`, klasa wyszukiwarki, `getFetchData`); po zmianie wersji aplikacji nazwa pliku się zmieni.

## 12. Zakres wykonanych zapytań (2026-11-04)

Ok. 80 zapytań API (wyszukiwanie ok. 40, szczegóły ok. 37, plik 1), wszystkie sekwencyjnie z przerwą 0,35-0,5 s; cztery pobrania pakietu JS aplikacji (ok. 5 MB każdy) do odczytu nazw parametrów; cztery otwarcia stron (strona główna, regulamin, wyszukiwarka, ogłoszenie). Pobrano jeden plik (PDF 1,3 MB), bez zapisywania go na dysku.

## 13. Sektor zamawiającego jako główny filtr (2026-11-04)

**Potrzeba (od użytkownika):** narzeczona w pierwszym kroku usuwa z listy ogłoszenia firm prywatnych i NGO, bo to zamawiający, których jej firma nie obsługuje. **Spółki komunalne (wodociągi, oczyszczalnie, zakłady usług komunalnych, PGKiM itp.) są obsługiwane**, więc zostają na liście.

**Pomiar** na 173 otwartych ogłoszeniach z kodami IT (heurystyka po nazwie zamawiającego, `advertiser_address_details.name`):

| Wynik | Zamawiający (141 różnych, 13 powtarza się) |
|---|---|
| publiczny / komunalny | 77 |
| NGO | 11 |
| firma prywatna (forma prawna) | 37 |
| niejasne | 16 |

**Znane błędy heurystyki:** spółki komunalne w formie sp. z o.o./S.A. bez słowa kluczowego trafiają do prywatnych (np. Przedsiębiorstwo Wodno-Kanalizacyjne Wołów); słowa typu "ośrodek" czy "centrum" wpuszczają firmy prywatne (Centrum Medyczne Tommed); w "niejasnych" są podmioty publiczne (Kancelaria Prezesa Rady Ministrów, Zespół Opolskich Parków Krajobrazowych), NGO i jednoosobowe działalności. Heurystyka nie nadaje się do automatycznego usuwania.

**Projekt:**
1. Znacznik sektora na ogłoszeniu: publiczny, komunalny, NGO, prywatny, nieznany. Ustawiany heurystyką po nazwie i formie prawnej.
2. Prywatne i NGO są domyślnie ukryte (nie usuwane), z zakładką "ukryte" do odzyskania. "Nieznane" zostają widoczne.
3. Decyzja zapamiętywana po NIP (np. Firestore `advertisers/{nip}`: sektor, źródło auto|ręczne). Ręczna korekta zawsze wygrywa z automatem; ręczne ukrycia narzeczonej uczą listę.
4. Opcjonalnie: sprawdzenie "nieznanych" w rejestrze GUS (REGON/BIR1) po NIP.

**GUS BIR1 (niezweryfikowane):** wyszukiwanie po NIP/REGON/KRS istnieje (SOAP), zwraca m.in. nazwę, adres i formę prawną. Pełne dane wymagają klucza produkcyjnego od GUS; środowisko testowe zwraca dane zanonimizowane. Czy odpowiedź zawiera formę własności (odróżnienie spółki gminnej od prywatnej), nie sprawdzono. KRS Open API i CEIDG to nieprzetestowani kandydaci.

## 14. Wyniki pomiarów i korekty z implementacji (2026-11-04)

Źródło zostało zaimplementowane (opis w `docs/handoff.md`). Poniższe poprawki **mają pierwszeństwo** przed sekcjami 3-9 tego pliku, gdy się z nimi różnią.

- **Data publikacji.** Pole `publication_date` w wynikach wyszukiwania i na wierzchu szczegółów (`data.advertisement.publication_date`) dotyczy **bieżącej wersji** ogłoszenia, więc po każdej zmianie przez zamawiającego pokazuje dzień aktualizacji. Data pierwszej publikacji jest w `data.advertisement.advertisement.publication_date` (przykłady: ogłoszenie 296683 ma wersję z 2026-11-04, a opublikowano je 2026-10-30; 296206 odpowiednio 2026-11-04 i 2026-10-27). Aplikacja zapisuje datę pierwszej publikacji. Na projekcie testowym 25 z 65 pierwszych dokumentów miało przez ten błąd złą datę. Filtr `publicationDateRange` w wyszukiwaniu działa po dacie bieżącej wersji.
- **Numer ogłoszenia.** Numer z adresu strony i z wyników wyszukiwania to `data.advertisement.advertisement.id`. `data.advertisement.id` na wierzchu szczegółów to wewnętrzny identyfikator wersji.
- **`documentsUrl`.** Sekcja 8 pkt 3 proponowała link do strony ogłoszenia; zdecydowano inaczej: `documentsUrl = null`, bo dokumentacja jest pod tym samym adresem co `link`, więc osobny przycisk „Dokumentacja” nie ma sensu.
- **Wyszukiwanie.** `limit` do co najmniej 5000 zwraca wszystkie wyniki jednym zapytaniem (1085 ogłoszeń przy 5000); aplikacja używa 200 na stronę. `title` bez `query` jest zwykłym tekstem. `submission_deadline` ma zawsze format `YYYY-MM-DD HH:MM:SS` (częsta godzina 23:59:59); aplikacja zapisuje samą datę.
- **Zamawiający.** `advertiser_address_details` ma `name`, `identification_number_type` (we wszystkich 173 ogłoszeniach IT: `nip`), `identification_number` oraz `address` (`country`, `voivodeship`, `locality` i inne). Brak pola z formą prawną czy sektorem, więc sektor ustalamy heurystyką po nazwie (`functions/tenders/sector.ts`).
- **Dostęp z chmury.** API Bazy odpowiada z Cloud Functions (projekt testowy, region `europe-central2`); wcześniej sprawdzano tylko z przeglądarki i lokalnie.
- **Nagłówki.** `User-Agent` musi zawierać wyłącznie znaki ASCII (polskie znaki powodują błąd `Invalid character in header content`).
- **Ministerstwo.** Punkt 1 z sekcji 10 (zapytać ministerstwo) został świadomie pominięty decyzją użytkownika; ryzyko opisane w sekcji 7 pkt 6 pozostaje. Odpowiedzi nie ma.
- **Wolumen po wdrożeniu na test:** 65 ogłoszeń IT z dni 2026-11-02 do 11-04 (po poprawce dat część ma wcześniejsze daty publikacji).
- **Sektor (sekcja 13) zaimplementowany** w wersji ostrożnej (ukrywane tylko `private` i `ngo`), z ręcznymi decyzjami po NIP w kolekcji `advertisers`. Wyniki heurystyki na 173 ogłoszeniach: 70 prywatnych, 11 NGO, 38 komunalnych, 25 publicznych, 29 nieznanych.
