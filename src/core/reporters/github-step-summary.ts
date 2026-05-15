import fs from 'node:fs';
import path from 'node:path';

export type SummaryStats = {
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
};

type JsonReport = {
  suites?: JsonSuite[];
  stats?: {
    duration?: number;
    expected?: number;
    unexpected?: number;
    skipped?: number;
  };
};

type JsonSuite = {
  suites?: JsonSuite[];
  specs?: JsonSpec[];
};

type JsonSpec = {
  tests?: JsonTest[];
};

type JsonTest = {
  results?: { status?: string; duration?: number }[];
};

function walkSuites(
  suite: JsonSuite | undefined,
  counts: { passed: number; failed: number; skipped: number },
) {
  if (!suite) return;
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      for (const r of t.results ?? []) {
        const s = r.status;
        if (s === 'passed') counts.passed += 1;
        else if (s === 'failed' || s === 'timedOut') counts.failed += 1;
        else if (s === 'skipped') counts.skipped += 1;
      }
    }
  }
  for (const ch of suite.suites ?? []) walkSuites(ch, counts);
}

export function parsePlaywrightJsonReport(filePath: string): SummaryStats {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonReport;
  if (raw.stats && typeof raw.stats.expected === 'number') {
    const durationMs = Math.round(raw.stats.duration ?? 0);
    return {
      passed: raw.stats.expected,
      failed: raw.stats.unexpected ?? 0,
      skipped: raw.stats.skipped ?? 0,
      durationMs,
    };
  }
  const counts = { passed: 0, failed: 0, skipped: 0 };
  for (const s of raw.suites ?? []) walkSuites(s, counts);
  const durationMs = raw.stats?.duration ? Math.round(raw.stats.duration) : 0;
  return { ...counts, durationMs };
}

export function appendGithubStepSummary(markdown: string): void {
  const fp = process.env.GITHUB_STEP_SUMMARY;
  if (!fp) return;
  fs.appendFileSync(fp, `${markdown}\n`, { encoding: 'utf8' });
}

export function buildStepSummaryMarkdown(
  stats: SummaryStats,
  meta: { workflow?: string; runUrl?: string },
): string {
  const total = stats.passed + stats.failed + stats.skipped;
  const lines = [
    `## API test run`,
    ``,
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Passed | ${stats.passed} |`,
    `| Failed | ${stats.failed} |`,
    `| Skipped | ${stats.skipped} |`,
    `| Total | ${total} |`,
    `| Duration (ms) | ${stats.durationMs} |`,
  ];
  if (meta.workflow) lines.push(``, `_Workflow: ${meta.workflow}_`);
  if (meta.runUrl) lines.push(``, `[Run details](${meta.runUrl})`);
  lines.push(
    ``,
    `Artifacts: Playwright HTML report, \`test-results.json\`, and \`allure-results\` are uploaded when configured.`,
  );
  return lines.join('\n');
}

export function defaultJsonReportPath(): string {
  return path.join(process.cwd(), 'test-results.json');
}
