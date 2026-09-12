const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');

test.describe('Cart & Shopping Flow', () => {
  let inventoryPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Add to Cart: Button state & badge increment', async () => {
    await inventoryPage.addItemToCart(0);
    await expect(inventoryPage.removeButtons.first()).toBeVisible();
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('State Persistence across sessions', async ({ page }) => {
    await inventoryPage.addItemToCart(0);
    await inventoryPage.logout();

    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('Cart Removal: Updates badge count', async () => {
    await inventoryPage.addItemToCart(0);
    await inventoryPage.cartLink.click();
    await cartPage.removeItem(0);
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('Empty Cart Flow', async () => {
    await inventoryPage.cartLink.click();
    expect(await cartPage.getItemCount()).toBe(0);
  });
});