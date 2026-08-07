const { test, expect } = require('@playwright/test');
const LoginPage = require('./login.page'); // same folder, so ./login.page

let loginPage;

test.describe('OrangeHRM Login (opensource-demo)', () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(15000);
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('positive: login with valid credentials', async ({ page }) => {
    await loginPage.login('Admin', 'admin123');

    // 1. Verify URL contains /dashboard after login
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });

    // 2. Verify Dashboard heading is visible
    const dashboard = page.getByRole('heading', { name: 'Dashboard' });
    await expect(dashboard).toBeVisible({ timeout: 15000 });

    // 3. Verify key dashboard elements are displayed (side menu + user profile)
    const sideMenu = page.locator('.oxd-sidepanel');
    const userProfile = page.getByRole('banner').getByAltText('profile picture');
    await expect(sideMenu).toBeVisible({ timeout: 15000 });
    await expect(userProfile).toBeVisible({ timeout: 15000 });
  });

  test('negative: invalid password shows error', async ({ page }) => {
    await loginPage.login('Admin', 'wrongpassword');
    const alert = await loginPage.expectErrorVisible();
    await expect(alert).toHaveText(/Invalid credentials/i);
  });
});
