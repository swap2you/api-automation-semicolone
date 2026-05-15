# SEC public data module

Read-only access to published **company tickers** JSON. Per [SEC guidance](https://www.sec.gov/developer), set a descriptive **`SEC_USER_AGENT`** (contact URL or email).

The default framework base URL is **`https://www.sec.gov`** for the `company_tickers.json` file path used in smoke tests. Other SEC datasets may live on `data.sec.gov`; override with `SEC_BASE_URL` if your module targets those hosts instead.

## Running

```bash
npx playwright test --project=sec
```

## Known limitations

- Respect crawl policy; do not hammer endpoints.  
- File formats and paths can change—treat smoke as **signal**, not immutability proof.
