import type { CartLine } from "@/lib/cart/cartTypes";
import { normalizeCartLines } from "@/lib/cart/cartPricing";
import type { OrderRecord } from "@/lib/ordersRepository";
import { getProductBySlug } from "@/lib/productCatalog";

export type OrdersSheetChannel = "cod" | "card";

/** Column order must match `scripts/google-sheets/VeloraOrdersWebhook.gs` HEADER row. */
export function formatProductsColumn(lines: CartLine[] | null, fallbackName: string): string {
  if (!lines || lines.length === 0) return fallbackName;
  return normalizeCartLines(lines)
    .map((line) => {
      const name = getProductBySlug(line.slug)?.name ?? line.slug;
      return line.quantity > 1 ? `${name} ×${line.quantity}` : name;
    })
    .join(" · ");
}

export function buildOrdersSheetRow(
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
