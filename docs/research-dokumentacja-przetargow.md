# Research: automatyczne pobieranie dokumentacji przetargowej i integracja z Tender Explorerem

Stan na 2026-11-04. **To jest research i propozycja architektury, nie implementacja: w kodzie obu projektów nie ma jeszcze nic z tego zakresu.** Plik zbiera wszystko, co ustalono, żeby agent dostający zadanie „zintegruj TED_Tenders z Tender Explorerem" nie musiał odkrywać tego od nowa. Czytaj go razem z `docs/handoff.md` (stan projektu i zasady pracy) i `docs/CLAUDE.md`. Po stronie Tender Explorera (osobny folder `tender explorer`) odpowiednikiem jest `docs/HANDOFF.md` i `docs/architecture.md`.

## 1. Cel i kontekst

- **TED_Tenders** (ten projekt) pokazuje wspólną listę przetargów IT z TED i eZamówień. **Tender Explorer** (osobny projekt, Python, FastAPI, SQLite, Gemini) ocenia dokumentację przetargu: werdykt WPISAĆ / SPRAWDŹ / ODPUŚCIĆ i lista zamawianych pozycji.
- Dziś narzeczona użytkownika wybiera przetarg w jednej aplikacji, pobiera dokumentację ręcznie i wrzuca ją do drugiej. Pomysł: przycisk „Analizuj" przy przetargu, który sam pobiera dokumentację i uruchamia ocenę.
- Przeszkoda: `Board/Search` (eZamówienia) nie zwraca adresu dokumentacji (`htmlBody` i `pdfUrl` są `null`), a wielu zamawiających prowadzi postępowania na innych platformach. TED podaje adresy w polu `document-url-lot` (patrz `handoff.md`, sekcja o `documentsUrl`), ale prowadzą na różne platformy.

## 2. Decyzje i ustalenia użytkownika (2026-11-04)

- **Najpierw dopracowanie mechanizmu oceny** (werdykty, lista pozycji) w Tender Explorerze. Integracja i dalszy rozwój dopiero potem. Ten plik ma być gotowy na ten moment.
- Całość traktowana jako **PoC**. Priorytet: zerowy lub bardzo niski koszt. Jeśli pracodawca zechce za to płacić, projekt można rozbudować.
- Użytkownik zakłada, że realnie analiz będzie więcej niż 20 dziennie.
- Ustalenie, które trzeba załatwić przed fazą płatną: czy pracodawca zezwala na zewnętrzne narzędzie, czyje jest narzędzie (budowane prywatnie) i czy ma wymagania co do przetwarzania danych (dokumentacja jest publiczna, ale firma może mieć własne zasady). **Nie ustalone.**

## 3. eZamówienia: co zweryfikowano

Wszystko poniżej sprawdzone 2026-11-04 **z przeglądarki** (wbudowana przeglądarka Claude, origin `ezamowienia.gov.pl`), przez obserwację zapytań, jakie wysyła sama platforma, i ręczne `fetch` z konsoli. Żadnego z tych adresów nie ma w oficjalnej dokumentacji. Są to endpointy front-endu platformy.

| Cel | Endpoint (GET, bez logowania) | Zwraca |
|---|---|---|
| Lista ogłoszeń (już używany) | `https://ezamowienia.gov.pl/mo-board/api/v1/Board/Search?...` | m.in. `objectId`, `tenderId` (`ocds-148610-...`), `noticeNumber`, `bzpNumber` |
| Metadane ogłoszenia | `.../mo-board/api/v1/Board/GetNoticeDetailsById?noticeId=<objectId>` | `id`, `tenderId`, `tenderState`, `moIdentifier`, `noticeNumber` (krótka odpowiedź, bez adresów) |
| **Pełna treść ogłoszenia BZP (HTML)** | `.../mo-board/api/v1/Board/GetNoticeHtmlBodyById?noticeId=<objectId>` | HTML całego ogłoszenia (ok. 20 tys. znaków), z sekcją III |
| Ten sam HTML w JSON | `.../mo-board/api/v1/Board/GetLastVersionFormPreview?formId=<moIdentifier>` | `{hasAnyUpdates, html}` |
| **Lista dokumentów postępowania** | `https://ezamowienia.gov.pl/mp-readmodels/api/Search/GetTenderDocuments?tenderId=<tenderId>` | tablica: `objectId`, `name`, `fileName`, `url`, `tenderDocumentState` (np. `Published`), `createDate`, `publishedDate`, `deleteDate`, `deleteReason` |
| **Pobranie pliku** | `https://ezamowienia.gov.pl/mp-readmodels/api/Tender/DownloadDocument/<tenderId>/<objectId>` | sam plik, `Content-Disposition` z nazwą |
| Dane postępowania | `.../mp-readmodels/api/Search/GetTender?id=<tenderId>` | nie badano szczegółowo |
| Ogłoszenia powiązane | `.../mp-readmodels/api/Search/GetTenderLinkedNotices?tenderId=<tenderId>` | nie badano (potencjalnie sprostowania i zmiany) |

