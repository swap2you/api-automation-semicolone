import { expectStatus } from '../../../src/core/assertions/http.js';
import { uniqueId } from '../../../src/core/data/builders.js';
import { STRIPE_PATHS } from '../../../src/modules/stripe/config.js';
import { newCustomerForm } from '../../../src/modules/stripe/factories/customers.js';
import { expect, test } from '../../fixtures.js';

const hasKey = !!process.env.STRIPE_SECRET_KEY;
const describeStripe = hasKey ? test.describe : test.describe.skip;

describeStripe('Stripe idempotency @regression', () => {
  test('same Idempotency-Key + same body yields same customer id', async ({ api }) => {
    const form = newCustomerForm();
    const idem = uniqueId('idem-reg');
    const body = {
      name: form.name,
      email: form.email,
      description: form.description,
    };
    const r1 = await api.post(STRIPE_PATHS.customers, { form: body, idempotencyKey: idem });
    const r2 = await api.post(STRIPE_PATHS.customers, { form: body, idempotencyKey: idem });
    await expectStatus(r1, 200);
    await expectStatus(r2, 200);
    const a = (await r1.json()) as { id: string };
    const b = (await r2.json()) as { id: string };
    expect(a.id).toBe(b.id);
  });
});
