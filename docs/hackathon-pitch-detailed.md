# Semicolons 2026 — Detailed Pitch Deck (Team Dhurandhar)

Copy into **“Semicolons Solution Pitch_Detailed_Team Dhurandhar- Detailed.docx”** (11 slides).  
All metrics below match the **apiautomation** repository as of the hackathon build.

---

## Slide 1 — Title

**SEMICOLONS 2026**

**API Automation Accelerator**

**Team Dhurandhar**

**Modular API automation using Playwright Test (Node.js + TypeScript)**

**Subtitle:** A reusable, config-driven API test framework for faster validation across microservices—with contract checks, CI/CD, Allure reporting, and Microsoft Teams notifications.

**Date:** 16th & 17th May 2026

**Footer:** Semicolons 2026 | Team Dhurandhar

---

## Slide 2 — Problem statement

**Title:** Problem statement

**Opening bullets (keep both):**
- API quality is constrained by **fragmented tools**, **slow validation**, and **limited visibility**—leading to error-prone, non-scalable processes.
- Inefficient API validation **slows delivery**, **increases defects**, and **reduces stakeholder confidence**.

### Four columns (replace placeholders)

| Fragmented Tooling | Late-Stage Failures | Slow Manual Validation | Zero Stakeholder Clarity |
|--------------------|---------------------|------------------------|---------------------------|
| Postman folders, one-off scripts, and custom reports **do not share** auth, schemas, or CI hooks. | Contract drift and auth regressions surface in **QA/staging**, not at PR time. | Manual API checks **do not scale** across dozens of microservices and environments. | Leads lack a **single pass/fail view** after each pipeline run. |

### In Finance, API Failures Are Business-Risk Events

1. **Critical workflows at risk** — enrollment, payments, balances, participant data depend on stable HTTP contracts every release.  
2. **Auditability is non-negotiable** — versioned tests, repeatable runs, documented results (Allure + JSON + CI artifacts).  
3. **Regression gaps cascade** — one broken field in a forecast or payment API corrupts downstream consumers.

**Footer:** Semicolons 2026 | Team Dhurandhar | Slide 2

---

## Slide 3 — Solution overview

**Title:** Solution — API Automation Accelerator (Playwright)

**Summary line:**  
A unified framework that **standardizes API validation** through reusable core libraries, module packs, and CI-driven visibility—built in a **24-hour hackathon sprint** with production-minded patterns (not a slide-only concept).

### Three benefit bullets

- **Accelerate new API onboarding** — plug in via OpenAPI, Postman v2.1 import, or manual `src/modules/<name>` config; run smoke/regression/contract suites immediately.  
- **Standardize across teams** — shared `ApiClient`, auth factory, Ajv helpers, fixtures, and reporters.  
- **Eliminate manual repetition** — tagged suites (`@smoke`, `@regression`, `@negative`, `@contract`) run in GitHub Actions with the same reports every time.

### One framework. Multiple APIs. Consistent validation.

**Subline:** Built on **Playwright Test API** (Node 20+, TypeScript)—config-driven, CI-ready, environment-aware (`TARGET_ENV`: local · qa · staging · prod-like).

### Four feature boxes

| Config-Driven | Modular Utilities | CI/CD Ready | Reporting Built-In |
|---------------|-------------------|-------------|---------------------|
| `config/environments/*.ts` + `.env` secrets | `src/core` + `src/modules/*` per domain | `ci.yml`, `nightly.yml`, `publish-allure.yml` | Playwright HTML, Allure, JSON, **Teams**, CSV/PDF export |

**Footer:** Slide 3

---

## Slide 4 — Framework architecture

**Title:** API Automation using Playwright — Framework Architecture

### Core architecture
- **Node.js + TypeScript** API automation via Playwright `APIRequestContext`  
- **No UI/browser** automation in v1 (API-only scope)

### Layered design
- **`src/core`** — config loader, `ApiClient`, auth (Bearer, API key, OAuth2 client-credentials, Basic, HMAC), OpenAPI + Postman import, Ajv, GitHub step summary, notifications  
- **`src/modules`** — open-meteo, stripe, plaid, fred, sec, alpaca, coinbase (+ schemas/README per module)  
- **`tests/modules`** — specs tagged `@smoke` · `@regression` · `@negative` · `@contract` · `@provisional`

### Key features (left column)
- **Multi-strategy authentication** — header/query keys, Bearer, OAuth2, Stripe form + **Idempotency-Key**, Coinbase HMAC pre-sign  
- **Smart onboarding** — `importPostmanCollectionV21`, OpenAPI validation (`tests/contracts/openapi.spec.ts`)  
- **Contract validation** — checked-in JSON Schema (e.g. Open-Meteo `forecast-response.json`)

