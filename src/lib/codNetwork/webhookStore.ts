import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";

export type WebhookKind = "lead" | "order";

export function ensureCodNetworkWebhookSchema(): void {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS cod_network_webhook_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_key TEXT NOT NULL UNIQUE,
      kind TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      received_at TEXT NOT NULL,
      processed INTEGER NOT NULL DEFAULT 0,
      result_json TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_codnet_webhook_received ON cod_network_webhook_events (received_at DESC);
  `);
}

export function buildEventKey(kind: WebhookKind, body: unknown): string {
  const hash = createHash("sha256").update(JSON.stringify(body)).digest("hex");
  return `${kind}:${hash}`;
}

export function insertWebhookEventIfNew(
  kind: WebhookKind,
  body: unknown,
): { inserted: boolean; eventKey: string } {
  ensureCodNetworkWebhookSchema();
  const eventKey = buildEventKey(kind, body);
  const receivedAt = new Date().toISOString();
  const payloadJson = JSON.stringify(body);
  try {
    getDb()
      .prepare(
        `INSERT INTO cod_network_webhook_events (event_key, kind, payload_json, received_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(eventKey, kind, payloadJson, receivedAt);
    setLastWebhookReceivedAt(receivedAt);
    return { inserted: true, eventKey };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("UNIQUE")) {
      return { inserted: false, eventKey };
    }
    throw err;
  }
}

export function markWebhookEventProcessed(eventKey: string, result: unknown): void {
  getDb()
    .prepare(
      `UPDATE cod_network_webhook_events
       SET processed = 1, result_json = ?
       WHERE event_key = ?`,
    )
    .run(JSON.stringify(result), eventKey);
}

const LAST_WEBHOOK_META = "cod_network_last_webhook_at";

function setLastWebhookReceivedAt(iso: string): void {
  getDb()
    .prepare(
      `INSERT INTO app_meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run(LAST_WEBHOOK_META, iso);
}

export function readLastCodNetworkWebhookAt(): string | null {
  const row = getDb()
    .prepare(`SELECT value FROM app_meta WHERE key = ?`)
    .get(LAST_WEBHOOK_META) as { value?: string } | undefined;
  return row?.value?.trim() || null;
}
