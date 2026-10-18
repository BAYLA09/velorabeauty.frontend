import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";

/**
 * Card / Stripe orders only — never mixed with COD service fee.
 * Stripe fee per order = order amount × stripePercent + stripeFixedUsd.
 */
export type PaymentPanelInput = {
  orderCount: number;
  totalRevenueUsd: number;
  productCostUsd: number;
  shippingCostUsd: number;
  stripePercent: number;
  stripeFixedUsd: number;
};

export type PaymentPanelResult = {
  orderCount: number;
  revenueUsd: number;
  productCostUsd: number;
  shippingCostUsd: number;
  /** Stripe processing fees only (card channel). */
  stripeFeesUsd: number;
  profitUsd: number;
  marginPct: number;
};

/**
 * COD orders only — never mixed with Stripe card fees.
 * COD funnel (N = total orders, conf & deliv = rates in %).
 * confirmed = N×conf; notConfirmed = N−confirmed; delivered = confirmed×deliv; returned = confirmed−delivered.
 */
export type CodPanelInput = {
  totalOrders: number;
  confirmationRatePct: number;
  deliveryRatePct: number;
  sellingPricePerOrderUsd: number;
  productCostPerOrderUsd: number;
  callCenterNoAnswerUsd: number;
  callCenterReturnedUsd: number;
  callCenterDeliveredUsd: number;
  shippingDeliveredUsd: number;
  shippingReturnedUsd: number;
  serviceFeePercent: number;
};

export type CodPanelResult = {
  totalOrders: number;
  confirmedOrders: number;
  notConfirmedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  revenueUsd: number;
  productCostUsd: number;
  callCenterNoAnswerUsd: number;
  callCenterReturnedUsd: number;
  callCenterDeliveredUsd: number;
  callCenterUsd: number;
  shippingDeliveredUsd: number;
  shippingReturnedUsd: number;
  shippingCostUsd: number;
  /** COD Network / cash-collection fee — % of delivered COD revenue only. */
  codServiceFeeUsd: number;
  profitUsd: number;
  marginPct: number;
};

/** @deprecated */
export type PaymentCalcInput = {
  orderCount: number;
  totalRevenueUsd: number;
  avgProductCostUsd: number;
  otherCostsUsd: number;
};

/** @deprecated */
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

export type PaymentCalcResult = PaymentPanelResult & { avgOrderUsd: number };
export type CodCalcResult = CodPanelResult & { codPlatformFeeUsd: number };

