# Coinbase Exchange module

Demonstrates **custom HMAC signing** for the REST API per [Exchange authentication](https://docs.cdp.coinbase.com/exchange/rest-api/authentication).

## Environment

- `COINBASE_API_KEY`
- `COINBASE_API_SECRET`
- `COINBASE_PASSPHRASE`

Signing is implemented in [`src/core/auth/auth-factory.ts`](../../core/auth/auth-factory.ts) and wired in [`src/core/client/api-client.ts`](../../core/client/api-client.ts).

## Tests

[`tests/modules/coinbase/hmac.signing.spec.ts`](../../../tests/modules/coinbase/hmac.signing.spec.ts) validates signature header shape without requiring live authenticated calls.

## WebSocket

Market data over WebSocket is **out of scope** for v1; see [`docs/future-roadmap.md`](../../../docs/future-roadmap.md).
