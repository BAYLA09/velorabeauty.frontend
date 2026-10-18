import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";

export type PaymentCalcInput = {
  orderCount: number;
  totalRevenueUsd: number;
  avgProductCostUsd: number;
  otherCostsUsd: number;
};

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

export type PaymentCalcResult = {
  orderCount: number;
  revenueUsd: number;
  avgOrderUsd: number;
  productCostUsd: number;
  shippingUsd: number;
  stripeFeesUsd: number;
  otherCostsUsd: number;
  profitUsd: number;
  marginPct: number;
};

export type CodCalcResult = {
  totalOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  failedAfterConfirm: number;
  revenueUsd: number;
  productCostUsd: number;
  shippingUsd: number;
  callCenterUsd: number;
  codPlatformFeeUsd: number;
  otherCostsUsd: number;
  profitUsd: number;
  marginPct: number;
};

function clampNum(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

export function computePaymentProfit(
  input: PaymentCalcInput,
  fees: FeeConfig,
): PaymentCalcResult {
  const orderCount = Math.max(0, clampNum(input.orderCount));
  const revenueUsd = Math.max(0, clampNum(input.totalRevenueUsd));
  const avgProductCostUsd = Math.max(0, clampNum(input.avgProductCostUsd));
  const otherCostsUsd = Math.max(0, clampNum(input.otherCostsUsd));
  const avgOrderUsd = orderCount > 0 ? revenueUsd / orderCount : 0;

  const productCostUsd = orderCount * avgProductCostUsd;
  const shippingUsd = orderCount * fees.payment.shippingDeliveredUsd;
  const stripeFeesUsd =
    orderCount > 0
      ? orderCount *
        ((avgOrderUsd * fees.payment.stripePercent) / 100 + fees.payment.stripeFixedUsd)
      : 0;

  const profitUsd =
    revenueUsd - productCostUsd - shippingUsd - stripeFeesUsd - otherCostsUsd;
  const marginPct = revenueUsd > 0 ? (profitUsd / revenueUsd) * 100 : 0;

  return {
    orderCount,
    revenueUsd,
    avgOrderUsd,
    productCostUsd,
    shippingUsd,
    stripeFeesUsd,
    otherCostsUsd,
    profitUsd,
    marginPct,
  };
}

export function computeCodProfit(input: CodCalcInput, fees: FeeConfig): CodCalcResult {
  const totalOrders = Math.max(0, clampNum(input.totalOrders));
  const confirmationRatePct = Math.min(100, Math.max(0, clampNum(input.confirmationRatePct)));
  const deliveryRatePct = Math.min(100, Math.max(0, clampNum(input.deliveryRatePct)));
  const sellingPriceUsd = Math.max(0, clampNum(input.sellingPriceUsd));
  const avgProductCostUsd = Math.max(0, clampNum(input.avgProductCostUsd));
  const noAnswerRatePct = Math.min(100, Math.max(0, clampNum(input.noAnswerRatePct)));
  const declinedRatePct = Math.min(100, Math.max(0, clampNum(input.declinedRatePct)));
  const otherCostsUsd = Math.max(0, clampNum(input.otherCostsUsd));

  const confirmedOrders = totalOrders * (confirmationRatePct / 100);
  const deliveredOrders = confirmedOrders * (deliveryRatePct / 100);
  const failedAfterConfirm = Math.max(0, confirmedOrders - deliveredOrders);

  const revenueUsd = deliveredOrders * sellingPriceUsd;
  const productCostUsd = deliveredOrders * avgProductCostUsd;

  const noAnswerOrders = totalOrders * (noAnswerRatePct / 100);
  const declinedOrders = totalOrders * (declinedRatePct / 100);

  const callCenterUsd =
    noAnswerOrders * fees.cod.callCenterNoAnswerUsd +
    declinedOrders * fees.cod.callCenterDeclinedUsd +
    deliveredOrders * fees.cod.callCenterDeliveredUsd;

  const shippingUsd =
    deliveredOrders * fees.cod.shippingDeliveredUsd +
    failedAfterConfirm * fees.cod.shippingReturnUsd;

  const codPlatformFeeUsd = revenueUsd * (fees.cod.platformFeePercent / 100);

  const profitUsd =
    revenueUsd -
    productCostUsd -
    shippingUsd -
    callCenterUsd -
    codPlatformFeeUsd -
    otherCostsUsd;
  const marginPct = revenueUsd > 0 ? (profitUsd / revenueUsd) * 100 : 0;

  return {
    totalOrders,
    confirmedOrders,
    deliveredOrders,
    failedAfterConfirm,
    revenueUsd,
    productCostUsd,
    shippingUsd,
    callCenterUsd,
    codPlatformFeeUsd,
    otherCostsUsd,
    profitUsd,
    marginPct,
  };
}

export function computeScenarioDelta(
  baseline: CodCalcResult,
  scenario: CodCalcResult,
): { profitDeltaUsd: number; revenueDeltaUsd: number } {
  return {
    profitDeltaUsd: scenario.profitUsd - baseline.profitUsd,
    revenueDeltaUsd: scenario.revenueUsd - baseline.revenueUsd,
  };
}
