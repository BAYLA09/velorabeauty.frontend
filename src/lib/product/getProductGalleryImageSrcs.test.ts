import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getGalleryBenefitLines,
  getProductGalleryImageSrcs,
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

describe("getGalleryBenefitLines", () => {
  it("combines subhook and hero bullets without duplicates", () => {
    const lines = getGalleryBenefitLines({
      subhook: "أول سطر",
      heroBullets: ["ثاني", "ثالث"],
    });
    assert.deepEqual(lines, ["أول سطر", "ثاني", "ثالث"]);
  });
});
