import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSnapPixelLoaderScript } from "./snapBootstrap.ts";

describe("buildSnapPixelLoaderScript", () => {
  it("loads scevent even when an orphan snaptr stub already exists", () => {
    const scripts: { src?: string; async?: boolean; getAttribute?: (k: string) => string }[] =
      [];
    const window = {
      snaptr: Object.assign((..._args: unknown[]) => undefined, {
        queue: [] as unknown[][],
      }),
    };
    const document = {
      querySelector: () => null,
      createElement: () => {
        const attrs: Record<string, string> = {};
        const el = {
          src: undefined as string | undefined,
          async: undefined as boolean | undefined,
          setAttribute(k: string, v: string) {
            attrs[k] = v;
          },
          getAttribute(k: string) {
            return attrs[k];
          },
        };
        scripts.push(el);
        return el;
      },
      getElementsByTagName: () => [
        { parentNode: { insertBefore: () => undefined } },
      ],
    };

    const fn = new Function("window", "document", buildSnapPixelLoaderScript());
    fn(window, document);

    assert.equal(scripts.length, 1);
    assert.match(String(scripts[0].src), /scevent\.min\.js/);
    assert.equal(scripts[0].getAttribute?.("data-velora-snap"), "1");
  });
});
