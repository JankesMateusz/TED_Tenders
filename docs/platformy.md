# Sprawdzanie dokumentacji na kolejnych platformach: wyniki i plan

Stan na 2026-11-17. Dokument dla agenta zaczynającego pracę nad rozszerzeniem resolvera dokumentacji (`functions/analysis/resolver/`). Czytaj razem z `docs/CLAUDE.md` (zasady pracy) i `docs/handoff.md` (środowisko, gałęzie, CI). Wcześniejszy research tego obszaru: `docs/archiwum/research-dokumentacja-przetargow.md`.

Gałąź robocza: `feature/docs-resolver-platforms` (z `origin/develop`, w chwili pisania bez zmian w kodzie).

Oznaczenia pewności: **Sprawdzone** (wywołane na żywej platformie lub policzone na danych), **Założenie** (niesprawdzone).

## 1. Cel

Automatyczne sprawdzanie dokumentów (`docsCheck`) ustala dziś listę plików tylko dla eZamówień, konkretnych postępowań na platformazakupowa.pl i Bazy Konkurencyjności. Reszta kończy jako „inna platforma" albo „profil zamawiającego". Cel: objąć kolejne platformy oraz przypadki, gdy zamawiający podał w ogłoszeniu tylko adres swojego profilu, a nie postępowania.

## 2. Stan obecny w kodzie

- `functions/analysis/resolver/index.ts`: `resolveDocuments(tender, http)`. Dla `E_ZAMOWIENIA` najpierw lista dokumentów na eZamówieniach, a przy pustej liście adres z pola 3.1 ogłoszenia (`extractProceedingUrl`) i adapter dopasowany do adresu. Dla `TED` adapter dopasowany do `documentsUrl`.
- Adaptery (`PlatformAdapter` w `types.ts`): `ezamowieniaAdapter`, `platformazakupowaAdapter`, `bazaAdapter`.
- `platformazakupowa.ts`: adres `/transakcja/<id>` daje listę plików; adres `/pn/<profil>` zwraca od razu `PROFILE_NOT_MATCHED`.
- `docsCheck/state.ts`: `PROFILE_NOT_MATCHED` to stan `profile`, a `UNSUPPORTED_PLATFORM` i `NO_SOURCE_URL` to `unsupported`. Oba są końcowe, więc sprawdzanie się na nich kończy.
- `httpClient.ts`: tryb `session` przechodzi przekierowania z ciasteczkami, ale tylko po hostach z `SESSION_ALLOWED_HOSTS` (dziś platformazakupowa.pl i `accounts.opennexus.com`).
- `TenderContext` (`types.ts`) ma tylko `source`, `link`, `documentsUrl`. Nie ma numeru sprawy, tytułu ani terminu.
- Testy offline na zapisanych odpowiedziach: `tests/resolver.test.mjs`, pliki w `tests/fixtures/resolver/`. Uruchamiane przez `npm run test:unit`.
- Frontend: nazwy platform w `PLATFORM_NAMES` (`src/utils/docsCheck.ts`), typ w `src/types/DocsCheck.ts`.
- Na `develop` nie ma jeszcze integracji z silnikiem analizy (jest tylko resolver i `docsCheck`), więc adresy plików z manifestu nie są dziś przez nic pobierane.

## 3. Pomiar: gdzie leży dokumentacja przetargów IT

**Metoda (Sprawdzone):** oficjalne API BZP `GET https://ezamowienia.gov.pl/mo-board/api/v1/notice` z parametrami `NoticeType=ContractNotice`, `PublicationDateFrom`, `PublicationDateTo`, `PageSize=500`, `CpvCode=<prefiks>` (dwucyfrowe prefiksy kodów z `functions/tenders/itCpvCodes.ts`), stronicowanie przez `SearchAfter=<objectId ostatniego rekordu>`. Po stronie skryptu filtr do ogłoszeń mających co najmniej jeden kod z listy IT. Adres dokumentacji z pola „3.1.) Adres strony internetowej prowadzonego postępowania" w `htmlBody`, numer sprawy z pola „4.1.2.) Numer referencyjny". Limit API to 30 zapytań na minutę z jednego adresu; skrypt czekał 2,3 s między zapytaniami. Skrypty pomiarowe były tymczasowe i nie są w repozytorium.

