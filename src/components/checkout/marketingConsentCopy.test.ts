import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MARKETING_CONSENT_PRIMARY_LABEL,
  MARKETING_CONSENT_SECONDARY_LABEL,
} from "./marketingConsentCopy.ts";

describe("marketing consent copy", () => {
  it("uses the approved primary and secondary Arabic labels", () => {
    assert.equal(
      MARKETING_CONSENT_PRIMARY_LABEL,
      "أرسلوا لي تذكيرًا بسلتي وعروضًا حصرية",
    );
    assert.match(MARKETING_CONSENT_SECONDARY_LABEL, /إلغاء الاشتراك/);
    assert.match(MARKETING_CONSENT_SECONDARY_LABEL, /إتمام الشراء/);
  });
});
