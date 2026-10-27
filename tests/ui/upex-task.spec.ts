import {
  test,
  expect,
  type Page,
  type Locator,
  type Dialog,
} from '@playwright/test';

// Read test credentials from environment variables.
const emailValue = process.env.UPEX_TEST_EMAIL;
const passwordValue = process.env.UPEX_TEST_PASSWORD;

test.describe('UPEX Dojo - Task Management', () => {
  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  async function login(page: Page): Promise<void> {
    if (!emailValue || !passwordValue) {
      throw new Error(
        'Set UPEX_TEST_EMAIL and UPEX_TEST_PASSWORD before running UI tests.',
      );
    }

    await page.goto('/login');

    const email = page.getByTestId('login-email-input');
    const password = page.getByTestId('login-password-input');

    // Sequential typing avoids the input-reset behavior observed in WebKit.
    await email.pressSequentially(emailValue);
    await password.pressSequentially(passwordValue);

    // Verify the credentials remain populated before submitting.
    await expect(email).toHaveValue(emailValue);
    await expect(password).toHaveValue(passwordValue);

    await page.getByTestId('login-submit-button').click();

    await expect(page).toHaveURL(/\/dashboard(?:[/?#]|$)/i, {
      timeout: 20000,
    });

    await expect(page.getByText('Task Board')).toBeVisible({
      timeout: 15000,
    });
  }

  // --------------------------------------------------
  // GENERAL HELPERS
  // --------------------------------------------------

  function createRunId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function taskHeading(page: Page, title: string): Locator {
    return page.getByRole('heading', {
      name: title,
      exact: true,
    });
  }

  function taskDescription(page: Page, description: string): Locator {
    return page.getByTestId(/task-description-/).filter({
      hasText: description,
    });
  }

  async function taskCreationAvailable(page: Page): Promise<boolean> {
    const button = page.getByRole('button', {
      name: /new task/i,
    });

    await expect(button).toBeVisible();

    const enabled = await button.isEnabled();

    if (!enabled) {
      console.warn(
        'New Task is disabled. Task creation tests will be skipped.',
      );
    }

    return enabled;
  }

  async function openNewTaskForm(page: Page): Promise<void> {
    const available = await taskCreationAvailable(page);

    test.skip(
      !available,
      'Task creation is unavailable because the New Task button is disabled.',
    );

    await page.getByRole('button', { name: /new task/i }).click();

    await expect(page.getByLabel('Title')).toBeVisible();
  }

  // --------------------------------------------------
  // TASK CARD LOCATOR
  // --------------------------------------------------

  async function findTaskCard(
    page: Page,
    title: string,
    description: string,
  ): Promise<Locator> {
    const heading = taskHeading(page, title);
    const descriptionElement = taskDescription(page, description);

    await expect(heading).toBeVisible();
    await expect(descriptionElement).toBeVisible();

    // Find the smallest shared ancestor containing both elements.
    const card = page
      .locator('div')
      .filter({ has: heading })
      .filter({ has: descriptionElement })
      .filter({ has: page.getByRole('button') })
      .last();

    await expect(card).toContainText(title);
    await expect(card).toContainText(description);

    return card;
  }

  // --------------------------------------------------
  // DELETE TASK
  // --------------------------------------------------

  async function deleteTaskByTitle(
    page: Page,
    title: string,
    description: string,
  ): Promise<void> {
    const heading = taskHeading(page, title);

    if ((await heading.count()) === 0) {
      return;
    }

    const card = await findTaskCard(page, title, description);

    // Open the action menu for this task.
    await card.getByRole('button').last().click();

    const deleteMenuItem = page.getByRole('menuitem', {
      name: /^delete$/i,
    });

    await expect(deleteMenuItem).toBeVisible();

    const dialogHandler = async (dialog: Dialog): Promise<void> => {
      await dialog.accept();
    };

    page.on('dialog', dialogHandler);

    try {
      await deleteMenuItem.click();

      // Handle an optional in-page confirmation dialog.
      const confirmation = page.getByRole('dialog');

      if (await confirmation.isVisible().catch(() => false)) {
        await confirmation
          .getByRole('button', { name: /^delete$/i })
          .click();
      }

      await expect(heading).toHaveCount(0, { timeout: 10000 });
    } finally {
      page.off('dialog', dialogHandler);
    }
  }

  // --------------------------------------------------
  // TEST SETUP
  // --------------------------------------------------

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // --------------------------------------------------
  // UI-003: DASHBOARD CONTROLS
  // --------------------------------------------------

  test('UI-003: dashboard displays task management controls', async ({
    page,
  }) => {
    const button = page.getByRole('button', {
      name: /new task/i,
    });

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  // --------------------------------------------------
  // UI-004: OPEN TASK FORM
  // --------------------------------------------------

  test('UI-004: user can open the new task form', async ({ page }) => {
    await openNewTaskForm(page);

    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByLabel('Priority')).toBeVisible();

    await expect(
      page.getByRole('button', { name: /create task/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /^cancel$/i }),
    ).toBeVisible();
  });

  // --------------------------------------------------
  // UI-005: CREATE TASK
  // --------------------------------------------------

  test('UI-005: user can create a task with valid data', async ({
    page,
  }) => {
    const runId = createRunId();
    const title = `Playwright QA Task ${runId}`;
    const description = `Automated test description ${runId}`;

    await openNewTaskForm(page);

    await page.getByLabel('Title').fill(title);
    await page.getByLabel(/description/i).fill(description);

    await page
      .getByRole('button', { name: /create task/i })
      .click();

    try {
      await expect(taskHeading(page, title)).toBeVisible({
        timeout: 10000,
      });

      await expect(taskDescription(page, description)).toBeVisible();

      await expect(taskDescription(page, description)).toContainText(
        description,
      );
    } finally {
      // Clean up only the unique task created by this test.
      if (await taskHeading(page, title).count()) {
        await deleteTaskByTitle(page, title, description);
      }
    }
  });

  // --------------------------------------------------
  // UI-006: REQUIRED TITLE VALIDATION
  // --------------------------------------------------

  test('UI-006: form rejects an empty task title', async ({ page }) => {
    await openNewTaskForm(page);

    const titleInput = page.getByLabel('Title');

    await expect(titleInput).toHaveAttribute('required', '');
    await expect(titleInput).toHaveValue('');

    const validation = await titleInput.evaluate(
      (element: HTMLInputElement) => ({
        valid: element.checkValidity(),
        message: element.validationMessage,
      }),
    );

    expect(validation.valid).toBe(false);
    expect(validation.message).toBeTruthy();
  });

  // --------------------------------------------------
  // UI-007: CANCEL TASK CREATION
  // --------------------------------------------------

  test('UI-007: user can cancel task creation', async ({ page }) => {
    const title = `Cancelled QA Task ${createRunId()}`;

    await openNewTaskForm(page);

    await page.getByLabel('Title').fill(title);

    await page
      .getByRole('button', { name: /^cancel$/i })
      .click();

    await expect(page.getByLabel('Title')).toBeHidden();
    await expect(taskHeading(page, title)).toHaveCount(0);
  });

  // --------------------------------------------------
  // UI-008: DELETE TASK
  // --------------------------------------------------

  test('UI-008: user can delete a task', async ({ page }) => {
    const runId = createRunId();
    const title = `Playwright Delete Task ${runId}`;
    const description = `Deletion test data ${runId}`;

    await openNewTaskForm(page);

    await page.getByLabel('Title').fill(title);
    await page.getByLabel(/description/i).fill(description);

    await page
      .getByRole('button', { name: /create task/i })
      .click();

    try {
      await expect(taskHeading(page, title)).toBeVisible({
        timeout: 10000,
      });

      await expect(taskDescription(page, description)).toBeVisible();

      await deleteTaskByTitle(page, title, description);
    } finally {
      // Retry cleanup if the task still exists.
      if (await taskHeading(page, title).count()) {
        await deleteTaskByTitle(page, title, description);
      }
    }

    await expect(taskHeading(page, title)).toHaveCount(0);
  });
});