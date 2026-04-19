import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ImportManagementPage extends BasePage {
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly examTable: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    super(page);
    this.fileInput = page.locator('input[type="file"]').first();
    this.uploadButton = page.locator('button:has-text("อัปโหลด"), button:has-text("ส่ง"), button:has-text("บันทึก"), button:has-text("นำเข้า")').first();
    this.saveButton = page.locator('button:has-text("บันทึก"), button:has-text("Save")').first();
    this.deleteButton = page.locator('button:has-text("ลบ"), button:has-text("Delete")').first();
    this.confirmButton = page.locator('button:has-text("ยืนยัน"), button:has-text("Confirm")').first();
    this.examTable = page.locator('table, [role="grid"], [role="table"]').first();
  }

  async openImportPage(): Promise<void> {
    console.log('\n📂 [ImportManagementPage] Opening import page...');

    const currentUrl = this.page.url();
    console.log(`   Current URL: ${currentUrl}`);

    // If we're already on DropFileInput, just wait for content
    if (currentUrl.includes('DropFileInput')) {
      console.log('   ✅ Already on DropFileInput page');
      await this.page.waitForTimeout(3000); // Wait for React to render
      console.log('   ✅ openImportPage completed\n');
      return;
    }

    // Step 1: Open sidebar if needed
    console.log('   📂 Opening sidebar...');
    const hamburger = this.page.locator('.sb-hamburger').first();

    try {
      const isHamburgerVisible = await hamburger.isVisible({ timeout: 3000 }).catch(() => false);
      if (isHamburgerVisible) {
        console.log('   ✅ Hamburger found, clicking...');
        await hamburger.click({ force: true, timeout: 5000 });
        await this.page.waitForTimeout(1000); // Wait for sidebar animation
        console.log('   ✅ Sidebar opened');
      } else {
        console.log('   ⚠️  Hamburger not visible');
      }
    } catch (e) {
      console.log(`   ⚠️  Error opening sidebar: ${e}`);
    }

    // Step 2: Find and click import link by href
    console.log('   🔍 Looking for import link...');
    const importLink = this.page.locator('a[href="/DropFileInput"]').first();

    try {
      console.log('   🖱️  Clicking import link...');
      await importLink.click({
        force: true,
        timeout: 10000
      });
      console.log('   ✅ Import link clicked');
    } catch (e) {
      console.log(`   ❌ Error clicking import link: ${e}`);
      throw new Error(`Failed to click import link: ${e}`);
    }

    // Step 3: Wait for page content to load and React to render
    console.log('   ⏳ Waiting for DropFileInput page to fully load...');
    // Wait for the page to complete all loading states
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(3000); // Extra delay for React rendering

    console.log('   ⏳ Waiting for file input to render (up to 45 seconds)...');
    try {
      await this.page.waitForSelector('input[type="file"]', { timeout: 45000 });
      console.log('   ✅ File input found and ready!');
    } catch (e) {
      console.log('   ⚠️  File input not found within 45 seconds');
      console.log('   Attempting to continue anyway...');
    }

    console.log(`   Page URL: ${this.page.url()}`);
    console.log('   ✅ openImportPage completed\n');
  }

  async uploadFile(filePath: string): Promise<void> {
    console.log(`📤 Uploading file: ${filePath}`);
    try {
      // Get a fresh locator after waiting for the element
      const fileInput = this.page.locator('input[type="file"]').first();
      await fileInput.setInputFiles(filePath, { timeout: 30000 });
      console.log('✅ File uploaded');
    } catch (e) {
      console.log(`❌ Error uploading file: ${e}`);
      throw e;
    }
  }

  async clickUploadButton(): Promise<void> {
    console.log('🖱️  Clicking upload button...');
    const button = this.uploadButton;
    
    try {
      const isVisible = await button.isVisible({ timeout: 5000 }).catch(() => false);
      if (isVisible) {
        await button.click({ timeout: 10000 });
        console.log('✅ Upload button clicked');
      } else {
        throw new Error('Upload button not visible');
      }
    } catch (e) {
      console.log(`❌ Error: ${e}`);
      throw e;
    }
  }

  async findRowByText(text: string): Promise<Locator> {
    return this.page.locator(`tr:has-text("${text}"), [role="row"]:has-text("${text}")`).first();
  }

  async clickEditInRow(rowLocator: Locator): Promise<void> {
    const editBtn = rowLocator.locator('button:has-text("แก้ไข"), button:has-text("Edit")').first();
    if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editBtn.click();
    }
  }

  async fillFormField(placeholder: string, value: string): Promise<void> {
    const field = this.page.locator(`input[placeholder*="${placeholder}"], [placeholder*="${placeholder}"]`).first();
    if (await field.isVisible({ timeout: 5000 }).catch(() => false)) {
      await field.fill(value);
    }
  }

  async clearFormField(placeholder: string): Promise<void> {
    const field = this.page.locator(`input[placeholder*="${placeholder}"], [placeholder*="${placeholder}"]`).first();
    if (await field.isVisible({ timeout: 5000 })) {
      await field.clear();
    }
  }

  async clickSaveButton(): Promise<void> {
    await this.saveButton.click();
  }

  async clickDeleteInRow(rowLocator: Locator): Promise<void> {
    const deleteBtn = rowLocator.locator('button:has-text("ลบ"), button:has-text("Delete")').first();
    if (await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await deleteBtn.click();
    }
  }

  async clickConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    const successMsg = this.page.locator('text=/สำเร็จ|success|Success|บันทึก|อัปโหลด/i').first();
    await expect(successMsg).toBeVisible({ timeout: 15000 });
  }

  async expectErrorMessage(message: string | RegExp): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible({ timeout: 10000 });
  }

  async expectValidationError(): Promise<void> {
    const errorMsg = this.page.locator('text=/กรุณา|required|ต้อง|error|Error/i').first();
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
  }

  async expectRowNotExists(text: string): Promise<void> {
    await expect(this.page.locator(`tr:has-text("${text}"), [role="row"]:has-text("${text}")`)).toHaveCount(0, { timeout: 10000 });
  }

  async expectRowContainsText(rowLocator: Locator, text: string): Promise<void> {
    await expect(rowLocator).toContainText(text, { timeout: 10000 });
  }

  async expectDeleteConfirmDialog(): Promise<void> {
    const dialog = this.page.locator('text=/ยืนยัน|confirm|Confirm/i').first();
    await expect(dialog).toBeVisible({ timeout: 10000 });
  }
}
