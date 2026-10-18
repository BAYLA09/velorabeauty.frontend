import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  clientIp,
  cookieOptions,
  createSessionToken,
  csrfCookieOptions,
  generateCsrfToken,
  readRedirectKillerConfig,
  verifyAdminPassword,
} from "@/lib/redirectkiller/auth";
import {
  REDIRECTKILLER_COOKIE_CSRF,
  REDIRECTKILLER_COOKIE_SESSION,
} from "@/lib/redirectkiller/constants";
import { isLoginRateLimited, recordLoginAttempt } from "@/lib/redirectkiller/rateLimit";
import { configMissingResponse } from "@/lib/redirectkiller/apiHelpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const config = readRedirectKillerConfig();
  if (!config) return configMissingResponse();

  const ip = clientIp(request);
  if (isLoginRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "Too many failed attempts. Try again later." },
      { status: 429 },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const password = String(body.password ?? "");
  const ok = verifyAdminPassword(config, password);
  recordLoginAttempt(ip, ok);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const token = createSessionToken(config);
  const csrf = generateCsrfToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(REDIRECTKILLER_COOKIE_SESSION, token, cookieOptions(config.sessionMaxAgeSec));
  res.cookies.set(REDIRECTKILLER_COOKIE_CSRF, csrf, csrfCookieOptions(config.sessionMaxAgeSec));
  return res;
}
