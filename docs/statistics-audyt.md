# Audyt `src/components/StatisticsTab.tsx`

Data: 2026-11-12. Stan: tylko analiza, nic nie zostało zmienione.

Drugi najdłuższy komponent w projekcie: `StatisticsTab.tsx` (686 linii, jeden komponent `StatisticsTab`)
plus `StatisticsTab.module.css` (891 linii). Powiązany audyt: `tenders-audyt.md` (rodzic, który dostarcza
dane do tego komponentu).

## Co jest w pliku

| Obszar | Linie (ok.) | Zawartość |
|---|---|---|
| Typy i stałe | 17–93 | `parseStatisticDate`, `StatisticsDrillDown`, `StatisticsComparison`, `HourlyChartData`, `ShareBar`, `formatCount`, stałe wykresów |
| Logika porównania | 105–119 | `renderDelta` (wartość „poprzednio” albo różnica) |
| Stan wykresu godzinowego | 120–164 | wybór dnia/średniej, 2 efekty synchronizujące, `hoveredHour`, `visibleHours`, sumy |
| Dane pozostałych wykresów | 165–179 | maksimum trendu, `dailyEntries`, `maxDailyValue` |
| Komunikaty (filtry, porównanie) | 183–212 | `filterNotice`, `comparisonNotice` (4 stany) |
| Pasek postępu oceniania | 214–231 | |
| Karty z liczbami | 233–254 | razem + 5 statusów z deltą |
| Źródło i typ zamówienia | 256–308 | dwie sekcje z `ShareBar` |
| Wykres godzinowy | 310–425 | podsumowanie, wiersze poziome, wykres pionowy, tooltip (ok. 115 linii JSX) |
| Trend 14 dni | 427–456 | |
| Co jest zamawiane (kategorie CPV) | 458–480 | lista |
| Kto ocenia | 482–500 | lista |
| Porównanie źródeł w czasie | 502–609 | wykres słupkowy ze stosem, tooltip, legenda (ok. 105 linii JSX) |
| Top 10 CPV | 611–633 | lista |
| Top 10 miast i powtarzający się zamawiający | 635–682 | dwie listy |

Komponent jest za duży głównie przez dwa wykresy (godzinowy i dzienny: razem ok. 220 linii JSX) oraz
sześć niemal identycznych list.

## Proponowany podział

Nowy katalog `src/components/statistics/`, każdy kawałek z własnym kawałkiem CSS (dziś jeden plik 891 linii).

1. **`RankedList`**: wspólna lista „nazwa + licznik (+ numer, + `ShareBar`, + opcjonalny klik)”. Zastępuje
   6 powtórzeń: kategorie CPV, „Kto ocenia”, Top 10 CPV, Top 10 miast, powtarzający się zamawiający
   (ok. 110 linii mniej, najlepszy stosunek zysku do ryzyka). Razem z `ShareBar` do pliku wspólnego.
2. **`HourlyActivityChart`** + hook **`useHourlyChartState`**: cała sekcja godzinowa razem ze stanem
   wyboru dnia i `hoveredHour` (ok. 55 linii logiki + 115 JSX). Hover przestaje renderować całe statystyki.
3. **`DailySourcesChart`**: wykres „Porównanie źródeł w czasie” razem z `hoveredDay`, legendą i tooltipem
   (ok. 105 linii JSX).
4. **`RecentTrendChart`**: trend z ostatnich dni (ok. 30 linii, prosty).
5. **`StatisticsNotices`**: `filterNotice` i `comparisonNotice` (ok. 30 linii).
6. **`SummaryCards`** (+ **`DeltaBadge`** zamiast `renderDelta` jako funkcji w komponencie): karty
   z liczbami, pasek postępu, sekcje „źródło” i „typ zamówienia”.
