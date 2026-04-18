import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class DashboardPage extends BasePage {
  readonly menuPaperUsage = 'a:has-text("รายงานสถิติ"), a:has-text("Paper Usage"), [data-testid="menu-paper-usage"]';
  readonly menuExamStatus = 'a:has-text("รายงานสถานะข้อสอบ"), a:has-text("Exam Status"), [data-testid="menu-exam-status"]';
  readonly menuInvigilationReport = 'a:has-text("รายงานภาระการคุมสอบ"), [data-testid="menu-invigilator"]';
  readonly menuActivityLog = 'a:has-text("Activity Log"), a:has-text("ประวัติการใช้งาน"), [data-testid="menu-activity"]';
  readonly userMenu = '[data-testid="user-menu"], .user-profile, .dropdown-toggle';
  readonly logoutButton = 'button:has-text("Logout"), button:has-text("ออกจากระบบ")';

  constructor(page: Page) {
    super(page);
  }

  async navigateToPaperUsageReport() {
    await this.click(this.menuPaperUsage);
    await this.waitForLoadState('networkidle');
  }

  async navigateToExamStatusReport() {
    await this.click(this.menuExamStatus);
    await this.waitForLoadState('networkidle');
  }

  async navigateToInvigilationReport() {
    await this.click(this.menuInvigilationReport);
    await this.waitForLoadState('networkidle');
  }

  async navigateToActivityLog() {
    await this.click(this.menuActivityLog);
    await this.waitForLoadState('networkidle');
  }

  async logout() {
    await this.click(this.userMenu);
    await this.click(this.logoutButton);
    await this.waitForLoadState('networkidle');
  }
}