**Próba:** 668 ogłoszeń IT z 15 dni roboczych (2026-10-27 do 2026-11-16). Jedno ogłoszenie nie miało poprawnego adresu w polu 3.1. Pomiar dotyczy tylko eZamówień; rozkładu adresów `documentsUrl` z TED nie mierzono.

| Platforma | Ogłoszeń | Udział | Adres konkretnego postępowania | Adres ogólny (profil, strona główna) |
|---|---|---|---|---|
| eZamówienia | 264 | 39,5% | 264 | 0 |
| platformazakupowa.pl | 187 | 28,0% | 108 | 79 |
| ezamawiający (`*.ezamawiajacy.pl` 112, `zamowienia.um.warszawa.pl` 7) | 119 | 17,8% | 63 | 56 |
| logintrade (`*.logintrade.net`) | 21 | 3,1% | 7 | 14 |
| eB2B (`*.eb2b.com.pl`) | 18 | 2,7% | 7 | 11 |
| e-ProPublico | 7 | 1,0% | 1 | 6 |
| własne strony i BIP-y (ponad 30 domen, żadna powyżej 5 ogłoszeń) | 51 | 7,6% | – | – |

Obsługiwane dziś: eZamówienia i konkretne postępowania na platformazakupowa.pl, razem 372 z 668, czyli 55,7%.

Postacie adresów (liczby z próby):

- **platformazakupowa.pl:** `/transakcja/<id>` 108, `/pn/<profil>` 73, sama domena 5, `/pn/<profil>/login` 1.
- **ezamawiający:** `/pn/<klient>/demand/<id>/notice/public/details` 63 (w tym 5 na `zamowienia.um.warszawa.pl`), strona główna 50, `/servlet/HomeServlet` 4, `/app/<KLIENT>/dashboard` 1, `/react/my-procedure/1/<id>` 1.
- **logintrade:** `/rejestracja/ustawowe.html` 11, strona główna 3, `/zapytania_email,<id>,<hash>.html` 7.
- **eB2B:** strona główna 11, `/open-preview-auction.html/<id>[/<slug>]` 6, `/organizer-preview-auction.html/<id>/<slug>` 1.
- **e-ProPublico:** strona główna 5, `/Zamawiajacy/AktualneOgloszenia?ZamawiajacyId=<uuid>` 1, `/Ogloszenia/Details/<uuid>` 1.

## 4. Ustalenia o platformach

Każdą platformę sprawdzano na jednym lub dwóch postępowaniach, zapytaniami z komputera użytkownika (nie z Cloud Functions), z odstępem 1,5 s.

### 4.1. platformazakupowa.pl: dopasowanie profilu do postępowania

- **Lista postępowań jest w HTML (Sprawdzone).** `https://platformazakupowa.pl/pn/<profil>/proceedings` zwraca stronę z tabelą zakładki „Do terminu składania": kolumny ID, Nazwa, Prowadzący, Data Zakończenia, Tryb, Rodzaj postępowania, Akcje. Wiersz ma link `/transakcja/<id>`. Strona `/pn/<profil>` bez `/proceedings` tej tabeli nie zawiera.
- **Nazwa zaczyna się zwykle od numeru sprawy (Sprawdzone)**, np. `ZP 271.12.2026 Przewóz dzieci…`. Ten sam numer jest w polu 4.1.2 ogłoszenia BZP.
- **Pozostałe zakładki ładują się osobno (Sprawdzone):** `div#tab-ended` ma `data-loaded="false"` i ładuje treść skryptem. Endpointu nie badano.
- **Pobranie listy nie wymagało sesji (Sprawdzone)** przy zwykłym podążaniu za przekierowaniami.

