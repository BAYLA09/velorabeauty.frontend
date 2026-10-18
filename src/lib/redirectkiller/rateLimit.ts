import { getDb } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

function ensureLoginAttemptsTable(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS redirectkiller_login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      success INTEGER NOT NULL DEFAULT 0,
      attempted_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_rk_login_ip_time ON redirectkiller_login_attempts (ip, attempted_at DESC);
  `);
}

export function recordLoginAttempt(ip: string, success: boolean): void {
  ensureLoginAttemptsTable();
  getDb()
    .prepare(
      `INSERT INTO redirectkiller_login_attempts (ip, success, attempted_at) VALUES (?, ?, ?)`,
    )
    .run(ip, success ? 1 : 0, new Date().toISOString());
}

export function isLoginRateLimited(ip: string): boolean {
  ensureLoginAttemptsTable();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS c FROM redirectkiller_login_attempts
       WHERE ip = ? AND success = 0 AND attempted_at >= ?`,
    )
    .get(ip, since) as { c: number };
  return row.c >= MAX_FAILURES;
}
