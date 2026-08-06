// playwright.config.js
const { defineConfig } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './e2e',   // tells Playwright to look inside e2e folder
  use: {
    channel: 'chrome',  // always run in installed Google Chrome (no Chromium)
    headless: isCI,     // headless on CI (no display), headed locally
  },
});
