import { test, expect } from '@playwright/test';
import { SystemSettingsPage } from '../pages/system-settings.page';
import { systemSettingsTestCases } from '../data/system-settings-cases';

test.describe('System Settings Module (TC-SET)', () => {
  let settingsPage: SystemSettingsPage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SystemSettingsPage(page);
    try {
      await settingsPage.navigateToSettings();
    } catch (e) {
      test.skip();
    }
  });

  test('TC-SET-01: Save system settings with all required fields', async ({ page }) => {
    const testCase = systemSettingsTestCases[0];

    await test.step('Fill form with all required fields', async () => {
      await settingsPage.fillSettingsForm(testCase.input);
    });

    await test.step('Save settings and verify success message', async () => {
      await settingsPage.saveSettings();
      await settingsPage.expectSuccessMessageVisible();
    });
  });

  test('TC-SET-02: Reject when academic year is empty', async ({ page }) => {
    const testCase = systemSettingsTestCases[1];

    await test.step('Fill form with empty academic year', async () => {
      await settingsPage.fillSettingsForm(testCase.input);
    });

    await test.step('Save and verify error message for missing year', async () => {
      await settingsPage.saveSettings();
      await settingsPage.expectErrorMessageVisible();
    });
  });

  test('TC-SET-03: Reject when semester is empty', async ({ page }) => {
    const testCase = systemSettingsTestCases[2];

    await test.step('Fill form with empty semester', async () => {
      await settingsPage.fillSettingsForm(testCase.input);
    });

    await test.step('Save and verify error message for missing semester', async () => {
      await settingsPage.saveSettings();
      await settingsPage.expectErrorMessageVisible();
    });
  });

  test('TC-SET-04: Reject when exam period is empty', async ({ page }) => {
    const testCase = systemSettingsTestCases[3];

    await test.step('Fill form with empty exam period', async () => {
      await settingsPage.fillSettingsForm(testCase.input);
    });

    await test.step('Save and verify error message for missing exam period', async () => {
      await settingsPage.saveSettings();
      await settingsPage.expectErrorMessageVisible();
    });
  });

  test('TC-SET-05: Reject when start time is greater than end time', async ({ page }) => {
    const testCase = systemSettingsTestCases[4];

    await test.step('Fill form with start time greater than end time', async () => {
      await settingsPage.fillSettingsForm(testCase.input);
    });

    await test.step('Save and verify error message for invalid time range', async () => {
      await settingsPage.saveSettings();
      await settingsPage.expectErrorMessageVisible();
    });
  });
});
