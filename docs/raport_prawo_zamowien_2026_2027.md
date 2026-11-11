# Prawo Zamówień Publicznych w Polsce (Branża IT) – Kompendium i Analiza Rynku (Stan na koniec 2026 r.)

Dokument stanowi skondensowane kompendium wiedzy o rynku zamówień publicznych (B2G) w Polsce, przygotowane pod kątem budowy projektów i narzędzi dedykowanych sektorowi IT. Uwzględnia stan prawny po kluczowych nowelizacjach z 2026 roku oraz kierunki zmian zaplanowanych na 2027 rok.

---

## 1. Architektura Systemu i Progi Kwotowe (Kluczowy Filtr Decyzyjny)

Podstawowym aktem prawnym regulującym rynek jest **Ustawa z dnia 11 września 2019 r. – Prawo zamówień publicznych (PZP)**. To, jak bardzo sformalizowany jest zakup systemu, licencji czy usług programistycznych, zależy od **szacunkowej wartości zamówienia (zawsze liczonej w kwotach netto)**.

Od **1 stycznia 2026 r.** obowiązują zaktualizowane progi kwotowe (w tym podwyższony po latach próg stosowania ustawy oraz nowy kurs przeliczeniowy euro wynoszący $4,31\text{ PLN}$):

| Kategoria zamówienia | Wartość zamówienia (netto) | Reżim prawny i miejsce publikacji | Poziom formalizmu |
| :--- | :--- | :--- | :--- |
| **Zamówienia podprogowe (tzw. bagatelne)** | Poniżej $170\,000\text{ PLN}$ *(do końca 2025 r. było to $130\,000\text{ PLN}$)* | Poza ustawą PZP. Obowiązuje wewnętrzny regulamin urzędu. Publikacja w BIP lub na platformie zakupowej urzędu (Zapytanie ofertowe). | **Niski.** Brak odwołań do KIO, brak wadium (zazwyczaj), często wystarcza skan oferty lub podpis zaufany. |
| **Zamówienia z dotacji UE (Zasada konkurencyjności)** | Od $80\,000\text{ PLN}$ (dla beneficjentów prywatnych oraz publicznych do $170\,000\text{ PLN}$) | Wytyczne kwalifikowalności wydatków (FE 2021–2027). Obowiązkowa publikacja w **Bazie Konkurencyjności (BK2021)**. | **Średni.** Sztywne wymogi dot. braku powiązań kapitałowych, min. 7 dni na ofertę (dostawy/usługi), ryzyko korekt finansowych. |
| **Zamówienia krajowe (poniżej progów UE)** | Od $170\,000\text{ PLN}$ do: <br>• $603\,400\text{ PLN}$ ($140\,000\text{ EUR}$) – adm. centralna<br>• $930\,960\text{ PLN}$ ($216\,000\text{ EUR}$) – samorządy, szpitale, uczelnie<br>• $1\,861\,920\text{ PLN}$ ($432\,000\text{ EUR}$) – sektorowe | Ustawa PZP (procedura krajowa, głównie **Tryb podstawowy**). Publikacja w **Biuletynie Zamówień Publicznych (BZP)** na portalu e-Zamówienia. | **Wysoki.** Obowiązkowy podpis elektroniczny (kwalifikowany, zaufany lub osobisty), proste oświadczenie wstępne zamiast JEDZ, prawo do odwołania do KIO. |
| **Zamówienia unijne (powyżej progów UE)** | Powyżej ww. kwot ($603,4\text{ tys. PLN}$ / $930,9\text{ tys. PLN}$ / $1,86\text{ mln PLN}$ dla dostaw i usług; dla robót budowlanych próg to $5\,404\,000\text{ EUR}$, czyli $23,29\text{ mln PLN}$) | Ustawa PZP (procedura unijna, głównie **Przetarg nieograniczony**). Publikacja w **TED (Dziennik Urzędowy UE)** w formacie eForms. | **Bardzo wysoki.** Wyłącznie kwalifikowany podpis elektroniczny, formularz JEDZ, wysokie wadia, pełna weryfikacja podmiotowa, długie terminy związania ofertą (np. 90 dni). |

> **Ważna zasada (Art. 29 PZP – Zakaz dzielenia zamówienia):** Zamawiający nie może sztucznie dzielić zakupu IT (np. rozbić zakupu 50 laptopów lub wdrożenia jednego systemu na trzy faktury po $100\,000\text{ PLN}$), aby uciec poniżej progu $170\,000\text{ PLN}$. Wartość usług powtarzających się lub subskrypcji zlicza się w skali roku budżetowego lub całego okresu trwania umowy (przy umowach na czas nieoznaczony przyjmuje się wartość za 48 miesięcy).

