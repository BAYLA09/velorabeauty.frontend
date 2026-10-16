import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { ensureSnaptrQueue, snapTrack } from "./snapTrack.ts";

describe("snapTrack", () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { snaptr?: unknown }).snaptr;
  });

  it("queues events when SDK not loaded yet", () => {
    (globalThis as typeof globalThis & { window?: typeof globalThis }).window =
      globalThis;
    delete globalThis.snaptr;
    assert.equal(ensureSnaptrQueue(), true);
    const ok = snapTrack("VIEW_CONTENT", {
      price: 199,
      currency: "AED",
      item_ids: ["hair-gummies"],
    });
    assert.equal(ok, true);
    const snaptr = globalThis.snaptr as { queue?: unknown[][] };
    assert.ok(snaptr?.queue?.length);
  });

  it("returns false when window is missing", () => {
    delete (globalThis as { window?: unknown }).window;
    assert.equal(snapTrack("PAGE_VIEW"), false);
  });
});
