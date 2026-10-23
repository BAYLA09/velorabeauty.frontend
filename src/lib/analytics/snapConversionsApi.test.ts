import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSnapCapiPurchaseBody,
  hashPhoneForSnapCapi,
} from "@/lib/analytics/snapConversionsApi";
import type { OrderRecord } from "@/lib/ordersRepository";

function sampleOrder(overrides: Partial<OrderRecord> = {}): OrderRecord {
  return {
    id: "order-uuid-123",
    productSlug: "hair-gummies",
    productName: "Hair",
    quantity: 2,
    paymentMethod: "cod",
    subtotalAed: 249,
    deliveryFeeAed: 20,
    totalAed: 269,
    customerName: "Test",
    phone: "+971501234567",
    emirate: "دبي",
    address: "",
    status: "pending",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: null,
    customerEmail: null,
    marketingConsent: false,
    backendExternalCheckoutId: null,
    createdAt: "2026-10-23T12:00:00.000Z",
    cartLines: [],
    orderSource: "storefront",
    ...overrides,
  };
}

test("hashPhoneForSnapCapi returns stable sha256 hex", () => {
  const a = hashPhoneForSnapCapi("+971 50 123 4567");
  const b = hashPhoneForSnapCapi("0501234567");
  assert.ok(a);
  assert.equal(a, b);
  assert.match(a!, /^[a-f0-9]{64}$/);
});

test("buildSnapCapiPurchaseBody uses order id for dedupe fields", () => {
  const body = buildSnapCapiPurchaseBody(sampleOrder(), {
    userAgent: "test-agent",
    clientIp: "203.0.113.1",
  });
  assert.ok(body);
  assert.equal(body!.event_id, "order-uuid-123");
  assert.equal(body!.client_dedup_id, "order-uuid-123");
  assert.equal(body!.price, 269);
  assert.equal(body!.currency, "AED");
  assert.deepEqual(body!.item_ids, ["hair-gummies"]);
  assert.equal(body!.number_items, "2");
  assert.ok(body!.hashed_phone_number);
});
