import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  allocateCodApiLineTotals,
  allocateCodSheetLinePrices,
  buildCodApiLineItems,
  codLineTotalsSumToOrderTotal,
} from "@/lib/codNetwork/codFulfillmentPricing";
import { resolveCodSheetSku } from "@/lib/codNetwork/skuMap";
import type { OrderRecord } from "@/lib/ordersRepository";

function sampleOrder(overrides: Partial<OrderRecord> = {}): OrderRecord {
  return {
    id: "test-order-1",
    productSlug: "eye-serum",
    productName: "Eye Serum",
    quantity: 1,
    paymentMethod: "cod",
    subtotalAed: 199,
    deliveryFeeAed: 20,
    totalAed: 219,
    customerName: "Test",
    phone: "+971501234567",
    emirate: "دبي",
    address: "Marina",
    status: "pending",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: null,
    customerEmail: null,
    marketingConsent: false,
    backendExternalCheckoutId: null,
    createdAt: "2026-10-20T12:00:00.000Z",
    cartLines: [],
    orderSource: "storefront",
    ...overrides,
  };
}

describe("COD fulfillment pricing", () => {
  it("puts full COD fee on first sheet line for single-SKU orders", () => {
    const order = sampleOrder();
    const prices = allocateCodSheetLinePrices(order, null);
    assert.deepEqual(prices, [219]);
  });

  it("adds COD fee to first line only for multi-line sheet rows", () => {
    const order = sampleOrder({
      quantity: 2,
      subtotalAed: 398,
      deliveryFeeAed: 20,
      totalAed: 418,
      productSlug: "eye-serum",
      cartLines: [
        { slug: "eye-serum", quantity: 1 },
        { slug: "skin-gummies", quantity: 1 },
      ],
    });
    const prices = allocateCodSheetLinePrices(order, order.cartLines);
    assert.equal(prices.length, 2);
    assert.equal(prices[0], 199 + 20);
    assert.equal(prices[1], 199);
    assert.equal(prices[0] + prices[1], order.totalAed);
  });

  it("spreads COD fee across API line totals", () => {
    const order = sampleOrder({
      quantity: 2,
      subtotalAed: 398,
      deliveryFeeAed: 20,
      totalAed: 418,
      cartLines: [
        { slug: "eye-serum", quantity: 1 },
        { slug: "skin-gummies", quantity: 1 },
      ],
    });
    const totals = allocateCodApiLineTotals(order, order.cartLines);
    assert.equal(totals.reduce((a, b) => a + b, 0), order.totalAed);
    assert.equal(totals[0] + totals[1], 418);
  });

  it("sheet SKU mapping uses COD Network codes for mapped slugs", () => {
    assert.equal(resolveCodSheetSku("eye-serum"), "vitaminamin");
    assert.equal(resolveCodSheetSku("hair-gummies"), "hair-gummies");
  });

  it("API unit prices sum to order.totalAed", () => {
    const order = sampleOrder({
      quantity: 3,
      subtotalAed: 448,
      deliveryFeeAed: 20,
      totalAed: 468,
      cartLines: [
        { slug: "eye-serum", quantity: 1 },
        { slug: "skin-gummies", quantity: 2 },
      ],
    });
    const items = buildCodApiLineItems(order, order.cartLines);
    const sum = items.reduce((acc, item) => acc + item.quantity * item.unitPriceAed, 0);
    assert.ok(Math.abs(sum - order.totalAed) < 0.001);
    assert.ok(codLineTotalsSumToOrderTotal(order, order.cartLines));
  });
});
