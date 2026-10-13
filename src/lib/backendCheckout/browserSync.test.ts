import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BACKEND_SYNC_PATH } from "./browserSync.ts";

describe("browser backend sync", () => {
  it("targets the public capture route", () => {
    assert.equal(BACKEND_SYNC_PATH, "/api/checkout/backend-sync");
  });
});
