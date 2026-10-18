import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let db: Database.Database | null = null;

function resolveDbPath(): string {
  const fromEnv = process.env.DATABASE_PATH?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), "data", "velora.sqlite");
}

function ensureSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      product_slug TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity IN (1, 2, 3)),
      payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'cod')),
      subtotal_aed INTEGER NOT NULL,
      delivery_fee_aed INTEGER NOT NULL DEFAULT 0,
      total_aed INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      emirate TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders (payment_method);
  `);

  const columns = database.prepare(`PRAGMA table_info(orders)`).all() as { name: string }[];
  const names = new Set(columns.map((c) => c.name));
  if (!names.has("stripe_checkout_session_id")) {
    database.exec(`ALTER TABLE orders ADD COLUMN stripe_checkout_session_id TEXT`);
  }
  if (!names.has("stripe_payment_intent_id")) {
    database.exec(`ALTER TABLE orders ADD COLUMN stripe_payment_intent_id TEXT`);
  }
  database.exec(
    `CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders (stripe_checkout_session_id)`,
  );
  database.exec(
    `CREATE INDEX IF NOT EXISTS idx_orders_stripe_pi ON orders (stripe_payment_intent_id)`,
  );
  if (!names.has("customer_email")) {
    database.exec(`ALTER TABLE orders ADD COLUMN customer_email TEXT`);
  }
  if (!names.has("marketing_consent")) {
    database.exec(`ALTER TABLE orders ADD COLUMN marketing_consent INTEGER NOT NULL DEFAULT 0`);
  }
  if (!names.has("backend_external_checkout_id")) {
    database.exec(`ALTER TABLE orders ADD COLUMN backend_external_checkout_id TEXT`);
  }
  if (!names.has("order_lines_json")) {
    database.exec(`ALTER TABLE orders ADD COLUMN order_lines_json TEXT`);
  }
  if (!names.has("sheet_cod_exported_at")) {
    database.exec(`ALTER TABLE orders ADD COLUMN sheet_cod_exported_at TEXT`);
  }
  if (!names.has("sheet_card_exported_at")) {
    database.exec(`ALTER TABLE orders ADD COLUMN sheet_card_exported_at TEXT`);
  }
  if (!names.has("sheet_card_export_last_error")) {
    database.exec(`ALTER TABLE orders ADD COLUMN sheet_card_export_last_error TEXT`);
  }
  if (!names.has("sheet_card_export_last_attempt_at")) {
    database.exec(`ALTER TABLE orders ADD COLUMN sheet_card_export_last_attempt_at TEXT`);
  }
  if (!names.has("order_attribution_json")) {
    database.exec(`ALTER TABLE orders ADD COLUMN order_attribution_json TEXT`);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS ad_redirects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
      destination_path TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ad_redirects_enabled ON ad_redirects (enabled);
    CREATE TABLE IF NOT EXISTS redirectkiller_login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      success INTEGER NOT NULL DEFAULT 0,
      attempted_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_rk_login_ip_time ON redirectkiller_login_attempts (ip, attempted_at DESC);
    CREATE TABLE IF NOT EXISTS bayla_admin_login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      success INTEGER NOT NULL DEFAULT 0,
      attempted_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_bayla_login_ip_time ON bayla_admin_login_attempts (ip, attempted_at DESC);
    CREATE TABLE IF NOT EXISTS bayla_profit_admin_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const database = new Database(dbPath);
  database.pragma("journal_mode = WAL");
  ensureSchema(database);
  db = database;
  return db;
}
