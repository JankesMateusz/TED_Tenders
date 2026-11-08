# Plan wdrożenia: wygląd z prototypu i reszta przeglądu UX

Plan jest pocięty na małe sesje, z których każda zmieści się w jednej sesji agenta i kończy jednym commitem. Stan na 2026-11-04, `main` = `05b08de`.

**Punkt wyjścia.** Punkty 1–14 przeglądu UX/UI (karta ze `StatusMenu`, filtry z kolejką „Nieoznaczone”, statystyki z kategoriami CPV, „Kto ocenia” i trendem, `TabBar`, dostępność, zmienne w `theme.css`) są już na `main` (opis: `docs/handoff.md`, sekcja „Przegląd UX/UI: zrealizowany”). Ten plan obejmuje to, co zostało: punkt 15 przeglądu (filtry w menu z chipami, skróty klawiszowe) oraz przeniesienie wyglądu z prototypu `docs/prototyp/prototyp-ux.html` (otwiera się dwuklikiem; to wzór wizualny, nie kod do kopiowania).

## Postęp (aktualizuj po każdej sesji: `[x]`, hash commita, jedna linia o odstępstwach)

- [x] S1 Tokeny i powierzchnie (CSS) — 3383ed9; w ciemnym motywie `--button-primary` = #2f6fdb (biały tekst na przyciskach), akcent #6aa5ff tylko jako `--accent`
- [x] S2 Karta: wygląd i usunięcie wyróżnienia kodów IT — ff03620; usunięto też `.cpvCodeIt` (podświetlenie w rozwiniętej liście CPV); ikony SVG zamiast ★ ☆ zostają na S13
- [x] S3 Chipy aktywnych filtrów — 6806b63; źródła i typy to jeden chip zbiorczy (✕ przywraca wszystkie), statusy po chipie, "Wszystkie statusy" jako jeden
- [x] S4 Filtry w menu rozwijanych — d0710d3; typ `SortOrder` z 'deadline' i `compareDeadline` zostały w `tenderFilters.ts` (martwy kod, usunięcie ruszałoby testy sortowania)
- [x] S5 Nagłówek listy „do przejrzenia: N” — c614c52; w stanie domyślnym rząd chipów pokazuje samo „Wyczyść filtry” (hasActiveFilters z kolejki), do ewentualnej poprawki
- [x] S6 Pasek aplikacji: wchłonięcie `UserBar` — 182d2fb; pasek nie jest sticky; kolory okienka react-datepicker bez zmian (S12); naprawiono biały tekst przycisków w AdminPanel w jasnym motywie
- [x] S7 Wyszukiwarka w pasku i skrót `/` — 45e5876; wyszukiwarka jest teraz widoczna też w Zapisanych i Statystykach
- [x] S8 Sidebar: powtarzający się zamawiający — a3a2589; liczniki w zakładkach Zamawiający/Miasta nadal liczą wszystkich
- [x] S9 Skróty klawiszowe do oceny — da6f34a; klawisze 1–4/0/S niesprawdzone na żywo (zapisywałyby dane wspólne), do sprawdzenia przez użytkownika
- [x] S10 (opcjonalnie) Statystyki: wygląd i powtarzający się zamawiający — 28e9a77; panel zastąpił istniejące „Top 10 zamawiających” (pole topBuyers → repeatBuyers); kliknięcie w zamawiającego niesprawdzone na żywo
- [x] S11 (opcjonalnie) Statystyki: średnia godzinowa z 14 dni — 068e804; bez nowych zapytań (dane z useRecentTenders); lista wyboru dnia zawija się pod podtytuł
- [x] S12 Mobile i jasny motyw: przegląd i poprawki — 7a8841f (+ 10e8096: kalendarz po polsku, jawna zależność date-fns 4.1.0); podsumowanie w handoff.md i decyzja o pliku planu czekają na akceptację wyglądu
- [x] S13 Dopasowanie do prototypu (po obejrzeniu przez użytkownika) — 70df60b; porównanie zrobił agent (bez listy uwag użytkownika); przy okazji naprawiony sticky panelu zamawiających (overflow-x: clip w index.css)

Kolejność jest zalecana, bo S2–S12 zakładają tokeny z S1. Zależności: S4 po S3; S7 po S6; S9 po S2 i S5; S12 po S1–S9; S13 na samym końcu. Poza tym sesje są niezależne i można je robić w dowolnej kolejności.

## Decyzje do podjęcia przed startem (dopisz wybór; „domyślnie” obowiązuje, gdy nic nie zmienisz)

