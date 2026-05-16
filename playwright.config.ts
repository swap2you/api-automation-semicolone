import os from 'node:os';

import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const targetEnv = process.env.TARGET_ENV ?? 'local';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    [
      'allure-playwright',
      {
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          Framework: 'apiautomation',
          TARGET_ENV: targetEnv,
          OS: `${os.platform()} ${os.release()}`,
          Node: process.version,
        },
      },
    ],
  ],
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  use: {
    trace: process.env.CI ? 'retain-on-failure' : 'off',
  },
  projects: [
    {
      name: 'open-meteo',
      testMatch: '**/tests/modules/open-meteo/**/*.spec.ts',
    },
    {
      name: 'stripe',
      testMatch: '**/tests/modules/stripe/**/*.spec.ts',
    },
    {
      name: 'plaid',
      testMatch: '**/tests/modules/plaid/**/*.spec.ts',
    },
    {
      name: 'fred',
      testMatch: '**/tests/modules/fred/**/*.spec.ts',
    },
    {
      name: 'sec',
      testMatch: '**/tests/modules/sec/**/*.spec.ts',
    },
    {
      name: 'coinbase',
      testMatch: '**/tests/modules/coinbase/**/*.spec.ts',
    },
    {
      name: 'alpaca',
      testMatch: '**/tests/modules/alpaca/**/*.spec.ts',
    },
    {
      name: 'contracts',
      testMatch: '**/tests/contracts/**/*.spec.ts',
    },
  ],
});
