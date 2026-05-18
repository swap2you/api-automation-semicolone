# Gamma.app Prompt — 10-Minute Standard Pitch (7 Slides)

**How to use:** Copy everything below the line into [Gamma.app](https://gamma.app) → **Create new** → **Paste in text** / **Generate from prompt**.  
Then apply theme colors from [`gamma-brand-guidelines.md`](gamma-brand-guidelines.md).

**Deck type:** 7 slides, 16:9, corporate hackathon pitch  
**Duration:** 10 minutes (1 + 2 + 1 + 1 + 5 min)  
**Story arc:** Need → Approach → Benefits → Differentiation → Demo → Close  

---

## PASTE THIS ENTIRE BLOCK INTO GAMMA

```
Create a 7-slide professional presentation for Persistent Systems internal hackathon "Semicolons 2026" (16-17 May 2026). Match Persistent corporate template: navy #0D2137, orange accent #E85D04, white content slides, thin orange top bar on each slide, bold sans-serif typography. Team name: Team Dhurandhar. Product: API Automation Accelerator using Playwright Test (Node.js + TypeScript). Tone: enterprise fintech consulting, not playful.

GLOBAL FOOTER ON EVERY SLIDE (bottom left, small gray text): "Semicolons 2026 | Team Dhurandhar"
Slide numbers bottom right.

---

SLIDE 1 — TITLE (dark navy full-bleed left side, photo right)

Layout: Split screen. Left 55% solid navy background. Right 45% cinematic photo of software engineer at laptop in dim room, screen shows orange monospace text lines like a terminal (abstract, not readable code).

Top left small caps orange text: SEMICOLONS 2026

Main title white large bold: Solution Pitch Template
OR use: Solution Pitch — API Automation Accelerator

Orange bordered box in center-left containing:
- Team Dhurandhar (orange bold)
- Modular API Test Framework (Playwright + TypeScript) (white)
- One-line value proposition (white, smaller): "We help fintech and microservice teams ship APIs with confidence with a single config-driven automation engine that validates contracts, runs in CI, and delivers Allure plus Microsoft Teams visibility—without every squad rebuilding Postman scripts and reports."

Bottom left orange text block "Suggested timing":
• 1 min problem
• 2 min approach + architecture
• 1 min benefits
• 1 min differentiation
• 5 min demo

Bottom footer: Semicolons 2026 | Internal participant template
Slide number: 1

Optional small Persistent logo top right of photo panel.

IMAGE PROMPT for right panel: "Professional developer working on laptop at night, screen glow orange and blue, corporate tech hackathon atmosphere, photorealistic, no visible faces directly"

---

SLIDE 2 — NEED (white background, orange top bar, badge "1 min" top right)

Section label orange small caps: NEED

Headline dark blue bold: What problem matters enough to solve?

Subtitle gray: Ground the story in user pain and business urgency before mentioning the solution.

THREE-COLUMN LAYOUT:

LEFT LARGE BOX (white with gray border, title "Problem statement"):
Bullets:
• Who is affected: QE engineers, API developers, release managers in microservice-heavy fintech (retirement, brokerage, 529, payments)
• What breaks today: Fragmented Postman folders; one-off scripts per project; only "200 OK" checks; no leadership visibility into API health
• Impact: Days to weeks to onboard each new API; late contract defects in QA; audit risk when results are not traceable
• Why now: Semicolons theme "turn ideas into impact"—API quality blocks fast safe delivery

TOP RIGHT BOX (peach background #F8E8DE, title "Evidence or signal"):
• 25 automated API scenarios in repo (17 in standard CI)
• Last CI run: 8 passed, 9 skipped (no sandbox keys), 0 failed, ~8 seconds
• If we do nothing: manual regression, silent contract drift, reactive firefighting

BOTTOM RIGHT BOX (light blue #E3F2FD, title "Speaker cue"):
"Keep this slide grounded in one memorable pain point. Avoid describing the solution too early."
Quote italic: "Every new API restarts the same Postman and reporting work—and finance cannot afford late contract surprises."

Slide number: 2

NO solution keywords on this slide except in speaker cue warning.

---

SLIDE 3 — APPROACH (white, orange top bar, badge "2 min" top right)

Section label: APPROACH

Headline: How does your solution work?

Subtitle: Explain the idea clearly before you zoom into technical architecture.

LEFT COLUMN — "Approach summary" with 4 numbered bullets:
1. Onboard — OpenAPI spec, Postman v2.1 import, or manual module config
2. Execute — Playwright Test APIRequestContext, shared ApiClient, pluggable auth (Bearer, API key, OAuth2, HMAC, Basic)
3. Validate — HTTP assertions plus Ajv JSON Schema contracts; tags @smoke @regression @negative @contract
4. Govern and notify — GitHub Actions, test-results.json, Allure dashboard, Microsoft Teams live per-test table, optional email

RIGHT COLUMN — "Architecture snapshot" DIAGRAM (5 boxes connected by thick orange arrows):
Box 1: Developers / GitHub Actions
Arrow right to Box 2: Playwright runner + core engine
Arrow right to Box 3: Ajv schemas / OpenAPI / Postman
Below Box 2 arrow down to Box 4: External APIs (Open-Meteo, Stripe, Plaid, SEC, FRED, Alpaca, Coinbase)
Arrow to Box 5: Allure + Teams + CSV/PDF export

Caption under diagram: "Replace labels with plain English. Same engine, different API modules."

Slide number: 3

IMAGE STYLE for diagram: clean flat flowchart, orange arrows, white boxes, minimal icons

---

SLIDE 4 — BENEFITS (white, orange top bar, badge "1 min" top right)

Section label: BENEFITS

Headline: What value does this create?

Subtitle: Translate the solution into measurable business, user, and delivery outcomes.

TOP ROW — four equal white cards with orange category title and metric:
Card 1 — Business impact: ~70% faster new API module onboarding
Card 2 — User value: One command npm run test:ci → Teams + Allure pass/fail table
Card 3 — Operational value: Single Node.js TypeScript stack (no fragmented tools)
Card 4 — Strategic value: Reusable Persistent IP — 8 modules, CI workflows, 17 docs

BOTTOM LEFT — "Benefits story" box:
• Contract tests fail in CI when response drifts—not in production UI
• Day one: run test:open-meteo, open Allure at localhost:9292, export CSV
• Scale: add src/modules plus Playwright project; secrets via .env or GitHub Secrets

BOTTOM RIGHT — peach box "Proof you can mention":
• Working GitHub repo; test:ci exit 0 on public modules
• Shift-left @demo-failure specs for training (excluded from CI)
• Stripe test mode only; SEC User-Agent compliance; secrets gitignored

Slide number: 4

---

SLIDE 5 — DIFFERENTIATION (white, orange top bar, badge "1 min" top right)

Section label: DIFFERENTIATION

Headline: Why this approach stands out

Subtitle: Use SRI lens—why better than status quo, not competitor bashing.

THREE COLUMNS:

Column 1 white dashed border "Compared with today's way":
• Postman is manual, not PR-gated regression
• Scripts are single-project, not modular auth + contracts
• Reports scattered; no CI summary or Teams per-test rows

Column 2 peach "Our differentiators":
• Multi-API config-driven — 8 Playwright projects, one core
• Honest onboarding — OpenAPI + Postman; no "AI tests anything" claim
• Fintech auth — Stripe idempotency, Plaid sandbox, Coinbase HMAC
• CI + Allure + Teams from live test-results.json
• AI-assisted build via Cursor/Copilot in 24h sprint

Column 3 light blue "Sound bites":
Bold one-liner: "Unlike fragmented Postman-only QA, our engine delivers version-controlled regression, contract validation, and leadership-ready Teams summaries from one npm command."
Small note: Do not attack competitors—contrast status quo only.

Slide number: 5

---

SLIDE 6 — DEMO (white, orange top bar, badge "5 min" top right)

Section label: DEMO

Headline: What will you show in the live walkthrough?

Subtitle: Treat the demo like a story with beginning, moment of value, and clear outcome.

HORIZONTAL STORYBOARD — 4 boxes connected by orange arrows:

Box 1 "Start state": QE has Postman tests, no CI contract checks; manager asks "did APIs pass?" after merge.

Box 2 "Action": npm ci → npm run test:open-meteo → npm run report:allure:view

Box 3 "Magic moment" — HIGHLIGHT with thick orange border and light orange fill: npm run test:ci → Teams notification with full 17-test table matching CSV export; Allure dashboard at http://localhost:9292 with Export report button

Box 4 "Outcome": Optional Stripe sk_test module; show HTML/CSV/PDF export; same reporting for any module

Footer tip italic: "Show only screens that prove the promise. A short reliable demo wins."

Slide number: 6

IMAGE: Insert placeholder panels labeled "Allure screenshot" and "Teams notification screenshot" for user to replace with real captures.

---

SLIDE 7 — CLOSE STRONG (full navy background like slide 1)

Section label orange: CLOSE STRONG

Large white bold center-left:
"We give fintech teams a Playwright-based API automation accelerator—25 scenarios, 8 modules, contract drift caught in CI, and the same pass/fail truth in Allure and Teams after every run."

Smaller white text: Optional ask — Pilot with one client microservice squad to onboard their OpenAPI in one week.

Presenter line: Team Dhurandhar | your.name@example.com

RIGHT SIDE white card "Final checklist before presenting":
☑ One story not many
☑ Architecture labels simplified
☑ Benefits tied to business outcomes
☑ Demo rehearsed and time-boxed
☑ Closing line memorized

Footer: Semicolons 2026 | Internal participant template
Slide number: 7
```

---

## After generation — manual steps

1. **Theme:** Set primary `#0D2137`, accent `#E85D04` in Gamma theme editor.  
2. **Replace images** on slides 1 and 6 with your screenshots.  
3. **Verify numbers** on slide 2 match latest `npm run test:ci` output.  
4. **Export** PDF + present from Gamma or download to PowerPoint for Persistent template merge.

---

## Screenshot checklist (slide 6)

| Panel | File to capture |
|-------|-----------------|
| Allure Overview | After `npm run test:ci` — 8 passed, 9 skipped |
| Allure suites | `open-meteo` green bar |
| Teams | Message with "All test results" table (17 rows) |
| Terminal | Line: `Notification: Teams message posted (live results from test-results.json)` |

---

## Related docs

- Slide copy source: [`../hackathon-pitch-10min-standard.md`](../hackathon-pitch-10min-standard.md)  
- Brand kit: [`gamma-brand-guidelines.md`](gamma-brand-guidelines.md)
