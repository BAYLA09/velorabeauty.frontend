import assert from "node:assert/strict";
import test from "node:test";
import { blendedSiteOfferEconomics, siteOfferUnitEconomics } from "@/lib/profitAdmin/breakEvenOffers";
import { DEFAULT_FEE_CONFIG } from "@/lib/profitAdmin/feesDefaults";

test("site offer tier 1 matches 199 card and 219 COD AED", () => {
  const fees = structuredClone(DEFAULT_FEE_CONFIG) as typeof DEFAULT_FEE_CONFIG;
  const e = siteOfferUnitEconomics(fees, 1);
  assert.ok(Math.abs(e.avgCardRevenueUsd - 199 / fees.aedPerUsd) < 0.01);
  assert.ok(Math.abs(e.codSellingPriceUsd - 219 / fees.aedPerUsd) < 0.01);
});

test("blended mix averages tiers", () => {
  const fees = structuredClone(DEFAULT_FEE_CONFIG) as typeof DEFAULT_FEE_CONFIG;
  const e = blendedSiteOfferEconomics(fees, { 1: 50, 2: 50, 3: 0 });
  const one = siteOfferUnitEconomics(fees, 1);
  const two = siteOfferUnitEconomics(fees, 2);
  const expectedCard = (one.avgCardRevenueUsd + two.avgCardRevenueUsd) / 2;
  assert.ok(Math.abs(e.avgCardRevenueUsd - expectedCard) < 0.01);
});
