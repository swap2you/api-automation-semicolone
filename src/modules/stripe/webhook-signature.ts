import crypto from 'node:crypto';

/** Minimal Stripe webhook signing (v1) for synthetic fixtures — see Stripe webhook docs. */
export function signStripeWebhookPayload(secret: string, payload: string, timestampSec: number): string {
  const signed = `${timestampSec}.${payload}`;
  const hmac = crypto.createHmac('sha256', secret);
  const v1 = hmac.update(signed, 'utf8').digest('hex');
  return `t=${timestampSec},v1=${v1}`;
}

export function verifyStripeV1Signature(opts: {
  secret: string;
  payload: string;
  header: string;
  toleranceSec?: number;
}): boolean {
  const now = Math.floor(Date.now() / 1000);
  const parts = Object.fromEntries(
    opts.header.split(',').map((p) => {
      const [k, v] = p.split('=');
      return [k, v];
    }),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;
  const ts = Number(parts.t);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(now - ts) > (opts.toleranceSec ?? 300)) return false;
  const expected = crypto
    .createHmac('sha256', opts.secret)
    .update(`${parts.t}.${opts.payload}`, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(parts.v1, 'hex'), Buffer.from(expected, 'hex'));
}