**Pomiar dopasowania (Sprawdzone).** Dla 74 ogłoszeń z adresem profilu (57 różnych profili) pobrano listę i szukano postępowania regułą:

1. numer sprawy po normalizacji (małe litery, bez znaków diakrytycznych, tylko litery i cyfry, co najmniej 5 znaków) zawarty w znormalizowanej nazwie dokładnie jednego wiersza;
2. w razie kilku trafień po numerze: dokładnie jedno z nich ma też zgodny tytuł;
3. w razie braku trafień po numerze: dokładnie jeden wiersz, którego nazwa zawiera co najmniej 70% słów tytułu dłuższych niż 3 znaki.

| Wynik | Wszystkie 15 dni (74) | Ogłoszenia z 2026-11-09 i późniejsze (28) |
|---|---|---|
| dopasowane po numerze sprawy | 37 | 27 |
| dopasowane tylko po tytule | 3 | 1 |
| tytuł niejednoznaczny | 2 | 0 |
| brak na liście trwających | 23 | 0 |
| lista trwających pusta | 9 | 0 |

Starsze ogłoszenia wypadają z zakładki trwających po terminie składania ofert, stąd słabszy wynik dla całej próby. Sprawdzanie dokumentów rusza zaraz po publikacji, więc miarodajna jest prawa kolumna: 28 z 28.

**Niesprawdzone:** czy dopasowania wskazują właściwe postępowanie (nie oglądano ich ręcznie); profile z większą liczbą postępowań niż mieści pierwsza strona tabeli (jest element `proceedings-pagination`).

### 4.2. ezamawiający (Marketplanet)

- **Strona postępowania jest publiczna (Sprawdzone).** `https://<sub>.ezamawiajacy.pl/pn/<klient>/demand/<id>/notice/public/details` przekierowuje na `/pn/<klient>/demand/notice/public/<idOgłoszenia>/details` i zwraca HTML (ok. 200 KB) z numerem postępowania, terminami i sekcją „Dokumenty zamówienia".
- **Lista plików jest w HTML (Sprawdzone).** Każdy plik to `<tr class="fileDataRow" id="_<numer>">` z komórkami: nazwa, data publikacji (`RRRR-MM-DD GG:MM`), rozmiar. Zaraz po wierszu jest skrypt z `downloadPostUrl: '/repository/download/<token>'`.
- **Token pobrania jest związany z sesją (Sprawdzone).** Dwa wczytania strony w różnych sesjach dały różne tokeny przy tych samych identyfikatorach wierszy. Pobranie (GET i POST) w tej samej sesji zwróciło prawdziwy PDF z nagłówkiem `Content-Disposition`; w nowej sesji zwraca stronę „Podany plik nie został znaleziony".
- **Postępowanie zakończone przekierowuje na logowanie (Sprawdzone na jednym przykładzie):** `/app/login?savedUrl=…&errorMsg=jsp.statuses.expired`.
- **Lista postępowań zamawiającego (Sprawdzone na jednym zamawiającym).** Strona główna (`/servlet/HomeServlet`; sam `/` zwraca krótkie przekierowanie do niej) ma link `/pn/<klient>/demand/notice/publicpzp/current/list`. Ta lista zawiera wiersze `<tr class="dataRow" id="<idOgłoszenia>">`, w których pierwsza komórka to numer sprawy, a druga opis. Adres szczegółów składa się z identyfikatora wiersza: `/pn/<klient>/demand/notice/public/<idOgłoszenia>/details`.
- **Założenie:** `zamowienia.um.warszawa.pl` to ten sam silnik (zgadza się postać adresu, strony nie pobierano). Adresy `/react/…` i `/app/…/dashboard` nie były sprawdzane.

### 4.3. logintrade

