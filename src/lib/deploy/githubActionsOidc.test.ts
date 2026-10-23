import assert from "node:assert/strict";
import { test } from "node:test";
import { deployOidcAllowedFromPayload } from "@/lib/deploy/githubActionsOidc";

test("deployOidcAllowedFromPayload accepts main branch workflow", () => {
  assert.equal(
    deployOidcAllowedFromPayload({
      sub: "repo:BAYLA09/velorabeauty.frontend:ref:refs/heads/main",
    }),
    true,
  );
});

test("deployOidcAllowedFromPayload rejects other repos", () => {
  assert.equal(
    deployOidcAllowedFromPayload({
      sub: "repo:evil/other:ref:refs/heads/main",
    }),
    false,
  );
});
