# Google Sheets → Bayla admin (inbound sync)

One-way sync: **Sheet → SQLite**. Status changes in the Sheet are never written back.

## What you must do

### 1) Redeploy Apps Script

1. Open the COD workbook → **Extensions** → **Apps Script**.
2. Replace the project code with `scripts/google-sheets/VeloraOrdersWebhook.gs` from this repo.
3. **Deploy** → **New deployment** → Web app → Execute as **Me**, access **Anyone**.
4. Copy the `/exec` URL into Easypanel `ORDERS_SHEETS_COD_WEBHOOK_URL` (and `ORDERS_SHEETS_CARD_WEBHOOK_URL` if you use a separate deployment for card).

The script must support POST bodies:

- `{ "secret": "…", "channel": "cod", "action": "readCodOrders" }`
- `{ "secret": "…", "channel": "card", "action": "readCardOrders" }`

(Append/export payloads are unchanged.)

### 2) Add a **Status** column (if missing)

On **both** order tabs, add a column header such as `status` / `Order status` / `statut` / `حالة`.  
Rows must include `orderId=…` in the **notes** column (already set by the site export).

### 3) Easypanel env

| Variable | Purpose |
|----------|---------|
| `ORDERS_SHEETS_COD_WEBHOOK_URL` | Apps Script `/exec` (COD read + export) |
| `ORDERS_SHEETS_CARD_WEBHOOK_URL` | Same or second `/exec` for card tab |
| `ORDERS_SHEETS_WEBHOOK_SECRET` | Must match Apps Script `WEBHOOK_SECRET` |
| `ORDERS_SHEETS_SYNC_CUTOFF_ISO` | Optional — only sync rows/orders **on or after** this UTC time (default: first deploy after feature ships) |
| `ORDERS_SHEETS_COD_STATUS_LABELS_JSON` | Optional — `{"label in sheet":"no_answer"}` overrides |
| `ORDERS_SHEETS_CARD_STATUS_LABELS_JSON` | Optional — card label overrides |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Optional — read tabs via Sheets API instead of Apps Script |

**Workbooks / tabs (from code):**

| Channel | Spreadsheet ID | Tab gid |
|---------|----------------|---------|
| COD | `1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ` | `469291840` |
| Card | `1paLygQEeE3V6kUVd4PP60v_xhpKp4e7Xu_UK3L5y32A` | `1628433865` |

Tab **titles** are not hardcoded; Bayla sync API returns resolved `tabTitle` when the service account can read metadata.

### 4) Bayla admin

- **Sync from Sheet** button on `/bayla-admin`
- Auto-sync on dashboard load and every **12 minutes**
- Manual API: `POST /api/bayla-admin/sheets/sync` (admin session)

## Status values

**COD:** `no_answer`, `confirmed`, `delivered`, `returned`, `cancelled` (+ common AR/FR/EN labels).

**Card:** `delivered` (sheet `paid` maps here), `returned`, `refunded`, `cancelled`.

Sheet-only rows (no matching SQLite order) are imported with `order_source = sheet`.

## COD profit on the dashboard

Uses **real** counts from synced statuses. Your **confirmation / delivery %** inputs apply only to orders still **`pending`** in SQLite (shown separately on the COD panel).
