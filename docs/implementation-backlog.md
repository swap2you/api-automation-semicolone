# Implementation backlog

Priorities for the hackathon slice and immediate follow-up.

## Must-have

- Core scaffold: Playwright + TS + config/env model + `ApiClient` + auth strategies.  
- Open-Meteo module: GET contract, schema, negatives, **provisional POST**.  
- Stripe test-mode path: create/retrieve, idempotency, negative auth, error envelope.  
- CI: push/PR workflow + artifacts + `GITHUB_STEP_SUMMARY` + Allure raw results + optional mail on scheduled runs.  
- Documentation set under `docs/` with honest onboarding claims.

## Should-have

- OpenAPI validate + response schema extraction example (`tests/contracts`).  
- Postman v2.1 importer demo + CLI (`import:postman`).  
- Plaid sandbox smoke as Stripe fallback.  
- FRED / SEC read-only smokes.  
- Optional `publish-allure.yml` for Allure HTML artifact.

## Nice-to-have

- Alpaca paper account flow beyond smoke.  
- Coinbase authenticated REST round-trip.  
- Stripe webhook `constructEvent`-compatible verification.  
- Dynamic test generation from OpenAPI tags.

## Status

The repository implements **must-have** and **most should-have / nice-to-have demo items** as time-boxed modules; treat Alpaca/Coinbase live paths as optional demos requiring keys.
