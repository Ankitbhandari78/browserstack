// playwright.config.js
const { defineConfig } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './e2e',   // tells Playwright to look inside e2e folder
  use: {
    // On CI: use Playwright's bundled Chromium in headless mode
    // Locally: use installed Google Chrome in headed mode
    channel: isCI ? undefined : 'chrome',
    headless: isCI,
  },
});
