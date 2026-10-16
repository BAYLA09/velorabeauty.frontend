import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  STRIPE_TEST_PRODUCT_SLUG,
  isStripeTestCheckoutEnabled,
  isStripeTestProductSlug,
  stripeTestCardCheckoutPath,
  stripeTestProductPagePath,
} from "../../config/stripeTestCheckout.ts";

const ENV_KEYS = ["STRIPE_TEST_CHECKOUT_ENABLED", "STRIPE_TEST_CHECKOUT_TOKEN"] as const;

function clearStripeTestEnv() {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

describe("stripe test checkout config", () => {
  afterEach(() => {
    clearStripeTestEnv();
  });

  it("recognizes the canonical test product slug", () => {
    assert.equal(isStripeTestProductSlug(STRIPE_TEST_PRODUCT_SLUG), true);
    assert.equal(isStripeTestProductSlug("hair-gummies"), false);
  });

  it("builds card checkout and PDP paths for the test slug", () => {
    const checkoutPath = stripeTestCardCheckoutPath();
    assert.match(checkoutPath, /^\/checkout\/card\?/);
    assert.ok(checkoutPath.includes(`product=${STRIPE_TEST_PRODUCT_SLUG}`));
    assert.equal(stripeTestProductPagePath(), `/products/${STRIPE_TEST_PRODUCT_SLUG}`);
  });

  it("is disabled unless STRIPE_TEST_CHECKOUT_ENABLED is set", () => {
    clearStripeTestEnv();
    assert.equal(isStripeTestCheckoutEnabled(), false);
    process.env.STRIPE_TEST_CHECKOUT_ENABLED = "true";
    assert.equal(isStripeTestCheckoutEnabled(), true);
  });
});
