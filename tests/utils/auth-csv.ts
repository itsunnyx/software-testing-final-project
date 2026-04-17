import fs from 'node:fs';
import path from 'node:path';

export type AuthCaseRecord = {
  id: string;
  input: string;
  expected: string;
  type: string;
};

const AUTH_CASE_PREFIX = 'TCS-AUTH-';
const csvPath = path.resolve(process.cwd(), 'data', 'software-testing - คนที่1.csv');
let caseCache: Map<string, AuthCaseRecord> | null = null;

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

function loadCases(): Map<string, AuthCaseRecord> {
  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parseRows(content);

  const cases = new Map<string, AuthCaseRecord>();
  let insideLevel2 = false;

  for (const row of rows) {
    const c0 = (row[0] ?? '').trim();
    const c1 = (row[1] ?? '').trim();

    if (c0 === 'Test Case ID' && c1 === 'Input') {
      insideLevel2 = true;
      continue;
    }

    if (!insideLevel2) {
      continue;
    }

    if (c0 === 'ระดับที่ 3 Test Procedure Specification (Test Script)') {
      break;
    }

    if (!c0.startsWith(AUTH_CASE_PREFIX)) {
      continue;
    }

    cases.set(c0, {
      id: c0,
      input: (row[1] ?? '').trim(),
      expected: (row[2] ?? '').trim(),
      type: (row[3] ?? '').trim(),
    });
  }

  return cases;
}

export function getAuthCase(id: string): AuthCaseRecord {
  if (!caseCache) {
    caseCache = loadCases();
  }

  const record = caseCache.get(id);
  if (!record) {
    throw new Error(`Missing AUTH case in CSV: ${id}`);
  }
  return record;
}

export function extractField(input: string, fieldName: string): string {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = input.match(new RegExp(`${escaped}\\s*:\\s*(.+)`, 'i'));
  if (!match) {
    return '';
  }

  const value = match[1].trim();
  if (value.includes('(เว้นว่าง)')) {
    return '';
  }

  return value;
}
