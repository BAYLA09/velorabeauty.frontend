import test from "node:test";
import assert from "node:assert/strict";
import { snapLpViewContentValueAed } from "@/lib/analytics/snapLpViewContent";

test("hair-gummies snap LP fires VIEW_CONTENT with price", () => {
  assert.equal(snapLpViewContentValueAed("hair-gummies", 199), 199);
});

test("other snap LPs do not fire VIEW_CONTENT", () => {
  assert.equal(snapLpViewContentValueAed("skin-gummies", 199), undefined);
  assert.equal(snapLpViewContentValueAed("eye-serum", 199), undefined);
});
