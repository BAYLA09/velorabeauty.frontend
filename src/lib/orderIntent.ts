import type { BundleQuantity, PaymentMethod } from "@/config/pricing";

export function parseQuantity(value: string | undefined): BundleQuantity {
  if (value === "1" || value === "2" || value === "3") {
    return Number(value) as BundleQuantity;
  }
  return 1;
}

export function orderChoiceHref(productSlug: string | undefined, quantity: BundleQuantity): string {
  const params = new URLSearchParams({ qty: String(quantity) });
  if (productSlug) params.set("product", productSlug);
  return `/order?${params.toString()}`;
}

export function orderPayHref(
  method: PaymentMethod,
  productSlug: string | undefined,
  quantity: BundleQuantity,
): string {
  const params = new URLSearchParams({ qty: String(quantity) });
  if (productSlug) params.set("product", productSlug);
  return `/order/${method}?${params.toString()}`;
}

export const quantityLabels: Record<BundleQuantity, string> = {
  1: "منتج واحد",
  2: "منتجان",
  3: "المجموعة الكاملة",
};
