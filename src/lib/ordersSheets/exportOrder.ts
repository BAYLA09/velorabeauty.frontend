import { after } from "next/server";
import type { CartLine } from "@/lib/cart/cartTypes";
import { isAppsScriptWebhookSuccess } from "@/lib/ordersSheets/webhookResponse";
import {
  buildCodSheetRows,
  buildLegacyCardSheetRow,
  type OrdersSheetChannel,
} from "@/lib/ordersSheets/buildSheetRow";
import { COD_ORDERS_SHEET_COLUMN_COUNT } from "@/lib/ordersSheets/codSheetColumns";
import type { OrderRecord } from "@/lib/ordersRepository";
import {
  getOrderAttribution,
  getOrderById,
  getOrderCartLines,
  markOrderSheetExported,
  wasOrderSheetExported,
} from "@/lib/ordersRepository";

export type OrdersSheetsConfig = {
  enabled: boolean;
  webhookUrl: string | null;
  webhookSecret: string | null;
  codWebhookUrl: string | null;
  cardWebhookUrl: string | null;
  reason?: string;
};

export function readOrdersSheetsConfig(): OrdersSheetsConfig {
  const shared = process.env.ORDERS_SHEETS_WEBHOOK_URL?.trim() || null;
  const cod = process.env.ORDERS_SHEETS_COD_WEBHOOK_URL?.trim() || shared;
  const card = process.env.ORDERS_SHEETS_CARD_WEBHOOK_URL?.trim() || shared;
  const secret = process.env.ORDERS_SHEETS_WEBHOOK_SECRET?.trim() || null;

  if (!cod && !card) {
    return {
      enabled: false,
      webhookUrl: null,
      webhookSecret: secret,
      codWebhookUrl: null,
      cardWebhookUrl: null,
      reason: "missing_webhook_urls",
    };
  }
  if (!secret) {
    return {
      enabled: false,
      webhookUrl: shared,
      webhookSecret: null,
      codWebhookUrl: cod,
      cardWebhookUrl: card,
      reason: "missing_webhook_secret",
    };
  }

  return {
    enabled: true,
    webhookUrl: shared,
    webhookSecret: secret,
    codWebhookUrl: cod,
    cardWebhookUrl: card,
  };
}

function webhookForChannel(config: OrdersSheetsConfig, channel: OrdersSheetChannel): string | null {
  return channel === "cod" ? config.codWebhookUrl : config.cardWebhookUrl;
}

type CodWebhookPayload = {
  secret: string;
  channel: "cod";
  orderId: string;
  rows: (string | number)[][];
};

type LegacyWebhookPayload = {
  secret: string;
  channel: OrdersSheetChannel;
  values: (string | number)[];
};

async function postToAppsScriptWebhook(
  url: string,
  payload: CodWebhookPayload | LegacyWebhookPayload,
): Promise<boolean> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  const text = await res.text().catch(() => "");
  const ok = isAppsScriptWebhookSuccess(res, text);
  if (!ok) {
    console.error("[orders-sheets] webhook failed", { channel: payload.channel });
  }
  return ok;
}

/**
 * COD → Google Sheet on place. Card → sheet only when status is paid (after Stripe).
 * Failures are logged; checkout is never blocked.
 */
export async function exportOrderToGoogleSheets(input: {
  order: OrderRecord;
  channel: OrdersSheetChannel;
  cartLines?: CartLine[] | null;
}): Promise<void> {
  const config = readOrdersSheetsConfig();
  if (!config.enabled || !config.webhookSecret) {
    console.warn("[orders-sheets] export skipped (config)", {
      orderId: input.order.id,
      channel: input.channel,
      reason: config.reason ?? "disabled",
      codUrlConfigured: Boolean(config.codWebhookUrl),
      secretConfigured: Boolean(config.webhookSecret),
    });
    return;
  }

  if (wasOrderSheetExported(input.order.id, input.channel)) return;

  const url = webhookForChannel(config, input.channel);
  if (!url) return;

  if (input.channel === "card" && input.order.status !== "paid") return;
  if (input.channel === "cod" && input.order.paymentMethod !== "cod") return;

  const lines = input.cartLines ?? getOrderCartLines(input.order.id);
  const attribution = getOrderAttribution(input.order.id);

  try {
    let ok: boolean;
    if (input.channel === "cod") {
      const rows = buildCodSheetRows(input.order, lines, attribution);
      if (rows.length === 0) return;
      for (const row of rows) {
        if (row.length !== COD_ORDERS_SHEET_COLUMN_COUNT) {
          console.error("[orders-sheets] invalid COD row width", {
            orderId: input.order.id,
            width: row.length,
          });
          return;
        }
      }
      ok = await postToAppsScriptWebhook(url, {
        secret: config.webhookSecret,
        channel: "cod",
        orderId: input.order.id,
        rows,
      });
    } else {
      const values = buildLegacyCardSheetRow(input.order, lines);
      ok = await postToAppsScriptWebhook(url, {
        secret: config.webhookSecret,
        channel: "card",
        values,
      });
    }
    if (ok) markOrderSheetExported(input.order.id, input.channel);
  } catch (err) {
    console.error("[orders-sheets] export error", {
      orderId: input.order.id,
      channel: input.channel,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}

export async function exportOrderToGoogleSheetsById(input: {
  orderId: string;
  channel: OrdersSheetChannel;
  cartLines?: CartLine[] | null;
}): Promise<void> {
  const order = getOrderById(input.orderId);
  if (!order) return;
  await exportOrderToGoogleSheets({
    order,
    channel: input.channel,
    cartLines: input.cartLines,
  });
}

/** Schedule export after the HTTP response (Stripe webhooks). COD uses await in /api/orders. */
export function queueOrderSheetExport(input: {
  order: OrderRecord;
  channel: OrdersSheetChannel;
  cartLines?: CartLine[] | null;
}): void {
  scheduleOrderSheetExport(() => exportOrderToGoogleSheets(input));
}

export function queueOrderSheetExportById(input: {
  orderId: string;
  channel: OrdersSheetChannel;
  cartLines?: CartLine[] | null;
}): void {
  scheduleOrderSheetExport(() => exportOrderToGoogleSheetsById(input));
}

function scheduleOrderSheetExport(task: () => Promise<void>): void {
  after(task);
}
