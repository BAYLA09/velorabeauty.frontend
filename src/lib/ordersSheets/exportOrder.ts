import type { CartLine } from "@/lib/cart/cartTypes";
import {
  buildOrdersSheetRow,
  type OrdersSheetChannel,
} from "@/lib/ordersSheets/buildSheetRow";
import type { OrderRecord } from "@/lib/ordersRepository";
import {
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

async function postRowToWebhook(
  url: string,
  secret: string,
  channel: OrdersSheetChannel,
  values: (string | number)[],
): Promise<boolean> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, channel, values }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[orders-sheets] webhook failed", {
      channel,
      status: res.status,
      body: text.slice(0, 200),
    });
    return false;
  }
  return true;
}

/**
 * COD → sheet on place. Card → sheet only when status is paid (after Stripe).
 * Failures are logged; checkout is never blocked.
 */
export async function exportOrderToGoogleSheets(input: {
  order: OrderRecord;
  channel: OrdersSheetChannel;
  cartLines?: CartLine[] | null;
}): Promise<void> {
  const config = readOrdersSheetsConfig();
  if (!config.enabled || !config.webhookSecret) return;

  if (wasOrderSheetExported(input.order.id, input.channel)) return;

  const url = webhookForChannel(config, input.channel);
  if (!url) return;

  if (input.channel === "card" && input.order.status !== "paid") return;
  if (input.channel === "cod" && input.order.paymentMethod !== "cod") return;

  const lines =
    input.cartLines ?? getOrderCartLines(input.order.id);
  const values = buildOrdersSheetRow(input.order, lines);
  try {
    const ok = await postRowToWebhook(url, config.webhookSecret, input.channel, values);
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

/** Fire-and-forget wrapper for API routes. */
export function queueOrderSheetExport(input: {
  order: OrderRecord;
  channel: OrdersSheetChannel;
  cartLines?: CartLine[] | null;
}): void {
  void exportOrderToGoogleSheets(input);
}

export function queueOrderSheetExportById(input: {
  orderId: string;
  channel: OrdersSheetChannel;
  cartLines?: CartLine[] | null;
}): void {
  void exportOrderToGoogleSheetsById(input);
}
