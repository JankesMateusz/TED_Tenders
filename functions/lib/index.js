"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiKey = exports.api = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const secretManager_1 = require("./secretManager");
const axios_1 = require("axios");
const express = require("express");
const cors = require("cors");
// Inicjalizacja Firebase Admin SDK
admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
// Własne nagłówki CORS
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// Obsługa preflight
app.options('*', cors({ origin: true }));
app.post('/tedProxy', async (req, res) => {
    try {
        const apiKey = await (0, secretManager_1.accessSecretVersion)('API_KEY');
        const response = await axios_1.default.post('https://api.ted.europa.eu/v3/notices/search', req.body, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error('Błąd proxy do TED API:', error);
        res.status(500).json({ error: error.message });
    }
});
// (opcjonalnie) endpoint testowy
app.get('/health', (req, res) => {
    res.send('API is working');
});
exports.api = functions.https.onRequest(app);
// Funkcja HTTP do pobierania API_KEY z Secret Manager
exports.getApiKey = functions.https.onRequest(async (req, res) => {
    try {
        const apiKey = await (0, secretManager_1.accessSecretVersion)('API_KEY');
        res.json({ success: true, value: apiKey });
    }
    catch (error) {
        console.error('Błąd podczas pobierania API_KEY:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania API_KEY');
    }
});
//# sourceMappingURL=index.js.map