---

## 2. Słownik Pojęć: Język Biznesu IT vs. Język PZP

W sektorze prywatnym IT standardem są akronimy anglosaskie (RFI, RFP, RFQ). W polskich zamówieniach publicznych mają one swoje ścisłe odpowiedniki ustawowe lub praktyczne:

### 1. RFI (Request for Information) $\rightarrow$ Szacowanie wartości zamówienia & Wstępne Konsultacje Rynkowe (WKR)
Zanim urząd ogłosi przetarg, musi wiedzieć dwie rzeczy: **jak opisać przedmiot zamówienia** i **ile to mniej więcej kosztuje** (by określić, czy wpada w próg krajowy, czy unijny).
* **Szacowanie wartości zamówienia (Zapytanie o wycenę / RFI szacunkowe):** Publikowane na stronach BIP, platformach zakupowych lub rozsyłane mailem do firm IT. Urząd wrzuca zarys wymagań (np. „chcemy wdrożyć system AI do korelacji zdarzeń”) i prosi o podanie orientacyjnej ceny netto. *Uwaga:* To nie jest przetarg i nie kończy się zawarciem umowy! Wykonawcy często zawyżają tu wyceny o $20\text{--}30\text{ proc.}$, aby urząd zabezpieczył większy budżet w późniejszym przetargu.
* **Wstępne Konsultacje Rynkowe (WKR – art. 84 PZP, dawniej Dialog Techniczny):** Oficjalna procedura przedprzetargowa. Zamawiający zaprasza kilka firm IT do rozmów, aby doradziły mu, jaką architekturę wybrać, jak skonstruować SLA czy model licencjonowania. Udział w WKR jest bezpieczny (nie wyklucza firmy z późniejszego przetargu, o ile nie zakłóca to konkurencji), a pozwala realnie wpłynąć na kształt przyszłego OPZ.

### 2. RFP (Request for Proposal) $\rightarrow$ SWZ + OPZ (Przetarg nieograniczony / Tryb podstawowy / Dialog konkurencyjny)
Gdy urząd wie już, czego chce i ma budżet, publikuje ogłoszenie o zamówieniu wraz z kompletem dokumentów:
* **SWZ (Specyfikacja Warunków Zamówienia):** Dokument „matka” – odpowiednik biznesowego RFP. Zawiera instrukcję dla wykonawców, warunki udziału (jakie doświadczenie, zespół i obroty trzeba mieć), kryteria oceny ofert oraz wymagane zaświadczenia.
* **OPZ (Opis Przedmiotu Zamówienia):** Załącznik techniczny do SWZ. W branży IT zawiera wymagania funkcjonalne, niefunkcjonalne, architekturę, wymagania dot. integracji i migracji danych.
* **PPU (Projektowane Postanowienia Umowy / Wzór umowy):** W zamówieniach publicznych umowy co do zasady nie negocjuje się po wyborze oferty – wykonawca akceptuje wzór narzucony przez urząd (ewentualna walka o zmianę zapisów umowy odbywa się w trakcie przetargu poprzez zadawanie pytań do SWZ).
* **Tryby przypominające klasyczne, negocjacyjne RFP:**
  * *Tryb podstawowy (Wariant 2 i 3 – poniżej progów UE):* pozwala urzędowi negocjować złożone oferty w celu ich ulepszenia.
  * *Dialog konkurencyjny / Partnerstwo innowacyjne / Negocjacje z ogłoszeniem:* stosowane przy najbardziej skomplikowanych systemach centralnych, gdy urząd nie jest w stanie sam napisać OPZ bez wieloetapowych rozmów z wykonawcami.

### 3. RFQ / RDQ (Request for Quotation) $\rightarrow$ Zapytanie ofertowe (podprogowe) lub Przetarg COTS
Procedura nastawiona niemal wyłącznie na wycenę precyzyjnie zdefiniowanego koszyka:
* **Poniżej $170\,000\text{ PLN}$ netto:** Klasyczne **Zapytanie ofertowe** (często nazywane też Rozeznaniem rynku).
* **Powyżej $170\,000\text{ PLN}$ netto:** Przetarg na dostawę gotowego sprzętu (serwery, laptopy, macierze) lub odnowienie subskrypcji oprogramowania (COTS – *Commercial Off-The-Shelf*), gdzie produkt jest w pełni wystandaryzowany, a kryterium oceny to w $100\text{ proc.}$ cena (lub cena + czas dostawy/okres gwarancji).