| # | Pytanie | Domyślnie | Dotyczy |
|---|---|---|---|
| D1 | Aplikacja oznacza dziś kody IT na karcie (`cpvChipIt`, podpowiedź „kod IT, dopasował ogłoszenie”). Użytkownik zdecydował, że **na razie nie będzie oceny dopasowania do IT**. Usunąć wyróżnienie i podpowiedź? | Tak. Kolejność chipów (kody IT pierwsze) zostaje, bo jest niewidoczna dla użytkownika | S2 |
| D2 | Opcja sortowania „Termin składania” (terminy nie są istotne) | Usunąć z listy; zapisane `deadline` w `localStorage` wraca do `publication` | S4 |
| D3 | Wybór daty: `react-datepicker` z zakresem dat | Zostaje bez zmian, tylko restyl pod tokeny | S6 |
| D4 | Nagłówek: dziś gradient, w prototypie płaski pasek w kolorze powierzchni | Płaski pasek jak w prototypie | S6 |
| D5 | Skróty klawiszowe (`J`/`K`/`1`–`4`/`0`/`S`) | Włączone; nie działają przy fokusie w polu tekstowym ani gdy otwarte jest menu; `Ctrl+F` zostaje | S9 |
| D6 | Kolory statusów i źródeł | Bez zmian (`tenderStatus.ts`, `tenderSources.ts`; kontrast pilnuje `colorContrast.test.ts`) | S1 |

Jeśli użytkownik odpowie inaczej, popraw wiersz w tabeli i odpowiednią sesję zanim ją uruchomisz.

## Zasady wspólne dla każdej sesji (zamiast czytania całego `docs/CLAUDE.md` i `handoff.md`)

- **Czytaj tylko:** ten plik (sekcja swojej sesji i ta) oraz pliki wskazane w „Czytaj”. Nie czytaj całych `docs/CLAUDE.md`, `docs/handoff.md` ani plików CSS od góry do dołu. W dużych plikach używaj `grep -n` po nazwie klasy/funkcji i czytaj fragment z `offset`/`limit`. Największe: `Tenders.module.css` (ok. 1230 linii), `StatisticsTab.module.css` (ok. 870), `Header.module.css` (ok. 680), `tenders.tsx` (ok. 700), `StatisticsTab.tsx` (ok. 640).
- **Język:** rozmowa po polsku, zwięźle. Komunikaty commitów po angielsku, zakończone linią współautora podaną w system-reminderze sesji.
- **Git:** pracuj na gałęzi `feature/ui-prototyp` odchodzącej od `main` (utwórz ją w S1, w kolejnych sesjach przełącz się na nią). Jedna sesja = jeden commit, **dopiero po zgodzie użytkownika**. Przed commitem `git status` i `git diff --stat`, nie dodawaj cudzych zmian. **Nie rób pusha do `main`, nie wdrażaj na produkcję** (push do `main` wdraża hosting na `tendersted`). Merge do `main` robi użytkownik po obejrzeniu całości.
- **Zakres:** tylko to, co jest w sesji. Znalezione drobiazgi spoza zakresu dopisz na końcu swojej sekcji w „Uwagi z sesji”, nie naprawiaj.
- **Kolory i style:** żadnych nowych kolorów na sztywno; używaj zmiennych z `src/styles/theme.css` (w S1 dochodzą nowe). Nie zmieniaj nazw istniejących klas CSS bez potrzeby (CSS Modules, importy w kilku plikach). Elementy interaktywne: `:focus-visible`, cele dotykowe min. 40 px, `aria-*` tak jak w istniejących komponentach (`TabBar.tsx`, `StatusMenu.tsx` to wzory).
- **Weryfikacja (PowerShell, katalog projektu).** W trakcie pracy: `npx tsc --noEmit -p tsconfig.json` oraz `npx eslint <zmienione pliki>` oraz testy dotyczące zmiany (`$env:CI='true'; npx react-scripts test --watchAll=false <ścieżka>`). Na koniec sesji raz: pełny Jest i `$env:CI='false'; npm run build`. Raportuj faktyczne wyniki.
- **Weryfikacja wizualna (agent widzi aplikację).** Na projekcie testowym `tenders-test-b5bb3` włączono logowanie anonimowe i wdrożono reguły z otwartym dostępem (2026-11-04), a `.env.local` wskazuje na ten projekt (`REACT_APP_USE_EMULATORS=false`), więc aplikacja wczytuje się bez logowania z danymi testowymi (ok. 58 ogłoszeń). Procedura: (1) uruchom serwer w tle: `BROWSER=none PORT=3111 npx react-scripts start` (w Git Bash; poczekaj na „No issues found” w logu); (2) zrób zrzuty: `node scripts/screenshot-app.js --out <plik.png> [--tab Statystyki] [--theme light] [--width 390 --height 800] [--full]`; skrypt robi też zrzut szkicu (`--url file:///C:/Users/janke/Desktop/Projekty/TED_Tenders-main/docs/prototyp/prototyp-ux.html`); (3) obejrzyj zrzuty narzędziem Read i porównaj z szkicem; (4) **zatrzymaj serwer** na koniec (PowerShell: `Stop-Process` procesu nasłuchującego na porcie 3111). Zrzuty zapisuj poza repozytorium (np. w katalogu tymczasowym).
- **Tylko odczyt na projekcie testowym:** nie klikaj statusów, gwiazdek, komentarzy ani „odśwież” podczas zrzutów (dane są wspólne z testami użytkownika). Aplikacja przy starcie sama wywołuje `refreshTenders`, który bywa 429 (limit): to nie blokuje listy i nie jest błędem Twojej zmiany. Zmiany reguł Firestore i wdrożenia na projekt testowy tylko za zgodą użytkownika.
- W raporcie podaj, które zrzuty zrobiłeś (widok, motyw, szerokość) i **co się różni od szkicu**. Ocenę końcową „czy tak ma być” wciąż wydaje użytkownik.
- **Wzór wizualny:** `docs/prototyp/prototyp-ux.html`. Szukaj w nim klas (`.card`, `.appbar`, `.pop-panel`, `.chip` itd.), nie czytaj całego pliku (ok. 600 linii). Nie kopiuj jego kodu JS. Zrzut szkicu zrobisz skryptem z punktu „Weryfikacja wizualna” (obie wersje obok siebie).
- **Na koniec sesji:** zaznacz `[x]` w „Postępie”, dopisz hash i odstępstwa, nic więcej w dokumentacji. Podsumowanie do `handoff.md` robi dopiero ostatnia sesja (S12).

