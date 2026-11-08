# Baza zamówień (PostgreSQL)

Schemat modułu zamówień (POC). Opis założeń jest w nagłówku `migrations/0001_init.sql`.

## Struktura

- `migrations/NNNN_nazwa.sql`: migracje stosowane kolejno, każda dokładnie raz. Istniejących plików nie edytujemy po wdrożeniu, zmiany idą w nowej migracji.
- `tests/NNNN_*.test.sql`: testy w czystym SQL. Skrypt działa w transakcji, którą na końcu wycofuje, i przerywa się błędem przy pierwszym nieudanym sprawdzeniu. Na końcu zwraca liczbę zaliczonych sprawdzeń.

## Uruchomienie lokalne (Docker)

```bash
docker run --rm -d --name tenders-pg -e POSTGRES_PASSWORD=dev -p 5433:5432 postgres:17
URL="postgresql://postgres:dev@localhost:5433/postgres"
for f in db/migrations/0001_init.sql db/migrations/0002_seed_dictionaries.sql db/tests/0002_seed.test.sql db/tests/0001_init.test.sql; do
  psql "$URL" -v ON_ERROR_STOP=1 -q -f "$f" || break
done
docker stop tenders-pg
```

Test `0002_seed` sprawdza słowniki, więc uruchamiamy go przed `0001_init.test`, który dopisuje własne dane (w transakcji wycofywanej na końcu).

Bez `psql` na hoście: `docker exec -i tenders-pg psql -U postgres -v ON_ERROR_STOP=1 < db/migrations/0001_init.sql`.

Wymagane rozszerzenie `pg_trgm` jest w standardowym obrazie Postgresa oraz w Neon i Supabase.

## Konwencje

- **Usuwanie jest miękkie** (`deleted_at`). Klucze obce to `ON DELETE RESTRICT`, więc fizyczne usunięcie wiersza z powiązaniami jest zablokowane przez bazę. Zapytania i widoki pomijają wiersze z `deleted_at`.
- **Numery nadają funkcje** `next_mdp_number(rok)` i `next_position_number(zamówienie)`. Nie używamy MAX+1. Po imporcie z numerami z zewnątrz wywołujemy `sync_counters()`.
- **Autor zmiany**: aplikacja ustawia na czas transakcji `SELECT set_config('app.user_id', '<uid>', true);`. Wyzwalacze zapisują zmiany w `audit_log`.
- **Optymistyczna blokada**: `UPDATE ... WHERE id = $1 AND version = $2`, a wersja rośnie automatycznie.
- **Klucze deduplikacji** (`buyers.dedupe_key`, `winners.name_key`, `vendors.name_key`) liczy aplikacja z nazwy po normalizacji. Ta sama funkcja normalizująca musi być używana w imporcie i w formularzach.
- **Słowniki**: `lob_categories`, `account_types` i `position_statuses` są wypełnione z arkusza „Legenda" (migracja 0002). `budget_brackets`, `acquisition_forms`, `os_options` i `office_options` wypełnia import z danych, potem administrator. `order_statuses` zawiera tylko `open`, pozostałe wartości do ustalenia.

## Import raportu MDP (xlsx)

Narzędzia w `db/import/`, bez zależności npm (Node 24). Plik raportu i wygenerowany skrypt SQL zawierają dane osobowe, więc trzymamy je w `docs/App/` (ignorowane przez git).

```bash
# 1. Suchy przebieg: tylko raport (zamawiający po deduplikacji, kontakty, odrzucone wartości...)
node db/import/importMdpReport.mjs docs/App/MDP_Raport_format_2026.xlsx

# 2. Generowanie skryptu SQL i załadowanie do pustej bazy (jedna transakcja; przerywa się, jeśli są już zamówienia)
node db/import/importMdpReport.mjs docs/App/MDP_Raport_format_2026.xlsx --sql docs/App/import_mdp_2026.sql
docker exec -i tenders-pg psql -U postgres -v ON_ERROR_STOP=1 -q < docs/App/import_mdp_2026.sql

# 3. Test w obie strony: widok v_report_flat kontra oryginalny Excel (kolumna po kolumnie)
docker exec tenders-pg psql -U postgres -At -c "select json_agg(t) from v_report_flat t" \
  | node db/import/verifyImport.mjs docs/App/MDP_Raport_format_2026.xlsx

# Testy jednostkowe normalizacji
node --test db/import/normalize.test.mjs
```

Zasady importu:
- **Bez przeliczeń.** Wartość z kolumny `Tender / part value` trafia do `positions.part_value` bez zmian. `orders.value_total` i `parts_count` zostają puste do ustalenia reguły.
- **Zamawiający** są deduplikowani po kluczu nazwa + kod pocztowy + ulica (po normalizacji: wielkość liter, interpunkcja, diakrytyki, przedrostki ulic). Nazwy współdzielone przez kilka jednostek nie są scalane automatycznie, raport pokazuje ich liczbę do przeglądu. Przy sprzecznych wartościach wybierana jest najczęstsza.
- **Kontakty** są deduplikowane w obrębie zamawiającego po (imię i nazwisko, e-mail).
- **Odrzucone wartości** (NULL, z liczbą w raporcie): daty spoza zakresu, wartość nieliczbowa w polach liczbowych.
- **Wszystkie zamówienia dostają status `open`**, bo raport nie zawiera statusu zamówienia.
- Wyzwalacze dziennika zmian są na czas importu wyłączone. Powstaje jeden wpis zbiorczy (`import`) z liczbami wierszy.
- Normalizacja z `db/import/normalize.mjs` jest wzorcem dla formularzy aplikacji (ten sam klucz dla wpisu ręcznego i z importu).
