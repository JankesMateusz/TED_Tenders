# Backend i baza danych: Firebase teraz, własny backend później

Stan na 2026-11-04. Notatka decyzyjna; nic nie zostało zaimplementowane.

## Kontekst

TED_Tenders działa na Firebase (Firestore, Auth, Functions). Po ewentualnej integracji z Tender Explorer (analizy dokumentacji, listy pozycji sprzętu i oprogramowania, sektor zamawiającego z Bazy Konkurencyjności) dane staną się relacyjne. Pytanie: czy przejść na własny backend z relacyjną bazą.

## Ocena

**Firestore wystarcza** dla obecnego zakresu: lista przetargów, wspólne statusy, gwiazdki per użytkownik. Daje synchronizację na żywo, Firebase Auth i praktycznie zero utrzymania.

**Firestore zaczyna przeszkadzać**, gdy dane to przetarg → analizy → pozycje, zamawiający → ogłoszenia, użytkownik → statusy. Brakuje joinów, agregacje są ograniczone, wyszukiwanie tekstowe trzeba dobudować osobno, a złożone filtry wymagają indeksów. Raporty przekrojowe (np. "przetargi na serwery z ostatnich 3 miesięcy") będą uciążliwe. Tender Explorer ma już SQLite, więc jego dane i tak są relacyjne.

**Koszt własnego backendu:** utrzymanie (kopie zapasowe, aktualizacje, monitoring, migracje schematu); przeniesienie logiki z reguł Firestore (role, dzienne limity) do kodu; utrata synchronizacji na żywo, jeśli nie zostanie dobudowana; zarządzany Postgres zwykle nie mieści się w darmowym planie (limity darmowych warstw dostawców typu Neon czy Supabase należy sprawdzić przed decyzją, nie były weryfikowane).

## Rekomendowane podejście (pośrednie)

1. **Teraz:** zostać na Firebase dla listy, statusów i gwiazdek.
2. **Wyniki analiz** (przetargi, analizy, pozycje, zamawiający) zapisywać od początku w schemacie relacyjnym, zgodnym z tym, co ma Tender Explorer. Dostęp do danych trzymać za cienką warstwą (repozytorium), żeby zmiana magazynu nie ruszała reszty kodu.
3. **Usługa na Cloud Run** budowana do pipeline'u naturalnie staje się własnym backendem z Postgresem. Firestore zostaje wtedy tylko do danych "na żywo". Firebase Auth można zachować nawet po przeniesieniu reszty.
4. **Pełne przejście** na własny backend dopiero przy realnym bodźcu (niżej).

## Bodźce uzasadniające własny backend

- Pracodawca finansuje projekt, więc znika ograniczenie kosztowe.
- Potrzebne są zapytania i raporty przekrojowe po pozycjach z analiz.
- Liczba użytkowników lub przetargów rośnie na tyle, że indeksy i limity Firestore przeszkadzają.
- Potrzebne jest przeszukiwanie pełnego tekstu dokumentacji.

## Szkic schematu relacyjnego (do doprecyzowania)

- `tenders`: id, źródło (TED/eZamówienia/Baza), tytuł, termin, link, CPV, zamawiający.
- `advertisers`: NIP, nazwa, sektor (publiczny/komunalny/NGO/prywatny/nieznany), źródło klasyfikacji (auto/ręczne).
- `analyses`: id, tender_id, werdykt (WPISAĆ/SPRAWDŹ/ODPUŚĆ), model, data, koszt.
- `items`: analysis_id, kategoria (sprzęt/oprogramowanie), nazwa, ilość, parametry.
- Statusy i gwiazdki: na razie w Firestore, przeniesienie przy pełnej migracji.

## Powiązane

`research-baza-konkurencyjnosci-v2.md` (sekcja 13, sektor zamawiającego), `research-dokumentacja-przetargow.md` (architektura hostingu).