### 4. Umowa Ramowa (Framework Agreement – art. 311 PZP)
Niezwykle popularna w dużych instytucjach IT (np. COI, CeZ, ZUS, MF, PKO BP). Zamawiający organizuje duży przetarg, w którym nie wybiera jednego zwycięzcy, lecz np. **od 3 do 7 software house'ów**, z którymi podpisuje umowę ramową na 2–4 lata (określającą np. maksymalne stawki godzinowe specjalistów i ogólne zasady współpracy). Gdy pojawia się konkretny projekt, urząd wysyła szybkie zaproszenie do składania ofert wykonawczych (*mini-RFP / mini-RFQ*) wyłącznie do tych wybranych firm.

---

## 3. Ekosystem Platform i Źródeł Danych (Gdzie to wszystko żyje?)

Budując jakiekolwiek narzędzie analityczne lub produkt dla rynku zamówień publicznych w Polsce, trzeba rozumieć **dwupoziomową architekturę publikacji**:

1. **Warstwa Ogłoszeniowa (Centralna – tu szuka się informacji o starcie przetargu):**
   * **TED (Tenders Electronic Daily – `ted.europa.eu`):** Wszystkie polskie przetargi powyżej progów unijnych (kod kraju: PL). Dane ustrukturyzowane w standardzie **eForms** (XML/JSON).
   * **Platforma e-Zamówienia (`ezamowienia.gov.pl`):** Rządowy portal prowadzony przez UZP. Zawiera **Biuletyn Zamówień Publicznych (BZP)** dla wszystkich zamówień krajowych od $170\,000\text{ PLN}$ do progów UE, a także obowiązkowe **Plany Postępowań** (publikowane przez każdy urząd na początku roku – doskonałe źródło wiedzy o tym, co urząd zamierza kupić za kilka miesięcy!). Posiada publiczne API (standard OCDS).
   * **Baza Konkurencyjności (`bazakonkurencyjnosci.funduszeeuropejskie.gov.pl`):** Centralny rejestr zapytań ofertowych finansowanych z funduszy UE (od $80\,000\text{ PLN}$ netto).
   * **Centralny Rejestr Umów JSFP (CRU – od 1 lipca 2026 r.):** Publiczny rejestr wszystkich zawartych umów (szczegóły w sekcji 4).

2. **Warstwa Transakcyjna (Rozproszona – tu leży dokumentacja SWZ/OPZ i tu składa się oferty):**
   Mimo że ogłoszenie trafia do TED lub na e-Zamówienia, sam proces zadawania pytań, pobierania paczek ZIP z dokumentacją techniczną i składania zaszyfrowanych ofert odbywa się na **platformie zakupowej wybranej przez dany urząd**. Rynek w Polsce dzielą między siebie:
   * bezpłatny moduł transakcyjny na rządowym portalu **e-Zamówienia**,
   * **platformazakupowa.pl** (Open Nexus) – ogromny udział w samorządach i szpitalach,
   * **Marketplanet (eB2B / OnePlace / eZamawiający)** – popularny u największych zamawiających (np. ZUS ma własną instancję `zus.ezamawiajacy.pl`, spółki Skarbu Państwa, duże miasta),
   * **Logintrade**, **SmartPZP**, **Josephin**, **SIDAS**.

---

## 4. Zmiany w Prawie (2026–2027) – Co się zmieniło i co nadchodzi?

Lata 2026–2027 to okres największych reform PZP od czasu wejścia w życie nowej ustawy w 2021 roku.

### Zmiany wdrożone w 2026 roku (Obowiązujące):

1. **Podwyższenie progu stosowania PZP do $170\,000\text{ PLN}$ netto (od 1 stycznia 2026 r.):**
   * *Skutek dla IT:* Około 9 tysięcy zamówień rocznie (o wartości ponad $1\text{ mld PLN}$) wypadło z pełnego rygoru ustawy PZP do szarej strefy „zapytań ofertowych”. Mniejsze wdrożenia stron WWW, zakupy licencji SaaS, audyty bezpieczeństwa (KSC/RODO) i dostawy sprzętu o wartości $130\text{--}170\text{ tys. PLN}$ nie trafiają już obowiązkowo do BZP na e-Zamówienia, lecz na lokalne strony BIP i platformy zakupowe urzędów.
2. **Zdalne rozprawy przed KIO i reforma dowodowa (od 13 marca 2026 r.):**
   * *Skutek dla IT:* Krajowa Izba Odwoławcza (sąd przetargowy w Warszawie) uruchomiła rozprawy online. Jednocześnie ukrócono „partyzantkę procesową” – strony muszą powołać wszystkie dowody i twierdzenia w pismach procesowych przed rozprawą, a nie wyciągać wielostronicowe ekspertyzy techniczne w trakcie posiedzenia.