### Right column
- **Reusable fixtures** — `tests/fixtures.ts` resolves module config + auth per Playwright project  
- **Environment isolation** — `TARGET_ENV` switches base URLs; secrets in `.env` / GitHub Secrets  
- **Reporting & CI/CD** — list + HTML + JSON + Allure; `global-teardown` → Teams + `GITHUB_STEP_SUMMARY`

### Architecture flow (bottom icons — labels to use)

**Top row:** Config → API Modules → Request Builder → Test Data → Validation  

**Bottom row (GitHub Actions):** Push code → Trigger CI → Run API tests → Generate reports → Teams / Allure / artifacts  

**Footer:** Slide 4

---

## Slide 5 — Working framework (correct the old “5 endpoints / 1 module” text)

**Title:** Working Framework — Not Just a Concept

**Headline:** Delivered in **24 hours**: an operational API automation accelerator with **real HTTP calls**, **real reports**, and **real CI execution**.

### Stats (use these — verified)

| Stat | Correct value |
|------|----------------|
| **API test scenarios** | **25** total (`test()` count in repo) |
| **CI suite (`test:ci`)** | **17** scenarios · **8 passed** · **9 skipped** · **0 failed** (~8s) |
| **Live demo module** | **Open-Meteo** (5 passed + 1 provisional skip without keys) |
| **Modules architected** | **8** Playwright projects |
| **Build time** | 24h hackathon sprint |
| **Deliverables** | Tests · Allure · Playwright HTML · Teams notify · Export (CSV/PDF/ZIP) · CI workflows · 17 docs |

**Right panel:** Keep illustration; caption: *“CI green + Allure + Teams = proof of execution.”*

**Footer:** Semicolons 2026 | Team Dhurandhar

---

## Slide 6 — Current API coverage

**Title:** Current API Coverage

### Live / demo module (center)
**Open-Meteo Weather Forecast API** — public, stable, no API key; ideal for live demo.

**Automated scenarios (open-meteo):**
- Smoke — GET forecast 200 + hourly series  
- Contract — Ajv schema validation (`forecast-response.json`)  
- Regression — extended hourly variables  
- Negative — invalid/missing latitude  
- Provisional POST — documents accept/reject behavior  

### Future-ready box (blue)
Modules **implemented and wired** (run when secrets provided):

| Module | Auth | CI without keys |
|--------|------|-----------------|
| Stripe | Bearer + form + idempotency | Skipped |
| Plaid | Sandbox client/secret | Skipped |
| FRED | API key query | Skipped |
| SEC | User-Agent header | **Runs** |
| Alpaca | Paper API keys | Skipped |
| Coinbase | HMAC signing fixture | **Runs** |
| Contracts | OpenAPI file validate | **Runs** |

### Right column — update “email only” to Teams + Allure

- **Real-time execution summary** — Allure Overview + suites by module label  
- **Endpoint-level status** — per-spec pass/fail/skip in Allure and **Teams `testResults` table** (from `test-results.json`)  
- **Stakeholder notifications** — **Microsoft Teams** (Power Automate webhook) after every run when `TEAMS_NOTIFY_ALWAYS=true`; optional SMTP  

**Footer:** Semicolons 2026 | Team Dhurandhar (fix typo “2028” if present in template)

---

## Slide 7 — Visibility built into the framework

**Title:** Visibility Built Into the Framework

**Subtitle:** Leadership gets clear quality health signals — **no repository access required**.

### Left infographic labels (map to our product)

Execution summary → **Teams message**: verdict, counts, full test table  
Test counts → **8 passed / 9 skipped / 0 failed** (last `test:ci`)  
Endpoint status → **Per-module rows** (open-meteo, sec, coinbase, contracts, …)  
Response times → **Duration per test** in CSV/Teams (ms)  
Failure details → First error line per failed test  
View report → **Allure** `http://localhost:9292` + **Export** button (CSV/PDF/HTML ZIP)

### Right three boxes
1. **Real-time execution summary** — `test-results.json` parsed in teardown  
2. **Performance indicators** — duration_ms column in export/Teams  
3. **Stakeholder notifications** — Teams live data; email optional  

### Bottom four pillars
- **Eliminate manual repetition** — `npm run test:ci` replaces manual Postman regression for covered APIs  
- **Accelerate onboarding** — module template + Postman/OpenAPI paths (`docs/module-onboarding.md`)  
- **Standardize across teams** — one `src/core`, shared tags and reporters  
- **GenAI-ready (Phase 2)** — OpenAPI/Postman inputs suitable for Copilot-assisted test generation (honest: not auto-runtime today)

**Footer:** Semicolons 2026 | Team Dhurandhar

---

## Slide 8 — Real-time execution summary (Allure)

**Title:** Real-Time Execution Summary

