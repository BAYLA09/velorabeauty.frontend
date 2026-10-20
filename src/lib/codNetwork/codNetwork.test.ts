import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifyCodNetworkWebhookSecret, readCodNetworkWebhookSecret } from "@/lib/codNetwork/auth";
import { extractStorefrontOrderIdFromInputs, parseLeadWebhookBody, parseOrderWebhookBody } from "@/lib/codNetwork/parseWebhook";
import { phonesMatch, uaePhoneMatchKey } from "@/lib/codNetwork/phoneMatch";
import { buildSellerLeadBodyFromOrder } from "@/lib/codNetwork/buildSellerLead";
import { mapEmirateToCodNetworkCity } from "@/lib/codNetwork/emirateCity";
import {
  COD_NETWORK_ADDRESS_CONFIRM_BY_PHONE,
  COD_NETWORK_CITY_FALLBACK,
  resolveCodNetworkLeadAddress,
} from "@/lib/codNetwork/leadAddress";
import { createSellerLead } from "@/lib/codNetwork/sellerApiClient";
import { mapCodNetworkLeadStatus, mapCodNetworkOrderStatus } from "@/lib/codNetwork/statusMapping";
describe("COD Network webhook secret", () => {
  it("rejects wrong secret", () => {
    const prev = process.env.COD_NETWORK_WEBHOOK_SECRET;
    process.env.COD_NETWORK_WEBHOOK_SECRET = "test-secret-value";
    assert.equal(readCodNetworkWebhookSecret(), "test-secret-value");
    assert.equal(verifyCodNetworkWebhookSecret("wrong"), false);
    assert.equal(verifyCodNetworkWebhookSecret("test-secret-value"), true);
    process.env.COD_NETWORK_WEBHOOK_SECRET = prev;
  });
});

describe("COD Network payload parsing", () => {
  it("parses V2-style lead wrapper", () => {
    const lead = parseLeadWebhookBody({
      version: "V2",
      data: {
        lead: {
          id: 9912,
          phone: "0501234567",
          sku: "vitaminamin",
          status: "Confirmed",
          inputs: "orderId=abc-123-def; name=Test",
          created_at: "2026-10-18T10:00:00Z",
        },
      },
    });
    assert.ok(lead);
    assert.equal(lead!.leadId, "9912");
    assert.equal(lead!.status, "Confirmed");
    assert.equal(extractStorefrontOrderIdFromInputs(lead!.inputs), "abc-123-def");
  });

  it("parses order reference", () => {
    const order = parseOrderWebhookBody({
      data: {
        order: {
          reference: "CODNET-88421",
          lead_id: "9912",
          phone: "+971501234567",
          status: "Delivered",
        },
      },
    });
    assert.ok(order);
    assert.equal(order!.orderReference, "CODNET-88421");
    assert.equal(order!.leadId, "9912");
  });
});

describe("COD Network status mapping", () => {
  it("maps lead and order labels", () => {
    assert.equal(mapCodNetworkLeadStatus("No reply").status, "no_answer");
    assert.equal(mapCodNetworkLeadStatus("Confirmed").status, "confirmed");
    assert.equal(mapCodNetworkOrderStatus("Return on process").status, "returned");
    assert.equal(mapCodNetworkOrderStatus("Shipped").status, "shipped");
  });
});

describe("UAE phone matching", () => {
  it("normalizes local and international formats", () => {
    assert.equal(uaePhoneMatchKey("0501234567"), "+971501234567");
    assert.equal(phonesMatch("0501234567", "+971 50 123 4567"), true);
  });
});

describe("COD Network seller lead", () => {
  const baseOrder = {
    id: "abc-123",
    productSlug: "eye-serum",
    productName: "Eye",
    quantity: 1,
    paymentMethod: "cod",
    subtotalAed: 199,
    deliveryFeeAed: 20,
    totalAed: 219,
    customerName: "Sara",
    phone: "+971501234567",
    emirate: "الشارقة",
    address: "Al Majaz",
    status: "pending",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: null,
    customerEmail: null,
    marketingConsent: false,
    backendExternalCheckoutId: null,
    createdAt: "2026-10-20T12:00:00.000Z",
    cartLines: [],
    orderSource: "storefront" as const,
  };

  it("maps emirate to English city", () => {
    assert.equal(mapEmirateToCodNetworkCity("دبي"), "Dubai");
    assert.equal(mapEmirateToCodNetworkCity("الشارقة"), "Sharjah");
  });

  it("builds lead body with COD SKUs and fee-inclusive prices", () => {
    const built = buildSellerLeadBodyFromOrder(baseOrder, null);
    assert.ok(built && "body" in built);
    assert.equal(built.body.country, "AE");
    assert.equal(built.body.city, "Sharjah");
    assert.equal(built.body.address, "Al Majaz");
    assert.equal(built.body.items[0].sku, "vitaminamin");
    assert.equal(built.body.items[0].quantity, 1);
    assert.equal(built.body.items[0].price, 219);
  });

  it("uses phone-confirm fallbacks when address and emirate are empty", () => {
    const order = { ...baseOrder, emirate: "", address: "" };
    const loc = resolveCodNetworkLeadAddress(order);
    assert.equal(loc.city, COD_NETWORK_CITY_FALLBACK);
    assert.equal(loc.address, COD_NETWORK_ADDRESS_CONFIRM_BY_PHONE);

    const built = buildSellerLeadBodyFromOrder(order, null);
    assert.ok(built && "body" in built);
    assert.equal(built.body.city, COD_NETWORK_CITY_FALLBACK);
    assert.equal(built.body.address, COD_NETWORK_ADDRESS_CONFIRM_BY_PHONE);
  });

  it("createSellerLead uses mocked fetch only", async () => {
    const prevToken = process.env.COD_NETWORK_API_TOKEN;
    process.env.COD_NETWORK_API_TOKEN = "test-token-not-logged";
    const originalFetch = globalThis.fetch;
    let capturedUrl = "";
    let capturedBody = "";
    globalThis.fetch = async (input, init) => {
      capturedUrl = String(input);
      capturedBody = String(init?.body ?? "");
      return new Response(JSON.stringify({ status: "success", data: { id: 42 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };
    try {
      const result = await createSellerLead({
        phone: "+971501234567",
        name: "Sara",
        country: "AE",
        address: "x",
        city: "Dubai",
        items: [{ sku: "vitaminamin", quantity: 1, price: 219 }],
      });
      assert.equal(result.leadId, "42");
      assert.ok(capturedUrl.includes("/v2/seller/leads"));
      assert.ok(capturedBody.includes("vitaminamin"));
    } finally {
      globalThis.fetch = originalFetch;
      process.env.COD_NETWORK_API_TOKEN = prevToken;
    }
  });
});
