class InventoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemImages = page.locator('.inventory_item_img img');
    this.sortSelect = page.locator('.product_sort_container');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutButton = page.locator('#logout_sidebar_link');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
    this.removeButtons = page.locator('button[data-test^="remove"]');
  }

  async selectSortOption(optionValue) {
    await this.sortSelect.selectOption(optionValue);
  }

  async getAllNames() {
    return await this.itemNames.allTextContents();
  }

  async getAllPrices() {
    const rawPrices = await this.itemPrices.allTextContents();
    return rawPrices.map(p => parseFloat(p.replace('$', '')));
  }

  async addItemToCart(index = 0) {
    await this.addToCartButtons.nth(index).click();
  }

  async removeItem(index = 0) {
    await this.removeButtons.nth(index).click();
  }

  async getCartCount() {
    // Wait up to 5 seconds for badge if items exist in cart
    try {
      await this.cartBadge.waitFor({ state: 'visible', timeout: 5000 });
      return parseInt(await this.cartBadge.textContent(), 10);
    } catch (e) {
      return 0; // Badge not present (cart is empty)
    }
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutButton.click();
  }
}

module.exports = { InventoryPage };