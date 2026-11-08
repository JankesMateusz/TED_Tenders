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
