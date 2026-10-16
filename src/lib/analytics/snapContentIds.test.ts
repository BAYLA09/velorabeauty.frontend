import { describe, expect, it } from "vitest";
import { snapContentIdsFromOrder, snapItemCount } from "@/lib/analytics/snapContentIds";

describe("snapContentIdsFromOrder", () => {
  it("returns catalog slugs from cart lines", () => {
    expect(
      snapContentIdsFromOrder({
        productSlug: "velora-offer",
        cartLines: [
          { slug: "hair-gummies", quantity: 2 },
          { slug: "eye-serum", quantity: 1 },
        ],
      }),
    ).toEqual(["hair-gummies", "eye-serum"]);
  });

  it("includes primary slug when catalog", () => {
    expect(
      snapContentIdsFromOrder({
        productSlug: "skin-gummies",
        cartLines: [],
      }),
    ).toEqual(["skin-gummies"]);
  });
});

describe("snapItemCount", () => {
  it("sums cart line quantities", () => {
    expect(
      snapItemCount({
        quantity: 1,
        cartLines: [
          { slug: "hair-gummies", quantity: 2 },
          { slug: "eye-serum", quantity: 1 },
        ],
      }),
    ).toBe(3);
  });
});
