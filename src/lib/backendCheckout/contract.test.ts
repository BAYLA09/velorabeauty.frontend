import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  backoffMs,
  buildBackendOrderBody,
  buildCreateCheckoutBody,
  interpretBackendCall,
  isCheckoutEmail,
  nextRemoteAction,
  readMarketingConsent,
  redactEmail,
} from "./contract.ts";
import { checkoutActionUrl, checkoutCollectionUrl, readBackendCheckoutConfig } from "./config.ts";

const orderUuid = "11111111-1111-4111-8111-111111111111";

const draft = {
  email: " BaylaAmine@Gmail.com ",
  marketingConsent: false,
  customerName: "نورة العتيبي",
  phone: "0501234567",
  emirate: "دبي",
  paymentMethod: "card" as const,
  externalCheckoutId: orderUuid,
  orderId: orderUuid,
  eligibleUnits: 1,
  subtotalAmount: 199,
  deliveryFeeAmount: 0,
  totalAmount: 199,
  items: [{ slug: "hair-gummies", name: "علكات الشعر", quantity: 1 }],
};

describe("backend checkout contract", () => {
  it("builds the backend create payload and keeps consent false by default", () => {
    const body = buildCreateCheckoutBody(draft);
    assert.ok(body);
    assert.equal(body.email, "baylaamine@gmail.com");
    assert.equal(body.marketingConsent, false);
    assert.equal(body.firstName, "نورة");
    assert.equal(body.lastName, "العتيبي");
    assert.equal(body.currency, "AED");
    assert.equal(body.totalAmount, 199);
    assert.equal(body.country, "AE");
    assert.equal(body.externalCheckoutId, orderUuid);
    assert.deepEqual(body.cartData.items, draft.items);
    const withStripe = buildCreateCheckoutBody({
      ...draft,
      stripePaymentIntentId: "pi_test_checkout_123",
    });
    assert.equal(withStripe?.cartData.stripePaymentIntentId, "pi_test_checkout_123");
    assert.equal(withStripe?.externalCheckoutId, orderUuid);
    const order = buildBackendOrderBody({ ...draft, orderId: "not-the-uuid" }, "paid");
    assert.equal(order?.status, "paid");
    assert.equal(order?.externalOrderId, orderUuid);
    assert.equal(order?.externalCheckoutId, orderUuid);
    assert.equal(order?.totalAmount, 199);
    assert.equal(order?.currency, "AED");
    assert.equal(body.cartData.paymentMethod, "card");
    assert.equal(readMarketingConsent(undefined), false);
    assert.equal(readMarketingConsent("true"), false);
    assert.equal(readMarketingConsent(true), true);
  });

  it("rejects emails the backend would refuse", () => {
    assert.equal(isCheckoutEmail("nope"), false);
    assert.equal(buildCreateCheckoutBody({ ...draft, email: "nope" }), null);
    assert.equal(buildCreateCheckoutBody({ ...draft, externalCheckoutId: "short" }), null);
    assert.equal(
      buildCreateCheckoutBody({ ...draft, externalCheckoutId: "pi_test_checkout_123" }),
      null,
    );
    assert.equal(buildCreateCheckoutBody({ ...draft, items: [] }), null);
  });

  it("recovers a finished checkout and leaves an open one for the backend sweep", () => {
    assert.equal(nextRemoteAction({ desired: "recovered", remoteStatus: "active" }), "recover");
    assert.equal(nextRemoteAction({ desired: "recovered", remoteStatus: "abandoned" }), "recover");
    assert.equal(nextRemoteAction({ desired: "recovered", remoteStatus: "recovered" }), "done");
    assert.equal(nextRemoteAction({ desired: "active", remoteStatus: "active" }), "done");
    assert.equal(nextRemoteAction({ desired: "active", remoteStatus: "none" }), "done");
  });

  it("treats abandon-after-recover as success and retries only safe failures", () => {
    assert.deepEqual(
      interpretBackendCall({
        op: "abandon",
        status: 409,
        body: { code: "CHECKOUT_RECOVERED" },
      }),
      { action: "already_recovered" },
    );
    const created = interpretBackendCall({
      op: "create",
      status: 201,
      body: { checkout: { id: "ck_123" } },
    });
    assert.equal(created.action, "success");
    if (created.action === "success") {
      assert.equal(created.checkoutId, "ck_123");
    }
    assert.equal(interpretBackendCall({ op: "recover", status: 404, body: {} }).action, "retry");
    assert.equal(interpretBackendCall({ op: "create", status: 500, body: {} }).action, "retry");
    assert.equal(interpretBackendCall({ op: "create", status: 401, body: {} }).action, "stop");
    assert.ok(backoffMs(1) < backoffMs(4));
  });

  it("reads server config without exposing a short key", () => {
    assert.equal(
      readBackendCheckoutConfig({ BACKEND_API_BASE_URL: "", STORE_API_KEY: "" }).enabled,
      false,
    );
    const configured = readBackendCheckoutConfig({
      BACKEND_API_BASE_URL: "https://api.velorabeauty.world/",
      STORE_API_KEY: "store-key-at-least-16",
    });
    assert.equal(configured.enabled, true);
    if (!configured.enabled) return;
    assert.equal(configured.baseUrl, "https://api.velorabeauty.world");
    assert.equal("abandonMode" in configured, false);
    assert.equal(
      checkoutCollectionUrl(configured.baseUrl),
      "https://api.velorabeauty.world/api/checkouts",
    );
    assert.equal(
      checkoutActionUrl(configured.baseUrl, "ck id", "recover"),
      "https://api.velorabeauty.world/api/checkouts/ck%20id/recover",
    );
    assert.equal(redactEmail("baylaamine@gmail.com"), "b***@gmail.com");
  });
});