**Prompt startowy sesji** (wklej użytkownik):
> Pracujemy według `docs/plan-wdrozenia-ui.md`. Wykonaj sesję S<N>. Przeczytaj tylko ten plik i pliki wskazane w sesji, trzymaj się zakresu, na koniec daj raport (zmiany, pliki, weryfikacja, ograniczenia, stan Git) i zapytaj o zgodę na commit.

---

## S1. Tokeny i powierzchnie (CSS) — rozmiar S

**Cel:** zmienić wartości zmiennych motywu tak, żeby cała aplikacja dostała paletę i „powierzchnie” z prototypu, bez zmian w komponentach.
**Czytaj:** `src/styles/theme.css` (cały, 160 linii); `grep -rn "var(--bg-primary)\|var(--bg-secondary)" src --include=*.css | head -60`, żeby zobaczyć, gdzie służy za tło strony, a gdzie karty; w prototypie blok `:root[data-theme=...]` (pierwsze ok. 25 linii stylów).
**Kroki:**
1. Utwórz gałąź `feature/ui-prototyp` z `main`.
2. W `theme.css` przemapuj istniejące zmienne na paletę prototypu, nie zmieniając ich nazw. Ciemny motyw: tło strony `#0e131d`, powierzchnia (karty, pasek) `#161c2a`, podniesiona (`--bg-secondary`, pola) `#1d2435`, obramowanie `#2a3349`, tekst `#e7ebf3`, tekst pomocniczy `#9aa4ba`, akcent `#6aa5ff`. Jasny: tło `#f4f6fb`, powierzchnia `#ffffff`, podniesiona `#eef1f8`, obramowanie `#d8dfec`, tekst `#18202f`, pomocniczy `#576078`, akcent `#1f5fe0`. Ustal na podstawie `grep`, która zmienna jest „tłem karty”, a która „tłem pól”, i dopasuj.
3. Zaktualizuj `body[data-theme=...]` (tło strony) do nowych wartości; usuń zdublowany kolor tła z innych miejsc tylko jeśli jest zmienną.
4. Dodaj zmienne pomocnicze z prototypu, które będą potrzebne w S2–S4: `--surface`, `--raised`, `--radius-card: 12px`, `--radius-control: 9px`, `--pop-shadow`. Nie używaj ich jeszcze nigdzie poza tym, co wymaga mapowania.
5. Sprawdź, że `colorContrast.test.ts` przechodzi (testuje plakietki, nie tło).
**Poza zakresem:** zmiany w TSX, kolory statusów i źródeł (D6), gradient nagłówka (S6), czcionka (zostaje systemowa; prototyp też jej nie ładuje).
**Gotowe, gdy:** `tsc`, Jest i build przechodzą; w `git diff` zmienia się tylko `theme.css`; użytkownik ogląda oba motywy na liście, w statystykach i w oknie użytkowników i nie widzi nieczytelnego tekstu.
**Commit:** `Align theme variables with the new surface palette`

