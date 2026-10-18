import { getDb } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

function ensureTable(): void {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS bayla_admin_login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      success INTEGER NOT NULL DEFAULT 0,
      attempted_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_bayla_login_ip_time ON bayla_admin_login_attempts (ip, attempted_at DESC);
  `);
}

export function recordLoginAttempt(ip: string, success: boolean): void {
  ensureTable();
  getDb()
    .prepare(`INSERT INTO bayla_admin_login_attempts (ip, success, attempted_at) VALUES (?, ?, ?)`)
    .run(ip, success ? 1 : 0, new Date().toISOString());
}

export function isLoginRateLimited(ip: string): boolean {
  ensureTable();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS c FROM bayla_admin_login_attempts WHERE ip = ? AND success = 0 AND attempted_at >= ?`,
    )
    .get(ip, since) as { c: number };
  return row.c >= MAX_FAILURES;
}
