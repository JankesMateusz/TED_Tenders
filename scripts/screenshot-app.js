/**
 * Zrzut ekranu działającej aplikacji (serwer deweloperski) albo szkicu docs/prototyp/prototyp-ux.html.
 * Służy do porównań wizualnych w planie docs/plan-wdrozenia-ui.md. Tylko odczyt: nie klika statusów,
 * gwiazdek ani komentarzy (projekt testowy jest wspólny).
 *
 * Użycie (serwer: BROWSER=none PORT=3111 npx react-scripts start):
 *   node scripts/screenshot-app.js --out C:/tmp/lista.png
 *   node scripts/screenshot-app.js --out C:/tmp/stat.png --tab Statystyki --theme light --width 390 --height 800
 *   node scripts/screenshot-app.js --out C:/tmp/szkic.png --url file:///C:/.../docs/prototyp/prototyp-ux.html
 *
 * Opcje: --url (domyślnie http://localhost:3111), --width (1600), --height (1000), --theme dark|light (dark),
 *        --tab "Zapisane"|"Statystyki" (domyślnie pierwsza zakładka), --full (cała strona), --wait ms (4000).
 * Wypisuje błędy konsoli przeglądarki, jeśli jakieś były.
 */
const path = require('path');
const puppeteer = require('puppeteer');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

const out = opt('out');
if (!out) {
    console.error('Podaj --out <plik.png>');
    process.exit(2);
}
const url = opt('url', 'http://localhost:3111');
const width = Number(opt('width', 1600));
const height = Number(opt('height', 1000));
const theme = opt('theme', 'dark');
const tab = opt('tab', null);
const waitMs = Number(opt('wait', 4000));

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const errors = [];
    page.on('console', async (message) => {
        if (message.type() !== 'error') return;
        const parts = [];
        for (const arg of message.args()) {
            try {
                parts.push(await arg.evaluate((x) => (x && x.code ? `${x.code}: ${x.message}` : String(x))));
            } catch {
                parts.push('?');
            }
        }
        const text = parts.join(' ').trim();
        if (text) errors.push(text.slice(0, 240));
    });
    await page.setViewport({ width, height });
    // Motyw aplikacji czyta localStorage; szkic (i ostatecznie oba) ustawiamy też atrybutem
    await page.evaluateOnNewDocument((t) => {
        try { localStorage.setItem('theme', t); } catch (e) { /* file:// bywa zablokowane */ }
    }, theme);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; document.body.dataset.theme = t; }, theme);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    if (tab) {
        const clicked = await page.evaluate((name) => {
            const el = [...document.querySelectorAll('[role="tab"], button')].find((b) => b.textContent.trim().startsWith(name));
            if (el) el.click();
            return Boolean(el);
        }, tab);
        if (!clicked) errors.push(`Nie znaleziono zakładki "${tab}"`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    await page.screenshot({ path: path.resolve(out), fullPage: flag('full') });
    await browser.close();
    console.log(`Zapisano ${path.resolve(out)}`);
    if (errors.length) console.log('Błędy konsoli:\n' + errors.join('\n'));
})().catch((error) => {
    console.error('Błąd:', error.message);
    process.exit(1);
});
