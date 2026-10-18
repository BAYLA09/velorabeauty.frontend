import { after } from "next/server";
import type { CartLine } from "@/lib/cart/cartTypes";
import { isAppsScriptWebhookSuccess } from "@/lib/ordersSheets/webhookResponse";
import {
  buildCardSheetRows,
  buildCodSheetRows,
  type OrdersSheetChannel,
} from "@/lib/ordersSheets/buildSheetRow";
import {
  CARD_ORDERS_SHEET_COLUMN_COUNT,
  VELORA_CARD_SHEET_GID,
  VELORA_CARD_SPREADSHEET_ID,
} from "@/lib/ordersSheets/cardSheetColumns";
import { COD_ORDERS_SHEET_COLUMN_COUNT } from "@/lib/ordersSheets/codSheetColumns";
import {
  appendCodRowsViaGoogleSheetsApi,
  readGoogleSheetsDirectConfig,
} from "@/lib/ordersSheets/googleSheetsDirect";
import type { OrderRecord } from "@/lib/ordersRepository";
import {
  getOrderAttribution,
  getOrderById,
  getOrderCartLines,
  markOrderSheetExported,
  recordCardSheetExportAttempt,
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
  /** Same /exec URL is fine when Apps Script routes cod vs card by `channel` + CARD_SHEET_GID. */
  const card =
    process.env.ORDERS_SHEETS_CARD_WEBHOOK_URL?.trim() || shared || cod;
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

export function readOrdersSheetsExportStatus(): {
  enabled: boolean;
  mode: "google_api" | "apps_script" | "off";
  direct: ReturnType<typeof readGoogleSheetsDirectConfig>;
  webhook: OrdersSheetsConfig;
} {
  const direct = readGoogleSheetsDirectConfig();
  const webhook = readOrdersSheetsConfig();
  const webhookReady = webhook.enabled && Boolean(webhook.webhookSecret);
  return {
    enabled: direct.enabled || webhookReady,
    mode: direct.enabled ? "google_api" : webhookReady ? "apps_script" : "off",
    direct,
    webhook,
  };
}

function webhookForChannel(config: OrdersSheetsConfig, channel: OrdersSheetChannel): string | null {
  return channel === "cod" ? config.codWebhookUrl : config.cardWebhookUrl;
}

type RowsWebhookPayload = {
  secret: string;
  channel: OrdersSheetChannel;
  orderId: string;
  rows: (string | number)[][];
  spreadsheetId?: string;
  sheetGid?: string;
};

export type AppsScriptWebhookPostResult = {
  ok: boolean;
  status: number;
  body: string;
  bodyPreview: string;
  parsedError?: string;
};

type LegacyWebhookPayload = {
  secret: string;
  channel: OrdersSheetChannel;
  values: (string | number)[];
};

type ReadOrderSheetWebhookPayload = {
  secret: string;
  channel: OrdersSheetChannel;
  action: "readCodOrders" | "readCardOrders";
};

export type AppsScriptWebhookPayload =
  | RowsWebhookPayload
  | LegacyWebhookPayload
  | ReadOrderSheetWebhookPayload;

import { normalizeAppsScriptWebhookUrl } from "@/lib/ordersSheets/probeAppsScriptWebhook";

function parseWebhookError(text: string): string | undefined {
  try {
    const parsed = JSON.parse(text) as { error?: string };
    return parsed.error?.trim() || undefined;
  } catch {
    return undefined;
  }
}

export async function postToAppsScriptWebhook(
  url: string,
  payload: AppsScriptWebhookPayload,
): Promise<AppsScriptWebhookPostResult> {
  const target = normalizeAppsScriptWebhookUrl(url);
  const res = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  let text = await res.text().catch(() => "");
  let finalRes = res;

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    if (location?.includes("script.googleusercontent.com")) {
      const follow = await fetch(location, {
        method: "GET",
        signal: AbortSignal.timeout(15_000),
      });
      text = await follow.text().catch(() => "");
      finalRes = follow;
    }
  }
  const ok = isAppsScriptWebhookSuccess(finalRes, text);
  const parsedError = parseWebhookError(text);
  if (!ok) {
    console.error("[orders-sheets] webhook failed", {
      channel: payload.channel,
      status: finalRes.status,
      error: parsedError,
      preview: text.slice(0, 200),
    });
  }
  return {
    ok,
    status: finalRes.status,
    body: text,
    bodyPreview: text.slice(0, 200),
    parsedError,
  };
}

