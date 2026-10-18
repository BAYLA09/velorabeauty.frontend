import assert from "node:assert/strict";
import test from "node:test";
import { getBuiltinAdDestination } from "@/lib/redirectkiller/builtinAdRedirects";

test("getBuiltinAdDestination returns hair-ads → hair gummies PDP", () => {
  assert.equal(getBuiltinAdDestination("hair-ads"), "/products/hair-gummies");
});

test("getBuiltinAdDestination returns null for unknown slug", () => {
  assert.equal(getBuiltinAdDestination("unknown-campaign"), null);
});
