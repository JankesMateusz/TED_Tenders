-- Moduł zamówień (POC): schemat PostgreSQL.
--
-- Założenia projektowe (wynikają z analizy raportu MDP 2026 i z problemów starej aplikacji):
--  * Nic nie jest usuwane fizycznie. Wszystkie klucze obce to ON DELETE RESTRICT, a "usunięcie"
--    to ustawienie deleted_at. Pomyłkę da się cofnąć, a usunięcie pozycji nie psuje reszty danych.
--  * Identyfikatory techniczne (id) są stałe i bez znaczenia. Czytelne numery (MDP ID, numer pozycji)
--    to osobne pola, a luki w numeracji są dopuszczalne (numery nadają liczniki, nie MAX+1).
--  * Kontakt (PinC) musi należeć do zamówienia wskazanego zamawiającego. Pilnuje tego klucz złożony.
--  * Każda zmiana w tabelach roboczych trafia do audit_log (kto, kiedy, co się zmieniło).
--  * Pola wyliczalne (tydzień, kwartał, średnia wartość części) liczą widoki, nie kolumny.
--  * Wartości słownikowe (LoB, typ konta, OS...) są w osobnych tabelach z kluczami obcymi. Ich zawartość
--    wypełnia import z danych, a potem administrator, więc nowa wartość to wiersz, nie migracja.
--
-- Uruchamianie: pliki z db/migrations stosujemy kolejno, każdy dokładnie raz (patrz db/README.md).

BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- Funkcje pomocnicze
-- ---------------------------------------------------------------------------

-- Czas ostatniej zmiany i numer wersji (do optymistycznej blokady: UPDATE ... WHERE id = $1 AND version = $2).
CREATE FUNCTION touch_row() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    NEW.version := OLD.version + 1;
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Słowniki
-- ---------------------------------------------------------------------------

CREATE TABLE provinces (
    code        text PRIMARY KEY,
    sort_order  smallint NOT NULL DEFAULT 0
);

INSERT INTO provinces (code, sort_order) VALUES
    ('dolnośląskie', 1), ('kujawsko-pomorskie', 2), ('lubelskie', 3), ('lubuskie', 4),
    ('łódzkie', 5), ('małopolskie', 6), ('mazowieckie', 7), ('opolskie', 8),
    ('podkarpackie', 9), ('podlaskie', 10), ('pomorskie', 11), ('śląskie', 12),
    ('świętokrzyskie', 13), ('warmińsko-mazurskie', 14), ('wielkopolskie', 15), ('zachodniopomorskie', 16);

-- Kategoria sprzętu (MFP, SRV, NTB, Mon...). Zawartość z arkusza "Legenda" (migracja 0002).
CREATE TABLE lob_categories (
    code        text PRIMARY KEY,
    description text,
    active      boolean NOT NULL DEFAULT true,
    sort_order  smallint NOT NULL DEFAULT 0
);

-- Typ konta zamawiającego (Local govt, EduK12, Healthcare...). Zawartość z arkusza "Legenda" (migracja 0002).
CREATE TABLE account_types (
    code        text PRIMARY KEY,
    description text,
    active      boolean NOT NULL DEFAULT true,
    sort_order  smallint NOT NULL DEFAULT 0
);

-- Przedziały budżetu. Progi zmieniają się w czasie (930 960 i 957 524 PLN w jednym roku),
-- więc to jest zwykły słownik, a nie liczba w kodzie.
CREATE TABLE budget_brackets (
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label       text NOT NULL UNIQUE,
    active      boolean NOT NULL DEFAULT true,
    sort_order  smallint NOT NULL DEFAULT 0
);

-- Forma nabycia (zakup, dzierżawa, usługa...).
CREATE TABLE acquisition_forms (
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label       text NOT NULL UNIQUE,
    active      boolean NOT NULL DEFAULT true
);

-- System operacyjny i pakiet Office (te same listy służą wartościom początkowym i końcowym).
CREATE TABLE os_options (
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label       text NOT NULL UNIQUE,
    active      boolean NOT NULL DEFAULT true
);

