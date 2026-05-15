import fs from 'node:fs';

import {
  appendGithubStepSummary,
  buildStepSummaryMarkdown,
  defaultJsonReportPath,
  parsePlaywrightJsonReport,
} from './src/core/reporters/github-step-summary.js';
import { mailConfigFromEnv, sendRunNotification } from './src/core/notifications/email.js';

async function globalTeardown(): Promise<void> {
  const p = defaultJsonReportPath();
  if (!fs.existsSync(p)) {
    return;
  }
  const stats = parsePlaywrightJsonReport(p);
  const runUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined;
  const md = buildStepSummaryMarkdown(stats, {
    workflow: process.env.GITHUB_WORKFLOW,
    runUrl,
  });
  appendGithubStepSummary(md);
  try {
    await sendRunNotification(mailConfigFromEnv(), stats);
  } catch (e) {
    console.error('Notification error (non-fatal):', e);
  }
}

export default globalTeardown;
