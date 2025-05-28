"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessSecretVersion = accessSecretVersion;
const secret_manager_1 = require("@google-cloud/secret-manager");
// Utwórz klienta
const client = new secret_manager_1.SecretManagerServiceClient();
async function accessSecretVersion(secretName) {
    // Określ nazwę sekretu
    const name = `projects/${process.env.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`;
    try {
        // Pobierz wersję sekretu
        const [version] = await client.accessSecretVersion({
            name: name,
        });
        if (!version.payload || !version.payload.data) {
            throw new Error('Nieprawidłowa odpowiedź z Secret Manager - brak danych');
        }
        // Dane sekretu są w postaci buffer, przekonwertuj na string
        const secretValue = version.payload.data.toString();
        console.log(`Pobrano sekret: ${secretName}`);
        return secretValue;
    }
    catch (err) {
        console.error('Nie udało się pobrać sekretu:', err);
        throw err;
    }
}
// Przykład użycia:
// const apiKey = await accessSecretVersion('TWOJA_NAZWA_SEKRETU'); 
//# sourceMappingURL=secretManager.js.map