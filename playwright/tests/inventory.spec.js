const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

test.describe('Inventory & Product Browsing', () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Product Display: Verify load and images', async () => {
    // saucedemo static site has 6 inventory items
    await expect(inventoryPage.inventoryItems).toHaveCount(6);

    // Verify all product images have a non-empty src attribute
    const images = inventoryPage.itemImages;
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toHaveAttribute('src', /.+/);
    }
  });

  test('Sorting: Price Low to High', async () => {
    await inventoryPage.selectSortOption('lohi');
    const prices = await inventoryPage.getAllPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('Sorting: Name Z to A', async () => {
    await inventoryPage.selectSortOption('za');
    const names = await inventoryPage.getAllNames();
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  test('Broken UI Elements: Detect Problem User image glitch', async ({ page }) => {
    await inventoryPage.logout();
    const loginPage = new LoginPage(page);
    await loginPage.login('problem_user', 'secret_sauce');

    const firstImg = await inventoryPage.itemImages.first().getAttribute('src');
    const secondImg = await inventoryPage.itemImages.nth(1).getAttribute('src');
    
    expect(firstImg).toEqual(secondImg);
  });
});