import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { trackVerifiedPurchaseOnce } from "./trackPurchaseOnce.ts";

const store = new Map<string, string>();
const snapCalls: unknown[][] = [];

function installBrowserMocks() {
  (globalThis as typeof globalThis & { window?: typeof globalThis }).window =
    globalThis;
  globalThis.sessionStorage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
  } as Storage;
  globalThis.dataLayer = [];
  snapCalls.length = 0;
  globalThis.snaptr = (...args: unknown[]) => {
    snapCalls.push(args);
  };
}

describe("trackVerifiedPurchaseOnce", () => {
  afterEach(() => {
    store.clear();
    snapCalls.length = 0;
  });

  it("dedupes by order id across calls", () => {
    installBrowserMocks();
    const input = {
      orderId: "order-dedupe-1",
      valueAed: 199,
      paymentMethod: "cod" as const,
      productSlug: "hair-gummies",
      quantity: 1 as const,
    };
    trackVerifiedPurchaseOnce(input);
    trackVerifiedPurchaseOnce(input);
    const purchaseTracks = snapCalls.filter(
      (c) => c[0] === "track" && c[1] === "PURCHASE",
    );
    assert.equal(purchaseTracks.length, 1);
  });

  it("skips non-catalog products (no PURCHASE)", () => {
    installBrowserMocks();
    trackVerifiedPurchaseOnce({
      orderId: "order-no-catalog",
      valueAed: 249,
      paymentMethod: "card",
      productSlug: "stripe-live-test",
      quantity: 1,
    });
    const purchaseTracks = snapCalls.filter(
      (c) => c[0] === "track" && c[1] === "PURCHASE",
    );
    assert.equal(purchaseTracks.length, 0);
    assert.equal(store.has("velora_snap_purchase_order-no-catalog"), false);
  });
});
