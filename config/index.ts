import type { EnvironmentName, FrameworkConfig } from '../src/core/config/types.js';

import { local } from './environments/local.js';
import { prodLike } from './environments/prod-like.js';
import { qa } from './environments/qa.js';
import { staging } from './environments/staging.js';

const envs: Record<EnvironmentName, FrameworkConfig> = {
  local,
  qa,
  staging,
  'prod-like': prodLike,
};

export function getEnvironmentConfig(name: EnvironmentName): FrameworkConfig {
  return envs[name];
}
