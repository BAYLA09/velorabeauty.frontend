import { timingSafeEqual } from "node:crypto";

export function readCodNetworkWebhookSecret(): string | null {
  const s = process.env.COD_NETWORK_WEBHOOK_SECRET?.trim();
  return s || null;
}

export function verifyCodNetworkWebhookSecret(headerValue: string | null): boolean {
  const expected = readCodNetworkWebhookSecret();
  if (!expected || !headerValue) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(headerValue.trim(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
