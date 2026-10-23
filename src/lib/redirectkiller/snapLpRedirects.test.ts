import assert from "node:assert/strict";
import test from "node:test";
import {
  getSnapLpPdpRedirect,
  getSnapLpRedirectFromPathname,
} from "@/lib/redirectkiller/snapLpRedirects";

test("hair-gummies snap LP redirects to hair PDP", () => {
  assert.equal(getSnapLpPdpRedirect("hair-gummies"), "/products/hair-gummies");
  assert.equal(
    getSnapLpRedirectFromPathname("/lp/snap/hair-gummies"),
    "/products/hair-gummies",
  );
  assert.equal(
    getSnapLpRedirectFromPathname("/lp/snap/hair-gummies/"),
    "/products/hair-gummies",
  );
});

test("other snap LP slugs are not redirected", () => {
  assert.equal(getSnapLpPdpRedirect("skin-gummies"), null);
  assert.equal(getSnapLpPdpRedirect("eye-serum"), null);
  assert.equal(getSnapLpRedirectFromPathname("/lp/snap/skin-gummies"), null);
  assert.equal(getSnapLpRedirectFromPathname("/lp/snap/eye-serum"), null);
});
