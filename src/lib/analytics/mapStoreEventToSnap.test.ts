import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { forwardStoreEventToSnap } from "./mapStoreEventToSnap.ts";

const store: unknown[][] = [];

function installSnapMock() {
  (globalThis as typeof globalThis & { window?: typeof globalThis }).window =
    globalThis;
  globalThis.document = {
    querySelector: () => ({ src: "https://sc-static.net/scevent.min.js" }),
  } as Document;
  globalThis.snaptr = Object.assign(
    (...args: unknown[]) => {
      store.push(args);
    },
    { handleRequest: () => undefined, queue: [] },
  );
}

describe("forwardStoreEventToSnap", () => {
  it("maps PURCHASE with transaction_id and payment_type", () => {
    store.length = 0;
    installSnapMock();
    const ok = forwardStoreEventToSnap({
      event: "purchase",
      order_id: "ord-1",
      order_ref: "ORD1",
      value_aed: 199,
      currency: "AED",
      payment_method: "card",
      content_ids: ["hair-gummies"],
      number_items: 1,
    });
    assert.equal(ok, true);
    assert.equal(store.length, 1);
    assert.deepEqual(store[0][0], "track");
    assert.equal(store[0][1], "PURCHASE");
    const params = store[0][2] as Record<string, unknown>;
    assert.equal(params.transaction_id, "ord-1");
    assert.equal(params.payment_type, "card");
    assert.equal(params.event_id, "ord-1");
    assert.equal(params.currency, "AED");
  });
});
