import fs from 'node:fs';

import {
  appendGithubStepSummary,
  buildStepSummaryMarkdown,
  defaultJsonReportPath,
  parsePlaywrightJsonReport,
} from './src/core/reporters/github-step-summary.js';
import { sendRunNotifications } from './src/core/notifications/notify.js';

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
    const result = await sendRunNotifications(stats);
    if (result.emailSent) {
      console.log(`Notification: email sent to ${process.env.NOTIFY_TO}`);
    }
    if (result.teamsSent) {
      console.log('Notification: Teams message posted.');
    }
    if (result.skippedReason && !result.emailSent && !result.teamsSent) {
      console.warn(`Notification not sent: ${result.skippedReason}`);
    }
    if (result.skippedReason && (result.emailSent || result.teamsSent)) {
      console.warn(`Notification partial: ${result.skippedReason}`);
    }
  } catch (e) {
    console.error('Notification error (non-fatal):', e);
  }
}

export default globalTeardown;
