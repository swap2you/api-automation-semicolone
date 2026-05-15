import { expectStatus } from '../../../src/core/assertions/http.js';
import { PLAID_PATHS } from '../../../src/modules/plaid/config.js';
import { expect, test } from '../../fixtures.js';

const hasPlaid = !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
const describePlaid = hasPlaid ? test.describe : test.describe.skip;

describePlaid('Plaid sandbox @smoke', () => {
  test('sandbox public token create', async ({ api }) => {
    const res = await api.post(PLAID_PATHS.sandboxPublicToken, {
      data: {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        institution_id: process.env.PLAID_INSTITUTION_ID ?? 'ins_109508',
        initial_products: (process.env.PLAID_INITIAL_PRODUCTS ?? 'investments').split(','),
      },
    });
    await expectStatus(res, 200);
    const body = (await res.json()) as { public_token: string };
    expect(body.public_token).toBeTruthy();
  });
});
