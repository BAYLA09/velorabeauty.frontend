import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  STRIPE_BILLING_POSTAL_CODE_FALLBACK,
  buildConfirmPaymentBillingDetails,
} from "./stripeBillingDetails.ts";

describe("buildConfirmPaymentBillingDetails", () => {
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

  it("fills postal_code when the delivery form has none", () => {
    const details = buildConfirmPaymentBillingDetails({
      name: "نورة",
      addressLine1: "شارع الشيخ زايد",
      addressCity: "أبوظبي",
      addressState: "أبوظبي",
    });

    assert.equal(details.address.postal_code, STRIPE_BILLING_POSTAL_CODE_FALLBACK);
    assert.equal(details.address.line1, "شارع الشيخ زايد");
    assert.equal(details.address.city, "أبوظبي");
    assert.equal(details.address.state, "أبوظبي");
    assert.equal(details.address.country, "AE");
    assert.equal("line2" in details.address, false);
    assert.equal("email" in details, false);
    assert.equal("phone" in details, false);
  });

  it("still sends postal_code when only a name is present", () => {
    const details = buildConfirmPaymentBillingDetails({ name: "نورة" });

    assert.equal(details.address.postal_code, "00000");
    assert.equal(details.address.country, "AE");
    assert.ok(details.address.line1);
    assert.ok(details.address.city);
    assert.ok(details.address.state);
  });
});
