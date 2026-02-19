import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  globalSetup: './src/support/globalSetup.ts',
  testDir: './src/tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 3,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? (() => { throw new Error('BASE_URL is not set in .env'); })(),
    locale: 'en-AU',
    extraHTTPHeaders: { 'Accept-Language': 'en-AU,en;q=0.9' },
    trace: 'retain-on-failure' ,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    viewport: null
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {args: ['--start-maximized']},
        acceptDownloads: true,
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        acceptDownloads: true,
      },
    },
    ...(!process.env.DOCKER ? [{
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        acceptDownloads: true,
      },
    }] : []),
  ],

  outputDir: 'test-results',
});
