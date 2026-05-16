import type { SummaryStats } from '../reporters/github-step-summary.js';

/** Email respects NOTIFY_ONLY_ON_FAILURE (default: only when tests failed). */
export function shouldSendEmail(stats: SummaryStats): boolean {
  if (process.env.NOTIFY_ONLY_ON_FAILURE === 'false') return true;
  return stats.failed > 0;
}

/**
 * Teams: notify after every completed run by default (TEAMS_NOTIFY_ALWAYS=true).
 * Set TEAMS_NOTIFY_ALWAYS=false to align with NOTIFY_ONLY_ON_FAILURE.
 */
export function shouldSendTeams(stats: SummaryStats): boolean {
  const teamsAlways = process.env.TEAMS_NOTIFY_ALWAYS !== 'false';
  if (teamsAlways) return true;
  return shouldSendEmail(stats);
}
