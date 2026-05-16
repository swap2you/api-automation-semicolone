/**
 * Send a sample Teams / Power Automate notification (same payload as global-teardown).
 *
 *   npm run notify:teams -- --failure --send
 *   npm run notify:teams -- --pass --send
 */

import dotenv from 'dotenv';

dotenv.config();

import { sendTeamsRunNotification, teamsConfigFromEnv } from '../src/core/notifications/teams.js';
import {
  buildRunReportPayload,
  loadRunReportContext,
} from '../src/core/notifications/build-run-report.js';
import type { SummaryStats } from '../src/core/reporters/github-step-summary.js';
import { defaultJsonReportPath } from '../src/core/reporters/github-step-summary.js';

function parseArgs(argv: string[]) {
  const failure = argv.includes('--failure') || argv.includes('-f');
  const pass = argv.includes('--pass');
  const send = argv.includes('--send');
  return { failure: failure || !pass, send };
}

function failureDemoStats(): SummaryStats {
  return { passed: 8, failed: 2, skipped: 9, durationMs: 10_500 };
}

function passDemoStats(): SummaryStats {
  return { passed: 17, failed: 0, skipped: 0, durationMs: 6200 };
}

function demoFailedRows() {
  return [
    {
      project: 'open-meteo',
      module: 'open-meteo',
      file: 'modules/open-meteo/contract.forecast.spec.ts',
      suite: 'Open-Meteo forecast @contract',
      title: 'response matches contract schema for default city',
      status: 'failed',
      durationMs: 890,
      error: 'Ajv schema mismatch: required property "hourly" missing',
    },
    {
      project: 'stripe',
      module: 'stripe',
      file: 'modules/stripe/smoke.customers.spec.ts',
      suite: 'Stripe customers @smoke',
      title: 'create customer (form) and retrieve',
      status: 'failed',
      durationMs: 420,
      error: 'Expected 200, received 401 — check STRIPE_SECRET_KEY',
    },
  ];
}

async function main() {
  const { failure, send } = parseArgs(process.argv.slice(2));
  const stats = failure ? failureDemoStats() : passDemoStats();
  const cfg = teamsConfigFromEnv();

  let ctx = loadRunReportContext(stats, defaultJsonReportPath());
  if (failure && !ctx.rows.some((r) => r.status === 'failed' || r.status === 'timedOut')) {
    ctx = { ...ctx, rows: [...ctx.rows, ...demoFailedRows()] };
  }
  const preview = buildRunReportPayload(ctx);

  console.log('\n--- Teams notification preview ---\n');
  console.log(preview.plainText);
  console.log('\n--- Webhook ---');
  console.log(`URL set: ${cfg.webhookUrl ? 'yes' : 'NO — set TEAMS_WEBHOOK_URL in .env'}`);
  console.log(`Kind: ${cfg.webhookKind ?? 'auto'}`);
  console.log(`Only on failure: ${cfg.onlyOnFailure}`);

  if (!cfg.webhookUrl) {
    console.error('\nError: TEAMS_WEBHOOK_URL is empty. Copy .env.example → .env and paste your workflow URL.');
    process.exit(1);
  }

  if (!send) {
    console.log('\nDry-run only. Add --send to post to Teams:');
    console.log('  npm run notify:teams -- --failure --send');
    process.exit(0);
  }

  if (cfg.onlyOnFailure && stats.failed === 0) {
    console.log('\nSkipped: NOTIFY_ONLY_ON_FAILURE=true and stats are PASS. Use --failure or set NOTIFY_ONLY_ON_FAILURE=false');
    process.exit(0);
  }

  await sendTeamsRunNotification({ ...cfg, onlyOnFailure: false }, stats, undefined, {
    rows: ctx.rows,
  });
  console.log('\nTeams notification sent. Check your channel.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
