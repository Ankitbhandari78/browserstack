const { test, expect } = require('@playwright/test');

test('explore login error messages', async ({ page }) => {
  test.setTimeout(50000);
  await page.goto('https://bstackdemo.com/signin', { waitUntil: 'networkidle', timeout: 15000 });

  // --- Explore username dropdown options ---
  await page.locator('#username').click();
  await page.waitForTimeout(500);
  // react-select puts options as [role="option"] elements
  const usernameOptions = await page.locator('[role="option"]').allTextContents();
  console.log('=== USERNAME DROPDOWN OPTIONS ===');
  console.log(JSON.stringify(usernameOptions, null, 2));

  // Close dropdown by pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // --- Explore password dropdown options ---
  await page.locator('#password').click();
  await page.waitForTimeout(500);
  const passwordOptions = await page.locator('[role="option"]').allTextContents();
  console.log('=== PASSWORD DROPDOWN OPTIONS ===');
  console.log(JSON.stringify(passwordOptions, null, 2));

  // Close dropdown by pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // --- Scenario 1: Click login without selecting any credentials ---
  await page.locator('#login-btn').click();
  await page.waitForTimeout(2000);

  // Check for error messages
  const bodyText1 = await page.locator('body').textContent();
  console.log('=== BODY AFTER LOGIN WITH NO CREDENTIALS ===');
  console.log(bodyText1.slice(0, 2000));

  // Check for flash/notification/error elements
  const errorElements = await page.locator('.flash, #flash, .notification, .error-message, .alert, [class*="flash"], [class*="error"], [class*="notification"], [class*="alert"]').all();
  console.log('=== ERROR ELEMS AFTER NO-CREDENTIAL LOGIN ===');
  for (const el of errorElements) {
    const text = await el.textContent().catch(() => '');
    const cls = await el.evaluate(e => e.className).catch(() => '');
    const id = await el.evaluate(e => e.id).catch(() => '');
    if (text && text.trim().length > 0) {
      console.log(`ID=${id} CLASS=${cls} TEXT=${text.trim().slice(0, 200)}`);
    }
  }

    // --- Scenario 2: Login with username only (no password) ---
  await page.goto('https://bstackdemo.com/signin', { waitUntil: 'networkidle', timeout: 15000 });
  await page.locator('#username').click();
  await page.waitForTimeout(500);
  await page.locator('xpath=//*[text()="demouser"]').click();
  await page.waitForTimeout(500);
  // Don't select password - just click login
  await page.locator('#login-btn').click();
  await page.waitForTimeout(2000);
  const bodyText3 = await page.locator('body').textContent();
  console.log('=== BODY AFTER LOGIN WITH USERNAME ONLY ===');
  console.log(bodyText3.slice(0, 3000));

  // --- Scenario 3: Login with password only (no username) ---
  await page.goto('https://bstackdemo.com/signin', { waitUntil: 'networkidle', timeout: 15000 });
  await page.locator('#password').click();
  await page.waitForTimeout(500);
  await page.locator('xpath=//*[text()="testingisfun99"]').click();
  await page.waitForTimeout(500);
  // Don't select username - just click login
  await page.locator('#login-btn').click();
  await page.waitForTimeout(2000);
  const bodyText4 = await page.locator('body').textContent();
  console.log('=== BODY AFTER LOGIN WITH PASSWORD ONLY ===');
  console.log(bodyText4.slice(0, 3000));

  // --- Scenario 4: Login with locked_user ---
  await page.goto('https://bstackdemo.com/signin');
  await page.locator('#username').click();
  await page.waitForTimeout(500);
  await page.locator('xpath=//*[text()="locked_user"]').click();
  await page.waitForTimeout(500);

  await page.locator('#password').click();
  await page.waitForTimeout(500);
  await page.locator('xpath=//*[text()="testingisfun99"]').click();
  await page.waitForTimeout(500);

  await page.locator('#login-btn').click();
  await page.waitForTimeout(2000);

  const bodyText2 = await page.locator('body').textContent();
  console.log('=== BODY AFTER LOCKED USER LOGIN ===');
  console.log(bodyText2.slice(0, 3000));

  const errorElements2 = await page.locator('.flash, #flash, .notification, .error-message, .alert, [class*="flash"], [class*="error"], [class*="notification"], [class*="alert"]').all();
  console.log('=== ERROR ELEMS AFTER LOCKED USER LOGIN ===');
  for (const el of errorElements2) {
    const text = await el.textContent().catch(() => '');
    const cls = await el.evaluate(e => e.className).catch(() => '');
    const id = await el.evaluate(e => e.id).catch(() => '');
    if (text && text.trim().length > 0) {
      console.log(`ID=${id} CLASS=${cls} TEXT=${text.trim().slice(0, 300)}`);
    }
  }
});
