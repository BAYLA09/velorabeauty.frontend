import { NextResponse } from "next/server";
import {
  exportOrderToGoogleSheets,
  readOrdersSheetsExportStatus,
} from "@/lib/ordersSheets/exportOrder";
import {
  listOrdersPendingCodSheetExport,
  wasOrderSheetExported,
} from "@/lib/ordersRepository";

export const runtime = "nodejs";

/** Replay COD rows to Google Sheets (orders missing sheet_cod_exported_at). */
export async function POST(request: Request) {
  const status = readOrdersSheetsExportStatus();
  const secret = status.webhook.webhookSecret;
  if (!status.enabled) {
    return NextResponse.json(
      {
        ok: false,
        error: "orders_sheets_not_configured",
        mode: status.mode,
        directReason: status.direct.reason,
        webhookReason: status.webhook.reason,
      },
      { status: 503 },
    );
  }
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "missing_webhook_secret_for_reconcile_auth" },
      { status: 503 },
    );
  }

  let body: { secret?: string; limit?: number } = {};
  try {
    body = (await request.json()) as { secret?: string; limit?: number };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.secret?.trim() !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const limit = typeof body.limit === "number" ? body.limit : 30;
  const pending = listOrdersPendingCodSheetExport(limit);
  let exported = 0;
  let failed = 0;

  for (const order of pending) {
    await exportOrderToGoogleSheets({ order, channel: "cod" });
    if (wasOrderSheetExported(order.id, "cod")) exported += 1;
    else failed += 1;
  }

  const stillPending = listOrdersPendingCodSheetExport(200).length;

  return NextResponse.json({
    ok: true,
    attempted: pending.length,
    exported,
    failed,
    stillPending,
  });
}
