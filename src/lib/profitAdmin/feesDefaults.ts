/** Default unit economics (USD) — editable in dashboard, not customer-facing. */
export const DEFAULT_FEE_CONFIG = {
  currency: "USD" as const,
  products: {
    eyeSerum: 3,
    skinGummies: 7.47,
    hairGummies: 6.1,
  },
  payment: {
    stripePercent: 5.4,
    stripeFixedUsd: 0.3,
    shippingDeliveredUsd: 5.99,
  },
  cod: {
    platformFeePercent: 5,
    callCenterNoAnswerUsd: 0.5,
    callCenterDeclinedUsd: 1,
    callCenterDeliveredUsd: 2,
    shippingDeliveredUsd: 5.99,
    shippingReturnUsd: 4.99,
  },
} as const;

export type FeeConfig = {
  currency: "USD";
  products: {
    eyeSerum: number;
    skinGummies: number;
    hairGummies: number;
  };
  payment: {
    stripePercent: number;
    stripeFixedUsd: number;
    shippingDeliveredUsd: number;
  };
  cod: {
    platformFeePercent: number;
    callCenterNoAnswerUsd: number;
    callCenterDeclinedUsd: number;
    callCenterDeliveredUsd: number;
    shippingDeliveredUsd: number;
    shippingReturnUsd: number;
  };
};

export function mergeFeeConfig(partial?: Partial<FeeConfig> | null): FeeConfig {
  if (!partial) return structuredClone(DEFAULT_FEE_CONFIG) as FeeConfig;
  return {
    currency: "USD",
    products: { ...DEFAULT_FEE_CONFIG.products, ...partial.products },
    payment: { ...DEFAULT_FEE_CONFIG.payment, ...partial.payment },
    cod: { ...DEFAULT_FEE_CONFIG.cod, ...partial.cod },
  };
}
