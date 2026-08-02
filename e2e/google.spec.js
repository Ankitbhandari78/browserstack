const { test, expect } = require('@playwright/test');

test('Search Amazon on Google and then search mobile phones', async ({ page }) => {
  // Navigate to Google
  await page.goto('https://google.com');

  // Assertion: Verify the page title contains "Google"
  await expect(page).toHaveTitle(/Google/);

  // Search for Amazon on Google
  const googleSearchBox = page.locator('textarea[name="q"], input[name="q"]').first();
  await googleSearchBox.fill('amazon');
  await googleSearchBox.press('Enter');

  // Click the Amazon result link
  const amazonResult = page.locator('a[href*="amazon.com"]').filter({ hasText: /amazon/i }).first();
  await expect(amazonResult).toBeVisible({ timeout: 15000 });
  await amazonResult.click();

  // Wait for the Amazon page to open
  await expect(page).toHaveURL(/amazon\.com/i, { timeout: 15000 });

  // Search for mobile phones and wait for the results to load
  const amazonSearchBox = page.locator('#twotabsearchtextbox').first();
  await expect(amazonSearchBox).toBeVisible({ timeout: 15000 });
  await amazonSearchBox.fill('mobile phones');
  await page.locator('#nav-search-submit-button').click();
  await page.waitForLoadState('networkidle');

  // Optional: wait to see the page
  await page.waitForTimeout(3000);
});

