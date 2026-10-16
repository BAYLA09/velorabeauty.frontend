import { NextResponse } from "next/server";
import {
  appsScriptProbeHint,
  probeAppsScriptWebhook,
} from "@/lib/ordersSheets/probeAppsScriptWebhook";
import {
  exportCardRowsViaAppsScriptWebhook,
  readOrdersSheetsExportStatus,
} from "@/lib/ordersSheets/exportOrder";
import {
  countCardOrdersAwaitingPaymentWithPi,
  countCardOrdersPaidNotExported,
  getOrderAttribution,
  getOrderCartLines,
  listRecentCardOrdersForDiagnostics,
  listOrdersPendingCardSheetExport,
} from "@/lib/ordersRepository";

export const runtime = "nodejs";

function authorize(secret: string | null): boolean {
  const expected = process.env.ORDERS_SHEETS_WEBHOOK_SECRET?.trim();
  return Boolean(expected && secret === expected);
}

/** `?secret=…` — card sheet pipeline health (no PII). Optional `&probe=1` dry-run webhook. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const secret = params.get("secret")?.trim() ?? null;
  if (!authorize(secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const status = readOrdersSheetsExportStatus();
  const pendingExport = listOrdersPendingCardSheetExport(10);
  const recent = listRecentCardOrdersForDiagnostics(12);

  const payload: Record<string, unknown> = {
    ok: true,
    mode: status.mode,
    counts: {
      paidNotExported: countCardOrdersPaidNotExported(),
      awaitingPaymentWithPaymentIntent: countCardOrdersAwaitingPaymentWithPi(),
      pendingExportQueue: pendingExport.length,
    },
    recentCardOrders: recent.map((o) => ({
      id: o.id,
      status: o.status,
      createdAt: o.createdAt,
      exported: Boolean(o.sheetCardExportedAt),
      lastError: o.sheetCardExportLastError,
      lastAttemptAt: o.sheetCardExportLastAttemptAt,
      hasPaymentIntent: Boolean(o.stripePaymentIntentId),
    })),
    hint:
      countCardOrdersAwaitingPaymentWithPi() > 0
        ? "Card orders stuck awaiting_payment — confirm path was not called after Payment Element; deploy fix + replay via reconcile?channel=card&run=1 after marking paid."
        : undefined,
  };

  const cardUrl = status.webhook.cardWebhookUrl ?? status.webhook.codWebhookUrl;
  const webhookSecret = status.webhook.webhookSecret;
  if (status.mode === "apps_script" && cardUrl && webhookSecret) {
    const probe = await probeAppsScriptWebhook(cardUrl, webhookSecret, "card");
    payload.cardWebhookProbe = probe;
    payload.cardWebhookHint = appsScriptProbeHint(probe);
  }

  if (params.get("probe") === "1" && pendingExport[0] && status.webhook.webhookSecret) {
    const order = pendingExport[0];
    const lines = getOrderCartLines(order.id);
    const attribution = getOrderAttribution(order.id);
    payload.liveExportProbe = await exportCardRowsViaAppsScriptWebhook({
      config: status.webhook,
      orderId: order.id,
      order,
      lines,
      attribution,
    });
  }

  return NextResponse.json(payload);
}
