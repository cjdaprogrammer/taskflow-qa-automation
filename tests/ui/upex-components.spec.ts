
import { test, expect } from '@playwright/test';

test('UI-002: homepage displays the QA practice content', async ({
  page,
}) => {
  await page.goto('https://dojo.upexgalaxy.com/');

  await expect(
    page.getByRole('heading', { name: /welcome to upex dojo/i })
  ).toBeVisible();

  await expect(
    page.getByText('Practice Components', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(/backend testing with task api/i)
  ).toBeVisible();
});
