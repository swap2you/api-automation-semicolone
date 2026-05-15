import { expectStatus } from '../../../src/core/assertions/http.js';
import { STRIPE_PATHS } from '../../../src/modules/stripe/config.js';
import { expect, test } from '../../fixtures.js';

const hasKey = !!process.env.STRIPE_SECRET_KEY;
const describeStripe = hasKey ? test.describe : test.describe.skip;

describeStripe('Stripe negative @negative', () => {
  test('invalid bearer token returns 401', async ({ api }) => {
    const res = await api.get(`${STRIPE_PATHS.customers}/cus_invalid_for_negative`, {
      headers: { Authorization: 'Bearer sk_test_invalid_token_for_framework' },
    });
    await expectStatus(res, 401);
  });
});
