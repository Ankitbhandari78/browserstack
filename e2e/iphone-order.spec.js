const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { StorePage } = require('../pages/store.page');
const { CheckoutPage } = require('../pages/checkout.page');

test.describe('iPhone Order', () => {
  let loginPage;
  let storePage;
  let checkoutPage;

  // Shared setup: navigate to sign-in and log in as a valid user.
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    storePage = new StorePage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('demouser', 'testingisfun99');
    await loginPage.expectLoggedInAs('demouser');
  });

  test('Login, Add Apple iPhone 12 to Cart, and Checkout', async ({ page }) => {
    // STEP 2: FILTER & ADD PRODUCT TO CART
    await storePage.filterByBrand('Apple');
    await storePage.addToCart('iPhone 12');
    await storePage.goToCheckout();

    // STEP 3: CHECKOUT FLOW - fill shipping details & submit
    await checkoutPage.fillShippingAddress({
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Test Street',
      province: 'California',
      postCode: '90001',
    });
    await checkoutPage.submitOrder();

    // STEP 3.5: ORDER COMPLETE - capture screenshot
    await checkoutPage.expectOrderConfirmed(5000);
    await page.screenshot({
      path: 'screenshots/iphone-order-confirmation.png',
      fullPage: true,
    });

    // STEP 4: CONTINUE SHOPPING - return to store main page
    await checkoutPage.continueShopping();
    await expect(page).toHaveURL('https://bstackdemo.com/');
  });
});
