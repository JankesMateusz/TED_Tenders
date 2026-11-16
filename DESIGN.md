---
name: TED Tenders
description: Wspólna wyszukiwarka przetargów IT dla zespołu ofertowego
colors:
  accent: "#1f5fe0"
  accent-dark: "#1a4fbc"
  page: "#f4f6fb"
  surface: "#ffffff"
  raised: "#eef1f8"
  raised-hover: "#e1e6f1"
  border: "#d8dfec"
  text-primary: "#18202f"
  text-secondary: "#576078"
  dark-accent: "#6aa5ff"
  dark-accent-dark: "#4f8ef0"
  dark-button-primary: "#2f6fdb"
  dark-button-primary-hover: "#2559b5"
  dark-page: "#0e131d"
  dark-surface: "#161c2a"
  dark-raised: "#1d2435"
  dark-border: "#2a3349"
  dark-text-primary: "#e7ebf3"
  dark-text-secondary: "#9aa4ba"
  status-to-enter: "#3498db"
  status-entered: "#2ecc71"
  status-to-clarify: "#f39c12"
  status-not-to-enter: "#e74c3c"
  status-unmarked: "#7f8c8d"
  danger: "#e74c3c"
  danger-hover: "#c0392b"
  star: "#f1c40f"
  series-ted: "#e67e22"
  series-ezam: "#3498db"
  series-baza: "#9b59b6"
  label-important: "#d63384"
  label-simple: "#16a085"
  label-hard: "#8e44ad"
  label-missing-docs: "#6c757d"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "32px"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "19px"
    fontWeight: 700
    letterSpacing: "-0.01em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "14px"
    fontWeight: 400
  meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.5px"
  mono:
    fontFamily: "ui-monospace, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 600
rounded:
  badge: "4px"
  control: "9px"
  card: "12px"
  pill: "20px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
components:
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  button-hover:
    backgroundColor: "{colors.raised}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dark}"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    size: "40px"
  search-input:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "10px"
    padding: "0 44px 0 38px"
    height: "40px"
  tender-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "20px"
  status-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "8px"
    padding: "0 12px"
    height: "40px"
  filter-chip:
    backgroundColor: "rgba(31, 95, 224, 0.12)"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "3px 6px 3px 10px"
  cpv-chip:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text-primary}"
    typography: "{typography.meta}"
    rounded: "7px"
    padding: "4px 10px"
  system-badge:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.badge}"
    padding: "2px 8px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    padding: "12px 24px"
  tab-active:
    textColor: "{colors.accent}"
  popover-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "6px"
---

# Design System: TED Tenders

## Overview

**Creative North Star: "Dziennik zamówień"**

Aplikacja wygląda jak rejestr prowadzony dzień po dniu. Każde ogłoszenie to równy wpis: źródło, tytuł, zamawiający, data, a obok decyzja zespołu z informacją, kto i kiedy ją podjął. Interfejs jest tłem dla tych wpisów. Chłodne, niebieskawe szarości tworzą papier dziennika, jeden błękit wskazuje, co jest aktywne, a pozostałe kolory pojawiają się wyłącznie tam, gdzie niosą informację.

System jest gęsty, ale spokojny. Kontrolki mają cienkie obramowanie i leżą na powierzchni karty; wypełniony niebieski przycisk dostaje tylko główna akcja. Tekst jest systemowy i mały (13–14 px w kontrolkach i metadanych), bo liczy się, ile wpisów mieści się na ekranie. Motyw jasny i ciemny są równorzędne: każdy token powierzchni, tekstu i akcentu ma parę w obu motywach.

Świadomie odrzucone: ozdobne gradienty i poświaty oraz kolor, który nic nie znaczy.

**Key Characteristics:**
- Wpis ponad ozdobę: karta przetargu jest jednostką, wszystko inne jej służy.
- Jeden akcent (Urzędowy błękit) plus kolory znaczące: status, źródło, etykieta, ostrzeżenie.
- Płasko; cień mają tylko warstwy pływające.
- Kontrolki 40 px wysokości, wspólny promień 9 px, karty 12 px.
- Dwa równorzędne motywy przełączane atrybutem `data-theme`.
- Stan widać także po kształcie: ikona statusu, położenie suwaka, linia ciągła albo przerywana.

## Colors

Chłodna, niebieskawa skala szarości z jednym błękitnym akcentem; cała reszta barw to kodowanie informacji.

### Primary
- **Urzędowy błękit** (`accent`, w ciemnym motywie `dark-accent`): aktywna zakładka, obrys aktywnej karty przy nawigacji klawiaturą, obramowanie otwartego menu, tekst aktywnych chipów filtrów, plakietka „nowy". Jako tło wypełnionych przycisków, włączonych przełączników i licznika filtrów używany jest wariant z białym tekstem: `accent` w jasnym motywie i ciemniejszy `dark-button-primary` w ciemnym.
- **Urzędowy błękit, głębszy** (`accent-dark`, `dark-button-primary-hover`): stan hover wypełnionych przycisków.
- Przezroczyste pochodne akcentu (8–14% krycia) służą jako tło otwartych kontrolek i chipów oraz jako pierścień fokusu pól (3 px).