- **Strona postępowania jest publiczna (Sprawdzone).** `https://<sub>.logintrade.net/zapytania_email,<id>,<hash>.html`, tytuł „Podgląd zapytania", w treści „Znak sprawy".
- **Pliki mają publiczne adresy (Sprawdzone).** Linki względne `DocumentService,getAttachmentUnlogged,<token>` (10 na badanej stronie, token ok. 180 znaków). Pobranie bez sesji zwróciło PDF.
- **Nazwy plików: do ustalenia.** Tekst odnośnika był pusty, więc nazwa leży w sąsiedniej komórce albo atrybucie.
- **Lista postępowań (Sprawdzone na jednym zamawiającym).** `https://<sub>.logintrade.net/rejestracja/ustawowe.html` (ok. 1 MB) wypisuje postępowania z numerem sprawy, tytułem i datami. Nie sprawdzono, jak z wiersza listy złożyć adres postępowania.

### 4.4. eB2B

- **Strona postępowania jest publiczna (Sprawdzone)**, tytuł zawiera numer sprawy, a w HTML jest osadzony JSON postępowania (m.in. `"attachments_public_access":true`, terminy, pozycje).
- **Listy załączników nie ma w osadzonym JSON-ie (Sprawdzone):** pole `"Attachments":[]` było puste, a skrypt `/js/app/controller/compiled/AuctionPreviewOpen.js` (aplikacja ExtJS) dociąga ją osobnym zapytaniem budowanym przez `App.url({module, controller, action})`. Dokładnego adresu nie ustalono.
- **Strona główna zamawiającego nie zawierała numeru sprawy ani tytułu (Sprawdzone)**, więc lista postępowań też idzie osobnym zapytaniem.

### 4.5. e-ProPublico

Niezbadane. Python na komputerze użytkownika nie zestawił połączenia TLS (systemowy `curl` Windows dostał odpowiedź 302). To samo zjawisko wystąpiło wcześniej z serwerem GUS, więc może to być lokalna lista urzędów certyfikacji.

### 4.6. Warunki korzystania z platform (etap 0, odczyt 2026-11-17)

- **platformazakupowa.pl: automatyczne pobieranie jest zabronione (Sprawdzone w surowym tekście regulaminu).** Regulamin (OWŚUW, `https://platformazakupowa.pl/strona/1-regulamin`, obowiązuje od 2026-05-08): § 3 ust. 7 „Zakazane jest jakiekolwiek zautomatyzowane pobieranie treści, w szczególności scraping, crawling, TDM lub masowe pobieranie Załączników", z wyjątkiem API lub innych form udostępnionych przez usługodawcę (np. pliki CSV) i obowiązujących przepisów; § 5 ust. 4 zakazuje „powtarzającego się i systematycznego pobierania treści (w tym Załączników)"; § 3 ust. 8–9 i § 7 ust. 8–9 dopuszczają limity, weryfikację anty-botową oraz blokadę konta lub adresów IP i roszczenia z tytułu praw do baz danych. `robots.txt`: `User-agent: *` ma `Crawl-delay: 900` i `Disallow: /file/get_new/*` (adresy plików). Nie znaleziono publicznego API do list postępowań ani plików (niesprawdzane wprost).
- **logintrade: regulamin nie ma zapisów o botach ani scrapingu (Sprawdzone, streszczenie narzędzia pobierającego, nie surowy tekst).** Regulamin z 2025-05-17 (`<sub>.logintrade.net/rejestracja/regulamin.html`): § 2 ust. 4 zakazuje działań „utrudniających działanie lub powodujących destabilizację" platformy i obchodzenia zabezpieczeń. `robots.txt` nie sprawdzono: połączenie z `*.logintrade.net` z komputera użytkownika kończy się błędem certyfikatu (self signed certificate in certificate chain), jak w 4.5.
- **ezamawiający: nic nie ustalono.** `zus.ezamawiajacy.pl/robots.txt` zwraca 404 (brak pliku), regulaminu nie znaleziono. Domena główna `ezamawiajacy.pl` nie odpowiada.
- To odczyt tekstu, nie opinia prawna.
- **Decyzja użytkownika (2026-11-17):** nie pobieramy plików z platform automatycznie; kontynuujemy tylko listowanie plików (adresy z manifestu nie są przez nic pobierane). Zapis § 3 ust. 7 obejmuje „jakiekolwiek zautomatyzowane pobieranie treści", więc listowanie też jest po stronie ryzyka; do rozmowy z operatorem (zgoda lub API) przed wdrożeniem na produkcję.

