import assert from "node:assert/strict";
import test from "node:test";
import { computeCodProfit, computePaymentProfit } from "@/lib/profitAdmin/calculations";
import { DEFAULT_FEE_CONFIG } from "@/lib/profitAdmin/feesDefaults";

test("COD delivered orders = total × confirmation × delivery", () => {
  const r = computeCodProfit(
    {
      totalOrders: 100,
      confirmationRatePct: 70,
      deliveryRatePct: 80,
      sellingPriceUsd: 35,
      avgProductCostUsd: 6.1,
      noAnswerRatePct: 20,
      declinedRatePct: 10,
      otherCostsUsd: 0,
    },
    DEFAULT_FEE_CONFIG as import("@/lib/profitAdmin/feesDefaults").FeeConfig,
  );
  assert.equal(r.deliveredOrders, 56);
  assert.equal(r.revenueUsd, 56 * 35);
});

test("Payment Stripe fee uses percent + fixed per order", () => {
  const r = computePaymentProfit(
    {
      orderCount: 10,
      totalRevenueUsd: 350,
      avgProductCostUsd: 6.1,
      otherCostsUsd: 0,
    },
    DEFAULT_FEE_CONFIG as import("@/lib/profitAdmin/feesDefaults").FeeConfig,
  );
  assert.equal(r.avgOrderUsd, 35);
  const perOrderFee = 35 * 0.054 + 0.3;
  assert.ok(Math.abs(r.stripeFeesUsd - perOrderFee * 10) < 0.01);
});
