import type { NextRequest } from "next/server";
import { sanitizePublicSiteUrl } from "@/lib/siteUrl";

/** Hostnames that are valid bind addresses but must not appear in browser redirect URLs. */
const INVALID_BROWSER_HOSTS = new Set(["0.0.0.0", "::", "[::]"]);

/**
 * Origin for building redirect Location headers from an incoming request.
 * Falls back to SITE_URL / localhost when the request host is not browser-safe.
 */
export function getRedirectOrigin(request: NextRequest): string {
  const hostHeader = request.headers.get("host")?.split(":")[0]?.trim();
  const port = request.nextUrl.port;
  const protocol = request.nextUrl.protocol || "http:";

  if (hostHeader && !INVALID_BROWSER_HOSTS.has(hostHeader.toLowerCase())) {
    const portSuffix = port ? `:${port}` : "";
    return `${protocol}//${hostHeader}${portSuffix}`;
  }

  const fromUrlHost = request.nextUrl.hostname;
  if (fromUrlHost && !INVALID_BROWSER_HOSTS.has(fromUrlHost.toLowerCase())) {
    return request.nextUrl.origin;
  }

  const fromEnv =
    sanitizePublicSiteUrl(process.env.SITE_URL) ||
    sanitizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return fromEnv ?? "http://localhost:3000";
}