3. **Centralny Rejestr Umów Jednostek Sektora Finansów Publicznych – CRU JSFP (od 1 lipca 2026 r.):**
   * *Skutek dla IT (Gamechanger analityczny!):* Od 1 lipca 2026 r. każdy urząd musi w ciągu 30 dni opublikować w publicznym rejestrze dane o każdej zawartej umowie (pisemnej, elektronicznej, dokumentowej) – **bez żadnego progu kwotowego** (usunięto planowany wcześniej próg $500\text{ PLN}$). Dla branży IT oznacza to pełną przejrzystość: można sprawdzić, z kim, na jak długo i za jaką kwotę dany urząd podpisał nawet drobną umowę podprogową na utrzymanie systemu czy licencje, bez konieczności wysyłania wniosków o dostęp do informacji publicznej (UDIP).
4. **Certyfikacja Wykonawców Zamówień Publicznych (od 12 lipca 2026 r.):**
   * *Skutek dla IT (Ważny niuans!):* Wprowadzono dobrowolny system „paszportów przetargowych” ważnych od 1 do 3 lat. Ustawa dzieli certyfikaty na dwa rodzaje:
     * **Certyfikat niepodlegania wykluczeniu** (dostępny dla firm IT od 12 lipca 2026 r.) – firma raz przechodzi weryfikację w akredytowanym podmiocie państwowym i w kolejnych przetargach pokazuje tylko certyfikat, zamiast co 3 miesiące pobierać zaświadczenia z ZUS, Urzędu Skarbowego i KRK dla całego zarządu i prokurentów.
     * **Certyfikat zdolności (potwierdzający doświadczenie/referencje i kadrę)** – **UWAGA:** Zgodnie z przepisami przejściowymi przez pierwsze 4 lata (do września 2029 r.) certyfikacja zdolności działa *wyłącznie dla robót budowlanych*. Firmy IT nadal muszą w każdym przetargu osobno składać wykazy zrealizowanych wdrożeń (referencje) oraz wykazy specjalistów.
5. **Wykluczenie firm spoza UE i porozumienia GPA (skutek wyroku TSUE C-652/22 i nowelizacji z 2025/2026 r.):**
   * Zamawiający mogą blokować (lub odrzucać) oferty składane przez podmioty z państw trzecich (np. Chiny, Turcja, Indie), które nie mają umowy o wzajemnym dostępie do rynku zamówień z UE. W IT ma to znaczenie przy dostawach sprzętu sieciowego i usługach outsourcingu spoza EOG.
6. **Nowelizacja KSC / Wdrożenie dyrektywy NIS2 (2026 r.):**
   * Choć to ustawa o Krajowym Systemie Cyberbezpieczeństwa, wywołała trzęsienie ziemi w przetargach IT. Urzędy, szpitale i spółki komunalne (jako podmioty kluczowe i ważne) masowo wpisują do SWZ wymóg posiadania przez software house'y certyfikatu **ISO/IEC 27001**, wdrożonych procedur bezpiecznego wytwarzania kodu (SSDLC), audytów podatności oraz zakazu przetwarzania danych i świadczenia usług utrzymaniowych spoza terytorium EOG.

### Planowane zmiany na 2027 rok (Projekt rządowy z jesieni 2026 r.):

W IV kwartale 2026 r. na finiszu prac rządowych znajduje się duża nowelizacja PZP (planowane wejście w życie w **2027 r.**), nakierowana na odciążenie KIO (liczba odwołań wzrosła z $2,7\text{ tys.}$ w 2019 r. do blisko $6\text{ tys.}$ rocznie w latach 2025–2026):
1. **Koniec automatycznego progu $30\text{ proc.}$ przy Rażąco Niskiej Cenie (uchylenie art. 224 ust. 2 PZP):**
   * *Dlaczego to kluczowe dla IT?* Obecnie, jeśli oferta firmy IT jest o $\ge 30\text{ proc.}$ niższa od budżetu zamawiającego lub średniej innych ofert, urząd **musi** wezwać wykonawcę do tłumaczenia się z rażąco niskiej ceny (RNC). W IT, gdzie urzędy często przeszacowują budżety dwukrotnie, a koszty licencji lub gotowych modułów różnią się drastycznie między wykonawcami, generowało to tysiące zbędnych wezwań. Po zmianie urząd wezwie do wyjaśnień tylko wtedy, gdy cena realnie wzbudzi jego wątpliwości.
2. **Odwrócenie ciężaru dowodu RNC przed KIO:**
   * Jeśli konkurent zaskarży Twoją ofertę w KIO, twierdząc, że masz rażąco niską cenę, to **on (odwołujący)** będzie musiał to udowodnić (obecnie ciężar dowodu spoczywa na broniącym swojej ceny wykonawcy). *Wyjątek:* jeśli utajnisz swoje wyjaśnienia ceny jako „tajemnicę przedsiębiorstwa”, ciężar dowodu nadal zostaje na Tobie!
