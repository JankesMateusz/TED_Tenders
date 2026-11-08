-- Słowniki z arkusza "Legenda" raportu MDP (opisy dosłownie z pliku).
-- Pozostałe słowniki (budżety, formy nabycia, OS, Office, zwycięzcy, vendorzy) wypełnia import z danych.

BEGIN;

INSERT INTO account_types (code, description, sort_order) VALUES
    ('Local govt', 'Jednostki samorządowe: urz. m-sta., urz. gm., urz. woj., komendy woj., izby celne itp.', 1),
    ('Higher Education', 'Uczelnie, instytuty PAN, centra doskonalenia itp., szkoły, gimnazja irp', 2),
    ('Healthcare', 'Szpitale, ośrodki zdrowia, zakł. medycyny, instytuty, np.: kardiologii itp.', 3),
    ('Central govt', 'Ministerstwa, instytucje centralne, np.: CSIOZ', 4),
    ('Utilities', 'PGNIG, Tauron, Energa, Kopalnie itp.', 5),
    ('Defence', 'wojsko, sądy, prokuratury, więziennictwo, PUP, Policja', 6),
    ('Semi-state', 'tramwaje, metro, ZTM', 7),
    ('EduK12', 'podstawówki itp..', 8),
    ('Justice', NULL, 9);

INSERT INTO lob_categories (code, description, sort_order) VALUES
    ('PC', 'komputery typu desktop', 1),
    ('NTB', 'komputery przenośne', 2),
    ('Printing', NULL, 3),
    ('AiO', NULL, 4),
    ('Tab', 'Tablety', 5),
    ('Storage', 'macierz dyskowa', 6),
    ('Mon', 'monitory', 7),
    ('MS Office', NULL, 8),
    ('WRS Mob', 'stacja graficzna mobilna', 9),
    ('WRS', 'stacja graficzna', 10),
    ('SRV', 'serwery', 11),
    ('CPS', 'Central printout service', 12),
    ('Printers', 'Drukarki', 13),
    ('Copiers', 'Kopiarki', 14),
    ('MFP', 'urządzenia wielofunkcyjne', 15),
    ('Scaner', NULL, 16),
    ('Ploter', NULL, 17),
    ('PES', 'Usługa serwisu środowiska wydruku (printing environment service)', 18);

COMMIT;
