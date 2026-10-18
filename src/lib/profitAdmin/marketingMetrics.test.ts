import assert from "node:assert/strict";
import test from "node:test";
import type { CodPanelResult, PaymentPanelResult } from "@/lib/profitAdmin/calculations";
import { computeMarketingMetrics, fulfillmentCostsUsd } from "@/lib/profitAdmin/marketingMetrics";

function payment(overrides: Partial<PaymentPanelResult> = {}): PaymentPanelResult {
  return {
    orderCount: 10,
    revenueUsd: 1000,
    productCostUsd: 300,
    shippingCostUsd: 59.9,
    stripeFeesUsd: 57.9,
    profitUsd: 582.2,
    marginPct: 58.22,
    ...overrides,
  };
}

function cod(overrides: Partial<CodPanelResult> = {}): CodPanelResult {
  return {
    totalOrders: 100,
    confirmedOrders: 70,
    notConfirmedOrders: 30,
    deliveredOrders: 56,
    returnedOrders: 14,
    revenueUsd: 1960,
    productCostUsd: 672,
    callCenterNoAnswerUsd: 15,
    callCenterReturnedUsd: 14,
    callCenterDeliveredUsd: 112,
    callCenterUsd: 141,
    shippingDeliveredUsd: 335.44,
    shippingReturnedUsd: 69.86,
    shippingCostUsd: 405.3,
    codServiceFeeUsd: 98,
    profitUsd: 643.7,
    marginPct: 32.84,
    ...overrides,
  };
}

test("fulfillment costs sum payment and COD cost lines", () => {
  const p = payment();
  const c = cod();
  assert.equal(fulfillmentCostsUsd(p, c), fulfillmentCostsUsd(payment(), cod()));
});

test("ROI, ROAS, CPA, cost per delivered, break-even ROAS", () => {
  const p = payment({ orderCount: 2, revenueUsd: 200, profitUsd: 100 });
  const c = cod({ totalOrders: 4, deliveredOrders: 2, revenueUsd: 100, profitUsd: 40 });
  const m = computeMarketingMetrics({ adSpendUsd: 50, payment: p, cod: c });

  const fulfillment = fulfillmentCostsUsd(p, c);
  assert.equal(m.totalSpendUsd, 50 + fulfillment);
  assert.equal(m.netProfitUsd, 100 + 40 - 50);
  assert.equal(m.totalRevenueUsd, 300);

  assert.ok(m.roas !== null && Math.abs(m.roas - 300 / 50) < 0.001);
  assert.ok(m.cpaUsd !== null && Math.abs(m.cpaUsd - 50 / 6) < 0.001);
  assert.ok(
    m.costPerDeliveredOrderUsd !== null &&
      Math.abs(m.costPerDeliveredOrderUsd - 50 / 4) < 0.001,
  );
  assert.ok(
    m.breakEvenRoas !== null && Math.abs(m.breakEvenRoas - 300 / 140) < 0.001,
  );
  assert.ok(m.roiPct !== null && Math.abs(m.roiPct - (m.netProfitUsd / m.totalSpendUsd) * 100) < 0.01);
});

test("returns null metrics when denominators are zero", () => {
  const p = payment({
    orderCount: 0,
    revenueUsd: 0,
    profitUsd: 0,
    productCostUsd: 0,
    shippingCostUsd: 0,
    stripeFeesUsd: 0,
  });
  const c = cod({
    totalOrders: 0,
    deliveredOrders: 0,
    revenueUsd: 0,
    profitUsd: 0,
    productCostUsd: 0,
    shippingCostUsd: 0,
    callCenterUsd: 0,
    codServiceFeeUsd: 0,
  });
  const m = computeMarketingMetrics({ adSpendUsd: 0, payment: p, cod: c });
  assert.equal(m.roas, null);
  assert.equal(m.cpaUsd, null);
  assert.equal(m.costPerDeliveredOrderUsd, null);
  assert.equal(m.breakEvenRoas, null);
  assert.equal(m.roiPct, null);
});