Co potwierdzono:
- `DownloadDocument` pobiera plik **bez ciasteczek i logowania** (`credentials: 'omit'`): prawdziwy PDF, `application/pdf`, nazwa pliku w nagłówku. Ogłoszenia mówią o tym wprost: „Przeglądanie i pobieranie treści dokumentacji postępowania nie wymaga posiadania konta".
- Sekcja **3.1 „Adres strony internetowej prowadzonego postępowania"** w HTML ogłoszenia podaje, gdzie leży dokumentacja. Wyciągana wyrażeniem w rodzaju `3\.1\.\)\s*Adres strony internetowej prowadzonego post[ęe]powania\s*(\S+)` na tekście bez znaczników.
- Pole **4.1.2 „Numer referencyjny"** (np. `ZP1-33/26`) jest w tym samym HTML. Przyda się do dopasowania postępowania na profilu zamawiającego (sekcja 4).
- Dla ogłoszenia z dnia badania lista dokumentów była pusta (`[]`): zamawiający mógł jeszcze nie dołączyć plików. **Dokumentacja bywa dodawana po ogłoszeniu**, więc trzeba umieć sprawdzić ponownie.

Pułapka (już w `handoff.md`): `ezamowienia.gov.pl/mp-client/...` to SPA i zwraca HTTP 200 dla dowolnego adresu. Sam kod HTTP niczego nie dowodzi. Do testowania użyj endpointów `mp-readmodels`, które zwracają dane (lub `[]`).

## 4. platformazakupowa.pl: co zweryfikowano

Sprawdzone 2026-11-04 w przeglądarce na trzech postępowaniach i trzech profilach zamawiających.

- Strona `https://platformazakupowa.pl/transakcja/<id>` jest **publiczna** (bez konta) i zawiera tabelę „Załączniki do postępowania" (ogłoszenie, SWZ w DOCX i PDF). W HTML są linki `a[href*="/file/get_new/"]` (dla trzech sprawdzonych: 3, 3 i 6 plików).
- Pliki mają bezpośrednie adresy `https://platformazakupowa.pl/file/get_new/<hash>.<rozszerzenie>`. Pobranie bez ciasteczek zwróciło prawdziwy PDF (1,2 MB), `Content-Disposition` z nazwą (uwaga na kodowanie polskich znaków w nazwie: wyszło jako mojibake, nazwę lepiej brać z tabeli na stronie).
- W treści strony bywają dodatkowe linki (np. instrukcje na Google Drive). Nie są dokumentacją przetargu.
- Strona ma baner cookies. Nie sprawdzano limitów zapytań ani ochrony przed botami przy wielu zapytaniach.
- **Link z pola 3.1 bywa linkiem do profilu zamawiającego, nie do postępowania**, np. `https://platformazakupowa.pl/pn/gmina_dydnia`, `.../pn/zkgk`. Sprawdzone trzy profile: jeden (`/pn/ostroleka/proceedings`) zawierał w HTML 17 linków `/transakcja/<id>`, dwa pozostałe (`/pn/gmina_dydnia`, `/pn/zkgk`) nie zawierały żadnego (może ładowanie przez JS, może inny podadres: **nie zbadano**).

## 5. Rozkład platform w próbce

Próbka: 60 ogłoszeń (`ContractNotice`, `isTenderAmountBelowEU=true`, typy `Delivery` i `Services`, daty publikacji 2026-10-26..28, po 3 strony po 10 dla każdego typu, sortowane malejąco, czyli głównie 28.10). **Wszystkie branże, nie tylko IT.** Mała próbka, procenty orientacyjne.

| Gdzie jest dokumentacja (wg pola 3.1 i listy dokumentów) | Liczba z 60 |
|---|---|
| eZamówienia, lista dokumentów niepusta | 32 |
| platformazakupowa.pl (w tym `ww.platformazakupowa.pl`) | 18 |
| inne platformy: `*.eb2b.com.pl` (4), `*.ezamawiajacy.pl` (3), `e-propublico.pl` (1) | 8 |
| brak pola 3.1 | 1 |
| adres eZamówień w 3.1, ale lista dokumentów pusta | 1 |

