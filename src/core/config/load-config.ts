import { config as loadEnv } from 'dotenv';

import { getEnvironmentConfig } from '../../../config/index.js';
import type { EnvironmentName, FrameworkConfig, ModuleConfig, ModuleName } from './types.js';

loadEnv();

const envNames: EnvironmentName[] = ['local', 'qa', 'staging', 'prod-like'];

function resolveEnvName(): EnvironmentName {
  const raw = (process.env.TARGET_ENV ?? 'local').toLowerCase();
  if (envNames.includes(raw as EnvironmentName)) {
    return raw as EnvironmentName;
  }
  return 'local';
}

export function loadFrameworkConfig(): FrameworkConfig {
  const env = resolveEnvName();
  return getEnvironmentConfig(env);
}

export function getModuleConfig(
  framework: FrameworkConfig,
  module: ModuleName,
): ModuleConfig {
  const mod = framework.modules[module];
  if (!mod) {
    throw new Error(`Unknown module: ${module}`);
  }
  return mod;
}
