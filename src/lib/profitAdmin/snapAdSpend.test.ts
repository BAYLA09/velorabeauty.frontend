import assert from "node:assert/strict";
import test from "node:test";
import { computeSnapchatAdSpendUsd } from "@/lib/profitAdmin/snapAdSpend";

test("computeSnapchatAdSpendUsd multiplies CPA by purchase count", () => {
  assert.equal(computeSnapchatAdSpendUsd(4, 10), 40);
  assert.equal(computeSnapchatAdSpendUsd(0, 99), 0);
  assert.equal(computeSnapchatAdSpendUsd(5, 0), 0);
});
