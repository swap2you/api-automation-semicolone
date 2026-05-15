# Alpaca module (optional, paper trading)

Uses **paper API** base URL and header-based auth per [Alpaca docs](https://docs.alpaca.markets/us/v1.1/docs/authentication-1).

Environment variables:

- `ALPACA_API_KEY_ID`
- `ALPACA_API_SECRET_KEY`

Configured as `defaultHeaders` on the module in [`config/environments/local.ts`](../../../config/environments/local.ts).

## Running

```bash
npx playwright test --project=alpaca
```

Skipped without keys.
