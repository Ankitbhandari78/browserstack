# BrowserStack Demo — Playwright Automation

This project is a **Playwright (JavaScript)** end-to-end test automation suite for
[**bstackdemo.com**](https://bstackdemo.com) — a demo e-commerce web application used to practice
UI automation against a realistic shopping flow.

Tests cover authentication (positive & negative login, logout), product filtering by vendor/brand,
adding items to the cart, the checkout/shipping flow, and order confirmation.

---

## ✨ What Is Covered

| Area | Test file | Scenarios |
|------|-----------|-----------|
| Authentication | `e2e/Authentication/loginpositive.spec.js` | Successful login with valid credentials |
| Authentication | `e2e/Authentication/loginnegative.spec.js` | Error-message exploration (empty fields, missing password, locked user) |
| Authentication | `e2e/Authentication/logout.spec.js` | Login followed by logout |
| Shopping | `e2e/productfilter/iphone-order.spec.js` | Apple filter → add iPhone 12 → checkout → confirmation (POM) |
| Shopping | `e2e/productfilter/multi-vendor-order.spec.js` | Multi-vendor cart (Samsung Galaxy S20 + Google Pixel 4) |
| Shopping | `e2e/productfilter/oppo.spec.js` | OnePlus filter → add One Plus 8 → checkout |

---

## 🛠 Tech Stack

- **Node.js** 20+
- **Playwright Test** (`@playwright/test`)
- **Google Chrome** (headless via `playwright.config.js`)
- **Page Object Model (POM)** — `pages/`
- **Allure** reporting (`allure-playwright` + `allure-commandline`)
- **Custom console reporter** (`reporter.js`)
- **GitHub Actions** CI (`.github/workflows/playwright.yml`)

---

## 📁 Project Structure

```
.
├── .github/workflows/playwright.yml   # CI pipeline
├── e2e/                               # Test specs (one file per scenario group)
│   ├── Authentication/                # loginnegative, loginpositive, logout
│   └── productfilter/                 # iphone-order, multi-vendor-order, oppo
├── pages/                             # Page Object Model classes
│   ├── login.page.js
│   ├── store.page.js
│   └── checkout.page.js
├── playwright.config.js               # Playwright configuration
├── reporter.js                        # Custom console/failure reporter
├── .clinerules                        # Locators, credentials & code conventions
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** 20 or newer
- **npm**
- **Google Chrome** installed locally

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browser(s)

```bash
npx playwright install --with-deps chrome
```

### 4. Run the full suite

```bash
npx playwright test
```

### 5. Run a single test file

```bash
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

---

## 📊 Reporting

### Allure report

```bash
npx playwright test --reporter=allure-playwright
allure generate allure-results --clean -o allure-report
allure open allure-report
```

### Custom failure report

`reporter.js` prints a detailed failure report to the console (failed file, test name,
**line & column**, error message, and a short stack trace) whenever a test fails.
Enable it in `playwright.config.js`.

---

## 🔐 Test Site Credentials

These are the **public demo credentials** for bstackdemo.com:

| User | Password | Purpose |
|------|----------|---------|
| `demouser` | `testingisfun99` | Valid user (used by most tests) |
| `locked_user` | `testingisfun99` | Locked account — triggers login error |
| `fav_user` | `testingisfun99` | Favourites-enabled account |

---

## 🧩 Page Object Model (POM)

- One page object per screen/flow under `pages/`
- Locators are class properties in the constructor (`this.loginButton = page.locator('#login-btn')`)
- Page objects export via CommonJS (`module.exports = { LoginPage }`)
- Specs import with `require('../pages/login.page')` (from `e2e/`)
  or `require('../../pages/login.page')` (from a subfolder like `e2e/productfilter/`)

---

## ⚙️ CI / GitHub Actions

Pushing to `main` (or opening a PR) triggers `.github/workflows/playwright.yml`, which:

1. Checks out the repo
2. Installs Node 20 + dependencies (`npm ci`)
3. Installs Playwright Chrome/Firefox
4. Runs `npx playwright test`
5. Uploads `playwright-report/` as a build artifact (30-day retention)

---

## 🩹 Current Test Status (as of last full run)

- ✅ Passing: `loginpositive`, `loginnegative`, `logout`, `oppo`, `multi-vendor-order`, `iphone-order`
- 🟡 Notes:
  - `loginnegative.spec.js` is an exploration script — it logs page output but currently has **no assertions** (improvement planned)
  - All specs use the public demo credentials (`demouser` / `testingisfun99`)

---

## 📝 License

ISC