## S2. Karta: wygląd i usunięcie wyróżnienia kodów IT — rozmiar S

**Cel:** karta wizualnie jak w prototypie (płaska powierzchnia, pasek statusu z lewej, chipy CPV bez oceny dopasowania).
**Czytaj:** `src/components/TenderCard.tsx` (cały, ok. 150 linii); w `Tenders.module.css` fragmenty `.tenderCard`, `.tenderCardStatus`, `.cardHeader`, `.cpvChip*`, `.title`, `.metaLine` (znajdź `grep -n`); w prototypie `.card`, `.card[data-status]`, `.cpv-chip`.
**Kroki:**
1. `.tenderCard`: tło `var(--surface)`, obramowanie 1 px `var(--border-color)`, promień `var(--radius-card)`, bez `cursor: pointer` i bez podnoszenia przy hover (`translateY`).
2. `.tenderCardStatus`: zamiast pełnego obramowania i gradientu tylko `border-left: 4px solid var(--status-color)`.
3. D1: w `TenderCard.tsx` usuń klasę `cpvChipIt` (i regułę w CSS) oraz podpowiedź „kod IT, dopasował ogłoszenie” (zostaw samo `title={cpv}`). Zmień komentarz nad `itCodes`, żeby mówił, że to kolejność, nie oznaczenie. Kolejność chipów bez zmian.
4. Chipy CPV: tło `var(--bg-secondary)`, obramowanie `var(--border-color)`, promień 7 px, rozmiar 13 px.
**Poza zakresem:** `StatusMenu`, komentarze, układ siatki karty, atrybucja Bazy Konkurencyjności.
**Gotowe, gdy:** w repozytorium nie ma już `cpvChipIt` ani frazy „dopasował ogłoszenie” (`grep`); `tsc`, lint, build przechodzą; użytkownik porównuje kartę z prototypem.
**Commit:** `Flatten the tender card and drop the IT-match highlight on CPV chips`

## S3. Chipy aktywnych filtrów — rozmiar M

**Cel:** jeden rząd chipów z ✕ pokazujący wszystko, co zawęża listę, oraz przycisk „Wyczyść filtry”. Stare pojedyncze znaczniki CPV znikają.
**Czytaj:** `src/components/FiltersPanel.tsx` (cały), `src/utils/tenderFilters.ts` (tylko typy `StatusFilters`, `FilterOptions`), `src/utils/persistedFilters.ts` (`DEFAULT_STATUS_FILTERS`, `NO_STATUS_FILTERS`), w `tenders.tsx` fragment z `<FiltersPanel` oraz `handleClearFilters`/`hasActiveFilters` (`grep -n`).
**Kroki (najpierw test):**
1. Nowy plik `src/utils/activeFilters.ts` z czystą funkcją `buildActiveFilterChips(input)` zwracającą listę `{ id, label, kind }` dla: statusów (nic, gdy filtr równy domyślnemu „tylko Nieoznaczone”; „Wszystkie statusy”, gdy zaznaczone wszystkie; inaczej po chipie na status), źródeł (gdy mniej niż wszystkie), typów (gdy mniej niż wszystkie), wybranych zamawiających, miast, kodów CPV (`getCpvName` + kod), kategorii CPV (`CPV_CATEGORY_LABELS`). Fraza wyszukiwania nie jest chipem (ma własne pole).
2. Test `src/utils/activeFilters.test.ts`: stan domyślny → pusto; kilka kombinacji; wybór wszystkich statusów; kolejność chipów stała.
3. Nowy komponent `src/components/ActiveFilterChips.tsx`: renderuje chipy (`<button>` z `aria-label="Usuń filtr: …"`, ikona ✕ jako SVG) i `Wyczyść filtry`; `aria-live="polite"` na kontenerze. Style w `Tenders.module.css` (`.activeChips`, `.activeChip`) według `.chip` z prototypu.
4. W `FiltersPanel.tsx` zastąp bloki `activeCpvFilter` (kategoria i kody) tym komponentem, a przycisk „Wyczyść filtry” z rzędu statusów usuń (zostaje w chipach). Nowe propsy: callbacki usuwania poszczególnych filtrów przekaż z `tenders.tsx` (są tam już settery); kontrolki źródeł/typów/statusów na razie bez zmian.
**Poza zakresem:** zamiana rzędów checkboxów na menu (S4), zmiana logiki filtrowania.
**Gotowe, gdy:** testy nowej funkcji i cały Jest przechodzą; użytkownik widzi chipy po wybraniu zamawiającego, kategorii CPV z statystyk i źródła, a ✕ je zdejmuje.
**Commit:** `Show active filters as removable chips`

