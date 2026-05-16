import { test as base } from '@playwright/test';
import { epic, label, parameter } from 'allure-js-commons';

import { ApiClient } from '../src/core/client/api-client.js';
import { compileSchema, formatAjvErrors } from '../src/core/contracts/ajv.js';
import { getModuleConfig, loadFrameworkConfig } from '../src/core/config/load-config.js';
import type { ModuleName } from '../src/core/config/types.js';

export type SchemaValidator = (data: unknown) => void;

const projectToModule: Record<string, ModuleName> = {
  'open-meteo': 'open-meteo',
  stripe: 'stripe',
  plaid: 'plaid',
  alpaca: 'alpaca',
  coinbase: 'coinbase',
  fred: 'fred',
  sec: 'sec',
};

export const test = base.extend<{
  moduleName: ModuleName;
  api: ApiClient;
  moduleConfig: ReturnType<typeof getModuleConfig>;
  validateAgainstSchema: (schema: object) => SchemaValidator;
}>({
  moduleName: async ({}, use, testInfo) => {
    const name = testInfo.project.name;
    const mod = projectToModule[name];
    if (!mod) {
      await use('open-meteo');
      return;
    }
    await use(mod);
  },
  moduleConfig: async ({ moduleName }, use) => {
    const fw = loadFrameworkConfig();
    await use(getModuleConfig(fw, moduleName));
  },
  api: async ({ request, moduleName, moduleConfig }, use) => {
    const client = new ApiClient({
      context: request,
      baseURL: moduleConfig.baseURL,
      auth: moduleConfig.auth,
      defaultHeaders: moduleConfig.defaultHeaders,
      coinbase:
        moduleName === 'coinbase'
          ? {
              apiKey: process.env.COINBASE_API_KEY ?? '',
              passphrase: process.env.COINBASE_PASSPHRASE ?? '',
            }
          : undefined,
    });
    await use(client);
  },
  validateAgainstSchema: async ({}, use) => {
    await use((schema: object) => {
      const v = compileSchema(schema);
      return (data: unknown) => {
        const ok = v(data);
        if (!ok) {
          throw new Error(formatAjvErrors(v.errors));
        }
      };
    });
  },
});

test.beforeEach(async ({}, testInfo) => {
  const module = projectToModule[testInfo.project.name] ?? testInfo.project.name;
  await epic(`module:${module}`);
  await label('module', module);
  await label('framework', 'apiautomation');
  await parameter('playwright_project', testInfo.project.name);
  await parameter('target_env', process.env.TARGET_ENV ?? 'local');
});

export { expect } from '@playwright/test';
