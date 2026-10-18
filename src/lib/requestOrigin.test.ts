import assert from "node:assert/strict";
import test from "node:test";
import { sanitizePublicSiteUrl } from "@/lib/siteUrl";

test("sanitizePublicSiteUrl maps 0.0.0.0 to localhost", () => {
  assert.equal(sanitizePublicSiteUrl("http://0.0.0.0:3000"), "http://localhost:3000");
});

test("sanitizePublicSiteUrl keeps normal hosts", () => {
  assert.equal(
    sanitizePublicSiteUrl("https://www.velorabeauty.world"),
    "https://www.velorabeauty.world",
  );
});
