import fs from 'node:fs';

export type TestResultRow = {
  project: string;
  module: string;
  file: string;
  suite: string;
  title: string;
  status: string;
  durationMs: number;
  error?: string;
};

type JsonSuite = {
  title?: string;
  file?: string;
  suites?: JsonSuite[];
  specs?: JsonSpec[];
};

type JsonSpec = {
  title?: string;
  tests?: JsonTest[];
};

type JsonTest = {
  results?: { status?: string; duration?: number; error?: { message?: string } }[];
};

function projectFromFile(file: string): string {
  const m = file.match(/modules[/\\]([^/\\]+)/);
  if (m) return m[1];
  if (file.includes('contracts')) return 'contracts';
  return 'unknown';
}

function walkSuites(
  suite: JsonSuite | undefined,
  file: string,
  suitePath: string,
  rows: TestResultRow[],
  projectHint: string,
) {
  if (!suite) return;
  const currentPath = suitePath ? `${suitePath} › ${suite.title ?? ''}` : (suite.title ?? '');
  const filePath = suite.file ?? file;

  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      for (const r of t.results ?? []) {
        const status = r.status ?? 'unknown';
        rows.push({
          project: projectHint,
          module: projectFromFile(filePath),
          file: filePath,
          suite: currentPath,
          title: spec.title ?? '',
          status,
          durationMs: Math.round(r.duration ?? 0),
          error: r.error?.message?.split('\n')[0],
        });
      }
    }
  }
  for (const ch of suite.suites ?? []) {
    walkSuites(ch, filePath, currentPath, rows, projectHint);
  }
}

export function parsePlaywrightJsonReportRows(filePath: string): TestResultRow[] {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
    suites?: JsonSuite[];
    config?: { projects?: { name: string }[] };
  };
  const rows: TestResultRow[] = [];
  for (const root of raw.suites ?? []) {
    const file = root.file ?? root.title ?? '';
    const project = projectFromFile(file) === 'unknown' ? 'multi' : projectFromFile(file);
    walkSuites(root, file, '', rows, project);
  }
  return rows;
}

export function statsFromRows(rows: TestResultRow[]): {
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
} {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let durationMs = 0;
  for (const r of rows) {
    durationMs += r.durationMs;
    if (r.status === 'passed') passed += 1;
    else if (r.status === 'failed' || r.status === 'timedOut') failed += 1;
    else if (r.status === 'skipped') skipped += 1;
  }
  return { passed, failed, skipped, durationMs };
}

export function rowsToCsv(rows: TestResultRow[]): string {
  const header = ['project', 'module', 'file', 'suite', 'title', 'status', 'duration_ms', 'error'];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        r.project,
        r.module,
        r.file,
        r.suite,
        r.title,
        r.status,
        String(r.durationMs),
        r.error ?? '',
      ]
        .map(esc)
        .join(','),
    ),
  ];
  return lines.join('\n');
}
