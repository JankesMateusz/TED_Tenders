"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiKey = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const secretManager_1 = require("./secretManager");
// Inicjalizacja Firebase Admin SDK
admin.initializeApp();
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