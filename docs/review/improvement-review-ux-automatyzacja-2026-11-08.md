# Improvement Review: UX i automatyzacja (2026-11-08)

Dokument spisany z sesji doradczej (tryb Improvement Review, zawężony do UX i automatyzacji). To ocena i rekomendacje, nie plan wdrożenia. Pewność: **Potwierdzone** / **Hipoteza** / **Do walidacji**.

Zakres: sprawdzono `src/components/AnalysisButton.tsx`, `functions/analysis/docsCheck/schedule.ts`, `docsCheck.ts`, `functions/tenders/refresh.ts`, `store.ts`, `src/components/tenders.tsx`. Aplikacji nie oglądano w przeglądarce, więc wnioski o wyglądzie to hipotezy. Nie czytano całego `TenderCard.tsx` ani CSS.

Powiązane: [review-projektu-2026-11-08.md](review-projektu-2026-11-08.md), [feature-discovery-2026-11-08.md](feature-discovery-2026-11-08.md).

## Executive Summary

Główny przepływ (lista → karta → status) jest dopracowany po kilku rundach UX. Największe tarcie przesunęło się na **styk automatyzacji z człowiekiem**: system sam pobiera ogłoszenia co 10 minut i sam sprawdza dostępność dokumentacji, ale ostatni krok (analiza) wymaga ręcznego klikania na każdej karcie, a nikt nie jest informowany, że pojawiło się coś nowego. Wniosek: nie dokładać ekranów, tylko domknąć pętlę „nowe ogłoszenie → dokumentacja gotowa → ocena → ktoś o tym wie".

## Weaknesses

| # | Problem | Pewność | Dowód |
|---|---|---|---|
| W1 | **Analiza jest w pełni ręczna, mimo że kroki ją poprzedzające są zautomatyzowane.** Każdy nowy przetarg IT dostaje automatycznie sprawdzanie dokumentacji, po czym ktoś musi kliknąć „Analizuj". | Potwierdzone | `docsCheck.ts:120` (`enqueueDocsCheckOnCreate`), `AnalysisButton.tsx` (`case 'analyze': return start({})`) |
| W2 | **Analiza wymaga prawdziwego konta, a aplikacja nadal działa na dostępie anonimowym.** Przy gościu przycisk jest zablokowany z podpowiedzią; login jest ukryty w menu. Większość użytkowników nie może więc użyć nowej funkcji. | Potwierdzone | `AnalysisButton.tsx` (`isRealAccount`, `ANONYMOUS_ANALYSIS_HINT`), `handoff.md` (tryb otwarty) |
| W3 | **Brak sygnału o nowych ogłoszeniach poza otwartą kartą aplikacji.** Brak `Notification`, zmiany `document.title`, wskaźnika „N nowych". Nowe ogłoszenia pojawiają się po cichu przez nasłuch Firestore. | Potwierdzone (brak w grepie po `tenders.tsx`) | `tenders.tsx` |
| W4 | **Lista może „skakać" podczas przeglądania** — nasłuch na żywo wstawia nowe karty co 10 minut, także nad tym, co użytkownik właśnie ocenia. Nie widziano mechanizmu „N nowych, kliknij, by pokazać". | Hipoteza | `subscribeToTenders` w `tenders.tsx` |
| W5 | **Brak wirtualizacji/stronicowania listy.** Przy zakresie miesięcznym to kilkanaście tysięcy dokumentów w pamięci (handoff sam to przyznaje). Przy domyślnym widoku (jeden dzień, filtr IT) problemu nie ma. | Hipoteza | brak `pagination`/`virtual`/`visibleCount` w `tenders.tsx` |
| W6 | **Cichy tryb awarii źródeł.** `scheduledRefresh` zapisuje błąd w logach, ale użytkownik widzi tylko brak nowych przetargów, nie „eZamówienia nie odpowiada od 3 godzin". Pasek „Ostatnia aktualizacja" pokazuje tylko sukces. | Hipoteza | `handoff.md` §5 „Czas ostatniej aktualizacji" |
| W7 | **Wiersz akcji na karcie rośnie z każdą funkcją**: Zobacz ogłoszenie, status dokumentacji, Analizuj/Ocena, Kopiuj (menu), Ukryj zamawiającego, plus status, etykiety, komentarze, gwiazdka. Na wąskim ekranie ryzyko przeładowania. | Hipoteza | `TenderCard.tsx`, `AnalysisButton.tsx` |
| W8 | **Sztywny harmonogram sprawdzania dokumentacji**: +1h, +2h, +4h, potem następny dzień roboczy 9:00 i 12:00, maks. 6 prób. Ogłoszenie z piątkowego wieczoru dostaje kolejną kontrolę dopiero w poniedziałek; brak adaptacji do platformy. Może dawać fałszywe „BRAK DOKUMENTÓW". | Hipoteza | `docsCheck/schedule.ts` |
| W9 | **Odczyty Firestore w `scheduledRefresh`**: ok. 90 przebiegów dziennie sprawdza istnienie wszystkich dzisiejszych ogłoszeń (`getAll` z pustą maską nadal liczy się jako odczyt). Koszt prawdopodobnie niewielki, ale niezmierzony. | Hipoteza, Do walidacji | `store.ts:17-23`, `handoff.md` |

## Quick Wins

