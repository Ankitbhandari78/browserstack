const { expect } = require('@playwright/test');

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
    await this.page.goto('https://bstackdemo.com/signin');
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

  // Perform the full login flow.
  async login(username = 'demouser', password = 'testingisfun99') {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.clickLogin();
  }

  // Verify the session is authenticated.
  async expectLoggedInAs(username) {
    await expect(this.loggedInUser).toHaveText(username, { timeout: 5000 });
  }
}

module.exports = { LoginPage };
