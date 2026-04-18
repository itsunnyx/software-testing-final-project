import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class StatisticsPage extends BasePage {
  readonly tabPaperUsage = 'button:has-text("การใช้กระดาษตามภาควิชา"), [data-testid="tab-paper-usage"]';
  readonly tabExamSubmission = 'button:has-text("การส่งข้อสอบ"), [data-testid="tab-exam-submission"]';
  readonly yearFilter = 'select[name*="year"], [data-testid="year-filter"]';
  readonly semesterFilter = 'select[name*="semester"], [data-testid="semester-filter"]';
  readonly searchButton = 'button:has-text("ค้นหา"), button:has-text("Search"), [data-testid="search-btn"]';
  readonly chart = 'canvas, [role="img"][aria-label*="chart"], svg[data-testid="chart"]';
  readonly chartTable = 'table, [role="table"]';
  readonly noDataMessage = 'text=ไม่มีข้อมูล, text=No Data Available, text=No Data';
  readonly departmentNames = 'td[data-testid*="department"], .department-row';

  constructor(page: Page) {
    super(page);
  }

  async clickTabPaperUsage() {
    await this.click(this.tabPaperUsage);
    await this.waitForLoadState('networkidle');
  }

  async clickTabExamSubmission() {
    await this.click(this.tabExamSubmission);
    await this.waitForLoadState('networkidle');
  }

  async filterByYearAndSemester(year: string, semester: string) {
    await this.selectOption(this.yearFilter, year);
    await this.selectOption(this.semesterFilter, semester);
    await this.click(this.searchButton);
    await this.waitForLoadState('networkidle');
  }

  async isChartVisible(): Promise<boolean> {
    return await this.isVisible(this.chart);
  }

  async isTableVisible(): Promise<boolean> {
    return await this.isVisible(this.chartTable);
  }

  async isNoDataMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.noDataMessage);
  }

  async getNoDataMessage(): Promise<string> {
    if (await this.isNoDataMessageDisplayed()) {
      return await this.getText(this.noDataMessage);
    }
    return '';
  }

  async getDepartmentCount(): Promise<number> {
    const count = await this.page.locator(this.departmentNames).count();
    return count;
  }

  async waitForChartToLoad(timeout: number = 5000) {
    await this.waitForSelector(this.chart, timeout);
  }
}
