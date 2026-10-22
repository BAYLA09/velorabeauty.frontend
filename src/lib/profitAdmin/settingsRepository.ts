import { getDb } from "@/lib/db";

/** Only owner-controlled values persisted in SQLite. */
export type ProfitDashboardState = {
  confirmationRatePct: number;
  deliveryRatePct: number;
  /** Snapchat cost per purchase (USD) — total spend = CPA × orders in range. */
  snapCpaUsd: number;
  /** Break Event simulator — hypothetical lead volume. */
  breakEvenSimLeadCount: number;
  /** Share of simulated leads that pay by card (0–100); rest = COD. */
  breakEvenCardLeadPct: number;
  /** Site bundle tier when mix is off (1 = 199/219, 2 = 249/269, 3 = 339/359 AED). */
  breakEvenOfferTier: 1 | 2 | 3;
  /** When true, split simulated leads across the three site offers below. */
  breakEvenOfferMixEnabled: boolean;
  breakEvenOffer1Pct: number;
  breakEvenOffer2Pct: number;
  breakEvenOffer3Pct: number;
  chartDays: 7 | 30 | 90;
  dateRangeFrom: string | null;
  dateRangeTo: string | null;
};

const DEFAULT_STATE: ProfitDashboardState = {
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
  chartDays: 7,
  dateRangeFrom: null,
  dateRangeTo: null,
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

function readSnapCpaUsd(raw: Record<string, unknown>): number {
  if (typeof raw.snapCpaUsd === "number") return Math.max(0, raw.snapCpaUsd);
  return DEFAULT_STATE.snapCpaUsd;
}

function readOfferTier(raw: Record<string, unknown>): 1 | 2 | 3 {
  const t = raw.breakEvenOfferTier;
  return t === 2 || t === 3 ? t : DEFAULT_STATE.breakEvenOfferTier;
}

function readBreakEvenFields(raw: Record<string, unknown>): Pick<
  ProfitDashboardState,
  | "breakEvenSimLeadCount"
  | "breakEvenCardLeadPct"
  | "breakEvenOfferTier"
  | "breakEvenOfferMixEnabled"
  | "breakEvenOffer1Pct"
  | "breakEvenOffer2Pct"
  | "breakEvenOffer3Pct"
> {
  const leadCount =
    typeof raw.breakEvenSimLeadCount === "number"
      ? Math.max(0, Math.round(raw.breakEvenSimLeadCount))
      : DEFAULT_STATE.breakEvenSimLeadCount;
  const cardPct =
    typeof raw.breakEvenCardLeadPct === "number"
      ? Math.min(100, Math.max(0, raw.breakEvenCardLeadPct))
      : DEFAULT_STATE.breakEvenCardLeadPct;
  return {
    breakEvenSimLeadCount: leadCount,
    breakEvenCardLeadPct: cardPct,
    breakEvenOfferTier: readOfferTier(raw),
    breakEvenOfferMixEnabled: Boolean(raw.breakEvenOfferMixEnabled),
    breakEvenOffer1Pct:
      typeof raw.breakEvenOffer1Pct === "number"
        ? Math.max(0, raw.breakEvenOffer1Pct)
        : DEFAULT_STATE.breakEvenOffer1Pct,
    breakEvenOffer2Pct:
      typeof raw.breakEvenOffer2Pct === "number"
        ? Math.max(0, raw.breakEvenOffer2Pct)
        : DEFAULT_STATE.breakEvenOffer2Pct,
    breakEvenOffer3Pct:
      typeof raw.breakEvenOffer3Pct === "number"
        ? Math.max(0, raw.breakEvenOffer3Pct)
        : DEFAULT_STATE.breakEvenOffer3Pct,
  };
}

function migrateParsed(raw: Record<string, unknown>): ProfitDashboardState {
  if (
    typeof raw.confirmationRatePct === "number" &&
    typeof raw.deliveryRatePct === "number" &&
    (typeof raw.snapCpaUsd === "number" || typeof raw.adSpendUsd === "number")
  ) {
    return {
      confirmationRatePct: raw.confirmationRatePct,
      deliveryRatePct: raw.deliveryRatePct,
      snapCpaUsd: readSnapCpaUsd(raw),
      ...readBreakEvenFields(raw),
      chartDays:
        raw.chartDays === 30 || raw.chartDays === 90 ? raw.chartDays : DEFAULT_STATE.chartDays,
      dateRangeFrom:
        typeof raw.dateRangeFrom === "string" ? raw.dateRangeFrom : DEFAULT_STATE.dateRangeFrom,
      dateRangeTo:
        typeof raw.dateRangeTo === "string" ? raw.dateRangeTo : DEFAULT_STATE.dateRangeTo,
    };
  }

  const cod = (raw.cod as Record<string, unknown> | undefined) ?? {};
  return {
    confirmationRatePct:
      typeof cod.confirmationRatePct === "number"
        ? cod.confirmationRatePct
        : DEFAULT_STATE.confirmationRatePct,
    deliveryRatePct:
      typeof cod.deliveryRatePct === "number"
        ? cod.deliveryRatePct
        : DEFAULT_STATE.deliveryRatePct,
    snapCpaUsd: readSnapCpaUsd({ ...raw, fees: raw.fees }),
    ...readBreakEvenFields(raw),
    chartDays:
      raw.chartDays === 30 || raw.chartDays === 90 ? raw.chartDays : DEFAULT_STATE.chartDays,
    dateRangeFrom:
      typeof raw.dateRangeFrom === "string" ? raw.dateRangeFrom : DEFAULT_STATE.dateRangeFrom,
    dateRangeTo:
      typeof raw.dateRangeTo === "string" ? raw.dateRangeTo : DEFAULT_STATE.dateRangeTo,
  };
}

export function loadProfitDashboardState(): ProfitDashboardState {
  ensureTable();
  const row = getDb()
    .prepare(`SELECT state_json FROM bayla_profit_admin_state WHERE id = 1`)
    .get() as { state_json?: string } | undefined;
  if (!row?.state_json) return structuredClone(DEFAULT_STATE);
  try {
    const parsed = JSON.parse(row.state_json) as Record<string, unknown>;
    return migrateParsed(parsed);
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