### Secondary
- **Kolory statusu**: `status-to-enter` (Do wpisania), `status-entered` (Wpisany), `status-to-clarify` (Do wyjaśnienia), `status-not-to-enter` (Nie do wpisania), `status-unmarked` (bez statusu). Ustawiane przez komponent jako `--status-color`; barwią pasek z lewej strony karty, kropkę i ramkę przycisku statusu. Zielony `status-entered` jest też kropką „online".
- **Kolory źródeł**: plakietki źródła i typu zamówienia mają własne pary tło/tekst w `src/utils/tenderSources.ts`; na wykresach każde źródło ma jeden kolor serii (`series-ted`, `series-ezam`, `series-baza`).
- **Etykiety ręczne**: `label-important`, `label-simple`, `label-hard`, `label-missing-docs` z białym tekstem.

### Tertiary
- **Czerwień ostrzegawcza** (`danger`, `danger-hover`): usuwanie i czyszczenie; w spoczynku tylko jako hover (tło 10% krycia, obramowanie i tekst w `danger`).
- **Żółć gwiazdki** (`star`): wyłącznie indywidualne „Zapisane".
- **Bursztyn systemowy** (`rgba(243, 156, 18, 0.12)` tło, `0.4` obramowanie): ostrzegawcza plakietka systemowa.

### Neutral
- **Tło strony** (`page` / `dark-page`): ustawiane na `body`.
- **Powierzchnia** (`surface` / `dark-surface`): karty, pasek aplikacji, menu, przyciski.
- **Powierzchnia podniesiona** (`raised` / `dark-raised`): pola, chipy CPV, hover przycisków i opcji menu; `raised-hover` to jej stan hover.
- **Obramowanie** (`border` / `dark-border`): wszystkie linie 1 px, także tor wyłączonego przełącznika.
- **Tekst główny i pomocniczy** (`text-primary`, `text-secondary` oraz pary `dark-`): pomocniczy dla metadanych, podpisów i stanów nieustawionych.

### Named Rules
**The Znaczący Kolor Rule.** Poza Urzędowym błękitem kolor pojawia się tylko jako status, źródło, etykieta, gwiazdka lub ostrzeżenie. Jeśli barwa niczego nie koduje, zastąp ją neutralną.

**The Para Motywów Rule.** Żadnych surowych wartości w komponentach: każdy kolor powierzchni, tekstu, obramowania i akcentu pochodzi z tokenu zdefiniowanego w obu blokach `data-theme` w `src/styles/theme.css`.

**The Biały Na Niebieskim Rule.** Wypełnione przyciski mają biały tekst, więc ich tło to `--button-primary`, nie `--accent`: w ciemnym motywie akcent jest za jasny na biały tekst.

## Typography

**Display Font:** systemowy stos bezszeryfowy (`-apple-system`, `Segoe UI`, `Roboto`, `Helvetica Neue`)
**Body Font:** ten sam stos
**Label/Mono Font:** `ui-monospace, Consolas, monospace` dla znaczka skrótu klawiszowego i kodów CPV

**Character:** Jedna, natywna rodzina pisma bez ładowania fontów. Hierarchię budują grubość i kolor tekstu, nie kontrast krojów.

### Hierarchy
- **Display** (32 px, 24 px na telefonie): wyłącznie liczby na kartach statystyk.
- **Headline** (700, 19 px, odstęp −0.01em): nazwa aplikacji w pasku.
- **Title** (600, 18 px, interlinia 1.4; 16 px ≤768 px, 14 px ≤480 px): tytuł przetargu na karcie.
- **Body** (400–500, 14 px): kontrolki, opcje menu, notatki. Zakładki mają 16 px / 500, aktywna 600.
- **Meta** (400, 13 px, interlinia 1.4): linia zamawiającego i dat, liczniki, podpowiedzi; w kolorze pomocniczym, z nazwą zamawiającego w kolorze głównym i grubości 500.
- **Label** (600–700, 12 px, odstęp 0.5px): plakietki źródła (wersaliki), typu zamówienia i etykiet, liczniki w pigułkach, stopka karty.

### Named Rules
**The Dwie Szarości Rule.** Tekst ma dokładnie dwa kolory: główny dla treści wpisu i pomocniczy dla wszystkiego wokół. Trzeciego odcienia nie wprowadzaj; przygaszenie stanu wyłączonego robi krycie (0.4–0.6).

## Layout

