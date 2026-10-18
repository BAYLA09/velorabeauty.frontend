import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminMutation } from "@/lib/profitAdmin/apiHelpers";
import { BAYLA_ADMIN_COOKIE_CSRF, BAYLA_ADMIN_COOKIE_SESSION } from "@/lib/profitAdmin/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = requireAdminMutation(request);
  if (denied) return denied;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BAYLA_ADMIN_COOKIE_SESSION, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(BAYLA_ADMIN_COOKIE_CSRF, "", { path: "/", maxAge: 0 });
  return res;
}
