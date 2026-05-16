# Run this project — step-by-step wizard

Copy each block into **PowerShell** (Windows) or **bash** (macOS/Linux). Comments start with `#` — skip those lines if your shell does not support inline comments.

---

## 0. What you need


| Requirement        | Version / notes                                                                 |
| ------------------ | ------------------------------------------------------------------------------- |
| Node.js            | **20+** (`node -v`)                                                             |
| npm                | Comes with Node                                                                 |
| Git                | Clone the repo                                                                  |
| Optional API keys  | Stripe, Plaid, FRED, Alpaca — tests **skip** without them                       |
| Teams workflow URL | Power Automate or Incoming Webhook (see [§6](#6-microsoft-teams-notifications)) |


---

## 1. Clone and install

```powershell
# Go to your workspace folder
cd "C:\path\to\your\workspace"

# Clone (replace with your fork URL if needed)
git clone https://github.com/swap2you/api-automation-semicolone.git apiautomation
cd apiautomation

# Install dependencies
npm ci

# Install Playwright browser (needed for PDF export only)
npm run install:browsers
```

---

## 2. Environment file (`.env`)

```powershell
# Create local env from template (never commit .env)
Copy-Item .env.example .env

# Open in editor and fill values
notepad .env
```

### 2.1 Minimum config (Open-Meteo only, no secrets)

Paste into `.env`:

```env
# --- Core ---
TARGET_ENV=local
OPEN_METEO_BASE_URL=https://api.open-meteo.com

# --- Reporting (local Allure URL in Teams messages) ---
ALLURE_REPORT_URL=http://localhost:9292

# --- Notifications: Teams ---
NOTIFY_CHANNEL=teams
NOTIFY_ONLY_ON_FAILURE=true
TEAMS_NOTIFY_ALWAYS=true
TEAMS_WEBHOOK_KIND=powerautomate
TEAMS_WEBHOOK_URL=PASTE_YOUR_POWER_AUTOMATE_OR_TEAMS_WEBHOOK_URL_HERE
```

### 2.2 Optional API keys (un-skip modules)

```env
# Stripe test mode — https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_xxxxxxxx

# Plaid sandbox — https://dashboard.plaid.com/developers/keys
PLAID_CLIENT_ID=
PLAID_SECRET=

# FRED — https://fred.stlouisfed.org/docs/api/api_key.html
FRED_API_KEY=

# Alpaca paper — https://app.alpaca.markets/paper/dashboard/overview
ALPACA_API_KEY_ID=
ALPACA_API_SECRET_KEY=

# SEC public API (required User-Agent string)
SEC_USER_AGENT=YourName/1.0 (you@company.com)
```

### 2.3 Email (optional, if SMTP is allowed)

```env
NOTIFY_CHANNEL=both
NOTIFY_ENABLED=true
NOTIFY_TO=you@company.com
NOTIFY_FROM=approved-sender@company.com
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

---

## 3. Verify setup

```powershell
# TypeScript compiles
npm run build

# Quick smoke (public APIs only)
npm run test:smoke
```

Expected: most tests pass; modules without keys show **skipped**.

---

## 4. Run tests

```powershell
# Full CI-style suite (excludes intentional @demo-failure demos)
npm run test:ci

# Single module (recommended first run)
npm run test:open-meteo

# All tests including demo failures (for training / shift-left demos)
npm test

# Stripe only (needs STRIPE_SECRET_KEY)
npm run test:stripe
```

---

## 5. Reports

### 5.1 Allure (interactive)

```powershell
# Generate HTML from last run
npm run report:allure

# IMPORTANT: use HTTP, not file:// (avoids "500 Failed to fetch")
npm run report:allure:view
```

Open **[http://localhost:9292](http://localhost:9292)** → use **Export report** (top-right) for HTML ZIP / CSV / PDF.

### 5.2 One-shot generate + export

```powershell
npm run report:allure:full
npm run report:allure:view
```

Exports land in `exports/` (gitignored).

### 5.3 Playwright HTML

```powershell
# After any test run
npx playwright show-report
```

---

## 6. Microsoft Teams notifications

### 6.1 Get a webhook URL

**Option A — Power Automate (your setup)**  
Teams channel → **Workflows** → create flow with trigger **“When a HTTP request is received”** or **manual HTTP trigger** → action **“Post message in a chat or channel”** → copy the **HTTP POST URL**.

**Option B — Classic Incoming Webhook**  
Channel → Connectors → Incoming Webhook → copy URL (`https://outlook.office.com/webhook/...`).

### 6.2 Configure `.env`

```env
NOTIFY_CHANNEL=teams
NOTIFY_ONLY_ON_FAILURE=true
TEAMS_WEBHOOK_KIND=powerautomate
TEAMS_WEBHOOK_URL=https://default1f4beacdb7aa49b2aaa1b8525cb257.e0.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/762897bd1ad943858b3d4adb0aef3161/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yt9M3zViJ-4UWkBwM7pMSIWzxp7VPutVG8R3b47ZtxY
ALLURE_REPORT_URL=http://localhost:9292
```

For **Power Automate**, map the flow’s Teams action to dynamic content:


| Flow field        | Use this from trigger body                 |
| ----------------- | ------------------------------------------ |
| Message / Subject | `title` or `message`                       |
| Full body         | `message` or `text`                        |
| Adaptive Card     | `attachments` (if your action supports it) |


### 6.3 Test without running the full suite

```powershell
# Preview payload in console (no send)
npm run notify:teams -- --failure

# Send live results from last test run (no mock data)
npm run notify:teams -- --send

# Mock payload only (Power Automate wiring test)
npm run notify:teams -- --demo --failure --send
```

### 6.4 Production behavior

After `npm run test:ci`, **global teardown** posts to Teams when:

- `NOTIFY_CHANNEL=teams` (or `both`)
- `TEAMS_WEBHOOK_URL` is set
- `TEAMS_NOTIFY_ALWAYS=true` (default) — **every run**, pass or fail

Email still uses `NOTIFY_ONLY_ON_FAILURE` (only on failure).

The Teams message is built from **`test-results.json`** (same data as CSV export / Allure): full per-test table, counts, failures, Allure link.

If you saw `Notification not sent: No failures` — that was the old behavior; set `TEAMS_NOTIFY_ALWAYS=true` in `.env`.

---

## 7. Common commands cheat sheet


| Goal             | Command                                    |
| ---------------- | ------------------------------------------ |
| Install          | `npm ci`                                   |
| All modules (CI) | `npm run test:ci`                          |
| Open-Meteo only  | `npm run test:open-meteo`                  |
| Allure view      | `npm run report:allure:view`               |
| Export report    | `npm run report:export -- --format all`    |
| Test Teams       | `npm run notify:teams -- --failure --send` |
| Disable alerts   | `NOTIFY_CHANNEL=none` in `.env`            |


---

## 8. Troubleshooting


| Symptom                              | Fix                                                                 |
| ------------------------------------ | ------------------------------------------------------------------- |
| Allure widgets empty / 500 fetch     | Use `npm run report:allure:view`, not `file://`                     |
| Teams message never arrives          | Run `npm run notify:teams -- --failure --send`; check URL in `.env` |
| “Notification not sent: No failures” | Expected when all pass and `NOTIFY_ONLY_ON_FAILURE=true`            |
| Stripe/Plaid all skipped             | Add keys to `.env`                                                  |
| PDF export fails                     | `npm run install:browsers`                                          |
| Power Automate 401/403               | Regenerate workflow URL; do not commit `.env`                       |


---

## 9. GitHub Actions (optional)

Store secrets: `TEAMS_WEBHOOK_URL`, `NOTIFY_CHANNEL=teams`, `TARGET_ENV=qa`.  
See `[docs/ci-cd.md](ci-cd.md)` and `[.github/workflows/nightly.yml](../.github/workflows/nightly.yml)`.

---

## 10. Related docs

- `[setup.md](setup.md)` — architecture-oriented setup  
- `[running-tests.md](running-tests.md)` — projects and tags  
- `[reporting.md](reporting.md)` — Allure + export  
- `[notifications-setup.md](notifications-setup.md)` — email + Teams detail

