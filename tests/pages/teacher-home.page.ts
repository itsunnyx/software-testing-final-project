import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class TeacherHomePage extends BasePage {
  readonly logoutCandidates: Locator[];

  constructor(page: Page) {
    super(page);
    this.logoutCandidates = [
      page.getByRole('button', { name: /ออกจากระบบ|logout/i }),
      page.getByRole('link', { name: /ออกจากระบบ|logout/i }),
      page.getByText(/ออกจากระบบ|logout/i),
    ];
  }

  async openProtectedRoute(): Promise<void> {
    await this.goto('/Home-Teacher');
  }

  async expectAuthenticatedState(): Promise<void> {
    const token = await this.page.evaluate(() => {
      const localToken = localStorage.getItem('token');
      const sessionToken = sessionStorage.getItem('token');
      return localToken ?? sessionToken;
    });
    expect(token).toBeTruthy();
  }

  async logout(): Promise<void> {
    for (const locator of this.logoutCandidates) {
      if (await locator.first().isVisible()) {
        await locator.first().click();
        return;
      }
    }

    throw new Error('Could not find logout control on current page.');
  }

  async expectRedirectedToLogin(): Promise<void> {
    await expect(this.page.getByPlaceholder('ใส่ชื่อบัญชีผู้ใช้')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'ล็อกอิน' })).toBeVisible();
    await expect(this.page).not.toHaveURL(/Home-Teacher/i);
  }
}
