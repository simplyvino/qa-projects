const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('Checkout & Transaction Flow', () => {
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart(0);
    await inventoryPage.cartLink.click();
    await cartPage.proceedToCheckout();
  });

  test('Form Validation: Missing First Name', async () => {
    await checkoutPage.fillInformation('', 'Doe', '12345');
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('Boundary Value Testing: Long strings & special characters', async () => {
    const longString = 'A'.repeat(255) + '!@#$%^&*()';
    await checkoutPage.fillInformation(longString, longString, '90210');
    await expect(checkoutPage.subtotalLabel).toBeVisible();
  });

  test('Order Calculations: Verify math (Subtotal + Tax = Total)', async () => {
    await checkoutPage.fillInformation('Jane', 'Doe', '90210');
    const { subtotal, tax, total } = await checkoutPage.getOrderSummary();
    
    // JS floating point precision check
    expect(Number((subtotal + tax).toFixed(2))).toBe(total);
  });

  test('Order Finalization: Complete checkout flow', async () => {
    await checkoutPage.fillInformation('Jane', 'Doe', '90210');
    await checkoutPage.finishButton.click();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});