
import { test, expect } from '@playwright/test';

test.describe('UPEX Dojo - Smoke Tests', () => {
  test('UI-001: application homepage loads', async ({ page }) => {
    const response = await page.goto('https://dojo.upexgalaxy.com/');

    expect(response).not.toBeNull();
    expect(response!.ok()).toBeTruthy();

    await expect(page).toHaveURL(/dojo\.upexgalaxy\.com/);
    await expect(page.locator('body')).toBeVisible();

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
