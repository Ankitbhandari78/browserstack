const { expect } = require('@playwright/test');

// Page Object Model for the BrowserStack demo sign-in flow
// (mirrors e2e/file.spec.js).
class BstackDemoLoginPage {
  constructor(page) {
    this.page = page;

    // --- Sign-in form locators ---
    // bstackdemo uses custom dropdown containers backed by #username/#password.
    this.usernameDropdown = page.locator('#username');
    this.passwordDropdown = page.locator('#password');
    this.loginButton = page.locator('#login-btn');

                // --- Post-login verification locators ---
    this.loggedInUser = page.locator('.username');
    // User-facing locator: the "Logout" link only appears once authenticated.
    // (The brittle `#logout` id asserted in the spec does not exist, so we
    // rely on visible text instead, which is both robust and semantic.)
    this.logoutLink = page.getByText('Logout');

    // --- Error message locator (visible on failed login attempts) ---
    this.errorMessage = page.locator('.api-error');
  }

  // Navigate to the sign-in page and wait for the form to be ready.
  async goto() {
    await this.page.goto('https://bstackdemo.com/signin');
    await expect(this.loginButton).toBeVisible({ timeout: 5000 });
  }

  // Perform a login by selecting credentials from the custom dropdowns.
  async login(username, password) {
    await this.usernameDropdown.click();
    await this.page.locator(`xpath=//*[text()="${username}"]`).click();

    await this.passwordDropdown.click();
    await this.page.locator(`xpath=//*[text()="${password}"]`).click();

    await this.loginButton.click();
  }

  // Verify that the session is authenticated.
  async expectLoggedInAs(username) {
    // 1. URL redirected to the homepage (away from the /signin page).
    await expect(this.page).toHaveURL(
      'https://bstackdemo.com/?signin=true',
      { timeout: 10000 }
    );

    // 2. The logged-in username is displayed in the header.
    await expect(this.loggedInUser).toHaveText(username, {
      timeout: 10000
    });

    // 3. The Logout link is visible (confirms an active session).
    await expect(this.logoutLink).toBeVisible({ timeout: 10000 });
  }
}

module.exports = BstackDemoLoginPage;
