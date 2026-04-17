const { chromium } = require('playwright');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

(async () => {
    let browser;
    try {
        browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        console.log("Navigating to URL...");
        await page.goto('https://project-superend-cen8.vercel.app', { waitUntil: 'networkidle' });

        const username = process.env.E2E_USER_USERNAME;
        const password = process.env.E2E_USER_PASSWORD;

        if (!username || !password) {
            console.error("Missing E2E_USER_USERNAME or E2E_USER_PASSWORD in environment.");
            process.exit(1);
        }

        console.log("Filling login form...");
        // Fallback to more generic selectors if placeholder fail
        const userSelector = 'input[placeholder*="Username" i], input[name="username"], input[name="email"], input[type="text"]';
        const passSelector = 'input[placeholder*="Password" i], input[name="password"], input[type="password"]';
        
        await page.waitForSelector(userSelector, { timeout: 10000 });
        await page.fill(userSelector, username);
        await page.fill(passSelector, password);

        console.log("Clicking login...");
        await page.click('button:has-text("Login"), button[type="submit"]');

        console.log("Waiting for navigation/state change...");
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        const isUsernameVisible = await page.isVisible(userSelector);
        
        const dialogHeading = await page.evaluate(() => {
            const el = document.querySelector('[role="dialog"] h1, [role="dialog"] h2, h1, h2');
            return el ? el.innerText : 'Not found';
        });

        const bodyText = await page.innerText('body');
        const first200BodyText = bodyText.substring(0, 200).replace(/\n/g, ' ');

        const localStorageToken = await page.evaluate(() => {
            return !!(localStorage.getItem('token') || localStorage.getItem('authToken') || Object.keys(localStorage).find(k => k.toLowerCase().includes('token')));
        });

        const sessionStorageToken = await page.evaluate(() => {
            return !!(sessionStorage.getItem('token') || sessionStorage.getItem('authToken') || Object.keys(sessionStorage).find(k => k.toLowerCase().includes('token')));
        });

        const cookies = await context.cookies();
        const cookieCount = cookies.length;

        console.log(`URL: ${currentUrl}`);
        console.log(`Username Input Visible: ${isUsernameVisible}`);
        console.log(`Heading: ${dialogHeading}`);
        console.log(`Body Text (first 200 chars): ${first200BodyText}`);
        console.log(`localStorage Token Present: ${localStorageToken}`);
        console.log(`sessionStorage Token Present: ${sessionStorageToken}`);
        console.log(`Cookie Count: ${cookieCount}`);

    } catch (err) {
        console.error("Error occurred:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
