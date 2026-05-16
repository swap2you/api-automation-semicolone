import type { SummaryStats } from '../reporters/github-step-summary.js';
import { defaultJsonReportPath } from '../reporters/github-step-summary.js';
import { mailConfigFromEnv, sendRunNotification } from './email.js';
import { shouldSendEmail, shouldSendTeams } from './notify-policy.js';
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
 * Sends post-run notifications. Teams uses live test-results.json (see build-run-report.ts).
 * Email: NOTIFY_ONLY_ON_FAILURE (default). Teams: TEAMS_NOTIFY_ALWAYS (default true).
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

  const sendEmail = shouldSendEmail(stats);
  const sendTeamsFlag = shouldSendTeams(stats);

  if (!sendEmail && !sendTeamsFlag) {
    return {
      channel,
      emailSent: false,
      teamsSent: false,
      skippedReason:
        'No failures — email skipped (NOTIFY_ONLY_ON_FAILURE). Teams skipped (TEAMS_NOTIFY_ALWAYS=false).',
    };
  }

  let emailSent = false;
  let teamsSent = false;
  const errors: string[] = [];
  const notes: string[] = [];

  if ((channel === 'email' || channel === 'both') && sendEmail) {
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
  } else if (channel === 'email' || channel === 'both') {
    notes.push('Email skipped (NOTIFY_ONLY_ON_FAILURE, no failures).');
  }

  if ((channel === 'teams' || channel === 'both') && sendTeamsFlag) {
    const teams = teamsConfigFromEnv();
    if (!teams.webhookUrl) {
      errors.push('Teams skipped: set TEAMS_WEBHOOK_URL in .env');
    } else {
      try {
        await sendTeamsRunNotification(teams, stats, reportPath);
        teamsSent = true;
      } catch (e) {
        errors.push(`Teams error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } else if (channel === 'teams' || channel === 'both') {
    notes.push('Teams skipped (TEAMS_NOTIFY_ALWAYS=false and no failures).');
  }

  const skippedReason = [...notes, ...errors].filter(Boolean).join(' ') || undefined;

  if (errors.length && !emailSent && !teamsSent) {
    return { channel, emailSent, teamsSent, skippedReason };
  }

  return { channel, emailSent, teamsSent, skippedReason };
}
