import { getDb } from "@/lib/db";

const META_KEY = "inbound_order_status_cutoff_at";
const LEGACY_META_KEY = "orders_sheets_sync_cutoff_at";

const CUTOFF_ENV_NAMES = [
  "COD_NETWORK_STATUS_CUTOFF_ISO",
  "ORDERS_STATUS_CUTOFF_ISO",
  "ORDERS_SHEETS_SYNC_CUTOFF_ISO",
] as const;

function readCutoffFromEnv(): string | null {
  for (const name of CUTOFF_ENV_NAMES) {
    const raw = process.env[name]?.trim();
    if (!raw) continue;
    const parsed = Date.parse(raw);
    if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
  }
  return null;
}

/** Cutoff for inbound status updates (COD Network webhooks). No backfill before this time. */
export function readInboundStatusCutoffIso(): string {
  const fromEnv = readCutoffFromEnv();
  if (fromEnv) return fromEnv;

  getDb().exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const row = getDb()
    .prepare(`SELECT value FROM app_meta WHERE key IN (?, ?) ORDER BY key LIMIT 1`)
    .get(META_KEY, LEGACY_META_KEY) as { value?: string } | undefined;

  if (row?.value?.trim()) {
    const parsed = Date.parse(row.value);
    if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
  }

  const deployedAt = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO app_meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run(META_KEY, deployedAt);
  return deployedAt;
}

export function isOrderEligibleForInboundStatusUpdate(
  createdAtIso: string,
  cutoffIso: string,
): boolean {
  const created = Date.parse(createdAtIso);
  const cutoff = Date.parse(cutoffIso);
  if (!Number.isFinite(created) || !Number.isFinite(cutoff)) return false;
  return created >= cutoff;
}
