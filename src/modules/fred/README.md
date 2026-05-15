# FRED module (optional)

Smokes **observations** for a public series when `FRED_API_KEY` is set. See [FRED API key docs](https://fred.stlouisfed.org/docs/api/fred/v2/api_key.html).

## Running

```bash
export FRED_API_KEY=...
npx playwright test --project=fred
```

Without the key, tests **skip** (CI-safe).
