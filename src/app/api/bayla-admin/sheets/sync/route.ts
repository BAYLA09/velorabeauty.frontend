import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";

export const runtime = "nodejs";

/** Sheet inbound sync removed — statuses come from COD Network webhooks. Outbound export unchanged. */
export async function POST(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;

  return NextResponse.json(
    {
      ok: false,
      error: "sheet_inbound_sync_disabled",
      message:
        "Inbound Google Sheet status sync is disabled. Configure COD Network webhooks (see docs/COD-NETWORK-WEBHOOKS.md).",
    },
    { status: 410 },
  );
}