1. **Licznik i tytuł karty przeglądarki „(5) Przetargi"** oraz belka „5 nowych — pokaż" zamiast wstawiania kart w locie (W3, W4). Nakład S, czysto frontendowe.
2. **Znacznik awarii źródła**: zapis `sourceHealth/{źródło}` (ostatni sukces, ostatni błąd) przy każdym przebiegu i pasek „eZamówienia: brak danych od 14:20" w nagłówku (W6). Nakład S.
3. **Gość przy zablokowanej analizie dostaje jedno kliknięcie „Zaloguj się"** zamiast samego tooltipa (W2). Nakład S. Lepiej: rozstrzygnąć, czy goście mają w ogóle mieć dostęp (patrz Project Review).
4. **Zmierzyć odczyty Firestore** po tygodniu (konsola → Usage) i dopiero wtedy ograniczać `saveNewTenders` (W9). Nakład S, bez kodu.
5. **Zwinąć rzadkie akcje do jednego menu „⋯"** (Kopiuj, Ukryj zamawiającego); na karcie zostawić status, etykiety, Analizuj/Ocena, komentarze (W7). Nakład S–M; Do walidacji na telefonie.

## Strategic Improvements

### S1. Automatyczna analiza z regułą, nie z przycisku (High, po pilotażu)
Zamiast usprawniać przycisk, zautomatyzować cały krok: gdy `docsCheck` potwierdzi dokumentację i minie okres ciszy (`QUIET_MINUTES`), system sam zleca analizę dla przetargów spełniających prostą regułę (np. `isIT` + CPV z wąskiej listy + zamawiający nieukryty), w ramach dziennego budżetu (`ANALYSIS_DAILY_LIMIT`). Przycisk zostaje jako ścieżka ręczna dla reszty.
Warunki:
- pilotaż potwierdzi trafność werdyktów,
- alert przy 80% zużycia budżetu (wyłącznik awaryjny już jest),
- priorytety w budżecie: najpierw nieocenione, nowsze, z wąskiej listy CPV, żeby limit nie zjadły szumowe ogłoszenia,
- świadomie ustawiony limit: domyślne 10/dzień jest za niskie wobec założenia >20 z researchu.

### S2. Kolejka jako „skrzynka odbiorcza" z jedną decyzją na raz (Medium)
Widok „następne do oceny" (jedna karta, duże przyciski; skróty J/K i 1–4 już są) zamiast przewijania listy. Z automatyczną analizą z S1 można pokazywać werdykt i wykryte pozycje od razu. **Do walidacji:** prototyp pokazać użytkowniczce na dzisiejszych danych; może woli listę.

### S3. Warstwa „zdrowia systemu" widoczna dla zespołu (Medium–High)
Jedna strona/pasek: status źródeł, ostatnie udane odświeżenie każdego, zużycie budżetu analiz (licznik `analysisBudget_*` jest już czytelny dla członków), liczba analiz oczekujących i zakończonych błędem. Rozwiązuje W6 i przygotowuje grunt pod S1. Bez tego automatyzacja działa „w ciemno".

### S4. Adaptacyjne sprawdzanie dokumentacji (Low)
Szybsze pierwsze sprawdzenie dla platform publikujących od razu (eZamówienia), wolniejsze dla pozostałych; uwzględnienie piątkowych ogłoszeń. Wartość mała, obecny harmonogram wystarcza na pilotaż.

## Prioritization

| Rekomendacja | Priorytet | Wartość (user / biznes) | Nakład | Złożoność | Ryzyko |
|---|---|---|---|---|---|
| S1. Automatyczna analiza z regułą i budżetem | **High** (po pilotażu) | Wysoka / Wysoka | M | Średnia | Średnie (koszt, błędny werdykt) |
| QW2 + S3. Zdrowie źródeł i budżetu | **High** | Wysoka / Wysoka | S–M | Niska | Niskie |
| QW1. „N nowych" + licznik w tytule | **High** | Wysoka / Średnia | S | Niska | Niskie |
| QW3. Ścieżka logowania dla gościa przy analizie | Medium | Średnia / Średnia | S | Niska | Niskie |
| QW5. Menu „⋯" na karcie | Medium | Średnia / Niska | S–M | Niska | Niskie |
| S2. Widok „następna do oceny" | Medium | Średnia / Średnia | M–L | Średnia | Średnie (może nie pasować do nawyków) |
| QW4. Pomiar odczytów | Low | Niska / Niska | S | Niska | Niskie |
| S4. Adaptacyjny harmonogram dokumentacji | Low | Niska / Niska | M | Średnia | Niskie |

Uzasadnienie pozycji High:
- **S1**: najdroższy ręczny krok jest ostatnim niezautomatyzowanym, a cała infrastruktura (wykrywanie dokumentacji, cisza, budżet, wyłącznik) już istnieje. Warunek: wiarygodny pilotaż, inaczej automatyzuje się nietrafione werdykty.
- **QW2 + S3**: bez widocznego zdrowia systemu każda dalsza automatyzacja jest ślepa, a ciche awarie nieudokumentowanych API są najbardziej prawdopodobnym problemem produkcyjnym.
- **QW1**: najtańsza zmiana, która widocznie poprawia codzienną pracę w parze (nikt nie musi odświeżać i zgadywać).

## Final Assessment

UX podstawowego triażu jest dobry i nie wymaga kolejnych poprawek. Słabsze są **brzegi automatyzacji**: moment, w którym system coś wie (nowe ogłoszenie, dokumentacja gotowa, źródło padło), a człowiek się o tym nie dowiaduje, oraz krok analizy, który wciąż wymaga ręki.

Proponowana kolejność: najpierw widoczność (nowe ogłoszenia, zdrowie źródeł, budżet), potem pilotaż jakości, na końcu automatyczne zlecanie analiz. Odwrócenie kolejności da automatyzację, której zespół nie umie ani kontrolować, ani jej ufać.