3. **Drastyczna podwyżka opłat (wpisów) od odwołań do KIO:**
   * Górne granice wpisów mają wzrosnąć z obecnych $7\,500\text{ / }15\,000\text{ PLN}$ (dla dostaw i usług) do przedziału **$12\,000\text{ -- }30\,000\text{ PLN}$** (a w największych robotach budowlanych nawet do $100\,000\text{ PLN}$), wraz z mechanizmem corocznej waloryzacji o inflację. Utrudnio to mniejszym firmom IT walkę o swoje prawa w mniejszych przetargach.

---

## 5. Analiza Próbki Przetargów IT (Listopad 2026) – Przegląd Rynku

Aby zobrazować, jak teoria wygląda w praktyce, poniżej znajduje się analiza rzeczywistych postępowań IT prowadzonych na przełomie października i listopada 2026 r. w czterech głównych segmentach rynku.

### Segment A: Duże zamówienia unijne (TED) – Body Leasing i Systemy Krytyczne

1. **ZUS (Zakład Ubezpieczeń Społecznych): *„Zakup usługi wsparcia wytwórstwa oprogramowania autorskiego – Body Leasing”* (TED 742448-2026)**
   * **Parametry:** Przetarg nieograniczony (powyżej progów UE), czas realizacji: 36 miesięcy, wadium: $150\,000\text{ PLN}$, CPV: `72000000` (Usługi IT).
   * **Anatomia przypadku:** Przetarg ogłoszono 24 lipca 2026 r. z pierwotnym terminem składania ofert na 25 sierpnia 2026 r. Do listopada termin składania ofert **przesuwano aż 7 razy (łącznie o 80 dni, na 13.11.2026 r.)**.
   * **Wzorzec branżowy:** W dużych przetargach IT pierwotny termin składania ofert jest niemal zawsze fikcją. Wykonawcy zasypują zamawiającego setkami pytań do SWZ i OPZ, wskazując na niejasności w opisach ról (np. jakich dokładnie certyfikatów wymaga ZUS od Senior Java Developera) lub zbyt rygorystyczne kary umowne. Każda większa paczka odpowiedzi wymusza zmianę SWZ i przesunięcie terminu.
2. **Utrzymanie i rozwój dużych systemów dziedzinowych (TED):**
   * *Przykład 1:* **Usługa Asysty Technicznej i Konserwacji (ATiK) Systemu ZSZO wraz z usługami rozwoju** – budżet ok. **$8\,818\,474\text{ PLN}$**.
   * *Przykład 2:* **Uniwersytet Morski w Gdyni** – *Dostawa infrastruktury oraz wdrożenie i migracja środowiska CSZU (Centralnego Systemu Zarządzania Użytkownikami)*.
   * *Przykład 3:* **Wsparcie techniczne producenta na macierze dyskowe NetApp** – budżet ok. **$1\,010\,392\text{ PLN}$**.
   * **Wzorzec branżowy:** Podział na dwa światy: albo „czysta odsprzedaż wsparcia producenta” (gdzie marża integratora wynosi $1\text{--}3\text{ proc.}$, a o wygranej decyduje status partnera u vendora i rabat producenta), albo kontrakty typu **ATiK (Asysta Techniczna i Konserwacja + pula godzin rozwojowych)**, gdzie dotychczasowy wykonawca systemu ma ogromną przewagę informacyjną i technologiczną.

### Segment B: Specjalistyczny Zamawiający Centralny – Centrum e-Zdrowia (CeZ)

Analiza tablicy zamówień **Centrum e-Zdrowia (CeZ)** z jesieni 2026 r. pokazuje pełen cykl życia zakupów IT w dużej instytucji państwowej:
* **Badanie rynku przed przetargiem (Wstępne ogłoszenia / Zapytania o wartość szacunkową – WPZ):**
  * *„Wstępne ogłoszenie – Dostawa systemu AI do Predykcyjnego Monitoringu, Korelacji Zdarzeń i Wczesnego Wykrywania Awarii Usług IT”* (październik 2026) – klasyczne wyjście do rynku przy nowej technologii (AIOps), gdzie zamawiający bada dostępne rozwiązania przed rozpisaniem właściwego przetargu.
  * *„WPZ: Dostawa licencji czasowych Enterprise DB (...) lub równoważnych”*, *„WPZ: Dostawa subskrypcji VMware vDefend Firewall (...) lub rozwiązania równoważnego”*, *„Przedłużenie subskrypcji Docker Desktop lub równoważnej (100 szt.)”*.