## 5. Decyzje i zasady dla tej pracy

- **Kolejność:** najpierw dopasowanie profilu na platformazakupowa.pl, potem ezamawiający, potem logintrade. eB2B, e-ProPublico i własne strony zamawiających zostają jako „inna platforma", dopóki pomiar po wdrożeniu nie pokaże, że warto.
- **Nie zgadywać.** Dopasowanie profilu do postępowania przyjmujemy tylko przy dokładnie jednym trafieniu. W każdym innym przypadku zostaje dotychczasowy wynik `PROFILE_NOT_MATCHED`.
- **Zachować obecne ograniczenia ruchu:** uczciwy `User-Agent` z `httpClient.ts`, kolejka z jednym zapytaniem na sekundę, najwyżej 6 sprawdzeń na przetarg. Dopasowanie profilu dodaje jedno zapytanie na sprawdzenie.
- **Testy tylko offline**, na odpowiedziach zapisanych z żywych platform do `tests/fixtures/resolver/`, tak jak dotąd. Zapisane strony mogą zawierać dane kontaktowe urzędników; przed dodaniem do repozytorium usuń z nich sekcje kontaktowe, jeśli nie są potrzebne do testu.
- **Nic na produkcję bez zgody użytkownika.** Commity i push tylko za zgodą (patrz `docs/handoff.md`).

## 6. Plan

### Etap 0: warunki korzystania z platform

Przed pisaniem adapterów przeczytać regulaminy i `robots.txt` platformazakupowa.pl (dla ścieżki `/pn/`), ezamawiajacy.pl i logintrade.net pod kątem automatycznego pobierania. Wynik dopisać do sekcji 4. Jeśli któraś platforma tego zabrania, przedstawić to użytkownikowi przed dalszą pracą nad nią.

Gotowe, gdy: w dokumencie jest krótki zapis, co mówi każdy regulamin, z datą odczytu.

### Etap 1: dopasowanie profilu na platformazakupowa.pl

Spodziewany zysk: ok. 11 punktów procentowych pokrycia.

**Stan (2026-11-17, niezacommitowany):** kroki 1–6 zrobione, `npm run test:unit` 118/118. Zmiany: `types.ts` (`TenderContext.title/referenceNumber`, `MatchHints`, trzeci parametr `resolve`), `common.ts` (`matchProceeding`), `ezamowienia.ts` (`extractReferenceNumber`), `platformazakupowa.ts` (`extractProceedings`, przebieg dla profilu; bez numeru sprawy i tytułu nie wysyła zapytania), `index.ts`. **Struktura wiersza potwierdzona na żywej stronie** `/pn/witu/proceedings?tab=active` (2026-11-17, 2 wiersze): `<td>` ID i `<td>` nazwa to zwykły tekst, link `/transakcja/<id>` jest tylko w ostatniej komórce („Przejdź”); numery spraw bywają z ukośnikami (`ZPR/4/26/WZ/ZOL/17/0002/01`). Fixture `pz-proceedings.html` ma ten znacznik, ale dane wierszy są wymyślone (prawdziwe zawierały nazwisko prowadzącego). Żywy układ `zus` jest inny (nie zawiera tabeli); `gmina_dydnia` miała pustą zakładkę. Dopasowań na żywej platformie jeszcze nie sprawdzano. **Poprawka z etapu 2:** w prawdziwych ogłoszeniach BZP etykieta pola ma dwukropek (`4.1.2.) Numer referencyjny: ZAM.271.1.44.2026`); pierwsza wersja `extractReferenceNumber` go nie obsługiwała i na 164 prawdziwych ogłoszeniach (okno 2026-11-09 do 11-16, CPV 72) znajdowała 0 numerów, po poprawce 161 (reszta nie ma pola).

