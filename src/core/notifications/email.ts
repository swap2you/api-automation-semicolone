import nodemailer from 'nodemailer';

import type { SummaryStats } from '../reporters/github-step-summary.js';

export type MailConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
  onlyOnFailure: boolean;
};

export function mailConfigFromEnv(): MailConfig {
  return {
    enabled: process.env.NOTIFY_ENABLED === 'true',
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.NOTIFY_FROM ?? '',
    to: process.env.NOTIFY_TO ?? '',
    onlyOnFailure: process.env.NOTIFY_ONLY_ON_FAILURE === 'true',
  };
}

export async function sendRunNotification(cfg: MailConfig, stats: SummaryStats): Promise<void> {
  if (!cfg.enabled) return;
  if (!cfg.host || !cfg.from || !cfg.to) return;
  if (cfg.onlyOnFailure && stats.failed === 0) return;

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth:
      cfg.user && cfg.pass
        ? {
            user: cfg.user,
            pass: cfg.pass,
          }
        : undefined,
  });

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
      : '',
  ].join('\n');

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    subject,
    text,
  });
}
