# Assumptions, risks, and open questions

## Assumptions

- **Node 20+** and npm are available locally and on CI agents.  
- External APIs (Open-Meteo, Stripe test mode, SEC public files) are reachable from the runner network.  
- **Open-Meteo** remains GET-first; POST behavior is verified separately (`verify:open-meteo-post`).  
- Developers **do not** commit live payment keys; Stripe tests target **test mode** only.  
- SEC and similar public endpoints require a **truthful User-Agent** string.

## Risks

| Risk | Mitigation |
|------|------------|
| Flaky external APIs (429, transient 5xx) | CI retries (`playwright.config.ts`); move noisy suites to nightly |
| Open-Meteo POST drift | Keep POST tests `@provisional` until documented |
| Secret leakage | `.gitignore` for `.env`, GitHub Secrets for CI, documented rotation |
| Over-scoping generators | No full OpenAPI client gen in v1; targeted Ajv only |
| Synthetic webhook signing drift from Stripe SDK | Documented in Stripe module README |

## Open questions

1. **Stripe vs Plaid** for the primary authenticated demo in your org’s pitch—keys and narrative.  
2. **Nightly scope**: run all projects vs heavy subsets (Stripe) to manage rate limits.  
3. **Allure publishing**: artifact-only vs GitHub Pages (publish workflow is artifact-first).
