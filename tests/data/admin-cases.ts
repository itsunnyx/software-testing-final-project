import { getAdminCase } from '../utils/admin-csv';

/**
 * Admin test data for exam room management
 * Based on TC-ADM-013, TC-ADM-014, TC-ADM-015, TC-ADM-016, TC-ADM-018
 */

export type ExamRoomTestCase = {
  caseId: string;
  roomName: string;
  roomType: 'normal' | 'slope';
  capacity?: number;
  rows?: number;
  seatsPerRow?: number;
  subjectCode?: string;
  targetRoom?: string;
};

// Test case data hardcoded for performance
const testCaseData: Record<string, ExamRoomTestCase> = {
  'TC-ADM-013': {
    caseId: 'TC-ADM-013',
    roomName: '408A-B',
    roomType: 'normal',
    capacity: 80,
  },
  'TC-ADM-014': {
    caseId: 'TC-ADM-014',
    roomName: 'สโลป 1',
    roomType: 'slope',
    rows: 5,
    seatsPerRow: 10,
  },
  'TC-ADM-015': {
    caseId: 'TC-ADM-015',
    roomName: '408A-B',
    roomType: 'normal',
    capacity: 100, // Updated capacity
  },
  'TC-ADM-016': {
    caseId: 'TC-ADM-016',
    roomName: '1238 ว.1',
    roomType: 'normal',
    capacity: 120,
    subjectCode: '513 427-2560',
    targetRoom: '1238 ว.1',
  },
  'TC-ADM-018': {
    caseId: 'TC-ADM-018',
    roomName: 'Test_Room',
    roomType: 'normal',
    capacity: 50,
  },
};

export function getExamRoomTestCase(caseId: string): ExamRoomTestCase {
  const data = testCaseData[caseId];
  if (!data) {
    throw new Error(`Test case data for "${caseId}" not found`);
  }

  // Verify case exists in CSV
  const csvCase = getAdminCase(caseId);
  if (!csvCase) {
    throw new Error(`Test case "${caseId}" not found in CSV file`);
  }

  return data;
}

export function getTestCaseCSVInfo(caseId: string): { condition: string; expected: string } {
  const csvCase = getAdminCase(caseId);
  return {
    condition: csvCase.testCondition,
    expected: csvCase.expectedOutcome,
  };
}

/**
 * Get unique room names for cleanup after tests
 */
export function getCreatedRoomNames(): string[] {
  return [
    testCaseData['TC-ADM-013'].roomName,
    testCaseData['TC-ADM-014'].roomName,
    testCaseData['TC-ADM-018'].roomName,
  ];
}
