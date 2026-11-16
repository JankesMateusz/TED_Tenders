# Project Review: TED Tenders (stan na 2026-11-08, gałąź `integracja-analiza`)

Dokument spisany z sesji doradczej (tryb Project Review). To ocena, nie plan wdrożenia. Pewność twierdzeń: **Potwierdzone** (widoczne w kodzie/dokumentacji), **Hipoteza** (wnioskowanie), **Do walidacji** (wymaga sprawdzenia z użytkownikami lub danymi).

Zakres: przeczytano `docs/handoff.md`, `goals.md`, research dokumentacji, historię git (180 commitów na `main`), `functions/analysis/*`, `firestore.rules`, strukturę `src/`. Nie uruchamiano testów ani aplikacji. Nie czytano wszystkich komponentów UI ani statystyk. Nie sprawdzano kodu Tender Explorera (osobny projekt).

Powiązane: [feature-discovery-2026-11-08.md](feature-discovery-2026-11-08.md), [improvement-review-ux-automatyzacja-2026-11-08.md](improvement-review-ux-automatyzacja-2026-11-08.md).

## Executive Summary

TED Tenders to wspólna lista przetargów IT dla małego zespołu (dwie osoby). Zbiera dane z TED, eZamówień i Bazy Konkurencyjności. Zespół dodaje wspólne statusy, etykiety i komentarze. Aplikacja działa na produkcji (Firebase, React, Cloud Functions). Od niedawna rośnie pipeline automatycznej analizy dokumentacji przez Tender Explorer: resolver dokumentów, kolejka, budżet dzienny, okno oceny. Projekt jest czymś więcej niż MVP: ma dużo testów i dużo dokumentacji.

Najważniejszy wniosek: budowana jest duża infrastruktura pod funkcję, której wartości jeszcze nie zmierzono, a bramka bezpieczeństwa jest otwarta „tymczasowo" od tygodni.

## Strengths

