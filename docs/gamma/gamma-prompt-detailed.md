# Gamma.app Prompt — Detailed Pitch (11 Slides)

**How to use:** Copy the block below into Gamma.app → **Generate from prompt**.  
Apply branding from [`gamma-brand-guidelines.md`](gamma-brand-guidelines.md).

**Deck type:** 11 slides, 16:9, Semicolons 2026 Team Dhurandhar detailed solution pitch  
**Product:** API Automation Accelerator — Playwright + TypeScript  

---

## PASTE THIS ENTIRE BLOCK INTO GAMMA

```
Create an 11-slide professional presentation for Persistent Systems hackathon "Semicolons 2026" (16-17 May 2026). Team: Team Dhurandhar. Match Persistent detailed pitch template: white slides with thin orange top border, navy #0D2137 title/close slides, orange #E85D04 accents, dark blue headings #1A2B4A, peach callout boxes #F8E8DE, light blue info boxes #E3F2FD. Corporate fintech engineering tone. Footer every slide: "Semicolons 2026 | Team Dhurandhar" (Team Dhurandhar in orange on white slides). Slide numbers bottom right.

Project: API Automation Accelerator — modular API test framework using Playwright Test, Node.js 20+, TypeScript. Repository: github.com/swap2you/api-automation-semicolone. Use ONLY verified metrics below—do not invent "145 tests" or "5 endpoints only".

---

SLIDE 1 — TITLE (navy left 55%, photo right 45%)

Top orange small caps: SEMICOLONS 2026

Large white title: API Automation Accelerator

Orange bordered box:
- Team Dhurandhar (orange bold)
- Modular API automation using Playwright Test (white bold)
- Subtitle white: A reusable, config-driven API test framework for faster validation across microservices—with contract checks, CI/CD, Allure reporting, and Microsoft Teams notifications.

Bottom orange: 16th & 17th May 2026

Footer: Semicolons 2026 | Team Dhurandhar
Slide 1

Right image: developer at dual monitors showing checkmarks on screens, warm professional illustration OR photorealistic laptop with orange code glow. Persistent logo top right on image area.

IMAGE PROMPT: "Professional software engineer at desk two monitors showing success checkmarks, corporate hackathon, navy and orange color grading, modern office, not cartoon"

---

SLIDE 2 — PROBLEM STATEMENT (white, orange top bar)

Title large dark blue: Problem statement

Two opening bullets:
• API quality is constrained by fragmented tools, slow validation, and limited visibility—error-prone non-scalable processes.
• Inefficient API validation slows delivery, increases defects, and reduces stakeholder confidence.

FOUR COLUMN GRID (light gray borders):

Column 1 title Fragmented Tooling: Postman folders and one-off scripts do not share auth, schemas, or CI hooks.

Column 2 Late-Stage Failures: Contract drift and auth regressions surface in QA/staging not at PR time.

Column 3 Slow Manual Validation: Manual API checks do not scale across dozens of microservices.

Column 4 Zero Stakeholder Clarity: Leads lack single pass/fail view after each pipeline run.

Section below: "In Finance, API Failures Are Business-Risk Events" with three rows and simple icons:
1. Critical workflows at risk — retirement, enrollment, payments, participant data (icon: workflow)
2. Auditability is non-negotiable — versioned tests, Allure, JSON, CI artifacts (icon: checklist)
3. Regression gaps cascade — one broken API field corrupts downstream systems (icon: chain links)

Slide 2

---

SLIDE 3 — SOLUTION OVERVIEW (white, orange top bar)

Title: Solution — API Automation Accelerator (Playwright)

Intro paragraph: A unified framework that standardizes API validation through reusable core libraries, module packs, and CI-driven visibility—built in a 24-hour hackathon sprint with production-minded patterns.

Three bullets with orange bullet dots:
• Accelerate new API onboarding — OpenAPI, Postman v2.1 import, or manual src/modules config
• Standardize across teams — shared ApiClient, auth factory, Ajv helpers, fixtures, reporters
• Eliminate manual repetition — tagged suites @smoke @regression @negative @contract in GitHub Actions

Center subhead bold: One Framework. Multiple APIs. Consistent Validation

Subline: Built on Playwright Test API (Node 20+, TypeScript)—config-driven, CI-ready, TARGET_ENV local/qa/staging/prod-like.

FOUR LIGHT BLUE BOXES in a row with icons:
1. Config-Driven — switch APIs by config, no rewrites (gear icon)
2. Modular Utilities — src/core plus src/modules (puzzle icon)
3. CI/CD Ready — ci.yml nightly.yml publish-allure.yml (pipeline icon)
4. Reporting Built-In — Playwright HTML, Allure, JSON, Teams, CSV/PDF export (chart icon)

Slide 3

---

SLIDE 4 — FRAMEWORK ARCHITECTURE (white, orange top bar)

Title: API Automation using Playwright — Framework Architecture

LEFT COLUMN two sections:

"Core architecture" bullet: Node.js + TypeScript API test automation via Playwright APIRequestContext. No UI browser automation in v1.

"Layered design" bullets:
• src/core — config, ApiClient, auth, contracts, assertions, reporters, notifications
• src/modules — open-meteo, stripe, plaid, fred, sec, alpaca, coinbase
• tests/modules — @smoke @regression @negative @contract @provisional

"Key features" bullets:
• Multi-strategy auth: API key, Basic, Bearer, OAuth2, HMAC (Coinbase), Stripe idempotency
• Smart onboarding: OpenAPI validate, Postman v2.1 import
• Contract validation: Ajv JSON Schema e.g. forecast-response.json

RIGHT COLUMN:
• Reusable fixtures per Playwright project
• Environment isolation TARGET_ENV and .env / GitHub Secrets
• Reporting: HTML + Allure + JSON; global-teardown posts Teams and GITHUB_STEP_SUMMARY

BOTTOM: TWO horizontal flow diagrams with circular icon nodes and orange arrows:

Diagram A label "Architecture snapshot": Config → API Modules → Request Builder → Test Data → Validation

Diagram B label "GitHub Actions pipeline": Push Code → Trigger CI → Run API Tests → Generate Reports → Teams / Allure / Artifacts

Slide 4

STYLE: flat icon flowchart, navy icons, orange connectors, white background

---

SLIDE 5 — WORKING FRAMEWORK (white, split layout)

Title centered bold: Working Framework — Not Just a Concept

Subtitle: Delivered in 24 hours: operational API automation accelerator with real HTTP calls, real reports, and real CI execution.

LEFT — four large stat blocks (big number orange, label navy):

25 — API test scenarios (total in repo)
17 — CI suite tests (test:ci: 8 passed, 9 skipped, 0 failed)
8 — Playwright module projects
24h — Hackathon build time

Fifth line smaller: Deliverables: Tests · Allure · Playwright HTML · Teams · Export CSV/PDF/ZIP · CI workflows · 17 docs

RIGHT: illustration person at desk with monitors showing checkmarks (warm tones, professional)

Caption under stats: Live demo module: Open-Meteo Weather API (5 passed, 1 provisional skip)

Slide 5

CRITICAL: Do NOT use old wrong stats "5 endpoints" or "1 live module only"

---

SLIDE 6 — CURRENT API COVERAGE (white)

Title: Current API Coverage

Main text: Live Module — Open-Meteo Weather Forecast API selected for hackathon demo: stable, public, no authentication, fast reliable execution.

Bullets:
• Smoke GET forecast 200 with hourly time series
• Contract Ajv schema validation
• Regression extended hourly variables
• Negative invalid and missing latitude
• Provisional POST documents accept or reject

LIGHT BLUE callout box with info icon: Future-ready: Stripe, Plaid, FRED, SEC, Alpaca, Coinbase modules architected—run when secrets provided.

RIGHT column three bullets:
• Real-time execution summary — Allure pass/fail by module
• Duration per test in export and Teams
• Stakeholder notifications — Microsoft Teams Power Automate webhook with live test-results.json table; optional SMTP email

BOTTOM LEFT: decorative weather cloud illustration with subtle chart overlay (terracotta/beige artistic style—not childish)

Small table optional:
| Module | Runs without API keys in CI |
| open-meteo, sec, coinbase, contracts | Yes |
| stripe, plaid, fred, alpaca | Skipped |

Slide 6

---

SLIDE 7 — VISIBILITY (white)

Title: Visibility Built Into the Framework

Subtitle: Leadership gets clear quality health signals — no code access required.

LEFT: infographic flow (clean boxes and arrows):
Execution Summary → Test Counts (8 PASSED green, 9 SKIPPED gray, 0 FAILED) → Per-module status grid → Response times → Failure details → View Allure Report and Teams notification

RIGHT three stacked blue-accent cards:
1. Real-Time Execution Summary — pass/fail counts after every run
2. Response-Time Indicators — duration_ms per test in CSV and Teams
3. Stakeholder Notifications — Teams message with full test table matching CSV export

BOTTOM four pillars with icons in a row:
• Eliminate Manual Repetition — automated regression replaces manual Postman checks
• Accelerate New API Onboarding — config-based module plug-in days to hours
• Standardize Across Teams — one src/core shared patterns
• GenAI-Ready Architecture — OpenAPI/Postman inputs for Phase 2 Copilot-assisted generation (honest: not runtime AI today)

Slide 7

Do NOT show "145 tests" — use 17 CI tests / 25 total scenarios

---

SLIDE 8 — ALLURE REAL-TIME SUMMARY (white)

Title: Real-Time Execution Summary

Subtitle: Allure reports provide execution summary with pass/fail metrics and module-level status; Teams notifications mirror the same rows as CSV export.

TOP: two side-by-side dashboard mockups (use placeholders for screenshots):

LEFT mockup label "CI pass run May 2026": donut chart mostly green, 17 tests, ~8 seconds, open-meteo suite green

RIGHT mockup label "Open-Meteo only": 6 tests 5 passed 1 skipped ~1.3s

CENTER text bold: Detailed execution summary — 17 test cases: 8 passed, 9 skipped, 0 failed (npm run test:ci)

BOTTOM LARGE: screenshot placeholder "Allure test case list" showing modules open-meteo, sec, coinbase, contracts with green and gray statuses

Optional smaller note in gray: Demo failure run (@demo-failure tags) available for shift-left training—12 failed when demos enabled—not production CI

Slide 8

USER MUST REPLACE placeholders with real Allure screenshots from localhost:9292

---

SLIDE 9 — DIFFERENTIATION (white, three columns like standard template)

Title: Why this approach stands out

Column 1 Compared with today's way:
• Basic status-code checks only
• Single Postman collection per team
• Manual report review
• No pipeline integration
• No stakeholder visibility

Column 2 peach Our differentiators:
• Multi-API config-driven — 8 projects one engine
• Modular reusable utility layer src/core
• Auto dashboard Allure plus Teams plus export
• GitHub Actions CI/CD built in
• AI-assisted development Cursor Copilot in sprint
• Fintech-grade auditability by design

Column 3 light blue Highlights (one paragraph bold):
AI-assisted framework accelerates API validation with reusable modules, contract checks, and continuous CI plus Teams visibility—without claiming magic auto-coverage from prose documentation.

Slide 9

---

SLIDE 10 — DEMO STORYBOARD (white, badge 5 min)

Title: What will you show in the live walkthrough?

Section label: DEMO

Four boxes horizontal with orange arrows:

Box 1 Start state (light blue) — list pain points: disconnected tools, manual scripts, slow validation, limited visibility, separate QA/staging/prod setup, high regression maintenance

Box 2 Action — placeholder text replaced with:
npm ci
npm run test:open-meteo
npm run report:allure:view (http://localhost:9292)

Box 3 Magic moment ORANGE BORDER — Driving speed standardization scalability in API quality engineering. Build once validate everywhere. Environment-aware pipeline TARGET_ENV without reconfiguration. SHOW: npm run test:ci and Teams live table plus Allure Export report button

Box 4 Outcome — Working API automation framework solving speed, reuse, visibility, pipeline readiness—delivered in single hackathon sprint.

Slide 10

---

SLIDE 11 — CLOSE STRONG (navy background)

Section label orange: CLOSE STRONG

White large text: A reusable configurable API automation framework built for faster validation across microservices—25 scenarios, 8 modules, contract shift-left, same truth in Allure and Teams after every npm run test:ci.

Section "Where This Can Go Next" — vertical timeline with 5 phases and circle icons:
Phase 1 Expand Coverage — enable Stripe Plaid FRED Alpaca with client secrets
Phase 2 Auto-Generate Tests — Postman/OpenAPI to skeleton specs CLI
Phase 3 Contract Testing — deeper ref resolution consumer-driven contracts
Phase 4 Performance SLAs — p95 thresholds on critical endpoints
Phase 5 Enterprise Traceability — central config audit export secret scanning

RIGHT white card Final checklist: one story; architecture simplified; benefits tied to outcomes; demo rehearsed; closing memorized

Bottom presenter: Swapnil Patil | IARS | swapnil_patil10@persistent.com

Footer: Semicolons 2026 | Team Dhurandhar
Slide 11
```

