const { test } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');

test('Positive Login Test Case', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to the sign-in page (URL lives in the page model).
  await loginPage.goto();

  // Perform the full login flow (username/password live in the page model).
  await loginPage.login();

  // Verify successful login (URL + username assertions live in the page model).
  await loginPage.expectLoggedIn();
});