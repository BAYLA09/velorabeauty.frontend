import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { shouldShowPdpStickyBar } from "@/lib/product/pdpStickyVisibility";

const productPageClientPath = join(
  process.cwd(),
  "src/components/product/ProductPageClient.tsx",
);
const purchasePanelPath = join(
  process.cwd(),
  "src/components/product/ProductPurchasePanel.tsx",
);

describe("catalog PDP layout", () => {
  it("renders a single quantity offer block (top buy box only)", () => {
    const source = readFileSync(productPageClientPath, "utf8");
    assert.ok(source.includes('id="buy-box"'));
    assert.ok(source.includes("ProductPurchasePanel"));
    assert.ok(!source.includes("ProductFinalCtaSection"));
    assert.ok(!source.includes("جاهزة تكملين طلبك"));
    assert.ok(source.includes("ProductMobileStickyBar"));
  });

  it("uses direct COD and card checkout buttons in purchase panel", () => {
    const source = readFileSync(purchasePanelPath, "utf8");
    assert.ok(source.includes("ProductPdpPaymentButtons"));
    assert.ok(source.includes('buildCheckoutPath("card"'));
    assert.ok(source.includes('buildCheckoutPath("cod"'));
    assert.ok(!source.includes("buildCheckoutPaymentStepPath"));
  });
});

describe("PDP sticky bar visibility", () => {
  it("shows when buy box is off screen", () => {
    assert.equal(shouldShowPdpStickyBar(false), true);
    assert.equal(shouldShowPdpStickyBar(true), false);
  });
});
