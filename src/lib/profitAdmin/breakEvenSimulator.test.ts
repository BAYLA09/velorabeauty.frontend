import assert from "node:assert/strict";
import test from "node:test";
import { computeBreakEvenScenario } from "@/lib/profitAdmin/breakEvenSimulator";
import { DEFAULT_FEE_CONFIG } from "@/lib/profitAdmin/feesDefaults";

test("computeBreakEvenScenario splits leads and computes max CPA", () => {
  const fees = structuredClone(DEFAULT_FEE_CONFIG) as typeof DEFAULT_FEE_CONFIG;
  const r = computeBreakEvenScenario(
    fees,
    {
      confirmationRatePct: 70,
      deliveryRatePct: 80,
      snapCpaUsd: 0,
      breakEvenSimLeadCount: 100,
      breakEvenCardLeadPct: 50,
      breakEvenOfferTier: 1,
      breakEvenOfferMixEnabled: false,
      breakEvenOffer1Pct: 100,
      breakEvenOffer2Pct: 0,
      breakEvenOffer3Pct: 0,
    },
  );
  assert.equal(r.totalLeads, 100);
  assert.equal(r.cardLeads, 50);
  assert.equal(r.codLeads, 50);
  assert.ok(r.grossProfitUsd > 0);
  assert.equal(r.maxCpaBreakEvenUsd, r.grossProfitUsd / 100);
  assert.equal(r.netProfitUsd, r.grossProfitUsd);
});
