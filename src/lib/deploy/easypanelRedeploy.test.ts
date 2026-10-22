import assert from "node:assert/strict";
import { test } from "node:test";
import { readEasypanelDeployWebhookUrl } from "@/lib/deploy/easypanelRedeploy";

test("readEasypanelDeployWebhookUrl rejects empty and non-http", () => {
  const prev = process.env.EASYPANEL_DEPLOY_WEBHOOK;
  process.env.EASYPANEL_DEPLOY_WEBHOOK = "";
  assert.equal(readEasypanelDeployWebhookUrl(), null);
  process.env.EASYPANEL_DEPLOY_WEBHOOK = "ftp://x";
  assert.equal(readEasypanelDeployWebhookUrl(), null);
  process.env.EASYPANEL_DEPLOY_WEBHOOK = "http://example/deploy";
  assert.equal(readEasypanelDeployWebhookUrl(), "http://example/deploy");
  if (prev === undefined) delete process.env.EASYPANEL_DEPLOY_WEBHOOK;
  else process.env.EASYPANEL_DEPLOY_WEBHOOK = prev;
});
