# Open-Meteo module

Public weather API used as the **first onboarding module** (fast, no API key). Aligned with the official docs at [open-meteo.com](https://open-meteo.com/en/docs).

## What is covered

- GET `/v1/forecast` with parameterized builders (location, timezone, hourly variables, forecast length).
- Response **shape validation** via JSON Schema (subset of the live payload).
- **Negative tests** for invalid coordinates / unsupported parameters.
- **POST `/v1/forecast`**: treated as **provisional**. The documented primary interface is GET. Some Postman collections include POST; behavior must be verified against the live service before promoting POST to a stable contract. Tests annotate or skip when POST is not supported.

## Known limitations

- Open-Meteo rate limits and availability are external; use retries in CI sparingly.
- Schema validates a **subset**; extra fields are allowed (`additionalProperties` on root where applicable).
- This module does not model every optional query combination.

## Demo failure scenarios (Allure)

[`tests/modules/open-meteo/negative.realtime-scenarios.spec.ts`](../../tests/modules/open-meteo/negative.realtime-scenarios.spec.ts) contains **intentionally failing** cases tagged `@demo-failure` (service down, auth mimic, routing 404, contract drift). Use for report triage training; exclude in CI with:

```bash
npx playwright test --project=open-meteo --grep-invert @demo-failure
```

## Running

```bash
npm run test:open-meteo
```

Intentional failure demos for Allure training (expect failures):

```bash
npm run test:open-meteo:demo
```
