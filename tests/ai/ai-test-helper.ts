import { APIRequestContext, expect } from '@playwright/test';

const OLLAMA_MODEL = 'llama3.2:3b';
export const MAX_PROMPT_LENGTH = 4000;

export function validatePrompt(prompt: string): void {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt must not be empty.');
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new Error(
      `Prompt exceeds the maximum length of ${MAX_PROMPT_LENGTH} characters.`
    );
  }
}

export async function generateAIResponse(
  request: APIRequestContext,
  prompt: string
): Promise<string> {
  validatePrompt(prompt);

  const response = await request.post('/api/generate', {
    data: {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0,
        seed: 42,
      },
    },
    timeout: 120_000,
  });

  expect(
    response.ok(),
    `Ollama API request failed: ${response.status()}`
  ).toBeTruthy();

  const body = await response.json();

  expect(typeof body.response).toBe('string');

  return body.response.trim();
}