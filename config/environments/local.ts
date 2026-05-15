import type { FrameworkConfig } from '../../src/core/config/types.js';

export const local: FrameworkConfig = {
  name: 'local',
  modules: {
    'open-meteo': {
      baseURL: process.env.OPEN_METEO_BASE_URL ?? 'https://api.open-meteo.com',
      auth: { type: 'none' },
      timeoutMs: 30_000,
    },
    stripe: {
      baseURL: 'https://api.stripe.com',
      auth: {
        type: 'bearer',
        token: process.env.STRIPE_SECRET_KEY ?? '',
      },
      timeoutMs: 45_000,
      defaultHeaders: {
        'Stripe-Version': process.env.STRIPE_API_VERSION ?? '2024-11-20.acacia',
      },
    },
    plaid: {
      baseURL:
        process.env.PLAID_ENV === 'sandbox'
          ? 'https://sandbox.plaid.com'
          : 'https://development.plaid.com',
      auth: { type: 'none' },
      timeoutMs: 45_000,
    },
    alpaca: {
      baseURL: 'https://paper-api.alpaca.markets',
      auth: {
        type: 'none',
      },
      timeoutMs: 30_000,
      defaultHeaders: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY_ID ?? '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET_KEY ?? '',
      },
    },
    coinbase: {
      baseURL: 'https://api.exchange.coinbase.com',
      auth: {
        type: 'customHmac',
        signer: 'coinbase-exchange-v2',
        secret: process.env.COINBASE_API_SECRET ?? '',
      },
      timeoutMs: 30_000,
    },
    fred: {
      baseURL: 'https://api.stlouisfed.org',
      auth: { type: 'none' },
      timeoutMs: 30_000,
    },
    sec: {
      baseURL: process.env.SEC_BASE_URL ?? 'https://www.sec.gov',
      auth: {
        type: 'none',
      },
      timeoutMs: 30_000,
      defaultHeaders: {
        'User-Agent':
          process.env.SEC_USER_AGENT ?? 'apiautomation/1.0 (+https://example.com/contact)',
        Accept: 'application/json',
      },
    },
  },
};
