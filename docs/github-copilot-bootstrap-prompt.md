# GitHub Copilot bootstrap prompt — API automation framework (from scratch)

Use this document when you want Copilot (or any coding agent) to **recreate the entire project** in one coherent pass. It merges the original hackathon architecture with **fixes and lessons learned** from implementing and publishing the repo.

**Companion docs:** [`architecture.md`](architecture.md), [`module-onboarding.md`](module-onboarding.md), [`reporting.md`](reporting.md), [`ci-cd.md`](ci-cd.md), [`setup.md`](setup.md), [`assumptions-and-risks.md`](assumptions-and-risks.md).

---

## 1. One-shot prompt for Copilot (copy below this line)

```markdown
You are implementing a production-style **API-only** test automation framework.

STACK (non‑negotiable)
- Node.js LTS (≥20), TypeScript, **Playwright Test** API (`APIRequestContext`) ONLY for automation.
- No Python/Java Rest Assured baseline; no UI/browser flow testing in v1 (may install Chromium only for CI ergonomics).

PRODUCT FRAMING
- Fintech / microservices narrative: fragmented Postman suites, inconsistent auth, weak regression signal → unified engine + onboarding paths + CI reporting.

ONBOARDING (honest)
1. OpenAPI/Swagger: validate spec, extract JSON Schema subsets for Ajv where practical — NO claim “tests anything automatically”.
2. Postman Collection v2.1: parse requests → internal EndpointDefinition[]; does NOT execute Postman scripts.
3. Manual YAML/TS manifests when prose-only docs.

MODULES
- **open-meteo**: GET-first `/v1/forecast`; JSON Schema contract; builders/factories; negatives (bad lat/missing lat); POST `/v1/forecast` = PROVISIONAL (annotate `@provisional`, skip on 405); smoke GET must tolerate **429** with short backoff then skip if still rate limited.
- **stripe**: test mode Bearer (`sk_test_...`), form-urlencoded customers, Idempotency-Key regression; negative auth via header override; error envelope contract test; optional webhook **synthetic** HMAC fixture — NOT Stripe SDK `constructEvent` parity.
- **plaid**: sandbox `/sandbox/public_token/create`; skip without secrets.
- **fred**, **sec**, **alpaca**, **coinbase**: optional/skipped without keys; Coinbase HMAC signing helper + unit smoke on signatures.

AUTH STRATEGIES IN CORE
- none; apiKeyHeader; apiKeyQuery; basic; bearer; oauth2ClientCredentials (fetch token, tiny TTL cache); customHmac (`coinbase-exchange-v2` pre‑sign CB‑ACCESS‑*).

CONFIG
- TARGET_ENV = local | qa | staging | prod-like layered configs under config/environments/*.ts merging env overrides.

PLAYWRIGHT
- Separate projects per module (+ contracts project).
- Fixtures map project.name → ModuleName; inject ApiClient + validateAgainstSchema (Ajv).
- Reporters: list, html, json → test-results.json, allure-playwright → allure-results/.
- globalTeardown: parse test-results.json stats (prefer Playwright top-level stats.expected/unexpected/skipped/duration), append GITHUB_STEP_SUMMARY; optional Nodemailer when NOTIFY_ENABLED=true.

CI (GitHub Actions)
- ci.yml: npm ci, playwright install chromium, build (tsc), test; artifacts: playwright-report, test-results.json (artifact optional — gitignore locally), allure-results, test-results on failure.
- nightly.yml: schedule + dispatch; optional email secrets.
- publish-allure.yml: optional workflow_dispatch regeneration artifact.

GITIGNORE CRITICAL
- Ignore playwright-report/, test-results/, **test-results.json** (root JSON reporter output — NOT committed), allure-results/, allure-report/, .env

TECHNICAL FIXES YOU MUST APPLY (past pitfalls)
1) **Allure UI**: Opening `allure-report/index.html` via `file://` causes **500 Failed to fetch** — browser blocks fetch() to widget JSON. Add npm scripts: `report:allure` (generate), `report:allure:view` = `serve -l 9292 ./allure-report` using devDependency `serve`; document `report:allure:serve` = `allure serve ./allure-results`.
2) **OpenAPI on Windows paths with spaces**: Passing file URLs into SwaggerParser breaks refs (`0.%20Work`). Prefer **`validateOpenApi(parsedSpecObject)`** — read minimal.json with fs + JSON.parse, validate object — alongside specs/openapi/minimal.json committed sample.
3) **SEC company_tickers.json**: Served under **`https://www.sec.gov`** for `/files/company_tickers.json` + descriptive SEC_USER_AGENT; data.sec.gov is for other datasets — document override env SEC_BASE_URL.
4) **Ajv + ajv-formats under `"module": "NodeNext"`**: Use **`import { Ajv } from 'ajv'`** (named class); wrap default import of ajv-formats: `const addFormats = addFormatsImport as unknown as (a: Ajv) => void`.
5) **Git**: Never stage generated test-results.json; merge unrelated histories when pushing over GitHub placeholder README — resolve README conflict keeping full framework doc.

