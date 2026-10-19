/** Default unit economics (USD) — server config, not customer-facing. */
export const DEFAULT_FEE_CONFIG = {
  currency: "USD" as const,
  aedPerUsd: 3.6725,
  products: {
    /** SKU vitaminamin — Eye serum with vitamin E */
    eyeSerum: 3,
    /** SKU WHITEAMIN — skin gummies */
    skinGummies: 7.47,
    hairGummies: 6.1,
  },
  payment: {
    stripePercent: 5.4,
    stripeFixedUsd: 0.3,
    shippingPerOrderUsd: 5.99,
  },
  cod: {
    serviceFeePercent: 5,
    callCenterNoAnswerUsd: 0.5,
    callCenterReturnedUsd: 1,
    callCenterDeliveredUsd: 2,
    shippingDeliveredUsd: 5.99,
    shippingReturnedUsd: 4.99,
    defaultSellingPricePerOrderUsd: 35,
    defaultProductCostPerOrderUsd: 12,
  },
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
    stripePercent: number;
    stripeFixedUsd: number;
    shippingPerOrderUsd: number;
  };
  cod: {
    serviceFeePercent: number;
    callCenterNoAnswerUsd: number;
    callCenterReturnedUsd: number;
    callCenterDeliveredUsd: number;
    shippingDeliveredUsd: number;
    shippingReturnedUsd: number;
    defaultSellingPricePerOrderUsd: number;
    defaultProductCostPerOrderUsd: number;
  };
};

function parseEnvNumber(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Load fee config from env (Easypanel). Called per request — not persisted in SQLite. */
export function readFeeConfigFromEnv(): FeeConfig {
  const base = structuredClone(DEFAULT_FEE_CONFIG) as FeeConfig;
  return {
    currency: "USD",
    aedPerUsd: parseEnvNumber("BAYLA_AED_PER_USD", base.aedPerUsd),
    products: {
      eyeSerum: parseEnvNumber("BAYLA_PRODUCT_COST_EYE_USD", base.products.eyeSerum),
      skinGummies: parseEnvNumber("BAYLA_PRODUCT_COST_SKIN_USD", base.products.skinGummies),
      hairGummies: parseEnvNumber("BAYLA_PRODUCT_COST_HAIR_USD", base.products.hairGummies),
    },
    payment: {
      stripePercent: parseEnvNumber("BAYLA_STRIPE_FEE_PERCENT", base.payment.stripePercent),
      stripeFixedUsd: parseEnvNumber("BAYLA_STRIPE_FEE_FIXED_USD", base.payment.stripeFixedUsd),
      shippingPerOrderUsd: parseEnvNumber(
        "BAYLA_CARD_SHIPPING_USD",
        base.payment.shippingPerOrderUsd,
      ),
    },
    cod: {
      serviceFeePercent: parseEnvNumber(
        "BAYLA_COD_SERVICE_FEE_PERCENT",
        base.cod.serviceFeePercent,
      ),
      callCenterNoAnswerUsd: parseEnvNumber(
        "BAYLA_COD_CALL_NO_ANSWER_USD",
        base.cod.callCenterNoAnswerUsd,
      ),
      callCenterReturnedUsd: parseEnvNumber(
        "BAYLA_COD_CALL_RETURNED_USD",
        base.cod.callCenterReturnedUsd,
      ),
      callCenterDeliveredUsd: parseEnvNumber(
        "BAYLA_COD_CALL_DELIVERED_USD",
        base.cod.callCenterDeliveredUsd,
      ),
      shippingDeliveredUsd: parseEnvNumber("BAYLA_COD_SHIPPING_DELIVERED_USD", base.cod.shippingDeliveredUsd),
      shippingReturnedUsd: parseEnvNumber("BAYLA_COD_SHIPPING_RETURNED_USD", base.cod.shippingReturnedUsd),
      defaultSellingPricePerOrderUsd: parseEnvNumber(
        "BAYLA_COD_SELLING_PRICE_USD",
        base.cod.defaultSellingPricePerOrderUsd,
      ),
      defaultProductCostPerOrderUsd: parseEnvNumber(
        "BAYLA_COD_PRODUCT_COST_USD",
        base.cod.defaultProductCostPerOrderUsd,
      ),
    },
  };
}

/** @deprecated Only for merging legacy persisted fee blobs — ignored on save. */
export function mergeFeeConfig(partial?: Partial<FeeConfig> | null): FeeConfig {
  if (!partial) return readFeeConfigFromEnv();
  const env = readFeeConfigFromEnv();
  return {
    ...env,
    aedPerUsd: partial.aedPerUsd ?? env.aedPerUsd,
    products: { ...env.products, ...partial.products },
    payment: { ...env.payment, ...partial.payment },
    cod: { ...env.cod, ...partial.cod },
  };
}