function clampNum(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

export function computePaymentPanel(input: PaymentPanelInput): PaymentPanelResult {
  const orderCount = Math.max(0, clampNum(input.orderCount));
  const revenueUsd = Math.max(0, clampNum(input.totalRevenueUsd));
  const productCostUsd = Math.max(0, clampNum(input.productCostUsd));
  const shippingCostUsd = Math.max(0, clampNum(input.shippingCostUsd));
  const stripePercent = Math.min(100, Math.max(0, clampNum(input.stripePercent)));
  const stripeFixedUsd = Math.max(0, clampNum(input.stripeFixedUsd));

  const stripeFeesUsd = (revenueUsd * stripePercent) / 100 + orderCount * stripeFixedUsd;
  const profitUsd = revenueUsd - productCostUsd - shippingCostUsd - stripeFeesUsd;
  const marginPct = revenueUsd > 0 ? (profitUsd / revenueUsd) * 100 : 0;

  return {
    orderCount,
    revenueUsd,
    productCostUsd,
    shippingCostUsd,
    stripeFeesUsd,
    profitUsd,
    marginPct,
  };
}

export function codPanelInputFromFees(
  partial: Omit<
    CodPanelInput,
    | "callCenterNoAnswerUsd"
    | "callCenterReturnedUsd"
    | "callCenterDeliveredUsd"
    | "shippingDeliveredUsd"
    | "shippingReturnedUsd"
    | "serviceFeePercent"
  >,
  fees: FeeConfig,
): CodPanelInput {
  return {
    ...partial,
    callCenterNoAnswerUsd: fees.cod.callCenterNoAnswerUsd,
    callCenterReturnedUsd: fees.cod.callCenterReturnedUsd,
    callCenterDeliveredUsd: fees.cod.callCenterDeliveredUsd,
    shippingDeliveredUsd: fees.cod.shippingDeliveredUsd,
    shippingReturnedUsd: fees.cod.shippingReturnedUsd,
    serviceFeePercent: fees.cod.serviceFeePercent,
  };
}

export function computeCodPanel(input: CodPanelInput): CodPanelResult {
  const totalOrders = Math.max(0, clampNum(input.totalOrders));
  const confirmationRatePct = Math.min(100, Math.max(0, clampNum(input.confirmationRatePct)));
  const deliveryRatePct = Math.min(100, Math.max(0, clampNum(input.deliveryRatePct)));
  const sellingPricePerOrderUsd = Math.max(0, clampNum(input.sellingPricePerOrderUsd));
  const productCostPerOrderUsd = Math.max(0, clampNum(input.productCostPerOrderUsd));

  const confirmedOrders = totalOrders * (confirmationRatePct / 100);
  const notConfirmedOrders = Math.max(0, totalOrders - confirmedOrders);
  const deliveredOrders = confirmedOrders * (deliveryRatePct / 100);
  const returnedOrders = Math.max(0, confirmedOrders - deliveredOrders);

  const revenueUsd = deliveredOrders * sellingPricePerOrderUsd;
  const productCostUsd = deliveredOrders * productCostPerOrderUsd;

  const callCenterNoAnswerUsd = notConfirmedOrders * input.callCenterNoAnswerUsd;
  const callCenterReturnedUsd = returnedOrders * input.callCenterReturnedUsd;
  const callCenterDeliveredUsd = deliveredOrders * input.callCenterDeliveredUsd;
  const callCenterUsd = callCenterNoAnswerUsd + callCenterReturnedUsd + callCenterDeliveredUsd;

  const shippingDeliveredUsd = deliveredOrders * input.shippingDeliveredUsd;
  const shippingReturnedUsd = returnedOrders * input.shippingReturnedUsd;
  const shippingCostUsd = shippingDeliveredUsd + shippingReturnedUsd;

  const servicePct = Math.min(100, Math.max(0, clampNum(input.serviceFeePercent)));
  const codServiceFeeUsd = revenueUsd * (servicePct / 100);

  const profitUsd =
    revenueUsd - productCostUsd - callCenterUsd - shippingCostUsd - codServiceFeeUsd;
  const marginPct = revenueUsd > 0 ? (profitUsd / revenueUsd) * 100 : 0;

  return {
    totalOrders,
    confirmedOrders,
    notConfirmedOrders,
    deliveredOrders,
    returnedOrders,
    revenueUsd,
    productCostUsd,
    callCenterNoAnswerUsd,
    callCenterReturnedUsd,
    callCenterDeliveredUsd,
    callCenterUsd,
    shippingDeliveredUsd,
    shippingReturnedUsd,
    shippingCostUsd,
    codServiceFeeUsd,
    profitUsd,
    marginPct,
  };
}

export type CodFunnelCounts = {
  totalOrders: number;
  notConfirmedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  sellingPricePerOrderUsd: number;
  productCostPerOrderUsd: number;
  callCenterNoAnswerUsd: number;
  callCenterReturnedUsd: number;
  callCenterDeliveredUsd: number;
  shippingDeliveredUsd: number;
  shippingReturnedUsd: number;
  serviceFeePercent: number;
};

/** COD profit from Sheet-synced funnel counts + projected pending (new fee model). */
export function computeCodPanelFromFunnelCounts(input: CodFunnelCounts): CodPanelResult {
  const totalOrders = Math.max(0, clampNum(input.totalOrders));
  const notConfirmedOrders = Math.max(0, clampNum(input.notConfirmedOrders));
  const deliveredOrders = Math.max(0, clampNum(input.deliveredOrders));
  const returnedOrders = Math.max(0, clampNum(input.returnedOrders));
  const sellingPricePerOrderUsd = Math.max(0, clampNum(input.sellingPricePerOrderUsd));
  const productCostPerOrderUsd = Math.max(0, clampNum(input.productCostPerOrderUsd));

  const confirmedOrders = Math.max(0, totalOrders - notConfirmedOrders);
  const revenueUsd = deliveredOrders * sellingPricePerOrderUsd;
  const productCostUsd = deliveredOrders * productCostPerOrderUsd;

  const callCenterNoAnswerUsd = notConfirmedOrders * input.callCenterNoAnswerUsd;
  const callCenterReturnedUsd = returnedOrders * input.callCenterReturnedUsd;
  const callCenterDeliveredUsd = deliveredOrders * input.callCenterDeliveredUsd;
  const callCenterUsd = callCenterNoAnswerUsd + callCenterReturnedUsd + callCenterDeliveredUsd;

  const shippingDeliveredUsd = deliveredOrders * input.shippingDeliveredUsd;
  const shippingReturnedUsd = returnedOrders * input.shippingReturnedUsd;
  const shippingCostUsd = shippingDeliveredUsd + shippingReturnedUsd;

  const servicePct = Math.min(100, Math.max(0, clampNum(input.serviceFeePercent)));
  const codServiceFeeUsd = revenueUsd * (servicePct / 100);

  const profitUsd =
    revenueUsd - productCostUsd - callCenterUsd - shippingCostUsd - codServiceFeeUsd;
  const marginPct = revenueUsd > 0 ? (profitUsd / revenueUsd) * 100 : 0;

  return {
    totalOrders,
    confirmedOrders,
    notConfirmedOrders,
    deliveredOrders,
    returnedOrders,
    revenueUsd,
    productCostUsd,
    callCenterNoAnswerUsd,
    callCenterReturnedUsd,
    callCenterDeliveredUsd,
    callCenterUsd,
    shippingDeliveredUsd,
    shippingReturnedUsd,
    shippingCostUsd,
    codServiceFeeUsd,
    profitUsd,
    marginPct,
  };
}

export function estimateStripeFeesUsd(revenueUsd: number, orderCount: number, fees: FeeConfig): number {
  if (revenueUsd <= 0 && orderCount <= 0) return 0;
  return (revenueUsd * fees.payment.stripePercent) / 100 + orderCount * fees.payment.stripeFixedUsd;
}

/** Legacy wrapper */
export function computePaymentProfit(
  input: PaymentCalcInput,
  fees: FeeConfig,
): PaymentCalcResult {
  const orderCount = Math.max(0, clampNum(input.orderCount));
  const revenueUsd = Math.max(0, clampNum(input.totalRevenueUsd));
  const productCostUsd = orderCount * Math.max(0, clampNum(input.avgProductCostUsd));
  const shippingCostUsd = orderCount * fees.payment.shippingPerOrderUsd;
  const panel = computePaymentPanel({
    orderCount,
    totalRevenueUsd: revenueUsd,
    productCostUsd,
    shippingCostUsd,
    stripePercent: fees.payment.stripePercent,
    stripeFixedUsd: fees.payment.stripeFixedUsd,
  });
  const avgOrderUsd = orderCount > 0 ? revenueUsd / orderCount : 0;
  return { ...panel, avgOrderUsd };
}

/** Legacy wrapper */
export function computeCodProfit(input: CodCalcInput, fees: FeeConfig): CodCalcResult {
  const panel = computeCodPanel(
    codPanelInputFromFees(
      {
        totalOrders: input.totalOrders,
        confirmationRatePct: input.confirmationRatePct,
        deliveryRatePct: input.deliveryRatePct,
        sellingPricePerOrderUsd: input.sellingPriceUsd,
        productCostPerOrderUsd: input.avgProductCostUsd,
      },
      fees,
    ),
  );
  return { ...panel, codPlatformFeeUsd: panel.codServiceFeeUsd };
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