* **Zabezpieczanie zasobów kadrowych:**
  * *„Zawarcie umowy ramowej na świadczenie usług z zakresu wsparcia informatycznego”* oraz pojedyncze zamówienia celowe, np. *„Świadczenie usług z zakresu wsparcia informatycznego CeZ – Developer Android”*.
* **Trend Cybersec / KSC:**
  * *„Rozbudowa systemu do automatycznych testów podatności oraz monitorowania i ochrony Active Directory/Entra ID”*, *„Zakup urządzeń do awaryjnego przywracania usług w podmiotach dotkniętych incydentami krytycznymi”*, *„Szkolenia dla Sektorowego Zespołu Reagowania na Incydenty Bezpieczeństwa Komputerowego (CSIRT CeZ)”*.

### Segment C: Średnie zamówienia krajowe (BZP / e-Zamówienia: $170\text{ tys.} - 930\text{ tys. PLN}$)

1. **Szpital Powiatowy w Limanowej:** *„Kompleksowa obsługa infrastruktury informatycznej wraz z nadzorem nad systemami”* – budżet **$721\,951\text{ PLN}$** (BZP). Przykład outsourcingu IT dla średniej jednostki publicznej, gdzie kluczowe jest lokalne wsparcie (czas dojazdu / reakcji SLA) i znajomość systemów medycznych (HIS).
2. **MPK w Koniecpolu Sp. z o.o.:** *„Dostawa i wdrożenie systemów cyberbezpieczeństwa w obszarze technicznym IT/OT”* (BZP). Wzorcowy przykład fali przetargów napędzanych funduszami na cyberbezpieczeństwo samorządów, wodociągów i spółek komunalnych (wymogi NIS2/KSC).
3. **Dąbrowa Tarnowska:** *„Dostawa, instalacja i uruchomienie e-usługi (...) oraz oprogramowania pieczęci elektronicznej dla Systemu EWID 2007”* (BZP). Klasyczny przykład zamówienia na rozbudowę konkretnego, już działającego w urzędzie systemu dziedzinowego (silny *vendor lock-in* – zewnętrznej firmie trudno wejść w kod obcego systemu bez współpracy z jego producentem).

### Segment D: Małe Zapytania Ofertowe (Baza Konkurencyjności i podprogowe $<170\text{ tys. PLN}$)

1. **Baza Konkurencyjności (BK2021) – Startup / MŚP z dotacją UE:**
   * *„Wytworzenie, rozwój i testowanie oprogramowania platformy internetowej Klipster – marketplace CPM łączący marki z twórcami short-form video”* (Rzeszów, program FEPW).
   * *„Zapewnienie zasobów ludzkich (body leasing) z branży IT na potrzeby tworzenia MVP w ramach programu inkubacyjnego”*.
   * **Specyfika:** Zamawiającym jest tu prywatna spółka (np. startup lub fundusz), która dostała grant z UE/PARP/NCBR. Nie podlega pod ustawę PZP, ale musi opublikować zapytanie w Bazie Konkurencyjności. Język ogłoszenia jest czysto biznesowy (MVP, marketplace, Agile, sprinty), ale błędy formalne w ofercie również skutkują jej odrzuceniem.
2. **Zamówienie podprogowe po reformie 2026 r.:**
   * *„Zakup infrastruktury i wdrożenie aplikacji do biletomatu – tzw. automatyczny kasjer – 2 szt.”* – budżet **$141\,300\text{ PLN}$**.
   * **Obserwacja:** Jeszcze w 2025 r. (gdy próg wynosił $130\,000\text{ PLN}$) to zamówienie musiałoby iść pełnym, sformalizowanym Trybem Podstawowym w BZP. W listopadzie 2026 r., dzięki podniesieniu progu do $170\,000\text{ PLN}$ netto, mieści się w szybkiej ścieżce podprogowej!

---

## 6. Specyfika Branży IT w PZP: Wzorce, Pułapki i „Red Flags”

Na podstawie analizy setek postępowań IT w Polsce można wyróżnić **7 głównych wzorców i pułapek**, które determinują ten rynek:

