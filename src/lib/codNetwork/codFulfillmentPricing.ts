import type { CartLine } from "@/lib/cart/cartTypes";
import { getMerchandiseAedForLineQuantity } from "@/config/pricing";
import type { OrderRecord } from "@/lib/ordersRepository";

function normalizeCartLines(raw: CartLine[]): CartLine[] {
  const merged = new Map<string, number>();
  for (const line of raw) {
    const slug = line.slug.trim();
    if (!slug || line.quantity < 1) continue;
    merged.set(slug, (merged.get(slug) ?? 0) + line.quantity);
  }
  return [...merged.entries()].map(([slug, quantity]) => ({ slug, quantity }));
}

export type CodFulfillmentLine = {
  slug: string;
  quantity: number;
  merchandiseAed: number;
};

export function lineItemsForCodFulfillment(
  order: OrderRecord,
  lines: CartLine[] | null,
): CodFulfillmentLine[] {
  const normalized =
    lines && lines.length > 0
      ? normalizeCartLines(lines)
      : [{ slug: order.productSlug, quantity: order.quantity }];
  return normalized.map((line) => ({
    slug: line.slug,
    quantity: line.quantity,
    merchandiseAed:
      getMerchandiseAedForLineQuantity(line.quantity, line.slug) ?? order.subtotalAed,
  }));
}

function merchandiseSum(lines: CodFulfillmentLine[]): number {
  return lines.reduce((sum, line) => sum + line.merchandiseAed, 0);
}

/**
 * Sheet `price` per line: merchandise + entire COD fee on the first line only.
 * Sum of returned values equals `order.totalAed`.
 */
export function allocateCodSheetLinePrices(
  order: OrderRecord,
  cartLines: CartLine[] | null,
): number[] {
  const lines = lineItemsForCodFulfillment(order, cartLines);
  if (lines.length === 0) return [];
  const merch = lines.map((l) => l.merchandiseAed);
  const fee = order.totalAed - merchandiseSum(lines);
  const prices = [...merch];
  prices[0] += fee;
  return prices;
}

/**
 * Integer line totals that include the COD fee, spread across lines (not all on first).
 * Sum equals `order.totalAed`.
 */
export function allocateCodApiLineTotals(
  order: OrderRecord,
  cartLines: CartLine[] | null,
): number[] {
  const lines = lineItemsForCodFulfillment(order, cartLines);
  if (lines.length === 0) return [];
  const merch = lines.map((l) => l.merchandiseAed);
  const sumMerch = merchandiseSum(lines);
  const fee = order.totalAed - sumMerch;

  if (lines.length === 1) {
    return [order.totalAed];
  }

  if (sumMerch <= 0) {
    const each = Math.floor(order.totalAed / lines.length);
    const totals = lines.map(() => each);
    totals[totals.length - 1] += order.totalAed - totals.reduce((a, b) => a + b, 0);
    return totals;
  }

  const rawShares = merch.map((m) => (fee * m) / sumMerch);
  const feeParts = rawShares.map((s) => Math.floor(s));
  const remainder = fee - feeParts.reduce((a, b) => a + b, 0);
  const fractional = rawShares
    .map((s, i) => ({ i, frac: s - Math.floor(s) }))
    .sort((a, b) => b.frac - a.frac);
  for (let r = 0; r < remainder; r += 1) {
    feeParts[fractional[r % fractional.length].i] += 1;
  }

  const totals = merch.map((m, i) => m + feeParts[i]);
  const drift = order.totalAed - totals.reduce((a, b) => a + b, 0);
  if (drift !== 0) {
    totals[totals.length - 1] += drift;
  }
  return totals;
}

export type CodApiLineItem = {
  slug: string;
  quantity: number;
  unitPriceAed: number;
  lineTotalAed: number;
};

/** Unit prices for COD Network API; qty × price sums to `order.totalAed`. */
export function buildCodApiLineItems(
  order: OrderRecord,
  cartLines: CartLine[] | null,
): CodApiLineItem[] {
  const lines = lineItemsForCodFulfillment(order, cartLines);
  const lineTotals = allocateCodApiLineTotals(order, cartLines);
  return lines.map((line, i) => {
    const lineTotalAed = lineTotals[i] ?? line.merchandiseAed;
    const unitPriceAed = lineTotalAed / line.quantity;
    return {
      slug: line.slug,
      quantity: line.quantity,
      unitPriceAed,
      lineTotalAed,
    };
  });
}

export function codLineTotalsSumToOrderTotal(
  order: OrderRecord,
  cartLines: CartLine[] | null,
): boolean {
  const sheet = allocateCodSheetLinePrices(order, cartLines);
  const sheetSum = sheet.reduce((a, b) => a + b, 0);
  const apiLines = buildCodApiLineItems(order, cartLines);
  const apiSum = apiLines.reduce((sum, item) => sum + item.quantity * item.unitPriceAed, 0);
  return sheetSum === order.totalAed && Math.abs(apiSum - order.totalAed) < 0.001;
}