1. **Dane do dopasowania.** Rozszerzyć `TenderContext` o opcjonalne `title`, `referenceNumber` i `deadlineDate`. Dla TED `referenceNumber` jest już w `TenderRecord`. Dla eZamówień numer sprawy trzeba wyciągnąć z HTML ogłoszenia (pole 4.1.2), który `resolveNotice` i tak pobiera przy pustej liście dokumentów; dodać `extractReferenceNumber(html)` obok `extractProceedingUrl` w `resolver/ezamowienia.ts`.
2. **Przekazanie danych do adaptera.** `PlatformAdapter.resolve(url, http)` nie dostaje dziś kontekstu przetargu. Dodać trzeci, opcjonalny parametr ze wskazówkami (`referenceNumber`, `title`) i przekazać go przez `resolveByUrl` w `index.ts`.
3. **Parser listy.** W `platformazakupowa.ts` funkcja czytająca tabelę z `/pn/<profil>/proceedings`: identyfikator z linku `/transakcja/<id>`, nazwa, data zakończenia. Tylko pierwsza tabela (trwające).
4. **Reguła dopasowania** z sekcji 4.1 jako osobna, czysta funkcja w `common.ts` (przyda się też dla ezamawiający i logintrade). Normalizacja musi obsłużyć polskie znaki, w tym „ł".
5. **Przebieg.** Dla adresu `/pn/<profil>` (także z końcówką `/proceedings` lub `/login`): pobrać listę, dopasować, a przy jednym trafieniu rozwiązać `/transakcja/<id>` istniejącą ścieżką. `sourceUrl` wyniku ma wskazywać postępowanie, żeby odnośnik na karcie prowadził do właściwej strony. Bez trafienia zwrócić `PROFILE_NOT_MATCHED` jak dotąd.
6. **Testy.** Zapisać żywą stronę `/proceedings` z kilkoma wierszami oraz pustą. Przypadki: trafienie po numerze, trafienie tylko po tytule, dwa wiersze z tym samym numerem, brak trafienia, pusta lista, brak numeru sprawy w kontekście. Zaktualizować dwa istniejące testy oczekujące `PROFILE_NOT_MATCHED` dla profilu (`tests/resolver.test.mjs`, okolice linii 98 i 178), tak żeby nadal sprawdzały przypadek bez dopasowania.

Do rozstrzygnięcia w trakcie:

- **Czy `profile` ma zostać stanem końcowym.** W pomiarze świeże ogłoszenia dopasowały się od razu, ale zamawiający może dodać postępowanie na platformie później niż ogłoszenie w BZP. Jeśli po wdrożeniu będą takie przypadki, rozważyć ponawianie jak dla stanu `none`.
- **Przetargi już oznaczone jako `profile`.** `enqueueDocsChecks` pomija przetargi mające `docsCheck`. Ustalić z użytkownikiem, czy potrzebne jest jednorazowe ponowne sprawdzenie, czy wystarczy, że nowe przetargi będą dopasowywane.

Gotowe, gdy: testy jednostkowe przechodzą, a pomiar przez `resolveDocumentsCallable` (funkcja admina, do 20 przetargów naraz) na projekcie testowym pokazuje dla świeżych przetargów z adresem profilu wynik `RESOLVED` lub `NO_DOCUMENTS_YET` zamiast `PROFILE_NOT_MATCHED`. Użytkownik ogląda kilka dopasowań ręcznie.

### Etap 2: adapter ezamawiający

Spodziewany zysk: ok. 9 punktów dla adresów konkretnych postępowań i do 8 dla adresów ogólnych.

