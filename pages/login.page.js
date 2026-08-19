const { expect } = require('@playwright/test');

// Demo credentials & URLs for bstackdemo.com — kept ONLY in the page model.
const LOGIN_URL = 'https://bstackdemo.com/signin';
const DEFAULT_USERNAME = 'demouser';
const DEFAULT_PASSWORD = 'testingisfun99';
const LOCKED_USERNAME = 'locked_user';

// Page Object Model for the bstackdemo.com sign-in workflow.
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameDropdown = page.locator('#username');
    this.passwordDropdown = page.locator('#password');
    this.loginButton = page.locator('#login-btn');
    this.loggedInUser = page.locator('.username');
    this.errorMessage = page.locator('.api-error');
  }

  // Navigate to the sign-in page.
  async goto() {
    await this.page.goto(LOGIN_URL);
  }

  // Open the username dropdown and pick an option.
  async selectUsername(username) {
    await this.usernameDropdown.click();
    await this.page.getByText(username, { exact: true }).click();
  }

  // Open the password dropdown and pick an option.
  async selectPassword(password) {
    await this.passwordDropdown.click();
    await this.page.getByText(password, { exact: true }).click();
  }

  // Click the Log In button.
  async clickLogin() {
    await this.loginButton.click();
  }

  // Perform the full login flow using the demo defaults.
  async login(username = DEFAULT_USERNAME, password = DEFAULT_PASSWORD) {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.clickLogin();
  }

  // Verify the user is no longer on the sign-in page.
  async expectLoggedInPage() {
    await expect(this.page).not.toHaveURL(LOGIN_URL, { timeout: 5000 });
  }

  // Verify the session is authenticated.
  async expectLoggedInAs(username) {
    await expect(this.loggedInUser).toHaveText(username, { timeout: 5000 });
  }

  // Verify a default login: redirected away from sign-in and user name shown.
  async expectLoggedIn() {
    await this.expectLoggedInPage();
    await this.expectLoggedInAs(DEFAULT_USERNAME);
  }

  // ------------------------------------------------------------------
  // Negative login helpers (credentials stay inside the page model).
  // ------------------------------------------------------------------

  // Assert the error message shown after a failed login.
  async expectErrorMessage(message) {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.errorMessage).toHaveText(message);
  }

  // Submit login with no credentials selected.
  async loginWithNoCredentials() {
    await this.clickLogin();
  }

  // Submit login with username only (no password).
  async loginWithUsernameOnly() {
    await this.selectUsername(DEFAULT_USERNAME);
    await this.clickLogin();
  }

  // Submit login with password only (no username).
  async loginWithPasswordOnly() {
    await this.selectPassword(DEFAULT_PASSWORD);
    await this.clickLogin();
  }

  // Submit login with the locked demo account.
  async loginWithLockedUser() {
    await this.selectUsername(LOCKED_USERNAME);
    await this.selectPassword(DEFAULT_PASSWORD);
    await this.clickLogin();
  }
}

module.exports = { LoginPage };
