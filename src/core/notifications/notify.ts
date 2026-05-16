import type { SummaryStats } from '../reporters/github-step-summary.js';
import { defaultJsonReportPath } from '../reporters/github-step-summary.js';
import { mailConfigFromEnv, sendRunNotification } from './email.js';
import { sendTeamsRunNotification, teamsConfigFromEnv } from './teams.js';

export type NotifyChannel = 'email' | 'teams' | 'both' | 'none';

export function resolveNotifyChannel(): NotifyChannel {
  const raw = (process.env.NOTIFY_CHANNEL ?? 'email').toLowerCase();
  if (raw === 'teams' || raw === 'email' || raw === 'both' || raw === 'none') return raw;
  return 'email';
}

export type NotifyResult = {
  channel: NotifyChannel;
  emailSent: boolean;
  teamsSent: boolean;
  skippedReason?: string;
};

/**
 * Sends post-run notifications when enabled. On failure, notifies if NOTIFY_ONLY_ON_FAILURE
 * is true (default) or always when NOTIFY_ONLY_ON_FAILURE=false.
 */
export async function sendRunNotifications(
  stats: SummaryStats,
  jsonReportPath?: string,
): Promise<NotifyResult> {
  const reportPath = jsonReportPath ?? defaultJsonReportPath();
  const channel = resolveNotifyChannel();
  if (channel === 'none') {
    return { channel, emailSent: false, teamsSent: false, skippedReason: 'NOTIFY_CHANNEL=none' };
  }

  const onlyOnFailure = process.env.NOTIFY_ONLY_ON_FAILURE !== 'false';
  if (onlyOnFailure && stats.failed === 0) {
    return {
      channel,
      emailSent: false,
      teamsSent: false,
      skippedReason: 'No failures — NOTIFY_ONLY_ON_FAILURE is enabled',
    };
  }

  let emailSent = false;
  let teamsSent = false;
  const errors: string[] = [];

  if (channel === 'email' || channel === 'both') {
    const mail = mailConfigFromEnv();
    const mailReady = mail.enabled && mail.host && mail.from && mail.to;
    if (!mailReady) {
      errors.push(
        'Email skipped: set NOTIFY_ENABLED=true, SMTP_HOST, NOTIFY_FROM, NOTIFY_TO (and SMTP_USER/PASS if required).',
      );
    } else {
      try {
        await sendRunNotification({ ...mail, onlyOnFailure: false }, stats);
        emailSent = true;
      } catch (e) {
        errors.push(`Email error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  if (channel === 'teams' || channel === 'both') {
    const teams = teamsConfigFromEnv();
    if (!teams.webhookUrl) {
      errors.push('Teams skipped: set TEAMS_WEBHOOK_URL (Incoming Webhook URL from channel).');
    } else {
      try {
        await sendTeamsRunNotification({ ...teams, onlyOnFailure: false }, stats, reportPath);
        teamsSent = true;
      } catch (e) {
        errors.push(`Teams error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  if (errors.length && !emailSent && !teamsSent) {
    return {
      channel,
      emailSent,
      teamsSent,
      skippedReason: errors.join(' '),
    };
  }

  return { channel, emailSent, teamsSent, skippedReason: errors.length ? errors.join(' ') : undefined };
}
