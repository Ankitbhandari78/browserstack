const { test, expect } = require('@playwright/test');

/**
 * Toggles a vendor filter checkbox on/off.
 * Filter structure: label > input[type="checkbox"] + span.checkmark
 * We click the visible label (text/checkmark) to toggle reliably instead of
 * force-clicking the hidden input (which can miss on re-render/animation).
 */
async function toggleBrandFilter(page, brandLabel, on) {
  const checkbox = page.locator(`input[value="${brandLabel}"]`);
  // Click the visible filter row to toggle state
  await page.locator('label', { hasText: brandLabel }).click();
  if (on) {
    await expect(checkbox).toBeChecked();
  } else {
    await expect(checkbox).not.toBeChecked();
  }
}

test('Buy Samsung Galaxy S20 + Google Pixel 4, then Checkout', async ({ page }) => {
  // ------------------------------------------------------------------
  // STEP 1: LOGIN
  // ------------------------------------------------------------------
  await page.goto('https://bstackdemo.com/signin');

  await page.locator('#username').click();
  await page.getByText('demouser', { exact: true }).click();

  await page.locator('#password').click();
  await page.getByText('testingisfun99', { exact: true }).click();

  await page.locator('#login-btn').click();
  await expect(page.locator('.username')).toHaveText('demouser');

  // ------------------------------------------------------------------
  // STEP 2: SAMSUNG FILTER + ADD GALAXY S20
  // ------------------------------------------------------------------
  await toggleBrandFilter(page, 'Samsung', true);

  await page
    .locator('.shelf-item')
    .filter({ has: page.getByText('Galaxy S20', { exact: true }) })
    .locator('.shelf-item__buy-btn')
    .click();

  // Close the cart drawer so the filters are reachable again.
  await page.locator('.float-cart__close-btn').click();

  // ------------------------------------------------------------------
  // STEP 3: SWITCH TO GOOGLE FILTER + ADD PIXEL 4
  // ------------------------------------------------------------------
  await toggleBrandFilter(page, 'Samsung', false);
  await toggleBrandFilter(page, 'Google', true);

  // Pixel 4 product container id is "17" (user-provided element).
  await page.locator('div[id="17"] .shelf-item__buy-btn').click();

  // ------------------------------------------------------------------
  // STEP 4: VERIFY BOTH ITEMS (DRAWER IS OPEN) + CHECKOUT
  // ------------------------------------------------------------------
  const drawerItems = page.locator('.float-cart .shelf-item');
  await expect(drawerItems).toHaveCount(2);
  await expect(drawerItems.filter({ hasText: 'Galaxy S20' })).toBeVisible();
  await expect(drawerItems.filter({ hasText: 'Pixel 4' })).toBeVisible();

  await page.getByText('Checkout').click();

  // Confirm we moved to the shipping page
  await expect(page).toHaveURL(/.*(signin|checkout)/);

  // ------------------------------------------------------------------
  // STEP 5: SHIPPING FORM
  // ------------------------------------------------------------------
  await page.locator('#firstNameInput').fill('John');
  await page.locator('#lastNameInput').fill('Doe');
  await page.locator('#addressLine1Input').fill('123 Test Street');
  await page.locator('#provinceInput').fill('California');
  await page.locator('#postCodeInput').fill('90001');

  await page.locator('#checkout-shipping-continue').click();

  // ------------------------------------------------------------------
  // STEP 6: CONFIRMATION + SCREENSHOT + CONTINUE SHOPPING
  // ------------------------------------------------------------------
  await expect(
    page.getByText(/Your Order has been successfully placed/i)
      .or(page.locator('#confirmation-message'))
  ).toBeVisible({ timeout: 15000 });

  await page.screenshot({
    path: 'screenshots/multi-vendor-confirmation.png',
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await expect(page).toHaveURL('https://bstackdemo.com/');
});