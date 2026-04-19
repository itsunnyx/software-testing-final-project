import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { ImportManagementPage } from '../pages/import-management.page';
import { getImportTestCase } from '../data/import-cases';
import { getAdminCredentials } from '../data/import-credentials';
import path from 'path';

test.describe('TC-AUTO: Import Management Test Cases', () => {
  let importPage: ImportManagementPage;

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Admin with provided credentials
    const authPage = new AuthPage(page);
    const adminCreds = getAdminCredentials();
    await authPage.open();
    await authPage.login(adminCreds.username, adminCreds.password);
    await page.waitForLoadState('networkidle');

    // Navigate to import management page
    importPage = new ImportManagementPage(page);
    await importPage.openImportPage();
  });

  test('TC-AUTO-001: Upload exam file Excel successfully (Positive)', async ({ page }) => {
    const tc = getImportTestCase('TC-AUTO-001');

    await test.step('Attach valid Excel file (.xlsx) with complete exam data', async () => {
      // Use the actual exam file from data folder
      const filePath = path.join(__dirname, '../../data/ตารางสอบกลางภาคต้น ปีการศึกษา 2567 ห้องข้อสอ .xlsx');
      console.log(`Uploading file: ${filePath}`);
      await importPage.uploadFile(filePath);
      expect(tc?.type).toBe('positive');
    });

    await test.step('Click upload button', async () => {
      await importPage.clickUploadButton();
      await importPage.waitForAppReady();
    });

    await test.step('Verify success message appears', async () => {
      await importPage.expectSuccessMessage();
    });

    await test.step('Verify data is displayed in the exam table', async () => {
      await expect(importPage.examTable).toBeVisible();
    });
  });

  test('TC-AUTO-002: Reject invalid file format (PDF) with error message (Negative)', async ({ page }) => {
    const tc = getImportTestCase('TC-AUTO-002');

    await test.step('Attach invalid file format (.pdf)', async () => {
      const filePath = path.join(__dirname, '../fixtures/exam_invalid.pdf');
      await importPage.uploadFile(filePath);
      expect(tc?.type).toBe('negative');
    });

    await test.step('Click upload button', async () => {
      await importPage.clickUploadButton();
    });

    await test.step('Verify error message for unsupported file format', async () => {
      await importPage.expectErrorMessage(/รองรับเฉพาะไฟล์|only.*\.xlsx|\.csv/i);
    });

    await test.step('Verify data was NOT uploaded to database', async () => {
      // Check that the table is empty or no new rows were added
      const rowCount = await importPage.examTable.locator('tbody tr').count();
      expect(rowCount).toBeLessThanOrEqual(0);
    });
  });

  test('TC-AUTO-003: Edit exam room data and save successfully (Positive)', async ({ page }) => {
    const tc = getImportTestCase('TC-AUTO-003');

    await test.step('Find row with SC101 exam', async () => {
      const sc101Row = await importPage.findRowByText('SC101');
      await expect(sc101Row).toBeVisible();
      expect(tc?.type).toBe('positive');
    });

    await test.step('Click edit button for SC101 row', async () => {
      const sc101Row = await importPage.findRowByText('SC101');
      await importPage.clickEditInRow(sc101Row);
    });

    await test.step('Change room number to SC302', async () => {
      await importPage.fillFormField('ห้องสอบ|room', 'SC302');
    });

    await test.step('Click save button to persist changes', async () => {
      await importPage.clickSaveButton();
      await importPage.waitForAppReady();
    });

    await test.step('Verify row updated with new room number', async () => {
      const sc101Row = await importPage.findRowByText('SC101');
      await importPage.expectRowContainsText(sc101Row, 'SC302');
    });
  });

  test('TC-AUTO-004: Validate required fields and prevent empty submission (Negative)', async ({ page }) => {
    const tc = getImportTestCase('TC-AUTO-004');

    await test.step('Find first row and click edit', async () => {
      const firstRow = page.locator('table tbody tr').first();
      await importPage.clickEditInRow(firstRow);
      expect(tc?.type).toBe('negative');
    });

    await test.step('Clear the required field (course ID)', async () => {
      await importPage.clearFormField('รหัสวิชา|course');
    });

    await test.step('Click save button', async () => {
      await importPage.clickSaveButton();
    });

    await test.step('Verify validation error message appears', async () => {
      await importPage.expectValidationError();
    });

    await test.step('Verify row was NOT updated in database', async () => {
      // The original value should still exist (no empty cells)
      const firstRow = page.locator('table tbody tr').first();
      const courseIdCell = firstRow.locator('td:nth-child(1)');
      const cellText = await courseIdCell.textContent();
      expect(cellText).not.toBe('');
    });
  });

  test('TC-AUTO-005: Delete imported data with confirmation (Positive)', async ({ page }) => {
    const tc = getImportTestCase('TC-AUTO-005');

    await test.step('Find row with SC101 exam', async () => {
      const sc101Row = await importPage.findRowByText('SC101');
      await expect(sc101Row).toBeVisible();
      expect(tc?.type).toBe('positive');
    });

    await test.step('Click delete button for SC101 row', async () => {
      const sc101Row = await importPage.findRowByText('SC101');
      await importPage.clickDeleteInRow(sc101Row);
    });

    await test.step('Verify confirmation dialog appears', async () => {
      await importPage.expectDeleteConfirmDialog();
    });

    await test.step('Click confirm button to delete', async () => {
      await importPage.clickConfirmButton();
      await importPage.waitForAppReady();
    });

    await test.step('Verify row is removed from table', async () => {
      await importPage.expectRowNotExists('SC101');
    });
  });
});
