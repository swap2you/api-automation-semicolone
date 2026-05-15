export type EnvironmentName = 'local' | 'qa' | 'staging' | 'prod-like';

export type ModuleName =
  | 'open-meteo'
  | 'stripe'
  | 'plaid'
  | 'alpaca'
  | 'coinbase'
  | 'fred'
  | 'sec';

export type AuthConfig =
  | { type: 'none' }
  | { type: 'apiKeyHeader'; headerName: string; value: string }
  | { type: 'apiKeyQuery'; paramName: string; value: string }
  | { type: 'basic'; username: string; password: string }
  | { type: 'bearer'; token: string }
  | {
      type: 'oauth2ClientCredentials';
      tokenUrl: string;
      clientId: string;
      clientSecret: string;
      scope?: string;
    }
  | {
      type: 'customHmac';
      /** Secret key bytes or string — interpreted per signer */
      secret: string;
      /** Optional pre-encoded secret in base64 */
      secretBase64?: boolean;
      signer: 'coinbase-exchange-v2';
    };

export type ModuleConfig = {
  baseURL: string;
  auth: AuthConfig;
  timeoutMs: number;
  defaultHeaders?: Record<string, string>;
};

export type FrameworkConfig = {
  name: EnvironmentName;
  modules: Record<ModuleName, ModuleConfig>;
};
