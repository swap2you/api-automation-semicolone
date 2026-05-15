/**
 * Preview / send one notification email matching CI teardown logic (see src/core/notifications/email.ts).
 *
 * Shows exactly what would go out on a FAILED pipeline-style run when NOTIFY_ONLY_ON_FAILURE=true.
 *
 * Usage (PowerShell) — set your SMTP relay; Persistent IT usually provides host/user/pass:
 *
 *   $env:NOTIFY_ENABLED="true"
 *   $env:SMTP_HOST="your-smtp-host"
 *   $env:SMTP_PORT="587"
 *   $env:SMTP_SECURE="false"
 *   $env:SMTP_USER="your-user-or-blank"
 *   $env:SMTP_PASS="your-password-or-blank"
 *   $env:NOTIFY_FROM="your-approved-from-address"
 *   npx tsx scripts/send-test-notification.ts --failure --to engineer@company.com
 *
 * Omit SMTP_* auth if your relay allows IP/office LAN relay without login (some corp relays).
 */

import dotenv from 'dotenv';

dotenv.config();

import type { MailConfig } from '../src/core/notifications/email.js';
import { sendRunNotification } from '../src/core/notifications/email.js';
import type { SummaryStats } from '../src/core/reporters/github-step-summary.js';

function parseArgs(argv: string[]) {
  const failure = argv.includes('--failure') || argv.includes('-f');
  const toIdx = argv.indexOf('--to');
  const to = toIdx !== -1 ? argv[toIdx + 1] : undefined;
  return { failure, to };
}

/** Demo stats resembling “suite ran but some tests failed” (e.g. Open-Meteo OK + flaky Stripe). */
function failureDemoStats(): SummaryStats {
  return {
    passed: 8,
    failed: 2,
    skipped: 9,
    durationMs: 5500,
  };
}

function passDemoStats(): SummaryStats {
  return {
    passed: 17,
    failed: 0,
    skipped: 0,
    durationMs: 6200,
  };
}

function buildPreview(stats: SummaryStats): { subject: string; text: string } {
  const ok = stats.failed === 0;
  const subject = ok
    ? `[apiautomation] PASS — ${stats.passed} passed`
    : `[apiautomation] FAIL — ${stats.failed} failed`;
  const text = [
    `Passed: ${stats.passed}`,
    `Failed: ${stats.failed}`,
    `Skipped: ${stats.skipped}`,
    `Duration ms: ${stats.durationMs}`,
    '',
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `Run: ${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : '(No GitHub Actions URL — local preview)',
  ].join('\n');
  return { subject, text };
}

async function main() {
  const { failure, to: toArg } = parseArgs(process.argv.slice(2));
  const stats = failure ? failureDemoStats() : passDemoStats();

  const to = toArg ?? process.env.NOTIFY_TO ?? '';
  const preview = buildPreview(stats);

  console.log('\n--- Email preview (same shape as pipeline teardown) ---\n');
  console.log(`To: ${to || '(missing — pass --to email@domain)'}`);
  console.log(`Subject: ${preview.subject}`);
  console.log('Body:\n' + preview.text);
  console.log('\n--- End preview ---\n');

  if (!to) {
    console.error('Error: no recipient. Use --to you@company.com');
    process.exit(1);
  }

  const cfg: MailConfig = {
    enabled: process.env.NOTIFY_ENABLED === 'true' || process.argv.includes('--send'),
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.NOTIFY_FROM ?? '',
    to,
    // Match nightly.yml flavor: only notify when failing runs failed tests (skip PASS mails).
    onlyOnFailure: process.env.NOTIFY_ONLY_ON_FAILURE === 'true',
  };

  const skipDueToOnlyFailure = cfg.onlyOnFailure && stats.failed === 0;
  if (skipDueToOnlyFailure) {
    console.log(
      'NOTE: NOTIFY_ONLY_ON_FAILURE=true and demo stats are PASS — no mail sent (same as CI when tests pass).\n' +
        'Use --failure for a FAIL-shaped demo, or set NOTIFY_ONLY_ON_FAILURE=false for this test.',
    );
    process.exit(0);
  }

  if (!cfg.enabled) {
    console.log(
      'Dry-run only (no send). To attempt SMTP delivery add NOTIFY_ENABLED=true (and SMTP_* / NOTIFY_FROM), or pass --send shortcut:',
      '\n  NOTIFY_ENABLED=true ... npx tsx scripts/send-test-notification.ts --failure --to ...',
      '\n  OR:',
      '\n  ... npx tsx scripts/send-test-notification.ts --send --failure --to ...',
    );
    process.exit(0);
  }

  if (!cfg.host || !cfg.from) {
    console.error('SMTP_HOST and NOTIFY_FROM are required to send.');
    process.exit(1);
  }

  await sendRunNotification(cfg, stats);
  console.log('Send attempted OK (check inbox / spam).');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
