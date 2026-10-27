import { test, expect } from '@playwright/test';

const emailValue = process.env.UPEX_TEST_EMAIL;
const passwordValue = process.env.UPEX_TEST_PASSWORD;

test('UI-001: user can log in and access the dashboard', async ({ page }) => {
  if (!emailValue || !passwordValue) {
    throw new Error(
      'Set UPEX_TEST_EMAIL and UPEX_TEST_PASSWORD before running UI tests.'
    );
  }

  await page.goto('/login');

  const loginForm = page.getByTestId('app-main-content');
  const email = page.getByTestId('login-email-input');
  const password = page.getByTestId('login-password-input');

  await expect(loginForm).toBeVisible();
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();

  // Sequential typing avoids the input-reset behavior observed in WebKit.
  await email.pressSequentially(emailValue);
  await password.pressSequentially(passwordValue);

  await expect(email).toHaveValue(emailValue);
  await expect(password).toHaveValue(passwordValue);

  await page.getByTestId('login-submit-button').click();

  await expect(page).toHaveURL(/\/dashboard(?:[/?#]|$)/i, {
    timeout: 20000,
  });

  await expect(page.getByText('Task Board')).toBeVisible({
    timeout: 15000,
  });
});