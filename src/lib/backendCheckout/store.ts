import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";

export type DesiredStatus = "active" | "recovered";
export type SyncStatus = "pending" | "settled" | "failed";
export type RemoteStatus = "none" | "active" | "abandoned" | "recovered";

export type BackendCheckoutLink = {
  externalCheckoutId: string;
  backendCheckoutId: string | null;
  email: string;
  marketingConsent: boolean;
  orderId: string | null;
  desiredStatus: DesiredStatus;
  syncStatus: SyncStatus;
  remoteStatus: RemoteStatus;
  requestJson: string;
  payloadHash: string;
  lastError: string | null;
  attempts: number;
  nextAttemptAt: string;
  abandonAfter: string | null;
  createdAt: string;
  updatedAt: string;
};

type LinkRow = {
  external_checkout_id: string;
  backend_checkout_id: string | null;
  email: string;
  marketing_consent: number;
  order_id: string | null;
  desired_status: DesiredStatus;
  sync_status: SyncStatus;
  remote_status: RemoteStatus;
  request_json: string;
  payload_hash: string;
  last_error: string | null;
  attempts: number;
  next_attempt_at: string;
  abandon_after: string | null;
  created_at: string;
  updated_at: string;
};

let schemaReady = false;

function ensureLinkSchema(): void {
  if (schemaReady) return;
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS backend_checkout_links (
      external_checkout_id TEXT PRIMARY KEY,
      backend_checkout_id TEXT,
      email TEXT NOT NULL,
      marketing_consent INTEGER NOT NULL DEFAULT 0,
      order_id TEXT,
      desired_status TEXT NOT NULL,
      sync_status TEXT NOT NULL,
      remote_status TEXT NOT NULL,
      request_json TEXT NOT NULL,
      payload_hash TEXT NOT NULL,
      last_error TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      next_attempt_at TEXT NOT NULL,
      abandon_after TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_backend_checkout_sync
      ON backend_checkout_links (sync_status, next_attempt_at);
  `);
  schemaReady = true;
}

function rowToLink(row: LinkRow): BackendCheckoutLink {
  return {
    externalCheckoutId: row.external_checkout_id,
    backendCheckoutId: row.backend_checkout_id,
    email: row.email,
    marketingConsent: row.marketing_consent === 1,
    orderId: row.order_id,
    desiredStatus: row.desired_status,
    syncStatus: row.sync_status,
    remoteStatus: row.remote_status,
    requestJson: row.request_json,
    payloadHash: row.payload_hash,
    lastError: row.last_error,
    attempts: row.attempts,
    nextAttemptAt: row.next_attempt_at,
    abandonAfter: row.abandon_after,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function hashCheckoutPayload(requestJson: string): string {
  return createHash("sha256").update(requestJson).digest("hex");
}

export function getBackendCheckoutLink(externalCheckoutId: string): BackendCheckoutLink | null {
  ensureLinkSchema();
  const row = getDb()
    .prepare(`SELECT * FROM backend_checkout_links WHERE external_checkout_id = ?`)
    .get(externalCheckoutId) as LinkRow | undefined;
  return row ? rowToLink(row) : null;
}

export function upsertBackendCheckoutLink(input: {
  externalCheckoutId: string;
  email: string;
  marketingConsent: boolean;
  orderId?: string;
  desiredStatus: DesiredStatus;
  requestJson: string;
  nowIso: string;
}): BackendCheckoutLink {
  ensureLinkSchema();
  const existing = getBackendCheckoutLink(input.externalCheckoutId);
  const payloadHash = hashCheckoutPayload(input.requestJson);
  const changed = !existing || existing.payloadHash !== payloadHash;
  const desiredStatus: DesiredStatus =
    input.desiredStatus === "recovered" || existing?.desiredStatus === "recovered"
      ? "recovered"
      : "active";

  if (existing?.remoteStatus === "recovered") {
    return existing;
  }

  const needsWork =
    !existing ||
    changed ||
    input.desiredStatus === "recovered" ||
    existing.syncStatus === "failed" ||
    existing.syncStatus === "pending";

  if (!existing) {
    getDb()
      .prepare(
        `INSERT INTO backend_checkout_links (
          external_checkout_id, backend_checkout_id, email, marketing_consent, order_id,
          desired_status, sync_status, remote_status, request_json, payload_hash,
          last_error, attempts, next_attempt_at, abandon_after, created_at, updated_at
        ) VALUES (?, NULL, ?, ?, ?, ?, 'pending', 'none', ?, ?, NULL, 0, ?, NULL, ?, ?)`,
      )
      .run(
        input.externalCheckoutId,
        input.email,
        input.marketingConsent ? 1 : 0,
        input.orderId ?? null,
        desiredStatus,
        input.requestJson,
        payloadHash,
        input.nowIso,
        input.nowIso,
        input.nowIso,
      );
  } else {
    getDb()
      .prepare(
        `UPDATE backend_checkout_links SET
          email = ?,
          marketing_consent = ?,
          order_id = COALESCE(?, order_id),
          desired_status = ?,
          sync_status = ?,
          request_json = ?,
          payload_hash = ?,
          attempts = ?,
          next_attempt_at = ?,
          last_error = CASE WHEN ? = 1 THEN NULL ELSE last_error END,
          abandon_after = CASE WHEN ? = 1 THEN NULL ELSE abandon_after END,
          updated_at = ?
        WHERE external_checkout_id = ?`,
      )
      .run(
        input.email,
        input.marketingConsent ? 1 : 0,
        input.orderId ?? null,
        desiredStatus,
        needsWork ? "pending" : existing.syncStatus,
        input.requestJson,
        payloadHash,
        changed ? 0 : existing.attempts,
        needsWork ? input.nowIso : existing.nextAttemptAt,
        needsWork ? 1 : 0,
        changed ? 1 : 0,
        input.nowIso,
        input.externalCheckoutId,
      );
  }

  const saved = getBackendCheckoutLink(input.externalCheckoutId);
  if (!saved) {
    throw new Error("backend checkout link missing after upsert");
  }
  return saved;
}

export function saveBackendCheckoutProgress(
  externalCheckoutId: string,
  patch: {
    backendCheckoutId?: string | null;
    syncStatus?: SyncStatus;
    remoteStatus?: RemoteStatus;
    desiredStatus?: DesiredStatus;
    lastError?: string | null;
    attempts?: number;
    nextAttemptAt?: string;
    abandonAfter?: string | null;
    updatedAt: string;
  },
): void {
  ensureLinkSchema();
  const current = getBackendCheckoutLink(externalCheckoutId);
  if (!current) return;
  getDb()
    .prepare(
      `UPDATE backend_checkout_links SET
        backend_checkout_id = ?,
        sync_status = ?,
        remote_status = ?,
        desired_status = ?,
        last_error = ?,
        attempts = ?,
        next_attempt_at = ?,
        abandon_after = ?,
        updated_at = ?
      WHERE external_checkout_id = ?`,
    )
    .run(
      patch.backendCheckoutId === undefined ? current.backendCheckoutId : patch.backendCheckoutId,
      patch.syncStatus ?? current.syncStatus,
      patch.remoteStatus ?? current.remoteStatus,
      patch.desiredStatus ?? current.desiredStatus,
      patch.lastError === undefined ? current.lastError : patch.lastError,
      patch.attempts ?? current.attempts,
      patch.nextAttemptAt ?? current.nextAttemptAt,
      patch.abandonAfter === undefined ? current.abandonAfter : patch.abandonAfter,
      patch.updatedAt,
      externalCheckoutId,
    );
}

export function listDueBackendCheckoutLinks(nowIso: string, limit = 20): BackendCheckoutLink[] {
  ensureLinkSchema();
  const rows = getDb()
    .prepare(
      `SELECT * FROM backend_checkout_links
       WHERE sync_status = 'pending' AND next_attempt_at <= ?
       ORDER BY next_attempt_at ASC
       LIMIT ?`,
    )
    .all(nowIso, limit) as LinkRow[];
  return rows.map(rowToLink);
}

export function listScheduledAbandons(nowIso: string, limit = 20): BackendCheckoutLink[] {
  ensureLinkSchema();
  const rows = getDb()
    .prepare(
      `SELECT * FROM backend_checkout_links
       WHERE desired_status = 'active'
         AND remote_status = 'active'
         AND abandon_after IS NOT NULL
         AND abandon_after <= ?
         AND sync_status != 'failed'
       ORDER BY abandon_after ASC
       LIMIT ?`,
    )
    .all(nowIso, limit) as LinkRow[];
  return rows.map(rowToLink);
}
