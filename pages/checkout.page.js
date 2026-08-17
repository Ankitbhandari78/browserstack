const { expect } = require('@playwright/test');

// Page Object Model for the bstackdemo.com checkout workflow
// (shipping address form + order confirmation).
class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Shipping address form locators
    this.firstNameInput = page.locator('#firstNameInput');
    this.lastNameInput = page.locator('#lastNameInput');
    this.addressLine1Input = page.locator('#addressLine1Input');
    this.provinceInput = page.locator('#provinceInput');
    this.postCodeInput = page.locator('#postCodeInput');
    this.submitOrderButton = page.locator('#checkout-shipping-continue');

    // Order confirmation locators
    this.confirmationMessage = page.getByText(/Your Order has been successfully placed/i);
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  // Fill all required shipping fields.
  async fillShippingAddress({ firstName, lastName, address, province, postCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.addressLine1Input.fill(address);
    await this.provinceInput.fill(province);
    await this.postCodeInput.fill(postCode);
  }

  // Submit the shipping form.
  async submitOrder() {
    await this.submitOrderButton.click();
  }

  // Wait for the order confirmation message.
  async expectOrderConfirmed(timeout = 15000) {
    await expect(this.confirmationMessage).toBeVisible({ timeout });
  }

  // Click Continue Shopping to return to the store.
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = { CheckoutPage };
