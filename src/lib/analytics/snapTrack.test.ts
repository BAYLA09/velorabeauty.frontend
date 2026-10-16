import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { snapTrack } from "./snapTrack.ts";

describe("snapTrack", () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { snaptr?: unknown }).snaptr;
    delete (globalThis as { document?: unknown }).document;
  });

  it("does not install orphan snaptr stubs", () => {
    (globalThis as typeof globalThis & { window?: typeof globalThis }).window =
      globalThis;
    globalThis.document = {
      querySelector: () => null,
    } as Document;
    assert.equal(snapTrack("PAGE_VIEW"), false);
    assert.equal(globalThis.snaptr, undefined);
  });

  it("tracks when official SDK queue is present", () => {
    (globalThis as typeof globalThis & { window?: typeof globalThis }).window =
      globalThis;
    const calls: unknown[][] = [];
    globalThis.document = {
      querySelector: () => ({ src: "https://sc-static.net/scevent.min.js" }),
    } as Document;
    globalThis.snaptr = Object.assign(
      (...args: unknown[]) => {
        calls.push(args);
      },
      { handleRequest: () => undefined, queue: [] },
    );
    const ok = snapTrack("VIEW_CONTENT", {
      price: 199,
      currency: "AED",
      item_ids: ["hair-gummies"],
    });
    assert.equal(ok, true);
    assert.equal(calls[0][0], "track");
    assert.equal(calls[0][1], "VIEW_CONTENT");
  });

  it("returns false when window is missing", () => {
    delete (globalThis as { window?: unknown }).window;
    assert.equal(snapTrack("PAGE_VIEW"), false);
  });
});