- **Dyscyplina inżynierska** (Potwierdzone): 25 plików testowych we froncie, testy reguł, jednostkowe i integracyjne na emulatorach. Małe, opisowe commity z kodami ticketów (TT-n). Uczciwe rozróżnianie „sprawdzone typami" od „widziane w przeglądarce" w `handoff.md`.
- **Dobre decyzje produktowe**: zawężenie do triażu („wpisać / nie wpisać"), usunięcie terminów składania ofert (zespół nie startuje w przetargach), usunięcie statystyk, których nikt nie używał, filtr sektora z zasadą „ukrycie dobrego ogłoszenia kosztuje więcej niż pokazanie zbędnego".
- **Przemyślana warstwa analizy** (`functions/analysis/analysisFlow.ts`): transakcyjna ochrona przed podwójnym uruchomieniem (lease, `runId`), dzienny budżet, wyłącznik awaryjny `ANALYSIS_ENABLED` (domyślnie `false`), prywatna kolekcja na surowe wyniki, wywołania Cloud Run z tokenem ID. Czekanie na dokumentację publikowaną z opóźnieniem to realny problem domeny i rozwiązano go sensownie.
- **Ochrona danych osobowych w mapperze Bazy**: test pilnuje, że `contact_persons` nie trafia do bazy. Ryzyko prawne scrapowania opisane wprost.

## Weaknesses

1. **Otwarty dostęp bez logowania trwa dłużej niż „kilka dni"** (Potwierdzone: `firestore.rules:3-11`, `hasRole()` = `request.auth != null`, aplikacja loguje anonimowo). Każdy, kto zna adres, może czytać dane, pisać statusy i komentarze oraz wywoływać pobieranie. Nowe reguły `analyses` i licznik budżetu dziedziczą tę słabość. `requireRole` w `functions/access.ts` odrzuca sesje anonimowe dla kosztownych akcji, ale **nie potwierdzono**, że każda nowa callable (`analyzeTender`, `checkDocsNow`, `cancelAnalysisWait`, `resolveDocuments`) z niego korzysta. Do sprawdzenia przed włączeniem `ANALYSIS_ENABLED`.
2. **Rozjazd dokumentacji z kodem** (Potwierdzone): `handoff.md` nie wspomina o resolverze dokumentów, analizie, statusie dokumentacji ani kodach TT-n. „Szybki start" odsyła do gałęzi `feature/shared-tenders`. `research-dokumentacja-przetargow.md` mówi, że „w kodzie nie ma nic z tego zakresu", co jest nieprawdą.
3. **Rozproszenie gałęzi i brak integracji** (Potwierdzone): 14 lokalnych gałęzi. `integracja-analiza` jest 8 commitów przed `main` (47 plików, ok. 3500 linii). Do tego `temp/open-access` i `DevManifestTool` oznaczony jako „temporary" w panelu admina. Każdy push do `main` wdraża hosting na produkcję.
4. **Wartość analizy niezwalidowana** (Do walidacji): z dokumentów nie wynika żaden pomiar (ile analiz zleca użytkowniczka, jak często werdykt zgadza się z jej oceną, ile kosztuje analiza). Domyślny limit 10 dziennie (`config.ts`) przy założeniu „więcej niż 20 dziennie" z researchu pokazuje, że założenia nie zostały zderzone z rzeczywistością.
5. **Złożoność operacyjna jak na PoC dla dwóch osób** (Potwierdzone): ręczne wdrożenia funkcji po nazwach, osobne projekty test i prod, Cloud Tasks, dwa zadania Scheduler, usługa Cloud Run w osobnym repozytorium. Zależność od nieudokumentowanych endpointów (Baza, eZamówienia `mp-readmodels`, scrapowanie platformazakupowa.pl) oznacza, że cichy błąd po ich zmianie jest bardziej prawdopodobny niż awaria samej aplikacji. Nie znaleziono alarmu „zero nowych przetargów ze źródła X od N godzin" (Hipoteza).
6. **Duże pliki UI** (Potwierdzone): `src/components/tenders.tsx` ma 880 linii (filtry, odświeżanie, statystyki, drill-down). Obecnie utrzymywalny dzięki testom; każda nowa funkcja dokłada tu logikę.
7. **Niezałatwione sprawy z handoffu** (Potwierdzone w dokumentacji): nie wiadomo, czy klucz TED unieważniono; alert budżetowy niepotwierdzony; polityka czyszczenia obrazów w `europe-central2` prawdopodobnie nieustawiona; koszt odczytów `saveNewTenders` (ok. 90 przebiegów dziennie) niezmierzony.
8. **Dane wygasają po 30 dniach (TTL)**; analiza i etykiety dziedziczą ten czas (Potwierdzone). Dla analityka robiącego raporty dla firm wiedza zespołu przepada. Może to być świadoma decyzja, ale nie znaleziono jej uzasadnienia przy statusie „wpisane". Częściowo łagodzi to `labelSnapshots` (bez TTL, tylko statusy i metadane).

## Quick Wins

| # | Rekomendacja | Uzasadnienie |
|---|---|---|
| 1 | Zamknąć otwarty dostęp (revert + ponowne wdrożenie reguł) albo ustawić datę końcową. Jeśli goście są potrzebni: jedno wspólne konto zespołu zamiast anonimowych. | Największe realne ryzyko; ok. godzina plus wdrożenie |
| 2 | Sprawdzić `requireRole`/`requireMember` we wszystkich nowych callable | Przed włączeniem analizy; ok. 15 minut |
| 3 | Zaktualizować `handoff.md` o integrację (TT-n, nowe funkcje, konfiguracja, stan wdrożenia) i poprawić „Szybki start" | Bez tego następna sesja zaczyna od błędnych założeń |
| 4 | Zmergować (z `ANALYSIS_ENABLED=false`) lub porzucić `integracja-analiza` etapami; usunąć martwe gałęzie i `DevManifestTool` po użyciu | Mniej ryzyka scalania |
| 5 | Prosty alarm „zero nowych przetargów" (np. w `scheduledRefresh`: 0 z jednego źródła przez N przebiegów w dniu roboczym → zapis błędu i pasek w UI) | Najtańsza ochrona przed cichym zepsuciem nieudokumentowanego API |
| 6 | Ustawić alert budżetowy GCP i unieważnić klucz TED | Wymagane przed włączeniem płatnych modeli |

## Feature Opportunities (skrót; szczegóły w dokumencie Feature Discovery)

Pilotaż pomiarowy analizy, poranne powiadomienie o nieocenionych, historia zamawiających na karcie (z `labelSnapshots`), eksport zaznaczonych do raportu. Patrz [feature-discovery-2026-11-08.md](feature-discovery-2026-11-08.md).

## Strategic Improvements

- **Rozdzielić „produkt" od „infrastruktury eksperymentu".** Analiza, resolver i scrapowanie platform to osobny moduł o innym profilu ryzyka (nieudokumentowane źródła, koszt modelu, zewnętrzna usługa). Wyłączenie `ANALYSIS_ENABLED` powinno naprawdę wycinać go z UI bez wpływu na triaż. Konstrukcja idzie w tę stronę; trzeba to dokończyć i przetestować.
- **Odpowiedzieć na pytania z researchu bez odpowiedzi**: czyje jest narzędzie, czy pracodawca zezwala na zewnętrzne narzędzie, czy są wymagania co do przetwarzania danych. Decyzja „nie pytamy ministerstwa" w sprawie Bazy była świadoma, ale przy analizie dokumentacji przetargowej przez zewnętrzny model ryzyko organizacyjne jest większe niż techniczne. To nie jest porada prawna.
- **Strategia utrzymania**: minimalny runbook awarii, automatyczne wdrożenie funkcji z CI (dziś ręczne, ryzyko rozjazdu frontu i funkcji, który już raz dał błąd `functions/internal`), jawna decyzja o przechowywaniu przetargów dłużej niż 30 dni.
- **Stopniowe odchudzanie `tenders.tsx`** (logika odświeżania i filtrów do hooków), dopiero gdy zacznie spowalniać prace.

## Prioritization

| Rekomendacja | Priorytet | Wartość (user / biznes) | Nakład | Złożoność | Ryzyko |
|---|---|---|---|---|---|
| Zamknąć otwarty dostęp | **High** | Wysoka / Wysoka | S | Niska | Niskie (wymaga ponownego logowania zespołu) |
| Sprawdzić autoryzację nowych callable przed włączeniem analizy | **High** | Wysoka / Wysoka | S | Niska | Niskie |
| Pilotaż pomiarowy analizy (30–50 przetargów, zgodność z oceną ręczną) | **High** | Wysoka / Wysoka | M | Niska | Niskie |
| Aktualizacja `handoff.md`, porządek w gałęziach | Medium | Średnia / Średnia | S | Niska | Niskie |
| Alarm „zero nowych przetargów" | Medium | Wysoka / Średnia | S | Niska | Niskie |
| Alert budżetowy GCP, unieważnienie klucza TED | Medium | Średnia / Wysoka | S | Niska | Niskie |
| Poranne powiadomienie o nieocenionych | Medium | Wysoka / Średnia | M | Średnia | Średnie (nowy kanał) |
| Historia zamawiających na karcie (z `labelSnapshots`) | Medium | Średnia / Średnia | M | Średnia | Niskie |
| Eksport zaznaczonych do raportu | Low | Średnia / Średnia | S–M | Niska | Niskie |
| Automatyczne wdrożenia funkcji w CI | Low | Średnia / Niska | M | Średnia | Średnie |
| Refaktor `tenders.tsx` | Low | Niska / Niska | M | Średnia | Średnie |

Uzasadnienie pozycji High: dostęp dotyczy realnej ekspozycji danych i zaprzecza celowi z `goals.md` (zaproszone osoby). Autoryzacja callable jest warunkiem włączenia czegokolwiek płatnego. Pilotaż rozstrzyga, czy dalsze inwestowanie w analizę ma sens.

## Final Assessment

Jakość wykonania jest wysoka jak na projekt tworzony po godzinach: testy, dokumentacja decyzji i uczciwe raportowanie niewiadomych wyróżniają go na plus. Największe ryzyko to nie kod, tylko **kolejność prac**: najpierw dobudowano zaawansowaną analizę z kolejkami i budżetami, a nie zamknięto prostszych spraw (bramka dostępu, dokumentacja, weryfikacja, że ktokolwiek używa wyniku). Podstawowy triaż jest solidny i prawdopodobnie już zwraca wartość. Warstwa analizy ma potencjał oszczędzić najwięcej czasu, ale na razie jest hipotezą.

Zalecany ruch: zamknąć dostęp, zmierzyć analizę na małej próbce i dopiero na tej podstawie zdecydować, czy ją rozwijać, uprościć czy zatrzymać.
