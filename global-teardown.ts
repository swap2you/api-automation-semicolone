import fs from 'node:fs';

import dotenv from 'dotenv';

import {
  appendGithubStepSummary,
  buildStepSummaryMarkdown,
  defaultJsonReportPath,
  parsePlaywrightJsonReport,
} from './src/core/reporters/github-step-summary.js';
import { sendRunNotifications } from './src/core/notifications/notify.js';

dotenv.config();

async function globalTeardown(): Promise<void> {
  const p = defaultJsonReportPath();
  if (!fs.existsSync(p)) {
    console.warn('global-teardown: test-results.json not found — skipping summary and notifications.');
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
    const result = await sendRunNotifications(stats, p);
    if (result.emailSent) {
      console.log(`Notification: email sent to ${process.env.NOTIFY_TO}`);
    }
    if (result.teamsSent) {
      console.log('Notification: Teams message posted (live results from test-results.json).');
    }
    if (result.skippedReason && !result.emailSent && !result.teamsSent) {
      console.warn(`Notification not sent: ${result.skippedReason}`);
    } else if (result.skippedReason) {
      console.warn(`Notification note: ${result.skippedReason}`);
    }
  } catch (e) {
    console.error('Notification error (non-fatal):', e);
  }
}

export default globalTeardown;
