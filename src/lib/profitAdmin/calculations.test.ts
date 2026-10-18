import assert from "node:assert/strict";
import test from "node:test";
import { computeCodPanel, computePaymentPanel } from "@/lib/profitAdmin/calculations";
import { DEFAULT_FEE_CONFIG } from "@/lib/profitAdmin/feesDefaults";

const defaultCodRates = DEFAULT_FEE_CONFIG.cod;

test("COD funnel counts: N=100, 70% conf, 80% deliv", () => {
  const r = computeCodPanel({
    totalOrders: 100,
    confirmationRatePct: 70,
    deliveryRatePct: 80,
    sellingPricePerOrderUsd: 35,
    productCostPerOrderUsd: 12,
    callCenterNoAnswerUsd: defaultCodRates.callCenterNoAnswerUsd,
    callCenterReturnedUsd: defaultCodRates.callCenterReturnedUsd,
    callCenterDeliveredUsd: defaultCodRates.callCenterDeliveredUsd,
    shippingDeliveredUsd: defaultCodRates.shippingDeliveredUsd,
    shippingReturnedUsd: defaultCodRates.shippingReturnedUsd,
    serviceFeePercent: defaultCodRates.serviceFeePercent,
  });
  assert.equal(r.confirmedOrders, 70);
  assert.equal(r.notConfirmedOrders, 30);
  assert.equal(r.deliveredOrders, 56);
  assert.equal(r.returnedOrders, 14);
  assert.equal(r.revenueUsd, 56 * 35);
});

test("COD worked example profit (owner fee model)", () => {
  const r = computeCodPanel({
    totalOrders: 100,
    confirmationRatePct: 70,
    deliveryRatePct: 80,
    sellingPricePerOrderUsd: 35,
    productCostPerOrderUsd: 12,
    callCenterNoAnswerUsd: 0.5,
    callCenterReturnedUsd: 1,
    callCenterDeliveredUsd: 2,
    shippingDeliveredUsd: 5.99,
    shippingReturnedUsd: 4.99,
    serviceFeePercent: 5,
  });
  const callCenter = 30 * 0.5 + 14 * 1 + 56 * 2;
  const shipping = 14 * 4.99 + 56 * 5.99;
  const service = 1960 * 0.05;
  const expectedProfit = 1960 - 672 - callCenter - shipping - service;
  assert.ok(Math.abs(r.callCenterUsd - callCenter) < 0.01);
  assert.ok(Math.abs(r.shippingCostUsd - shipping) < 0.02);
  assert.ok(Math.abs(r.codServiceFeeUsd - service) < 0.01);
  assert.ok(Math.abs(r.profitUsd - expectedProfit) < 0.05);
  assert.ok(Math.abs(r.profitUsd - 643.7) < 0.1);
});

test("Stripe payment fees: 5.4% + $0.30 per order", () => {
  const r = computePaymentPanel({
    orderCount: 10,
    totalRevenueUsd: 350,
    productCostUsd: 120,
    shippingCostUsd: 59.9,
    stripePercent: 5.4,
    stripeFixedUsd: 0.3,
  });
  const fees = 350 * 0.054 + 10 * 0.3;
  assert.ok(Math.abs(r.stripeFeesUsd - fees) < 0.01);
  assert.ok(Math.abs(r.profitUsd - (350 - 120 - 59.9 - fees)) < 0.01);
});

test("Stripe fees apply only on card panel; COD service fee only on COD panel", () => {
  const card = computePaymentPanel({
    orderCount: 2,
    totalRevenueUsd: 70,
    productCostUsd: 24,
    shippingCostUsd: 11.98,
    stripePercent: 5.4,
    stripeFixedUsd: 0.3,
  });
  const cod = computeCodPanel({
    totalOrders: 10,
    confirmationRatePct: 100,
    deliveryRatePct: 100,
    sellingPricePerOrderUsd: 35,
    productCostPerOrderUsd: 12,
    callCenterNoAnswerUsd: 0.5,
    callCenterReturnedUsd: 1,
    callCenterDeliveredUsd: 2,
    shippingDeliveredUsd: 5.99,
    shippingReturnedUsd: 4.99,
    serviceFeePercent: 5,
  });
  assert.ok(card.stripeFeesUsd > 0);
  assert.equal(cod.codServiceFeeUsd, 10 * 35 * 0.05);
  assert.ok(!("codServiceFeeUsd" in card));
  assert.ok(!("stripeFeesUsd" in cod));
});
