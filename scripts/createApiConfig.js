const fs = require('fs');
const path = require('path');

const apiConfig = `export const API_CONFIG = {
  API_KEY: '${process.env.TED_API_KEY || 'YOUR_API_KEY_HERE'}',
  BASE_URL: 'https://api.ted.europa.eu/api/v2',
} as const;

// Typy dla konfiguracji
export type ApiConfig = typeof API_CONFIG;
`;

const buildDir = path.join(__dirname, '../build/static/js');
const configDir = path.join(buildDir, 'config');

// Upewnij się, że katalog istnieje
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Zapisz plik konfiguracyjny
fs.writeFileSync(path.join(configDir, 'api.ts'), apiConfig);

console.log('API config file created successfully!'); 