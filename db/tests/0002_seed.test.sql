-- Testy słowników z 0002_seed_dictionaries.sql oraz statusów i województw z 0001.
-- Uruchamiać na bazie po migracjach, przed testami modyfikującymi dane lub w osobnej bazie.
DO $$
BEGIN
    ASSERT (SELECT count(*) FROM account_types) = 9, 'typy kont: oczekiwano 9';
    ASSERT (SELECT count(*) FROM lob_categories) = 18, 'kategorie LoB: oczekiwano 18';
    ASSERT (SELECT count(*) FROM position_statuses) = 4, 'statusy pozycji: oczekiwano 4';
    ASSERT (SELECT label FROM position_statuses WHERE code = 'Refuse') = 'Odmowa', 'opis statusu Refuse';
    ASSERT (SELECT count(*) FROM provinces) = 16, 'województwa: oczekiwano 16';
    ASSERT (SELECT count(*) FROM order_statuses WHERE code = 'open') = 1, 'status zamówienia open';
END;
$$;
