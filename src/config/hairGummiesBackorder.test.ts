import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HAIR_GUMMIES_BACKORDER,
  isHairGummiesBackorderReservation,
} from "@/config/hairGummiesBackorder";

describe("hairGummiesBackorder", () => {
  it("is enabled only for hair-gummies when flag is on", () => {
    assert.equal(HAIR_GUMMIES_BACKORDER, true);
    assert.equal(isHairGummiesBackorderReservation("hair-gummies"), true);
    assert.equal(isHairGummiesBackorderReservation("skin-gummies"), false);
    assert.equal(isHairGummiesBackorderReservation("eye-serum"), false);
  });
});
