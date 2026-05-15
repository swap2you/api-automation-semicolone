# API Automation Framework (Semicolone)

**Canonical repository:** [github.com/swap2you/api-automation-semicolone](https://github.com/swap2you/api-automation-semicolone)

**Suggested GitHub “About” description** (paste under repository **Settings → General → Description**):

> Node.js + TypeScript API test framework using Playwright Test: OpenAPI/Postman onboarding, multi-strategy auth, JSON schema contracts, Allure + HTML reports, GitHub Actions CI, optional SMTP alerts—scoped for REST/HTTP (e.g. fintech microservices).

**API-only** test automation for microservice-heavy teams, built on **Node.js (LTS)**, **TypeScript**, and **Playwright Test** `APIRequestContext`. No browser/UI automation in v1.

**Pitch:** Teams in fintech (retirement, brokerage, 529 / education savings) run dozens of HTTP services with different auth models and weak shared standards. Project-specific Postman folders and one-off scripts fragment regression signal. This framework standardizes **config**, **auth strategies**, **contract checks**, **test data helpers**, **reporting**, and **CI notifications**—while remaining honest about what “onboarding from docs” can mean.

## Supported onboarding paths

| Path | What you get |
|------|----------------|
| **OpenAPI / Swagger** | Spec validation, response schema extraction helper, Ajv validation in tests (`specs/openapi/minimal.json` example). |
| **Postman collection (v2.1)** | Normalized endpoint manifest via `importPostmanCollectionV21` + `npm run import:postman` (sample under `assets/`). |
| **Manual config** | Per-module URLs, headers, and env-based secrets when specs are prose-only. |

We **do not** claim automatic coverage of “any API from any documentation.”

## Quick start

```bash
npm ci
npx playwright install --with-deps chromium
cp .env.example .env
# Add STRIPE_SECRET_KEY (sk_test_...) to exercise Stripe; optional Plaid/FRED/Alpaca keys
npm test
```

**Projects:** `open-meteo`, `stripe`, `plaid`, `fred`, `sec`, `coinbase`, `alpaca`, `contracts` — see [`playwright.config.ts`](playwright.config.ts).

**Smoke only:**

```bash
npm run test:smoke
```

## Demo storyline (2 minutes)

1. Run `npx playwright test --project=open-meteo` — public API, schema validation, negatives.  
2. Set `STRIPE_SECRET_KEY`, run `npx playwright test --project=stripe` — same HTML + Allure + JSON summary, different auth and idempotency.  
3. Open CI job summary (GitHub Actions) and downloaded **Playwright report** + **Allure results** artifact.

### View Allure locally

Do **not** double‑click `allure-report/index.html` (`file://` breaks data loading → “500 Failed to fetch”). After `npm run report:allure`, run **`npm run report:allure:view`** and open **http://localhost:9292** — or use **`npm run report:allure:serve`** to serve straight from `allure-results`.

## Repo layout

- `src/core/` — config loader, HTTP client, auth, contracts (OpenAPI + Postman import + Ajv), assertions, reporters, email.  
- `src/modules/*/` — module defaults, factories, schemas, README per module.  
- `tests/modules/*/` — Playwright specs tagged `@smoke`, `@regression`, `@negative`, `@contract`, `@provisional`.  
- `docs/` — product + engineering documentation.  
- `.github/workflows/` — `ci.yml`, `nightly.yml`, `publish-allure.yml`.

## Implementation backlog

Prioritized scope: [docs/implementation-backlog.md](docs/implementation-backlog.md)

## Assumptions, risks, open questions

See [docs/assumptions-and-risks.md](docs/assumptions-and-risks.md).

## Documentation

| Doc | Purpose |
|-----|---------|
| [Problem statement](docs/problem-statement.md) | Why fragmentation hurts fintech API quality |
| [Solution overview](docs/solution-overview.md) | What changes with a shared engine |
| [Architecture](docs/architecture.md) | Components + diagrams |
| [Module onboarding](docs/module-onboarding.md) | OpenAPI / Postman / manual path |
| [Setup](docs/setup.md) | Tooling and secrets |
| [Running tests](docs/running-tests.md) | Local + CI invocations |
| [Reporting](docs/reporting.md) | Playwright HTML, Allure, job summary |
| [CI/CD](docs/ci-cd.md) | GitHub Actions |
| [Test data](docs/test-data-strategy.md) | Factories and environments |
| [Roadmap](docs/future-roadmap.md) | Non-goals and next steps |
| [Copilot bootstrap prompt](docs/github-copilot-bootstrap-prompt.md) | Full recreate-from-scratch spec + fixes checklist |

## License

Private / hackathon — adjust as needed.
