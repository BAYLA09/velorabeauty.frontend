import { getDb } from "@/lib/db";

const META_KEY = "orders_sheets_sync_cutoff_at";
const ENV_CUTOFF = "ORDERS_SHEETS_SYNC_CUTOFF_ISO";

/** Cutoff for inbound Sheet → DB sync (status updates + sheet-only imports). */
export function readOrdersSheetsSyncCutoffIso(): string {
  const fromEnv = process.env[ENV_CUTOFF]?.trim();
  if (fromEnv) {
    const parsed = Date.parse(fromEnv);
    if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
  }

  getDb().exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const row = getDb()
    .prepare(`SELECT value FROM app_meta WHERE key = ?`)
    .get(META_KEY) as { value?: string } | undefined;

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

export function isOrderEligibleForSheetSync(createdAtIso: string, cutoffIso: string): boolean {
  const created = Date.parse(createdAtIso);
  const cutoff = Date.parse(cutoffIso);
  if (!Number.isFinite(created) || !Number.isFinite(cutoff)) return false;
  return created >= cutoff;
}

export function isSheetRowEligibleForSync(rowOrderDateIso: string | null, cutoffIso: string): boolean {
  if (!rowOrderDateIso) return false;
  return isOrderEligibleForSheetSync(rowOrderDateIso, cutoffIso);
}
