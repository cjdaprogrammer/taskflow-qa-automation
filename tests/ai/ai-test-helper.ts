import { APIRequestContext, expect } from '@playwright/test';

const OLLAMA_MODEL = 'llama3.2:3b';

export async function generateAIResponse(
  request: APIRequestContext,
  prompt: string
): Promise<string> {
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
