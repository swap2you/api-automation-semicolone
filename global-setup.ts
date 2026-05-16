import fs from 'node:fs';
import path from 'node:path';

/**
 * Seeds Allure environment metadata before tests run.
 * Fixes empty Environment widget and avoids stray "404 Not Found" placeholders on the dashboard
 * when executor/environment widgets have no data.
 */
export default async function globalSetup(): Promise<void> {
  const resultsDir = path.join(process.cwd(), 'allure-results');
  fs.mkdirSync(resultsDir, { recursive: true });

  const projectArg = process.argv.find((a) => a.startsWith('--project='));
  const moduleName = process.env.ALLURE_MODULE ?? projectArg?.split('=')[1] ?? 'multi-module';
  const targetEnv = process.env.TARGET_ENV ?? 'local';

  const environmentLines = [
    `Module=${moduleName}`,
    `TARGET_ENV=${targetEnv}`,
    `Framework=Playwright API (apiautomation)`,
    `Node=${process.version}`,
    `OS=${process.platform}`,
    `CI=${process.env.CI ?? 'false'}`,
  ];
  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), environmentLines.join('\n'), 'utf8');

  const buildUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined;

  const executor = [
    {
      name: 'Playwright Test',
      type: 'playwright',
      buildOrder: 1,
      buildName: `apiautomation-${moduleName}-${targetEnv}`,
      buildUrl: buildUrl ?? 'local-run',
      reportName: 'Allure Report',
      reportUrl: buildUrl ?? 'local-run',
    },
  ];
  fs.writeFileSync(path.join(resultsDir, 'executor.json'), JSON.stringify(executor), 'utf8');
}