**Stan (2026-11-17, niezacommitowany):** zaimplementowane w `functions/analysis/resolver/ezamawiajacy.ts`, `npm run test:unit` 132/132, test na żywych stronach produkcyjnym klientem (3 przypadki) zgodny z oczekiwaniem. Ustalenia z badania (sprawdzone na 6 różnych zamawiających, 2026-11-17):

- Układ strony postępowania i tabeli plików jest identyczny u wszystkich sześciu (`umwodzislawslaski`, `gminazorawina`, `rckikwarszawa`, `pansa`, `uml`, `zdizsopot`) i na `zamowienia.um.warszawa.pl` (ten sam silnik, potwierdzone). Strona postępowania działa bez ciasteczek, więc `SESSION_ALLOWED_HOSTS` **nie** wymagał zmiany: adapter sam przechodzi przekierowania w obrębie tego samego hosta (przekierowanie na inny host to `ResolverError`).
- W tabeli jest dodatkowy wiersz `_-2` („Ogłoszenie” lub „Dane kontaktowe”): podgląd ogłoszenia, nie plik; pomijany. Prawdziwe pliki mają `id="_<liczba>"`, nazwa to pierwsza komórka `td.text.long`, data to `td.date-time`.
- `/react/my-procedure/1/<n>` to pusta powłoka aplikacji (2 KB); `<n>` to ten sam identyfikator co `demand/<n>`, ale identyfikator zamawiającego w ścieżce (`/pn/<klient>/`) bierze się tylko ze strony głównej. `/app/dashboard` przekierowuje na `/servlet/HomeServlet`. Oba traktowane jak adres ogólny.
- Lista `publicpzp/current/list` ma stronicowanie (formularz `GD_pagestart`), licznik „Pozycje 1-N z M”. Przy niepełnej liście dopasowanie tylko po tytule jest wyłączone (numer sprawy nadal działa). Opisy w liście są zakodowane encjami numerycznymi, więc `htmlToText` dekoduje teraz wszystkie encje.
- **Decyzje:** `ResolvedFile.url` to adres strony postępowania z kotwicą `#_<id>` (token pobrania jest związany z sesją i nie nadaje się do zapisu), bez zmiany typu `ResolvedFile`; do rozstrzygnięcia przy integracji z silnikiem analizy. Przekierowanie na `/app/login` (postępowanie zakończone) daje `UNSUPPORTED_PLATFORM` z notą (stan końcowy `unsupported`, bez ponawiania); nota nie trafia do UI (`outcomeFromResult` jej nie przenosi).
- **Niesprawdzone:** lista `lowcost/current/list` (postępowania poza ustawą): jedyna sprawdzona była pusta, więc nie jest obsługiwana; listy zakończonych (`expired`) i w toku (`during`); zachowanie przy zakończonym postępowaniu odtworzone tylko z opisu (wszystkie badane były jeszcze otwarte); `zamowienia.um.warszawa.pl` sprawdzone tylko na stronie szczegółów; wersje silnika u zamawiających spoza sześciu.

