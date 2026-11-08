"""Suchy przebieg analizy raportu MDP (xlsx). Tylko odczyt, bez bazy danych.

Użycie: python -I scripts/analyze_mdp_report.py <ścieżka-do.xlsx>
Wypisuje wyłącznie zestawienia zbiorcze (bez danych osobowych kontaktów).
"""
import re
import sys
import unicodedata
import zipfile
from collections import Counter, defaultdict
from datetime import date, timedelta
from xml.sax.saxutils import unescape

HEADER_ROW = 2
FIRST_DATA_ROW = 3
EXCEL_EPOCH = date(1899, 12, 30)


def col_to_idx(ref):
    letters = re.match(r"[A-Z]+", ref).group(0)
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n - 1


def load_shared_strings(z):
    raw = z.read("xl/sharedStrings.xml").decode("utf-8")
    items = re.findall(r"<si>(.*?)</si>", raw, re.S)
    return [unescape(re.sub(r"<[^>]+>", "", s)) for s in items]


def read_rows(path):
    z = zipfile.ZipFile(path)
    ss = load_shared_strings(z)
    sheet = z.read("xl/worksheets/sheet1.xml").decode("utf-8")
    for row_xml in re.finditer(r'<row [^>]*r="(\d+)"[^>]*>(.*?)</row>', sheet, re.S):
        rnum = int(row_xml.group(1))
        cells = {}
        for m in re.finditer(r'<c r="([A-Z]+\d+)"([^>]*?)(?:/>|>(.*?)</c>)', row_xml.group(2), re.S):
            body = m.group(3) or ""
            v = re.search(r"<v>(.*?)</v>", body, re.S)
            if v is None:
                t = re.search(r"<t[^>]*>(.*?)</t>", body, re.S)  # inlineStr
                if t is None:
                    continue
                cells[col_to_idx(m.group(1))] = unescape(t.group(1))
                continue
            val = v.group(1)
            cells[col_to_idx(m.group(1))] = unescape(ss[int(val)]) if 't="s"' in m.group(2) else val
        yield rnum, cells


def norm(s):
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def to_date(v):
    try:
        return EXCEL_EPOCH + timedelta(days=int(float(v)))
    except (TypeError, ValueError):
        return None


def pct(a, b):
    return f"{100 * a / b:.1f}%" if b else "-"


