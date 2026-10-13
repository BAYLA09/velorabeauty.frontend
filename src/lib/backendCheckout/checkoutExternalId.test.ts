import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  CHECKOUT_EXTERNAL_ID_STORAGE_KEY,
  clearStoredCheckoutExternalId,
  readStableCheckoutExternalId,
  resolveCheckoutExternalId,
} from "./checkoutExternalId.ts";

const ORDER_UUID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";

function installSessionStorage(): void {
  const data = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return data.size;
    },
    clear() {
      data.clear();
    },
    getItem(key: string) {
      return data.has(key) ? data.get(key)! : null;
    },
    key(index: number) {
      return [...data.keys()][index] ?? null;
    },
    removeItem(key: string) {
      data.delete(key);
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
  };
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: storage,
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: globalThis,
  });
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => ORDER_UUID,
    },
  });
}

describe("checkout external id", () => {
  beforeEach(() => {
    installSessionStorage();
    clearStoredCheckoutExternalId();
  });

  it("reuses the session id for submit when the hook value is still empty", () => {
    readStableCheckoutExternalId();
    assert.equal(resolveCheckoutExternalId(""), ORDER_UUID);
    assert.equal(resolveCheckoutExternalId(undefined), ORDER_UUID);
  });

  it("prefers a valid hook value over sessionStorage", () => {
    const hookId = "11111111-1111-4111-8111-111111111111";
    globalThis.sessionStorage.setItem(CHECKOUT_EXTERNAL_ID_STORAGE_KEY, ORDER_UUID);
    assert.equal(resolveCheckoutExternalId(hookId), hookId);
  });

  it("creates one id per session for sync and order", () => {
    const fromSync = readStableCheckoutExternalId();
    const forOrder = resolveCheckoutExternalId("");
    assert.equal(fromSync, forOrder);
    assert.equal(
      globalThis.sessionStorage.getItem(CHECKOUT_EXTERNAL_ID_STORAGE_KEY),
      ORDER_UUID,
    );
  });
});
