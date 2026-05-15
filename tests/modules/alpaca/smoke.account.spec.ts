import { expectStatus } from '../../../src/core/assertions/http.js';
import { expect, test } from '../../fixtures.js';

const hasAlpaca = !!(process.env.ALPACA_API_KEY_ID && process.env.ALPACA_API_SECRET_KEY);
const describeAlpaca = hasAlpaca ? test.describe : test.describe.skip;

describeAlpaca('Alpaca paper @smoke', () => {
  test('account endpoint returns 200', async ({ api }) => {
    const res = await api.get('/v2/account');
    await expectStatus(res, 200);
    const body = (await res.json()) as { account_number: string };
    expect(body.account_number).toBeTruthy();
  });
});
