import { NextResponse } from "next/server";
import {
  appsScriptProbeHint,
  probeAppsScriptWebhook,
} from "@/lib/ordersSheets/probeAppsScriptWebhook";
import {
  exportOrderToGoogleSheets,
  readOrdersSheetsExportStatus,
} from "@/lib/ordersSheets/exportOrder";
import type { OrdersSheetChannel } from "@/lib/ordersSheets/buildSheetRow";
import {
  listOrdersPendingCardSheetExport,
  listOrdersPendingCodSheetExport,
  wasOrderSheetExported,
} from "@/lib/ordersRepository";

export const runtime = "nodejs";

type ReconcileChannel = OrdersSheetChannel | "both";

function parseReconcileChannel(raw: string | null | undefined): ReconcileChannel {
  const v = raw?.trim().toLowerCase();
  if (v === "card" || v === "both") return v;
  return "cod";
}

async function reconcileChannel(
  channel: OrdersSheetChannel,
  limit: number,
): Promise<{ attempted: number; exported: number; failed: number; stillPending: number }> {
  const pending =
    channel === "cod"
      ? listOrdersPendingCodSheetExport(limit)
      : listOrdersPendingCardSheetExport(limit);
  let exported = 0;
  let failed = 0;
  for (const order of pending) {
    await exportOrderToGoogleSheets({ order, channel });
    if (wasOrderSheetExported(order.id, channel)) exported += 1;
    else failed += 1;
  }
  const stillPending =
    channel === "cod"
      ? listOrdersPendingCodSheetExport(200).length
      : listOrdersPendingCardSheetExport(200).length;
  return { attempted: pending.length, exported, failed, stillPending };
}

/** Browser-friendly: probe webhook + optional replay (`?secret=…&run=1&channel=card`). */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const secret = params.get("secret")?.trim();
  const channel = parseReconcileChannel(params.get("channel"));
  const status = readOrdersSheetsExportStatus();
  const expected = status.webhook.webhookSecret;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const pendingCod = listOrdersPendingCodSheetExport(200);
  const pendingCard = listOrdersPendingCardSheetExport(200);
  const payload: Record<string, unknown> = {
    ok: true,
    mode: status.mode,
    channel,
    pendingCod: pendingCod.length,
    pendingCard: pendingCard.length,
    useWww: "https://www.velorabeauty.world (not velorabeauty.world without www)",
  };

  const probeUrl =
    channel === "card"
      ? status.webhook.cardWebhookUrl ?? status.webhook.codWebhookUrl
      : status.webhook.codWebhookUrl;

  if (status.mode === "apps_script" && probeUrl && expected) {
    const probe = await probeAppsScriptWebhook(probeUrl, expected);
    payload.webhookProbe = probe;
    payload.webhookOk = probe.get.ok && probe.post.ok;
    payload.hint = appsScriptProbeHint(probe);
    if (channel === "card" && !status.webhook.cardWebhookUrl) {
      payload.cardWebhookNote = "Using COD /exec URL; Apps Script needs CARD_SHEET_GID property.";
    }
  } else if (status.mode === "google_api") {
    payload.webhookOk = status.direct.enabled;
    payload.hint = status.direct.enabled
      ? "Direct Google Sheets API — set ORDERS_SHEETS_CARD_SHEET_GID for card tab"
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
    const capped = Number.isFinite(limit) ? limit : 30;
    if (channel === "both") {
      const cod = await reconcileChannel("cod", capped);
      const card = await reconcileChannel("card", capped);
      payload.reconcile = { cod, card };
      payload.ok =
        cod.failed === 0 &&
        card.failed === 0 &&
        Boolean(payload.webhookOk);
    } else {
      const result = await reconcileChannel(channel, capped);
      payload.reconcile = result;
      payload.ok = result.failed === 0 && Boolean(payload.webhookOk);
    }
  }

  return NextResponse.json(payload);
}

/** Replay orders to Google Sheets (`channel`: cod | card | both). */
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

  let body: { secret?: string; limit?: number; channel?: string } = {};
  try {
    body = (await request.json()) as { secret?: string; limit?: number; channel?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.secret?.trim() !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const limit = typeof body.limit === "number" ? body.limit : 30;
  const channel = parseReconcileChannel(body.channel);

  if (channel === "both") {
    const cod = await reconcileChannel("cod", limit);
    const card = await reconcileChannel("card", limit);
    return NextResponse.json({ ok: true, channel, cod, card });
  }

  const result = await reconcileChannel(channel, limit);
  return NextResponse.json({ ok: true, channel, ...result });
}
