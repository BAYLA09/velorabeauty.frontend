import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { codTimelineSteps } from "./codThankYouTimeline.ts";

describe("codTimelineSteps", () => {
  it("pending COD keeps confirm as active", () => {
    const steps = codTimelineSteps("pending");
    assert.equal(steps[0]?.state, "done");
    assert.equal(steps[1]?.state, "active");
    assert.equal(steps[2]?.state, "upcoming");
  });

  it("preparing moves active to pack step", () => {
    const steps = codTimelineSteps("preparing");
    assert.equal(steps[1]?.state, "done");
    assert.equal(steps[2]?.state, "active");
  });
});
