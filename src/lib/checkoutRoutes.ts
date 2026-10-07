import type { BundleQuantity, PaymentMethod } from "@/config/pricing";

export type CheckoutQuery = {
  product: string;
  quantity: BundleQuantity;
};

export function parseCheckoutQuantity(raw: string | null | undefined): BundleQuantity | null {
  if (raw === "1" || raw === "2" || raw === "3") return Number(raw) as BundleQuantity;
  return null;
}

export function buildCheckoutPath(
  method: PaymentMethod,
  { product, quantity }: CheckoutQuery,
): string {
  const params = new URLSearchParams({
    product,
    quantity: String(quantity),
  });
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
  if (preferredMethod) {
    params.set("method", preferredMethod);
  }
  return `/checkout?${params.toString()}`;
}