7. **Wspólne**: `ChartGrid` (linie siatki `[...Array(5)]` powtórzone w obu wykresach), stała
   `CHART_MAX_HEIGHT = 180` (dziś `maxChartHeight` zdefiniowane dwa razy w pętlach).
8. **Typy** `StatisticsDrillDown`, `StatisticsComparison`, `HourlyChartData` przenieść do `types/` albo
   `statistics/types.ts`. Dziś `Tenders` importuje typy z pliku komponentu (zależność rodzic → dziecko po typach).

Po podziale `StatisticsTab` składa sekcje: ok. 100–120 linii.

## Uwagi i potencjalne błędy przy okazji

- **Dwa wykresy godzinowe naraz.** Linie 354–367 (wiersze poziome) i 368–423 (wykres pionowy, klasa
  `hourlyChartVertical`) są renderowane jednocześnie. Zapewne CSS przełącza je w zależności od szerokości
  ekranu; do sprawdzenia w `StatisticsTab.module.css`. Jeśli tak, oba liczą te same dane i mają osobne
  tooltipy, czyli duplikacja logiki.
- **Hover renderuje całość.** `hoveredHour` i `hoveredDay` są stanem na poziomie całego komponentu, więc
  każdy ruch myszy nad słupkiem renderuje wszystkie sekcje. Po wydzieleniu wykresów problem znika sam.
- **Opis sekcji niezgodny z danymi.** Podtytuł „Porównanie źródeł w czasie” (linia 507) mówi o TED
  i eZamówieniach, a wykres i legenda pokazują też Bazę Konkurencyjności.
- **Duplikat parsera dat.** `parseStatisticDate` (linie 17–28) robi to samo co `parseDate` z `utils/dateUtils`
  (używane w `tenders.tsx` na tym samym formacie DD-MM-RRRR). Do sprawdzenia, czy zachowanie przy
  „Brak daty” / „Błąd formatu daty” jest takie samo, zanim się je połączy.
- **Własna odmiana polska.** Linia 403 ma ręcznie wpisaną odmianę „ogłoszenie/ogłoszenia/ogłoszeń”, a w
  projekcie jest `utils/pluralPl` (używane dla „przetargów”). Warto dodać tam wariant dla ogłoszeń.
- **Skomplikowana synchronizacja wyboru dnia** (linie 130–147): dwa `useState` (`selectedHourlyDate`,
  `hasPickedHourlyDate`) i dwa `useEffect`, w tym jeden wołający `onSelectDay`. Stan wyboru dnia jest
  dodatkowo duplikowany w rodzicu (`hourlyDay` w `Tenders`). Wydzielenie do `useHourlyChartState` jest
  dobrym momentem, by uprościć to do jednego właściciela stanu.
- **Dzielenie przez zero w tooltipie.** Linia 405: `count / totalHourlyValue` jest bezpieczne tylko dzięki
  warunkowi `count > 0` (wtedy suma > 0). Przy wydzielaniu nie gubić tego warunku.
- **Style inline** w tooltipie dziennym (linia 560) i kolory serii przez `var(--series-*)` w `style`: do
  przeniesienia do CSS modułu.
- **Mieszanie języków w komentarzach** („Daily distribution by source”, „Show only if multiple days”);
  zmienna `hasDailyData` oznacza „więcej niż jeden dzień”, nazwa sugeruje coś innego.
- **CSS** (`StatisticsTab.module.css`, 891 linii) rozbić razem z komponentami; wspólne rzeczy
  (`section`, `chartSubtitle`, `list*`, `gridLine`) zostają we wspólnym module.

## Kolejność i ryzyko

1. **`RankedList` + `ShareBar` do pliku wspólnego**: czyste przeniesienie, bez logiki, zysk największy.
2. **`RecentTrendChart` i `StatisticsNotices`**: proste, bezstanowe.
3. **`DailySourcesChart`**: jeden stan (`hoveredDay`), przy okazji poprawić podtytuł.
4. **`HourlyActivityChart` + `useHourlyChartState`**: najwięcej ryzyka (efekty, kontrakt `onSelectDay`
   z rodzicem). Robić na końcu i najlepiej razem z krokiem #5 z audytu `Tenders` (`useStatisticsData`),
   żeby uprościć dwustronne trzymanie wybranego dnia.
