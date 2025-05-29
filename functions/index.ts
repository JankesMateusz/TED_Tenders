import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { accessSecretVersion } from './secretManager';

// Inicjalizacja Firebase Admin SDK
admin.initializeApp();

// Funkcja HTTP do pobierania API_KEY z Secret Manager
export const getApiKey = functions.https.onRequest(async (req, res) => {
  try {
    const apiKey = await accessSecretVersion('API_KEY');
    res.json({ success: true, value: apiKey });
  } catch (error) {
    console.error('Błąd podczas pobierania API_KEY:', error);
    res.status(500).send('Wystąpił błąd podczas pobierania API_KEY');
  }
}); 