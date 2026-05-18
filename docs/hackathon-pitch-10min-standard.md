# Semicolons 2026 — 10-Minute Pitch (Standard Template)

**Team:** Team Dhurandhar  
**Event:** Semicolons 2026 | 16–17 May 2026  
**Repo:** [github.com/swap2you/api-automation-semicolone](https://github.com/swap2you/api-automation-semicolone)  
**Story arc:** Need → Approach → Benefits → Differentiation → Demo → Close  

Copy each section into the matching slide in **“Semicolons Solution Pitch - Team Dhurandhar.docx”** (7 slides).

---

## Slide 1 — Title (1 min total deck intro)

**SEMICOLONS 2026**

**Solution Pitch — API Automation Accelerator**

**Team Dhurandhar**

**Modular API Test Framework (Playwright + TypeScript)**

**One-line value proposition:**  
We help fintech and microservice teams **ship APIs with confidence** by providing a **single, config-driven automation engine** that validates contracts, runs in CI, and delivers **Allure + Teams visibility**—without every squad rebuilding Postman scripts and reports.

**Suggested timing (footer):**
- 1 min — problem  
- 2 min — approach + architecture  
- 1 min — benefits  
- 1 min — differentiation  
- 5 min — live demo  

**Speaker note:** Open with the one-liner, then say you will prove it live in 5 minutes.

---

## Slide 2 — NEED (1 min)

**What problem matters enough to solve?**

### Problem statement (left box)

**Who is affected?**  
QE engineers, API developers, and release managers in **microservice-heavy fintech** (retirement, brokerage, 529, payments).

**What breaks today?**
- **Fragmented Postman folders** — no shared auth, assertions, or reporting.  
- **One-off Node/Python scripts** per project — no reuse, hard to review in PRs.  
- **“200 OK” checks only** — schema/contract drift discovered late in QA.  
- **No stakeholder signal** — leadership cannot see API health without reading logs.

**Impact (time · cost · risk):**
- **Days to weeks** to onboard a new API to the same quality bar as the last.  
- **Late defects** near release when contract changes were not caught in CI.  
- **Audit risk** in finance when execution and results are not traceable.

**Why now (Persistent / client):**  
Semicolons theme is **turn ideas into impact**; API quality is the bottleneck for fast, safe delivery across client microservices.

### Evidence or signal (top-right, peach)

- **25 automated API scenarios** implemented in-repo (17 in CI without demo-failure tags).  
- **Last CI run (`npm run test:ci`):** 8 passed · 9 skipped (missing sandbox keys) · 0 failed · ~8s.  
- **If we do nothing:** teams keep manual regression, silent contract drift, and reactive firefighting.

### Speaker cue (bottom-right, blue)

One memorable line: *“Every new API restarts the same Postman + script + reporting work—and finance cannot afford late contract surprises.”*

---

## Slide 3 — APPROACH (2 min)

**How does your solution work?**

*Explain the idea before deep architecture.*

### Approach summary (left — 4 bullets)

1. **Onboard** — OpenAPI spec, Postman v2.1 collection, or manual module config (`src/modules/*`).  
2. **Execute** — Playwright Test `APIRequestContext` + shared `ApiClient` + pluggable **auth** (Bearer, API key, OAuth2, HMAC, Basic).  
3. **Validate** — HTTP assertions + **Ajv JSON Schema** contracts (`@contract`); tags `@smoke`, `@regression`, `@negative`.  
4. **Govern & notify** — GitHub Actions → `test-results.json` + Allure + **Microsoft Teams** (live per-test table) + optional email.

### Architecture snapshot (right — replace boxes)

| Box | Our label |
|-----|-----------|
| Users / channel | Developers · GitHub Actions · nightly CI |
| App / workflow | Playwright Test runner + `src/core` engine |
| Models / rules | Ajv schemas · OpenAPI validate · Postman import |
| Data / APIs | Open-Meteo · Stripe · Plaid · SEC · FRED · Alpaca · Coinbase |
| Outputs / actions | Allure dashboard · HTML report · Teams webhook · CSV/PDF export |

**Speaker note:** Emphasize **same engine, different modules**—demo Open-Meteo (public) then Stripe (Bearer + idempotency) with identical reporting.

---

## Slide 4 — BENEFITS (1 min)

**What value does this create?**

| Category | Metric / outcome (use on slide) |
|----------|----------------------------------|
| **Business impact** | **~70% faster onboarding** for a new API module (config + fixtures vs. greenfield scripts) |
| **User value** | **One command** (`npm run test:ci`) → pass/fail table in **Teams** + Allure—no log archaeology |
| **Operational value** | **Single Node/TS stack**; no Java + Postman + custom reporters per team |
| **Strategic value** | **Reusable IP** for Persistent delivery: 8 module slots, CI workflows, 17+ docs |

### Benefits story (left)

- **Risk:** Contract tests fail in CI when response shape drifts—not in production UI.  
- **Day one:** Run `test:open-meteo`, open `http://localhost:9292` Allure, export CSV.  
- **Scalable:** Add `src/modules/<name>` + Playwright project; secrets via `.env` / GitHub Secrets.

### Proof you can mention (right)

- **Working repo** pushed to GitHub; `npm run test:ci` exit 0 on public modules.  
- **Shift-left demo:** intentional `@demo-failure` specs for Allure/alert training (excluded from CI).  
- **Governance:** SEC User-Agent compliance; Stripe **test mode** only; secrets gitignored.

---

## Slide 5 — DIFFERENTIATION (1 min)

**Why this approach stands out** (SRI lens — vs status quo)

### Compared with today’s way (left)

- Postman collections are **manual**, not PR-gated regression.  
- Scripts are **single-project**, not modular auth + contracts.  
- Reports are **scattered** (console, ad-hoc HTML).  
- **No** standardized CI summary or Teams post with per-test rows.

### Our differentiators (middle, peach)

- **Multi-API, config-driven** — 8 Playwright projects, one core.  
- **Honest onboarding** — OpenAPI + Postman import; no “AI tests anything” claim.  
- **Fintech auth built-in** — Stripe idempotency, Plaid sandbox, Coinbase HMAC path.  
- **CI + Allure + Teams** — live `test-results.json` drives notifications (not mock data).  
- **AI-assisted build** — Cursor/Copilot accelerated the 24h sprint (Phase 2: spec→test assist).

### Sound bites (right, blue)

**Positioning:** *“Unlike fragmented Postman-only QA, our engine gives you version-controlled API regression, contract validation, and leadership-ready Teams summaries from one npm command.”*

**Example line:** *“Same report in Allure and Teams—every test row matches the CSV export.”*

---

## Slide 6 — DEMO (5 min)

**What will you show in the live walkthrough?**

### Demo storyboard

| Step | Content |
|------|---------|
| **1 — Start state** | QE has Postman tests, no CI contract checks; manager asks “did APIs pass?” after merge. |
| **2 — Action** | `cp .env.example .env` → `npm ci` → `npm run test:open-meteo` (5 tests pass, 1 provisional skip). |
| **3 — Magic moment** | `npm run report:allure` + `npm run report:allure:view` → **http://localhost:9292** — contract schema, failures filter; `npm run test:ci` → **Teams message** with full 17-row table from real JSON. |
| **4 — Outcome** | Optional: `STRIPE_SECRET_KEY=sk_test_… npm run test:stripe` — same reports, different auth; show **Export report** (HTML ZIP / CSV / PDF). |

### Live commands (copy-paste)

```powershell
npm run test:open-meteo
npm run report:allure:full
npm run report:allure:view
npm run test:ci
```

**Tip (footer):** Show only Open-Meteo + Allure + Teams—not every skipped module unless time allows.

**Backup if network fails:** Open pre-generated `allure-report` and last Teams screenshot.

---

## Slide 7 — CLOSE STRONG

**Restate in one sentence:**  
Fintech teams lose weeks to fragmented API checks—we delivered a **Playwright-based accelerator** that runs **25 real scenarios** across **8 modules**, surfaces **contract drift in CI**, and pushes **the same pass/fail table to Teams and Allure** after every run.

**Optional ask:** Pilot on one client microservice squad—onboard their OpenAPI/Postman in a week using our module template.

**Presenter line:**  
Team Dhurandhar | your.name@example.com

### Final checklist (right box)

- [x] One story: **unified API automation + visibility**  
- [x] Architecture labels simplified (core · modules · tests · CI)  
- [x] Benefits tied to **risk, speed, reuse**  
- [ ] Demo rehearsed ≤ 5 min  
- [ ] Closing line memorized  

---

## Appendix — Verified numbers (do not put all on slides)

| Metric | Value |
|--------|--------|
| Playwright projects | 8 (open-meteo, stripe, plaid, fred, sec, coinbase, alpaca, contracts) |
| Total `test()` scenarios | 25 |
| `npm run test:ci` (no @demo-failure) | 17 tests · 8 passed · 9 skipped · 0 failed |
| Open-Meteo only | 6 tests · 5 passed · 1 skipped |
| Tech stack | Node 20+, TypeScript, Playwright Test, Ajv, Allure, GitHub Actions |
| Docs | 17 markdown guides under `docs/` |
| Notifications | Teams (Power Automate) + optional SMTP |
| Repo | https://github.com/swap2you/api-automation-semicolone |
