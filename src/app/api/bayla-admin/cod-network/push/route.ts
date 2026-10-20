import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  canManualRetryCodNetworkPush,
  pushCodOrderToNetwork,
} from "@/lib/codNetwork/pushCodOrder";
import { requireAdminMutation } from "@/lib/profitAdmin/apiHelpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = requireAdminMutation(request);
  if (denied) return denied;

  let orderId = "";
  try {
    const body = (await request.json()) as Record<string, unknown>;
    orderId = String(body.orderId ?? "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!orderId) {
    return NextResponse.json({ ok: false, error: "missing_order_id" }, { status: 400 });
  }

  if (!canManualRetryCodNetworkPush(orderId)) {
    return NextResponse.json({ ok: false, error: "not_retryable" }, { status: 409 });
  }

  const result = await pushCodOrderToNetwork(orderId, { manual: true });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, retryable: result.retryable },
      { status: 502 },
    );
  }
  if (result.skipped) {
    return NextResponse.json({ ok: true, skipped: true, reason: result.reason });
  }
  return NextResponse.json({ ok: true, leadId: result.leadId });
}
