-- Testy słowników z 0002 i 0003 (seed) oraz statusów i województw z 0001.
-- Uruchamiać na bazie po migracjach, przed testami modyfikującymi dane lub w osobnej bazie.
DO $$
BEGIN
    ASSERT (SELECT count(*) FROM account_types) = 9, 'typy kont: oczekiwano 9';
    ASSERT (SELECT count(*) FROM lob_categories) = 19, 'kategorie LoB: oczekiwano 19 (18 z Legendy + Phone)';
    ASSERT (SELECT description FROM lob_categories WHERE code = 'Phone') = 'smartfony', 'opis kategorii Phone';
    ASSERT (SELECT count(*) FROM position_statuses) = 4, 'statusy pozycji: oczekiwano 4';
    ASSERT (SELECT label FROM position_statuses WHERE code = 'Refuse') = 'Odmowa', 'opis statusu Refuse';
    ASSERT (SELECT count(*) FROM provinces) = 16, 'województwa: oczekiwano 16';
    ASSERT (SELECT count(*) FROM order_statuses WHERE code = 'open') = 1, 'status zamówienia open';
END;
$$;
