/** Default unit economics (USD) — server config, not customer-facing. */
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
    paymentFeePercent: 4.9,
    stripePercent: 5.4,
    stripeFixedUsd: 0.3,
    shippingDeliveredUsd: 5.99,
    otherFeesUsd: 0,
  },
  cod: {
    platformFeePercent: 5,
    shippingDeliveredUsd: 4.5,
    shippingReturnUsd: 3,
    codFeesPerOrderUsd: 2.5,
    otherFeesPerOrderUsd: 1,
    /** Used when no COD orders in range to estimate unit economics */
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
    paymentFeePercent: number;
    stripePercent: number;
    stripeFixedUsd: number;
    shippingDeliveredUsd: number;
    otherFeesUsd: number;
  };
  cod: {
    platformFeePercent: number;
    shippingDeliveredUsd: number;
    shippingReturnUsd: number;
    codFeesPerOrderUsd: number;
    otherFeesPerOrderUsd: number;
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
  const sellingDefault = parseEnvNumber(
    "BAYLA_COD_SELLING_PRICE_USD",
    base.cod.defaultSellingPricePerOrderUsd,
  );
  return {
    currency: "USD",
    aedPerUsd: parseEnvNumber("BAYLA_AED_PER_USD", base.aedPerUsd),
    products: {
      eyeSerum: parseEnvNumber("BAYLA_PRODUCT_COST_EYE_USD", base.products.eyeSerum),
      skinGummies: parseEnvNumber("BAYLA_PRODUCT_COST_SKIN_USD", base.products.skinGummies),
      hairGummies: parseEnvNumber("BAYLA_PRODUCT_COST_HAIR_USD", base.products.hairGummies),
    },
    payment: {
      paymentFeePercent: parseEnvNumber("BAYLA_PAYMENT_FEE_PERCENT", base.payment.paymentFeePercent),
      stripePercent: parseEnvNumber("BAYLA_STRIPE_FEE_PERCENT", base.payment.stripePercent),
      stripeFixedUsd: parseEnvNumber("BAYLA_STRIPE_FEE_FIXED_USD", base.payment.stripeFixedUsd),
      shippingDeliveredUsd: parseEnvNumber(
        "BAYLA_CARD_SHIPPING_USD",
        base.payment.shippingDeliveredUsd,
      ),
      otherFeesUsd: parseEnvNumber("BAYLA_PAYMENT_OTHER_FEES_USD", base.payment.otherFeesUsd),
    },
    cod: {
      platformFeePercent: parseEnvNumber("BAYLA_COD_PLATFORM_FEE_PERCENT", base.cod.platformFeePercent),
      shippingDeliveredUsd: parseEnvNumber("BAYLA_COD_SHIPPING_USD", base.cod.shippingDeliveredUsd),
      shippingReturnUsd: parseEnvNumber("BAYLA_COD_RETURN_COST_USD", base.cod.shippingReturnUsd),
      codFeesPerOrderUsd: parseEnvNumber("BAYLA_COD_FEE_PER_ORDER_USD", base.cod.codFeesPerOrderUsd),
      otherFeesPerOrderUsd: parseEnvNumber(
        "BAYLA_COD_OTHER_FEE_PER_ORDER_USD",
        base.cod.otherFeesPerOrderUsd,
      ),
      defaultSellingPricePerOrderUsd: sellingDefault,
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
