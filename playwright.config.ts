import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  /* ⏱️ TIMEOUT CONFIGURATION */
  timeout: 120000,        // Test timeout: 120 seconds (was 30)
  expect: { timeout: 10000 }, // Assertion timeout: 10 seconds

  use: {
    baseURL: 'https://project-superend-cen8.vercel.app',
    trace: 'on-first-retry',
    navigationTimeout: 30000, // Navigation timeout: 30 seconds
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
