class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    if (username) await this.usernameInput.fill(username);
    else await this.usernameInput.clear();

    if (password) await this.passwordInput.fill(password);
    else await this.passwordInput.clear();

    await this.loginButton.click();
  }
}

module.exports = { LoginPage };