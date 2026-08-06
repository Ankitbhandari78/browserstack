// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',   // tells Playwright to look inside e2e folder
  use: {
    channel: 'chrome', // run in installed Google Chrome
    headless: false,   // show browser window
  },
});
