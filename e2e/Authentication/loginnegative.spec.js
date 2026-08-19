const { test } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');

test.describe('Login Negative Scenarios', () => {
  let loginPage;

  // Shared: fresh page object per test navigating to the sign-in page.
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('no credentials -> Invalid Username', async () => {
    await loginPage.loginWithNoCredentials();
    await loginPage.expectErrorMessage('Invalid Username');
  });

  test('username only (no password) -> Invalid Password', async () => {
    await loginPage.loginWithUsernameOnly();
    await loginPage.expectErrorMessage('Invalid Password');
  });

  test('password only (no username) -> Invalid Username', async () => {
    await loginPage.loginWithPasswordOnly();
    await loginPage.expectErrorMessage('Invalid Username');
  });

  test('locked user -> account locked message', async () => {
    await loginPage.loginWithLockedUser();
    await loginPage.expectErrorMessage('Your account has been locked.');
  });
});
