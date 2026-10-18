# COD orders → Google Sheet (storefront only)

This integration lives in the **Next.js storefront** (`velorabeauty.frontend`). It does **not** use `api.velorabeauty.world`.

## Architecture

| Direction | URL |
|-----------|-----|
| Customer places COD order | Storefront `POST /api/orders` (same origin, e.g. `https://www.velorabeauty.world/api/orders`) |
| Storefront → Google | **Outbound** `POST` to **your** Google Apps Script **Web app** URL (you create this; it is not hosted on Velora) |

There is **no** inbound webhook on Velora for Sheets. You configure the **Google Web app URL** in Easypanel.

### Target spreadsheet (yours)

- **Spreadsheet ID:** `1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ`
- **Tab gid:** `469291840` (from `#gid=469291840` in the sheet URL)
- **Row 1 headers (must match):**  
  `OrderDate`, `country`, `name`, `phone`, `address`, `url`, `sku`, `Product`, `quantity`, `price`, `currency`, `notes`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

One COD order with multiple SKUs → **one row per line item** (same `notes` contains `orderId=…` for all lines).

### Duplicate prevention

1. **SQLite:** `sheet_cod_exported_at` on the order (storefront DB).
2. **Sheet:** Apps Script skips append if `notes` already contains `orderId=<uuid>`.

---

## 1) Google Apps Script (you create credentials)

1. Open the spreadsheet → **Extensions** → **Apps Script**.
2. Paste `scripts/google-sheets/VeloraOrdersWebhook.gs` from this repo.
3. **Project Settings** → **Script properties:**

   | Property | Value | How to obtain |
   |----------|--------|----------------|
   | `WEBHOOK_SECRET` | *(you choose)* | Generate a long random string (password manager). **Same value** goes in Easypanel below. |
   | `SPREADSHEET_ID` | `1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ` | From the sheet URL (`/d/<ID>/edit`). Optional if the script is **bound** to that sheet. |
   | `SHEET_GID` | `469291840` | From `#gid=469291840` in the tab URL. |

4. **Deploy** → **New deployment** → **Web app**  
   - Execute as: **Me**  
   - Who has access: **Anyone** (required — server has no Google login; **403 Access Denied** if wrong)  
5. Copy the **Web app URL** (ends with `/exec`). This is the only “webhook URL” for COD export.  
6. Test in **incognito**: open `/exec` → must show `{"ok":true,"service":"velora-cod-orders-webhook"}`.  
   If **403** → [GOOGLE-SHEETS-403-FIX-AR.md](./GOOGLE-SHEETS-403-FIX-AR.md)

No Google service account or OAuth keys go in Easypanel — only the shared secret and the Apps Script `/exec` URL.

---

## 2) Easypanel — **Frontend / storefront service only**

Add on the service that runs `ghcr.io/bayla09/velorabeauty.frontend` (port **3000**, volume `/app/data`).

Do **not** add these on the backend API service.

| Variable name | Required value | How to obtain |
|---------------|----------------|---------------|
| `ORDERS_SHEETS_WEBHOOK_SECRET` | Exact match to Apps Script `WEBHOOK_SECRET` | You set both to the same string in step 1. |
| `ORDERS_SHEETS_COD_WEBHOOK_URL` | Full Web app URL from Deploy → `/exec` | Google Apps Script deployment (step 1.5). **Do not use a placeholder** — paste your real URL when you have it. |

Optional (not needed for COD-only):

| Variable name | When |
|---------------|------|
| `ORDERS_SHEETS_CARD_WEBHOOK_URL` | When you add a paid-card sheet later |
| `ORDERS_SHEETS_WEBHOOK_URL` | Fallback if COD/CARD URLs are omitted |

Existing vars (keep as today):

| Variable name | Example (your production may already have these) |
|---------------|--------------------------------------------------|
| `SITE_URL` | `https://www.velorabeauty.world` — used for product `url` column when no landing URL |
| `DATABASE_PATH` | `/app/data/velora.sqlite` |

**Copy-paste template (fill the two empty values yourself):**

```env
ORDERS_SHEETS_WEBHOOK_SECRET=
ORDERS_SHEETS_COD_WEBHOOK_URL=
```

---

## 3) UTM fields

The storefront reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from the checkout URL (first touch in the browser session) and sends them with the order. If the customer had no UTMs, those columns are empty.

---

## 4) Verify production

1. `GET https://www.velorabeauty.world/api/health` → `ordersSheets.enabled` must be **true**. If `false`, read `reason` (`missing_webhook_urls` / `missing_webhook_secret`).
2. Open your Apps Script **Web app URL** in the browser (GET) → should return JSON `{ "ok": true, "service": "velora-cod-orders-webhook" }`.
3. After a COD test order, check Easypanel logs for `[orders-sheets]` — no `export skipped` or `webhook failed`.

**Backfill** (orders saved in SQLite but sheet empty):

```bash
curl -sS -X POST 'https://www.velorabeauty.world/api/orders/sheets/reconcile' \
  -H 'Content-Type: application/json' \
  -d '{"secret":"YOUR_ORDERS_SHEETS_WEBHOOK_SECRET","limit":30}'
```

Re-deploy Apps Script after updating `VeloraOrdersWebhook.gs` (default tab gid `469291840`).

**Inbound sync (Bayla admin, Sheet → SQLite, never writes back to Sheet):**

- COD tab: spreadsheet `1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ`, gid `469291840` (`SHEET_GID` / `ORDERS_SHEETS_SHEET_GID`).
- Card tab: spreadsheet `1paLygQEeE3V6kUVd4PP60v_xhpKp4e7Xu_UK3L5y32A`, gid `1628433865` (`CARD_SPREADSHEET_ID` / `ORDERS_SHEETS_CARD_*`).
- Apps Script must support `action: "readCodOrders"` and `action: "readCardOrders"` (see `VeloraOrdersWebhook.gs`).
- Optional `ORDERS_SHEETS_SYNC_CUTOFF_ISO` — only rows/orders at or after this time are imported or status-updated (default: deploy time stored in SQLite `app_meta`).

---

## 5) Code entry points (for review)

- COD export trigger: `src/app/api/orders/route.ts` → `queueOrderSheetExport({ channel: "cod" })`
- Row builder: `src/lib/ordersSheets/buildSheetRow.ts` → `buildCodSheetRows`
- Env reader: `src/lib/ordersSheets/exportOrder.ts` → `readOrdersSheetsConfig()`

Deploy the storefront image that includes this code (merge PR / publish container) before expecting live rows.
