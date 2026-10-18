import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminMutation } from "@/lib/redirectkiller/apiHelpers";
import {
  REDIRECTKILLER_COOKIE_CSRF,
  REDIRECTKILLER_COOKIE_SESSION,
} from "@/lib/redirectkiller/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = requireAdminMutation(request);
  if (denied) return denied;

  const res = NextResponse.json({ ok: true });
  res.cookies.set(REDIRECTKILLER_COOKIE_SESSION, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(REDIRECTKILLER_COOKIE_CSRF, "", { path: "/", maxAge: 0 });
  return res;
}
