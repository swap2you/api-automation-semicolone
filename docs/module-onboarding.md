# Module onboarding

## 1) OpenAPI / Swagger

1. Add or link a machine-readable spec (YAML/JSON) under `specs/openapi/`.  
2. Use `validateOpenApi(specOrPath)` from [`src/core/contracts/openapi.ts`](../src/core/contracts/openapi.ts).  
3. Optionally call `extractResponseSchema(doc, method, path, status)` to pull a JSON Schema fragment for Ajv.  
4. Add a module under `src/modules/<name>/` with paths, factories, and `tests/modules/<name>/`.

**Limitation:** Full client generation is **out of scope** for the hackathon slice; we validate specs and use **targeted** schemas.

## 2) Postman collection (v2.1)

1. Export collection JSON (v2.1).  
2. Run `npm run import:postman [path-to-collection.json]` to print `EndpointDefinition[]`.  
3. Manually map normalized entries into module builders and Playwright specs (the importer does **not** run Postman scripts or pre-request logic).

Sample: [`assets/Weather Forecast.postman_collection.json`](../assets/Weather%20Forecast.postman_collection.json).

## 3) Manual endpoint manifest

When only prose docs exist:

- Create `src/modules/<name>/config.ts` (paths/constants).  
- Encode base URLs in `config/environments/*.ts` or via env vars.  
- Document gaps in the module README (“known limitations”).

### Open-Meteo POST caveat

Collections may include **POST** forecast calls. Official docs emphasize **GET**. Use:

- `npm run verify:open-meteo-post`  
- provisional specs tagged `@provisional`  

before promoting POST to a stable contract.

## Stripe vs Plaid (authenticated second module)

- **Preferred:** Stripe **test mode** — set `STRIPE_SECRET_KEY` in `.env` / GitHub Secrets.  
- **Fallback:** Plaid **sandbox** — `PLAID_CLIENT_ID`, `PLAID_SECRET`, optional `PLAID_INSTITUTION_ID`.

Both are **skipped** in CI when secrets are absent, so public forks stay green.
