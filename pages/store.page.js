const { expect } = require('@playwright/test');

// Page Object Model for the bstackdemo.com store / catalog workflow
// (vendor filters, product cards, cart drawer, checkout).
class StorePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.productCards = page.locator('.shelf-item');
    this.cartDrawer = page.locator('.float-cart');
    this.drawerItems = this.cartDrawer.locator('.shelf-item');
    this.checkoutButton = page.getByText('Checkout', { exact: true });
  }

  // Click a vendor/brand filter checkbox (e.g. Apple, Samsung, Google).
  async filterByBrand(brand) {
    await this.page.getByText(brand, { exact: true }).click();
  }

  // Add a product (matching its name) to the cart.
  async addToCart(productName) {
    await this.productCards
      .filter({ hasText: productName })
      .first()
      .locator('.shelf-item__buy-btn')
      .click();
  }

  // Open the checkout flow from the cart drawer.
  async goToCheckout() {
    await this.checkoutButton.click();
  }

  // Verify a product appears in the cart drawer.
  async expectProductInCart(productName) {
    await expect(this.drawerItems.filter({ hasText: productName })).toBeVisible({
      timeout: 5000,
    });
  }
}

module.exports = { StorePage };
