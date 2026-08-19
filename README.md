# BrowserStack Demo — Playwright Automation

This project is a **Playwright (JavaScript)** end-to-end test automation suite for
[**bstackdemo.com**](https://bstackdemo.com) — a demo e-commerce web application used to practice
UI automation against a realistic shopping flow.

Tests cover authentication (positive & negative login, logout), product filtering by vendor/brand,
adding items to the cart, the checkout/shipping flow, and order confirmation.


 What Is Covered

| Authentication | `e2e/Authentication/loginpositive.spec.js` | Successful login with valid credentials |
| Authentication | `e2e/Authentication/loginnegative.spec.js` | Error-message exploration (empty fields, missing password, locked user) |
| Authentication | `e2e/Authentication/logout.spec.js` | Login followed by logout |
| Shopping | `e2e/productfilter/iphone-order.spec.js` | Apple filter → add iPhone 12 → checkout → confirmation (POM) |
| Shopping | `e2e/productfilter/multi-vendor-order.spec.js` | Multi-vendor cart (Samsung Galaxy S20 + Google Pixel 4) |
| Shopping | `e2e/productfilter/oppo.spec.js` | OnePlus filter → add One Plus 8 → checkout |

---

 Tech Stack

- **Node.js** 20+
- **Playwright Test** (`@playwright/test`)
- **Google Chrome** (headless via `playwright.config.js`)
- **Page Object Model (POM)** — `pages/`
- **Allure** reporting (`allure-playwright` + `allure-commandline`)
- **Custom console reporter** (`reporter.js`)
- **GitHub Actions** CI (`.github/workflows/playwright.yml`)



# Authentication
npx playwright test e2e/Authentication/loginpositive.spec.js
npx playwright test e2e/Authentication/loginnegative.spec.js
npx playwright test e2e/Authentication/logout.spec.js

# Shopping flows
npx playwright test e2e/productfilter/oppo.spec.js
npx playwright test e2e/productfilter/iphone-order.spec.js
npx playwright test e2e/productfilter/multi-vendor-order.spec.js
```

### 6. Run a single test by name

```bash
npx playwright test --grep "Positive Login"
```

### Custom failure report

`reporter.js` prints a detailed failure report to the console (failed file, test name,
**line & column**, error message, and a short stack trace) whenever a test fails.
Enable it in `playwright.config.js`.







## 🧩 Page Object Model (POM)

- One page object per screen/flow under `pages/`
- Locators are class properties in the constructor (`this.loginButton = page.locator('#login-btn')`)
- Page objects export via CommonJS (`module.exports = { LoginPage }`)
- Specs import with `require('../pages/login.page')` (from `e2e/`)
  or `require('../../pages/login.page')` (from a subfolder like `e2e/productfilter/`)




Pushing to `main` (or opening a PR) triggers `.github/workflows/playwright.yml`, which:

1. Checks out the repo
2. Installs Node 20 + dependencies (`npm ci`)
3. Installs Playwright Chrome/Firefox
4. Runs `npx playwright test`
5. Uploads `playwright-report/` as a build artifact (30-day retention)



