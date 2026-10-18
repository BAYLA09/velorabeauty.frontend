import assert from "node:assert/strict";
import test from "node:test";
import {
  validateInternalDestination,
  wouldRedirectLoop,
} from "@/lib/redirectkiller/validateDestination";

test("validateInternalDestination rejects external URLs", () => {
  assert.equal(validateInternalDestination("https://evil.com").ok, false);
});

test("validateInternalDestination allows product paths", () => {
  const r = validateInternalDestination("/products/hair-gummies");
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.path, "/products/hair-gummies");
});

test("validateInternalDestination allows brand landing /lp", () => {
  const r = validateInternalDestination("/lp");
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.path, "/lp");
});

test("validateInternalDestination rejects ads paths", () => {
  assert.equal(validateInternalDestination("/ads/foo").ok, false);
});

test("wouldRedirectLoop detects slug pointing to same ads path", () => {
  assert.equal(wouldRedirectLoop("/ads/hair-ad", "hair-ad"), true);
});
