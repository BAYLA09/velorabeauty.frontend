import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import type { CartLine } from "@/lib/cart/cartTypes";
import type { OrderRecord } from "@/lib/ordersRepository";

/** In-stock SKUs (USD COGS per unit). */
export function unitProductCostUsd(slug: string, fees: FeeConfig): number {
  const s = slug.toLowerCase();
  if (s.includes("eye") || s.includes("vitaminamin")) return fees.products.eyeSerum;
  if (s.includes("skin") || s.includes("whitamin")) return fees.products.skinGummies;
  if (s.includes("hair")) return fees.products.hairGummies;
  if (s.includes("stripe-test")) return 0;
  return fees.products.skinGummies;
}

export function linesForOrder(order: OrderRecord): CartLine[] {
  if (order.cartLines.length > 0) return order.cartLines;
  return [{ slug: order.productSlug, quantity: order.quantity }];
}

export function orderProductCostUsd(order: OrderRecord, fees: FeeConfig): number {
  return linesForOrder(order).reduce(
    (sum, line) => sum + unitProductCostUsd(line.slug, fees) * line.quantity,
    0,
  );
}

export function isExcludedTestOrder(order: OrderRecord): boolean {
  const slug = order.productSlug.toLowerCase();
  return slug.includes("stripe-test") || slug.includes("velora-stripe-test");
}
