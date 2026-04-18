import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ExamRoomPage extends BasePage {
  readonly addRoomButton: Locator;
  readonly roomNameInput: Locator;
  readonly roomTypeSelect: Locator;
  readonly capacityInput: Locator;
  readonly rowsInput: Locator;
  readonly seatsPerRowInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly editButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly roomsTable: Locator;
  readonly dialogOverlay: Locator;

  constructor(page: Page) {
    super(page);
    // Button to add new room
    this.addRoomButton = page.getByRole('button', { name: /เพิ่มห้องสอบ|add room|เพิ่ม/i });
    
    // Form inputs
    this.roomNameInput = page.getByPlaceholder(/ชื่อห้อง|room name|ชื่อ/i);
    this.roomTypeSelect = page.locator('select').filter({ hasText: /ประเภท|type|ประเภทห้อง/i }).first();
    this.capacityInput = page.getByPlaceholder(/ความจุ|capacity|จำนวน/i);
    this.rowsInput = page.getByPlaceholder(/จำนวนแถว|rows|แถว/i);
    this.seatsPerRowInput = page.getByPlaceholder(/ที่นั่ง|seats|ที่นั่งต่อแถว/i);
    
    // Buttons
    this.saveButton = page.getByRole('button', { name: /บันทึก|save|ยืนยัน/i });
    this.cancelButton = page.getByRole('button', { name: /ยกเลิก|cancel/i });
    this.deleteButton = page.getByRole('button', { name: /ลบ|delete/i }).first();
    this.editButton = page.getByRole('button', { name: /แก้ไข|edit/i }).first();
    this.confirmDeleteButton = page.getByRole('button', { name: /ยืนยัน|confirm|ตกลง/i });
    
    // Table and dialogs
    this.roomsTable = page.locator('table').or(page.locator('[role="table"]'));
    this.dialogOverlay = page.locator('[role="dialog"], .modal, .popup');
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/exam-rooms', { waitUntil: 'domcontentloaded' });
  }

  async openAddRoomDialog(): Promise<void> {
    await this.addRoomButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a normal exam room with name and capacity
   * TC-ADM-013
   */
  async addNormalRoom(name: string, capacity: number): Promise<void> {
    await this.openAddRoomDialog();
    
    // Fill room details
    await this.roomNameInput.fill(name);
    
    // Select room type as "ห้องปกติ" (normal room)
    const typeSelect = this.page.locator('select').first();
    await typeSelect.selectOption({ label: /ห้องปกติ|normal|normal room/i });
    
    await this.capacityInput.fill(capacity.toString());
    
    // Save the room
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a slope room with row and seat configuration
   * TC-ADM-014
   */
  async addSlopeRoom(name: string, rows: number, seatsPerRow: number): Promise<void> {
    await this.openAddRoomDialog();
    
    // Fill room details
    await this.roomNameInput.fill(name);
    
    // Select room type as "ห้องบรรยายสโลป" (slope room)
    const typeSelect = this.page.locator('select').first();
    await typeSelect.selectOption({ label: /สโลป|slope|lecture slope/i });
    
    // Fill slope-specific fields
    await this.rowsInput.fill(rows.toString());
    await this.seatsPerRowInput.fill(seatsPerRow.toString());
    
    // Save the room
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Edit room capacity
   * TC-ADM-015
   */
  async editRoomCapacity(roomName: string, newCapacity: number): Promise<void> {
    // Find the room in the table and click edit
    const roomRow = this.roomsTable.locator('tr').filter({ hasText: roomName });
    const editButtonInRow = roomRow.locator('button').filter({ hasText: /แก้ไข|edit/i });
    
    await editButtonInRow.click();
    await this.page.waitForLoadState('networkidle');
    
    // Clear and update capacity
    await this.capacityInput.clear();
    await this.capacityInput.fill(newCapacity.toString());
    
    // Save changes
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Change exam room for a subject
   * TC-ADM-016
   */
  async changeSubjectRoom(subjectCode: string, targetRoomName: string): Promise<void> {
    // Navigate to subject room assignment page (may need adjustment based on actual UI)
    const subjectLink = this.page.getByText(subjectCode).first();
    await subjectLink.click();
    await this.page.waitForLoadState('networkidle');
    
    // Select new room
    const roomSelect = this.page.locator('select').filter({ hasText: /ห้อง|room/i }).first();
    await roomSelect.selectOption({ label: targetRoomName });
    
    // Save changes
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Delete an unused exam room
   * TC-ADM-018
   */
  async deleteRoom(roomName: string): Promise<void> {
    // Find the room in the table
    const roomRow = this.roomsTable.locator('tr').filter({ hasText: roomName });
    const deleteButtonInRow = roomRow.locator('button').filter({ hasText: /ลบ|delete/i });
    
    await deleteButtonInRow.click();
    await this.page.waitForLoadState('networkidle');
    
    // Confirm deletion
    await this.confirmDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify room appears in the table
   */
  async expectRoomInTable(roomName: string): Promise<void> {
    const roomRow = this.roomsTable.locator('tr').filter({ hasText: roomName });
    await expect(roomRow).toBeVisible();
  }

  /**
   * Verify room is not in the table
   */
  async expectRoomNotInTable(roomName: string): Promise<void> {
    const roomRow = this.roomsTable.locator('tr').filter({ hasText: roomName });
    await expect(roomRow).not.toBeVisible();
  }

  /**
   * Verify room capacity is updated
   */
  async expectCapacityUpdated(roomName: string, capacity: number): Promise<void> {
    const roomRow = this.roomsTable.locator('tr').filter({ hasText: roomName });
    const capacityCell = roomRow.locator('td').filter({ hasText: capacity.toString() });
    await expect(capacityCell).toBeVisible();
  }

  /**
   * Close any open dialog
   */
  async closeDialog(): Promise<void> {
    const closeButton = this.page.locator('button').filter({ hasText: /ปิด|close|×/i }).first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}
