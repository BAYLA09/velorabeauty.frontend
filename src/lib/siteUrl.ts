/** Canonical site URL for Stripe redirect URLs (no trailing slash). */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (fromEnv) {
    const withProtocol = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
    return withProtocol.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
