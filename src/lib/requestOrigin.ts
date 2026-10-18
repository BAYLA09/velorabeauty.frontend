import type { NextRequest } from "next/server";
import { getSiteUrl, sanitizePublicSiteUrl } from "@/lib/siteUrl";

/** Hostnames that are valid bind addresses but must not appear in browser redirect URLs. */
const INVALID_BROWSER_HOSTS = new Set(["0.0.0.0", "::", "[::]"]);

const LOCAL_DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

function forwardedProto(request: NextRequest): string {
  const raw = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (raw === "http" || raw === "https") return `${raw}:`;
  return request.nextUrl.protocol || "http:";
}

export function portForPublicRedirect(host: string, protocol: string, port: string): string {
  if (!port) return "";
  if (protocol === "https:" && port === "443") return "";
  if (protocol === "http:" && port === "80") return "";
  const h = host.toLowerCase();
  if (LOCAL_DEV_HOSTS.has(h)) return `:${port}`;
  // Easypanel / reverse proxy: app listens on 3000 but public URL has no port
  if (port === "3000") return "";
  return `:${port}`;
}

/** Pure resolver — used by getRedirectOrigin and unit tests (no Next.js import). */
export function resolveRedirectOrigin(input: {
  hostHeader: string | null;
  urlHostname: string;
  port: string;
  protocol: string;
  urlOrigin: string;
  siteOrigin: string | null;
}): string {
  const { hostHeader, urlHostname, port, protocol, urlOrigin, siteOrigin } = input;

  if (hostHeader && !INVALID_BROWSER_HOSTS.has(hostHeader.toLowerCase())) {
    if (siteOrigin) {
      try {
        const siteHost = new URL(siteOrigin).hostname.toLowerCase();
        if (hostHeader.toLowerCase() === siteHost) {
          return siteOrigin;
        }
      } catch {
        /* fall through */
      }
    }
    const portSuffix = portForPublicRedirect(hostHeader, protocol, port);
    return `${protocol}//${hostHeader}${portSuffix}`;
  }

  if (urlHostname && !INVALID_BROWSER_HOSTS.has(urlHostname.toLowerCase())) {
    if (LOCAL_DEV_HOSTS.has(urlHostname.toLowerCase())) {
      return urlOrigin;
    }
    const portSuffix = portForPublicRedirect(urlHostname, protocol, port);
    return `${protocol}//${urlHostname}${portSuffix}`;
  }

  return siteOrigin ?? "http://localhost:3000";
}

/**
 * Origin for building redirect Location headers from an incoming request.
 * Falls back to SITE_URL / localhost when the request host is not browser-safe.
 */
export function getRedirectOrigin(request: NextRequest): string {
  const hostHeader = request.headers.get("host")?.split(":")[0]?.trim();
  const port = request.nextUrl.port;
  const protocol = forwardedProto(request);

  const siteOrigin =
    sanitizePublicSiteUrl(process.env.SITE_URL) ||
    sanitizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    sanitizePublicSiteUrl(getSiteUrl());

  return resolveRedirectOrigin({
    hostHeader: hostHeader ?? null,
    urlHostname: request.nextUrl.hostname,
    port,
    protocol,
    urlOrigin: request.nextUrl.origin,
    siteOrigin,
  });
}
