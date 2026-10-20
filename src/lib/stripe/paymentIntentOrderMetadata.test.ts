import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parsePaymentIntentOrderSnapshot,
  snapshotFromCheckoutFields,
  stripeMetadataFromOrderSnapshot,
} from "@/lib/stripe/paymentIntentOrderMetadata";

describe("payment intent order metadata", () => {
  it("round-trips a compact snapshot in a single op key", () => {
    const snapshot = snapshotFromCheckoutFields({
      productSlug: "eye-serum",
      productName: "Serum",
      quantity: 1,
      customerName: "Sara",
      phone: "+971501234567",
      address: "Marina",
      emirate: "دبي",
      email: "s@example.com",
      marketingConsent: true,
      attribution: { utm_source: "snap" },
    });
    const metadata = stripeMetadataFromOrderSnapshot(snapshot, { orderId: "ord-1" });
    const parsed = parsePaymentIntentOrderSnapshot(metadata);
    assert.equal(parsed?.customerName, "Sara");
    assert.equal(parsed?.phone, "+971501234567");
    assert.equal(parsed?.attr?.utm_source, "snap");
    assert.equal(metadata.orderId, "ord-1");
  });

  it("splits large payloads across chunked keys", () => {
    const snapshot = snapshotFromCheckoutFields({
      productSlug: "eye-serum",
      productName: "Serum",
      quantity: 1,
      customerName: "A".repeat(400),
      phone: "+971501234567",
      address: "B".repeat(400),
      emirate: "دبي",
    });
    const metadata = stripeMetadataFromOrderSnapshot(snapshot);
    assert.ok(metadata.opN || metadata.op);
    const parsed = parsePaymentIntentOrderSnapshot(metadata);
    assert.equal(parsed?.customerName, "A".repeat(400));
  });
});
