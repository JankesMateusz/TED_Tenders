import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { accessSecretVersion } from './secretManager';
import axios from 'axios';
import * as corsLib from 'cors';

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

// Funkcja proxy do TED API z obsługą CORS
const cors = corsLib({ origin: true });

export const tedProxy = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const apiKey = await accessSecretVersion('API_KEY');
      const response = await axios.post(
        'https://api.ted.europa.eu/v3/notices/search',
        req.body,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Błąd proxy do TED API:', error);
      res.status(500).json({ error: error.message });
    }
  });
}); 