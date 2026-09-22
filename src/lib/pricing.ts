export type BundleQuantity = 1 | 2 | 3;

export type PaymentMethod = "card" | "cod";

/** Card — no extra fees (AED) */
export const CARD_PRICES: Record<BundleQuantity, number> = {
  1: 199,
  2: 249,
  3: 339,
};

/** COD — includes +20 AED shipping/COD fee (AED) */
export const COD_FEE_AED = 20;

export const COD_PRICES: Record<BundleQuantity, number> = {
  1: 219,
  2: 269,
  3: 359,
};

export function getTotalAed(
  quantity: BundleQuantity,
  method: PaymentMethod,
): number {
  return method === "card" ? CARD_PRICES[quantity] : COD_PRICES[quantity];
}

export function formatAed(amount: number): string {
  return `${amount} AED`;
}

export const BUNDLE_OPTIONS: BundleQuantity[] = [1, 2, 3];

export const PAYMENT_METHOD_COPY = {
  card: {
    titleAr: "الدفع بالبطاقة",
    titleEn: "Card payment",
    subtitleAr: "بدون رسوم إضافية",
    subtitleEn: "No additional fees",
  },
  cod: {
    titleAr: "الدفع عند الاستلام",
    titleEn: "Cash on delivery",
    subtitleAr: `+${COD_FEE_AED} AED رسوم الشحن`,
    subtitleEn: `+${COD_FEE_AED} AED shipping fee`,
  },
} as const;
