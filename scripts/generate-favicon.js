const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to exact favicon size
    await page.setViewport({ width: 64, height: 64 });
    
    // Load the temp HTML file
    await page.goto(`file:${path.join(__dirname, '../public/temp-logo.html')}`);
    
    // Take screenshot
    await page.screenshot({
        path: path.join(__dirname, '../public/favicon.ico'),
        type: 'png'
    });
    
    await browser.close();
}

generateFavicon().catch(console.error); 