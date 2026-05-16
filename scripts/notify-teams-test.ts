/**
 * Send Teams notification from the latest real test run (test-results.json).
 *
 *   npm run notify:teams -- --send
 *   npm run notify:teams -- --demo --failure --send   # mock data only for flow testing
 */

import fs from 'node:fs';

import dotenv from 'dotenv';

dotenv.config();

import { sendTeamsRunNotification, teamsConfigFromEnv } from '../src/core/notifications/teams.js';
import {
  buildRunReportPayload,
  loadRunReportContext,
} from '../src/core/notifications/build-run-report.js';
import {
  defaultJsonReportPath,
  parsePlaywrightJsonReport,
} from '../src/core/reporters/github-step-summary.js';
import { shouldSendTeams } from '../src/core/notifications/notify-policy.js';

function parseArgs(argv: string[]) {
  const demo = argv.includes('--demo');
  const failure = argv.includes('--failure') || argv.includes('-f');
  const send = argv.includes('--send');
  return { demo, failure, send };
}

async function main() {
  const { demo, failure, send } = parseArgs(process.argv.slice(2));
  const cfg = teamsConfigFromEnv();
  const reportPath = defaultJsonReportPath();

  if (!cfg.webhookUrl) {
    console.error('TEAMS_WEBHOOK_URL is empty. Set it in .env');
    process.exit(1);
  }

  if (demo) {
    console.warn('Using --demo mock stats (not real run data). Omit --demo for live results.');
    const stats = failure
      ? { passed: 0, failed: 1, skipped: 0, durationMs: 1000 }
      : { passed: 1, failed: 0, skipped: 0, durationMs: 500 };
    const ctx = loadRunReportContext(stats, reportPath);
    const preview = buildRunReportPayload(ctx);
    console.log(preview.plainText);
    if (send) {
      await sendTeamsRunNotification(cfg, stats, reportPath);
      console.log('Demo Teams notification sent.');
    }
    return;
  }

  if (!fs.existsSync(reportPath)) {
    console.error(`No ${reportPath} — run: npm run test:ci`);
    process.exit(1);
  }

  const stats = parsePlaywrightJsonReport(reportPath);
  const ctx = loadRunReportContext(stats, reportPath);
  const preview = buildRunReportPayload(ctx);

  console.log('\n--- Live Teams preview (from test-results.json) ---\n');
  console.log(preview.plainText);

  if (!send) {
    console.log('\nDry-run. Send to channel: npm run notify:teams -- --send');
    process.exit(0);
  }

  if (!shouldSendTeams(stats)) {
    console.log(
      '\nSkipped: TEAMS_NOTIFY_ALWAYS=false and run had no failures. Set TEAMS_NOTIFY_ALWAYS=true in .env',
    );
    process.exit(0);
  }

  await sendTeamsRunNotification(cfg, stats, reportPath);
  console.log('\nTeams notification sent with live run data.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
