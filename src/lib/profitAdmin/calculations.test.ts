import assert from "node:assert/strict";
import test from "node:test";
import { computeCodPanel, computePaymentPanel } from "@/lib/profitAdmin/calculations";

test("COD delivered orders = total × confirmation × delivery", () => {
  const r = computeCodPanel({
    totalOrders: 100,
    confirmationRatePct: 70,
    deliveryRatePct: 80,
    sellingPricePerOrderUsd: 35,
    productCostPerOrderUsd: 12,
    shippingCostPerOrderUsd: 4.5,
    codFeesPerOrderUsd: 2.5,
    returnCostPerOrderUsd: 3,
    otherFeesPerOrderUsd: 1,
  });
  assert.equal(r.deliveredOrders, 56);
  assert.equal(r.revenueUsd, 56 * 35);
  assert.equal(r.failedAfterConfirm, 100 * 0.7 - 56);
  assert.equal(r.returnCostUsd, r.failedAfterConfirm * 3);
});

test("Payment panel fees are percent of revenue", () => {
  const r = computePaymentPanel({
    orderCount: 10,
    totalRevenueUsd: 25430,
    productCostUsd: 9450,
    shippingCostUsd: 2150,
    paymentFeePercent: 4.9,
    otherFeesUsd: 1343,
  });
  assert.ok(Math.abs(r.paymentFeesUsd - 25430 * 0.049) < 0.01);
  const expectedProfit =
    25430 - 9450 - 2150 - 25430 * 0.049 - 1343;
  assert.ok(Math.abs(r.profitUsd - expectedProfit) < 0.01);
});
