import { expect } from '@playwright/test';

export function expectDefined<T>(value: T, label: string): asserts value is NonNullable<T> {
  expect(value, `${label} should be defined`).toBeTruthy();
}

export function expectArrayOfObjects(
  value: unknown,
  minLength = 1,
): asserts value is Record<string, unknown>[] {
  expect(Array.isArray(value)).toBeTruthy();
  expect((value as unknown[]).length).toBeGreaterThanOrEqual(minLength);
}
