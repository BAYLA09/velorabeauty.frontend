import type { OrdersSheetChannel } from "@/lib/ordersSheets/buildSheetRow";
import {
  postToAppsScriptWebhook,
  readOrdersSheetsConfig,
  readOrdersSheetsExportStatus,
} from "@/lib/ordersSheets/exportOrder";
import {
  readCardSheetGridViaGoogleSheetsApi,
  readCodSheetGridViaGoogleSheetsApi,
  type OrderSheetGrid,
} from "@/lib/ordersSheets/googleSheetsDirect";

export type FetchedOrderSheets = {
  source: "google_api" | "apps_script";
  cod: OrderSheetGrid;
  card: OrderSheetGrid;
};

export type FetchOrderSheetsResult =
  | { ok: true; data: FetchedOrderSheets }
  | { ok: false; error: string };

type ReadAction = "readCodOrders" | "readCardOrders";

async function fetchViaAppsScript(channel: OrdersSheetChannel): Promise<OrderSheetGrid | null> {
  const config = readOrdersSheetsConfig();
  const url = channel === "card" ? config.cardWebhookUrl : config.codWebhookUrl;
  if (!config.enabled || !url || !config.webhookSecret) return null;

  const action: ReadAction = channel === "card" ? "readCardOrders" : "readCodOrders";
  const result = await postToAppsScriptWebhook(url, {
    secret: config.webhookSecret,
    channel,
    action,
  });

  if (!result.ok) return null;
  try {
    const parsed = JSON.parse(result.body) as {
      headers?: string[];
      rows?: (string | number)[][];
    };
    if (!parsed.headers || !parsed.rows) return null;
    return {
      headers: parsed.headers.map((h) => String(h)),
      rows: parsed.rows.map((row) => row.map((c) => String(c ?? ""))),
    };
  } catch {
    return null;
  }
}

const EMPTY_GRID: OrderSheetGrid = { headers: [], rows: [] };

export async function fetchOrderSheetGrids(): Promise<FetchOrderSheetsResult> {
  const status = readOrdersSheetsExportStatus();
  if (!status.enabled) {
    return { ok: false, error: status.webhook.reason ?? "orders_sheets_not_configured" };
  }

  if (status.direct.enabled) {
    const cod = (await readCodSheetGridViaGoogleSheetsApi(status.direct)) ?? EMPTY_GRID;
    const card = (await readCardSheetGridViaGoogleSheetsApi(status.direct)) ?? EMPTY_GRID;
    if (cod.headers.length > 0 || card.headers.length > 0 || cod.rows.length || card.rows.length) {
      return { ok: true, data: { source: "google_api", cod, card } };
    }
  }

  const cod = (await fetchViaAppsScript("cod")) ?? EMPTY_GRID;
  const card = (await fetchViaAppsScript("card")) ?? EMPTY_GRID;
  if (cod.headers.length === 0 && card.headers.length === 0 && !cod.rows.length && !card.rows.length) {
    return { ok: false, error: "order_sheets_read_failed" };
  }

  return { ok: true, data: { source: "apps_script", cod, card } };
}
