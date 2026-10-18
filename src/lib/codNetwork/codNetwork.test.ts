import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifyCodNetworkWebhookSecret, readCodNetworkWebhookSecret } from "@/lib/codNetwork/auth";
import { extractStorefrontOrderIdFromInputs, parseLeadWebhookBody, parseOrderWebhookBody } from "@/lib/codNetwork/parseWebhook";
import { phonesMatch, uaePhoneMatchKey } from "@/lib/codNetwork/phoneMatch";
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
