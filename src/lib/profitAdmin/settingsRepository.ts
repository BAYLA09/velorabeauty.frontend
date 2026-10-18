import { getDb } from "@/lib/db";
import type { CodPanelInput, PaymentPanelInput } from "@/lib/profitAdmin/calculations";
import { mergeFeeConfig, type FeeConfig } from "@/lib/profitAdmin/feesDefaults";

export type ProfitDashboardState = {
  fees: FeeConfig;
  /** When true, COD total orders follows live DB count for the selected range. */
  codUseLiveOrderCount: boolean;
  cod: CodPanelInput;
  paymentOverrides: Partial<PaymentPanelInput>;
  paymentOtherFeesUsd: number;
  chartDays: 7 | 30 | 90;
  dateRangeFrom: string | null;
  dateRangeTo: string | null;
};

const DEFAULT_COD: CodPanelInput = {
  totalOrders: 0,
  confirmationRatePct: 70,
  deliveryRatePct: 80,
  sellingPricePerOrderUsd: 35,
  productCostPerOrderUsd: 12,
  shippingCostPerOrderUsd: 4.5,
  codFeesPerOrderUsd: 2.5,
  returnCostPerOrderUsd: 3,
  otherFeesPerOrderUsd: 1,
};

const DEFAULT_STATE: ProfitDashboardState = {
  fees: mergeFeeConfig(null),
  codUseLiveOrderCount: true,
  cod: DEFAULT_COD,
  paymentOverrides: {},
  paymentOtherFeesUsd: 0,
  chartDays: 7,
  dateRangeFrom: null,
  dateRangeTo: null,
};

function migrateLegacyCod(raw: Record<string, unknown>, fees: FeeConfig): CodPanelInput {
  if ("sellingPricePerOrderUsd" in raw) {
    return { ...DEFAULT_COD, ...(raw as CodPanelInput) };
  }
  const legacy = raw as {
    totalOrders?: number;
    confirmationRatePct?: number;
    deliveryRatePct?: number;
    sellingPriceUsd?: number;
    avgProductCostUsd?: number;
    otherCostsUsd?: number;
  };
  const total = legacy.totalOrders ?? 0;
  return {
    totalOrders: total,
    confirmationRatePct: legacy.confirmationRatePct ?? DEFAULT_COD.confirmationRatePct,
    deliveryRatePct: legacy.deliveryRatePct ?? DEFAULT_COD.deliveryRatePct,
    sellingPricePerOrderUsd: legacy.sellingPriceUsd ?? DEFAULT_COD.sellingPricePerOrderUsd,
    productCostPerOrderUsd: legacy.avgProductCostUsd ?? DEFAULT_COD.productCostPerOrderUsd,
    shippingCostPerOrderUsd: fees.cod.shippingDeliveredUsd,
    codFeesPerOrderUsd:
      ((legacy.sellingPriceUsd ?? DEFAULT_COD.sellingPricePerOrderUsd) *
        fees.cod.platformFeePercent) /
      100,
    returnCostPerOrderUsd: fees.cod.shippingReturnUsd,
    otherFeesPerOrderUsd: total > 0 ? (legacy.otherCostsUsd ?? 0) / total : DEFAULT_COD.otherFeesPerOrderUsd,
  };
}

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
    const parsed = JSON.parse(row.state_json) as Record<string, unknown>;
    const fees = mergeFeeConfig(parsed.fees as Partial<FeeConfig>);
    const cod = migrateLegacyCod((parsed.cod as Record<string, unknown>) ?? {}, fees);
    return {
      fees,
      codUseLiveOrderCount:
        typeof parsed.codUseLiveOrderCount === "boolean"
          ? parsed.codUseLiveOrderCount
          : DEFAULT_STATE.codUseLiveOrderCount,
      cod,
      paymentOverrides: (parsed.paymentOverrides as Partial<PaymentPanelInput>) ?? {},
      paymentOtherFeesUsd:
        typeof parsed.paymentOtherFeesUsd === "number"
          ? parsed.paymentOtherFeesUsd
          : DEFAULT_STATE.paymentOtherFeesUsd,
      chartDays:
        parsed.chartDays === 30 || parsed.chartDays === 90
          ? parsed.chartDays
          : DEFAULT_STATE.chartDays,
      dateRangeFrom:
        typeof parsed.dateRangeFrom === "string" ? parsed.dateRangeFrom : DEFAULT_STATE.dateRangeFrom,
      dateRangeTo:
        typeof parsed.dateRangeTo === "string" ? parsed.dateRangeTo : DEFAULT_STATE.dateRangeTo,
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

export function defaultDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - 7);
  return { from: from.toISOString(), to: to.toISOString() };
}
