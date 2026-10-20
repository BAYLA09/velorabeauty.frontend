import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getGalleryBenefitLines,
  getProductBeforeAfterHeroSrc,
  getProductCarouselImageSrcs,
  getProductGalleryImageSrcs,
  getProductPdpScrollImages,
} from "./getProductGalleryImageSrcs.ts";

describe("getProductGalleryImageSrcs", () => {
  it("returns four unique PDP slots when all are set", () => {
    const srcs = getProductGalleryImageSrcs({
      placeholder: "x",
      src: "/main.webp",
      storySrc: "/story.webp",
      formulaSectionImageSrc: "/formula.webp",
      timelineSectionImageSrc: "/timeline.webp",
    });
    assert.equal(srcs.length, 4);
    assert.deepEqual(srcs, [
      "/main.webp",
      "/story.webp",
      "/formula.webp",
      "/timeline.webp",
    ]);
  });

  it("skips retired bundle composite image", () => {
    const srcs = getProductGalleryImageSrcs({
      placeholder: "x",
      src: "/images/products/bundle.webp?v=1",
      storySrc: "/images/products/pdp/hair-story.webp",
    });
    assert.equal(srcs.includes("/images/products/bundle.webp?v=1"), false);
    assert.ok(srcs.length > 0);
  });

  it("pads to four by reusing available assets", () => {
    const srcs = getProductGalleryImageSrcs({
      placeholder: "x",
      src: "/main.webp",
      storySrc: "/story.webp",
    });
    assert.equal(srcs.length, 4);
    assert.equal(srcs[0], "/main.webp");
    assert.equal(srcs[1], "/story.webp");
    assert.equal(srcs[2], "/main.webp");
    assert.equal(srcs[3], "/story.webp");
  });
});

describe("getProductBeforeAfterHeroSrc", () => {
  it("returns the timeline slot image", () => {
    const src = getProductBeforeAfterHeroSrc({
      placeholder: "x",
      src: "/main.webp",
      timelineSectionImageSrc: "/timeline.webp",
    });
    assert.equal(src, "/timeline.webp");
  });
});

describe("getProductCarouselImageSrcs", () => {
  it("returns three carousel slots without the timeline image", () => {
    const srcs = getProductCarouselImageSrcs({
      placeholder: "x",
      src: "/main.webp",
      storySrc: "/story.webp",
      formulaSectionImageSrc: "/formula.webp",
      timelineSectionImageSrc: "/timeline.webp",
    });
    assert.equal(srcs.length, 3);
    assert.deepEqual(srcs, ["/main.webp", "/story.webp", "/formula.webp"]);
    assert.equal(srcs.includes("/timeline.webp"), false);
  });
});

describe("getProductPdpScrollImages", () => {
  it("maps timeline, story, main, formula, and upsell fourth slot", () => {
    const imgs = getProductPdpScrollImages({
      placeholder: "x",
      src: "/main.webp",
      storySrc: "/story.webp",
      formulaSectionImageSrc: "/formula.webp",
      timelineSectionImageSrc: "/timeline.webp",
      upsellSlotSrc: { 1: "/upsell-1.webp", 2: "/u2", 3: "/u3" },
    });
    assert.equal(imgs.beforeAfter, "/timeline.webp");
    assert.equal(imgs.problem, "/story.webp");
    assert.equal(imgs.productMain, "/main.webp");
    assert.equal(imgs.storyOrFormula, "/formula.webp");
    assert.equal(imgs.fourth, "/upsell-1.webp");
  });
});

describe("getGalleryBenefitLines", () => {
  it("combines subhook and hero bullets without duplicates", () => {
    const lines = getGalleryBenefitLines({
      subhook: "أول سطر",
      heroBullets: ["ثاني", "ثالث"],
    });
    assert.deepEqual(lines, ["أول سطر", "ثاني", "ثالث"]);
  });
});