1. **Rozpoznanie adresu.** Hosty `*.ezamawiajacy.pl` oraz `zamowienia.um.warszawa.pl` (po potwierdzeniu, że to ten sam silnik). Klient i identyfikator z postaci `/pn/<klient>/demand/<id>/notice/public/details`.
2. **Sesja.** `SESSION_ALLOWED_HOSTS` to dziś stała lista hostów; ezamawiający ma osobną subdomenę na zamawiającego, więc potrzebna jest reguła po sufiksie domeny. Zachować sens zabezpieczenia: przekierowanie poza platformę ma być błędem.
3. **Lista plików.** Wiersze `tr.fileDataRow`: `platformFileId` z atrybutu `id` (stały między sesjami), nazwa, data publikacji jako `RRRR-MM-DDTGG:MM:00`.
4. **Adres pliku.** Token pobrania działa tylko w sesji, w której wczytano stronę. Dla `docsCheck` to bez znaczenia (liczy się lista). Dla przyszłego pobierania plików potrzebna jest decyzja: oznaczyć w `ResolvedFile`, że plik wymaga sesji strony, zamiast zapisywać adres, który wygaśnie. Uzgodnić z użytkownikiem przed zmianą typu, bo dotyka to integracji z silnikiem analizy.
5. **Postępowanie zakończone.** Przekierowanie na `/app/login?…errorMsg=jsp.statuses.expired` nie jest awarią platformy. Zwrócić wynik końcowy z czytelną notatką, nie `ResolverError` (który powoduje ponawianie).
6. **Adres ogólny.** Ze strony głównej wziąć link do listy `…/demand/notice/publicpzp/current/list`, z listy wiersze `tr.dataRow` (identyfikator, numer sprawy, opis), dopasować regułą z etapu 1 i złożyć adres szczegółów. Sprawdzić też listę postępowań wyłączonych z ustawy (`…/lowcost/current/list`), jeśli numeru nie ma na pierwszej.
7. **Nazwa platformy.** Dodać `ezamawiajacy` do typu `Platform` i do `PLATFORM_NAMES` we frontendzie.
8. **Testy** na zapisanych stronach: postępowanie z plikami, bez plików, zakończone, lista zamawiającego.

Przed implementacją sprawdzić na co najmniej pięciu różnych zamawiających, czy układ strony jest ten sam, oraz co zwracają adresy `/react/my-procedure/…` i `/app/<KLIENT>/dashboard`.

Gotowe, gdy: jak w etapie 1, dla przetargów z adresem na ezamawiający.

### Etap 3: adapter logintrade

Spodziewany zysk: ok. 3 punkty.

1. Ustalić, skąd wziąć nazwy plików przy linkach `getAttachmentUnlogged` i czy data publikacji pliku jest na stronie.
2. Ustalić, jak z wiersza listy `/rejestracja/ustawowe.html` złożyć adres postępowania.
3. Adapter dla `*.logintrade.net`: strona postępowania daje listę plików ze stałymi adresami (bez sesji), a adres ogólny przechodzi przez listę i regułę dopasowania.
4. Dodać platformę do typu i nazw we frontendzie, testy na zapisanych stronach.

### Etap 4: pomiar po wdrożeniu i decyzja o reszcie

Po wdrożeniu etapów 1–3 na projekt testowy policzyć rozkład stanów `docsCheck` dla przetargów IT z dwóch tygodni i porównać z sekcją 3. Dopiero wtedy zdecydować o eB2B (wymaga rozpracowania zapytania o załączniki), e-ProPublico i przetargach z TED, dla których rozkładu platform jeszcze nie znamy.

## 7. Czego nie sprawdzono

- Regulaminów i `robots.txt` platform (etap 0).
- Działania tych zapytań z Cloud Functions: inny adres IP, inna lista urzędów certyfikacji.
- Limitów zapytań i ochrony przed botami ezamawiający i logintrade.
- Różnic między wersjami silnika u różnych zamawiających; każda platforma była oglądana na jednym lub dwóch postępowaniach.
- Poprawności dopasowań profilu (brak ręcznego przeglądu) i profili z wieloma stronami listy.
- Rozkładu platform dla przetargów z TED.

## 8. Uwagi techniczne z tej sesji

- `npm run test:functions` na `develop` kończy się wynikiem 47 z 49: dwa testy w `tests/labelSnapshot.integration.test.mjs` nie przechodzą także bez żadnych zmian (stan z 2026-11-17 na komputerze użytkownika, przyczyna nieznana).
- Po testach na emulatorach zostaje proces emulatora Firestore na porcie 8080 i blokuje kolejne uruchomienie. Przed zatrzymaniem sprawdź linię poleceń procesu (ma zawierać `cloud-firestore-emulator` i `demo-tenders`).
- W `functions/` trzeba uruchomić `npm ci`, jeśli brakuje `node_modules`.
- Polecenia powłoki Bash z polskimi znakami w treści potrafią się nie wykonać w tym środowisku; frazy z polskimi znakami lepiej trzymać w plikach skryptów.
