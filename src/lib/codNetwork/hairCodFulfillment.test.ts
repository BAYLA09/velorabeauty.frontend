import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSellerLeadBodyFromOrder } from "@/lib/codNetwork/buildSellerLead";
import { buildCodSheetRows } from "@/lib/ordersSheets/buildSheetRow";
import type { OrderRecord } from "@/lib/ordersRepository";

const hairCodOrder: OrderRecord = {
  id: "hair-order-1",
  productSlug: "hair-gummies",
  productName: "علكات الشعر",
  quantity: 1,
  paymentMethod: "cod",
  subtotalAed: 199,
  deliveryFeeAed: 20,
  totalAed: 219,
  customerName: "نورة",
  phone: "+971501234567",
  emirate: "دبي",
  address: "Marina",
  status: "pending",
  stripeCheckoutSessionId: null,
  stripePaymentIntentId: null,
  customerEmail: null,
  marketingConsent: false,
  backendExternalCheckoutId: null,
  createdAt: "2026-10-21T12:00:00.000Z",
  cartLines: [],
  orderSource: "storefront",
};

describe("hair-gummies COD fulfillment", () => {
  it("pushes HAIRAMIN in COD Network lead with fee-inclusive unit price", () => {
    const built = buildSellerLeadBodyFromOrder(hairCodOrder, null);
    assert.ok(built && "body" in built);
    assert.equal(built.body.items.length, 1);
    assert.equal(built.body.items[0].sku, "HAIRAMIN");
    assert.equal(built.body.items[0].quantity, 1);
    assert.equal(built.body.items[0].price, 219);
  });

  it("writes HAIRAMIN and total incl. 20 AED delivery on Google Sheet row", () => {
    const rows = buildCodSheetRows(hairCodOrder, null, null);
    assert.equal(rows.length, 1);
    const row = rows[0];
    assert.equal(row[6], "HAIRAMIN");
    assert.equal(row[9], 219);
    assert.ok(String(row[11]).includes("delivery=20"));
    assert.ok(String(row[11]).includes("orderTotal=219"));
  });
});
