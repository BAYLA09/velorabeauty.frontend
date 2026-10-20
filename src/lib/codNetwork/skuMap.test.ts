import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  orderLinesPushableToCodNetwork,
  readCodNetworkSkuMap,
  resolveCodNetworkSkuForSlug,
  resolveCodSheetSku,
} from "@/lib/codNetwork/skuMap";

describe("COD Network SKU map", () => {
  it("maps known slugs to COD SKUs", () => {
    assert.equal(resolveCodNetworkSkuForSlug("eye-serum"), "vitaminamin");
    assert.equal(resolveCodNetworkSkuForSlug("skin-gummies"), "WHITEAMIN");
    assert.equal(resolveCodNetworkSkuForSlug("hair-gummies"), null);
  });

  it("uses sheet SKU fallback for unmapped and warm", () => {
    assert.equal(resolveCodSheetSku("hair-gummies"), "hair-gummies");
    assert.equal(resolveCodSheetSku("warm"), "WARMTEE");
    assert.equal(resolveCodSheetSku("eye-serum"), "vitaminamin");
  });

  it("merges COD_NETWORK_SKU_MAP_JSON over defaults", () => {
    const prev = process.env.COD_NETWORK_SKU_MAP_JSON;
    process.env.COD_NETWORK_SKU_MAP_JSON = JSON.stringify({ "hair-gummies": "HAIRSKU" });
    assert.equal(resolveCodNetworkSkuForSlug("hair-gummies"), "HAIRSKU");
    assert.equal(readCodNetworkSkuMap()["eye-serum"], "vitaminamin");
    process.env.COD_NETWORK_SKU_MAP_JSON = prev;
  });

  it("blocks warm and unmapped from API push", () => {
    assert.equal(orderLinesPushableToCodNetwork(["eye-serum"]).ok, true);
    assert.equal(orderLinesPushableToCodNetwork(["warm"]).ok, false);
    assert.equal(orderLinesPushableToCodNetwork(["hair-gummies"]).ok, false);
  });
});
