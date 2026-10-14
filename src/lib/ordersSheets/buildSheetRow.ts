import type { CartLine } from "@/lib/cart/cartTypes";
import { normalizeCartLines } from "@/lib/cart/cartPricing";
import { getMerchandiseAedForLineQuantity } from "@/config/pricing";
import type { OrderAttribution } from "@/lib/attribution/orderAttribution";
import type { OrderRecord } from "@/lib/ordersRepository";
import { getProductBySlug } from "@/lib/productCatalog";
import { getSiteUrl } from "@/lib/siteUrl";
import { COD_ORDERS_SHEET_COLUMN_COUNT } from "@/lib/ordersSheets/codSheetColumns";

export type OrdersSheetChannel = "cod" | "card";

function formatOrderDateDubai(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

function lineItemsForOrder(order: OrderRecord, lines: CartLine[] | null): CartLine[] {
  if (lines && lines.length > 0) return normalizeCartLines(lines);
  return [{ slug: order.productSlug, quantity: order.quantity }];
}

function productUrl(slug: string, attribution: OrderAttribution | null): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const path = `/products/${slug}`;
  return attribution?.landingUrl?.includes(slug) ? attribution.landingUrl : `${base}${path}`;
}

function buildNotes(order: OrderRecord): string {
  return [
    `orderId=${order.id}`,
    `payment=${order.paymentMethod}`,
    `emirate=${order.emirate}`,
    `orderTotal=${order.totalAed}`,
    order.deliveryFeeAed ? `delivery=${order.deliveryFeeAed}` : null,
    order.status !== "pending" ? `status=${order.status}` : null,
  ]
    .filter(Boolean)
    .join("; ");
}

/** One sheet row per SKU line — matches COD_ORDERS_SHEET_HEADERS column order. */
export function buildCodSheetRows(
  order: OrderRecord,
  lines: CartLine[] | null,
  attribution: OrderAttribution | null,
): (string | number)[][] {
  const orderDate = formatOrderDateDubai(order.createdAt);
  const country = "AE";
  const currency = "AED";
  const notes = buildNotes(order);
  const utm = attribution ?? {};

  return lineItemsForOrder(order, lines).map((line) => {
    const product = getProductBySlug(line.slug);
    const sku = line.slug;
    const productName = product?.name ?? order.productName;
    const price = getMerchandiseAedForLineQuantity(line.quantity) ?? order.subtotalAed;
    const row: (string | number)[] = [
      orderDate,
      country,
      order.customerName,
      order.phone,
      order.address,
      productUrl(sku, utm),
      sku,
      productName,
      line.quantity,
      price,
      currency,
      notes,
      utm.utm_source ?? "",
      utm.utm_medium ?? "",
      utm.utm_campaign ?? "",
      utm.utm_content ?? "",
      utm.utm_term ?? "",
    ];
    if (row.length !== COD_ORDERS_SHEET_COLUMN_COUNT) {
      throw new Error(`COD sheet row length ${row.length} !== ${COD_ORDERS_SHEET_COLUMN_COUNT}`);
    }
    return row;
  });
}

/** Legacy single-row layout (card sheet / older deployments). */
export function formatProductsColumn(lines: CartLine[] | null, fallbackName: string): string {
  if (!lines || lines.length === 0) return fallbackName;
  return normalizeCartLines(lines)
    .map((line) => {
      const name = getProductBySlug(line.slug)?.name ?? line.slug;
      return line.quantity > 1 ? `${name} ×${line.quantity}` : name;
    })
    .join(" · ");
}

export function buildLegacyCardSheetRow(
  order: OrderRecord,
  lines: CartLine[] | null,
): (string | number)[] {
  const products = formatProductsColumn(lines, order.productName);
  const created = order.createdAt
    ? new Date(order.createdAt).toLocaleString("ar-AE", { timeZone: "Asia/Dubai" })
    : "";

  return [
    created,
    order.id,
    order.customerName,
    order.phone,
    order.emirate,
    order.address,
    order.customerEmail ?? "",
    products,
    order.subtotalAed,
    order.deliveryFeeAed,
    order.totalAed,
    order.status,
    order.paymentMethod === "card" ? (order.stripePaymentIntentId ?? "") : "",
    order.marketingConsent ? "yes" : "no",
  ];
}
