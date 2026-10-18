import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { configMissingResponse } from "@/lib/profitAdmin/apiHelpers";
import {
  clientIp,
  createSessionToken,
  csrfCookieOptions,
  generateCsrfToken,
  readBaylaAdminConfig,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/profitAdmin/auth";
import { BAYLA_ADMIN_COOKIE_CSRF, BAYLA_ADMIN_COOKIE_SESSION } from "@/lib/profitAdmin/constants";
import { isLoginRateLimited, recordLoginAttempt } from "@/lib/profitAdmin/rateLimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const config = readBaylaAdminConfig();
  if (!config) return configMissingResponse();

  const ip = clientIp(request);
  if (isLoginRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const ok = verifyAdminPassword(config, String(body.password ?? ""));
  recordLoginAttempt(ip, ok);
  if (!ok) return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(BAYLA_ADMIN_COOKIE_SESSION, createSessionToken(config), sessionCookieOptions(config.sessionMaxAgeSec));
  res.cookies.set(BAYLA_ADMIN_COOKIE_CSRF, generateCsrfToken(), csrfCookieOptions(config.sessionMaxAgeSec));
  return res;
}
