export const API_CONFIG = {
  API_KEY: 'YOUR_API_KEY_HERE', // TODO: Replace with your actual API key
  BASE_URL: 'https://api.ted.europa.eu/api/v2',
} as const;

// Typy dla konfiguracji
export type ApiConfig = typeof API_CONFIG; 