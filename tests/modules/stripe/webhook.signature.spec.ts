import { expect } from '@playwright/test';

import {
  signStripeWebhookPayload,
  verifyStripeV1Signature,
} from '../../../src/modules/stripe/webhook-signature.js';
import { test } from '../../fixtures.js';

const hasSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
const describeHook = hasSecret ? test.describe : test.describe.skip;

describeHook('Stripe webhook signing fixture', () => {
  test('synthetic Stripe-Signature header verifies', () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;
    const payload = JSON.stringify({ id: 'evt_test', type: 'customer.created' });
    const ts = Math.floor(Date.now() / 1000);
    const header = signStripeWebhookPayload(secret, payload, ts);
    expect(
      verifyStripeV1Signature({
        secret,
        payload,
        header,
        toleranceSec: 600,
      }),
    ).toBe(true);
  });
});
