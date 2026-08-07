const { test, expect } = require('@playwright/test');

test.describe('Login Functionality Scenarios', () => {
    
    // Selectors
    const USERNAME_SELECTOR = 'input[name="username"]';
    const PASSWORD_SELECTOR = 'input[name="password"]';
    const LOGIN_BUTTON = 'button[type="submit"]';
    const ERROR_ALERT = '.oxd-alert-content'; // Class used by OrangeHRM for invalid credentials

    test.beforeEach(async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/');
    });

    // --- POSITIVE SCENARIO ---
    test('Positive Scenario: Should login successfully with valid credentials', async ({ page }) => {
        const username = page.locator(USERNAME_SELECTOR);
        const password = page.locator(PASSWORD_SELECTOR);
        const button = page.locator(LOGIN_BUTTON);

        // Fill credentials
        await username.fill('Admin');
        await password.fill('admin123');

        // Condition: Check if button is enabled before clicking
        if (await button.isEnabled()) {
            await button.click();
        } else {
            throw new Error("Login button is disabled even with valid input.");
        }

        // Wait for navigation/processing and assert dashboard UI is visible (robust)
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        const dashboardHeading = page.getByRole('heading', { name: /Dashboard/i }).first();
        await expect(dashboardHeading).toBeVisible({ timeout: 20000 });
        console.log("Positive Scenario Passed: User logged in and dashboard is visible.");
    });
    
});