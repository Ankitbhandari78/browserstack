const { test, expect } = require('@playwright/test');

test('Login to Homepage and Logout Flow', async ({ page }) => {
  // 1. START AT LOGIN PAGE
  await page.goto('https://bstackdemo.com/signin');

  // 2. ENTER LOGIN CREDENTIALS
  // Using selectOption or clicking the specific div based on how this demo site works
  await page.locator('#username input').fill('demouser'); // Better to use fill if it's an input
  await page.keyboard.press('Enter'); 
  
  await page.locator('#password input').fill('testingisfun99');
  await page.keyboard.press('Enter');

  await page.locator('#login-btn').click();

  // 3. VERIFY USER IS LOGGED IN ON HOMEPAGE
  // The username element usually appears next to the logout button
  await expect(page.locator('.username')).toHaveText('demouser');

  // ------------------------------------------------------------------
  // 4. CLICK LOGOUT
  // ------------------------------------------------------------------
  // High reliability locator: targeting the ID that specifically contains 'Logout' text
  const logoutBtn = page.locator('#signin', { hasText: 'Logout' });
  await logoutBtn.click();

  // ------------------------------------------------------------------
  // 5. VERIFY LOGOUT SUCCESS
  // ------------------------------------------------------------------
  
  // A. Verify username is gone
  await expect(page.locator('.username')).not.toBeVisible();

  // B. Verify the element #signin now displays "Sign In" instead of "Logout"
  const signinLink = page.locator('#signin');
  await expect(signinLink).toHaveText('Sign In');
}); 