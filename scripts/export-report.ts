/**
 * Export Allure / Playwright results to HTML (zip), CSV, and PDF.
 *
 * Usage:
 *   npm run report:export -- --format all
 *   npm run report:allure:full   # generate + export + inject UI
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium } from '@playwright/test';

import {
  parsePlaywrightJsonReportRows,
  rowsToCsv,
} from '../src/core/reporters/parse-test-results.js';

type ExportFormat = 'html' | 'csv' | 'pdf' | 'all';

function parseFormat(argv: string[]): ExportFormat {
  const idx = argv.indexOf('--format');
  const v = idx !== -1 ? argv[idx + 1] : 'all';
  if (v === 'html' || v === 'csv' || v === 'pdf' || v === 'all') return v;
  return 'all';
}

function stamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

async function exportCsv(exportsDir: string, baseName: string): Promise<string> {
  const jsonPath = path.join(process.cwd(), 'test-results.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error('test-results.json not found — run tests first (npm test).');
  }
  const rows = parsePlaywrightJsonReportRows(jsonPath);
  const out = path.join(exportsDir, `${baseName}.csv`);
  fs.writeFileSync(out, rowsToCsv(rows), 'utf8');
  return out;
}

function exportHtmlZip(exportsDir: string, baseName: string): string {
  const reportDir = path.join(process.cwd(), 'allure-report');
  if (!fs.existsSync(reportDir)) {
    throw new Error('allure-report/ not found — run npm run report:allure first.');
  }
  const out = path.join(exportsDir, `${baseName}-html.zip`);
  const reportAbs = path.resolve(reportDir);
  const outAbs = path.resolve(out);

  if (process.platform === 'win32') {
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${reportAbs}\\*' -DestinationPath '${outAbs}' -Force"`,
      { stdio: 'inherit' },
    );
  } else {
    execSync(`cd "${reportAbs}" && zip -r "${outAbs}" .`, { stdio: 'inherit' });
  }
  return out;
}

async function exportPdf(exportsDir: string, baseName: string): Promise<string> {
  const indexHtml = path.join(process.cwd(), 'allure-report', 'index.html');
  if (!fs.existsSync(indexHtml)) {
    throw new Error('allure-report/index.html not found — run npm run report:allure first.');
  }
  const out = path.join(exportsDir, `${baseName}.pdf`);
  const url = pathToFileURL(indexHtml).href;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
  });
  await browser.close();
  return out;
}

function injectExportHub(baseName: string, copies: { csv?: string; zip?: string; pdf?: string }) {
  const reportExportDir = path.join(process.cwd(), 'allure-report', 'export');
  fs.mkdirSync(reportExportDir, { recursive: true });

  const links: Record<string, string> = {};
  if (copies.csv) {
    const dest = path.join(reportExportDir, `${baseName}.csv`);
    fs.copyFileSync(copies.csv, dest);
    links.csv = `./export/${baseName}.csv`;
  }
  if (copies.zip) {
    const dest = path.join(reportExportDir, `${baseName}-html.zip`);
    fs.copyFileSync(copies.zip, dest);
    links.html = `./export/${baseName}-html.zip`;
  }
  if (copies.pdf) {
    const dest = path.join(reportExportDir, `${baseName}.pdf`);
    fs.copyFileSync(copies.pdf, dest);
    links.pdf = `./export/${baseName}.pdf`;
  }

  const hubHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Export Allure Report</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; background: #f6f8fa; }
    .card { max-width: 520px; background: #fff; padding: 1.5rem 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    h1 { font-size: 1.25rem; margin: 0 0 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    select, button { width: 100%; padding: 0.6rem; margin-bottom: 0.75rem; font-size: 1rem; }
    button { background: #1976d2; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #1565c0; }
    a.back { display: inline-block; margin-top: 1rem; color: #1976d2; }
    p.hint { color: #555; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Export test report</h1>
    <p class="hint">Choose format and download. Bundle: ${baseName}</p>
    <label for="format">Format</label>
    <select id="format">
      <option value="html">HTML (ZIP archive)</option>
      <option value="csv">CSV (per-test results)</option>
      <option value="pdf">PDF (overview snapshot)</option>
    </select>
    <button type="button" id="download">Download</button>
    <a class="back" href="../index.html">← Back to Allure dashboard</a>
  </div>
  <script>
    const links = ${JSON.stringify(links)};
    document.getElementById('download').addEventListener('click', () => {
      const fmt = document.getElementById('format').value;
      const href = links[fmt];
      if (!href) { alert('Export file not available for ' + fmt); return; }
      const a = document.createElement('a');
      a.href = href;
      a.download = href.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(reportExportDir, 'index.html'), hubHtml, 'utf8');

  const indexPath = path.join(process.cwd(), 'allure-report', 'index.html');
  if (fs.existsSync(indexPath)) {
    let index = fs.readFileSync(indexPath, 'utf8');
    const banner = `<div id="apiauto-export-bar" style="position:fixed;top:0;right:0;z-index:99999;padding:8px 12px;background:#1976d2;border-radius:0 0 0 6px;"><a href="./export/index.html" style="color:#fff;font-family:system-ui,sans-serif;font-size:14px;text-decoration:none;font-weight:600;">Export report</a></div>`;
    if (!index.includes('apiauto-export-bar')) {
      index = index.replace('<body>', `<body>${banner}`);
      fs.writeFileSync(indexPath, index, 'utf8');
    }
  }
}

async function main() {
  const format = parseFormat(process.argv.slice(2));
  const exportsDir = path.join(process.cwd(), 'exports');
  fs.mkdirSync(exportsDir, { recursive: true });
  const baseName = `apiautomation-report-${stamp()}`;

  const outputs: string[] = [];
  const files: { csv?: string; zip?: string; pdf?: string } = {};

  if (format === 'csv' || format === 'all') {
    const p = await exportCsv(exportsDir, baseName);
    outputs.push(p);
    files.csv = p;
  }
  if (format === 'html' || format === 'all') {
    const p = exportHtmlZip(exportsDir, baseName);
    outputs.push(p);
    files.zip = p;
  }
  if (format === 'pdf' || format === 'all') {
    try {
      const p = await exportPdf(exportsDir, baseName);
      outputs.push(p);
      files.pdf = p;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`PDF export skipped: ${msg}`);
      console.warn('Run: npm run install:browsers — then re-run report:export');
    }
  }

  injectExportHub(baseName, files);

  console.log('\nExport complete:');
  for (const p of outputs) console.log(' -', p);
  console.log('\nIn Allure UI: click "Export report" (top-right) → choose HTML / CSV / PDF');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
