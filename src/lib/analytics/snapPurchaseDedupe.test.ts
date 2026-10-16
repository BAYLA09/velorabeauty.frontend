import { afterEach, describe, expect, it } from "vitest";
import { claimSnapPurchaseSend } from "@/lib/analytics/snapPurchaseDedupe";

describe("claimSnapPurchaseSend", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("allows first send only once per orderId", () => {
    expect(claimSnapPurchaseSend("order-abc")).toBe(true);
    expect(claimSnapPurchaseSend("order-abc")).toBe(false);
  });

  it("rejects empty orderId", () => {
    expect(claimSnapPurchaseSend("")).toBe(false);
  });
});
