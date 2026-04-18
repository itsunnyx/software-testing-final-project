import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class ExamStatusPage extends BasePage {
  readonly subjectTable = 'table, [role="table"]';
  readonly subjectRow = 'tr[data-testid*="subject"], tbody tr';
  readonly statusDropdown = (subjectId: string) => `select[data-testid="status-${subjectId}"], select[name*="status"]`;
  readonly statusSelect = 'select, [role="combobox"]';
  readonly saveButton = 'button:has-text("บันทึก"), button:has-text("Save"), [data-testid="save-btn"]';
  readonly successMessage = '.success, .alert-success, text=บันทึกสำเร็จ, text=Success';
  readonly confirmModal = '[role="dialog"], .modal, .confirm-dialog';
  readonly confirmYesButton = 'button:has-text("ยืนยัน"), button:has-text("Yes"), [data-testid="confirm-yes"]';
  readonly warningMessage = '.warning, .alert-warning, text=ไม่พบหลักฐาน';
  readonly chartButton = 'button:has-text("สร้างกราฟสรุปสถานะ"), button:has-text("Generate Chart"), [data-testid="chart-btn"]';
  readonly pieChart = 'canvas, [data-testid="pie-chart"], svg[aria-label*="Pie"]';
  readonly errorMessage = '.error, .alert-danger, [role="alert"]';
  readonly subjectSearch = 'input[placeholder*="ค้นหา"], input[placeholder*="Search"], [data-testid="search-subject"]';

  constructor(page: Page) {
    super(page);
  }

  async searchSubject(subjectCode: string) {
    const searchInput = await this.page.locator(this.subjectSearch).first();
    if (await searchInput.isVisible()) {
      await this.fill(this.subjectSearch, subjectCode);
      await this.waitForLoadState('networkidle');
    }
  }

  async findSubjectRow(subjectCode: string): Promise<boolean> {
    const rows = await this.page.locator(this.subjectRow);
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text && text.includes(subjectCode)) {
        return true;
      }
    }
    return false;
  }

  async updateSubjectStatus(rowIndex: number, status: string) {
    const statusDropdowns = await this.page.locator(this.statusSelect);
    await statusDropdowns.nth(rowIndex).selectOption(status);
  }

  async updateSubjectStatusByCode(subjectCode: string, status: string) {
    const rows = await this.page.locator(this.subjectRow);
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text && text.includes(subjectCode)) {
        await this.updateSubjectStatus(i, status);
        break;
      }
    }
  }

  async clickSave() {
    await this.click(this.saveButton);
    await this.waitForLoadState('networkidle');
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  async getSuccessMessage(): Promise<string> {
    if (await this.isSuccessMessageDisplayed()) {
      return await this.getText(this.successMessage);
    }
    return '';
  }

  async isConfirmModalDisplayed(): Promise<boolean> {
    return await this.isVisible(this.confirmModal);
  }

  async confirmWarning() {
    if (await this.isConfirmModalDisplayed()) {
      await this.click(this.confirmYesButton);
      await this.waitForLoadState('networkidle');
    }
  }

  async isWarningMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.warningMessage);
  }

  async getWarningMessage(): Promise<string> {
    if (await this.isWarningMessageDisplayed()) {
      return await this.getText(this.warningMessage);
    }
    return '';
  }

  async clickGenerateChart() {
    await this.click(this.chartButton);
    await this.waitForLoadState('networkidle');
  }

  async isPieChartDisplayed(): Promise<boolean> {
    return await this.isVisible(this.pieChart);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isErrorMessageDisplayed()) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async isTableVisible(): Promise<boolean> {
    return await this.isVisible(this.subjectTable);
  }

  async getSubjectCount(): Promise<number> {
    const rows = await this.page.locator(this.subjectRow);
    return await rows.count();
  }
}
