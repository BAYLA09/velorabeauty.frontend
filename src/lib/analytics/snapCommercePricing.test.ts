import assert from "node:assert/strict";
import test from "node:test";
import {
  snapAddToCartDeltaAed,
  snapMerchandiseValueAed,
} from "@/lib/analytics/snapCommercePricing";

test("PDP 2-box selection uses bundle price 249 not 398", () => {
  assert.equal(
    snapMerchandiseValueAed({ productSlug: "hair-gummies", quantity: 2 }),
    249,
  );
  assert.equal(snapAddToCartDeltaAed([], "hair-gummies", 2), 249);
});

test("single unit add uses 199", () => {
  assert.equal(snapAddToCartDeltaAed([], "skin-gummies", 1), 199);
});