## S4. Filtry w menu rozwijanych — rozmiar M

**Cel:** rzędy checkboxów (Źródła, Typy, Status) zastąpić trzema przyciskami z menu, jak w prototypie; usunąć sortowanie po terminie (D2).
**Czytaj:** `FiltersPanel.tsx` (stan po S3), `StatusMenu.tsx` (wzór obsługi Escape/kliknięcia poza menu/fokusu), prototyp: `.pop`, `.pop-panel`, `.opt`, `popFilter` w skrypcie; `persistedFilters.ts` + `isSortOrder` w `tenderFilters.ts`; `grep -rn "deadline" src --include=*.ts --include=*.tsx`.
**Kroki:**
1. Nowy komponent `src/components/FilterPopover.tsx`: przycisk z etykietą i znaczkiem liczby wybranych, `aria-expanded`/`aria-haspopup`, panel z listą `<label><input type=checkbox>` (kropka koloru + nazwa + licznik z `facetCounts`, opcje z licznikiem 0 przyciemnione, ale aktywne), zamknięcie Escape/kliknięciem poza panelem z powrotem na przycisk. Wzoruj się na `StatusMenu.tsx`, nie kopiuj prototypu.
2. W `FiltersPanel.tsx` użyj go trzy razy: Status (z opcją „Nieoznaczone” i linkiem „Pokaż wszystkie statusy”), Źródło, Typ. Usuń stare rzędy i nieużywane klasy CSS (`.sourceFilters`, `.sourceFilterLabel`, `.sourceFilterBadge`, `.filterChip*`, `.statusFiltersSection`, `.filtersSection`), sprawdzając `grep`, że nie są używane gdzie indziej.
3. Pasek narzędzi w jednym wierszu: [Status ▾] [Źródło ▾] [Typ ▾] przełącznik „Pokaż ukrytych zamawiających (N)” (zwykła kontrolka z widocznym checkboxem lub przełącznikiem, nie nagłówek) i po prawej sortowanie.
4. D2: usuń opcję „Termin składania” z `SORT_OPTIONS`. W `parsePersistedFilters` zapisane `deadline` mapuje na `DEFAULT_SORT_ORDER` (dodaj test w `persistedFilters.test.ts`); typ `SortOrder` i sortowanie po terminie w `tenderFilters.ts` możesz zostawić, jeśli usunięcie ruszałoby testy, i zanotować to w „Uwagach”.
**Poza zakresem:** nagłówek listy (S5), wyszukiwarka (S7), logika filtrowania.
**Gotowe, gdy:** tsc, lint, Jest, build przechodzą; użytkownik klika menu myszą i klawiaturą (Tab, Spacja, Escape) i sprawdza filtrowanie oraz liczniki.
**Commit:** `Replace filter chip rows with dropdown menus and drop deadline sorting`

## S5. Nagłówek listy „do przejrzenia: N” — rozmiar S

**Cel:** nad listą jedna linia „X ogłoszeń · do przejrzenia: N” oraz podpowiedź o kolejce; w „Zapisane” krótki opis różnicy gwiazdka/status.
**Czytaj:** w `tenders.tsx` fragment renderujący listę (od `activeTab !== 'statistics'`), `facetCounts` (`countFacets` w `tenderFilters.ts`: `facetCounts.statuses.unmarked` istnieje), `constants/index.ts` (`MESSAGES`, `NO_SAVED_TENDERS_MESSAGE` w `tenders.tsx`).
**Kroki:** (1) Pod paskiem filtrów dodaj `<div className={styles.queueHeader}>` z liczbą wyników i `facetCounts.statuses.unmarked`; dla „Zapisane” zamiast licznika tekst „Gwiazdka jest prywatna, status jest wspólny dla zespołu”. (2) Komunikat pustej listy w widoku kolejki: „Kolejka jest pusta: wszystkie pasujące ogłoszenia są ocenione. Zmień filtr statusu, żeby je zobaczyć.” (3) Teksty do `constants/index.ts`, jak reszta komunikatów.
**Poza zakresem:** licznik w zakładce „Przetargi (N)” zostaje bez zmian (zob. uwaga w `handoff.md`).
**Gotowe, gdy:** tsc/lint/build; liczba „do przejrzenia” zgadza się z licznikiem „Nieoznaczone” w menu Status.
**Commit:** `Show the unreviewed count above the tender list`

