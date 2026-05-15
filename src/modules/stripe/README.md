# Stripe module (test mode)

Demonstrates **authenticated** REST automation in a fintech-grade provider: [Stripe API authentication](https://docs.stripe.com/api/authentication), [Sandboxes](https://docs.stripe.com/sandboxes).

## Prerequisites

- `STRIPE_SECRET_KEY` beginning with `sk_test_` (never commit real keys).
- Optional: `STRIPE_WEBHOOK_SECRET` for synthetic signature checks in tests. The included helper is **educational** (HMAC over `timestamp.body`). Prefer Stripe’s SDK `constructEvent` with raw request bodies in production.

## What is covered

- Create and retrieve **Customers** using `application/x-www-form-urlencoded` bodies (Stripe’s default).
- **Idempotency-Key** header on creates to show safe retries.
- Negative: invalid API key → `401`.
- Contract: error object shape (subset).
- Webhook **signing fixture** (no listener required) using `STRIPE_WEBHOOK_SECRET`.

## Known limitations

- Does not stand up a public HTTP webhook endpoint in CI (by design for hackathon scope).
- Rate limits and state are in your Stripe test account; use unique emails/metadata.
- Live mode keys must never be used in this framework.

## Running

```bash
export STRIPE_SECRET_KEY=sk_test_...
npx playwright test --project=stripe
```