def main(path):
    headers = {}
    rows = []
    for rnum, cells in read_rows(path):
        if rnum == HEADER_ROW:
            headers = {i: v for i, v in cells.items()}
        elif rnum >= FIRST_DATA_ROW and cells:
            rows.append({headers[i]: v.strip() for i, v in cells.items() if i in headers and v.strip() != ""})
    n = len(rows)
    print(f"Kolumny: {len(headers)}, wiersze danych (pozycje): {n}\n")

    print("== Wypełnienie kolumn ==")
    for h in headers.values():
        filled = sum(1 for r in rows if h in r)
        print(f"  {h:28} {filled:6} ({pct(filled, n)})")

    print("\n== Identyfikatory ==")
    ids = [r.get("ID") for r in rows]
    id_counts = Counter(i for i in ids if i)
    print(f"  pozycje bez ID: {sum(1 for i in ids if not i)}; zduplikowane ID: {sum(1 for c in id_counts.values() if c > 1)}")
    by_order = defaultdict(list)
    for r in rows:
        by_order[r.get("MDP ID", "")].append(r)
    print(f"  unikalne MDP ID (zamówienia): {len(by_order)}; wiersze bez MDP ID: {len(by_order.get('', []))}")
    sizes = Counter(len(v) for k, v in by_order.items() if k)
    print(f"  pozycji na zamówienie: min {min(sizes)}, max {max(sizes)}, rozkład 1/2/3/4/5+: "
          f"{sizes[1]}/{sizes[2]}/{sizes[3]}/{sizes[4]}/{sum(c for s, c in sizes.items() if s >= 5)}")
    mdp_nums = sorted(int(k) for k in by_order if k.isdigit())
    if mdp_nums:
        missing = sorted(set(range(mdp_nums[0], mdp_nums[-1] + 1)) - set(mdp_nums))
        print(f"  zakres MDP ID: {mdp_nums[0]}..{mdp_nums[-1]}, luki w numeracji: {len(missing)} {missing[:15]}")
    pattern_bad = 0
    for r in rows:
        i, m = r.get("ID", ""), r.get("MDP ID", "")
        if not (len(i) == 9 and i[2:6] == m.zfill(4) and i[:2] == "26"):
            pattern_bad += 1
    print(f"  ID niezgodne ze wzorcem rr+MDP(4)+poz(3): {pattern_bad}")
    pos_gaps = 0
    for k, v in by_order.items():
        nums = sorted(int(r["ID"][6:]) for r in v if len(r.get("ID", "")) == 9 and r["ID"][6:].isdigit())
        if nums and nums != list(range(1, len(nums) + 1)):
            pos_gaps += 1
    print(f"  zamówienia z lukami/niezaczynającą się od 1 numeracją pozycji: {pos_gaps}")

    print("\n== Spójność pól zamówienia między pozycjami tego samego MDP ID ==")
    order_cols = ["End-User bid numer", "Date of MDP registration", "SIWZ active link", "Province", "Town",
                  "Type of Account", "Official Name", "Zip Code", "Address Street & No.", "PinC", "Email",
                  "Publication Date", "Bid Date", "Financing EU", "Budget", "Status"]
    for c in order_cols:
        conflicts = sum(1 for k, v in by_order.items() if k and len({r.get(c) for r in v}) > 1)
        if conflicts:
            print(f"  {c:28} zamówień z różnymi wartościami: {conflicts}")

    print("\n== Zamawiający ==")
    orders = [v[0] for k, v in by_order.items() if k]
    names = [o.get("Official Name") for o in orders if o.get("Official Name")]
    print(f"  zamówienia bez nazwy zamawiającego: {len(orders) - len(names)}")
    exact = Counter(names)
    print(f"  unikalne nazwy (dosłownie): {len(exact)}")
    groups = defaultdict(set)
    for nm in exact:
        groups[norm(nm)].add(nm)
    variants = {k: v for k, v in groups.items() if len(v) > 1}
    print(f"  unikalne po normalizacji (bez wielkości liter/znaków): {len(groups)}; grup z wariantami zapisu: {len(variants)}")
    for v in list(variants.values())[:5]:
        print(f"    np. {sorted(v)}")
    key_full = Counter((o.get("Official Name"), o.get("Zip Code"), o.get("Address Street & No.")) for o in orders)
    print(f"  unikalne (nazwa+kod+adres): {len(key_full)}")
    addr_by_name = defaultdict(set)
    for o in orders:
        if o.get("Official Name"):
            addr_by_name[o["Official Name"]].add((o.get("Zip Code"), o.get("Address Street & No.")))
    multi_addr = sum(1 for v in addr_by_name.values() if len(v) > 1)
    print(f"  nazw z więcej niż jednym adresem: {multi_addr}")
    top = exact.most_common(5)
    print(f"  najczęstsi zamawiający: {top}")

    print("\n== PinC (osoby kontaktowe) - tylko liczby ==")
    pinc = Counter((o.get("Official Name"), norm(o.get("PinC", "")), (o.get("Email") or "").lower()) for o in orders)
    print(f"  unikalne trójki (zamawiający, PinC, e-mail): {len(pinc)}")
    pinc_per_buyer = defaultdict(set)
    for (b, p, e) in pinc:
        pinc_per_buyer[b].add((p, e))
    dist = Counter(len(v) for v in pinc_per_buyer.values())
    print(f"  PinC na zamawiającego, rozkład 1/2/3/4+: {dist[1]}/{dist[2]}/{dist[3]}/{sum(c for s, c in dist.items() if s >= 4)}")
    no_mail = sum(1 for o in orders if not o.get("Email"))
    print(f"  zamówienia bez e-maila PinC: {no_mail}")
    bad_mail = sum(1 for o in orders if o.get("Email") and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", o["Email"]))
    print(f"  e-maile o niepoprawnym formacie: {bad_mail}")

    print("\n== Daty ==")
    def stats(col):
        ds = [to_date(o.get(col)) for o in orders if o.get(col)]
        bad = sum(1 for d in ds if d is None)
        ok = [d for d in ds if d]
        print(f"  {col:26} wypełnione {len(ds)}, nieparsowalne {bad}, zakres {min(ok)}..{max(ok)}" if ok else f"  {col}: brak")
    for c in ("Date of MDP registration", "Publication Date", "Bid Date", "Award Letter Date"):
        stats(c)
    inverted = sum(1 for o in orders
                   if to_date(o.get("Publication Date")) and to_date(o.get("Bid Date"))
                   and to_date(o["Bid Date"]) < to_date(o["Publication Date"]))
    print(f"  termin składania wcześniejszy niż publikacja: {inverted}")
    q_bad = 0
    for o in orders:
        d = to_date(o.get("Publication Date"))
        if d and o.get("Publication Quarter") != f"Q{(d.month - 1) // 3 + 1}'{d.year % 100}":
            q_bad += 1
    print(f"  Publication Quarter niezgodny z datą publikacji: {q_bad}")

    print("\n== Słowniki (wartości) ==")
    for c in ("Lob Category", "Status", "Type of Account", "Financing EU", "Financing non-EU", "Forma nabycia",
              "Province", "Vendor", "OS", "Office", "Final Office", "Budget"):
        cnt = Counter(r[c] for r in rows if c in r)
        print(f"  {c}: {len(cnt)} wartości; top: {cnt.most_common(8)}")
    for c in ("Winner",):
        cnt = Counter(r[c] for r in rows if c in r)
        groups = defaultdict(set)
        for nm in cnt:
            groups[norm(nm)].add(nm)
        print(f"  {c}: {len(cnt)} dosłownie, {len(groups)} po normalizacji; top: {cnt.most_common(5)}")

    print("\n== Ilości i wartości ==")
    bad_q = [r["Qtty"] for r in rows if "Qtty" in r and not re.match(r"^\d+(\.0+)?$", r["Qtty"])]
    print(f"  Qtty nienumeryczne: {len(bad_q)} {bad_q[:5]}; brak Qtty: {sum(1 for r in rows if 'Qtty' not in r)}")
    vals = [float(r["Tender / part value"]) for r in rows if re.match(r"^-?\d+(\.\d+)?$", r.get("Tender / part value", ""))]
    print(f"  pozycje z wartością: {len(vals)} ({pct(len(vals), n)}), suma {sum(vals):,.0f}, max {max(vals):,.0f}" if vals else "  brak wartości")
    status_by_pos = Counter(r.get("Status", "(pusty)") for r in rows)
    print(f"  status pozycji: {dict(status_by_pos)}")


if __name__ == "__main__":
    main(sys.argv[1])
