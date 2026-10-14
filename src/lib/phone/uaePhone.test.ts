import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeUaePhoneTyping, validateUaeMobilePhone } from "./uaePhone.ts";

describe("validateUaeMobilePhone", () => {
  it("accepts 05 local 10 digits", () => {
    const r = validateUaeMobilePhone("0501234567");
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.normalized, "+971501234567");
      assert.equal(r.display, "0501234567");
    }
  });

  it("accepts +971 international", () => {
    const r = validateUaeMobilePhone("+971 50 123 4567");
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.normalized, "+971501234567");
  });

  it("sanitize keeps + at start", () => {
    assert.equal(sanitizeUaePhoneTyping("+971 50"), "+971 50");
  });

  it("rejects too short 05", () => {
    assert.equal(validateUaeMobilePhone("050123456").ok, false);
  });

  it("rejects landline-style 04", () => {
    assert.equal(validateUaeMobilePhone("0412345678").ok, false);
  });
});
