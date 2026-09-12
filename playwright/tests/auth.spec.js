const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

test.describe('Authentication & Session Management', () => {
  let loginPage;
  let inventoryPage;

  const secretPWD = process.env.SAUCEDEMO_PASSWORD;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
  });

  const validUsers = ['standard_user', 'problem_user', 'performance_glitch_user'];
  for (const user of validUsers) {
    test(`Happy Path Login: ${user}`, async () => {
      await loginPage.login(user, secretPWD);
      await expect(inventoryPage.title).toHaveText('Products', { timeout: 10000 });
    });
  }

  test('Invalid Credentials: Locked-out user', async () => {
    await loginPage.login('locked_out_user', secretPWD);
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('Invalid Credentials: Wrong password', async () => {
    await loginPage.login('standard_user', 'wrong_pass');
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('Field Validation: Empty username', async () => {
    await loginPage.login('', secretPWD);
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('Field Validation: Empty password', async () => {
    await loginPage.login('standard_user', '');
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('Session Security: Post-logout browser back button access', async ({ page }) => {
    await loginPage.login('standard_user', secretPWD);
    await inventoryPage.logout();
    await page.goBack();
    // Verify user is redirected to login or error is displayed
    await expect(loginPage.errorMessage).toBeVisible();
  });
});