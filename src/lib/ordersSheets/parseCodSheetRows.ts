import { COD_ORDERS_SHEET_HEADERS } from "@/lib/ordersSheets/codSheetColumns";
import { parseCodSheetOrderDateToIso } from "@/lib/ordersSheets/parseSheetOrderDate";
import type { OrdersSheetChannel } from "@/lib/ordersSheets/buildSheetRow";
import {
  extractOrderIdFromNotes,
  mapCardSheetStatusLabel,
  mapSheetStatusLabel,
  type CanonicalCodStatus,
} from "@/lib/ordersSheets/sheetStatusMapping";

export type ParsedSheetOrder = {
  orderId: string | null;
  orderDateIso: string | null;
  status: CanonicalCodStatus | string | null;
  customerName: string;
  phone: string;
  address: string;
  sku: string;
  productName: string;
  quantity: number;
  priceAed: number;
  notes: string;
  rowIndex: number;
};

function headerIndex(headers: string[], names: string[]): number {
  const normalized = headers.map((h) => h.trim().toLowerCase());
  for (const name of names) {
    const idx = normalized.indexOf(name.toLowerCase());
    if (idx >= 0) return idx;
  }
  return -1;
}

function cell(row: string[], index: number): string {
  if (index < 0 || index >= row.length) return "";
  return String(row[index] ?? "").trim();
}

function detectStatusColumn(headers: string[]): number {
  const statusNames = [
    "status",
    "order status",
    "statut",
    "حالة",
    "حالة الطلب",
    "order_status",
  ];
  return headerIndex(headers, statusNames);
}

export function normalizeCodSheetHeaders(headers: string[]): string[] {
  if (headers.length >= COD_ORDERS_SHEET_HEADERS.length) return headers;
  return [...headers];
}

/** Collapse multi-line SKU rows into one logical order (first row wins for status). */
export function groupParsedSheetOrders(rows: ParsedSheetOrder[]): ParsedSheetOrder[] {
  const byKey = new Map<string, ParsedSheetOrder>();
  for (const row of rows) {
    const key =
      row.orderId ??
      `row:${row.phone}:${row.orderDateIso ?? ""}:${row.customerName}:${row.rowIndex}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, row);
      continue;
    }
    if (!existing.status && row.status) {
      byKey.set(key, { ...existing, status: row.status });
    }
  }
  return [...byKey.values()];
}

function resolveStatus(
  channel: OrdersSheetChannel,
  statusRaw: string | null,
  notes: string,
): ParsedSheetOrder["status"] {
  const fromNotesRaw = notes.includes("status=")
    ? notes.split("status=")[1]?.split(/[;\n]/)[0]
    : null;
  if (channel === "card") {
    return mapCardSheetStatusLabel(statusRaw) ?? mapCardSheetStatusLabel(fromNotesRaw);
  }
  return mapSheetStatusLabel(statusRaw) ?? mapSheetStatusLabel(fromNotesRaw);
}

export function parseOrderSheetGrid(
  headers: string[],
  rows: string[][],
  channel: OrdersSheetChannel,
): ParsedSheetOrder[] {
  const orderDateIdx = headerIndex(headers, ["orderdate", "order date"]);
  const nameIdx = headerIndex(headers, ["name"]);
  const phoneIdx = headerIndex(headers, ["phone"]);
  const addressIdx = headerIndex(headers, ["address"]);
  const skuIdx = headerIndex(headers, ["sku"]);
  const productIdx = headerIndex(headers, ["product"]);
  const qtyIdx = headerIndex(headers, ["quantity", "qty"]);
  const priceIdx = headerIndex(headers, ["price"]);
  const notesIdx = headerIndex(headers, ["notes"]);
  const statusIdx = detectStatusColumn(headers);

  const parsed: ParsedSheetOrder[] = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.every((c) => !String(c ?? "").trim())) continue;

    const notes = cell(row, notesIdx);
    const orderDateRaw = cell(row, orderDateIdx);
    const orderDateIso = parseCodSheetOrderDateToIso(orderDateRaw);
    const statusRaw = statusIdx >= 0 ? cell(row, statusIdx) : null;
    parsed.push({
      orderId: extractOrderIdFromNotes(notes),
      orderDateIso,
      status: resolveStatus(channel, statusRaw, notes),
      customerName: cell(row, nameIdx),
      phone: cell(row, phoneIdx),
      address: cell(row, addressIdx),
      sku: cell(row, skuIdx),
      productName: cell(row, productIdx),
      quantity: Math.max(1, Math.min(3, Number.parseInt(cell(row, qtyIdx), 10) || 1)) as
        | 1
        | 2
        | 3,
      priceAed: Math.max(0, Math.round(Number.parseFloat(cell(row, priceIdx)) || 0)),
      notes,
      rowIndex: i + 2,
    });
  }

  return groupParsedSheetOrders(parsed);
}

/** @deprecated Use parseOrderSheetGrid(..., "cod"). */
export function parseCodSheetGrid(headers: string[], rows: string[][]): ParsedSheetOrder[] {
  return parseOrderSheetGrid(headers, rows, "cod");
}

export type ParsedCodSheetOrder = ParsedSheetOrder;