## S6. Pasek aplikacji: wchłonięcie `UserBar` — rozmiar M

**Cel:** jeden pasek u góry zamiast dwóch (D4: płaski, w kolorze powierzchni), z menu użytkownika po prawej.
**Czytaj:** `src/App.tsx`, `src/components/UserBar.tsx`, `src/components/header.tsx`, w `Header.module.css` klasy `.header`, `.title`, `.controls`, `.buttons`, `.button`, `.iconButton`, `.switch*` (`grep -n`), w `Auth.module.css` `.userBar*`, prototyp: `.appbar`, `.appbar-in`, `.btn`, `.switch`.
**Kroki:**
1. Z `UserBar.tsx` wydziel hook lub małą komponent `UserMenu` (e-mail, „Użytkownicy (N online)” dla admina, „Zaloguj się”/„Wyloguj”, modale `AdminPanel` i `LoginScreen`) i wyrenderuj go w `Header` po prawej. `useReportPresence()` musi dalej działać dla każdego zalogowanego, także gościa (zostaje wywołany raz).
2. Usuń `<UserBar />` z `App.tsx` i nieużywane style `.userBar*` w `Auth.module.css`.
3. Tło paska `var(--surface)`, dolne obramowanie, zamiast gradientu. Zmienne `--header-gradient-*` są używane także w `Auth.module.css` (ok. linii 102, przycisk) i w `Header.module.css` (ok. linii 296): zostaw je w `theme.css` albo zastąp w tych miejscach `var(--accent)`, ale nie usuwaj bez sprawdzenia `grep`. Tytuł „Przetargi” jako logo z kwadratem akcentu.
4. Liczniki źródeł z nagłówka („TED: 11 …”) i „Ostatnia aktualizacja” zostają, ale jako spokojny, mały tekst (nie wielka pigułka); data i „Zakres dat” zostają (D3).
5. Na wąskim ekranie pasek łamie się do dwóch rzędów (`flex-wrap`).
**Poza zakresem:** przeniesienie wyszukiwarki (S7), zmiana logiki odświeżania.
**Gotowe, gdy:** tsc/lint/build; użytkownik sprawdza: logowanie i wylogowanie, okno użytkowników, licznik online, zmianę motywu i dat.
**Commit:** `Merge the user bar into a single flat app bar`

## S7. Wyszukiwarka w pasku i skrót `/` — rozmiar S

**Cel:** pole wyszukiwania w pasku aplikacji; skrót `/` ustawia na nim fokus; `Ctrl+F` działa jak dotąd.
**Czytaj:** `header.tsx` (propsy), `FiltersPanel.tsx` (sekcja `searchSection` z obsługą klawisza Delete), w `tenders.tsx` efekt „Obsługa skrótów klawiszowych”.
**Kroki:** (1) Dodaj do `Header` propsy `searchQuery`, `onSearchChange`, `searchInputRef`; przenieś pole z przyciskiem czyszczenia (zachowaj skrót Delete) z `FiltersPanel`, usuń je stamtąd razem z propsami. (2) Skrót `/` w istniejącym efekcie w `tenders.tsx`, ale tylko gdy fokus nie jest w `input`/`textarea`/`select`/`contenteditable`; `preventDefault`. (3) Placeholder krótszy, żeby się mieścił: „Szukaj: laptop, serwer, CPV…” (stała `PLACEHOLDER_TEXTS.SEARCH`), znaczek `/` w polu.
**Gotowe, gdy:** tsc/lint/build; użytkownik sprawdza wpisywanie, czyszczenie, `/` i `Ctrl+F`.
**Commit:** `Move the search box into the app bar and add the slash shortcut`

## S8. Sidebar: powtarzający się zamawiający — rozmiar S

**Cel:** domyślnie lista zamawiających i miast pokazuje tylko pozycje z ≥ 2 ogłoszeniami, reszta za przyciskiem.
**Czytaj:** `src/components/BuyersSidebar.tsx` (cały; `buildOptions` już sortuje po liczbie), `BuyersSidebar.module.css` (nazwy klas).
**Kroki:** (1) Stan `showAll`; gdy brak frazy wyszukiwania i `showAll === false`, pokaż pozycje z `count >= 2` oraz wybrane. (2) Przycisk „Pokaż pozostałych (N) z jednym ogłoszeniem” / „Pokaż tylko powtarzających się” i krótka notatka o powodzie. (3) Gdy po filtrze nie ma żadnej pozycji z ≥ 2, pokaż wszystkie (żeby lista nie była pusta). Czysta funkcja do wydzielenia i przetestowania w `BuyersSidebar` lub `utils`.
**Poza zakresem:** ukrywanie sidebaru na wąskim ekranie (S12).
**Gotowe, gdy:** tsc/lint/Jest/build; użytkownik widzi krótszą listę i przycisk.
**Commit:** `Collapse single-listing buyers in the sidebar by default`

