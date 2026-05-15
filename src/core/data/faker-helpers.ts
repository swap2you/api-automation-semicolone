/** Thin helpers — avoids extra deps for hackathon scope */

export function randomEmail(local = 'api-auto'): string {
  return `${local}+${Date.now()}@example.com`;
}

export function randomName(prefix = 'Cust'): string {
  return `${prefix} ${Math.random().toString(36).slice(2, 8)}`;
}
