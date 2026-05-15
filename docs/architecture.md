# Architecture

## Framework architecture

```mermaid
flowchart TB
  subgraph ci [CI_and_Local]
    GH[GitHub_Actions]
    Env[dotenv_and_secrets]
  end

  subgraph pw [Playwright_Test]
    Fix[fixtures_and_projects]
    Specs[module_specs]
  end

  subgraph core [src_core]
    CFG[config_loader]
    CLI[ApiClient]
    AUTH[auth_resolve]
    CTR[contracts_OpenAPI_Postman_Ajv]
    ASR[assertions]
    DATA[data_helpers]
    RPT[github_step_summary]
    NTF[nodemailer_optional]
  end

  subgraph mods [src_modules]
    OM[open_meteo]
    ST[stripe]
    PL[plaid_optional]
    OPT[fred_sec_alpaca_coinbase]
  end

  GH --> Env
  Env --> CFG
  Specs --> Fix
  Fix --> CFG
  Fix --> CLI
  Fix --> AUTH
  CLI --> CTR
  Specs --> ASR
  Specs --> DATA
  pw --> RPT
  pw --> NTF
  Specs --> mods
  mods --> core
```

## Test execution flow

```mermaid
sequenceDiagram
  participant R as PlaywrightRunner
  participant F as Fixtures
  participant A as Auth_resolve
  participant C as ApiClient
  participant S as External_API

  R->>F: resolve_module_from_project_name
  F->>F: loadFrameworkConfig_TARGET_ENV
  F->>A: resolveAuth_module_config
  A-->>F: headers_query_optional_token
  F->>C: new_ApiClient_request_context
  C->>S: HTTP
  S-->>C: response
  C-->>R: APIResponse
  R->>R: assertions_schema_optional
  R->>R: reporters_JSON_HTML_Allure
```

## Auth strategy flow

```mermaid
flowchart LR
  start[module_auth_config]
  start --> none[none]
  start --> hdr[api_key_header]
  start --> qry[api_key_query]
  start --> basic[http_basic]
  start --> bearer[bearer_token]
  start --> oauth2[oauth2_client_credentials]
  start --> hmac[coinbase_hmac_optional]

  oauth2 --> cache[Short_lived_token_cache]
  bearer --> apply[Merge_headers_on_each_request]
  cache --> apply
  hmac --> sign[Pre_request_signing]
  sign --> apply
  none --> apply
  hdr --> apply
  qry --> apply
  basic --> apply
```

## Components

| Layer | Responsibility |
|------|----------------|
| `config/environments/*.ts` | Base URLs and defaults per `TARGET_ENV` |
| `src/core/config/load-config.ts` | Loads `.env`, resolves `ModuleName` config |
| `src/core/client/api-client.ts` | GET/POST/DELETE with auth merge, Stripe form & idempotency, Coinbase signing hook |
| `src/core/auth/auth-factory.ts` | Auth resolution + OAuth2 client-credentials cache + Coinbase HMAC pre-sign |
| `src/core/contracts/*` | OpenAPI validate, Postman v2.1 import, Ajv |
| `src/core/reporters/github-step-summary.ts` | Parses `test-results.json` for job summary |
| `global-teardown.ts` | Appends `GITHUB_STEP_SUMMARY`, optional email |

## Playwright projects

Each **project** maps to one `ModuleName` via [`tests/fixtures.ts`](../tests/fixtures.ts). This keeps parallelization simple and avoids cross-module leakage.
