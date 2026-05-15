import { compileSchema, formatAjvErrors } from '../../../src/core/contracts/ajv.js';
import { expectStatus } from '../../../src/core/assertions/http.js';
import { STRIPE_PATHS } from '../../../src/modules/stripe/config.js';
import { expect, test } from '../../fixtures.js';

const hasKey = !!process.env.STRIPE_SECRET_KEY;
const describeStripe = hasKey ? test.describe : test.describe.skip;

const stripeErrorSchema = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'object',
      required: ['type', 'message'],
      properties: {
        type: { type: 'string' },
        message: { type: 'string' },
        code: { type: 'string' },
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
} as const;

describeStripe('Stripe error contract @contract', () => {
  test('malformed create payload returns structured error', async ({ api }) => {
    const validate = compileSchema(stripeErrorSchema);
    const res = await api.post(STRIPE_PATHS.customers, {
      form: { email: 'not-an-email' },
    });
    await expectStatus(res, 400);
    const body = await res.json();
    const ok = validate(body);
    if (!ok) throw new Error(formatAjvErrors(validate.errors));
    expect((body as { error: { type: string } }).error.type).toBeTruthy();
  });
});
