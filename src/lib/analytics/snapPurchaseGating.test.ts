import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldFireCardSnapPurchase,
  shouldFireCodSnapPurchase,
} from "./snapPurchaseGating.ts";

describe("shouldFireCodSnapPurchase", () => {
  it("fires when verified with order id", () => {
    assert.equal(
      shouldFireCodSnapPurchase({
        purchaseVerified: true,
        orderId: "ord-1",
        paymentMethod: "cod",
      }),
      true,
    );
  });

  it("does not fire without verification", () => {
    assert.equal(
      shouldFireCodSnapPurchase({
        purchaseVerified: false,
        orderId: "ord-1",
      }),
      false,
    );
  });

  it("does not fire for card method", () => {
    assert.equal(
      shouldFireCodSnapPurchase({
        purchaseVerified: true,
        orderId: "ord-1",
        paymentMethod: "card",
      }),
      false,
    );
  });
});

describe("shouldFireCardSnapPurchase", () => {
  it("requires paid status", () => {
    assert.equal(
      shouldFireCardSnapPurchase({
        purchaseVerified: true,
        orderId: "ord-1",
        status: "paid",
        paymentMethod: "card",
      }),
      true,
    );
    assert.equal(
      shouldFireCardSnapPurchase({
        purchaseVerified: true,
        orderId: "ord-1",
        status: "awaiting_payment",
        paymentMethod: "card",
      }),
      false,
    );
  });

  it("does not fire on url-only unverified order", () => {
    assert.equal(
      shouldFireCardSnapPurchase({
        purchaseVerified: false,
        orderId: "ord-1",
        status: "paid",
      }),
      false,
    );
  });
});
