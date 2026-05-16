import fs from 'node:fs';

import type { SummaryStats } from '../reporters/github-step-summary.js';
import {
  parsePlaywrightJsonReportRows,
  statsFromRows,
  type TestResultRow,
} from '../reporters/parse-test-results.js';

export type RunReportContext = {
  stats: SummaryStats;
  rows: TestResultRow[];
  targetEnv: string;
  notifyChannel: string;
  runUrl?: string;
  allureUrl: string;
  reportExportHint: string;
  runFinishedAt?: string;
};

export type TestResultLine = {
  index: number;
  project: string;
  module: string;
  title: string;
  status: string;
  durationMs: number;
  error?: string;
};

export type RunReportPayload = {
  title: string;
  verdict: 'PASS' | 'FAIL';
  summaryLine: string;
  plainText: string;
  facts: { name: string; value: string }[];
  failedTests: { project: string; title: string; error: string }[];
  allTests: TestResultLine[];
  testResultsTable: string;
  stats: SummaryStats & { total: number };
  links: { label: string; url: string }[];
  nextSteps: string[];
};

export function loadRunReportContext(
  stats: SummaryStats,
  jsonReportPath?: string,
): RunReportContext {
  const reportPath = jsonReportPath ?? `${process.cwd()}/test-results.json`;
  const rows = fs.existsSync(reportPath) ? parsePlaywrightJsonReportRows(reportPath) : [];

  const alignedStats: SummaryStats =
    rows.length > 0
      ? { ...statsFromRows(rows), durationMs: stats.durationMs || statsFromRows(rows).durationMs }
      : stats;

  const runUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined;

  let runFinishedAt: string | undefined;
  if (fs.existsSync(reportPath)) {
    runFinishedAt = fs.statSync(reportPath).mtime.toISOString();
  }

  return {
    stats: alignedStats,
    rows,
    targetEnv: process.env.TARGET_ENV ?? 'local',
    notifyChannel: process.env.NOTIFY_CHANNEL ?? 'teams',
    runUrl,
    allureUrl: process.env.ALLURE_REPORT_URL ?? 'http://localhost:9292',
    reportExportHint: 'npm run report:allure:full && npm run report:allure:view',
    runFinishedAt,
  };
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function statusLabel(status: string): string {
  if (status === 'passed') return 'PASSED';
  if (status === 'failed' || status === 'timedOut') return 'FAILED';
  if (status === 'skipped') return 'SKIPPED';
  return status.toUpperCase();
}

function buildTestResultsTable(lines: TestResultLine[], maxRows = 30): string {
  if (lines.length === 0) {
    return '(No test rows in test-results.json — run tests first.)';
  }
  const shown = lines.slice(0, maxRows);
  const header = '# | Module | Test | Status | Duration';
  const sep = '--|---------|------|--------|----------';
  const body = shown.map(
    (t) =>
      `${t.index} | ${t.module} | ${t.title} | ${statusLabel(t.status)} | ${formatDuration(t.durationMs)}`,
  );
  const more =
    lines.length > maxRows ? `\n... +${lines.length - maxRows} more (see Allure or CSV export)` : '';
  return [header, sep, ...body].join('\n') + more;
}

export function buildRunReportPayload(ctx: RunReportContext): RunReportPayload {
  const { stats } = ctx;
  const total = stats.passed + stats.failed + stats.skipped;
  const verdict: 'PASS' | 'FAIL' = stats.failed === 0 ? 'PASS' : 'FAIL';

  const allTests: TestResultLine[] = ctx.rows.map((r, i) => ({
    index: i + 1,
    project: r.project,
    module: r.module,
    title: r.title,
    status: r.status,
    durationMs: r.durationMs,
    error: r.error,
  }));

  const failedRows = ctx.rows.filter((r) => r.status === 'failed' || r.status === 'timedOut');
  const skippedModules = [
    ...new Set(ctx.rows.filter((r) => r.status === 'skipped').map((r) => r.module)),
  ];

  const failedTests = failedRows.map((r) => ({
    project: r.project,
    title: r.title,
    error: r.error ?? 'See Allure attachment / trace',
  }));

  const testResultsTable = buildTestResultsTable(allTests);

  const title =
    verdict === 'PASS'
      ? `API tests PASSED (${stats.passed}/${total})`
      : `API tests FAILED (${stats.failed} failure${stats.failed === 1 ? '' : 's'})`;

  const summaryLine = `${verdict} · ${stats.passed} passed · ${stats.failed} failed · ${stats.skipped} skipped · ${formatDuration(stats.durationMs)}`;

  const nextSteps: string[] = [];
  if (verdict === 'FAIL') {
    nextSteps.push('Open Allure dashboard and filter by Failed');
    if (failedRows.length) {
      const mod = failedRows[0]?.module;
      if (mod && mod !== 'unknown') {
        nextSteps.push(`Re-run module: npm run test -- --project=${mod}`);
      }
    }
    nextSteps.push('Export spreadsheet: npm run report:export -- --format csv');
  } else {
    nextSteps.push('Optional: archive report — npm run report:export -- --format all');
  }
  nextSteps.push(`View report: ${ctx.allureUrl} (run: npm run report:allure:view)`);

  const facts: { name: string; value: string }[] = [
    { name: 'Verdict', value: verdict },
    { name: 'Passed', value: String(stats.passed) },
    { name: 'Failed', value: String(stats.failed) },
    { name: 'Skipped', value: String(stats.skipped) },
    { name: 'Total', value: String(total) },
    { name: 'Duration', value: formatDuration(stats.durationMs) },
    { name: 'Environment', value: ctx.targetEnv },
  ];
  if (ctx.runFinishedAt) {
    facts.push({ name: 'Run finished (UTC)', value: ctx.runFinishedAt });
  }
  if (skippedModules.length && stats.skipped > 0) {
    facts.push({ name: 'Skipped modules', value: skippedModules.join(', ') });
  }
  if (ctx.runUrl) {
    facts.push({ name: 'CI run', value: ctx.runUrl });
  }

  const links: { label: string; url: string }[] = [
    { label: 'Allure dashboard', url: ctx.allureUrl },
  ];
  if (ctx.runUrl) {
    links.push({ label: 'GitHub Actions run', url: ctx.runUrl });
  }

  const failedBlock =
    failedTests.length === 0
      ? 'None — all executed tests passed.'
      : failedTests
          .map((t, i) => `${i + 1}. [${t.project}] ${t.title}\n   → ${t.error}`)
          .join('\n');

  const plainText = [
    title,
    '='.repeat(Math.min(title.length, 48)),
    '',
    summaryLine,
    ctx.runFinishedAt ? `Finished (UTC): ${ctx.runFinishedAt}` : '',
    '',
    '--- Counts (same as Allure / CSV) ---',
    `Passed:  ${stats.passed}`,
    `Failed:  ${stats.failed}`,
    `Skipped: ${stats.skipped}`,
    `Total:   ${total}`,
    `Duration: ${formatDuration(stats.durationMs)}`,
    `Environment: ${ctx.targetEnv}`,
    '',
    '--- All test results ---',
    testResultsTable,
    '',
    '--- Failed tests (detail) ---',
    failedBlock,
    '',
    '--- Reports ---',
    `Allure: ${ctx.allureUrl}`,
    ctx.runUrl ? `CI:     ${ctx.runUrl}` : '',
    `Export: ${ctx.reportExportHint}`,
    '',
    '--- Next steps ---',
    ...nextSteps.map((s, i) => `${i + 1}. ${s}`),
  ]
    .filter(Boolean)
    .join('\n');

  return {
    title,
    verdict,
    summaryLine,
    plainText,
    facts,
    failedTests,
    allTests,
    testResultsTable,
    stats: { ...stats, total },
    links,
    nextSteps,
  };
}

export function buildAdaptiveCard(report: RunReportPayload): Record<string, unknown> {
  const color = report.verdict === 'PASS' ? 'Good' : 'Attention';
  const body: Record<string, unknown>[] = [
    {
      type: 'TextBlock',
      text: report.title,
      weight: 'Bolder',
      size: 'Large',
      color,
      wrap: true,
    },
    {
      type: 'TextBlock',
      text: report.summaryLine,
      wrap: true,
      spacing: 'Small',
    },
    {
      type: 'FactSet',
      facts: report.facts.slice(0, 8).map((f) => ({ title: f.name, value: f.value })),
    },
    {
      type: 'TextBlock',
      text: '**All test results** (matches CSV export)',
      weight: 'Bolder',
      spacing: 'Medium',
    },
    {
      type: 'TextBlock',
      text: report.testResultsTable,
      fontType: 'Monospace',
      wrap: true,
      spacing: 'Small',
    },
  ];

  if (report.failedTests.length > 0) {
    body.push({
      type: 'TextBlock',
      text: '**Failed tests**',
      weight: 'Bolder',
      spacing: 'Medium',
    });
    for (const t of report.failedTests.slice(0, 8)) {
      body.push({
        type: 'TextBlock',
        text: `• **${t.project}** — ${t.title}\n${t.error}`,
        wrap: true,
        spacing: 'Small',
      });
    }
  }

  body.push({
    type: 'TextBlock',
    text: '**Next steps**',
    weight: 'Bolder',
    spacing: 'Medium',
  });
  for (const step of report.nextSteps) {
    body.push({ type: 'TextBlock', text: step, wrap: true, spacing: 'Small' });
  }

  const actions = report.links.map((l) => ({
    type: 'Action.OpenUrl',
    title: l.label,
    url: l.url,
  }));

  return {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard',
    version: '1.4',
    body,
    actions: actions.length ? actions : undefined,
  };
}
