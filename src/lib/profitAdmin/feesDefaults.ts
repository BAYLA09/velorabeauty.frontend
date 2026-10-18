/** Default unit economics (USD) — editable in dashboard, not customer-facing. */
export const DEFAULT_FEE_CONFIG = {
  currency: "USD" as const,
  aedPerUsd: 3.6725,
  products: {
    /** SKU vitaminamin — Eye serum with vitamin E */
    eyeSerum: 3,
    /** SKU WHITEAMIN — Skin Whitening Gummies */
    skinGummies: 7.47,
    hairGummies: 6.1,
  },
  payment: {
    /** Shown in payment panel (mockup-style % of revenue). */
    paymentFeePercent: 4.9,
    stripePercent: 5.4,
    stripeFixedUsd: 0.3,
    shippingDeliveredUsd: 5.99,
  },
  cod: {
    platformFeePercent: 5,
    shippingDeliveredUsd: 5.99,
    shippingReturnUsd: 4.99,
  },
  adSpendUsd: 0,
} as const;

export type FeeConfig = {
  currency: "USD";
  aedPerUsd: number;
  products: {
    eyeSerum: number;
    skinGummies: number;
    hairGummies: number;
  };
  payment: {
    paymentFeePercent: number;
    stripePercent: number;
    stripeFixedUsd: number;
    shippingDeliveredUsd: number;
  };
  cod: {
    platformFeePercent: number;
    shippingDeliveredUsd: number;
    shippingReturnUsd: number;
  };
  adSpendUsd: number;
};

export function mergeFeeConfig(partial?: Partial<FeeConfig> | null): FeeConfig {
  if (!partial) return structuredClone(DEFAULT_FEE_CONFIG) as FeeConfig;
  const legacy = partial as Partial<FeeConfig> & {
    cod?: Partial<FeeConfig["cod"]> & {
      callCenterNoAnswerUsd?: number;
      callCenterDeclinedUsd?: number;
      callCenterDeliveredUsd?: number;
    };
  };
  return {
    currency: "USD",
    aedPerUsd:
      typeof partial.aedPerUsd === "number" && partial.aedPerUsd > 0
        ? partial.aedPerUsd
        : DEFAULT_FEE_CONFIG.aedPerUsd,
    products: { ...DEFAULT_FEE_CONFIG.products, ...partial.products },
    payment: {
      ...DEFAULT_FEE_CONFIG.payment,
      ...partial.payment,
      paymentFeePercent:
        typeof partial.payment?.paymentFeePercent === "number"
          ? partial.payment.paymentFeePercent
          : DEFAULT_FEE_CONFIG.payment.paymentFeePercent,
    },
    cod: {
      platformFeePercent:
        legacy.cod?.platformFeePercent ?? DEFAULT_FEE_CONFIG.cod.platformFeePercent,
      shippingDeliveredUsd:
        legacy.cod?.shippingDeliveredUsd ?? DEFAULT_FEE_CONFIG.cod.shippingDeliveredUsd,
      shippingReturnUsd:
        legacy.cod?.shippingReturnUsd ?? DEFAULT_FEE_CONFIG.cod.shippingReturnUsd,
    },
    adSpendUsd:
      typeof partial.adSpendUsd === "number" ? partial.adSpendUsd : DEFAULT_FEE_CONFIG.adSpendUsd,
  };
}
