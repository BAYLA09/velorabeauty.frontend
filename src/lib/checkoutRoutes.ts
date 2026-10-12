import type { BundleQuantity, PaymentMethod } from "@/config/pricing";

export type CheckoutQuery = {
  product: string;
  quantity: BundleQuantity;
  items?: string;
};

export function parseCheckoutQuantity(raw: string | null | undefined): BundleQuantity | null {
  if (raw === "1" || raw === "2" || raw === "3") return Number(raw) as BundleQuantity;
  return null;
}

export function buildCheckoutPath(method: PaymentMethod, query: CheckoutQuery): string {
  const params = new URLSearchParams({
    product: query.product,
    quantity: String(query.quantity),
  });
  if (query.items) params.set("items", query.items);
  return `/checkout/${method}?${params.toString()}`;
}

/** Step 2 — اختيار طريقة الدفع (Lara-style) */
export function buildCheckoutPaymentStepPath(
  query: CheckoutQuery,
  preferredMethod?: PaymentMethod,
): string {
  const params = new URLSearchParams({
    product: query.product,
    quantity: String(query.quantity),
  });
  if (query.items) params.set("items", query.items);
  if (preferredMethod) {
    params.set("method", preferredMethod);
  }
  return `/checkout?${params.toString()}`;
}

export function buildCartCheckoutPath(itemsParam: string, preferredMethod?: PaymentMethod): string {
  const params = new URLSearchParams({ items: itemsParam });
  if (preferredMethod) params.set("method", preferredMethod);
  return `/checkout?${params.toString()}`;
}