CREATE TABLE office_options (
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label       text NOT NULL UNIQUE,
    active      boolean NOT NULL DEFAULT true
);

-- Status zamówienia (lista rozwijana w oknie zamówienia starej aplikacji). Raport Excel nie zawiera tej kolumny,
-- więc znamy tylko 'open' (ze zrzutu ekranu). Pozostałe wartości dojdą jako wiersze po ustaleniu z użytkowniczką.
CREATE TABLE order_statuses (
    code        text PRIMARY KEY,
    label       text NOT NULL,
    sort_order  smallint NOT NULL DEFAULT 0
);

INSERT INTO order_statuses (code, label, sort_order) VALUES ('open', 'Jeszcze nierozstrzygnięty', 1);

-- Status pozycji: stan uzyskiwania informacji o wyniku. Kody i znaczenia z arkusza "Legenda" raportu.
CREATE TABLE position_statuses (
    code        text PRIMARY KEY,
    label       text NOT NULL,
    sort_order  smallint NOT NULL DEFAULT 0
);

INSERT INTO position_statuses (code, label, sort_order) VALUES
    ('Pending', 'Przetarg w toku', 1),
    ('Confirmed', 'Uzyskana informacja', 2),
    ('Refuse', 'Odmowa', 3),
    ('Cancel', 'Przetarg unieważniony', 4);

-- ---------------------------------------------------------------------------
-- Zamawiający i osoby kontaktowe (PinC)
-- ---------------------------------------------------------------------------

CREATE TABLE buyers (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL,
    -- Klucz do wykrywania duplikatów, liczony w aplikacji z nazwy, kodu pocztowego i ulicy po normalizacji
    -- (wielkość liter, interpunkcja, cudzysłowy). Nazwa sama nie wystarcza: ta sama nazwa bywa używana
    -- przez różne jednostki w różnych miastach.
    dedupe_key      text NOT NULL,
    street          text,
    zip_code        text,
    town            text,
    province        text REFERENCES provinces (code),
    nip             text CHECK (nip IS NULL OR nip ~ '^[0-9]{10}$'),
    -- Po scaleniu duplikatów rekord zostaje, ale wskazuje na rekord główny.
    merged_into_id  bigint REFERENCES buyers (id) ON DELETE RESTRICT,
    created_at      timestamptz NOT NULL DEFAULT now(),
    created_by      text,
    updated_at      timestamptz NOT NULL DEFAULT now(),
    version         integer NOT NULL DEFAULT 1,
    deleted_at      timestamptz,
    deleted_by      text,
    CHECK (merged_into_id IS DISTINCT FROM id)
);

CREATE UNIQUE INDEX buyers_dedupe_key_uq ON buyers (dedupe_key)
    WHERE merged_into_id IS NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX buyers_nip_uq ON buyers (nip)
    WHERE nip IS NOT NULL AND merged_into_id IS NULL AND deleted_at IS NULL;
CREATE INDEX buyers_name_trgm ON buyers USING gin (lower(name) gin_trgm_ops);
CREATE INDEX buyers_merged_into_idx ON buyers (merged_into_id) WHERE merged_into_id IS NOT NULL;

CREATE TRIGGER buyers_touch BEFORE UPDATE ON buyers FOR EACH ROW EXECUTE FUNCTION touch_row();

CREATE TABLE buyer_contacts (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyer_id    bigint NOT NULL REFERENCES buyers (id) ON DELETE RESTRICT,
    full_name   text,
    phone       text,
    email       text,
    email2      text,
    fax         text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    created_by  text,
    updated_at  timestamptz NOT NULL DEFAULT now(),
    version     integer NOT NULL DEFAULT 1,
    deleted_at  timestamptz,
    deleted_by  text,
    -- Potrzebne dla klucza złożonego z orders (kontakt musi należeć do zamawiającego zamówienia).
    UNIQUE (id, buyer_id)
);

