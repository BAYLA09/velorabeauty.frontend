import assert from "node:assert/strict";
import test from "node:test";
import { buildCheckoutPath } from "@/lib/checkoutRoutes";
import { firePdpCheckoutSnapEvents } from "@/lib/analytics/pdpCheckoutSnap";

test("PDP checkout URLs skip payment-method hub", () => {
  assert.equal(
    buildCheckoutPath("cod", { product: "hair-gummies", quantity: 2 }),
    "/checkout/cod?product=hair-gummies&quantity=2",
  );
  assert.equal(
    buildCheckoutPath("card", { product: "hair-gummies", quantity: 2 }),
    "/checkout/card?product=hair-gummies&quantity=2",
  );
});

test("firePdpCheckoutSnapEvents is callable for card and cod", () => {
  firePdpCheckoutSnapEvents({
    productSlug: "hair-gummies",
    quantity: 2,
    paymentMethod: "cod",
  });
  firePdpCheckoutSnapEvents({
    productSlug: "hair-gummies",
    quantity: 2,
    paymentMethod: "card",
  });
});