Treść mieści się w kolumnie o maksymalnej szerokości 1600 px (statystyki 1200 px) z marginesem 24 px. Na desktopie układ to flex: sidebar zamawiających obok elastycznej kolumny z listą, odstęp 24 px. Pasek zakładek leży nad tym układem, żeby nie przesuwał się, gdy sidebar znika. Lista to jednokolumnowa siatka kart (`minmax(0, 1fr)`) z odstępem 20 px.

Rytm odstępów opiera się na krokach 4 / 8 / 12 / 16 / 20 / 24 px: 8 px między kontrolkami w pasku narzędzi, 6–8 px między chipami, 20 px wnętrze karty.

Progi responsywne:
- **≤1024 px**: układ przechodzi w kolumnę, margines 20 px, karta 16 px, odstęp listy 16 px.
- **≤768 px**: margines 12 px, karta 12 px, odstęp 12 px; wyszukiwarka w pasku znika, konto przenosi się do rzędu z tytułem; `body` 14 px.
- **≤480 px**: margines 8 px, karta 10 px, odstęp 10 px; `body` 13 px.

Pasek aplikacji łamie się do kilku rzędów zamiast chować kontrolki. Na ekranach dotykowych przyciski mają co najmniej 44 px, a na wąskim ekranie odnośniki, zakładki i chipy co najmniej 40 px wysokości. Małe widoczne cele (krzyżyk chipu 20 px) powiększa niewidoczny obszar dotyku.

## Elevation & Depth

System jest płaski. Powierzchnie odróżnia tonalne warstwowanie (tło strony → powierzchnia → powierzchnia podniesiona) i obramowanie 1 px. Wyraźny cień mają wyłącznie elementy pływające nad treścią.

### Shadow Vocabulary
- **Karta** (`--card-shadow`: `0 2px 4px rgba(0,0,0,0.1)`, w ciemnym `0.3`): ledwo widoczne odcięcie karty od tła; kształt karty niesie obramowanie, nie cień.
- **Menu** (`--card-hover-shadow`: `0 4px 8px rgba(0,0,0,0.15)`, w ciemnym `0.4`): małe menu statusu.
- **Panel pływający** (`--pop-shadow`: `0 12px 32px rgba(24,32,47,0.16)`, w ciemnym `rgba(0,0,0,0.5)`): popovery filtrów i panel dat.

### Named Rules
**The Cień Tylko Dla Warstw Rule.** Nowy cień wolno dodać tylko elementowi, który przykrywa inną treść. Karty, sekcje i kontrolki w spoczynku zostają płaskie; hover zmienia tło, nie wysokość.

## Shapes

Łagodnie zaokrąglone prostokąty z cienką linią. Dwa promienie są tokenami: karty i panele 12 px (`--radius-card`), kontrolki 9 px (`--radius-control`). Plakietki informacyjne mają 4 px, a liczniki, aktywne chipy filtrów i tory przełączników są pigułkami (20 px). Koła służą kropkom statusu i suwakom.

