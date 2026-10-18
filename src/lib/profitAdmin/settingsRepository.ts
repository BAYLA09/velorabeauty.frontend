import { getDb } from "@/lib/db";
import type { CodCalcInput, PaymentCalcInput } from "@/lib/profitAdmin/calculations";
import { mergeFeeConfig, type FeeConfig } from "@/lib/profitAdmin/feesDefaults";

export type ProfitDashboardState = {
  fees: FeeConfig;
  payment: PaymentCalcInput;
  cod: CodCalcInput;
  scenarioDeliveryRatePct: number;
};

const DEFAULT_STATE: ProfitDashboardState = {
  fees: mergeFeeConfig(null),
  payment: {
    orderCount: 0,
    totalRevenueUsd: 0,
    avgProductCostUsd: 6.1,
    otherCostsUsd: 0,
  },
  cod: {
    totalOrders: 100,
    confirmationRatePct: 70,
    deliveryRatePct: 80,
    sellingPriceUsd: 35,
    avgProductCostUsd: 6.1,
    noAnswerRatePct: 15,
    declinedRatePct: 15,
    otherCostsUsd: 0,
  },
  scenarioDeliveryRatePct: 80,
};

function ensureTable(): void {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS bayla_profit_admin_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export function loadProfitDashboardState(): ProfitDashboardState {
  ensureTable();
  const row = getDb()
    .prepare(`SELECT state_json FROM bayla_profit_admin_state WHERE id = 1`)
    .get() as { state_json?: string } | undefined;
  if (!row?.state_json) return structuredClone(DEFAULT_STATE);
  try {
    const parsed = JSON.parse(row.state_json) as Partial<ProfitDashboardState>;
    return {
      fees: mergeFeeConfig(parsed.fees),
      payment: { ...DEFAULT_STATE.payment, ...parsed.payment },
      cod: { ...DEFAULT_STATE.cod, ...parsed.cod },
      scenarioDeliveryRatePct:
        typeof parsed.scenarioDeliveryRatePct === "number"
          ? parsed.scenarioDeliveryRatePct
          : DEFAULT_STATE.scenarioDeliveryRatePct,
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveProfitDashboardState(state: ProfitDashboardState): void {
  ensureTable();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO bayla_profit_admin_state (id, state_json, updated_at) VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at`,
    )
    .run(JSON.stringify(state), now);
}
