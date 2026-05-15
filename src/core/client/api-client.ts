import type { APIRequestContext, APIResponse } from '@playwright/test';

import { applyCoinbaseExchangeHeaders, resolveAuth } from '../auth/auth-factory.js';
import type { AuthConfig } from '../config/types.js';

export type ApiClientOptions = {
  context: APIRequestContext;
  baseURL: string;
  auth: AuthConfig;
  defaultHeaders?: Record<string, string>;
  /** For Coinbase Exchange authenticated calls */
  coinbase?: { apiKey: string; passphrase: string };
};

export class ApiClient {
  constructor(private readonly opts: ApiClientOptions) {}

  async get(
    path: string,
    options?: {
      params?: Record<string, string | number | boolean | undefined>;
      headers?: Record<string, string>;
      idempotencyKey?: string;
    },
  ): Promise<APIResponse> {
    return this.request('GET', path, { ...options });
  }

  async post(
    path: string,
    options?: {
      params?: Record<string, string | number | boolean | undefined>;
      data?: unknown;
      headers?: Record<string, string>;
      idempotencyKey?: string;
      form?: Record<string, string>;
    },
  ): Promise<APIResponse> {
    return this.request('POST', path, { ...options });
  }

  async delete(
    path: string,
    options?: {
      params?: Record<string, string | number | boolean | undefined>;
      headers?: Record<string, string>;
    },
  ): Promise<APIResponse> {
    return this.request('DELETE', path, { ...options });
  }

  private async request(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    options?: {
      params?: Record<string, string | number | boolean | undefined>;
      data?: unknown;
      form?: Record<string, string>;
      headers?: Record<string, string>;
      idempotencyKey?: string;
    },
  ): Promise<APIResponse> {
    const url = new URL(path, this.opts.baseURL);
    const auth = await resolveAuth(this.opts.auth);
    const params = { ...(options?.params ?? {}) };
    for (const [k, v] of Object.entries(auth.query)) {
      url.searchParams.set(k, String(v));
    }
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }

    let headers: Record<string, string> = {
      ...(this.opts.defaultHeaders ?? {}),
      ...auth.headers,
      ...(options?.headers ?? {}),
    };
    if (options?.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    const bodyStr =
      options?.form != null
        ? new URLSearchParams(options.form).toString()
        : options?.data != null
          ? JSON.stringify(options.data)
          : '';

    if (
      this.opts.coinbase &&
      this.opts.auth.type === 'customHmac' &&
      this.opts.auth.signer === 'coinbase-exchange-v2'
    ) {
      const requestPath = url.pathname + (url.search ? url.search : '');
      headers = await applyCoinbaseExchangeHeaders({
        auth: this.opts.auth,
        method,
        requestPath,
        body: bodyStr,
        apiKey: this.opts.coinbase.apiKey,
        passphrase: this.opts.coinbase.passphrase,
        existing: headers,
      });
    }

    const reqInit: Parameters<APIRequestContext['fetch']>[1] = {
      method,
      headers,
    };

    if (method === 'POST' && options?.form != null) {
      reqInit.headers = { ...headers, 'content-type': 'application/x-www-form-urlencoded' };
      reqInit.data = new URLSearchParams(options.form).toString();
    } else if (method === 'POST' && options?.data != null) {
      reqInit.headers = { ...headers, 'content-type': 'application/json' };
      reqInit.data = bodyStr;
    }

    return this.opts.context.fetch(url.toString(), reqInit);
  }
}
