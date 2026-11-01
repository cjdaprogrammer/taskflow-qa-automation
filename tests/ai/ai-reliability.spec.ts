import { test, expect } from '@playwright/test';
import {
  generateAIResponse,
  validatePrompt,
  MAX_PROMPT_LENGTH,
} from './ai-test-helper';

test.describe('AI Reliability Tests - Ollama', () => {
  test('AI-004: should provide reasonably consistent responses', async ({ request }) => {
    const prompt =
      'Explain the purpose of regression testing in software QA.';

    const firstResponse = await generateAIResponse(request, prompt);
    const secondResponse = await generateAIResponse(request, prompt);

    const normalize = (text: string): Set<string> =>
      new Set(
        text
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3)
      );

    const firstWords = normalize(firstResponse);
    const secondWords = normalize(secondResponse);

    const commonWords = [...firstWords].filter(word =>
      secondWords.has(word)
    );

    const similarity =
      commonWords.length /
      Math.max(firstWords.size, secondWords.size, 1);

    expect(firstResponse.length).toBeGreaterThan(20);
    expect(secondResponse.length).toBeGreaterThan(20);
    expect(similarity).toBeGreaterThanOrEqual(0.35);
  });

  test('AI-005: should acknowledge an unknown fictional fact', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        model: 'llama3.2:3b',
        system:
          'You are a careful QA assistant. Never invent facts. If information is unknown or cannot be verified, clearly say so.',
        prompt:
          'What was the exact number of automated tests executed by the fictional company Zorvanta Testing Labs on March 18, 1987? Do not guess.',
        stream: false,
        options: {
          temperature: 0,
          seed: 42,
        },
      },
      timeout: 120_000,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    const answer = String(body.response ?? '').toLowerCase();

    expect(answer.length).toBeGreaterThan(10);
    expect(answer).toMatch(
      /don't know|do not know|cannot verify|can't verify|no information|not available|fictional|unable to determine|cannot determine/
    );
  });

  test('AI-006a: should reject an empty prompt', async () => {
    expect(() => validatePrompt('')).toThrow(
      'Prompt must not be empty.'
    );

    expect(() => validatePrompt('   ')).toThrow(
      'Prompt must not be empty.'
    );
  });

  test('AI-006b: should reject a prompt exceeding the maximum length', async () => {
    const oversizedPrompt = 'A'.repeat(MAX_PROMPT_LENGTH + 1);

    expect(() => validatePrompt(oversizedPrompt)).toThrow(
      `Prompt exceeds the maximum length of ${MAX_PROMPT_LENGTH} characters.`
    );
  });

  test('AI-006c: should accept a valid prompt within the length limit', async () => {
    const validPrompt = 'Explain software quality assurance.';

    expect(() => validatePrompt(validPrompt)).not.toThrow();
  });
});