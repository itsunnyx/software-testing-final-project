import { extractField, getAuthCase } from '../utils/auth-csv';

export type AuthCredentials = {
  username: string;
  password: string;
};

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable \"${key}\" is not set`);
  }
  return value;
}

const mockUser = {
  username: getRequiredEnv('E2E_USER_USERNAME'),
  password: getRequiredEnv('E2E_USER_PASSWORD'),
};

const mockAdmin = {
  username: getRequiredEnv('E2E_ADMIN_USERNAME'),
  password: getRequiredEnv('E2E_ADMIN_PASSWORD'),
};

export function credentialsForCase(caseId: string): AuthCredentials {
  if (caseId === 'TCS-AUTH-002') {
    return mockAdmin;
  }
  return mockUser;
}

export function wrongPasswordForCase004(): string {
  const c004 = getAuthCase('TCS-AUTH-004');
  return extractField(c004.input, 'Password') || 'wrongpass';
}

export function expectedText(caseId: string): string {
  return getAuthCase(caseId).expected;
}
