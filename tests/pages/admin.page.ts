import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminPage extends BasePage {
  readonly sidebar: Locator;
  readonly examRoomMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = page.locator('[role="navigation"]').or(page.locator('nav'));
    this.examRoomMenuButton = page.getByRole('link', { name: /จัดการห้องสอบ|exam room|ห้องสอบ/i });
  }

  async navigateToExamRoomManagement(): Promise<void> {
    await this.examRoomMenuButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectAdminPageVisible(): Promise<void> {
    await expect(this.sidebar).toBeVisible();
  }
}
