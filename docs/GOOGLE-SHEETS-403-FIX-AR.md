# الطلبات ما كتوصلش للـ Sheet — 403 Access Denied

## التشخيص

الموقع (Easypanel) **config صحيح** (`ordersSheets.enabled: true`)، ولكن **Google Apps Script Web app** كيرفض الطلبات:

- فتح أو POST على URL `/exec` → صفحة **Access Denied** / **You need access** (HTTP **403**)
- `reconcile` كيعطي: `"exported": 0, "failed": N`

السيرفر ديال Velora **ما عندوش** حساب Google — خاص Web app يكون **Anyone** (عام).

---

## الحل (10 دقائق)

### 1) Apps Script مربوط بنفس الـ Sheet

Spreadsheet → **Extensions** → **Apps Script**  
الصق `scripts/google-sheets/VeloraOrdersWebhook.gs`

### 2) Script properties (⚙ Project Settings)

| Property | Value |
|----------|--------|
| `WEBHOOK_SECRET` | **نفس** `ORDERS_SHEETS_WEBHOOK_SECRET` f Easypanel |
| `SHEET_GID` | `469291840` |
| `SPREADSHEET_ID` | `1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ` *(اختياري إلا script bound)* |

**`SHEET_GID` فـ Easypanel ما كيستعملوش** — غير f Apps Script properties.

### 3) Deploy — **مهم**

**Deploy** → **New deployment** → ⚙ → **Web app**

| Field | Value |
|--------|--------|
| Execute as | **Me** (صاحب الـ Sheet) |
| Who has access | **Anyone** |

> ماشي "Only myself" · ماشي "Anyone with Google account" فقط — خاص **Anyone** باش السيرفر يقدر يPOST بلا login.

**Deploy** → انسخ **Web app URL** الجديد (`.../exec`) → حدّث `ORDERS_SHEETS_COD_WEBHOOK_URL` f Easypanel → Redeploy frontend (أو بلا إلا URL بقى نفس deployment id).

### 4) تحقق (بلا login Google)

فمتصفح **incognito** أو من terminal:

```bash
curl -sS "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

لازم JSON:

```json
{"ok":true,"service":"velora-cod-orders-webhook"}
```

إلا بقiti **403** → Deploy access مازال غلط.

### 5) Backfill

```bash
curl -sS -X POST 'https://www.velorabeauty.world/api/orders/sheets/reconcile' \
  -H 'Content-Type: application/json' \
  -d '{"secret":"YOUR_SECRET","limit":30}'
```

`exported` > 0 → Sheet فيها صفوف.

---

## Easypanel (frontend فقط)

```env
ORDERS_SHEETS_WEBHOOK_SECRET=...
ORDERS_SHEETS_COD_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

---

## أمان

ما تشاركش `WEBHOOK_SECRET` f chat/email. إلا تسرّب → بدّل secret f Easypanel **و** Apps Script **و** redeploy.