5. Typy do osobnego pliku, podział CSS.

Testy: logika liczenia jest pokryta (`calculateStatistics`, `comparison`, `hourlyAverage`, `recentTrend`
mają testy), ale same komponenty widoku nie mają testów. Refaktor weryfikować przez `tsc`, istniejące testy
utili i ręczne przeklikanie zakładki Statystyki (wybór dnia/średniej, tryb zakresu dat, porównanie
okresów, hover na wykresach). Jeden kawałek na commit.

## Stan wykonania (2026-11-12)

Refaktor wykonany na gałęzi `refactoring`, jeden kawałek na commit. `StatisticsTab.tsx`: 686 → 124 linie.
Nowe pliki w `src/components/statistics/`, razem z testami renderowania (`@testing-library/react`).

| Krok audytu | Commit | Wynik |
|---|---|---|
| #1 `RankedList` + `ShareBar` | `c02fbc6` | 5 powtórzeń list w jednym komponencie |
| #4 `RecentTrendChart`, #5 `StatisticsNotices` | `996c06a` | proste sekcje bezstanowe |
| #3 `DailySourcesChart`, #7 `ChartGrid` | `f6964fa` | własny `hoveredDay`, stała `CHART_MAX_HEIGHT`, style tooltipu w CSS, poprawiony podtytuł |
| #2 `HourlyActivityChart` + `useHourlyChartState` | `e65690e` | wybór dnia i `hoveredHour` w komponencie wykresu |
| #8 typy | `5735b14` | `statistics/types.ts`; `Tenders` i hooki nie importują już typów z pliku komponentu |
| #6 `SummaryCards` + `DeltaBadge` | `ed29011` | karty, pasek postępu, źródło i typ zamówienia |
| duplikat parsera dat | `014ddd4` | `parseStatisticDate` zastąpiony `parseDate` |

Odstępstwa od audytu i rzeczy, które zostały:

- **Kontrakt `onSelectDay` zostaje.** Wybrany dzień nadal jest trzymany w dwóch miejscach (`useHourlyChartState`
  w komponencie i `hourlyDay` w `useStatisticsData`). Uproszczenie do jednego właściciela zmieniłoby sposób
  doczytywania dnia spoza zakresu, więc zostawiłem je na osobną decyzję.
- **`HourlyActivityChart` jest zawsze zamontowany** i sam zwraca `null` bez danych. Dzięki temu wybór dnia
  przetrwa chwilowy brak danych, jak wcześniej.
- **Dwa warianty wykresu godzinowego** (wiersze i słupki) są nadal renderowane jednocześnie. CSS (`@media`,
  próg 768 px) ukrywa jeden z nich, więc to celowe, ale oba liczą z tych samych danych.
- **Odmiana „ogłoszenie”** w tooltipie korzysta teraz z `pluralizeTenders`; stary kod źle odmieniał np. 22.
- **Usunięte martwe style:** `statusStats`, `statusItem`, `statusLabel`, `statusValue` i odpowiedniki `deadline*`
  nie były używane przez żaden komponent.
- **Podział `StatisticsTab.module.css` (ok. 880 linii) nie został wykonany.** Wszystkie nowe komponenty
  importują wspólny moduł. Podział na pliki per komponent jest mechaniczny, ale bez przeglądarki nie da się go
  sprawdzić wizualnie, a `tsc` nie wykrywa brakujących klas CSS.

Weryfikacja: `tsc`, lint zmienionych plików, 33 zestawy testów (244 testy) i `npm run build`. Zakładki Statystyki
nie klikałem w przeglądarce.
