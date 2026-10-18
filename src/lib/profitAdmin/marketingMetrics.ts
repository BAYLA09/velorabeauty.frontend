import type { CodPanelResult, PaymentPanelResult } from "@/lib/profitAdmin/calculations";

export type MarketingMetrics = {
  roiPct: number | null;
  roas: number | null;
  cpaUsd: number | null;
  costPerDeliveredOrderUsd: number | null;
  breakEvenRoas: number | null;
  /** ad spend + product, shipping, and platform fees (USD) */
  totalSpendUsd: number;
  totalRevenueUsd: number;
  netProfitUsd: number;
  grossProfitBeforeAdUsd: number;
  paidOrderCount: number;
  deliveredCodOrders: number;
  totalOrders: number;
};

export function fulfillmentCostsUsd(
  payment: PaymentPanelResult,
  cod: CodPanelResult,
): number {
  return (
    payment.productCostUsd +
    payment.shippingCostUsd +
    payment.paymentFeesUsd +
    payment.otherFeesUsd +
    cod.productCostUsd +
    cod.shippingCostUsd +
    cod.codFeesUsd +
    cod.returnCostUsd +
    cod.otherFeesUsd
  );
}

export function computeMarketingMetrics(input: {
  adSpendUsd: number;
  payment: PaymentPanelResult;
  cod: CodPanelResult;
}): MarketingMetrics {
  const adSpend = Math.max(0, input.adSpendUsd);
  const payment = input.payment;
  const cod = input.cod;

  const fulfillment = fulfillmentCostsUsd(payment, cod);
  const totalSpendUsd = adSpend + fulfillment;
  const grossProfitBeforeAdUsd = payment.profitUsd + cod.profitUsd;
  const netProfitUsd = grossProfitBeforeAdUsd - adSpend;
  const totalRevenueUsd = payment.revenueUsd + cod.revenueUsd;
  const totalOrders = payment.orderCount + cod.totalOrders;
  const paidOrderCount = payment.orderCount;
  const deliveredCodOrders = cod.deliveredOrders;
  const deliveredFulfillmentCount = paidOrderCount + deliveredCodOrders;

  const roiPct = totalSpendUsd > 0 ? (netProfitUsd / totalSpendUsd) * 100 : null;
  const roas = adSpend > 0 ? totalRevenueUsd / adSpend : null;
  const cpaUsd = totalOrders > 0 ? adSpend / totalOrders : null;
  const costPerDeliveredOrderUsd =
    deliveredFulfillmentCount > 0 ? adSpend / deliveredFulfillmentCount : null;
  const breakEvenRoas =
    grossProfitBeforeAdUsd > 0 ? totalRevenueUsd / grossProfitBeforeAdUsd : null;

  return {
    roiPct,
    roas,
    cpaUsd,
    costPerDeliveredOrderUsd,
    breakEvenRoas,
    totalSpendUsd,
    totalRevenueUsd,
    netProfitUsd,
    grossProfitBeforeAdUsd,
    paidOrderCount,
    deliveredCodOrders,
    totalOrders,
  };
}

export function formatMetricDash(value: number | null): string {
  return value === null || !Number.isFinite(value) ? "—" : String(value);
}

export function formatRoiPct(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(1)}%`;
}

export function formatRoas(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(2)}×`;
}

export function formatMoneyMetric(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
