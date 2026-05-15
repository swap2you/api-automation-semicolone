import { expectStatus } from '../../../src/core/assertions/http.js';
import { uniqueId } from '../../../src/core/data/builders.js';
import { STRIPE_PATHS } from '../../../src/modules/stripe/config.js';
import { newCustomerForm } from '../../../src/modules/stripe/factories/customers.js';
import { expect, test } from '../../fixtures.js';

const hasKey = !!process.env.STRIPE_SECRET_KEY;
const describeStripe = hasKey ? test.describe : test.describe.skip;

describeStripe('Stripe customers @smoke', () => {
  test('create customer (form) and retrieve', async ({ api }) => {
    const form = newCustomerForm();
    const createRes = await api.post(STRIPE_PATHS.customers, {
      form: {
        name: form.name,
        email: form.email,
        description: form.description,
      },
      idempotencyKey: uniqueId('idem-smoke'),
    });
    await expectStatus(createRes, 200);
    const created = (await createRes.json()) as { id: string; email: string };
    expect(created.id).toMatch(/^cus_/);
    expect(created.email).toBe(form.email);

    const getRes = await api.get(`${STRIPE_PATHS.customers}/${created.id}`);
    await expectStatus(getRes, 200);
    const fetched = (await getRes.json()) as { id: string };
    expect(fetched.id).toBe(created.id);
  });
});
