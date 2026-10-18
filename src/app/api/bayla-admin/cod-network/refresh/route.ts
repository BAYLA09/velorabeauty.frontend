import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshStatusesFromCodNetworkApi } from "@/lib/codNetwork/sellerApi";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;

  try {
    const result = await refreshStatusesFromCodNetworkApi();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "refresh_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
