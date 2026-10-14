import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAppsScriptWebhookSuccess } from "./webhookResponse.ts";

describe("isAppsScriptWebhookSuccess", () => {
  it("accepts ok and duplicate JSON", () => {
    assert.equal(isAppsScriptWebhookSuccess({ ok: true, status: 200 }, '{"ok":true}'), true);
    assert.equal(
      isAppsScriptWebhookSuccess({ ok: true, status: 200 }, '{"duplicate":true}'),
      true,
    );
  });

  it("rejects HTML 200 and explicit ok:false", () => {
    assert.equal(
      isAppsScriptWebhookSuccess({ ok: true, status: 200 }, "<html>error</html>"),
      false,
    );
    assert.equal(
      isAppsScriptWebhookSuccess({ ok: true, status: 200 }, '{"ok":false,"error":"unauthorized"}'),
      false,
    );
  });
});
