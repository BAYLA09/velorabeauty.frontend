import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { snapContentIdsFromOrder } from "../lib/analytics/snapContentIds.ts";
import {
  resolveOrderSheetSku,
  snapCatalogContentId,
  warmTeeCheckoutTotalAed,
  WARM_TEE_SKU,
  WARM_TEE_SLUG,
} from "./warmTeeProduct.ts";

describe("warmTeeProduct", () => {
  it("maps sheet SKU to WARMTEE", () => {
    assert.equal(resolveOrderSheetSku(WARM_TEE_SLUG), WARM_TEE_SKU);
    assert.equal(resolveOrderSheetSku("hair-gummies"), "hair-gummies");
  });

  it("prices checkout at 79 AED card / 99 COD", () => {
    assert.equal(warmTeeCheckoutTotalAed("card"), 79);
    assert.equal(warmTeeCheckoutTotalAed("cod"), 99);
  });

  it("uses WARMTEE as Snap content id", () => {
    assert.equal(snapCatalogContentId(WARM_TEE_SLUG), WARM_TEE_SKU);
    assert.deepEqual(
      snapContentIdsFromOrder({ productSlug: WARM_TEE_SLUG, cartLines: [] }),
      [WARM_TEE_SKU],
    );
  });
});
