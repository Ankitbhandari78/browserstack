class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // URL
    this.url = 'https://bstackdemo.com/signin';

    // Locators
    this.usernameDropdown = page.locator('#username');
    this.passwordDropdown = page.locator('#password');
    this.loginButton = page.locator('#login-btn');
    this.errorMessage = page.locator('.api-error');

    // Container / Logo element based on your DOM query (.flex.justify-center.pb-12)
    this.logoContainer = page.locator('.flex.justify-center.pb-12');
  }

  /**
   * Navigates to the sign-in page
   */
  async navigate() {
    await this.page.goto(this.url);
  }

  /**
   * Selects username from the dropdown
   * @param {string} username - e.g., 'demouser'
   */
  async selectUsername(username) {
    await this.usernameDropdown.click();
    await this.page.getByText(username, { exact: true }).click();
  }

  /**
   * Selects password from the dropdown
   * @param {string} password - e.g., 'testingisfun99'
   */
  async selectPassword(password) {
    await this.passwordDropdown.click();
    await this.page.getByText(password, { exact: true }).click();
  }

  /**
   * Clicks the Log In button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Performs the full login flow
   * @param {string} username 
   * @param {string} password 
   */
  async login(username = 'demouser', password = 'testingisfun99') {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.clickLogin();
  }
}

module.exports = LoginPage;