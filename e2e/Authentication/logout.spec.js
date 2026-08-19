const { test, expect } = require('@playwright/test');

test('Positive Login and Logout Test Case', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('https://bstackdemo.com/signin');

  // 2. Select Username ('demouser')
  // Click the username container to open dropdown
  await page.locator('xpath=//*[@id="username"]').click();
  // Select the 'demouser' option from the dropdown list
  await page.locator('xpath=//*[text()="demouser"]').click();

  // 3. Select Password ('testingisfun99')
  // Click the password container to open dropdown
  await page.locator('xpath=//*[@id="password"]').click();
  // Select the 'testingisfun99' option from the dropdown list
  await page.locator('xpath=//*[text()="testingisfun99"]').click();

  // 4. Click the Log In button
  await page.locator('xpath=//*[@id="login-btn"]').click();

  // 5. Verification / Assertion for Login
  // Verify successful login by checking the URL or user profile text
  await expect(page).not.toHaveURL('https://bstackdemo.com/signin');
  await expect(page.locator('.username')).toHaveText('demouser');

 
  // 6. LOGOUT FLOW
 
  // The logout control is a navigation link named "Logout".
  const logoutBtn = page.getByRole('link', { name: 'Logout' });
  await expect(logoutBtn).toBeVisible({ timeout: 5000 });
  await logoutBtn.click();

  // 7. Verification / Assertion for Logout
  // After logout bstackdemo stays on the homepage and shows the "Sign In" link again.
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.username')).not.toBeVisible();
  await expect(logoutBtn).not.toBeVisible();
});