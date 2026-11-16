-- Testy schematu z 0001_init.sql. Uruchamiać na pustej bazie po zastosowaniu migracji.
-- Całość jest w transakcji, która na końcu się wycofuje, więc baza zostaje czysta.
-- Pierwszy nieudany test przerywa skrypt błędem z opisem.

BEGIN;

-- Sprawdza, że polecenie kończy się błędem o podanym kodzie SQLSTATE (np. 23503 = naruszenie klucza obcego).
-- Można podać kilka kodów po '|': blokada ON DELETE RESTRICT zgłasza 23001 lub 23503 zależnie od wersji Postgresa.
CREATE FUNCTION pg_temp.expect_error(stmt text, expected_code text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    got_expected boolean := false;
BEGIN
    BEGIN
        EXECUTE stmt;
    EXCEPTION WHEN OTHERS THEN
        IF SQLSTATE = ANY (string_to_array(expected_code, '|')) THEN
            got_expected := true;
        ELSE
            RAISE EXCEPTION 'oczekiwano %, a wystąpił % (%) dla: %', expected_code, SQLSTATE, SQLERRM, stmt;
        END IF;
    END;
    IF NOT got_expected THEN
        RAISE EXCEPTION 'oczekiwano błędu % dla: %', expected_code, stmt;
    END IF;
END;
$$;

CREATE TEMP TABLE test_results (label text NOT NULL);

CREATE FUNCTION pg_temp.assert_true(cond boolean, label text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    IF cond IS NOT TRUE THEN
        RAISE EXCEPTION 'TEST NIEUDANY: %', label;
    END IF;
    INSERT INTO pg_temp.test_results VALUES (label);
END;
$$;

-- Dane wyjściowe
INSERT INTO lob_categories (code) VALUES ('MFP'), ('SRV') ON CONFLICT DO NOTHING;
INSERT INTO account_types (code) VALUES ('Local govt') ON CONFLICT DO NOTHING;
INSERT INTO buyers (name, dedupe_key, zip_code, town, province) VALUES
    ('Urząd A', 'urzad a|70-421|pilsudskiego 40', '70-421', 'Szczecin', 'zachodniopomorskie'),
    ('Szkoła B', 'szkola b|63-304|czermin 47', '63-304', 'Czermin', 'wielkopolskie');
INSERT INTO buyer_contacts (buyer_id, full_name, email)
    SELECT id, 'Kontakt ' || name, lower(left(name, 1)) || '@example.test' FROM buyers;

-- 1. Kontakt musi należeć do zamawiającego zamówienia ------------------------------------------------
INSERT INTO orders (year, mdp_number, registered_on, buyer_id, contact_id)
    SELECT 2026, 1, DATE '2026-11-09', b.id, c.id
      FROM buyers b JOIN buyer_contacts c ON c.buyer_id = b.id WHERE b.name = 'Urząd A';

SELECT pg_temp.expect_error(
    $q$INSERT INTO orders (year, mdp_number, registered_on, buyer_id, contact_id)
         SELECT 2026, 2, DATE '2026-11-09', a.id, c.id
           FROM buyers a, buyer_contacts c JOIN buyers b ON b.id = c.buyer_id
          WHERE a.name = 'Urząd A' AND b.name = 'Szkoła B'$q$, '23503');
SELECT pg_temp.assert_true(true, 'kontakt innego zamawiającego jest odrzucany');

INSERT INTO orders (year, mdp_number, registered_on, buyer_id)
    SELECT 2026, 2, DATE '2026-11-09', id FROM buyers WHERE name = 'Szkoła B';
SELECT pg_temp.assert_true(true, 'zamówienie bez kontaktu jest dozwolone');

-- 2. Unikalność i liczniki ---------------------------------------------------------------------------
SELECT pg_temp.expect_error(
    $q$INSERT INTO orders (year, mdp_number, registered_on, buyer_id)
         SELECT 2026, 1, DATE '2026-11-09', id FROM buyers LIMIT 1$q$, '23505');
SELECT pg_temp.assert_true(true, 'duplikat (rok, MDP) jest odrzucany');

SELECT pg_temp.assert_true(next_mdp_number(2030::smallint) = 1 AND next_mdp_number(2030::smallint) = 2,
    'licznik MDP nadaje kolejne numery');

SELECT sync_counters();
SELECT pg_temp.assert_true(next_mdp_number(2026::smallint) = 3, 'sync_counters ustawia licznik na maksimum z danych');

-- 3. Pozycje, miękkie usuwanie, brak użycia numeru ponownie -----------------------------------------
INSERT INTO positions (order_id, position_number, lob_category, quantity, legacy_id)
    SELECT id, next_position_number(id), 'MFP', 41, '260001001' FROM orders WHERE mdp_number = 1;
INSERT INTO positions (order_id, position_number, lob_category, quantity)
    SELECT id, next_position_number(id), 'SRV', 6 FROM orders WHERE mdp_number = 1;
UPDATE positions SET deleted_at = now() WHERE position_number = 1;
SELECT pg_temp.assert_true(
    (SELECT next_position_number(id) FROM orders WHERE mdp_number = 1) = 3,
    'numer usuniętej pozycji nie jest nadawany ponownie');

SELECT pg_temp.expect_error($q$DELETE FROM orders WHERE mdp_number = 1$q$, '23001|23503');
SELECT pg_temp.assert_true(true, 'fizyczne usunięcie zamówienia z pozycjami jest zablokowane');
SELECT pg_temp.expect_error($q$DELETE FROM buyers WHERE name = 'Urząd A'$q$, '23001|23503');
SELECT pg_temp.assert_true(true, 'fizyczne usunięcie zamawiającego z zamówieniami jest zablokowane');

-- 4. Walidacja danych ---------------------------------------------------------------------------------
SELECT pg_temp.expect_error(
    $q$UPDATE positions SET award_letter_date = DATE '3315-06-01' WHERE position_number = 2$q$, '23514');
SELECT pg_temp.expect_error($q$UPDATE positions SET quantity = -1 WHERE position_number = 2$q$, '23514');
SELECT pg_temp.expect_error($q$UPDATE positions SET attributes = '[1]'::jsonb WHERE position_number = 2$q$, '23514');
SELECT pg_temp.expect_error($q$UPDATE positions SET status = 'Nieznany' WHERE position_number = 2$q$, '23503');
SELECT pg_temp.expect_error($q$UPDATE buyers SET nip = '123' WHERE name = 'Urząd A'$q$, '23514');
SELECT pg_temp.assert_true(true, 'walidacje: data listu, ilość, attributes, status, NIP');

-- 5. Duplikaty zamawiających i scalanie ---------------------------------------------------------------
SELECT pg_temp.expect_error(
    $q$INSERT INTO buyers (name, dedupe_key) VALUES ('Urząd A (kopia)', 'urzad a|70-421|pilsudskiego 40')$q$, '23505');
INSERT INTO buyers (name, dedupe_key, merged_into_id)
    SELECT 'Urząd A (stary zapis)', 'urzad a|70-421|pilsudskiego 40', id FROM buyers WHERE name = 'Urząd A';
SELECT pg_temp.assert_true(true, 'duplikat klucza zamawiającego jest odrzucany, rekord scalony może go zachować');

-- 6. Dziennik zmian ------------------------------------------------------------------------------------
SELECT set_config('app.user_id', 'uid-test', true);
UPDATE orders SET comments = 'nowy komentarz' WHERE mdp_number = 1;
SELECT pg_temp.assert_true(
    (SELECT actor = 'uid-test' AND changes -> 'comments' ->> 'new' = 'nowy komentarz'
       FROM audit_log WHERE entity = 'orders' AND action = 'UPDATE' ORDER BY id DESC LIMIT 1),
    'audit_log zapisuje autora i zmienione pole');

CREATE TEMP TABLE audit_before AS SELECT count(*) AS n FROM audit_log;
UPDATE orders SET comments = 'nowy komentarz' WHERE mdp_number = 1;
SELECT pg_temp.assert_true((SELECT count(*) FROM audit_log) = (SELECT n FROM audit_before), 'zmiana bez efektu nie tworzy wpisu w dzienniku');

SELECT pg_temp.assert_true((SELECT version FROM orders WHERE mdp_number = 1) = 3, 'version rośnie przy każdej zmianie (2 UPDATE + start = 3)');

SELECT pg_temp.expect_error($q$UPDATE audit_log SET actor = 'x'$q$, 'P0001');
SELECT pg_temp.expect_error($q$DELETE FROM audit_log$q$, 'P0001');
SELECT pg_temp.assert_true(true, 'audit_log jest tylko do dopisywania');

-- 7. Widoki ----------------------------------------------------------------------------------------------
UPDATE orders SET publication_date = DATE '2025-12-23', bid_date = DATE '2026-01-07', value_total = 100000, parts_count = 4,
                  financing_eu = true, account_type = 'Local govt'
 WHERE mdp_number = 1;
SELECT pg_temp.assert_true(
    (SELECT order_week = 'ww46' AND publication_quarter = 'Q4''25' AND avg_part_value = 25000.00 AND positions_count = 1
       FROM v_orders WHERE mdp_number = 1),
    'v_orders: tydzień ISO z rejestracji, kwartał z publikacji, średnia wartość części, liczba aktywnych pozycji');

SELECT pg_temp.assert_true(
    (SELECT count(*) FROM v_report_flat WHERE "MDP ID" = '0001') = 1,
    'v_report_flat pomija usunięte pozycje');
SELECT pg_temp.assert_true(
    (SELECT "ID" = position_code(2026::smallint, 1, 2) AND "Financing EU" = 'yes' AND "Financing non-EU" = 'no'
            AND "Tender / part value" = 25000.00 AND "PinC" = 'Kontakt Urząd A' AND "Qtty" = 6
       FROM v_report_flat WHERE "MDP ID" = '0001'),
    'v_report_flat: kolumny w układzie raportu Excel');
SELECT pg_temp.assert_true(position_code(2026::smallint, 1, 1) = '260001001', 'position_code odtwarza ID ze starej aplikacji');

-- Zamówienie usunięte miękko znika z widoków, ale zostaje w tabeli
UPDATE orders SET deleted_at = now() WHERE mdp_number = 2;
SELECT pg_temp.assert_true(
    NOT EXISTS (SELECT 1 FROM v_orders WHERE mdp_number = 2) AND EXISTS (SELECT 1 FROM orders WHERE mdp_number = 2),
    'miękko usunięte zamówienie znika z widoku, ale zostaje w bazie');

SELECT count(*) AS passed_checks FROM pg_temp.test_results;

ROLLBACK;
