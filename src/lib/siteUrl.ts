const INVALID_BROWSER_HOSTS = new Set(["0.0.0.0", "::", "[::]"]);

function normalizeBrowserHost(host: string): string {
  const h = host.toLowerCase();
  if (INVALID_BROWSER_HOSTS.has(h)) return "localhost";
  return host;
}

export function sanitizePublicSiteUrl(raw: string | undefined | null): string | null {
  if (!raw?.trim()) return null;
  try {
    const withProtocol = raw.trim().startsWith("http") ? raw.trim() : `https://${raw.trim()}`;
    const url = new URL(withProtocol);
    url.hostname = normalizeBrowserHost(url.hostname);
    return url.origin.replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** Canonical site URL for Stripe redirect URLs (no trailing slash). */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  const sanitized = sanitizePublicSiteUrl(fromEnv);
  if (sanitized) return sanitized;
  if (fromEnv) {
    const withProtocol = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
    return withProtocol.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
