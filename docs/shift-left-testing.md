# Shift-left API contract testing

## What “shift left” means here

We catch **API contract drift** as early as possible—on every PR and nightly run—**before** downstream services, mobile apps, or data pipelines fail in higher environments.

| Traditional (late) | This framework (shift-left) |
|--------------------|-----------------------------|
| Discover missing field in QA/staging UI | Ajv fails on first HTTP response in CI |
| Compare responses manually in Postman | Versioned JSON Schema in `src/modules/*/schemas/` |
| Environment-specific brittle URLs in tests | `TARGET_ENV` + config files; same tests everywhere |

## How Open-Meteo demonstrates it

1. **Golden contract** — [`src/modules/open-meteo/schemas/forecast-response.json`](../src/modules/open-meteo/schemas/forecast-response.json) is checked into git.
2. **Live validation** — tests call the real API and validate the body against that schema (or stricter consumer extensions).
3. **Clear failures** — Ajv reports paths such as `must have required property 'api_version_tag'` when the API no longer matches what consumers expect.
4. **Allure evidence** — attachments `contract-schema.json` and `live-api-response.json` on failing tests for triage.

### Demo vs production tests

| Tag | Purpose |
|-----|---------|
| `@contract` | Real contract checks (should pass when schema matches API) |
| `@demo-failure` | Intentional failures for Allure/alert training — exclude with `--grep-invert @demo-failure` in CI |

**Schema shift-left demo:** [`tests/modules/open-meteo/contract.schema-shift-left.spec.ts`](../tests/modules/open-meteo/contract.schema-shift-left.spec.ts)

## Environment independence

Tests are **environment-agnostic** by design:

- **`TARGET_ENV`** selects `config/environments/{local,qa,staging,prod-like}.ts` — same specs, different base URLs and secrets.
- **No secrets in repo** — `.env` locally, GitHub Actions secrets in CI.
- **Module identity in reports** — Allure `module` label + `environment.properties` `Module=` (from `--project` or `ALLURE_MODULE`).
- **Public modules** (Open-Meteo, SEC) run without keys; Stripe/Plaid skip when secrets are absent.

Changing `TARGET_ENV` does **not** change which assertions run—only **where** requests go.

```bash
# Same tests, different config layer
TARGET_ENV=qa npx playwright test --project=open-meteo
TARGET_ENV=staging npx playwright test --project=open-meteo
```

## When to update the schema

Update the checked-in JSON Schema when:

- Product **intentionally** adds/removes/renames fields and all consumers are updated.
- OpenAPI/Postman source of truth is republished.

Do **not** silence failures by disabling tests—update the contract and commit it with the API change (true shift-left).

## Related docs

- [Module onboarding](module-onboarding.md)
- [Reporting](reporting.md) — Allure module labels and environment widget
- [Notifications setup](notifications-setup.md) — email/Teams on failure
