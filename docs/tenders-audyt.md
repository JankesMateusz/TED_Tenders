# Audyt `src/components/tenders.tsx`

Data: 2026-11-12. Stan: tylko analiza, nic nie zostało zmienione.

Najdłuższy komponent w projekcie: `tenders.tsx` (880 linii, jeden komponent `Tenders`).
Drugi w kolejce: `StatisticsTab.tsx` (686 linii), osobny temat.

## Co jest w `Tenders`

| Obszar | Linie (ok.) | Zawartość |
|---|---|---|
| Odświeżanie danych | 38–79, 95–101, 181–234 | stałe błędów, `refreshDayWithRetry`, `refresh`, postęp, `lastRefreshAt` |
| Wczytywanie z bazy | 85–95, 156–179 | `tenders`, `isLoading`, `loadError`, subskrypcja |
| Stan filtrów | 112–125, 284–298, 318–357, 396–454 | 9 `useState`, zapis do localStorage, `filterOptions`, chipy, czyszczenie |
| Listy pochodne | 307–394 | zapisane/niezapisane, przefiltrowane, opcje panelu bocznego, `facetCounts` |
| Skróty klawiszowe i aktywna karta | 126–134, 485–567 | trzy `useEffect` z `keydown` i kliknięciem |
| Statystyki | 586–678 | porównanie okresów, trend, wykres godzinowy, budowa `comparison` |
| JSX | 680–877 | nagłówek, zakładki, lista, komunikaty, szkielet ładowania |

## Proponowany podział

Najpierw hooki (czyste przeniesienie stanu, małe ryzyko), potem komponenty widoku.

1. **`useTendersRefresh(startDay, endDay, useDateRange, todayDay)`** w `hooks/`. Zwraca `{ isRefreshing, refreshError, refreshProgress, refresh, lastRefreshAt }`. Przejmuje `refreshDayWithRetry` i stałe komunikatów (ok. 110 linii). `refreshDayWithRetry` jest przekazywane do `usePreviousPeriod`, więc powinno leżeć w `utils/` (np. `refreshWithRetry.ts`).
2. **`useTendersSubscription(startDay, endDay)`** zwraca `{ tenders, isLoading, loadError }` (ok. 30 linii).
3. **`useTenderFilters(uid)`** zwraca cały stan filtrów oraz `filterOptions`, `activeChips`, `handleRemoveChip`, `handleClearFilters`, `handleDrillDown` i zapis do localStorage (ok. 150 linii). Największy kawałek, najlepiej oddziela logikę od widoku.
4. **`useCardShortcuts({ displayedTenders, activeTab, ... })`** zwraca `{ activeTenderId, onActivate, searchInputRef }`. Obejmuje trzy efekty z klawiaturą, `previousIdsRef` i kliknięcie poza kartą (ok. 100 linii).
5. **`useStatisticsData(...)`** zwraca `{ statistics, comparison, trend, hourly }` (ok. 100 linii). Warto uruchamiać tylko dla zakładki statystyk, więc można go przenieść do `StatisticsTab` albo wrappera `StatisticsView`.
6. **`TendersList`**: nagłówek kolejki (`queueHeader`), szkielet ładowania, komunikaty i `<ul>` z kartami. Można wydzielić `TendersSkeleton` i `TendersMessages` (cztery bloki `role="alert"` mają ten sam wzorzec). Ten blok ma też zepsute wcięcia (linie 770–852).
7. Opcjonalnie `TabsBar` (ok. 20 linii, pewnie nie warto).

Docelowo `Tenders` składałby hooki i trzy komponenty: ok. 150–200 linii.

## Drobne uwagi przy okazji

- `tendersCountBySource` (linie 569–584) to stan liczony w `useEffect`; powinno być `useMemo` (dziś dodatkowy render przy każdej zmianie listy).
- Wzorzec `applyStatisticsFilters(list.filter(t => !isFavorite(t.id)))` powtarza się 4 razy (linie 603, 615, 626, 643). Wystarczy jedna funkcja pomocnicza.
- Wzorzec toggle w tablicy (`includes ? filter : [...prev, x]`) występuje 5 razy. Helper `toggleInArray`.
- Martwe komentarze: „expanded state for CPV cards…” (linia 122) i „Ctrl+E export was removed” (linia 502).
- Dwa osobne `keydown` na `window` (wyszukiwarka i skróty oceny): można połączyć w `useKeyboardShortcuts`.

## Kolejność i ryzyko

1. Najpierw #1, #2 i #6: najbardziej niezależne, nie ruszają filtrów.
2. Potem #4.
3. Na końcu #3 i #5 (najwięcej powiązań, `applyStatisticsFilters` używane w kilku miejscach).
4. Przy okazji `tendersCountBySource` → `useMemo`.

Testy: w `src/` są testy czystych utili, ale nie ma testu samego `Tenders`. Refaktor opieramy więc na `tsc` i ręcznym przeklikaniu. Robić małymi krokami, jeden hook na commit.
