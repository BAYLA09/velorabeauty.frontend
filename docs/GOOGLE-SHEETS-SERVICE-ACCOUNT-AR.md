# الحل المضمون — Sheets API (بلا Apps Script)

إلا **Apps Script** ما خدمش (`doGet not found` / 403 / 404)، Velora يقدر يكتب **مباشرة** f Google Sheet عبر **Service Account**.

---

## 1) Google Cloud (مرة واحدة)

1. [Google Cloud Console](https://console.cloud.google.com/) → مشروع جديد (مثلاً `velora-sheets`)
2. **APIs & Services** → **Library** → فعّل **Google Sheets API**
3. **IAM & Admin** → **Service Accounts** → **Create**
4. **Keys** → **Add key** → **JSON** → حمّل الملف

---

## 2) شارك الـ Sheet مع الـ Service Account

1. افتح JSON → `"client_email": "something@....iam.gserviceaccount.com"`
2. Google Sheet → **Share** → أضف هاد الإيميل → **Editor**

---

## 3) Easypanel (frontend)

```env
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...", ... كامل فسطر واحد ...}

ORDERS_SHEETS_SPREADSHEET_ID=1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ
ORDERS_SHEETS_SHEET_GID=469291840
```

**مهم:**

- `ORDERS_SHEETS_SPREADSHEET_ID` = من URL ديال Sheet (`/d/THIS_ID/edit`) — **ماشي** `AKfyc...`
- `GOOGLE_SERVICE_ACCOUNT_JSON` = **كامل** محتوى ملف JSON (Easypanel يقبل multiline أو سطر واحد)

**اختياري:** `ORDERS_SHEETS_COD_WEBHOOK_URL` — ما محتاجوش إلا API خدام.

Redeploy frontend.

---

## 4) تحقق

```bash
curl -s https://www.velorabeauty.world/api/health
```

→ `ordersSheets.mode: "google_api"` و `direct.enabled: true`

```bash
curl -sS -X POST 'https://www.velorabeauty.world/api/orders/sheets/reconcile' \
  -H 'Content-Type: application/json' \
  -d '{"secret":"YOUR_ORDERS_SHEETS_WEBHOOK_SECRET","limit":10}'
```

(`secret` مطلوب للـ reconcile route حتى مع API — نفس secret Easypanel)

---

## Apps Script (قديم)

يمكنك تخليه؛ إلا `GOOGLE_SERVICE_ACCOUNT_JSON` موجود، **API كيتقدّم** على Webhook.
