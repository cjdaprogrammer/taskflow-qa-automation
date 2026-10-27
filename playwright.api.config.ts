
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',

  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report-api',
      open: 'never',
    }],
  ],

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  use: {
    baseURL:
      process.env.API_BASE_URL ??
      'https://dojo.upexgalaxy.com',
    trace: 'retain-on-failure',
  },
});
