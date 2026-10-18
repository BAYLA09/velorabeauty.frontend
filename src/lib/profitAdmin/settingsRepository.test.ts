import assert from "node:assert/strict";
import test from "node:test";
import { getDb } from "@/lib/db";
import {
  loadProfitDashboardState,
  saveProfitDashboardState,
} from "@/lib/profitAdmin/settingsRepository";

test("migrates legacy persisted state to three owner fields", () => {
  const db = getDb();
  db.prepare(`DELETE FROM bayla_profit_admin_state WHERE id = 1`).run();
  db.prepare(
    `INSERT INTO bayla_profit_admin_state (id, state_json, updated_at) VALUES (1, ?, ?)`,
  ).run(
    JSON.stringify({
      fees: { adSpendUsd: 250 },
      cod: { confirmationRatePct: 65, deliveryRatePct: 75 },
      chartDays: 30,
    }),
    new Date().toISOString(),
  );

  const state = loadProfitDashboardState();
  assert.equal(state.confirmationRatePct, 65);
  assert.equal(state.deliveryRatePct, 75);
  assert.equal(state.adSpendUsd, 250);
  assert.equal(state.chartDays, 30);

  saveProfitDashboardState({
    confirmationRatePct: 70,
    deliveryRatePct: 80,
    adSpendUsd: 100,
    chartDays: 7,
    dateRangeFrom: null,
    dateRangeTo: null,
  });
  const saved = loadProfitDashboardState();
  assert.equal(saved.adSpendUsd, 100);
  const row = db
    .prepare(`SELECT state_json FROM bayla_profit_admin_state WHERE id = 1`)
    .get() as { state_json: string };
  const parsed = JSON.parse(row.state_json) as Record<string, unknown>;
  assert.ok(!("fees" in parsed));
});
