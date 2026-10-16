import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSnapPixelLoaderScript } from "./snapBootstrap.ts";

describe("buildSnapPixelLoaderScript", () => {
  it("matches official loader and injects scevent once", () => {
    const scripts: { src?: string }[] = [];
    const window = {} as { snaptr?: unknown };
    const document = {
      querySelector: () => null,
      createElement: () => {
        const el: { src?: string; async?: boolean } = {};
        scripts.push(el);
        return el;
      },
      getElementsByTagName: () => [
        { parentNode: { insertBefore: () => undefined } },
      ],
    };

    const fn = new Function("window", "document", buildSnapPixelLoaderScript());
    fn(window, document);
    fn(window, document);

    assert.equal(scripts.length, 1);
    assert.match(String(scripts[0].src), /scevent\.min\.js/);
    assert.equal(typeof window.snaptr, "function");
  });
});
