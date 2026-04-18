export interface SystemSettingsTestCase {
  id: string;
  title: string;
  input: {
    academicYear?: string;
    semester?: string;
    examPeriod?: string;
    startTime?: string;
    startDate?: string;
    endTime?: string;
    endDate?: string;
  };
  expectedOutput: string;
  type: 'Positive' | 'Negative';
  author: string;
}

export const systemSettingsTestCases: SystemSettingsTestCase[] = [
  {
    id: 'TC-SET-01',
    title: 'ทดสอบการตั้งค่าระบบการสอบเมื่อระบุข้อมูลที่จำเป็นครบถ้วน',
    input: {
      academicYear: '2567',
      semester: 'ต้น',
      examPeriod: 'กลางภาค',
      startDate: '01/10/2024',
      startTime: '08:00',
      endDate: '15/10/2024',
      endTime: '16:00',
    },
    expectedOutput: 'ระบบบันทึกข้อมูลการตั้งค่าสำเร็จ และแสดงข้อความแจ้งเตือน "บันทึกการตั้งค่าระบบสำเร็จ"',
    type: 'Positive',
    author: 'ศุกร์ภชัย',
  },
  {
    id: 'TC-SET-02',
    title: 'ทดสอบการตั้งค่าระบบโดยไม่ระบุปีการศึกษา',
    input: {
      academicYear: '',
      semester: 'ต้น',
      examPeriod: 'กลางภาค',
      startDate: '01/10/2024',
      startTime: '08:00',
      endDate: '15/10/2024',
      endTime: '16:00',
    },
    expectedOutput: 'ระบบปฏิเสธการบันทึก และแสดงข้อความแจ้งเตือน Error "กรุณาระบุปีการศึกษา" หรือ "ข้อมูลไม่ครบ"',
    type: 'Negative',
    author: 'ศุกร์ภชัย',
  },
  {
    id: 'TC-SET-03',
    title: 'ทดสอบการตั้งค่าระบบโดยไม่ระบุภาคการศึกษา',
    input: {
      academicYear: '2567',
      semester: '',
      examPeriod: 'กลางภาค',
      startDate: '01/10/2024',
      startTime: '08:00',
      endDate: '15/10/2024',
      endTime: '16:00',
    },
    expectedOutput: 'ระบบปฏิเสธการบันทึก และแสดงข้อความแจ้งเตือนให้ระบุภาคการศึกษา',
    type: 'Negative',
    author: 'ศุกร์ภชัย',
  },
  {
    id: 'TC-SET-04',
    title: 'ทดสอบการตั้งค่าระบบโดยไม่ระบุช่วงการสอบ',
    input: {
      academicYear: '2567',
      semester: 'ต้น',
      examPeriod: '',
      startDate: '01/10/2024',
      startTime: '08:00',
      endDate: '15/10/2024',
      endTime: '16:00',
    },
    expectedOutput: 'ระบบปฏิเสธการบันทึก และแสดงข้อความแจ้งเตือนให้ระบุช่วงการสอบ',
    type: 'Negative',
    author: 'ศุกร์ภชัย',
  },
  {
    id: 'TC-SET-05',
    title: 'ทดสอบการตั้งค่าระบบโดยระบุเวลาเริ่มต้น มากกว่า เวลาสิ้นสุด',
    input: {
      academicYear: '2567',
      semester: 'ต้น',
      examPeriod: 'กลางภาค',
      startDate: '15/10/2024',
      startTime: '16:00',
      endDate: '01/10/2024',
      endTime: '08:00',
    },
    expectedOutput: 'ระบบปฏิเสธการบันทึก และแสดงข้อความ Error "เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด"',
    type: 'Negative',
    author: 'ศุกร์ภชัย',
  },
];
