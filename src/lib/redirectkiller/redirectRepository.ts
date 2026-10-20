import { getDb } from "@/lib/db";

export type AdRedirectRecord = {
  id: string;
  slug: string;
  destinationPath: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

function ensureRedirectsTable(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS ad_redirects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
      destination_path TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ad_redirects_enabled ON ad_redirects (enabled);
  `);
}

function mapRow(row: {
  id: string;
  slug: string;
  destination_path: string;
  enabled: number;
  created_at: string;
  updated_at: string;
}): AdRedirectRecord {
  return {
    id: row.id,
    slug: row.slug,
    destinationPath: row.destination_path,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listAdRedirects(filter?: { q?: string; enabled?: "all" | "yes" | "no" }): AdRedirectRecord[] {
  ensureRedirectsTable();
  const q = filter?.q?.trim().toLowerCase();
  const enabled = filter?.enabled ?? "all";
  let sql = `SELECT * FROM ad_redirects WHERE 1=1`;
  const params: unknown[] = [];
  if (q) {
    sql += ` AND (LOWER(slug) LIKE ? OR LOWER(destination_path) LIKE ?)`;
    params.push(`%${q}%`, `%${q}%`);
  }
  if (enabled === "yes") sql += ` AND enabled = 1`;
  if (enabled === "no") sql += ` AND enabled = 0`;
  sql += ` ORDER BY updated_at DESC`;
  const rows = getDb().prepare(sql).all(...params) as Parameters<typeof mapRow>[0][];
  return rows.map(mapRow);
}

export function getAdRedirectBySlug(slug: string): AdRedirectRecord | null {
  ensureRedirectsTable();
  const row = getDb()
    .prepare(`SELECT * FROM ad_redirects WHERE slug = ? COLLATE NOCASE`)
    .get(slug) as Parameters<typeof mapRow>[0] | undefined;
  return row ? mapRow(row) : null;
}

export function getAdRedirectById(id: string): AdRedirectRecord | null {
  ensureRedirectsTable();
  const row = getDb()
    .prepare(`SELECT * FROM ad_redirects WHERE id = ?`)
    .get(id) as Parameters<typeof mapRow>[0] | undefined;
  return row ? mapRow(row) : null;
}

export function createAdRedirect(input: {
  id: string;
  slug: string;
  destinationPath: string;
  enabled: boolean;
}): AdRedirectRecord {
  ensureRedirectsTable();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO ad_redirects (id, slug, destination_path, enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(input.id, input.slug, input.destinationPath, input.enabled ? 1 : 0, now, now);
  return getAdRedirectById(input.id)!;
}

export function updateAdRedirect(
  id: string,
  patch: { slug?: string; destinationPath?: string; enabled?: boolean },
): AdRedirectRecord | null {
  ensureRedirectsTable();
  const existing = getAdRedirectById(id);
  if (!existing) return null;
  const slug = patch.slug ?? existing.slug;
  const destinationPath = patch.destinationPath ?? existing.destinationPath;
  const enabled = patch.enabled ?? existing.enabled;
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `UPDATE ad_redirects SET slug = ?, destination_path = ?, enabled = ?, updated_at = ? WHERE id = ?`,
    )
    .run(slug, destinationPath, enabled ? 1 : 0, now, id);
  return getAdRedirectById(id);
}

export function deleteAdRedirect(id: string): boolean {
  ensureRedirectsTable();
  const result = getDb().prepare(`DELETE FROM ad_redirects WHERE id = ?`).run(id);
  return result.changes > 0;
}
