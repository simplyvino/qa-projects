class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.removeButtons = page.locator('button[data-test^="remove"]');
    this.checkoutButton = page.locator('#checkout');
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async removeItem(index = 0) {
    await this.removeButtons.nth(index).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };