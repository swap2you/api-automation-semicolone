import type { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

export async function expectStatus(res: APIResponse, status: number): Promise<void> {
  expect(res.status(), `expected status ${status}`).toBe(status);
}

export async function expectJsonKey(res: APIResponse, key: string): Promise<unknown> {
  const json = (await res.json()) as Record<string, unknown>;
  expect(json).toHaveProperty(key);
  return json[key];
}
