import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest, readRedirectKillerConfig } from "@/lib/redirectkiller/auth";
import { configMissingResponse } from "@/lib/redirectkiller/apiHelpers";
import { listAllowedInternalPaths } from "@/lib/redirectkiller/constants";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const config = readRedirectKillerConfig();
  if (!config) return configMissingResponse();
  const authenticated = getSessionFromRequest(request);
  return NextResponse.json({
    ok: true,
    authenticated,
    destinations: listAllowedInternalPaths(),
  });
}
