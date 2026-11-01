import { test, expect } from '@playwright/test';
import { generateAIResponse } from './ai-test-helper';

test.describe('AI Response Quality Tests - Ollama', () => {
  test('AI-001: should provide a relevant software testing explanation', async ({ request }) => {
    const answer = await generateAIResponse(
      request,
      'Explain software quality assurance in three sentences.'
    );

    expect(answer.length).toBeGreaterThan(30);
    expect(answer.toLowerCase()).toMatch(/quality|testing|software/);
  });

  test('AI-002: should follow a requested bullet-point format', async ({ request }) => {
    const answer = await generateAIResponse(
      request,
      'List exactly three benefits of automated software testing. Use one bullet point per benefit.'
    );

    const bullets = answer
      .split('\n')
      .filter(line => /^\s*[-*•]\s+/.test(line));

    expect(bullets).toHaveLength(3);
  });

  test('AI-003: should explain a relevant QA concept', async ({ request }) => {
    const answer = await generateAIResponse(
      request,
      'Explain the difference between functional testing and performance testing.'
    );

    expect(answer.length).toBeGreaterThan(50);
    expect(answer.toLowerCase()).toContain('functional');
    expect(answer.toLowerCase()).toContain('performance');
  });
});