Wniosek: eZamówienia ok. połowy, platformazakupowa.pl ok. 30%, długi ogon reszta. Dla przetargów IT rozkład może być inny (duże instytucje częściej mają własne platformy). **Do zmierzenia na próbce z kodami CPV z IT, zanim zapadną decyzje.**

## 6. Czego NIE sprawdzono

- Czy te same adresy (`mp-readmodels`, `file/get_new`) odpowiadają **z Cloud Functions / Cloud Run** (z przeglądarki tak). `Board/Search` odpowiada z Functions, co jest dobrym znakiem, ale nie dowodem. Powłoka agenta (chmura i `device_bash`) nie ma dostępu do `ezamowienia.gov.pl` (połączenie odrzucane), więc testy trzeba robić z przeglądarki albo z samych Functions.
- Limity zapytań i ochrona przed botami obu platform, regulaminy (automatyczne pobieranie). Nie czytano.
- Platformy z długiego ogona: `eb2b.com.pl`, `ezamawiajacy.pl`, `e-propublico.pl`, `logintrade` i inne. Część może wymagać logowania lub akceptacji regulaminu.
- Profile zamawiających na platformazakupowa.pl poza trzema próbkami.
- Duże dokumentacje (setki MB, wielokrotnie zagnieżdżone ZIP-y) i zachowanie pobierania przy nich.
- Co się dzieje przy sprostowaniach i zmianach SWZ (`GetTenderLinkedNotices`, `deleteDate`/`deleteReason` w liście dokumentów) i czy wynik analizy trzeba wtedy unieważnić.

## 7. Koszty

**Gemini jest największym kosztem, hosting praktycznie zerowy.**

Dane z 42 zapisanych wyników Tender Explorera (`output/*.json`, pole `usage`): tokeny wejścia mediana ok. 41 tys., średnia ok. 57 tys., p90 ok. 90 tys., maks. 332 tys.; wyjście średnio ok. 1,7 tys. Czas wywołania modelu: mediana 6 s, p90 43 s, maks. 115 s. Domyślny model w kodzie: `gemini-3.5-flash-lite` (`llm.py`). Według tabeli cen w `usage.py` (0,30 / 2,50 USD za mln tokenów; **ceny z repo, nie zweryfikowane na stronie Google**) wychodzi **ok. 2 centów za analizę**; dla `gemini-2.5-flash-lite` (0,10 / 0,40) ok. 0,6 centa.

| Analiz dziennie | Miesięcznie (przy ok. 2 centach) |
|---|---|
| 5 | ok. 3 USD |
| 20 | ok. 13 USD |
| 50 | ok. 32 USD |
| 100 | ok. 64 USD |

Sposoby obniżenia kosztu: tańszy model (po sprawdzeniu na zbiorze regresyjnym, czy werdykty się nie pogorszą), wstępny filtr tańszymi regułami przed modelem (tytuł, CPV, siatka słów kluczowych z `coverage.py`), Batch API (wg źródeł ok. 50% zniżki, kosztem opóźnienia; **niezweryfikowane**). Darmowy tier Gemini istnieje, ale ma niskie limity, a treści są wtedy używane do ulepszania produktów Google.

Hosting (wg stron cenników, 2026-11-04): Cloud Run, rozliczanie za żądania, darmowo miesięcznie 2 mln żądań, 180 tys. vCPU-sekund i 360 tys. GiB-sekund (limity dla regionów Tier 1, w Tier 2 niższe: ok. 128,5 tys. vCPU-s i 257 tys. GiB-s). Szacunek (nie mierzony): analiza to 1-2 minuty jednego vCPU (pobranie, ekstrakcja, OCR, oczekiwanie na model), czyli darmowy limit starcza na rzędu 1500 analiz miesięcznie. **Należy sprawdzić, do którego Tier należy wybrany region** (np. `europe-west1` vs Warszawa `europe-central2`, w której jest Firestore). Przechowywanie obrazu w Artifact Registry: pierwsze 500 MB darmowe, obraz z Tesseractem to rząd 1 GB, czyli grosze.

## 8. Proponowana architektura (zasada: analiza na żądanie, bez przechowywania plików)

