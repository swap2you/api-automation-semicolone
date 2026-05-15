# Test data strategy

## Principles

1. **No secrets in source** — keys only via `.env` / CI secrets.  
2. **Unique mutable data** — Stripe customers use timestamped emails / descriptions via [`src/core/data/faker-helpers.ts`](../src/core/data/faker-helpers.ts) and [`builders.ts`](../src/core/data/builders.ts).  
3. **Stable read-only data** — Open-Meteo coordinates, SEC tickers file, FRED series IDs are fixed fixtures with documented assumptions.  
4. **Environment isolation** — `TARGET_ENV` selects [`config/environments/*.ts`](../config/environments/local.ts) overlays; production-like URLs must be deliberate.

## Module factories

| Module | Factory location | Notes |
|--------|------------------|-------|
| Open-Meteo | `src/modules/open-meteo/factories/locations.ts` | Geo + hourly bundles |
| Stripe | `src/modules/stripe/factories/customers.ts` | Customer form payloads |
| Plaid | inline in specs | Sandbox institution defaults |

## Negative and contract data

- **Negatives** use impossible coordinates, malformed Stripe fields, or bad auth headers.  
- **Contracts** use Ajv schemas checked into `src/modules/open-meteo/schemas/` and inline Stripe error subset schemas in tests.

## 529 / investments framing (Plaid)

When demoing Plaid, prefer `investments` in `PLAID_INITIAL_PRODUCTS` to echo education-savings / brokerage adjacency—always valid only if enabled on your Plaid developer account.