CREATE UNIQUE INDEX buyer_contacts_identity_uq ON buyer_contacts (buyer_id, lower(coalesce(email, '')), lower(coalesce(full_name, '')))
    WHERE deleted_at IS NULL;
CREATE INDEX buyer_contacts_buyer_idx ON buyer_contacts (buyer_id);

CREATE TRIGGER buyer_contacts_touch BEFORE UPDATE ON buyer_contacts FOR EACH ROW EXECUTE FUNCTION touch_row();

-- ---------------------------------------------------------------------------
-- Firmy. Dziś w raporcie to wolny tekst.
--  winners: firma, która wygrała przetarg (dealer/integrator).
--  vendors: producent, którego sprzęt ostatecznie zamówiono (Dell, HP, Lenovo, Konica Minolta...).
--           W danych są też wpisy specjalne (np. "nie wymagali podania modeli"), więc to słownik, nie lista marek.
-- ---------------------------------------------------------------------------

CREATE TABLE winners (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL,
    name_key        text NOT NULL,
    merged_into_id  bigint REFERENCES winners (id) ON DELETE RESTRICT,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    version         integer NOT NULL DEFAULT 1,
    deleted_at      timestamptz,
    CHECK (merged_into_id IS DISTINCT FROM id)
);
CREATE UNIQUE INDEX winners_name_key_uq ON winners (name_key) WHERE merged_into_id IS NULL AND deleted_at IS NULL;
CREATE INDEX winners_name_trgm ON winners USING gin (lower(name) gin_trgm_ops);
CREATE TRIGGER winners_touch BEFORE UPDATE ON winners FOR EACH ROW EXECUTE FUNCTION touch_row();

CREATE TABLE vendors (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL,
    name_key        text NOT NULL,
    merged_into_id  bigint REFERENCES vendors (id) ON DELETE RESTRICT,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    version         integer NOT NULL DEFAULT 1,
    deleted_at      timestamptz,
    CHECK (merged_into_id IS DISTINCT FROM id)
);
CREATE UNIQUE INDEX vendors_name_key_uq ON vendors (name_key) WHERE merged_into_id IS NULL AND deleted_at IS NULL;
CREATE TRIGGER vendors_touch BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION touch_row();

-- ---------------------------------------------------------------------------
-- Numeracja. Licznik zamiast MAX+1: bezpieczny przy równoległych zapisach i odporny na usunięcia.
-- ---------------------------------------------------------------------------

CREATE TABLE order_counters (
    year         smallint PRIMARY KEY,
    last_number  integer NOT NULL
);

CREATE TABLE position_counters (
    order_id     bigint PRIMARY KEY,
    last_number  integer NOT NULL
);

CREATE FUNCTION next_mdp_number(p_year smallint) RETURNS integer LANGUAGE sql AS $$
    INSERT INTO order_counters AS c (year, last_number) VALUES (p_year, 1)
    ON CONFLICT (year) DO UPDATE SET last_number = c.last_number + 1
    RETURNING last_number;
$$;

CREATE FUNCTION next_position_number(p_order_id bigint) RETURNS integer LANGUAGE sql AS $$
    INSERT INTO position_counters AS c (order_id, last_number) VALUES (p_order_id, 1)
    ON CONFLICT (order_id) DO UPDATE SET last_number = c.last_number + 1
    RETURNING last_number;
$$;

-- ---------------------------------------------------------------------------
-- Zamówienia
-- ---------------------------------------------------------------------------

