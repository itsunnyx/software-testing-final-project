// Test data and constants
export const TEST_DATA = {
  // Admin credentials
  admin: {
    username: 'admin01',
    password: 'password123',
  },
  
  // Academic years and semesters
  academicYear: {
    current: '2568',
    future: '2569',
  },
  
  semester: {
    first: '1',
    second: '2',
  },
  
  // Subject codes for testing
  subjects: {
    CPEN101: 'CPEN101',
    CPEN102: 'CPEN102',
    CPEN103: 'CPEN103',
    CPEN104: 'CPEN104',
    CPEN105: 'CPEN105',
    CPEN106: 'CPEN106',
    CPEN109: 'CPEN109',
  },
  
  // Status values
  examStatus: {
    sent: 'ส่งแล้ว',
    notSent: 'ยังไม่ส่ง',
    noExam: 'ไม่มีข้อสอบ',
  },
  
  // Department information (Thai)
  departments: [
    'ภาควิชาวิทยาศาสตร์',
    'ภาควิชาคณิตศาสตร์',
    'ภาควิชาวิศวกรรม',
    'ภาควิชาคอมพิวเตอร์',
  ],
  
  // Filter options
  filterOptions: {
    semester1Year2568: {
      year: '2568',
      semester: '1',
    },
    semester2Year2569: {
      year: '2569',
      semester: '2',
    },
    midtermSemester1: {
      examType: 'กลางภาค',
      semester: '1/2568',
    },
  },
  
  // Message constants
  messages: {
    noDataAvailable: 'ไม่มีข้อมูล',
    saveSuccess: 'บันทึกสำเร็จ',
    missingEvidence: 'ไม่พบหลักฐานไฟล์ข้อสอบ',
    noStudentList: 'ไม่พบรายชื่อนักศึกษา',
    accessDenied: 'Access Denied',
    invalidDateFormat: 'รูปแบบวันที่ไม่ถูกต้อง',
    sessionExpired: 'Session Expired',
    selectSubject: 'กรุณาเลือกรายวิชา',
  },
  
  // Invigilator data
  invigilators: {
    existingTeacher: 'ดร. สมหญิง',
    noInvigilationTeacher: 'ดร. สมหญิง',
  },
  
  // Exam information
  examInfo: {
    roomNumber: '5101',
    pages: '10',
    sets: '40',
    remarks: 'อนุญาตเครื่องคิดเลข',
  },
  
  // Invalid/Edge case data
  invalidData: {
    invalidDateFormat: 'ABCD-99',
    validDateFormat: 'YYYY-MM-DD',
  },
};

export const TIMEOUT_VALUES = {
  short: 3000,
  medium: 5000,
  long: 10000,
};

export const URL_PATHS = {
  login: '/',
  dashboard: '/dashboard',
  paperUsageReport: '/reports/paper-usage',
  examStatusReport: '/reports/exam-status',
  invigilationReport: '/reports/invigilator',
  activityLog: '/reports/activity-log',
  documents: '/documents',
};
