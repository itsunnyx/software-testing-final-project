import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AuthPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('ใส่ชื่อบัญชีผู้ใช้');
    this.passwordInput = page.getByPlaceholder('ใส่รหัสผ่านของคุณ');
    this.loginButton = page.getByRole('button', { name: 'ล็อกอิน' });
  }

  async open(): Promise<void> {
    await this.goto('/');
    await this.expectLoginFormVisible();
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(username?: string, password?: string): Promise<void> {
    await this.usernameInput.fill(username ?? '');
    await this.passwordInput.fill(password ?? '');
    await this.loginButton.click();
  }

  async expectIncompleteDataDialog(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'ข้อมูลไม่ครบ' })).toBeVisible();
    await expect(this.page.getByText('กรุณากรอกข้อมูลให้ครบทุกช่อง')).toBeVisible();
  }

  async expectLoginFailedDialog(messagePattern?: RegExp): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'ล็อกอินไม่สำเร็จ' })).toBeVisible();
    if (messagePattern) {
      await expect(this.page.getByText(messagePattern)).toBeVisible();
    }
  }

  async closeDialog(): Promise<void> {
    const okButton = this.page.getByRole('button', { name: 'OK' });
    if (await okButton.isVisible()) {
      await okButton.click();
    }
  }

  async getToken(): Promise<string | null> {
    return this.page.evaluate(() => {
      const localToken = localStorage.getItem('token');
      const sessionToken = sessionStorage.getItem('token');
      return localToken ?? sessionToken;
    });
  }
}
