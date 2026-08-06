const { expect } = require('@playwright/test');

class LoginPage {
  /**
   * Page Object Model for OrangeHRM login page
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Using placeholder-based locators
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.alert = page.locator('.oxd-alert-content-text');
  }

  async goto() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    // Wait for username field to be visible after page load
    await expect(this.username).toBeVisible({ timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async login(username, password) {
    // Fill fields (allow empty strings)
    await this.username.fill(username ?? '');
    await this.password.fill(password ?? '');
    await this.loginButton.click();
  }

  async expectErrorVisible(timeout = 15000) {
    await expect(this.alert).toBeVisible({ timeout });
    return this.alert;
  }
}

module.exports = LoginPage;
