import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  BAYLA_ADMIN_COOKIE_CSRF,
  BAYLA_ADMIN_COOKIE_SESSION,
  BAYLA_ADMIN_CSRF_HEADER,
} from "@/lib/profitAdmin/constants";

const SESSION_VERSION = 1;

export type BaylaAdminConfig = {
  password: string;
  sessionSecret: string;
  sessionMaxAgeSec: number;
};

export function readBaylaAdminConfig(): BaylaAdminConfig | null {
  const password = process.env.BAYLA_ADMIN_PASSWORD?.trim();
  const sessionSecret = process.env.BAYLA_ADMIN_SESSION_SECRET?.trim();
  if (!password || !sessionSecret || sessionSecret.length < 16) return null;
  const maxAgeRaw = process.env.BAYLA_ADMIN_SESSION_MAX_AGE_SECONDS?.trim();
  const parsed = maxAgeRaw ? Number.parseInt(maxAgeRaw, 10) : 86_400;
  const sessionMaxAgeSec =
    Number.isFinite(parsed) && parsed >= 900 && parsed <= 60 * 60 * 24 * 14 ? parsed : 86_400;
  return { password, sessionSecret, sessionMaxAgeSec };
}

export function verifyAdminPassword(config: BaylaAdminConfig, attempt: string): boolean {
  const a = Buffer.from(config.password, "utf8");
  const b = Buffer.from(attempt, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type SessionPayload = { v: number; exp: number; iat: number };

function signPayload(secret: string, payloadB64: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

function encodeSession(secret: string, payload: SessionPayload): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadB64}.${signPayload(secret, payloadB64)}`;
}

function decodeSession(secret: string, token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;
  const expected = signPayload(secret, payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as SessionPayload;
    if (parsed.v !== SESSION_VERSION) return null;
    if (parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createSessionToken(config: BaylaAdminConfig): string {
  const now = Math.floor(Date.now() / 1000);
  return encodeSession(config.sessionSecret, { v: SESSION_VERSION, iat: now, exp: now + config.sessionMaxAgeSec });
}

export function parseSessionToken(config: BaylaAdminConfig, token: string | undefined): boolean {
  if (!token) return false;
  return decodeSession(config.sessionSecret, token) !== null;
}

export function generateCsrfToken(): string {
  return randomBytes(24).toString("base64url");
}

export function sessionCookieOptions(maxAgeSec: number) {
  const secure = process.env.NODE_ENV === "production";
  return { httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: maxAgeSec };
}

export function csrfCookieOptions(maxAgeSec: number) {
  const secure = process.env.NODE_ENV === "production";
  return { httpOnly: false, secure, sameSite: "strict" as const, path: "/", maxAge: maxAgeSec };
}

export function getSessionFromRequest(request: NextRequest): boolean {
  const config = readBaylaAdminConfig();
  if (!config) return false;
  return parseSessionToken(config, request.cookies.get(BAYLA_ADMIN_COOKIE_SESSION)?.value);
}

export function verifyCsrf(request: NextRequest): boolean {
  const header = request.headers.get(BAYLA_ADMIN_CSRF_HEADER)?.trim();
  const cookie = request.cookies.get(BAYLA_ADMIN_COOKIE_CSRF)?.value?.trim();
  if (!header || !cookie) return false;
  const a = Buffer.from(header, "utf8");
  const b = Buffer.from(cookie, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
