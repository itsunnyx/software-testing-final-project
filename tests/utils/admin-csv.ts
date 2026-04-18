import fs from 'node:fs';
import path from 'node:path';

export type AdminCaseRecord = {
  id: string;
  testCondition: string;
  expectedOutcome: string;
  type: string;
};

const ADMIN_CASE_PREFIX = 'TC-ADM-';
const csvPath = path.resolve(process.cwd(), 'data', 'software-testing - คนที่3.csv');
let caseCache: Map<string, AdminCaseRecord> | null = null;

function parseRows(content: string): string[][] {
  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const rows: string[][] = [];

  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized[i];
    const next = normalized[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if (ch === '\n' && !inQuotes) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function loadCases(): Map<string, AdminCaseRecord> {
  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parseRows(content);
  const cases = new Map<string, AdminCaseRecord>();

  // Skip header rows and find "ระดับที่ 1 Test Design Specification" section
  let inDesignSection = false;
  let headerRowIndex = -1;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (row[0]?.includes('ระดับที่ 1 Test Design Specification')) {
      inDesignSection = true;
      continue;
    }

    if (inDesignSection && row[0]?.includes('Test Case ID')) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) return cases;

  // Parse test cases from design specification section
  for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row[0] || row[0].trim() === '') break;

    const id = row[0]?.trim() || '';
    if (!id.startsWith(ADMIN_CASE_PREFIX)) continue;

    const record: AdminCaseRecord = {
      id,
      testCondition: row[1]?.trim() || '',
      expectedOutcome: row[2]?.trim() || '',
      type: row[3]?.trim() || '',
    };

    cases.set(id, record);
  }

  return cases;
}

function getCaseCache(): Map<string, AdminCaseRecord> {
  if (!caseCache) {
    caseCache = loadCases();
  }
  return caseCache;
}

export function getAdminCase(caseId: string): AdminCaseRecord {
  const cases = getCaseCache();
  const record = cases.get(caseId);
  if (!record) {
    throw new Error(`Admin test case "${caseId}" not found in CSV`);
  }
  return record;
}

export function extractField(input: string, fieldName: string): string | undefined {
  // Parse fields from input like "ชื่อ = value\nฟิลด์2 = value2"
  const lines = input.split('\n');
  for (const line of lines) {
    if (line.includes('=')) {
      const [key, value] = line.split('=');
      if (key?.trim().toLowerCase().includes(fieldName.toLowerCase())) {
        return value?.trim();
      }
    }
  }
  return undefined;
}
