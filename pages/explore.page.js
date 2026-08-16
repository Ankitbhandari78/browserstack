const { expect } = require('@playwright/test');

// Page Object Model covering both the Shipping Address Form and Order Confirmation steps on bstackdemo.com
class BstackDemoCheckoutPage {
  constructor(page) {
    this.page = page;

    // --- Shipping Address Form Locators ---
    this.firstNameInput = page.locator('#firstNameInput');
    this.lastNameInput = page.locator('#lastNameInput');
    this.addressLine1Input = page.locator('#addressLine1Input');
    this.provinceInput = page.locator('#provinceInput');
    this.postCodeInput = page.locator('#postCodeInput');
    this.submitOrderButton = page.locator('#checkout-shipping-continue');

    // --- Order Confirmation Locators ---
    this.downloadPdfButton = page.locator('#downloadpdf').first();
    this.confirmationMessage = page.locator('.optimizedCheckout-headingPrimary');
  }

  // Fills in all required shipping fields
  async fillShippingAddress(shippingDetails) {
    const { firstName, lastName, address, province, postCode } = shippingDetails;

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.addressLine1Input.fill(address);
    await this.provinceInput.fill(province);
    await this.postCodeInput.fill(postCode);
  }

  // Submits the shipping details form
  async submitOrder() {
    await this.submitOrderButton.click();
  }

  // Combined convenience method: fills address and submits the order
  async completeCheckout(shippingDetails) {
    await expect(this.firstNameInput).toBeVisible({ timeout: 10000 });
    await this.fillShippingAddress(shippingDetails);
    await this.submitOrder();
  }

  // Verifies that order confirmation screen loads with download button
  async expectOrderConfirmed() {
    await expect(this.downloadPdfButton).toBeVisible({ timeout: 10000 });
  }
}

module.exports = BstackDemoCheckoutPage;