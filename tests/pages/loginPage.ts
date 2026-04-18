import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly usernameInput = 'input[placeholder*="username"], input[name*="username"]';
  readonly passwordInput = 'input[placeholder*="password"], input[name*="password"], input[type="password"]';
  readonly loginButton = 'button:has-text("Login"), button:has-text("เข้าสู่ระบบ"), button[type="submit"]';
  readonly errorMessage = '.error, .alert-danger, [role="alert"]';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/');
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
