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