CREATE TABLE orders (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                smallint NOT NULL CHECK (year BETWEEN 2000 AND 2100),
    mdp_number          integer NOT NULL CHECK (mdp_number > 0),
    -- Dokument z listy przetargów (Firestore tenders/{id}), jeśli zamówienie powstało przyciskiem "Wpisz do bazy".
    source_tender_id    text,
    end_user_bid_number text,
    name                text,
    registered_on       date NOT NULL,
    publication_date    date,
    bid_date            date,
    siwz_url            text,
    extra_urls          text[] NOT NULL DEFAULT '{}',
    financing_eu        boolean NOT NULL DEFAULT false,
    budget_bracket_id   integer REFERENCES budget_brackets (id),
    account_type        text REFERENCES account_types (code),
    outside_uzp         boolean NOT NULL DEFAULT false,
    lenovo_top_ten      boolean NOT NULL DEFAULT false,
    comments            text,
    status              text NOT NULL DEFAULT 'open' REFERENCES order_statuses (code),
    -- Kwota, z jaką zwycięzca wygrał przetarg (całość), i liczba części. Wypełnia analityczka po rozstrzygnięciu,
    -- więc bywa pusta. Średnią kwotę części liczy widok.
    value_total         numeric(16, 2) CHECK (value_total IS NULL OR value_total >= 0),
    parts_count         integer CHECK (parts_count IS NULL OR parts_count > 0),
    buyer_id            bigint NOT NULL REFERENCES buyers (id) ON DELETE RESTRICT,
    contact_id          bigint,
    created_at          timestamptz NOT NULL DEFAULT now(),
    created_by          text,
    updated_at          timestamptz NOT NULL DEFAULT now(),
    updated_by          text,
    version             integer NOT NULL DEFAULT 1,
    deleted_at          timestamptz,
    deleted_by          text,
    UNIQUE (year, mdp_number),
    -- Kontakt musi być osobą zamawiającego tego zamówienia. Przy contact_id = NULL klucz nie jest sprawdzany.
    FOREIGN KEY (contact_id, buyer_id) REFERENCES buyer_contacts (id, buyer_id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX orders_source_tender_uq ON orders (source_tender_id)
    WHERE source_tender_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX orders_buyer_idx ON orders (buyer_id);
CREATE INDEX orders_registered_idx ON orders (registered_on DESC) WHERE deleted_at IS NULL;
CREATE INDEX orders_publication_idx ON orders (publication_date) WHERE deleted_at IS NULL;
CREATE INDEX orders_status_idx ON orders (status) WHERE deleted_at IS NULL;

CREATE TRIGGER orders_touch BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION touch_row();

ALTER TABLE position_counters ADD FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT;

-- ---------------------------------------------------------------------------
-- Pozycje (części / zadania zamówienia)
-- ---------------------------------------------------------------------------

CREATE TABLE positions (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id            bigint NOT NULL REFERENCES orders (id) ON DELETE RESTRICT,
    -- Numer pozycji w zamówieniu, nadawany licznikiem. Unikalny także wśród usuniętych, więc nie jest używany ponownie.
    position_number     integer NOT NULL CHECK (position_number > 0),
    -- Identyfikator ze starej aplikacji (np. 260001001), zostaje dla ciągłości raportów i śladu importu.
    legacy_id           text UNIQUE,
    part_label          text,
    -- Przed rozstrzygnięciem (Pre Bid Verification)
    lob_category        text REFERENCES lob_categories (code),
    quantity            integer CHECK (quantity IS NULL OR quantity >= 0),
    architecture        text,
    cpu_no              text,
    os_id               integer REFERENCES os_options (id),
    office_id           integer REFERENCES office_options (id),
    initial_benchmark   text,
    acquisition_form_id integer REFERENCES acquisition_forms (id),
    remarks             text,
    -- Rzadkie parametry zależne od kategorii (ram, build_in_storage, iso_50001, tco...).
    -- Nowy parametr to nowy klucz, nie migracja.
    attributes          jsonb NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(attributes) = 'object'),
    -- Po rozstrzygnięciu (Post Bid Verification)
    status              text NOT NULL DEFAULT 'Pending' REFERENCES position_statuses (code),
    winner_id           bigint REFERENCES winners (id) ON DELETE RESTRICT,
    vendor_id           bigint REFERENCES vendors (id) ON DELETE RESTRICT,
    award_letter_date   date CHECK (award_letter_date IS NULL OR award_letter_date BETWEEN DATE '2015-01-01' AND DATE '2100-12-31'),
    final_os_id         integer REFERENCES os_options (id),
    final_office_id     integer REFERENCES office_options (id),
    delivery_term       text,
    -- Wartość części, jeśli jest znana osobno. Do statystyk wartościowych służy wartość zamówienia.
    part_value          numeric(16, 2) CHECK (part_value IS NULL OR part_value >= 0),
    created_at          timestamptz NOT NULL DEFAULT now(),
    created_by          text,
    updated_at          timestamptz NOT NULL DEFAULT now(),
    updated_by          text,
    version             integer NOT NULL DEFAULT 1,
    deleted_at          timestamptz,
    deleted_by          text,
    UNIQUE (order_id, position_number)
);

CREATE INDEX positions_order_idx ON positions (order_id) WHERE deleted_at IS NULL;
CREATE INDEX positions_lob_idx ON positions (lob_category) WHERE deleted_at IS NULL;
CREATE INDEX positions_winner_idx ON positions (winner_id) WHERE winner_id IS NOT NULL;
CREATE INDEX positions_vendor_idx ON positions (vendor_id) WHERE vendor_id IS NOT NULL;
CREATE INDEX positions_status_idx ON positions (status) WHERE deleted_at IS NULL;

CREATE TRIGGER positions_touch BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION touch_row();

-- ---------------------------------------------------------------------------
-- Pisma wysyłane do zamawiających
-- ---------------------------------------------------------------------------

CREATE TABLE letters (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id          bigint NOT NULL REFERENCES orders (id) ON DELETE RESTRICT,
    sent_at           timestamptz NOT NULL DEFAULT now(),
    -- Status zamówienia w chwili wysłania pisma (kolumna "Tender status" w starej aplikacji).
    order_status      text REFERENCES order_statuses (code),
    mail_to           text[] NOT NULL DEFAULT '{}',
    mail_cc           text[] NOT NULL DEFAULT '{}',
    confirmed_on      date,
    -- "Anuluj ostatnie pismo" ustawia znacznik, pismo zostaje w historii.
    cancelled_at      timestamptz,
    created_by        text,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    version           integer NOT NULL DEFAULT 1
);

CREATE INDEX letters_order_idx ON letters (order_id, sent_at DESC);

CREATE TRIGGER letters_touch BEFORE UPDATE ON letters FOR EACH ROW EXECUTE FUNCTION touch_row();

-- ---------------------------------------------------------------------------
-- Dziennik zmian
-- ---------------------------------------------------------------------------

CREATE TABLE audit_log (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    at          timestamptz NOT NULL DEFAULT now(),
    -- Identyfikator użytkownika (Firebase uid). Aplikacja ustawia go na czas transakcji:
    --   SELECT set_config('app.user_id', $uid, true);
    actor       text,
    entity      text NOT NULL,
    entity_id   bigint NOT NULL,
    action      text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    -- INSERT/DELETE: cały wiersz. UPDATE: tylko zmienione pola jako {"pole": {"old": ..., "new": ...}}.
    changes     jsonb NOT NULL
);

CREATE INDEX audit_log_entity_idx ON audit_log (entity, entity_id, at DESC);
CREATE INDEX audit_log_at_idx ON audit_log (at DESC);

CREATE FUNCTION audit_row() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
    diff jsonb;
    row_id bigint;
BEGIN
    IF TG_OP = 'INSERT' THEN
        diff := to_jsonb(NEW);
        row_id := NEW.id;
    ELSIF TG_OP = 'UPDATE' THEN
        SELECT coalesce(jsonb_object_agg(n.key, jsonb_build_object('old', to_jsonb(OLD) -> n.key, 'new', n.value)), '{}'::jsonb)
          INTO diff
          FROM jsonb_each(to_jsonb(NEW)) AS n
         WHERE n.key NOT IN ('updated_at', 'version')
           AND (to_jsonb(OLD) -> n.key) IS DISTINCT FROM n.value;
        IF diff = '{}'::jsonb THEN
            RETURN NEW;
        END IF;
        row_id := NEW.id;
    ELSE
        diff := to_jsonb(OLD);
        row_id := OLD.id;
    END IF;

    INSERT INTO audit_log (actor, entity, entity_id, action, changes)
    VALUES (nullif(current_setting('app.user_id', true), ''), TG_TABLE_NAME, row_id, TG_OP, diff);

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- Dziennik jest tylko do dopisywania.
CREATE FUNCTION audit_log_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'audit_log jest tylko do dopisywania';
END;
$$;

CREATE TRIGGER audit_log_no_change BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW EXECUTE FUNCTION audit_log_immutable();

CREATE TRIGGER buyers_audit AFTER INSERT OR UPDATE OR DELETE ON buyers FOR EACH ROW EXECUTE FUNCTION audit_row();
CREATE TRIGGER buyer_contacts_audit AFTER INSERT OR UPDATE OR DELETE ON buyer_contacts FOR EACH ROW EXECUTE FUNCTION audit_row();
CREATE TRIGGER orders_audit AFTER INSERT OR UPDATE OR DELETE ON orders FOR EACH ROW EXECUTE FUNCTION audit_row();
CREATE TRIGGER positions_audit AFTER INSERT OR UPDATE OR DELETE ON positions FOR EACH ROW EXECUTE FUNCTION audit_row();
CREATE TRIGGER letters_audit AFTER INSERT OR UPDATE OR DELETE ON letters FOR EACH ROW EXECUTE FUNCTION audit_row();

-- ---------------------------------------------------------------------------
-- Widoki raportowe
-- ---------------------------------------------------------------------------

-- Kod pozycji w formacie starej aplikacji: rr + MDP (4 cyfry) + pozycja (3 cyfry), np. 260001001.
CREATE FUNCTION position_code(p_year smallint, p_mdp integer, p_position integer) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
    SELECT lpad((p_year % 100)::text, 2, '0') || lpad(p_mdp::text, 4, '0') || lpad(p_position::text, 3, '0');
$$;

-- Zamówienia z polami wyliczanymi. Tydzień to tydzień ISO daty rejestracji, kwartał pochodzi z daty publikacji
-- (sprawdzone na raporcie 2026: zgodność 100% dla 7773 zamówień).
CREATE VIEW v_orders AS
SELECT
    o.id,
    o.year,
    o.mdp_number,
    lpad(o.mdp_number::text, 4, '0') AS mdp_id,
    o.end_user_bid_number,
    o.name,
    o.registered_on,
    'ww' || extract(week FROM o.registered_on)::int AS order_week,
    o.publication_date,
    CASE WHEN o.publication_date IS NOT NULL
         THEN 'Q' || extract(quarter FROM o.publication_date)::int || '''' || lpad((extract(year FROM o.publication_date)::int % 100)::text, 2, '0')
    END AS publication_quarter,
    o.bid_date,
    o.status,
    o.account_type,
    o.financing_eu,
    bb.label AS budget,
    o.value_total,
    o.parts_count,
    CASE WHEN o.value_total IS NOT NULL AND o.parts_count IS NOT NULL
         THEN round(o.value_total / o.parts_count, 2)
    END AS avg_part_value,
    o.buyer_id,
    b.name AS buyer_name,
    b.province,
    b.town,
    o.contact_id,
    (SELECT count(*) FROM positions p WHERE p.order_id = o.id AND p.deleted_at IS NULL) AS positions_count
FROM orders o
JOIN buyers b ON b.id = o.buyer_id
LEFT JOIN budget_brackets bb ON bb.id = o.budget_bracket_id
WHERE o.deleted_at IS NULL;

-- Płaski widok w układzie dotychczasowego raportu Excel (jeden wiersz na pozycję). Źródło eksportu .xlsx
-- w starym formacie, żeby można było porównać wynik z raportem ze starej aplikacji.
CREATE VIEW v_report_flat AS
SELECT
    lpad(o.mdp_number::text, 4, '0')                         AS "MDP ID",
    o.end_user_bid_number                                    AS "End-User bid numer",
    o.registered_on                                          AS "Date of MDP registration",
    o.siwz_url                                               AS "SIWZ active link",
    b.province                                               AS "Province",
    vo.publication_quarter                                   AS "Publication Quarter",
    b.town                                                   AS "Town",
    o.account_type                                           AS "Type of Account",
    b.name                                                   AS "Official Name",
    b.zip_code                                               AS "Zip Code",
    b.street                                                 AS "Address Street & No.",
    c.full_name                                              AS "PinC",
    c.phone                                                  AS "Phone",
    c.email                                                  AS "Email",
    c.email2                                                 AS "Email2",
    c.fax                                                    AS "Fax",
    o.publication_date                                       AS "Publication Date",
    o.bid_date                                               AS "Bid Date",
    p.lob_category                                           AS "Lob Category",
    p.quantity                                               AS "Qtty",
    p.architecture                                           AS "Architecture",
    p.cpu_no                                                 AS "CPU_No",
    os.label                                                 AS "OS",
    oo.label                                                 AS "Office",
    CASE WHEN o.financing_eu THEN 'no' ELSE 'yes' END        AS "Financing non-EU",
    CASE WHEN o.financing_eu THEN 'yes' ELSE 'no' END        AS "Financing EU",
    p.initial_benchmark                                      AS "Initial Benchmark",
    af.label                                                 AS "Forma nabycia",
    w.name                                                   AS "Winner",
    v.name                                                   AS "Vendor",
    bb.label                                                 AS "Budget",
    p.status                                                 AS "Status",
    p.remarks                                                AS "Remarks",
    p.award_letter_date                                      AS "Award Letter Date",
    vo.order_week                                            AS "Order Week",
    p.part_label                                             AS "Part",
    position_code(o.year, o.mdp_number, p.position_number)   AS "ID",
    fo.label                                                 AS "Final Office",
    coalesce(p.part_value, vo.avg_part_value)                AS "Tender / part value",
    p.attributes ->> 'iso_50001'                             AS "ISO 50001",
    p.attributes ->> 'tco'                                   AS "TCO",
    p.attributes ->> 'ram'                                   AS "RAM",
    p.attributes ->> 'build_in_storage'                      AS "Build-in-storage"
FROM positions p
JOIN orders o ON o.id = p.order_id AND o.deleted_at IS NULL
JOIN v_orders vo ON vo.id = o.id
JOIN buyers b ON b.id = o.buyer_id
LEFT JOIN buyer_contacts c ON c.id = o.contact_id
LEFT JOIN budget_brackets bb ON bb.id = o.budget_bracket_id
LEFT JOIN os_options os ON os.id = p.os_id
LEFT JOIN office_options oo ON oo.id = p.office_id
LEFT JOIN office_options fo ON fo.id = p.final_office_id
LEFT JOIN acquisition_forms af ON af.id = p.acquisition_form_id
LEFT JOIN winners w ON w.id = p.winner_id
LEFT JOIN vendors v ON v.id = p.vendor_id
WHERE p.deleted_at IS NULL;

-- Po imporcie (numery nadane z zewnątrz) ustawia liczniki na aktualne maksima.
CREATE FUNCTION sync_counters() RETURNS void LANGUAGE sql AS $$
    INSERT INTO order_counters (year, last_number)
    SELECT year, max(mdp_number) FROM orders GROUP BY year
    ON CONFLICT (year) DO UPDATE SET last_number = GREATEST(order_counters.last_number, EXCLUDED.last_number);

    INSERT INTO position_counters (order_id, last_number)
    SELECT order_id, max(position_number) FROM positions GROUP BY order_id
    ON CONFLICT (order_id) DO UPDATE SET last_number = GREATEST(position_counters.last_number, EXCLUDED.last_number);
$$;

COMMIT;
