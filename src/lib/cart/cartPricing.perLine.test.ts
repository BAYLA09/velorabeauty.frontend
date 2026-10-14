import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getMerchandiseAedForLineQuantity } from "../../config/pricing.ts";

function sumLines(quantities: number[]): number {
  return quantities.reduce(
    (sum, qty) => sum + (getMerchandiseAedForLineQuantity(qty) ?? 0),
    0,
  );
}

describe("per-line cart pricing", () => {
  it("2× hair + 1× skin = 448 AED", () => {
    assert.equal(sumLines([2, 1]), 448);
  });

  it("2× hair alone = 249 AED", () => {
    assert.equal(sumLines([2]), 249);
  });

  it("1× hair + 1× eye = 398 AED", () => {
    assert.equal(sumLines([1, 1]), 398);
  });
});
