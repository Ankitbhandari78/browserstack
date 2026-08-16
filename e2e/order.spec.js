const { test, expect } = require('@playwright/test');

test('Login, Add Apple iPhone 12 to Cart, and Checkout', async ({ page }) => {
  // 1. STEP 1: START AT LOGIN PAGE
  await page.goto('https://bstackdemo.com/signin');

  // Select Username ('demouser')
  await page.locator('#username').click();
  await page.getByText('demouser', { exact: true }).click();

  // Select Password ('testingisfun99')
  await page.locator('#password').click();
  await page.getByText('testingisfun99', { exact: true }).click();

  // Click LOG IN button
  await page.locator('#login-btn').click();

  // Verify successful login
  await expect(page.locator('.username')).toHaveText('demouser');

  // 2. STEP 2: FILTER & ADD PRODUCT TO CART
  // Click Apple vendor filter
  await page.getByText('Apple', { exact: true }).click();

  // Locate iPhone 12 and click 'Add to cart'
  await page
    .locator('.shelf-item')
    .filter({ hasText: 'iPhone 12' })
    .first()
    .locator('.shelf-item__buy-btn')
    .click();

  // 3. STEP 3: CHECKOUT FLOW
  // Click Checkout button inside the cart drawer
  await page.getByText('Checkout').click();

  // Fill shipping details
  await page.locator('#firstNameInput').fill('John');
  await page.locator('#lastNameInput').fill('Doe');
  await page.locator('#addressLine1Input').fill('123 Test Street');
  await page.locator('#provinceInput').fill('California');
  await page.locator('#postCodeInput').fill('90001');

  // Submit shipping details
  await page.locator('#checkout-shipping-continue').click();

  // 3.5 STEP: ORDER COMPLETE - CAPTURE SCREENSHOT
  // Wait for the order confirmation to be visible
  await expect(
    page.getByText(/Your Order has been successfully placed/i)
  ).toBeVisible({ timeout: 5000 });

  // Take a screenshot of the order confirmation page
  await page.screenshot({
    path: 'screenshots/order-confirmation.png',
    fullPage: true,
  });

  // 4. STEP 4: CONTINUE SHOPPING
  // Click 'Continue Shopping' on the order confirmation page
  await page.getByRole('button', { name: 'Continue Shopping' }).click();

  // Assert redirection back to store main page
  await expect(page).toHaveURL('https://bstackdemo.com/');
});