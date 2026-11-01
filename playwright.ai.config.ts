import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ai',
  testMatch: '**/*.spec.ts',

  fullyParallel: false,
  workers: 1,
  retries: 0,

  timeout: 120_000,

  expect: {
    timeout: 10_000,
  },

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report-ai',
      open: 'never',
    }],
  ],

  use: {
    baseURL: 'http://127.0.0.1:11434',
  },
});