## S9. Skróty klawiszowe do oceny — rozmiar M

**Cel:** `J`/`K` przechodzą po ogłoszeniach, `1`–`4` ustawiają status (kolejność z `TENDER_STATUSES`), `0` usuwa status, `S` przełącza gwiazdkę (D5).
**Czytaj:** `TenderCard.tsx` (propsy), `tenders.tsx` (`displayedTenders`, miejsce renderu `TenderCard`, efekt skrótów), `UserPreferencesContext.tsx` (`toggleStatus`, `toggleFavorite`; `toggleStatus` na aktywnym statusie go usuwa).
**Kroki (najpierw test):**
1. Czysta funkcja `src/utils/cardNavigation.ts`: `nextActiveId(ids, currentId, action)` dla `next`/`prev` oraz `afterRemoval(ids, removedId)` (po ocenie w kolejce karta znika, aktywna zostaje następna lub ostatnia). Test `cardNavigation.test.ts` z przypadkami brzegowymi (pusta lista, brak aktywnej, koniec listy).
2. W `tenders.tsx` stan `activeTenderId`; propsy `isActive`, `onActivate` w `TenderCard` (klik w kartę ją aktywuje; ramka `outline` 2 px w kolorze akcentu przez klasę `.tenderCardActive`; `scrollIntoView({ block: 'nearest' })`).
3. Skróty tylko na zakładkach z listą; ignoruj przy fokusie w polach tekstowych, przy otwartym menu (`StatusMenu`, `FilterPopover`) i z modyfikatorami Ctrl/Alt/Meta. Status ustawiaj tylko, gdy `liveTendersById.has(id)` (jak `canSetStatus`).
4. Mała podpowiedź pod paskiem filtrów lub w `title` przycisku „Oceń”: „Skróty: J/K, 1–4, 0, S, /”.
**Poza zakresem:** zmiana działania `StatusMenu`.
**Gotowe, gdy:** testy funkcji i cały Jest przechodzą, tsc/lint/build; użytkownik ocenia 5 ogłoszeń samą klawiaturą i sprawdza, że w polu wyszukiwania cyfry się wpisują.
**Commit:** `Add keyboard shortcuts for moving between tenders and setting statuses`

## S10 (opcjonalnie). Statystyki: wygląd i powtarzający się zamawiający — rozmiar M

**Uwaga:** na prośbę użytkownika usunięto już z statystyk „Według działalności zamawiającego”, kafelek „Do przejrzenia” i sekcję „Postęp przeglądania”. **Nie przywracaj ich**, mimo że są w prototypie.
**Cel:** panele statystyk spójne z tokenami S1 i nowy panel „Powtarzający się zamawiający”.
**Czytaj:** `StatisticsTab.tsx` (struktura, ok. 640 linii: czytaj tylko sekcje „Kto ocenia” i „Co jest zamawiane” jako wzór listy), `calculateStatistics.ts` (typ `Statistics`), `StatisticsTab.module.css` (`.section`, `.statCard`, `.list*`).
**Kroki:** (1) Test, potem funkcja w `calculateStatistics.ts`: zamawiający z ≥ 2 ogłoszeniami (po znormalizowanej nazwie, `normalizeName`), sortowane malejąco, max 10. (2) Panel analogiczny do „Kto ocenia”, klikalny: ustawia filtr zamawiającego przez istniejący drill-down `{ kind: 'buyer', buyer }` (wariant jest już w `StatisticsDrillDown` i obsłużony w `tenders.tsx`, nic nie dodajesz). (3) `.section`, `.statCard`: tło `var(--surface)`, promień `var(--radius-card)`, pozostałe wartości z tokenów.
**Gotowe, gdy:** tsc/lint/Jest/build; użytkownik klika zamawiającego w statystykach i trafia na przefiltrowaną listę.
**Commit:** `Add a repeat buyers panel to statistics and restyle panels`

## S11 (opcjonalnie). Statystyki: średnia godzinowa z 14 dni — rozmiar M

