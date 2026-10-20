import { randomUUID } from "node:crypto";
import type { BundleQuantity } from "@/config/pricing";
import type { OrdersSheetChannel } from "@/lib/ordersSheets/buildSheetRow";
import { fetchOrderSheetGrids } from "@/lib/ordersSheets/fetchOrderSheetGrids";
import { parseOrderSheetGrid, type ParsedSheetOrder } from "@/lib/ordersSheets/parseCodSheetRows";
import { parseNotesField } from "@/lib/ordersSheets/sheetStatusMapping";
import { listOrderSheetTargetsStatic } from "@/lib/ordersSheets/sheetTargets";
import {
  isOrderEligibleForSheetSync,
  isSheetRowEligibleForSync,
  readOrdersSheetsSyncCutoffIso,
} from "@/lib/ordersSheets/syncCutoff";
import {
  createCardOrderFromSheet,
  createCodOrderFromSheet,
  getOrderById,
  updateCardOrderStatusFromSheet,
  updateCodOrderStatusFromSheet,
} from "@/lib/ordersRepository";
import { getStoreProductBySlug } from "@/lib/productCatalog";
import { resolveProductSlugFromSheetSku } from "@/config/warmTeeProduct";

export type ChannelSyncStats = {
  rowsRead: number;
  ordersParsed: number;
  skippedBeforeCutoff: number;
  statusUpdated: number;
  statusSkipped: number;
  imported: number;
  importSkipped: number;
};

export type SheetSyncStats = {
  cutoffIso: string;
  sheets: ReturnType<typeof listOrderSheetTargetsStatic>;
  cod: ChannelSyncStats;
  card: ChannelSyncStats;
  errors: string[];
};

export type SheetSyncResult =
  | { ok: true; source: "google_api" | "apps_script"; stats: SheetSyncStats }
  | { ok: false; error: string; stats?: SheetSyncStats };

function emptyChannelStats(): ChannelSyncStats {
  return {
    rowsRead: 0,
    ordersParsed: 0,
    skippedBeforeCutoff: 0,
    statusUpdated: 0,
    statusSkipped: 0,
    imported: 0,
    importSkipped: 0,
  };
}

function resolveEmirate(notes: string): string {
  return parseNotesField(notes, "emirate")?.trim() || "Dubai";
}

function resolveCreatedAt(orderDateIso: string | null): string {
  return orderDateIso ?? new Date().toISOString();
}

function importSheetOnlyOrder(
  channel: OrdersSheetChannel,
  row: ParsedSheetOrder,
  stats: ChannelSyncStats,
  errors: string[],
): void {
  if (!row.phone || !row.customerName) {
    stats.importSkipped += 1;
    return;
  }

  const newId = row.orderId ?? randomUUID();
  if (getOrderById(newId)) {
    stats.importSkipped += 1;
    return;
  }

  const slug = resolveProductSlugFromSheetSku(row.sku.trim() || "vitaminamin");
  const product = getStoreProductBySlug(slug);
  const subtotalAed = row.priceAed > 0 ? row.priceAed : 0;
  const totalAed = subtotalAed > 0 ? subtotalAed : 199;
  const status =
    channel === "card"
      ? (row.status ?? "delivered")
      : (row.status ?? "pending");

  const payload = {
    id: newId,
    productSlug: slug,
    productName: row.productName || product?.name || slug,
    quantity: row.quantity as BundleQuantity,
    customerName: row.customerName,
    phone: row.phone,
    address: row.address || "—",
    emirate: resolveEmirate(row.notes),
    totalAed,
    subtotalAed: subtotalAed || totalAed,
    status: String(status),
    createdAt: resolveCreatedAt(row.orderDateIso),
  };

  try {
    if (channel === "card") {
      createCardOrderFromSheet(payload);
    } else {
      createCodOrderFromSheet(payload);
    }
    stats.imported += 1;
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "import_failed");
    stats.importSkipped += 1;
  }
}

function syncChannelRows(
  channel: OrdersSheetChannel,
  rows: ParsedSheetOrder[],
  cutoffIso: string,
  stats: ChannelSyncStats,
  errors: string[],
): void {
  for (const row of rows) {
    if (!isSheetRowEligibleForSync(row.orderDateIso, cutoffIso)) {
      stats.skippedBeforeCutoff += 1;
      continue;
    }

    const orderId = row.orderId;
    if (orderId) {
      const existing = getOrderById(orderId);
      if (existing) {
        if (!isOrderEligibleForSheetSync(existing.createdAt, cutoffIso)) {
          stats.skippedBeforeCutoff += 1;
          continue;
        }
        if (existing.paymentMethod !== channel) {
          stats.statusSkipped += 1;
          continue;
        }
        if (!row.status) {
          stats.statusSkipped += 1;
          continue;
        }
        const result =
          channel === "card"
            ? updateCardOrderStatusFromSheet(orderId, String(row.status))
            : updateCodOrderStatusFromSheet(orderId, String(row.status));
        if (result.updated) stats.statusUpdated += 1;
        else stats.statusSkipped += 1;
        continue;
      }
    }

    importSheetOnlyOrder(channel, row, stats, errors);
  }
}

export async function syncOrdersFromGoogleSheets(): Promise<SheetSyncResult> {
  const cutoffIso = readOrdersSheetsSyncCutoffIso();
  const stats: SheetSyncStats = {
    cutoffIso,
    sheets: listOrderSheetTargetsStatic(),
    cod: emptyChannelStats(),
    card: emptyChannelStats(),
    errors: [],
  };

  const fetched = await fetchOrderSheetGrids();
  if (!fetched.ok) {
    return { ok: false, error: fetched.error, stats };
  }

  const codParsed = parseOrderSheetGrid(
    fetched.data.cod.headers,
    fetched.data.cod.rows,
    "cod",
  );
  const cardParsed = parseOrderSheetGrid(
    fetched.data.card.headers,
    fetched.data.card.rows,
    "card",
  );

  stats.cod.rowsRead = fetched.data.cod.rows.length;
  stats.cod.ordersParsed = codParsed.length;
  stats.card.rowsRead = fetched.data.card.rows.length;
  stats.card.ordersParsed = cardParsed.length;

  syncChannelRows("cod", codParsed, cutoffIso, stats.cod, stats.errors);
  syncChannelRows("card", cardParsed, cutoffIso, stats.card, stats.errors);

  return { ok: true, source: fetched.data.source, stats };
}

/** @deprecated Use syncOrdersFromGoogleSheets */
export async function syncCodOrdersFromGoogleSheet(): Promise<SheetSyncResult> {
  return syncOrdersFromGoogleSheets();
}
