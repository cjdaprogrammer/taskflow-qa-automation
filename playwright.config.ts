import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Exclude API tests and the default Playwright example from browser runs
  testIgnore: ['**/tests/api/**', '**/tests/example.spec.ts'],

  // Run independent tests in parallel
  fullyParallel: true,

  // Prevent accidental test.only usage in CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests in CI
  retries: process.env.CI ? 2 : 0,

  // Limit CI workers; use Playwright defaults locally
  workers: process.env.CI ? 1 : undefined,

  // Generate an HTML report
  reporter: [
    ['html', { open: 'never' }],
  ],

  // Global test timeout and assertion timeout
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  // Shared browser settings
  use: {
    baseURL: 'https://dojo.upexgalaxy.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Cross-browser test projects
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

  // Enable this later if testing a locally hosted application
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});