### 1. Wielki odwrót od „Fixed Price” na rzecz „Body Leasingu” i „Time & Material”
Przez lata urzędy próbowały zamawiać systemy IT w modelu *Fixed Price* (sztywna cena za sztywny OPZ). Kończyło się to wieloletnimi sporami w sądach, bo w trakcie 2 lat pisania systemu zmieniało się prawo, a sztywny OPZ z PZP uniemożliwiał zwinne (Agile) zmiany bez łamania dyscypliny finansów publicznych (zakaz istotnych zmian umowy – art. 454 PZP).
* **Wzorzec obecny:** Urzędy masowo kupują **Body Leasing** (wynajem programistów, analityków, testerów na godziny/MD) lub rozliczają rozwój w **Punktach Funkcyjnych (IFPUG / COSMIC)**. Zarządzanie projektem (Product Owner / Scrum Master) zostaje po stronie urzędu.
* **Red Flag dla wykonawcy:** W przetargach na Body Leasing zamawiający często wymagają podania w ofercie nazwisk i CV konkretnych specjalistów (lub gotowości do podstawienia 10 osób w ciągu 7 dni od podpisania umowy), podczas gdy samo rozstrzygnięcie przetargu trwa 3–4 miesiące. Utrzymanie „ławki” (benchu) przez 90 dni związania ofertą to jedno z największych ryzyk kosztowych dla software house'ów.

### 2. Pozorna „Równoważność” i walka z Vendor Lock-in
Zgodnie z art. 99 ust. 4–5 PZP zamawiający **nie może** opisać przedmiotu zamówienia przez wskazanie znaków towarowych lub nazw produktów (np. „chcemy kupić licencje VMware / komputery Dell / przełączniki Cisco”), chyba że jest to uzasadnione specyfiką przedmiotu i zamawiający dopisze magiczną formułkę **„lub równoważne”** wraz z precyzyjnymi kryteriami równoważności.
* **Jak to działa w praktyce (Wzorzec):** Urzędy dopisują „lub równoważne”, ale w tabeli kryteriów równoważności wpisują 15 bardzo specyficznych parametrów (np. dokładna pojemność pamięci cache procesora, specyficzny protokół komunikacji lub funkcja dostępna tylko u jednego producenta).
* **Jak reagują wykonawcy:** Jeśli kryteria równoważności są pozorne (spełnia je tylko jeden produkt na świecie), konkurenci składają pytania do SWZ lub **odwołanie do KIO na opis przedmiotu zamówienia** (mają na to tylko 5 dni w przetargach krajowych i 10 dni w unijnych od publikacji SWZ!).

### 3. Kryteria oceny ofert (Zasada $60/40$ i jak ją omijać lub wykorzystywać)
Większość urzędów (administracja rządowa, samorządy) nie może zastosować kryterium **Cena = $100\text{ proc.}$**, chyba że określi w OPZ wyczerpujące standardy jakościowe odnoszące się do wszystkich istotnych cech przedmiotu zamówienia (art. 246 PZP). W efekcie standardem w usługach IT jest układ **$60\text{ proc.}$ Cena + $40\text{ proc.}$ Kryteria pozacenowe**.
* **Najczęstsze kryteria pozacenowe w IT ($40\text{ proc.}$):**
  * **Dodatkowe doświadczenie kluczowego personelu** (np. punkty za każdy dodatkowy projekt zrealizowany przez Architekta lub Kierownika Projektu ponad minimum wymagane w warunkach udziału). *Wskazówka:* W takich przetargach wszyscy poważni gracze wystawiają CV dające maksymalne $40\text{ pkt}$, więc realnie o wygranej i tak decyduje najniższa cena!
  * **Skrócenie czasów reakcji SLA lub wydłużenie gwarancji** (np. czas usunięcia błędu krytycznego w 4h zamiast 12h, gwarancja na 60 mies. zamiast 36 mies.).
  * **Prezentacja próbki (Sample / Proof of Concept):** W dużych przetargach na systemy ERP, EZD czy AI zamawiający wymaga zaprezentowania działającego prototypu lub wykonania zadania testowego na żywo przed komisją przetargową. To najtrudniejsze, ale też najbardziej merytoryczne kryterium, często będące przedmiotem sporów w KIO.

### 4. Asymetria kontraktowa, SLA i Kary Umowne
Pomimo że ustawa PZP (od 2021 r.) zawiera katalog klauzul abuzywnych (zakazanych – art. 433 PZP, np. zakaz naliczania kar za *opóźnienie* niespowodowane winą wykonawcy, zamiast za *zwłokę*) oraz obowiązek wpisania górnego limitu kar umownych (cap), umowy w sektorze publicznym nadal są jednostronne.
* **Na co zwracać uwagę:**
  * Czy kary umowne za niedotrzymanie SLA nie kumulują się w sposób kaskadowy?
  * Czy odbiór etapu jest uzależniony od podpisania protokołu odbioru „bez żadnych zastrzeżeń” (co jest niezgodne z orzecznictwem Sądu Najwyższego i rekomendacjami Prokuratorii Generalnej – urząd nie może blokować odbioru i płatności z powodu drobnych usterek nieistotnych, tzw. błędów kategorii C/D)?

