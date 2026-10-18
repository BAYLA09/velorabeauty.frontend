import assert from "node:assert/strict";
import test from "node:test";
import { portForPublicRedirect, resolveRedirectOrigin } from "@/lib/requestOrigin";
import { sanitizePublicSiteUrl } from "@/lib/siteUrl";

test("sanitizePublicSiteUrl maps 0.0.0.0 to localhost", () => {
  assert.equal(sanitizePublicSiteUrl("http://0.0.0.0:3000"), "http://localhost:3000");
});

test("sanitizePublicSiteUrl keeps normal hosts", () => {
  assert.equal(
    sanitizePublicSiteUrl("https://www.velorabeauty.world"),
    "https://www.velorabeauty.world",
  );
});

test("resolveRedirectOrigin uses siteOrigin for matching public host (no :3000 leak)", () => {
  assert.equal(
    resolveRedirectOrigin({
      hostHeader: "www.velorabeauty.world",
      urlHostname: "127.0.0.1",
      port: "3000",
      protocol: "https:",
      urlOrigin: "http://127.0.0.1:3000",
      siteOrigin: "https://www.velorabeauty.world",
    }),
    "https://www.velorabeauty.world",
  );
});

test("resolveRedirectOrigin keeps port on localhost", () => {
  assert.equal(
    resolveRedirectOrigin({
      hostHeader: "127.0.0.1",
      urlHostname: "127.0.0.1",
      port: "3099",
      protocol: "http:",
      urlOrigin: "http://127.0.0.1:3099",
      siteOrigin: null,
    }),
    "http://127.0.0.1:3099",
  );
});

test("portForPublicRedirect strips 3000 on public hosts", () => {
  assert.equal(portForPublicRedirect("www.velorabeauty.world", "https:", "3000"), "");
  assert.equal(portForPublicRedirect("127.0.0.1", "http:", "3099"), ":3099");
});
