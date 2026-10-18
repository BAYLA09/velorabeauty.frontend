import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";

/**
 * Payment (card / Stripe) panel economics — USD.
 * Payment fees = revenue × paymentFeePercent / 100 (editable % in UI).
 */
export type PaymentPanelInput = {
  orderCount: number;
  totalRevenueUsd: number;
  productCostUsd: number;
  shippingCostUsd: number;
  paymentFeePercent: number;
  otherFeesUsd: number;
};

export type PaymentPanelResult = {
  orderCount: number;
  revenueUsd: number;
  productCostUsd: number;
  shippingCostUsd: number;
  paymentFeesUsd: number;
  otherFeesUsd: number;
  profitUsd: number;
  marginPct: number;
};

/**
 * COD panel — per-order unit costs (USD).
 *
 * Delivered orders = totalOrders × (confirmationRate/100) × (deliveryRate/100)
 * Confirmed orders = totalOrders × (confirmationRate/100)
 * Failed after confirm = confirmed − delivered (returns / RTO)
 *
 * COD revenue = delivered × sellingPricePerOrder
 * COD profit = revenue
 *   − delivered × productCostPerOrder
 *   − delivered × shippingCostPerOrder
 *   − delivered × codFeesPerOrder
 *   − failedAfterConfirm × returnCostPerOrder
 *   − totalOrders × otherFeesPerOrder
 */
export type CodPanelInput = {
  totalOrders: number;
  confirmationRatePct: number;
  deliveryRatePct: number;
  sellingPricePerOrderUsd: number;
  productCostPerOrderUsd: number;
  shippingCostPerOrderUsd: number;
  codFeesPerOrderUsd: number;
  returnCostPerOrderUsd: number;
  otherFeesPerOrderUsd: number;
};

export type CodPanelResult = {
  totalOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  failedAfterConfirm: number;
  revenueUsd: number;
  productCostUsd: number;
  shippingCostUsd: number;
  codFeesUsd: number;
  returnCostUsd: number;
  otherFeesUsd: number;
  profitUsd: number;
  marginPct: number;
};

/** @deprecated Legacy alias — use PaymentPanelInput */
export type PaymentCalcInput = {
  orderCount: number;
  totalRevenueUsd: number;
  avgProductCostUsd: number;
  otherCostsUsd: number;
};

/** @deprecated Legacy alias — use CodPanelInput */
export type CodCalcInput = {
  totalOrders: number;
  confirmationRatePct: number;
  deliveryRatePct: number;
  sellingPriceUsd: number;
  avgProductCostUsd: number;
  noAnswerRatePct: number;
  declinedRatePct: number;
  otherCostsUsd: number;
};

export type PaymentCalcResult = PaymentPanelResult & { stripeFeesUsd: number; avgOrderUsd: number };
export type CodCalcResult = CodPanelResult & { callCenterUsd: number; codPlatformFeeUsd: number };

