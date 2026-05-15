import type { AuthConfig } from '../config/types.js';

export type AuthExtras = {
  headers: Record<string, string>;
  query: Record<string, string>;
};

export type AuthResolution = AuthExtras & {
  /** Bearer token for strategies that rotate — used when creating new contexts */
  bearerToken?: string;
};

const tokenCache = new Map<string, { token: string; exp: number }>();

function cacheKey(cfg: Extract<AuthConfig, { type: 'oauth2ClientCredentials' }>): string {
  return `${cfg.tokenUrl}|${cfg.clientId}|${cfg.scope ?? ''}`;
}

async function resolveOAuth2(
  cfg: Extract<AuthConfig, { type: 'oauth2ClientCredentials' }>,
): Promise<string> {
  const key = cacheKey(cfg);
  const now = Date.now() / 1000;
  const cached = tokenCache.get(key);
  if (cached && cached.exp > now + 30) {
    return cached.token;
  }
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });
  if (cfg.scope) body.set('scope', cfg.scope);
  const res = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OAuth2 token fetch failed ${res.status}: ${t}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in?: number };
  const exp = now + (json.expires_in ?? 3600);
  tokenCache.set(key, { token: json.access_token, exp });
  return json.access_token;
}

export async function resolveAuth(config: AuthConfig): Promise<AuthResolution> {
  switch (config.type) {
    case 'none':
      return { headers: {}, query: {} };
    case 'apiKeyHeader':
      return {
        headers: { [config.headerName]: config.value },
        query: {},
      };
    case 'apiKeyQuery':
      return {
        headers: {},
        query: { [config.paramName]: config.value },
      };
    case 'basic': {
      const token = Buffer.from(`${config.username}:${config.password}`, 'utf8').toString(
        'base64',
      );
      return {
        headers: { Authorization: `Basic ${token}` },
        query: {},
      };
    }
    case 'bearer':
      return {
        headers: { Authorization: `Bearer ${config.token}` },
        query: {},
        bearerToken: config.token,
      };
    case 'oauth2ClientCredentials': {
      const token = await resolveOAuth2(config);
      return {
        headers: { Authorization: `Bearer ${token}` },
        query: {},
        bearerToken: token,
      };
    }
    case 'customHmac':
      return {
        headers: {},
        query: {},
      };
    default:
      return { headers: {}, query: {} };
  }
}

export function clearAuthTokenCache(): void {
  tokenCache.clear();
}

/** Coinbase Exchange REST signing — pre-request header merge in ApiClient for signed methods */
export async function signCoinbaseExchangeRequest(args: {
  secret: string;
  secretBase64?: boolean;
  method: string;
  requestPath: string;
  body: string;
}): Promise<{ 'CB-ACCESS-SIGN': string; 'CB-ACCESS-TIMESTAMP': string; 'CB-ACCESS-KEY': string }> {
  const crypto = await import('node:crypto');
  const timestamp = (Date.now() / 1000).toFixed(3);
  const what = timestamp + args.method.toUpperCase() + args.requestPath + args.body;
  const secret = args.secretBase64
    ? Buffer.from(args.secret, 'base64')
    : Buffer.from(args.secret, 'utf8');
  const hmac = crypto.createHmac('sha256', secret);
  const CB_ACCESS_SIGN = hmac.update(what).digest('base64');
  return {
    'CB-ACCESS-SIGN': CB_ACCESS_SIGN,
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-KEY': '',
  };
}

export async function applyCoinbaseExchangeHeaders(args: {
  auth: AuthConfig;
  method: string;
  requestPath: string;
  body: string;
  apiKey: string;
  passphrase: string;
  existing: Record<string, string>;
}): Promise<Record<string, string>> {
  if (args.auth.type !== 'customHmac' || args.auth.signer !== 'coinbase-exchange-v2') {
    return args.existing;
  }
  const signed = await signCoinbaseExchangeRequest({
    secret: args.auth.secret,
    secretBase64: args.auth.secretBase64,
    method: args.method,
    requestPath: args.requestPath,
    body: args.body,
  });
  return {
    ...args.existing,
    'CB-ACCESS-KEY': args.apiKey,
    'CB-ACCESS-SIGN': signed['CB-ACCESS-SIGN'],
    'CB-ACCESS-TIMESTAMP': signed['CB-ACCESS-TIMESTAMP'],
    'CB-ACCESS-PASSPHRASE': args.passphrase,
  };
}