```
[Przycisk "Analizuj" w TED_Tenders]
        |  callable (sprawdza rolę, limit dzienny)
        v
Firestore: analyses/{tenderId}  status=queued --> Functions (trigger)
                                                       | wywołanie z IAM
                                                       v
                                   Cloud Run (Python, kod Tender Explorera)
                                   1. resolver: skąd wziąć dokumenty
                                   2. fetcher per platforma -> pamięć tymczasowa
                                   3. archive -> extract/OCR -> Gemini -> rules
                                   4. wynik (werdykt, pozycje, cytaty) -> Firestore
        ^                                              |
        +-------- podgląd na żywo (listener Firestore) <-+
```

Zasady:
- **Analiza na żądanie**, nie dla wszystkich przetargów. Wynik wspólny dla wszystkich użytkowników (jeden dokument na przetarg), więc koszt płacony raz. Później opcjonalnie automatycznie dla przetargów z gwiazdką lub „do wyjaśnienia".
- **Nie przechowujemy plików**: pobranie do pamięci tymczasowej, analiza, zapis samego wyniku. Zero kosztów Cloud Storage, brak pytań o kopie dokumentów. Dysk instancji Cloud Run liczy się do jej pamięci, więc ustawić ok. 2 GiB i limit rozmiaru pobieranej paczki (np. kilkadziesiąt MB, powyżej: status „za duże, wgraj ręcznie").
- **Kontener, nie Cloud Functions**: Tender Explorer to Python z Tesseractem (OCR po polsku) i `antiword`, a Functions projektu są w Node. Cloud Run z `min-instances=0`, `max-instances=2-3`, niską współbieżnością i długim timeoutem.
- **Resolver dokumentacji** (kolejność prób, od najpewniejszej):
  1. eZamówienia: `tenderId` -> `GetTenderDocuments` -> `DownloadDocument`.
  2. Link `/transakcja/<id>` z pola 3.1: adapter platformazakupowa.pl.
  3. Link do profilu zamawiającego (`/pn/...`): próba dopasowania postępowania po **numerze referencyjnym (4.1.2)** i tytule z listy postępowań. Przy braku jednoznacznego dopasowania **nie zgadywać**.
  4. Reszta: status „dokumentacja poza obsługiwanymi platformami", przycisk z linkiem z 3.1 i **ręczne wgranie plików** do tego samego pipeline'u (upload w Tender Explorerze już istnieje).
- Każda platforma to **osobny adapter z testem**, który zwraca listę `{nazwa, rozszerzenie, bajty}` albo jawny powód niepowodzenia. Zmiana układu strony psuje jeden adapter, nie całość. Test na żywo (zapisany przykład zamawiającego) powinien wykrywać zmiany formatu.
- Pole 3.1 wymaga dodatkowego zapytania `GetNoticeHtmlBodyById` na ogłoszenie. Nie robić tego dla wszystkich ok. 850 ogłoszeń dziennie podczas odświeżania, tylko leniwie po kliknięciu.

## 9. Fazy

1. **PoC, koszt bliski zera.** Tender Explorer lokalnie (jak w jego planie: Tailscale), prototyp fetcherów (eZamówienia, platformazakupowa.pl) na wybranych przetargach IT, Gemini na darmowym tierze lub płatnym kluczu z limitem kilku dolarów, analiza ręcznie. Do tego pilotaż w trybie cienia z planu Tender Explorera (kryterium 6 w jego `HANDOFF.md`). Wynik: liczby.
2. **Chmura w granicach darmowych limitów.** Cloud Run + Firestore, twardy limit dzienny analiz.
3. **Rozbudowa za pieniądze pracodawcy.** Własne konto rozliczeniowe firmy, automatyczna analiza wszystkich przefiltrowanych przetargów, wyższe limity, Baza Konkurencyjności (`docs/research-baza-konkurencyjnosci.md`), eksport do raportu.

Argument dla pracodawcy to trzy liczby z pilotażu: ile minut czytania oszczędza jedna analiza, jak często system się myli (zwłaszcza pomija przetarg, który powinien trafić do raportu), koszt jednej analizy.

## 10. Zabezpieczenia kosztów i etykiety

- Limit analiz na użytkownika dziennie (callable), `max-instances` i timeout na Cloud Run.
- Limit wydatków na kluczu Gemini oraz alert budżetowy Google Cloud (w planie na produkcję w `plan.md`).
- Pobieranie na żądanie, jeden przetarg naraz, z uczciwym `User-Agent`; bez masowego crawlowania platform.

## 11. Zmiany potrzebne w projektach (zarys)

**TED_Tenders** (`functions/tenders/`, `src/`):
- `documentsUrl` dla eZamówień jest dziś `null` (TED wypełnia je z `document-url-lot`). Rozważyć wypełnianie linkiem do postępowania `https://ezamowienia.gov.pl/mp-client/search/list/<tenderId>` (potrzebny `tenderId` w modelu, `EzamowieniaNotice` go dziś nie czyta) oraz, leniwie, adresem z 3.1.
- Nowe: callable „Analizuj", kolekcja `analyses/{tenderId}` + reguły (odczyt dla członków, zapis tylko przez Functions), widok wyniku w interfejsie.
- Reguły i testy reguł Firestore (`tests/firestore.rules.test.mjs`) wymagają rozszerzenia o nową kolekcję.

**Tender Explorer** (osobny projekt):
- Wydzielić bibliotekę (`pipeline`, `analyze`, `rules`, `coverage`) od warstwy WWW (`web.py`, `store.py` z SQLite). W chmurze SQLite jest nietrwałe; wynik zapisywany do Firestore (cache modelu z `.cache/llm` przenieść do Firestore albo polegać na jednej analizie na przetarg + `prompt_version`).
- Dockerfile: Python w wersji używanej przez projekt (`HANDOFF.md` mówi o Pythonie 3.15 w `.venv`, upewnić się, że obraz bazowy jest dostępny), Tesseract z językiem polskim, `antiword` (patrz pułapka 9 w jego `HANDOFF.md`), zależności z `requirements`.
- Adaptery pobierania jako osobny moduł z testami (z zapisanymi odpowiedziami do testów offline).

## 12. Jak odtworzyć testy (przeglądarka, origin `ezamowienia.gov.pl`)

Otworzyć dowolną stronę `https://ezamowienia.gov.pl/mo-client-board/bzp/list` i wykonać w konsoli (powłoka agenta nie dosięgnie tych adresów):

```js
const B = 'https://ezamowienia.gov.pl/';
const rows = await (await fetch(B + 'mo-board/api/v1/Board/Search?noticeType=ContractNotice&isTenderAmountBelowEU=true&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10')).json();
const n = rows[0];
const docs = await (await fetch(B + 'mp-readmodels/api/Search/GetTenderDocuments?tenderId=' + n.tenderId)).json();
const html = await (await fetch(B + 'mo-board/api/v1/Board/GetNoticeHtmlBodyById?noticeId=' + n.objectId)).text();
// plik: B + 'mp-readmodels/api/Tender/DownloadDocument/' + n.tenderId + '/' + docs[0].objectId
```

Na platformazakupowa.pl (origin `platformazakupowa.pl`): `fetch('/transakcja/<id>')`, parsowanie `DOMParser`, linki `a[href*="/file/get_new/"]`.

## 13. Otwarte pytania

1. Czy automatyczne pobieranie jest zgodne z regulaminami eZamówień i platformazakupowa.pl (nie sprawdzano)? Decyzja użytkownika przed wdrożeniem.
2. Jaki jest rzeczywisty rozkład platform dla przetargów IT (pomiar na próbce z CPV z IT)?
3. Czy endpointy działają z Cloud Functions / Cloud Run i jak zachowują się pod większym obciążeniem?
4. Jak dopasować postępowanie na profilu zamawiającego, gdy HTML profilu nie zawiera listy (prawdopodobnie ładowanie przez JS)? Czy jest tam ukryte API?
5. Które platformy z długiego ogona warto obsłużyć, a które zostawić na ręczne wgranie?
6. Co z dokumentacją, która pojawia się po ogłoszeniu lub jest zmieniana (sprostowania)? Kiedy ponawiać pobieranie i unieważniać wynik?
7. Pracodawca: zgoda na narzędzie, własność, wymagania co do danych, ewentualne finansowanie (sekcja 2).
8. Region Cloud Run (Tier a darmowy limit) i model Gemini (jakość a koszt, do rozstrzygnięcia na zbiorze regresyjnym Tender Explorera).

## 14. Źródła (cenniki, sprawdzone 2026-11-04)

- Cloud Run pricing: https://cloud.google.com/run/pricing
- Firebase pricing (Blaze, Cloud Storage, Functions): https://firebase.google.com/pricing
- Gemini API pricing (zestawienia zewnętrzne, do weryfikacji na ai.google.dev): https://www.morphllm.com/gemini-api-pricing, https://geotoolbox.ai/blog/gemini-api-pricing
- Opis ograniczeń `Board/Search` (HTML zawsze `null`): https://apify.com/mrarcode/bzp-scraper
