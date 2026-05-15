# Future roadmap

## Must-have (post-hackathon hardening)

- Per-module **retry policy** knobs (429 backoff) with budgets.  
- **Secret scanning** enforcement + `.env` ban in commits (gitleaks/pre-commit).  
- **Stripe webhook** tests aligned with official `constructEvent` (handles `whsec_` decoding).

## Should-have

- Deeper **OpenAPI → schema** extraction with `$ref` resolution bundled for responses.  
- **Postman** importer codegen for skeleton `*.spec.ts` files (opt-in CLI).  
- **Alpaca** order lifecycle (paper) with risk checks flagged as destructive.

## Nice-to-have

- Coinbase Exchange **authenticated** trade flow (beyond HMAC unit demo).  
- WebSocket harness (Coinbase feed) **out of process** / separate runner (v2).  
- **Multi-tenant** config service instead of static env files (enterprise).  

## Explicit non-goals

- UI automation inside this repo’s v1 scope.  
- “AI generates tests from anything.”  
- Supporting every protocol (gRPC, SOAP) in the base framework.
