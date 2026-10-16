import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSnapPixelLoaderScript } from "./snapBootstrap.ts";

describe("buildSnapPixelLoaderScript", () => {
  it("loads scevent even when an orphan snaptr stub already exists", () => {
    const scripts: { src?: string; async?: boolean }[] = [];
    const snapCalls: unknown[][] = [];
    const window = {
      snaptr: Object.assign((...args: unknown[]) => {
        snapCalls.push(args);
      }, { queue: [] as unknown[][] }),
    };
    const document = {
      querySelector: () => null,
      createElement: (tag: string) => {
        const el: {
          tagName?: string;
          src?: string;
          async?: boolean;
          setAttribute: () => void;
        } = {
          tagName: tag,
          setAttribute: () => undefined,
        };
        scripts.push(el);
        return el;
      },
      getElementsByTagName: () => [
        { parentNode: { insertBefore: (node: unknown) => undefined } },
      ],
    };

    const fn = new Function("window", "document", buildSnapPixelLoaderScript());
    fn(window, document);

    assert.equal(scripts.length, 1);
    assert.match(String(scripts[0].src), /scevent\.min\.js/);
  });
});