**Cel:** wykres godzinowy pokazuje domyślnie średnią z ostatnich 14 dni (z zaznaczoną najlepszą godziną), z możliwością wyboru konkretnego dnia jak dziś.
**Czytaj:** `src/hooks/useHourlyDays.ts`, `src/hooks/useRecentTenders.ts` (czy zwraca `publicationTime` dla eZamówień i jak ładuje 14 dni), fragment „Godzinowa aktywność” w `StatisticsTab.tsx`, `calculateStatistics.ts` (liczenie godzin).
**Kroki:** (1) Test, potem czysta funkcja `averageHourlyDistribution(tenders, days)` (tylko dni z kompletnym odświeżeniem, tak jak trend). (2) Opcja „Średnia (14 dni)” w liście wyboru dnia jako domyślna. (3) Podświetlenie godziny z największą średnią.
**Ryzyko:** koszt odczytów z bazy (14 dni to ok. kilkunastu tysięcy dokumentów, zob. `handoff.md`, „Pomysły na później”); jeśli `useRecentTenders` już je wczytuje po otwarciu statystyk, użyj tych samych danych i nie dodawaj nowych zapytań.
**Commit:** `Show the 14-day average on the hourly chart`

## S12. Mobile i jasny motyw: przegląd i poprawki — rozmiar M

**Cel:** zebrać problemy po S1–S9 w jasnym motywie i na telefonie (390 px) oraz poprawić najpoważniejsze; zamknąć dokumentację.
**Czytaj:** `Tenders.module.css` i `Header.module.css` tylko bloki `@media`, `BuyersSidebar.module.css` (reguła ukrywająca sidebar poniżej 768 px), `FilterPopover.tsx`.
**Kroki:** (1) Zrób zrzuty (procedura w „Zasadach wspólnych”): lista, „Zapisane” i Statystyki, oba motywy, szerokości 1600 i 390 px; na zrzutach z stanu wyjściowego (przed S1) widać m.in. nagłówek zajmujący pół ekranu na telefonie i filtry wypełniające resztę. Spisz problemy. (2) Popraw to, co widać na zrzutach i w kodzie: panel menu filtrów mieści się w szerokości ekranu, przyciski min. 40 px, pasek aplikacji się łamie, karta nie ma poziomego przewijania; sidebar zamawiających na wąskim ekranie jako przycisk „Zamawiający” otwierający panel (zamiast ukrycia). (3) Po akceptacji użytkownika: dopisz do `docs/handoff.md` (sekcja „Przegląd UX/UI”) krótkie podsumowanie wdrożenia S1–S12, odstępstwa od planu i usuń lub zarchiwizuj ten plik zgodnie z decyzją użytkownika.
**Gotowe, gdy:** tsc/lint/Jest/build przechodzą; zrzuty 390 px w obu motywach nie pokazują poziomego przewijania ani ucinania; użytkownik potwierdził wygląd na telefonie i w jasnym motywie.
**Commit:** `Polish the mobile layout and light theme`

## S13. Dopasowanie do prototypu — rozmiar M

**Cel:** po wdrożeniu S1–S12 zebrać rozbieżności między aplikacją a szkicem i poprawić je jedną partią.
**Wejście od użytkownika:** lista rozbieżności, które mu przeszkadzają (może być krótka lista punktów lub zrzuty). Gdy jej nie ma, agent sam porównuje.
**Czytaj:** tylko pliki, których dotyczą rozbieżności (znajdź `grep -n` po klasach).
**Kroki:** (1) Zrzuty aplikacji i szkicu w tych samych warunkach (widok listy, Statystyki, motyw ciemny i jasny, 1600 px) i zestawienie różnic. (2) Poprawki rzeczy, które są **zamierzone do zbliżenia** (odstępy, rozmiary, promienie, kolory powierzchni, ikony SVG zamiast znaków tekstowych ★ ☆ ✕ tam, gdzie szkic ma SVG). (3) Różnice **zamierzone** (kolory statusów i plakietek źródeł z D6, elementy aplikacji, których szkic nie ma) zostaw i wypisz w raporcie jako takie. Nie zmieniaj logiki.
**Gotowe, gdy:** tsc/lint/Jest/build przechodzą; raport zawiera tabelę „poprawione / zamierzone różnice”; użytkownik akceptuje zrzuty.
**Commit:** `Close the remaining visual gaps against the prototype`

---

## Uwagi z sesji (dopisują agenci; nie naprawiają spoza zakresu)

- 2026-11-04: na projekcie testowym włączono Anonymous i wdrożono `firestore.rules` z `main` (otwarty dostęp), żeby agenci mogli oglądać aplikację. Produkcji to nie dotyczy. Stan wyjściowy (przed S1) potwierdzony zrzutami: lista ładuje się, 58 ogłoszeń, na telefonie (390 px) nagłówek i filtry zajmują prawie cały ekran, sidebar zamawiających jest ukryty.
