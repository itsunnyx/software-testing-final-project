import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { TeacherHomePage } from '../pages/teacher-home.page';
import { credentialsForCase, expectedText, wrongPasswordForCase004 } from '../data/auth-cases';
import { getAuthCase } from '../utils/auth-csv';

test.describe('AUTH flow up to TCS-AUTH-010', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('TCS-AUTH-001: user can login with valid credentials', async ({ page }) => {
    const authPage = new AuthPage(page);
    const tc = getAuthCase('TCS-AUTH-001');
    const user = credentialsForCase(tc.id);

    await test.step('Open login form and submit valid credentials', async () => {
      await authPage.open();
      await authPage.login(user.username, user.password);
    });

    await test.step('Verify token exists and user is no longer on login page', async () => {
      const token = await authPage.getToken();
      expect(token, expectedText('TCS-AUTH-001')).toBeTruthy();
      await expect(page.getByPlaceholder('ใส่ชื่อบัญชีผู้ใช้')).not.toBeVisible();
    });
  });

  test('TCS-AUTH-004: reject login with wrong password', async ({ page }) => {
    const authPage = new AuthPage(page);
    const tc = getAuthCase('TCS-AUTH-004');
    const user = credentialsForCase(tc.id);

    await test.step('Submit username with wrong password', async () => {
      await authPage.open();
      await authPage.login(user.username, wrongPasswordForCase004());
    });

    await test.step('Verify login failed dialog appears', async () => {
      await authPage.expectLoginFailedDialog(/Name\s*หรือ\s*Password\s*ไม่ถูกต้อง|ล็อกอินไม่สำเร็จ|ห้องข้อสอบยังไม่เปิด/i);
      await authPage.closeDialog();
      await authPage.expectLoginFormVisible();
    });
  });

  test('TCS-AUTH-006: block login when username and password are empty', async ({ page }) => {
    const authPage = new AuthPage(page);

    await test.step('Submit form with empty fields', async () => {
      await authPage.open();
      await authPage.login('', '');
    });

    await test.step('Verify incomplete data dialog appears', async () => {
      await authPage.expectIncompleteDataDialog();
      await authPage.closeDialog();
    });
  });

  test('TCS-AUTH-009: user can logout and token is removed', async ({ page }) => {
    const authPage = new AuthPage(page);
    const homePage = new TeacherHomePage(page);
    const tc = getAuthCase('TCS-AUTH-009');
    const user = credentialsForCase(tc.id);

    await test.step('Login with valid user first', async () => {
      await authPage.open();
      await authPage.login(user.username, user.password);
      await homePage.expectAuthenticatedState();
    });

    await test.step('Click logout and verify redirect to login page', async () => {
      await homePage.logout();
      await homePage.expectRedirectedToLogin();
      const token = await authPage.getToken();
      expect(token, expectedText('TCS-AUTH-009')).toBeNull();
    });
  });

  test('TCS-AUTH-010: protected route without login is blocked', async ({ page }) => {
    const homePage = new TeacherHomePage(page);

    await test.step('Open protected teacher route without token', async () => {
      await homePage.openProtectedRoute();
    });

    await test.step('Verify route guard redirects user to login', async () => {
      await homePage.expectRedirectedToLogin();
      await expect(page.url(), expectedText('TCS-AUTH-010')).not.toContain('/Home-Teacher');
    });
  });
});
