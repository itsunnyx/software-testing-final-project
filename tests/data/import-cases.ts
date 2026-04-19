export interface ImportTestCase {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  description: string;
  expectedResult: string;
}

export const importTestCases: Record<string, ImportTestCase> = {
  'TC-AUTO-001': {
    id: 'TC-AUTO-001',
    name: 'Upload exam file Excel successfully',
    type: 'positive',
    description: 'ทดสอบว่าระบบสามารถอัปโหลดไฟล์ Excel ตารางสอบที่ถูกต้องแล้วบันทึกลงฐานข้อมูล',
    expectedResult: 'ระบบอัปโหลดสำเร็จ บันทึกข้อมูลลงฐานข้อมูล examTable และแสดงผลตารางสอบบนหน้าเว็บ',
  },
  'TC-AUTO-002': {
    id: 'TC-AUTO-002',
    name: 'Reject invalid file format (PDF)',
    type: 'negative',
    description: 'ทดสอบระบบป้องกันไฟล์ผิดนามสกุล โดยพยายามอัปโหลดไฟล์ .pdf',
    expectedResult: 'ระบบไม่อนุญาตให้อัปโหลด แจ้งเตือน Error รองรับเฉพาะไฟล์ .xlsx หรือ .csv',
  },
  'TC-AUTO-003': {
    id: 'TC-AUTO-003',
    name: 'Edit exam room data and save',
    type: 'positive',
    description: 'ทดสอบการแก้ไขข้อมูลห้องสอบแบบ Inline Edit และบันทึกลงฐานข้อมูล',
    expectedResult: 'ข้อมูลแถว SC101 เปลี่ยนเป็น SC302 และบันทึกลงฐานข้อมูลสำเร็จ',
  },
  'TC-AUTO-004': {
    id: 'TC-AUTO-004',
    name: 'Validate required fields',
    type: 'negative',
    description: 'ทดสอบระบบป้องกันข้อมูลสูญหาย โดยพยายามลบฟิลด์ที่บังคับ (Required) แล้วบันทึก',
    expectedResult: 'ระบบแจ้งเตือนให้กรอกข้อมูลในฟิลด์ที่บังคับให้ครบถ้วน และไม่บันทึกข้อมูล',
  },
  'TC-AUTO-005': {
    id: 'TC-AUTO-005',
    name: 'Delete imported data',
    type: 'positive',
    description: 'ทดสอบสคริปต์การลบข้อมูล (ตารางสอบ) ที่นำเข้า พร้อมยืนยันการลบ',
    expectedResult: 'ระบบลบข้อมูลวิชา SC101 สำเร็จ และไม่พบแถวข้อมูลในตาราง',
  },
};

export function getImportTestCase(caseId: string): ImportTestCase | undefined {
  return importTestCases[caseId];
}

export function getAllImportTestCases(): ImportTestCase[] {
  return Object.values(importTestCases);
}

export function getTestCasesByType(type: 'positive' | 'negative'): ImportTestCase[] {
  return Object.values(importTestCases).filter(tc => tc.type === type);
}
