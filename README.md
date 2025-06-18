# Zamówienia TED - Wyszukiwarka zamówień publicznych

Aplikacja React do przeglądania i filtrowania zamówień publicznych z bazy TED (Tenders Electronic Daily). Aplikacja jest w pełni responsywna i zoptymalizowana dla urządzeń mobilnych.

## Funkcje

- 📱 **W pełni responsywna** - działa świetnie na wszystkich urządzeniach
- 🌙 **Tryb ciemny/jasny** - automatyczne przełączanie motywów
- 🔍 **Filtrowanie** - tylko zamówienia IT lub wszystkie branże
- ⭐ **Ulubione** - zapisywanie interesujących przetargów
- 📧 **Powiadomienia email** - wysyłanie wybranych przetargów na email
- 📅 **Wybór daty** - przeglądanie przetargów z konkretnego dnia
- 🏷️ **Kody CPV** - szczegółowe informacje o kodach klasyfikacji
- 📊 **Statusy** - oznaczanie przetargów do udziału lub rezygnacji

## Responsywność

Aplikacja została zaprojektowana z myślą o urządzeniach mobilnych:

- **Mobile-first design** - projektowanie zaczynając od urządzeń mobilnych
- **Touch-friendly** - przyciski i interakcje zoptymalizowane dla dotyku
- **Adaptive layout** - układ dostosowuje się do różnych rozmiarów ekranów
- **PWA ready** - może być zainstalowana jako aplikacja na urządzeniach mobilnych

### Breakpointy

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px  
- **Mobile**: 480px - 768px
- **Small Mobile**: < 480px

## Technologie

- **React 19** - nowoczesny framework JavaScript
- **TypeScript** - typowanie statyczne
- **CSS Modules** - modułowe style
- **React DatePicker** - komponent wyboru daty
- **Axios** - HTTP client
- **PostCSS + Autoprefixer** - automatyczne prefiksy CSS

## Instalacja i uruchomienie

### Wymagania

- Node.js 16+ 
- npm lub yarn

### Instalacja

```bash
# Klonowanie repozytorium
git clone <repository-url>
cd ted-eu

# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm start
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000)

### Build produkcyjny

```bash
npm run build
```

## Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── Header.tsx      # Nagłówek z kontrolkami
│   ├── Tenders.tsx     # Główny komponent listy przetargów
│   └── EmailAlertDialog.tsx # Dialog powiadomień email
├── context/            # Konteksty React
│   ├── ThemeContext.tsx # Zarządzanie motywami
│   └── UserPreferencesContext.tsx # Preferencje użytkownika
├── services/           # Serwisy API
├── utils/              # Funkcje pomocnicze
└── styles/             # Style globalne
```

## Dostosowywanie

### Motywy

Aplikacja używa CSS Custom Properties do motywów. Możesz dostosować kolory w `src/styles/theme.css`.

### Responsywność

Style responsywne są zdefiniowane w każdym pliku CSS Module z użyciem media queries:

```css
@media (max-width: 768px) {
  /* Style dla urządzeń mobilnych */
}

@media (max-width: 480px) {
  /* Style dla małych urządzeń mobilnych */
}
```

## Deployment

Aplikacja jest gotowa do deploymentu na Firebase Hosting:

```bash
npm run build
firebase deploy
```

## Licencja

MIT License