**Subtitle:** Allure reports show pass/fail/skip by module; **Teams notifications mirror the same rows** as CSV export.

### Suggested screenshots to paste
1. **CI pass run** — Overview: 8 passed, 9 skipped, 0 failed (`npm run test:ci`)  
2. **Open-Meteo only** — 5 passed, 1 skipped (~1.3s)  
3. **Optional demo** — `@demo-failure` run for shift-left training (12 failed, 10 passed, 2 skipped) — label as *“intentional failure demos”*

### Caption for detailed list slide
**Example (CI, no demos):**  
17 test cases · 8 passed · 9 skipped · 0 failed · modules: open-meteo, sec, coinbase, contracts (+ stripe/plaid/fred/alpaca skipped without secrets)

**Do not claim 145 tests** — use real counts above.

**Footer:** Slide 8

---

## Slide 9 — Why this approach stands out

**Title:** Why this approach stands out

### Compared with today’s way
- Basic status-code checks only  
- Single Postman collection per team  
- Manual report review in email threads  
- No pipeline integration  
- No stakeholder visibility  

### Our differentiators
- **Multi-API config-driven** — 8 projects, one engine  
- **Modular reusable core** — auth + contracts + client  
- **Auto dashboard + Teams** — Allure + export + webhook  
- **GitHub Actions built-in** — PR CI + nightly + Allure publish workflow  
- **AI-assisted development** — Cursor/Copilot for 24h delivery (tests authored by team, not generated at runtime)  
- **Fintech-grade patterns** — idempotency, HMAC, SEC User-Agent, schema shift-left  

### Highlights (pick one for slide)
**AI-assisted framework accelerates API validation with reusable modules, contract checks, and continuous CI + Teams visibility—without claiming magic auto-coverage from prose docs.**

**Footer:** Slide 9

---

## Slide 10 — Demo storyboard

**Title:** What will you show in the live walkthrough? (5 min)

### Step 1 — Start state (already strong in template — keep)
- Disconnected tools, manual scripts, slow validation, limited visibility, per-env setup pain.

### Step 2 — Action (replace placeholder)
```powershell
npm ci
cp .env.example .env   # TEAMS_WEBHOOK_URL already set
npm run test:open-meteo
npm run report:allure:view
```

### Step 3 — Magic moment (orange border)
Run **`npm run test:ci`** → show terminal: `Notification: Teams message posted (live results from test-results.json)` → open Teams channel: **same 17 rows as CSV**.

Optional 30s: open Allure **Export report** → download CSV.

### Step 4 — Outcome
Built a **working** framework: speed (parallel Playwright), reuse (core/modules), visibility (Allure + Teams), pipeline readiness (3 GitHub workflows)—**delivered in one hackathon sprint**.

**Footer:** Semicolons 2026 | Team Dhurandhar

---

## Slide 11 — Close strong + roadmap

**Title:** CLOSE STRONG

**One sentence:**  
We give Persistent and clients a **repeatable API automation accelerator**—**25 scenarios**, **8 modules**, **contract shift-left**, and **Teams/Allure reports that show the same truth** after every `npm run test:ci`.

### Where this can go next (roadmap)

| Phase | Title | Detail |
|-------|--------|--------|
| 1 | **Expand coverage** | Enable Stripe/Plaid/FRED/Alpaca in client envs with secrets |
| 2 | **Auto-generate tests** | Postman/OpenAPI → skeleton specs (opt-in CLI) |
| 3 | **Contract testing** | Deeper `$ref` resolution; consumer-driven contracts |
| 4 | **Performance SLAs** | p95 thresholds on critical endpoints |
| 5 | **Enterprise traceability** | Central config service, audit export, gitleaks |

### Final ask
**Pilot** with one squad: onboard their OpenAPI + 10 smoke tests in 1 week.

**Presenter:** Team Dhurandhar | your.name@example.com

### Checklist
- [x] One story  
- [x] Architecture simplified  
- [x] Benefits = business outcomes  
- [ ] Demo rehearsed  
- [ ] Closing memorized  

**Footer:** Semicolons 2026 | Team Dhurandhar

---

## Quick reference — copy for Q&A

**Q: Is it AI-powered?**  
A: **AI-assisted development** (Copilot/Cursor) during the sprint; runtime tests are deterministic Playwright + Ajv. Phase 2 can add spec-assisted generation.

**Q: How many APIs?**  
A: **8 module packs**; **25** automated scenarios; **17** run in standard CI without demo-failure tags.

**Q: Proof it works?**  
A: Public GitHub repo, green `test:ci`, Allure on localhost:9292, Teams notification from live `test-results.json`.

**Q: Fintech?**  
A: Stripe test mode, Plaid sandbox, SEC compliance, Coinbase HMAC, shift-left schema demos for retirement/brokerage-style API governance.
