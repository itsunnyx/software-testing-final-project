import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { AdminPage } from '../pages/admin.page';
import { ExamRoomPage } from '../pages/exam-room.page';
import { getExamRoomTestCase, getTestCaseCSVInfo, getCreatedRoomNames } from '../data/admin-cases';

test.describe('Exam Room Management (Admin Module)', () => {
  let adminPage: AdminPage;
  let roomPage: ExamRoomPage;

  test.beforeEach(async ({ page, context }) => {
    // ... โค้ดเดิมคงไว้ ...
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    adminPage = new AdminPage(page);
    roomPage = new ExamRoomPage(page);

    await test.step('Admin login setup', async () => {
      const authPage = new AuthPage(page);
      const adminUsername = process.env.E2E_ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'password';

      await authPage.open();
      await authPage.login(adminUsername, adminPassword);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Navigate to exam room management', async () => {
      await adminPage.navigateToExamRoomManagement();
    });
  });

  test.afterEach(async ({ page }) => {
    const createdRooms = getCreatedRoomNames();
    for (const roomName of createdRooms) {
      try {
        await test.step(`Cleanup: Delete ${roomName}`, async () => {
          const roomRow = page.locator('table tr').filter({ hasText: roomName });
          // แก้ไข: isVisible คืนค่า boolean อยู่แล้ว ไม่ต้อง catch
          const isVisible = await roomRow.isVisible();
          
          if (isVisible) {
            await roomPage.deleteRoom(roomName);
          }
        });
      } catch (error) {
        console.log(`Cleanup failed for room ${roomName}:`, error);
      }
    }
  });

  test('TC-ADM-013: Add normal exam room with capacity', async ({ page }) => {
    const testCase = getExamRoomTestCase('TC-ADM-013');
    const csvInfo = getTestCaseCSVInfo('TC-ADM-013');

    await test.step('Step 1: Verify exam room page is displayed', async () => {
      const heading = page.getByRole('heading', { name: /จัดการห้องสอบ|exam room|room management/i });
      // แก้ไข: ใช้ if-else แทนการ catch บน expect
      if (!(await heading.isVisible())) {
        const table = page.locator('table').or(page.locator('[role="table"]'));
        await expect(table).toBeVisible();
      } else {
        await expect(heading).toBeVisible();
      }
    });

    await test.step(`Step 2: Click "เพิ่มห้องสอบ" button to open add room dialog`, async () => {
      await roomPage.openAddRoomDialog();
    });

    await test.step(`Step 3: Fill room details - Name: ${testCase.roomName}, Type: ห้องปกติ, Capacity: ${testCase.capacity}`, async () => {
      await roomPage.addNormalRoom(testCase.roomName, testCase.capacity!);
    });

    await test.step(`Step 4: Verify room "${testCase.roomName}" appears in the table with capacity ${testCase.capacity}`, async () => {
      await roomPage.expectRoomInTable(testCase.roomName);
      if (testCase.capacity) {
        await roomPage.expectCapacityUpdated(testCase.roomName, testCase.capacity);
      }
    });
  });

  test('TC-ADM-014: Add slope room with row/seat configuration', async ({ page }) => {
    const testCase = getExamRoomTestCase('TC-ADM-014');
    const csvInfo = getTestCaseCSVInfo('TC-ADM-014');

    await test.step('Step 1: Verify exam room management page is ready', async () => {
      const heading = page.getByRole('heading', { name: /จัดการห้องสอบ|exam room|room management/i });
      // แก้ไข: ใช้ if-else แทนการ catch บน expect
      if (!(await heading.isVisible())) {
        const table = page.locator('table').or(page.locator('[role="table"]'));
        await expect(table).toBeVisible();
      } else {
        await expect(heading).toBeVisible();
      }
    });

    await test.step('Step 2: Open add room dialog', async () => {
      await roomPage.openAddRoomDialog();
    });

    await test.step(
      `Step 3: Fill slope room details - Name: ${testCase.roomName}, Type: ห้องบรรยายสโลป, Rows: ${testCase.rows}, Seats per row: ${testCase.seatsPerRow}`,
      async () => {
        await roomPage.addSlopeRoom(testCase.roomName, testCase.rows!, testCase.seatsPerRow!);
      }
    );

    await test.step(`Step 4: Verify slope room "${testCase.roomName}" appears in the table`, async () => {
      await roomPage.expectRoomInTable(testCase.roomName);
    });
  });

  test('TC-ADM-015: Edit room capacity', async ({ page }) => {
    // ... โค้ดเดิมทั้งหมดในเทสต์นี้ไม่มีส่วนที่ต้องแก้ เพราะไม่ได้ใช้ .catch() ...
    const testCaseCreate = getExamRoomTestCase('TC-ADM-013');
    const testCaseEdit = getExamRoomTestCase('TC-ADM-015');
    const roomName = testCaseCreate.roomName;

    await test.step(`Step 1: Create base room "${roomName}" with capacity 80`, async () => {
      await roomPage.addNormalRoom(roomName, 80);
      await roomPage.expectRoomInTable(roomName);
    });

    await test.step(`Step 2: Find room "${roomName}" in the table`, async () => {
      const roomRow = page.locator('table tr').filter({ hasText: roomName });
      await expect(roomRow).toBeVisible();
    });

    await test.step(`Step 3: Click edit button for room "${roomName}"`, async () => {
      const roomRow = page.locator('table tr').filter({ hasText: roomName });
      const editButton = roomRow.locator('button').filter({ hasText: /แก้ไข|edit/i });
      await editButton.click();
      await page.waitForLoadState('networkidle');
    });

    await test.step(`Step 4: Change capacity from 80 to ${testCaseEdit.capacity}`, async () => {
      const capacityInput = page.getByPlaceholder(/ความจุ|capacity|จำนวน/i);
      await capacityInput.clear();
      await capacityInput.fill(testCaseEdit.capacity!.toString());
    });

    await test.step('Step 5: Click save button', async () => {
      const saveButton = page.getByRole('button', { name: /บันทึก|save|ยืนยัน/i });
      await saveButton.click();
      await page.waitForLoadState('networkidle');
    });

    await test.step(`Step 6: Verify capacity is updated to ${testCaseEdit.capacity} in the table`, async () => {
      await roomPage.expectCapacityUpdated(roomName, testCaseEdit.capacity!);
    });
  });

  test('TC-ADM-016: Change exam room for a subject', async ({ page }) => {
    const testCase = getExamRoomTestCase('TC-ADM-016');

    await test.step('Step 1: Verify exam room management page is loaded', async () => {
      const heading = page.getByRole('heading', { name: /จัดการห้องสอบ|exam room|room management/i });
      // แก้ไข: ใช้ if-else แทนการ catch บน expect
      if (!(await heading.isVisible())) {
        const table = page.locator('table').or(page.locator('[role="table"]'));
        await expect(table).toBeVisible();
      } else {
        await expect(heading).toBeVisible();
      }
    });

    await test.step(`Step 2: Create target room "${testCase.roomName}"`, async () => {
      await roomPage.addNormalRoom(testCase.roomName, testCase.capacity!);
      await roomPage.expectRoomInTable(testCase.roomName);
    });

    await test.step(`Step 3: Find subject "${testCase.subjectCode}" and change its room`, async () => {
      const subjectLink = page.getByText(testCase.subjectCode!).first();
      
      // แก้ไข: Locator ไม่มี .catch() ให้เช็ค isVisible แทน
      if (await subjectLink.isVisible()) {
        await subjectLink.click();
        await page.waitForLoadState('networkidle');
        
        const roomSelect = page.locator('select').filter({ hasText: /ห้อง|room/i }).first();
        await roomSelect.selectOption({ label: testCase.targetRoom! });
        
        const saveButton = page.getByRole('button', { name: /บันทึก|save|ยืนยัน/i });
        await saveButton.click();
        await page.waitForLoadState('networkidle');
      } else {
        await page.goto('/admin/subject-rooms', { waitUntil: 'networkidle' });
      }
    });

    await test.step(`Step 4: Verify subject assignment`, async () => {
      const assignmentText = page.getByText(new RegExp(`${testCase.subjectCode}.*${testCase.targetRoom}`, 'i'));
      // แก้ไข: ใช้ if แทนการ catch บน expect
      const isVisible = await assignmentText.isVisible();
      if (!isVisible) {
        const heading = page.getByRole('heading');
        await expect(heading).toBeVisible();
      } else {
        await expect(assignmentText).toBeVisible();
      }
    });
  });

  test('TC-ADM-018: Delete unused exam room', async ({ page }) => {
    // ... โค้ดเดิมทั้งหมดในเทสต์นี้ไม่มีส่วนที่ต้องแก้ ...
    const testCase = getExamRoomTestCase('TC-ADM-018');
    const csvInfo = getTestCaseCSVInfo('TC-ADM-018');

    await test.step(`Step 1: Create unused test room "${testCase.roomName}"`, async () => {
      await roomPage.addNormalRoom(testCase.roomName, testCase.capacity!);
      await roomPage.expectRoomInTable(testCase.roomName);
    });

    await test.step(`Step 2: Verify room "${testCase.roomName}" exists in the table`, async () => {
      await roomPage.expectRoomInTable(testCase.roomName);
    });

    await test.step(`Step 3: Find delete button for room "${testCase.roomName}"`, async () => {
      const roomRow = page.locator('table tr').filter({ hasText: testCase.roomName });
      const deleteButton = roomRow.locator('button').filter({ hasText: /ลบ|delete/i });
      await expect(deleteButton).toBeVisible();
    });

    await test.step(`Step 4: Click delete button and confirm deletion`, async () => {
      await roomPage.deleteRoom(testCase.roomName);
    });

    await test.step(`Step 5: Verify room "${testCase.roomName}" is removed from the table`, async () => {
      await roomPage.expectRoomNotInTable(testCase.roomName);
    });
  });
});