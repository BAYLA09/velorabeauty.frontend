import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  STRIPE_CHECKOUT_BILLING_COUNTRY,
  STRIPE_CHECKOUT_BILLING_POSTAL_CODE,
  stripePaymentElementFields,
} from "./stripePaymentElementConfig.ts";
import {
  STRIPE_BILLING_EMAIL_FALLBACK,
  STRIPE_BILLING_NAME_FALLBACK,
  STRIPE_BILLING_PHONE_FALLBACK,
  STRIPE_BILLING_POSTAL_CODE_FALLBACK,
  buildConfirmPaymentBillingDetails,
  resolveStripeBillingEmail,
} from "./stripeBillingDetails.ts";

const here = dirname(fileURLToPath(import.meta.url));

function valueAt(details: ReturnType<typeof buildConfirmPaymentBillingDetails>, path: string) {
  const [head, child] = path.split(".");
  if (child) {
    const address = details.address as Record<string, string | undefined>;
    return address[child];
  }
  return details[head as "name" | "email" | "phone"];
}

describe("buildConfirmPaymentBillingDetails", () => {
  it("uses the same postal fallback as the Payment Element config", () => {
    assert.equal(STRIPE_BILLING_POSTAL_CODE_FALLBACK, STRIPE_CHECKOUT_BILLING_POSTAL_CODE);
    assert.equal(STRIPE_CHECKOUT_BILLING_COUNTRY, "AE");
  });

  it("passes the full checkout address, including postal_code", () => {
    const details = buildConfirmPaymentBillingDetails({
      name: "  نورة العتيبي  ",
      email: " nora@example.com ",
      phone: " +971501234567 ",
      addressLine1: "دبي مارينا، برج 5",
      addressLine2: "شقة 1204",
      addressCity: "دبي",
      addressState: "دبي",
      addressPostalCode: "12345",
      addressCountry: "ae",
    });

    assert.deepEqual(details, {
      name: "نورة العتيبي",
      email: "nora@example.com",
      phone: "+971501234567",
      address: {
        line1: "دبي مارينا، برج 5",
        line2: "شقة 1204",
        city: "دبي",
        state: "دبي",
        postal_code: "12345",
        country: "AE",
      },
    });
  });

  it("fills every hidden billing field when the form leaves them blank", () => {
    const details = buildConfirmPaymentBillingDetails({
      name: "   ",
      email: "",
      phone: " ",
      addressLine1: "شارع الشيخ زايد",
      addressCity: "أبوظبي",
      addressState: "أبوظبي",
    });

    assert.equal(details.name, STRIPE_BILLING_NAME_FALLBACK);
    assert.equal(details.email, STRIPE_BILLING_EMAIL_FALLBACK);
    assert.equal(details.phone, STRIPE_BILLING_PHONE_FALLBACK);
    assert.equal(details.address.postal_code, STRIPE_BILLING_POSTAL_CODE_FALLBACK);
    assert.equal(details.address.line1, "شارع الشيخ زايد");
    assert.equal(details.address.city, "أبوظبي");
    assert.equal(details.address.state, "أبوظبي");
    assert.equal(details.address.country, "AE");
    assert.equal("line2" in details.address, false);
    assert.match(details.email, /@/);
  });

  it("replaces an invalid email with a Stripe-accepted address", () => {
    assert.equal(resolveStripeBillingEmail("not-an-email"), STRIPE_BILLING_EMAIL_FALLBACK);
    assert.equal(resolveStripeBillingEmail("  nora@example.com "), "nora@example.com");
    const details = buildConfirmPaymentBillingDetails({
      name: "نورة",
      email: "nora@",
    });
    assert.equal(details.email, STRIPE_BILLING_EMAIL_FALLBACK);
  });

  it("sends every billingDetails field the Payment Element sets to never", () => {
    const details = buildConfirmPaymentBillingDetails({ name: "نورة" });
    const hidden = stripePaymentElementFields.billingDetails;

    for (const [key, mode] of Object.entries(hidden)) {
      assert.equal(mode, "never", `${key} should stay hidden on the Element`);
      if (key === "address") {
        for (const part of ["line1", "city", "state", "postal_code", "country"] as const) {
          assert.ok(details.address[part], `address.${part} must be sent when address is never`);
        }
      } else {
        assert.ok(valueAt(details, key), `${key} must be sent when it is never`);
      }
    }
  });

  it("uses the same never-fields in the React element and the pre-hydration mount", () => {
    const react = readFileSync(
      join(here, "../../components/checkout/CheckoutStripePaymentElement.tsx"),
      "utf8",
    );
    const vanilla = readFileSync(join(here, "../stripeVanillaMountScript.ts"), "utf8");
    assert.match(react, /stripePaymentElementOptions = stripePaymentElementCreateOptions/);
    assert.match(vanilla, /elements\.create\("payment", \$\{peOptions\}\)/);
    assert.match(vanilla, /stripePaymentElementCreateOptions/);
    assert.deepEqual(stripePaymentElementFields.billingDetails, {
      name: "never",
      email: "never",
      phone: "never",
      address: "never",
    });
  });
});
