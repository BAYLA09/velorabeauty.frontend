import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAddMoreUnits,
  getUpsellRecommendations,
} from "@/lib/cart/cartUpsell";
import { cartDrawerCopy } from "@/components/cart/cartDrawerCopy";

describe("cart upsell recommendations", () => {
  it("lists all catalog products when cart is empty", () => {
    const recs = getUpsellRecommendations([]);
    assert.equal(recs.length, 3);
    const slugs = new Set(recs.map((r) => r.slug));
    assert.ok(slugs.has("hair-gummies"));
    assert.ok(slugs.has("skin-gummies"));
    assert.ok(slugs.has("eye-serum"));
  });

  it("excludes products already in the cart", () => {
    const recs = getUpsellRecommendations([{ slug: "skin-gummies", quantity: 1 }]);
    assert.equal(recs.length, 2);
    assert.ok(!recs.some((r) => r.slug === "skin-gummies"));
  });

  it("blocks adds when cart has four units", () => {
    assert.equal(
      canAddMoreUnits([
        { slug: "hair-gummies", quantity: 2 },
        { slug: "skin-gummies", quantity: 2 },
      ]),
      false,
    );
  });
});

describe("cart drawer copy", () => {
  it("does not show the legacy mixed-pricing hint in empty state", () => {
    assert.ok(!cartDrawerCopy.emptyHint.includes("199 / 249 / 339"));
    assert.ok(cartDrawerCopy.upsellAlsoLike.length > 0);
  });
});
