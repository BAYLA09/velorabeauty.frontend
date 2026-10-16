import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasSnapPurchaseBeenSent,
  markSnapPurchaseSent,
} from "./snapPurchaseDedupe.ts";

const store = new Map<string, string>();

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
}

describe("snap purchase dedupe", () => {
  afterEach(() => {
    store.clear();
  });

  it("marks sent only after explicit mark", () => {
    installBrowserMocks();
    assert.equal(hasSnapPurchaseBeenSent("order-abc"), false);
    markSnapPurchaseSent("order-abc");
    assert.equal(hasSnapPurchaseBeenSent("order-abc"), true);
  });

  it("rejects empty orderId", () => {
    installBrowserMocks();
    assert.equal(hasSnapPurchaseBeenSent(""), true);
  });
});
