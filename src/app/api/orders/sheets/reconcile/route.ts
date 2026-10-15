import { NextResponse } from "next/server";
import {
  appsScriptProbeHint,
  probeAppsScriptWebhook,
} from "@/lib/ordersSheets/probeAppsScriptWebhook";
import {
  exportOrderToGoogleSheets,
  readOrdersSheetsExportStatus,
} from "@/lib/ordersSheets/exportOrder";
import {
  listOrdersPendingCodSheetExport,
  wasOrderSheetExported,
} from "@/lib/ordersRepository";

export const runtime = "nodejs";

/** Browser-friendly: probe webhook + optional replay (`?secret=…&run=1`). */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const secret = params.get("secret")?.trim();
  const status = readOrdersSheetsExportStatus();
  const expected = status.webhook.webhookSecret;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const pending = listOrdersPendingCodSheetExport(200);
  const payload: Record<string, unknown> = {
    ok: true,
    mode: status.mode,
    pendingCount: pending.length,
    useWww: "https://www.velorabeauty.world (not velorabeauty.world without www)",
  };

  const codUrl = status.webhook.codWebhookUrl;
  if (status.mode === "apps_script" && codUrl && expected) {
    const probe = await probeAppsScriptWebhook(codUrl, expected);
    payload.webhookProbe = probe;
    payload.webhookOk = probe.get.ok && probe.post.ok;
    payload.hint = appsScriptProbeHint(probe);
  } else if (status.mode === "google_api") {
    payload.webhookOk = status.direct.enabled;
    payload.hint = status.direct.enabled
      ? "Direct Google Sheets API enabled — POST reconcile or add ?run=1"
      : status.direct.reason;
  } else {
    payload.webhookOk = false;
    payload.hint = status.webhook.reason ?? status.direct.reason ?? "orders_sheets_not_configured";
  }

  if (params.get("run") === "1") {
    if (!status.enabled) {
      return NextResponse.json({ ...payload, ok: false, error: "orders_sheets_not_configured" }, {
        status: 503,
      });
    }
    const limit = Number.parseInt(params.get("limit") ?? "30", 10);
    const batch = listOrdersPendingCodSheetExport(Number.isFinite(limit) ? limit : 30);
    let exported = 0;
    let failed = 0;
    for (const order of batch) {
      await exportOrderToGoogleSheets({ order, channel: "cod" });
      if (wasOrderSheetExported(order.id, "cod")) exported += 1;
      else failed += 1;
    }
    payload.reconcile = {
      attempted: batch.length,
      exported,
      failed,
      stillPending: listOrdersPendingCodSheetExport(200).length,
    };
    payload.ok = failed === 0 && Boolean(payload.webhookOk);
  }

  return NextResponse.json(payload);
}

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