VERIFY locally
npm ci && npx playwright install --with-deps chromium && npm run build && npm test && npm run report:allure && npm run report:allure:view → browse http://localhost:9292
```

---

## 2. Goals and explicit non-goals

### Goals

| Goal | Detail |
|------|--------|
| API automation only | Playwright `request` fixture / `APIRequestContext` |
| Modular core vs domains | `src/core/*`, `src/modules/*`, `tests/modules/*` |
| Multi-environment | local / qa / staging / prod-like |
| Contract validation | Ajv + optional OpenAPI-derived schemas |
| CI-ready | GitHub Actions, artifacts, step summary |
| Optional SMTP | Nodemailer secrets |

### Non-goals

- No generic “AI tests every API from prose docs”.
- No mandatory GraphQL/WebSocket coverage (Coinbase WS = roadmap note).
- No mixing Rest Assured / Python baseline.

---

## 3. Target repository layout

```text
apiautomation/
  package.json
  tsconfig.json                    # "module": "NodeNext", strict, paths optional
  playwright.config.ts
  global-teardown.ts
  .env.example
  .gitignore
  README.md
  assets/
    Weather Forecast.postman_collection.json   # sample v2.1
  config/
    index.ts
    environments/local.ts | qa.ts | staging.ts | prod-like.ts
  docs/
    *.md                          # problem statement, architecture, reporting (with Allure viewer caveat), ci-cd, etc.
    github-copilot-bootstrap-prompt.md
  specs/openapi/minimal.json
  scripts/
    import-postman-demo.ts
    verify-open-meteo-post.ts
  src/core/
    config/load-config.ts, types.ts
    client/api-client.ts            # Stripe form + idempotency; Coinbase signing hook
    auth/auth-factory.ts            # OAuth2 cache + Coinbase HMAC helpers
    contracts/openapi.ts, ajv.ts, postman-import.ts
    assertions/http.ts, json-shape.ts
    data/builders.ts, faker-helpers.ts
    reporters/github-step-summary.ts   # parse JSON report stats
    notifications/email.ts
  src/modules/
    open-meteo/, stripe/, plaid/, fred/, sec/, alpaca/, coinbase/
  tests/
    fixtures.ts                     # project → moduleName → api client
    contracts/openapi.spec.ts
    modules/**/**/*.spec.ts
  .github/workflows/
    ci.yml, nightly.yml, publish-allure.yml
```

---

## 4. Design overview

### 4.1 Runtime flow

1. `TARGET_ENV` selects merged framework config.
2. Playwright project determines **module**.
3. Fixture resolves module auth → **`resolveAuth`** (headers/query; OAuth token cache).
4. **`ApiClient`** wraps context.fetch with base URL, default headers (Stripe-Version, SEC User-Agent, Alpaca keys), merged auth query string.
5. Specs assert status/body; **validateAgainstSchema** runs Ajv.
6. Reporters write HTML + JSON + Allure raw; **globalTeardown** summarizes + mails optionally.

### 4.2 Auth flow (reference)

See diagram in [`architecture.md`](architecture.md): strategies converge on merged headers before each HTTP call.

### 4.3 CI/report flow

See [`reporting.md`](reporting.md) Mermaid + **`file://` vs HTTP** section — mandatory for correct Allure UX.

---

## 5. `package.json` scripts checklist

| Script | Purpose |
|--------|---------|
| `build` | `tsc --noEmit` |
| `test` | `playwright test` |
| `test:smoke` | `--grep @smoke` (tags in suite titles) |
| `test:ci` | same as test with CI env in runner |
| `test:open-meteo` / `test:stripe` | convenience filters |
| `import:postman` | tsx demo importer CLI |
| `verify:open-meteo-post` | standalone POST probe |
| `report:allure` | `allure generate ./allure-results --clean -o ./allure-report` |
| `report:allure:view` | **`serve -l 9292 ./allure-report`** |
| `report:allure:serve` | **`allure serve ./allure-results`** |
| `install:browsers` | `playwright install --with-deps chromium` |

Dependencies (baseline — pin versions at `npm install` time):

- `@playwright/test`, `allure-playwright`, `allure-commandline`, `ajv`, `ajv-formats`, `@apidevtools/swagger-parser`, `dotenv`, `tsx`, `typescript`, `@types/node`, `@types/nodemailer`, `serve`
- `nodemailer`

---

## 6. Playwright configuration essentials

- `testDir: './tests'`
- Reporters: `list`, `html`, `json` → `test-results.json`, `allure-playwright`
- `globalTeardown: './global-teardown.ts'`
- **`use.trace`** tuned for CI; avoid forcing Desktop Chrome device if API-only (no browser launch requirement beyond optional install).
- **Projects**: `open-meteo`, `stripe`, `plaid`, `fred`, `sec`, `coinbase`, `alpaca`, `contracts`
- `forbidOnly` when CI; retries in CI optional.

---

## 7. JSON reporter + GitHub Step Summary

Playwright’s JSON report exposes **`stats`**:

- `expected` ≈ passed count  
- `unexpected` ≈ failed  
- `skipped`  
- `duration`  

Parse **`stats` first** in `parsePlaywrightJsonReport`; fall back to walking `suites` if absent.

Append markdown to **`process.env.GITHUB_STEP_SUMMARY`** in global teardown.

---

## 8. Module-specific implementation notes

### Open-Meteo

- Contract schema: subset in `schemas/forecast-response.json` (latitude, longitude, hourly.time array).
- **429**: Retry GET smoke a few times with backoff; skip test if still 429.
- **POST**: Separate spec file; `test.skip` on 405 or unexpected status; annotation type `risk`.

### Stripe

- Wrap `describe` with skip when `!process.env.STRIPE_SECRET_KEY`.
- `application/x-www-form-urlencoded` via ApiClient `form` option.
- Idempotency: same key + same body ⇒ same customer id.
- Webhook test: document synthetic vs production Stripe verification.

### SEC + FRED + Alpaca + Plaid + Coinbase

- Document skip conditions and env vars in module READMEs.
- Alpaca: headers via `defaultHeaders` on module config (`APCA-API-KEY-ID`, `APCA-API-SECRET-KEY`).

---

## 9. GitHub Actions checklist

- Node 20, `npm ci`, `npx playwright install --with-deps chromium`
- Optional secrets mirrored from `.env.example`
- Do **not** spam PR notifications — keep SMTP off on `ci.yml` unless desired; nightly may use `NOTIFY_ONLY_ON_FAILURE`
- Upload artifacts: HTML report, allure-results, optional failure traces

---

## 10. Documentation set (human-facing)

Maintain these under `docs/`:

| File | Content |
|------|---------|
| problem-statement.md | Fintech fragmentation angle |
| solution-overview.md | Same engine, different modules pitch |
| architecture.md | Mermaid: layers, execution, auth |
| module-onboarding.md | OpenAPI / Postman / manual |
| setup.md | Node, env, secrets |
| running-tests.md | Projects, grep tags |
| reporting.md | Playwright HTML + **Allure HTTP viewer** + summary |
| ci-cd.md | Workflows and secrets |
| test-data-strategy.md | Factories, no secrets in repo |
| future-roadmap.md | Non-goals + extensions |
| implementation-backlog.md | Must/should/nice |
| assumptions-and-risks.md | External APIs, rate limits |

README.md: canonical repo URL, suggested GitHub About description, quick start, **Allure viewing via serve**.

---

## 11. Verification checklist (before “done”)

- [ ] `npm run build` clean  
- [ ] `npm test` — expected skips without secrets  
- [ ] `npm run report:allure` && **`npm run report:allure:view`** — dashboard loads at **http://localhost:9292** (no `file://`)  
- [ ] No **`test-results.json`** or **`node_modules`** committed  
- [ ] CI workflow YAML validates on GitHub  
- [ ] Open-Meteo provisional POST documented  

---

## 12. Changelog of fixes captured here

| Issue | Resolution |
|-------|------------|
| Allure blank / **Failed to fetch** when opening HTML locally | Serve report over HTTP (`serve` + port 9292); document `allure serve` |
| SwaggerParser ENOENT / bad Windows paths | Validate **in-memory** parsed JSON spec |
| SEC smoke **404** | Base URL `www.sec.gov` for company_tickers |
| **TypeScript** Ajv default import | Named **`import { Ajv }`** + ajv-formats cast |
| Generated **`test-results.json`** staged | **gitignore** + `git rm --cached` |
| Remote repo placeholder README | Merge unrelated histories; keep full README |
| Open-Meteo **429** | Backoff + skip in smoke GET |

---

*Last aligned with repo conventions — regenerate dependency versions via `npm install` when bootstrapping a fresh clone.*