### 5. Prawa autorskie (IP) a Open Source i Background IP
Wielu zamawiających stosuje w umowach prostą klauzulę: *„Wykonawca przenosi na Zamawiającego całość autorskich praw majątkowych do Oprogramowania z chwilą odbioru wraz z kodem źródłowym”*.
* **Pułapka w IT:** Żaden współczesny system nie powstaje w $100\text{ proc.}$ od zera. Składa się z bibliotek Open Source (na licencjach MIT, Apache, GPL – do których wykonawca nie ma praw majątkowych, więc nie może ich przenieść!), gotowego silnika wykonawcy (*Background IP*) oraz kodu dedykowanego (*Foreground IP*). Profesjonalny wykonawca zawsze na etapie pytań do SWZ wnioskuje o rozdzielenie tych trzech warstw w umowie (przeniesienie praw tylko do kodu dedykowanego + licencja niewyłączna na gotowe moduły + respektowanie licencji Open Source).

### 6. Waloryzacja wynagrodzenia i Prawo Opcji
* **Obowiązkowa waloryzacja (art. 439 PZP):** Każda umowa na usługi lub dostawy zawierana na okres **dłuższy niż 6 miesięcy** musi zawierać klauzule waloryzacyjne (np. powiązane ze wskaźnikiem inflacji GUS lub wzrostem przeciętnego wynagrodzenia w sektorze przedsiębiorstw). W kontraktach IT trwających 36–48 miesięcy to kluczowy bufor chroniący marżę wykonawcy.
* **Prawo Opcji (art. 441 PZP):** Bardzo modny mechanizm w IT. Urząd zamawia np. wdrożenie systemu (zakres podstawowy – gwarantowany: $2\text{ mln PLN}$) oraz przewiduje „Prawo Opcji” (dodatkowe 2000 godzin rozwojowych lub dodatkowe licencje za kolejne $1\text{ mln PLN}$). Wykonawca musi wycenić całość ($3\text{ mln PLN}$), ale urząd ma gwarancję, że nie musi wykorzystać opcji, jeśli zabraknie mu budżetu.

---

## 7. Wnioski i Wskazówki pod Projekt (Perspektywa Produktowa / Dane)

Jeśli budujesz projekt technologiczny, analityczny lub doradczy wokół zamówień publicznych w IT, weź pod uwagę następujące realia:

1. **Kody CPV to za mało do klasyfikacji IT:**
   Główny słownik CPV pochodzi z 2008 roku. Przetargi na sztuczną inteligencję, chmurę obliczeniową, DevOps czy cyberbezpieczeństwo są często wrzucane pod ogólny worek `72000000-5` (Usługi informatyczne) lub `48000000-8` (Pakiety oprogramowania). Co więcej, przetarg na „System biletowy z aplikacją mobilną” może być oznaczony kodem CPV dla... urządzeń transportowych lub automatów sprzedających. Skuteczne wyszukiwanie w IT wymaga analizy semantycznej (NLP/LLM) tytułów, opisów oraz **załączników OPZ**.
2. **Prawdziwe dane są w załącznikach (SWZ, OPZ, Pytania i Odpowiedzi):**
   Samo ogłoszenie w BZP lub TED to tylko metadane (kto, kiedy, jaki tryb, jakie wadium). Kluczowe informacje dla firmy IT (jaki stack technologiczny, ile godzin, jakie SLA, jakie technologie są preferowane) znajdują się wewnątrz plików PDF/DOCX spakowanych w archiwa ZIP na zewnętrznych platformach zakupowych (platformazakupowa.pl, Marketplanet itp.).
3. **Monitoring zmian (Modyfikacji SWZ) jest tak samo ważny jak monitoring ogłoszeń:**
   Przetarg IT, który w dniu publikacji jest „nie do ugryzienia” przez software house (bo ma zaporowy warunek referencyjny lub nierealny termin), po 3 tygodniach i odpowiedziach na pytania wykonawców często zmienia się o 180 stopni. System, który śledzi zmiany w dokumentacji i przesunięcia terminów, daje ogromną przewagę konkurencyjną.
4. **Wykorzystaj potencjał Plany Postępowań + Centralny Rejestr Umów (CRU 2026):**
   W branży IT wygrywają ci, którzy wiedzą o przetargu **przed jego ogłoszeniem**. Połączenie dwóch publicznych źródeł danych:
   * **Planów Postępowań** z e-Zamówienia (co urząd planuje kupić w danym kwartale), oraz
   * **Centralnego Rejestru Umów (od lipca 2026 r.)** i archiwum BZP/TED (kiedy kończy się dotychczasowa umowa na utrzymanie systemu lub subskrypcję licencji w danym urzędzie),
   pozwala precyzyjnie przewidywać nadchodzące przetargi IT i inicjować Wstępne Konsultacje Rynkowe.