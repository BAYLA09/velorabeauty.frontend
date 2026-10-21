import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HAIR_GUMMIES_BACKORDER,
  isHairGummiesBackorderReservation,
} from "@/config/hairGummiesBackorder";

describe("hairGummiesBackorder", () => {
  it("is off in stock — normal checkout for hair-gummies", () => {
    assert.equal(HAIR_GUMMIES_BACKORDER, false);
    assert.equal(isHairGummiesBackorderReservation("hair-gummies"), false);
    assert.equal(isHairGummiesBackorderReservation("skin-gummies"), false);
    assert.equal(isHairGummiesBackorderReservation("eye-serum"), false);
  });
});
