import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { StatisticsPage } from '../pages/statisticsPage';
import { ExamStatusPage } from '../pages/examStatusPage';
import { TEST_DATA, TIMEOUT_VALUES } from '../fixtures/testData';

test.describe('Report Tests - Exam Management System', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let statisticsPage: StatisticsPage;
  let examStatusPage: ExamStatusPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    statisticsPage = new StatisticsPage(page);
    examStatusPage = new ExamStatusPage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login(TEST_DATA.admin.username, TEST_DATA.admin.password);
  });

  // TCS-RDM-001: Test paper usage statistics report display
  test('[TCS-RDM-001] Display paper usage statistics report by department', async ({ page }) => {
    // Navigate to paper usage report
    await dashboardPage.navigateToPaperUsageReport();

    // Click on the paper usage tab
    await statisticsPage.clickTabPaperUsage();

    // Verify chart is displayed
    const isChartVisible = await statisticsPage.isChartVisible();
    expect(isChartVisible).toBeTruthy();

    // Verify table is displayed
    const isTableVisible = await statisticsPage.isTableVisible();
    expect(isTableVisible).toBeTruthy();

    // Verify department data is shown
    const departmentCount = await statisticsPage.getDepartmentCount();
    expect(departmentCount).toBeGreaterThan(0);

    // Log successful test
    console.log('✓ Paper usage statistics report displayed successfully');
    console.log(`  - Chart visible: ${isChartVisible}`);
    console.log(`  - Table visible: ${isTableVisible}`);
    console.log(`  - Departments shown: ${departmentCount}`);
  });

  // TCS-RDM-002: Test filtering statistics report by academic year and semester
  test('[TCS-RDM-002] Filter paper usage statistics by academic year and semester', async ({ page }) => {
    // Navigate to paper usage report
    await dashboardPage.navigateToPaperUsageReport();

    // Click on the paper usage tab
    await statisticsPage.clickTabPaperUsage();

    // Apply filter for year 2568, semester 1
    await statisticsPage.filterByYearAndSemester(
      TEST_DATA.filterOptions.semester1Year2568.year,
      TEST_DATA.filterOptions.semester1Year2568.semester
    );

    // Verify chart and table are still visible after filter
    const isChartVisible = await statisticsPage.isChartVisible();
    expect(isChartVisible).toBeTruthy();

    const isTableVisible = await statisticsPage.isTableVisible();
    expect(isTableVisible).toBeTruthy();

    // Log test result
    console.log('✓ Filter applied successfully to statistics report');
    console.log(`  - Academic Year: ${TEST_DATA.filterOptions.semester1Year2568.year}`);
    console.log(`  - Semester: ${TEST_DATA.filterOptions.semester1Year2568.semester}`);
    console.log(`  - Chart visible: ${isChartVisible}`);
    console.log(`  - Table updated: ${isTableVisible}`);
  });

  // TCS-RDM-004: Test exam status report display
  test('[TCS-RDM-004] Display exam status report with all subjects', async ({ page }) => {
    // Navigate to exam status report
    await dashboardPage.navigateToExamStatusReport();

    // Verify table is visible
    const isTableVisible = await examStatusPage.isTableVisible();
    expect(isTableVisible).toBeTruthy();

    // Verify subjects are displayed
    const subjectCount = await examStatusPage.getSubjectCount();
    expect(subjectCount).toBeGreaterThan(0);

    // Log test result
    console.log('✓ Exam status report displayed successfully');
    console.log(`  - Table visible: ${isTableVisible}`);
    console.log(`  - Subjects shown: ${subjectCount}`);
  });

  // TCS-RDM-005: Test updating exam status to "sent"
  test('[TCS-RDM-005] Update exam status to "sent" for CPEN101', async ({ page }) => {
    // Navigate to exam status report
    await dashboardPage.navigateToExamStatusReport();

    // Search for CPEN101
    await examStatusPage.searchSubject(TEST_DATA.subjects.CPEN101);

    // Verify subject is found
    const subjectFound = await examStatusPage.findSubjectRow(TEST_DATA.subjects.CPEN101);
    expect(subjectFound).toBeTruthy();

    // Update status to "sent"
    await examStatusPage.updateSubjectStatusByCode(
      TEST_DATA.subjects.CPEN101,
      TEST_DATA.examStatus.sent
    );

    // Click save button
    await examStatusPage.clickSave();

    // Verify success message is displayed
    const isSuccessMessageDisplayed = await examStatusPage.isSuccessMessageDisplayed();
    expect(isSuccessMessageDisplayed).toBeTruthy();

    // Get and log the success message
    const successMessage = await examStatusPage.getSuccessMessage();
    console.log('✓ Exam status updated successfully');
    console.log(`  - Subject: ${TEST_DATA.subjects.CPEN101}`);
    console.log(`  - New Status: ${TEST_DATA.examStatus.sent}`);
    console.log(`  - Success Message: ${successMessage}`);
  });

  // TCS-RDM-010: Test creating pie chart for exam status summary
  test('[TCS-RDM-010] Generate pie chart for exam status summary', async ({ page }) => {
    // Navigate to exam status report
    await dashboardPage.navigateToExamStatusReport();

    // Verify table is visible
    const isTableVisible = await examStatusPage.isTableVisible();
    expect(isTableVisible).toBeTruthy();

    // Click generate chart button
    await examStatusPage.clickGenerateChart();

    // Verify pie chart is displayed
    const isPieChartDisplayed = await examStatusPage.isPieChartDisplayed();
    expect(isPieChartDisplayed).toBeTruthy();

    // Log test result
    console.log('✓ Pie chart generated successfully');
    console.log(`  - Chart visible: ${isPieChartDisplayed}`);
    console.log(`  - Chart displays exam status summary (Sent/Not Sent/No Exam)`);
  });
});
