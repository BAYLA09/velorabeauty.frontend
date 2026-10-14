import { NextResponse } from "next/server";
import { exportOrderToGoogleSheets, readOrdersSheetsConfig } from "@/lib/ordersSheets/exportOrder";
import {
  listOrdersPendingCodSheetExport,
  wasOrderSheetExported,
} from "@/lib/ordersRepository";

export const runtime = "nodejs";

/** Replay COD rows to Google Sheets (orders missing sheet_cod_exported_at). */
export async function POST(request: Request) {
  const config = readOrdersSheetsConfig();
  if (!config.enabled || !config.webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "orders_sheets_not_configured", reason: config.reason },
      { status: 503 },
    );
  }

  let body: { secret?: string; limit?: number } = {};
  try {
    body = (await request.json()) as { secret?: string; limit?: number };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.secret?.trim() !== config.webhookSecret) {
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
