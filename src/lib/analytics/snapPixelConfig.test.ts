import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getSnapPixelId,
  LEGACY_SNAP_PIXEL_ID,
  VELORA_SNAP_PIXEL_ID,
} from "../../config/snapPixel.ts";

describe("snap pixel config", () => {
  it("defaults to Velora UAE pixel and rejects legacy id", () => {
    const prev = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
    delete process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
    assert.equal(getSnapPixelId(), VELORA_SNAP_PIXEL_ID);

    process.env.NEXT_PUBLIC_SNAP_PIXEL_ID = LEGACY_SNAP_PIXEL_ID;
    assert.equal(getSnapPixelId(), VELORA_SNAP_PIXEL_ID);

    process.env.NEXT_PUBLIC_SNAP_PIXEL_ID = "custom-pixel-id";
    assert.equal(getSnapPixelId(), "custom-pixel-id");

    if (prev) process.env.NEXT_PUBLIC_SNAP_PIXEL_ID = prev;
    else delete process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
  });
});
