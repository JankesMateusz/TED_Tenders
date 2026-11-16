-- Kategoria Phone (smartfony) występuje w danych raportu 2026, ale nie ma jej w arkuszu "Legenda".
-- Opis potwierdzony przez użytkownika. Sort_order 19 stawia ją na końcu listy, za kategoriami z Legendy.
-- Jeśli import już dopisał ją bez opisu, ta migracja uzupełnia opis i kolejność.

BEGIN;

INSERT INTO lob_categories (code, description, sort_order) VALUES ('Phone', 'smartfony', 19)
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

COMMIT;
