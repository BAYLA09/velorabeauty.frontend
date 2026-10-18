import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionFromRequest,
  readRedirectKillerConfig,
  verifyCsrf,
} from "@/lib/redirectkiller/auth";

export function configMissingResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "redirectkiller_not_configured",
      message: "Set REDIRECTKILLER_ADMIN_PASSWORD and REDIRECTKILLER_SESSION_SECRET in Easypanel.",
    },
    { status: 503 },
  );
}

export function unauthorizedResponse() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export function requireAdminSession(request: NextRequest): NextResponse | null {
  const config = readRedirectKillerConfig();
  if (!config) return configMissingResponse();
  if (!getSessionFromRequest(request)) return unauthorizedResponse();
  return null;
}

export function requireAdminMutation(request: NextRequest): NextResponse | null {
  const base = requireAdminSession(request);
  if (base) return base;
  if (!verifyCsrf(request)) {
    return NextResponse.json({ ok: false, error: "csrf_invalid" }, { status: 403 });
  }
  return null;
}
