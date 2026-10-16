# Sheet **khra** — orders carte payée

Nfs colonnes b7al COD (17). Export ghir **`paid`**.

---

## Option A — **Spreadsheet jdid** + Apps Script jdid (recommended)

### 1) Google Sheet jdid

1. Google Drive → **New** → **Google Sheets**
2. Ligne 1:

```text
OrderDate	country	name	phone	address	url	sku	Product	quantity	price	currency	notes	utm_source	utm_medium	utm_campaign	utm_term	utm_content	national_address
```

3. Men URL `/d/XXXXXXXX/edit` — **`CARD_SPREADSHEET_ID`**
4. Ila bghiti tab mo3ayyan: `#gid=…` → **`CARD_SHEET_GID`** (optional ila tab wa7ed)

### 2) Apps Script **f had sheet**

1. **Extensions** → **Apps Script**
2. Paste `scripts/google-sheets/VeloraOrdersWebhook.gs` (kamel)
3. **Script properties**:

| Property | Value |
|----------|--------|
| `WEBHOOK_SECRET` | nfs secret dyal Easypanel |
| `SPREADSHEET_ID` | ID dyal **had** sheet (optional ila bound) |
| `SHEET_GID` | gid tab (optional — ila tab wa7ed, khliha fadya) |

**Ma tzidch** `CARD_SPREADSHEET_ID` hna — script mربوط b sheet card.

4. **Deploy** → Web app → **Me** + **Anyone** → copy **`/exec` URL dyal CARD**

### 3) Easypanel

```env
ORDERS_SHEETS_COD_WEBHOOK_URL=https://script.google.com/macros/s/...COD.../exec
ORDERS_SHEETS_CARD_WEBHOOK_URL=https://script.google.com/macros/s/...CARD.../exec
ORDERS_SHEETS_WEBHOOK_SECRET=VeloraCOD-2026-X7mP9qL2-K8vR
```

Deploy frontend (PR #148 / main).

---

## Option B — **Sheet khra** b nfs Apps Script dyal COD

1. Sheet jdid + headers (nfs Option A step 1)
2. F **COD Apps Script** → properties:

| Property | Value |
|----------|--------|
| `CARD_SPREADSHEET_ID` | ID dyal sheet card |
| `CARD_SHEET_GID` | gid tab (optional) |

3. **Deploy** → edit Web app (nfs `/exec` COD)
4. Easypanel: **`ORDERS_SHEETS_CARD_WEBHOOK_URL`** = **nfs** URL dyal COD (optional)

---

## Share

Ila service account: share sheet card b **Editor** 3la `client_email` dyal JSON.

---

## Test

```text
https://www.velorabeauty.world/api/orders/sheets/reconcile?secret=SECRET&channel=card&run=1
```

Order carte payée → rows f **sheet card**, COD f sheet COD.
