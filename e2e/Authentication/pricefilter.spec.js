const { test, expect } = require('@playwright/test');

test('Login, Filter OnePlus and Sort by Price', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('https://bstackdemo.com/signin');

  // 2. Select Username ('demouser')
  // Using ID selector for cleaner code than XPath
  await page.locator('#username').click();
  await page.getByText('demouser', { exact: true }).click();

  // 3. Select Password ('testingisfun99')
  await page.locator('#password').click();
  await page.getByText('testingisfun99', { exact: true }).click();

  // 4. Click the Log In button
  await page.locator('#login-btn').click();

  // 5. Verification / Assertion of Login
  await expect(page).not.toHaveURL('https://bstackdemo.com/signin');
  await expect(page.locator('.username')).toHaveText('demouser');

  // 6. Click 'OnePlus' checkbox/filter
  // The checkbox itself has 0 opacity, so we click the checkmark span or the label
  await page.locator('label').filter({ hasText: 'OnePlus' }).click();

  // 7. Select "Highest to lowest" from the "Order by" dropdown
  await page.getByRole('combobox').selectOption('highestprice');

  // 8. Verification / Assertions for Filter + Sort
  // Filter is applied: OnePlus checkbox is checked
  await expect(page.locator('input[value="OnePlus"]')).toBeChecked({ timeout: 5000 });
  // Sort is applied: dropdown shows "Highest to lowest"
  await expect(page.getByRole('combobox')).toHaveValue('highestprice');

  // All visible products are OnePlus (filter applied correctly)
  const visibleCards = page.locator('.shelf-item');
  await expect(visibleCards.first()).toBeVisible({ timeout: 5000 });
  for (let i = 0; i < await visibleCards.count(); i++) {
    await expect(visibleCards.nth(i)).toContainText('One Plus');
  }

  // Products reorder from highest to lowest price (non-increasing: ties allowed,
  // e.g. One Plus 8T and One Plus 8 Pro both cost $899.00 on bstackdemo).
  const priceTexts = await page.locator('.shelf-item__price').allTextContents();
  const prices = priceTexts.map((t) => {
    const match = String(t).match(/\$([\d,]+\.\d{2})/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  });
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
  }

  // 9. Take a screenshot
  await page.screenshot({ path: 'screenshots/oneplus-highest-price.png', fullPage: true });
});