function clampNum(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

export function computePaymentPanel(input: PaymentPanelInput): PaymentPanelResult {
  const orderCount = Math.max(0, clampNum(input.orderCount));
  const revenueUsd = Math.max(0, clampNum(input.totalRevenueUsd));
  const productCostUsd = Math.max(0, clampNum(input.productCostUsd));
  const shippingCostUsd = Math.max(0, clampNum(input.shippingCostUsd));
  const paymentFeePercent = Math.min(100, Math.max(0, clampNum(input.paymentFeePercent)));
  const otherFeesUsd = Math.max(0, clampNum(input.otherFeesUsd));

  const paymentFeesUsd = revenueUsd * (paymentFeePercent / 100);
  const profitUsd = revenueUsd - productCostUsd - shippingCostUsd - paymentFeesUsd - otherFeesUsd;
  const marginPct = revenueUsd > 0 ? (profitUsd / revenueUsd) * 100 : 0;

  return {
    orderCount,
    revenueUsd,
    productCostUsd,
    shippingCostUsd,
    paymentFeesUsd,
    otherFeesUsd,
    profitUsd,
    marginPct,
  };
}

export function computeCodPanel(input: CodPanelInput): CodPanelResult {
  const totalOrders = Math.max(0, clampNum(input.totalOrders));
  const confirmationRatePct = Math.min(100, Math.max(0, clampNum(input.confirmationRatePct)));
  const deliveryRatePct = Math.min(100, Math.max(0, clampNum(input.deliveryRatePct)));
  const sellingPricePerOrderUsd = Math.max(0, clampNum(input.sellingPricePerOrderUsd));
  const productCostPerOrderUsd = Math.max(0, clampNum(input.productCostPerOrderUsd));
  const shippingCostPerOrderUsd = Math.max(0, clampNum(input.shippingCostPerOrderUsd));
  const codFeesPerOrderUsd = Math.max(0, clampNum(input.codFeesPerOrderUsd));
  const returnCostPerOrderUsd = Math.max(0, clampNum(input.returnCostPerOrderUsd));
  const otherFeesPerOrderUsd = Math.max(0, clampNum(input.otherFeesPerOrderUsd));

  const confirmedOrders = totalOrders * (confirmationRatePct / 100);
  const deliveredOrders = confirmedOrders * (deliveryRatePct / 100);
  const failedAfterConfirm = Math.max(0, confirmedOrders - deliveredOrders);

  const revenueUsd = deliveredOrders * sellingPricePerOrderUsd;
  const productCostUsd = deliveredOrders * productCostPerOrderUsd;
  const shippingCostUsd = deliveredOrders * shippingCostPerOrderUsd;
  const codFeesUsd = deliveredOrders * codFeesPerOrderUsd;
  const returnCostUsd = failedAfterConfirm * returnCostPerOrderUsd;
  const otherFeesUsd = totalOrders * otherFeesPerOrderUsd;

  const profitUsd =
    revenueUsd -
    productCostUsd -
    shippingCostUsd -
    codFeesUsd -
    returnCostUsd -
    otherFeesUsd;
  const marginPct = revenueUsd > 0 ? (profitUsd / revenueUsd) * 100 : 0;

  return {
    totalOrders,
    confirmedOrders,
    deliveredOrders,
    failedAfterConfirm,
    revenueUsd,
    productCostUsd,
    shippingCostUsd,
    codFeesUsd,
    returnCostUsd,
    otherFeesUsd,
    profitUsd,
    marginPct,
  };
}

/** Estimate Stripe fees for a single card order (used when aggregating live orders). */
export function estimateStripeFeesUsd(revenueUsd: number, fees: FeeConfig): number {
  if (revenueUsd <= 0) return 0;
  return (revenueUsd * fees.payment.stripePercent) / 100 + fees.payment.stripeFixedUsd;
}

/** Legacy wrapper */
export function computePaymentProfit(
  input: PaymentCalcInput,
  fees: FeeConfig,
): PaymentCalcResult {
  const orderCount = Math.max(0, clampNum(input.orderCount));
  const revenueUsd = Math.max(0, clampNum(input.totalRevenueUsd));
  const avgProductCostUsd = Math.max(0, clampNum(input.avgProductCostUsd));
  const productCostUsd = orderCount * avgProductCostUsd;
  const shippingCostUsd = orderCount * fees.payment.shippingDeliveredUsd;
  const panel = computePaymentPanel({
    orderCount,
    totalRevenueUsd: revenueUsd,
    productCostUsd,
    shippingCostUsd,
    paymentFeePercent: fees.payment.paymentFeePercent,
    otherFeesUsd: Math.max(0, clampNum(input.otherCostsUsd)),
  });
  const avgOrderUsd = orderCount > 0 ? revenueUsd / orderCount : 0;
  const stripeFeesUsd =
    orderCount > 0
      ? orderCount *
        ((avgOrderUsd * fees.payment.stripePercent) / 100 + fees.payment.stripeFixedUsd)
      : 0;
  return { ...panel, stripeFeesUsd, avgOrderUsd, paymentFeesUsd: panel.paymentFeesUsd };
}

/** Legacy wrapper — maps old COD input to per-order panel defaults */
export function computeCodProfit(input: CodCalcInput, fees: FeeConfig): CodCalcResult {
  const panel = computeCodPanel({
    totalOrders: input.totalOrders,
    confirmationRatePct: input.confirmationRatePct,
    deliveryRatePct: input.deliveryRatePct,
    sellingPricePerOrderUsd: input.sellingPriceUsd,
    productCostPerOrderUsd: input.avgProductCostUsd,
    shippingCostPerOrderUsd: fees.cod.shippingDeliveredUsd,
    codFeesPerOrderUsd: (input.sellingPriceUsd * fees.cod.platformFeePercent) / 100,
    returnCostPerOrderUsd: fees.cod.shippingReturnUsd,
    otherFeesPerOrderUsd: input.totalOrders > 0 ? input.otherCostsUsd / input.totalOrders : 0,
  });
  return {
    ...panel,
    callCenterUsd: 0,
    codPlatformFeeUsd: panel.codFeesUsd,
  };
}

export function computeScenarioDelta(
  baseline: CodPanelResult,
  scenario: CodPanelResult,
): { profitDeltaUsd: number; revenueDeltaUsd: number } {
  return {
    profitDeltaUsd: scenario.profitUsd - baseline.profitUsd,
    revenueDeltaUsd: scenario.revenueUsd - baseline.revenueUsd,
  };
}

export function netProfitAfterAdSpend(
  paymentProfitUsd: number,
  codProfitUsd: number,
  adSpendUsd: number,
): number {
  return paymentProfitUsd + codProfitUsd - Math.max(0, adSpendUsd);
}
