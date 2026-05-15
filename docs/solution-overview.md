# Solution overview

We provide a **single Playwright Test–based engine** for HTTP APIs, organized as:

1. **`src/core`** — shared building blocks (config, client, auth, contracts, assertions, reporters, optional SMTP notifications).  
2. **`src/modules`** — domain packs (Open-Meteo, Stripe, Plaid, optional FRED/SEC/Alpaca/Coinbase) with factories and README constraints.  
3. **`tests/modules`** — smoke, regression, negative, and contract suites tagged for CI filters.

### The “magic moment” for demos

> **Same engine, different API modules, different auth models, same reporting and CI.**

- **Open-Meteo**: public GET forecast, JSON Schema validation, negative parameters (fast, reliable).  
- **Stripe (test mode)**: Bearer auth, form-encoded creates, **Idempotency-Key**, error envelope contract, optional webhook signing fixture.  
- **Fallbacks / optional**: Plaid sandbox token, FRED series (keyed), SEC public tickers (User-Agent compliant), Alpaca paper headers, Coinbase HMAC adapter.

### Benefits

| Benefit | How |
|--------|-----|
| Faster onboarding | OpenAPI validation + Postman import + manual manifest fallback |
| Reusable automation | `ApiClient`, auth strategies, Ajv helpers, fixtures |
| Regression control | Tags (`@smoke`, `@regression`, …) and environment configs |
| Standardized reporting | Playwright HTML + Allure + `GITHUB_STEP_SUMMARY` |
| CI/CD readiness | GitHub Actions workflows with artifacts |
| Governance-friendly | Secrets via `.env` / GitHub Secrets; no multi-language runtime |

### Non-goals (v1)

- No **UI / browser** automation.  
- No GraphQL / WebSocket **coverage** (Coinbase WebSocket noted as future work).  
- No “AI tests anything” claims.  
- No Java/Rest Assured in the **base** stack.