---

## Image & asset upload guide (detailed deck)

| Slide | Asset | How to obtain |
|-------|--------|----------------|
| 1 | Title hero | Gamma AI per prompt OR stock developer/laptop |
| 5 | Person at monitors | Gamma illustration prompt in slide 5 |
| 6 | Weather/cloud art | AI abstract clouds + chart OR Unsplash weather |
| 8 | Allure Overview | Screenshot `allure-report` after `npm run report:allure` |
| 8 | Allure test list | Suites view filtered by module |
| 8 | Teams message | Screenshot channel after `npm run test:ci` |
| 10 | Terminal (optional) | `Notification: Teams message posted...` line |

### Allure screenshot commands

```powershell
npm run test:ci
npm run report:allure
npm run report:allure:view
# Capture http://localhost:9292 — Overview and Behaviors/Suites pages
```

---

## Gamma settings checklist

- [ ] Aspect ratio **16:9**  
- [ ] Theme colors: Navy `#0D2137`, Orange `#E85D04`  
- [ ] Font: clean sans-serif (Inter / Segoe UI)  
- [ ] Disable overly creative/whimsical image style  
- [ ] **Card layout** for stats slide (slide 5)  
- [ ] **Diagram** layout for architecture (slide 4)  
- [ ] Export: PDF for judges + PPTX if required by Persistent  

---

## Metric reference (do not change)

| Metric | Value |
|--------|--------|
| Total test scenarios | 25 |
| CI (`npm run test:ci`) | 17 tests · 8 passed · 9 skipped · 0 failed |
| Playwright projects | 8 |
| Docs in repo | 17+ markdown files |
| GitHub workflows | ci.yml, nightly.yml, publish-allure.yml |
| Demo module | Open-Meteo (5 passed, 1 skipped) |

---

## Related docs

- [`../hackathon-pitch-detailed.md`](../hackathon-pitch-detailed.md) — full slide copy  
- [`gamma-brand-guidelines.md`](gamma-brand-guidelines.md) — colors and fonts  
- [`../hackathon-pitch-10min-standard.md`](../hackathon-pitch-10min-standard.md) — short deck copy  
- [`gamma-prompt-10min-standard.md`](gamma-prompt-10min-standard.md) — 7-slide Gamma prompt
