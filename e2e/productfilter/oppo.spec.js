const { test, expect } = require('@playwright/test');

test('Positive Login and Complete Purchase Flow', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('https://bstackdemo.com/signin');

  // 2. Select Username ('demouser')
  await page.locator('xpath=//*[@id="username"]').click();
  await page.locator('xpath=//*[text()="demouser"]').click();

  // 3. Select Password ('testingisfun99')
  await page.locator('xpath=//*[@id="password"]').click();
  await page.locator('xpath=//*[text()="testingisfun99"]').click();

  // 4. Click the Log In button
  await page.locator('xpath=//*[@id="login-btn"]').click();

  // 5. Verification / Assertion for Login
  await expect(page).not.toHaveURL('https://bstackdemo.com/signin');
  await expect(page.locator('.username')).toHaveText('demouser');

  // ------------------------------------------------------------------
  // 6. Filter by Vendor (OnePlus)
  // ------------------------------------------------------------------
  const onePlusFilter = page.locator('input[value="OnePlus"]');
  if (await onePlusFilter.isVisible()) {
    await onePlusFilter.check({ force: true });
  } else {
    // Click the visual text span if input is hidden by CSS
    await page.locator('span.checkmark', { hasText: 'OnePlus' }).click();
  }

  // 7. Add Phone to Cart
  const addToCartBtn = page.locator('xpath=//p[text()="One Plus 8"]/following-sibling::div[text()="Add to cart"]');
  await addToCartBtn.waitFor({ state: 'visible' });
  await addToCartBtn.click();

  // 8. Click Checkout Button in Cart Drawer
  const checkoutBtn = page.locator('xpath=//div[text()="Checkout"]');
  await checkoutBtn.waitFor({ state: 'visible' });
  await checkoutBtn.click();

  // ------------------------------------------------------------------
  // 9. Fill Shipping Address Form
  // ------------------------------------------------------------------
  // Fallback to robust name/label attributes if IDs are dynamic
  const firstName = page.locator('#firstNameInput').or(page.locator('input[name="firstName"]')).or(page.getByLabel('First Name'));
  await firstName.waitFor({ state: 'visible' });
  await firstName.fill('John');

  const lastName = page.locator('#lastNameInput').or(page.locator('input[name="lastName"]')).or(page.getByLabel('Last Name'));
  await lastName.fill('Doe');

  const address = page.locator('#addressLine1Input').or(page.locator('input[name="address1"]')).or(page.getByLabel('Address'));
  await address.fill('123 QA Automation St');

  const province = page.locator('#provinceInput').or(page.locator('input[name="province"]')).or(page.getByLabel('State/Province'));
  await province.fill('California');

  const postCode = page.locator('#postCodeInput').or(page.locator('input[name="postCode"]')).or(page.getByLabel('Postal Code'));
  await postCode.fill('90210');

  // 10. Submit Order
  const submitBtn = page.locator('#checkout-shipping-continue')
    .or(page.locator('#checkout-payment-continue'))
    .or(page.getByRole('button', { name: 'Submit' }));

  await submitBtn.click();

  // 11. Assert Order Placement Success
  await expect(
    page.getByText(/Your Order has been successfully placed/i)
      .or(page.locator('#confirmation-message'))
  ).toBeVisible({ timeout: 15000 });
});