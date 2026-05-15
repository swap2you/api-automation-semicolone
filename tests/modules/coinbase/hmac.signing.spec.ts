import { expect, test } from '@playwright/test';

import { signCoinbaseExchangeRequest } from '../../../src/core/auth/auth-factory.js';

test.describe('Coinbase Exchange signing @contract', () => {
  test('HMAC produces non-empty signature headers', async () => {
    const signed = await signCoinbaseExchangeRequest({
      secret: 'test-secret',
      method: 'GET',
      requestPath: '/accounts',
      body: '',
    });
    expect(signed['CB-ACCESS-SIGN'].length).toBeGreaterThan(10);
    expect(signed['CB-ACCESS-TIMESTAMP']).toMatch(/\d+\.\d+/);
  });
});
