export type BundleQuantity = 1 | 2 | 3;

export type PaymentMethod = "card" | "cod";

export const currencyLabel = "د.إ";

export const singleProductPrice = 199;

export const cardBundlePrices: Record<BundleQuantity, number> = {
  1: 199,
  2: 249,
  3: 339,
};

export const codFee = 20;

export const codBundlePrices: Record<BundleQuantity, number> = {
  1: 219,
  2: 269,
  3: 359,
};

export function formatPrice(amount: number): string {
  return `${amount} ${currencyLabel}`;
}

export function getCheckoutTotal(
  quantity: BundleQuantity,
  method: PaymentMethod,
): number {
  return method === "card" ? cardBundlePrices[quantity] : codBundlePrices[quantity];
}

export const bundleQuantities: BundleQuantity[] = [1, 2, 3];
