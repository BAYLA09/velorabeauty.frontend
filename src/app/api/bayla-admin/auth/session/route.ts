import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { configMissingResponse } from "@/lib/profitAdmin/apiHelpers";
import { getSessionFromRequest, readBaylaAdminConfig } from "@/lib/profitAdmin/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!readBaylaAdminConfig()) return configMissingResponse();
  return NextResponse.json({ ok: true, authenticated: getSessionFromRequest(request) });
}
