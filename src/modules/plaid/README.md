# Plaid module (sandbox)

Fallback **authenticated-adjacent** module when Stripe keys are unavailable. Uses [Plaid sandbox](https://plaid.com/docs/sandbox/) only.

## Relevance (529 / investments)

Plaid’s **Investments** product can surface holdings used in college savings / brokerage-style experiences. This module focuses on **sandbox token flow**, not production investment advice.

## Prerequisites

- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV=sandbox` (default in framework local config)

## Running

```bash
npx playwright test --project=plaid
```

## Limitations

- Does not cover full OAuth Link UI; API-only as per framework v1 scope.
- Institution and product choice must match enabled products on your Plaid dev account.
