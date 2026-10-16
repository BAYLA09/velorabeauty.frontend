import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { snapContentIdsFromOrder, snapItemCount } from "./snapContentIds.ts";

describe("snapContentIdsFromOrder", () => {
  it("returns catalog slugs from cart lines", () => {
    assert.deepEqual(
      snapContentIdsFromOrder({
        productSlug: "velora-offer",
        cartLines: [
          { slug: "hair-gummies", quantity: 2 },
          { slug: "eye-serum", quantity: 1 },
        ],
      }),
      ["hair-gummies", "eye-serum"],
    );
  });

  it("includes primary slug when catalog", () => {
    assert.deepEqual(
      snapContentIdsFromOrder({
        productSlug: "skin-gummies",
        cartLines: [],
      }),
      ["skin-gummies"],
    );
  });

  it("ignores non-catalog slugs", () => {
    assert.deepEqual(
      snapContentIdsFromOrder({
        productSlug: "stripe-live-test",
        cartLines: [{ slug: "unknown-sku", quantity: 1 }],
      }),
      [],
    );
  });
});

describe("snapItemCount", () => {
  it("sums cart line quantities", () => {
    assert.equal(
      snapItemCount({
        quantity: 1,
        cartLines: [
          { slug: "hair-gummies", quantity: 2 },
          { slug: "eye-serum", quantity: 1 },
        ],
      }),
      3,
    );
  });
});