Rodzaj linii ma znaczenie: **ciągła** oznacza element interaktywny lub decyzję człowieka, **przerywana** informację od systemu albo stan jeszcze nieustawiony (przycisk statusu bez statusu, plakietka dokumentów, „więcej kodów CPV").

Pasek 4 px z lewej strony karty przetargu jest jedynym grubym obramowaniem w systemie i zawsze koduje wspólny status.

Znane odstępstwo: starsze fragmenty używają promieni 4, 6, 7, 8 i 10 px (pole wyszukiwania, notatki, przycisk eksportu, menu statusu). Nowe elementy biorą promień z tokenów.

## Components

Spokojne i rzeczowe: kontrolki z cienkim obramowaniem na powierzchni karty, wypełnienie tylko dla głównej akcji.

### Buttons
- **Shape:** promień kontrolki (9 px), wysokość 40 px, wewnętrzny odstęp `0 12px`, tekst 14 px.
- **Domyślny (pasek, narzędzia, odnośniki karty):** tło powierzchni, tekst główny, obramowanie 1 px. Odnośniki do ogłoszenia mają grubość 600 i ikonę z odstępem 6 px.
- **Primary:** tło `--button-primary`, biały tekst, grubość 500 (eksport, zapis notatki).
- **Ikonowy:** kwadrat 40 px z ikoną 20 px.
- **Hover / Focus:** hover zmienia tło na powierzchnię podniesioną (primary: na głębszy błękit) w 0.2 s. Fokus z klawiatury to obrys 2 px w `--button-primary` z odsunięciem 2 px. Wyłączony: krycie 0.6.
- **Destrukcyjny:** w spoczynku neutralny; dopiero hover daje czerwone tło 10%, obramowanie i tekst.

### Chips
- **Aktywny filtr:** pigułka, tło akcentu 12%, tekst w akcencie, 13 px / 600, z okrągłym krzyżykiem 20 px, który na hover wypełnia się akcentem.
- **CPV:** promień 7 px, tło podniesione, obramowanie 1 px, 13 px, ucinany wielokropkiem.
- **Plakietki źródła, typu i etykiety:** promień 12 px, `4px 10px`, 12 px / 600–700, kolor z kodowania źródła lub etykiety.
- **Plakietka systemowa:** promień 4 px, obramowanie przerywane, tekst pomocniczy; wariant ostrzegawczy z bursztynowym tłem.

### Cards / Containers
- **Corner Style:** 12 px.
- **Background:** powierzchnia; zagnieżdżone obszary (notatki, kody CPV) na powierzchni podniesionej.
- **Shadow Strategy:** cień karty, patrz Elevation & Depth.
- **Border:** 1 px, a w karcie przetargu dodatkowo pasek statusu 4 px z lewej.
- **Internal Padding:** 20 px, malejąco 16 / 12 / 10 px na węższych ekranach.

### Inputs / Fields
- **Style:** tło podniesione, obramowanie 1 px, wysokość 40 px, tekst 14 px, placeholder w kolorze pomocniczym.
- **Focus:** obramowanie w akcencie i pierścień 3 px z przezroczystego akcentu.
- **Wyszukiwarka:** ikona 18 px z lewej, z prawej znaczek skrótu `/` pismem mono w ramce z grubszą dolną krawędzią.
- **Przełącznik:** tor 34–36 × 20 px, biały suwak 16 px; włączony ma tor w `--button-primary` i przesunięty suwak.

### Navigation
- **Pasek aplikacji:** płaski, tło powierzchni, dolne obramowanie 1 px, znak marki 28 px na niebieskim tle (promień 8 px).
- **Zakładki:** tekst 16 px / 500 w kolorze pomocniczym nad linią 2 px; aktywna ma tekst i podkreślenie 3 px w `--button-primary`, grubość 600 i licznik w tle akcentu.
- **Menu i popovery:** panel na powierzchni, promień 12 px, wnętrze 6 px, opcje 40 px wysokości z promieniem 8 px i hoverem na powierzchni podniesionej.

### Karta przetargu (signature)
Wpis dziennika. Od góry: plakietki źródła, typu i etykiet oraz akcje (gwiazdka, zaznaczenie); tytuł; linia meta z zamawiającym; chipy CPV; odnośniki do ogłoszenia i dokumentacji; drobna stopka. Pasek z lewej przyjmuje kolor wspólnego statusu. Karta wybrana skrótami klawiszowymi dostaje obrys 2 px w akcencie.

### Przycisk statusu (signature)
Bez statusu: przerywana ramka, tekst pomocniczy. Z ustawionym statusem: ciągła ramka w kolorze statusu, kropka 10 px, ikona i tekst główny. Pod spodem podpis 12 px z autorem i czasem zmiany.

### Wykresy statystyk
Każde źródło ma stały kolor serii. Słupki mają dziś pionowy gradient i poświatę w kolorze serii; to jedyne miejsce, gdzie taki efekt jest dopuszczony.

Znane odstępstwo: kalendarz (`react-datepicker`) ma wpisane na sztywno kolory `#2c3e50` i `#3498db`, które nie reagują na motyw.

## Do's and Don'ts

### Do:
- **Do** bierz każdy kolor z tokenów w `src/styles/theme.css` i sprawdzaj oba motywy.
- **Do** używaj `--button-primary` jako tła pod biały tekst, a `--accent` dla tekstu, obrysów i podkreśleń.
- **Do** trzymaj wysokość kontrolek 40 px i promień 9 px; karty i panele 12 px.
- **Do** oznaczaj informacje systemowe linią przerywaną, a decyzje człowieka i elementy klikalne linią ciągłą.
- **Do** pokazuj stan także kształtem lub ikoną (ikona statusu, położenie suwaka), nie samą barwą.
- **Do** zmieniaj na hover tło, nie wysokość; przejścia 0.15–0.2 s i poszanowanie `prefers-reduced-motion`.

### Don't:
- **Don't** używaj koloru, który niczego nie koduje: poza Urzędowym błękitem barwa oznacza status, źródło, etykietę, gwiazdkę albo ostrzeżenie.
- **Don't** dodawaj ozdobnych gradientów, tekstu gradientowego ani poświat. Wyjątkiem są słupki wykresów w statystykach.
- **Don't** dodawaj cienia elementom, które nie przykrywają innej treści.
- **Don't** wprowadzaj grubego kolorowego obramowania poza paskiem statusu karty przetargu.
- **Don't** wpisuj surowych wartości hex w modułach CSS komponentów.
- **Don't** ładuj fontów zewnętrznych; system używa natywnego stosu.
