import type { SummaryStats } from '../reporters/github-step-summary.js';
import {
  buildAdaptiveCard,
  buildRunReportPayload,
  loadRunReportContext,
  type RunReportContext,
} from './build-run-report.js';

export type TeamsConfig = {
  webhookUrl: string;
  onlyOnFailure: boolean;
  /** powerautomate | teams — auto-detected from URL if omitted */
  webhookKind?: 'powerautomate' | 'teams';
};

export function teamsConfigFromEnv(): TeamsConfig {
  const url = process.env.TEAMS_WEBHOOK_URL ?? '';
  const kindEnv = process.env.TEAMS_WEBHOOK_KIND?.toLowerCase();
  let webhookKind: TeamsConfig['webhookKind'];
  if (kindEnv === 'powerautomate' || kindEnv === 'teams') {
    webhookKind = kindEnv;
  } else if (/powerplatform\.com|powerautomate|logic\.azure\.com/i.test(url)) {
    webhookKind = 'powerautomate';
  } else {
    webhookKind = 'teams';
  }
  return {
    webhookUrl: url,
    onlyOnFailure: process.env.NOTIFY_ONLY_ON_FAILURE !== 'false',
    webhookKind,
  };
}

function buildPowerAutomateBody(report: ReturnType<typeof buildRunReportPayload>) {
  const adaptiveCard = buildAdaptiveCard(report);
  return {
    title: report.title,
    summary: report.summaryLine,
    verdict: report.verdict,
    message: report.plainText,
    text: report.plainText,
    stats: report.stats,
    failedTests: report.failedTests,
    facts: report.facts,
    links: report.links,
    nextSteps: report.nextSteps,
    adaptiveCard,
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: adaptiveCard,
      },
    ],
  };
}

function buildMessageCard(report: ReturnType<typeof buildRunReportPayload>) {
  const themeColor = report.verdict === 'PASS' ? '2EB886' : 'E81123';
  const failedMd =
    report.failedTests.length === 0
      ? '_No failures._'
      : report.failedTests
          .map((t) => `**${t.project}** — ${t.title}\n${t.error}`)
          .join('\n\n');

  return {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor,
    summary: report.title,
    sections: [
      {
        activityTitle: report.title,
        activitySubtitle: report.summaryLine,
        facts: report.facts,
        markdown: true,
      },
      {
        title: 'Failed tests',
        text: failedMd,
      },
      {
        title: 'Next steps',
        text: report.nextSteps.map((s) => `• ${s}`).join('\n'),
      },
    ],
    potentialAction: report.links.map((l) => ({
      '@type': 'OpenUri',
      name: l.label,
      targets: [{ os: 'default', uri: l.url }],
    })),
  };
}

/** Microsoft Teams / Power Automate webhook notification. */
export async function sendTeamsRunNotification(
  cfg: TeamsConfig,
  stats: SummaryStats,
  jsonReportPath?: string,
  contextOverride?: Partial<RunReportContext>,
): Promise<void> {
  if (!cfg.webhookUrl) return;
  if (cfg.onlyOnFailure && stats.failed === 0) return;

  const ctx: RunReportContext = {
    ...loadRunReportContext(stats, jsonReportPath),
    ...contextOverride,
  };
  const report = buildRunReportPayload(ctx);
  const kind = cfg.webhookKind ?? 'teams';
  const body = kind === 'powerautomate' ? buildPowerAutomateBody(report) : buildMessageCard(report);

  const res = await fetch(cfg.webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Teams webhook failed ${res.status}: ${text}`);
  }
}