export async function exportCardRowsViaAppsScriptWebhook(input: {
  config: OrdersSheetsConfig;
  orderId: string;
  order: OrderRecord;
  lines: CartLine[] | null;
  attribution: ReturnType<typeof getOrderAttribution>;
}): Promise<{ ok: boolean; lastError?: string; strategy?: string }> {
  const url = webhookForChannel(input.config, "card");
  if (!url || !input.config.webhookSecret) {
    return { ok: false, lastError: "missing_card_webhook_url" };
  }

  const base = {
    secret: input.config.webhookSecret,
    channel: "card" as const,
    orderId: input.orderId,
    spreadsheetId: VELORA_CARD_SPREADSHEET_ID,
    sheetGid: String(VELORA_CARD_SHEET_GID),
  };

  const attempts: { strategy: string; rows: (string | number)[][] }[] = [
    {
      strategy: "card-18-with-target",
      rows: buildCardSheetRows(input.order, input.lines, input.attribution),
    },
    {
      strategy: "cod-17-with-target",
      rows: buildCodSheetRows(input.order, input.lines, input.attribution),
    },
  ];

  let lastError = "no_rows";
  for (const attempt of attempts) {
    if (attempt.rows.length === 0) continue;
    const result = await postToAppsScriptWebhook(url, { ...base, rows: attempt.rows });
    if (result.ok) {
      return { ok: true, strategy: attempt.strategy };
    }
    lastError = `${attempt.strategy}:${result.parsedError ?? result.bodyPreview}`;
  }
  return { ok: false, lastError };
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
  const status = readOrdersSheetsExportStatus();
  const config = status.webhook;
  const direct = status.direct;
  const webhookReady = config.enabled && Boolean(config.webhookSecret);

  if (!status.enabled) {
    console.warn("[orders-sheets] export skipped (config)", {
      orderId: input.order.id,
      channel: input.channel,
      mode: status.mode,
      directReason: direct.reason,
      webhookReason: config.reason ?? "disabled",
      codUrlConfigured: Boolean(config.codWebhookUrl),
      secretConfigured: Boolean(config.webhookSecret),
    });
    return;
  }

  if (wasOrderSheetExported(input.order.id, input.channel)) return;

  if (input.channel === "card" && input.order.status !== "paid") {
    console.warn("[orders-sheets] card export skipped (order not paid)", {
      orderId: input.order.id,
      status: input.order.status,
    });
    return;
  }
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
      if (direct.enabled) {
        ok = await appendCodRowsViaGoogleSheetsApi(direct, rows);
      } else if (webhookReady) {
        const url = webhookForChannel(config, "cod");
        if (!url) return;
        const codPost = await postToAppsScriptWebhook(url, {
          secret: config.webhookSecret!,
          channel: "cod",
          orderId: input.order.id,
          rows,
        });
        ok = codPost.ok;
      } else {
        return;
      }
    } else {
      recordCardSheetExportAttempt(input.order.id, null);
      const rows = buildCardSheetRows(input.order, lines, attribution);
      if (rows.length === 0) return;
      for (const row of rows) {
        if (row.length !== CARD_ORDERS_SHEET_COLUMN_COUNT) {
          console.error("[orders-sheets] invalid card row width", {
            orderId: input.order.id,
            width: row.length,
          });
          recordCardSheetExportAttempt(input.order.id, "invalid_card_row_width");
          return;
        }
      }
      if (direct.enabled) {
        ok = await appendCodRowsViaGoogleSheetsApi(direct, rows, "card");
        if (!ok) recordCardSheetExportAttempt(input.order.id, "google_api_append_failed");
      } else if (webhookReady) {
        const cardResult = await exportCardRowsViaAppsScriptWebhook({
          config,
          orderId: input.order.id,
          order: input.order,
          lines,
          attribution,
        });
        ok = cardResult.ok;
        if (!ok) {
          recordCardSheetExportAttempt(input.order.id, cardResult.lastError ?? "webhook_failed");
        }
      } else {
        return;
      }
    }
    if (ok) markOrderSheetExported(input.order.id, input.channel);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[orders-sheets] export error", {
      orderId: input.order.id,
      channel: input.channel,
      error: message,
    });
    if (input.channel === "card") {
      recordCardSheetExportAttempt(input.order.id, message);
    }
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

/** Run sheet export in-process (Stripe webhook / confirm — do not rely on `after()`). */
export async function exportPaidCardOrderToGoogleSheetsById(orderId: string): Promise<void> {
  await exportOrderToGoogleSheetsById({ orderId, channel: "card" });
}

function scheduleOrderSheetExport(task: () => Promise<void>): void {
  after(task);
}
