import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SystemSettingsPage extends BasePage {
  readonly academicYearInput: Locator;
  readonly semesterSelect: Locator;
  readonly examPeriodSelect: Locator;
  readonly startDateInput: Locator;
  readonly startTimeInput: Locator;
  readonly endDateInput: Locator;
  readonly endTimeInput: Locator;
  readonly saveButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Try multiple selector patterns for robustness
    this.academicYearInput = page.locator('input[type="text"][name*="year"], input[type="number"][name*="year"], input[placeholder*="ปี"], input[name*="academicYear"]').first();
    this.semesterSelect = page.locator('select[name*="semester"], select[name*="term"]').or(page.getByLabel(/ภาคการศึกษา|semester/i));
    this.examPeriodSelect = page.locator('select[name*="period"], select[name*="exam"]').or(page.getByLabel(/ช่วงการสอบ|exam period/i));
    this.startDateInput = page.locator('input[type="date"][name*="start"], input[placeholder*="วันที่เริ่ม"]').first();
    this.startTimeInput = page.locator('input[type="time"][name*="start"], input[placeholder*="เวลาเริ่ม"]').first();
    this.endDateInput = page.locator('input[type="date"][name*="end"], input[placeholder*="วันที่สิ้น"]').first();
    this.endTimeInput = page.locator('input[type="time"][name*="end"], input[placeholder*="เวลาสิ้น"]').first();
    this.saveButton = page.getByRole('button', { name: /บันทึก|save|submit/i });
    this.errorMessage = page.locator('[role="alert"]').or(page.locator('.error, .alert-danger, .ant-message-error'));
    this.successMessage = page.locator('[role="status"]').or(page.locator('.success, .alert-success, .ant-message-success'));
  }

  async navigateToSettings(): Promise<void> {
    await this.goto('/settings');
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for page to be interactive
    await this.page.waitForTimeout(1000);
  }

  async fillAcademicYear(year: string): Promise<void> {
    if (year) {
      const input = this.academicYearInput;
      await input.click();
      await input.clear();
      await input.fill(year);
    }
  }

  async selectSemester(semester: string): Promise<void> {
    if (semester) {
      const select = this.semesterSelect;
      try {
        await select.selectOption(semester).catch(() => {
          // If selectOption fails, try click and select
          select.click();
        });
      } catch {
        // Fallback: just type if it's a text input
        await select.clear();
        await select.fill(semester);
      }
    }
  }

  async selectExamPeriod(period: string): Promise<void> {
    if (period) {
      const select = this.examPeriodSelect;
      try {
        await select.selectOption(period).catch(() => {
          select.click();
        });
      } catch {
        await select.clear();
        await select.fill(period);
      }
    }
  }

  async fillStartDateTime(date: string, time: string): Promise<void> {
    if (date) {
      const dateInput = this.startDateInput;
      await dateInput.click();
      await dateInput.clear();
      await dateInput.fill(date);
    }
    if (time) {
      const timeInput = this.startTimeInput;
      await timeInput.click();
      await timeInput.clear();
      await timeInput.fill(time);
    }
  }

  async fillEndDateTime(date: string, time: string): Promise<void> {
    if (date) {
      const dateInput = this.endDateInput;
      await dateInput.click();
      await dateInput.clear();
      await dateInput.fill(date);
    }
    if (time) {
      const timeInput = this.endTimeInput;
      await timeInput.click();
      await timeInput.clear();
      await timeInput.fill(time);
    }
  }

  async fillSettingsForm(input: {
    academicYear?: string;
    semester?: string;
    examPeriod?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  }): Promise<void> {
    if (input.academicYear !== undefined) {
      await this.fillAcademicYear(input.academicYear);
    }
    if (input.semester !== undefined) {
      await this.selectSemester(input.semester);
    }
    if (input.examPeriod !== undefined) {
      await this.selectExamPeriod(input.examPeriod);
    }
    if (input.startDate !== undefined || input.startTime !== undefined) {
      await this.fillStartDateTime(input.startDate || '', input.startTime || '');
    }
    if (input.endDate !== undefined || input.endTime !== undefined) {
      await this.fillEndDateTime(input.endDate || '', input.endTime || '');
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async getSuccessMessage(): Promise<string> {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
    return await this.successMessage.textContent() || '';
  }

  async expectErrorMessageVisible(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async expectSuccessMessageVisible(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async expectErrorMessage(expectedText: string): Promise<void> {
    const message = await this.getErrorMessage();
    expect(message.toLowerCase()).toContain(expectedText.toLowerCase());
  }

  async expectSuccessMessage(expectedText: string): Promise<void> {
    const message = await this.getSuccessMessage();
    expect(message.toLowerCase()).toContain(expectedText.toLowerCase());
  }
}
