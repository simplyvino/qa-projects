class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.finishButton = page.locator('#finish');
    this.errorMessage = page.locator('[data-test="error"]');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillInformation(firstName, lastName, postalCode) {
    if (firstName) await this.firstNameInput.fill(firstName);
    if (lastName) await this.lastNameInput.fill(lastName);
    if (postalCode) await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async parsePrice(locator) {
    const text = await locator.textContent();
    const match = text.match(/\d+\.\d+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getOrderSummary() {
    const subtotal = await this.parsePrice(this.subtotalLabel);
    const tax = await this.parsePrice(this.taxLabel);
    const total = await this.parsePrice(this.totalLabel);
    return { subtotal, tax, total };
  }
}

module.exports = { CheckoutPage };