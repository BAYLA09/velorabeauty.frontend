import assert from "node:assert/strict";
import test from "node:test";
import { buildRedirectLocation } from "@/lib/redirectkiller/mergeQueryStrings";

test("buildRedirectLocation preserves incoming params on path-only destination", () => {
  const incoming = new URLSearchParams("utm_source=facebook&utm_campaign=test");
  assert.equal(
    buildRedirectLocation("/products/hair-gummies", incoming),
    "/products/hair-gummies?utm_source=facebook&utm_campaign=test",
  );
});

test("buildRedirectLocation does not overwrite destination query keys", () => {
  const incoming = new URLSearchParams("utm_source=facebook&foo=bar");
  assert.equal(
    buildRedirectLocation("/products/hair-gummies?foo=dest", incoming),
    "/products/hair-gummies?foo=dest&utm_source=facebook",
  );
});
