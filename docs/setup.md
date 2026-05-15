# Setup

## Requirements

- **Node.js 20+** (LTS aligned).  
- npm (ships with Node).

## Install

```bash
npm ci
npx playwright install --with-deps chromium
```

> API tests use the `request` fixture; installing Chromium satisfies Playwright’s installer expectations on clean agents (including GitHub-hosted runners).

## Configuration

1. Copy [`.env.example`](../.env.example) to `.env`.  
2. Set `TARGET_ENV` to `local` | `qa` | `staging` | `prod-like`.  
3. Populate provider keys **only** for modules you intend to run:

| Variable | Module |
|----------|--------|
| `STRIPE_SECRET_KEY` | Stripe (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Optional webhook signing fixture |
| `PLAID_CLIENT_ID`, `PLAID_SECRET` | Plaid sandbox |
| `FRED_API_KEY` | FRED |
| `ALPACA_API_KEY_ID`, `ALPACA_API_SECRET_KEY` | Alpaca paper |
| `COINBASE_*` | Coinbase Exchange signing demos |
| `SEC_USER_AGENT` | SEC / `www.sec.gov` courtesy |

## GitHub Actions secrets

Mirror `.env` variables as repository secrets for private CI. See [.github/workflows/ci.yml](../.github/workflows/ci.yml) for the wired names.

**Email (optional):** set repository secret `NOTIFY_ENABLED` to `true` and provide `SMTP_*`, `NOTIFY_FROM`, `NOTIFY_TO` on **nightly** workflows if you want pass/fail mail without spamming every PR.
