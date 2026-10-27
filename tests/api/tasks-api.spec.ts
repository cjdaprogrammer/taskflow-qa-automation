
import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const baseURL =
  process.env.API_BASE_URL ?? 'https://dojo.upexgalaxy.com';

const email = process.env.UPEX_TEST_EMAIL;
const password = process.env.UPEX_TEST_PASSWORD;

type Task = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: 'backlog' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  position: number;
  createdAt: string;
  updatedAt: string;
};

type LoginResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
};

let api: APIRequestContext;
let token: string;

async function login(): Promise<string> {
  if (!email || !password) {
    throw new Error(
      'Set UPEX_TEST_EMAIL and UPEX_TEST_PASSWORD before running API tests.',
    );
  }

  const response = await api.post('/api/auth/login', {
    data: { email, password },
  });

  expect(response.status()).toBe(200);

  const body = (await response.json()) as LoginResponse;
  expect(body.access_token).toBeTruthy();
  expect(body.token_type).toBe('Bearer');
  expect(typeof body.expires_in).toBe('number');

  return body.access_token;
}

async function createTask(
  title: string,
  overrides: Partial<Pick<Task, 'description' | 'priority' | 'status'>> = {},
): Promise<Task> {
  const response = await api.post('/api/tasks', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      title,
      description: 'Created by the Playwright API automation suite',
      priority: 'medium',
      status: 'backlog',
      ...overrides,
    },
  });

  expect(response.status()).toBe(201);
  return (await response.json()) as Task;
}

async function deleteTaskIfPresent(id: string): Promise<void> {
  // Only call this with IDs returned by createTask in this test suite.
  const response = await api.delete(`/api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 200 = deleted; 404 = already absent. Other responses are surfaced.
  expect([200, 404]).toContain(response.status());
}

test.describe('UPEX Dojo Tasks API', () => {
  test.beforeAll(async ({ playwright }) => {
    api = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });

    token = await login();
  });

  test.afterAll(async () => {
    await api?.dispose();
  });

  test('API-001: authenticated user profile is returned', async () => {
    const response = await api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user).toBeTruthy();
    expect(body.user.email).toBe(email);
    expect(body.user.id).toBeTruthy();
  });

  test('API-002: tasks list returns a valid structure', async () => {
    const response = await api.get('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(Array.isArray(body.tasks)).toBe(true);
    expect(typeof body.meta.count).toBe('number');
    expect(typeof body.meta.maxAllowed).toBe('number');
    expect(typeof body.meta.remaining).toBe('number');
  });

  test('API-003: create task with valid data', async () => {
    let createdId: string | undefined;

    try {
      const task = await createTask(`pw-api-create-${randomUUID()}`);
      createdId = task.id;

      expect(task.id).toBeTruthy();
      expect(task.title).toContain('pw-api-create-');
      expect(task.priority).toBe('medium');
      expect(task.status).toBe('backlog');
      expect(task.userId).toBeTruthy();
      expect(Number.isNaN(Date.parse(task.createdAt))).toBe(false);
    } finally {
      if (createdId) await deleteTaskIfPresent(createdId);
    }
  });

  test('API-004: retrieve a task by ID', async () => {
    let createdId: string | undefined;

    try {
      const created = await createTask(`pw-api-get-${randomUUID()}`);
      createdId = created.id;

      const response = await api.get(`/api/tasks/${created.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status()).toBe(200);
      const task = (await response.json()) as Task;
      expect(task.id).toBe(created.id);
      expect(task.title).toBe(created.title);
    } finally {
      if (createdId) await deleteTaskIfPresent(createdId);
    }
  });

  test('API-005: update a task', async () => {
    let createdId: string | undefined;

    try {
      const created = await createTask(`pw-api-update-${randomUUID()}`);
      createdId = created.id;

      const newTitle = `pw-api-updated-${randomUUID()}`;
      const response = await api.put(`/api/tasks/${created.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          title: newTitle,
          description: 'Updated by API test',
          priority: 'high',
          status: 'in_progress',
        },
      });

      expect(response.status()).toBe(200);
      const updated = (await response.json()) as Task;
      expect(updated.id).toBe(created.id);
      expect(updated.title).toBe(newTitle);
      expect(updated.priority).toBe('high');
      expect(updated.status).toBe('in_progress');
    } finally {
      if (createdId) await deleteTaskIfPresent(createdId);
    }
  });

  test('API-006: change task status', async () => {
    let createdId: string | undefined;

    try {
      const created = await createTask(`pw-api-status-${randomUUID()}`);
      createdId = created.id;

      const response = await api.patch(`/api/tasks/${created.id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { status: 'done' },
      });

      expect(response.status()).toBe(200);
      const updated = (await response.json()) as Task;
      expect(updated.id).toBe(created.id);
      expect(updated.status).toBe('done');
    } finally {
      if (createdId) await deleteTaskIfPresent(createdId);
    }
  });

  test('API-007: delete a task created by this test', async () => {
    const created = await createTask(`pw-api-delete-${randomUUID()}`);

    const response = await api.delete(`/api/tasks/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);

    const lookup = await api.get(`/api/tasks/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(lookup.status()).toBe(404);
  });

  test('API-008: unauthenticated task listing is rejected', async () => {
    const response = await api.get('/api/tasks');

    expect(response.status()).toBe(401);
  });

  test('API-009: invalid task title is rejected', async () => {
    const response = await api.post('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: '' },
    });

    expect([400, 422]).toContain(response.status());
  });

  test('API-010: invalid status is rejected', async () => {
    let createdId: string | undefined;

    try {
      const created = await createTask(`pw-api-invalid-status-${randomUUID()}`);
      createdId = created.id;

      const response = await api.patch(`/api/tasks/${created.id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { status: 'not-a-real-status' },
      });

      expect([400, 422]).toContain(response.status());
    } finally {
      if (createdId) await deleteTaskIfPresent(createdId);
    }
  });

  test('API-011: unknown task ID returns not found', async () => {
    const response = await api.get(`/api/tasks/${randomUUID()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(404);
  });
});
