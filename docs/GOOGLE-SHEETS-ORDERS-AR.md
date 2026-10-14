# طلبات Velora → Google Sheets (COD + بطاقة)

## ابدأ بـ COD فقط (مرحلة 1)

يمكنك تشغيل **جدول COD** وحدَه — **لا حاجة** لجدول البطاقة الآن.

1. أنشئ Google Sheet واحد (`Velora COD`) + Apps Script + Web app (الخطوات 1–2 أدناه).
2. في Easypanel ضع فقط:
   ```env
   ORDERS_SHEETS_WEBHOOK_SECRET=...
   ORDERS_SHEETS_COD_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   ```
3. **لا تضع** `ORDERS_SHEETS_CARD_WEBHOOK_URL` حتى تجهّز جدول البطاقة لاحقاً — طلبات البطاقة لن تُرسل للـ Sheets إلى أن تضيف الرابط.

**مهم:** هذه الميزة في **PR #140** — بعد الدمج في `main` ونشر Docker (`ghcr.io/.../latest`) يشتغل الإرسال على السيرفر.

---

الموقع ير sends كل طلب إلى **Webhook** (Google Apps Script). يمكنك **جدولين** (COD + بطاقة):

| الجدول | متى يُضاف الصف | متغير Easypanel |
|--------|----------------|-----------------|
| **COD** | مباشرة بعد تأكيد الطلب نقداً عند الاستلام | `ORDERS_SHEETS_COD_WEBHOOK_URL` |
| **بطاقة** | بعد دفع Stripe بنجاح (`paid`) | `ORDERS_SHEETS_CARD_WEBHOOK_URL` |

## 1) إنشاء الجدولين

1. أنشئ Google Sheet جديد للطلبات COD — سمّه مثلاً `Velora COD`.
2. أنشئ Google Sheet ثاني للطلبات المدفوعة بالبطاقة — `Velora Card`.
3. في كل جدول، الصف الأول سيُملأ تلقائياً بالعناوين عند أول طلب (أو انسخ العناوين من `scripts/google-sheets/VeloraOrdersWebhook.gs`).

## 2) Apps Script (كرّر لكل جدول)

1. افتح الجدول → **Extensions** → **Apps Script**.
2. الصق محتوى الملف `scripts/google-sheets/VeloraOrdersWebhook.gs` واحذف أي كود افتراضي.
3. **Project Settings** (⚙) → **Script properties** → Add property:
   - Name: `WEBHOOK_SECRET`
   - Value: كلمة سر قوية (نفس القيمة في Easypanel).
4. **Deploy** → **New deployment** → Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. انسخ **Web app URL**:
   - من جدول COD → `ORDERS_SHEETS_COD_WEBHOOK_URL`
   - من جدول Card → `ORDERS_SHEETS_CARD_WEBHOOK_URL`

## 3) Easypanel (Environment)

```env
ORDERS_SHEETS_WEBHOOK_SECRET=نفس_WEBHOOK_SECRET_في_Apps_Script
ORDERS_SHEETS_COD_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
ORDERS_SHEETS_CARD_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

اختياري: إذا كان عندك URL واحد فقط، استخدم `ORDERS_SHEETS_WEBHOOK_URL` — يُستخدم كاحتياطي إذا لم تُحدد URL منفصل لـ COD أو Card.

## 4) سلوك النظام

- **COD**: عند `POST /api/orders` بطريقة `cod` → صف في جدول COD (لا يوقف الطلب إذا فشل الإرسال).
- **بطاقة**: بعد `markOrderPaid` (Webhook Stripe أو `/api/checkout/stripe/confirm`) → صف في جدول البطاقة.
- كل طلب يُرسل **مرة واحدة** لكل قناة (يُسجَّل في SQLite: `sheet_cod_exported_at` / `sheet_card_exported_at`).
- المنتجات المتعددة (سلة) تُحفظ في `order_lines_json` وتظهر في عمود **المنتجات**.

## 5) استكشاف الأخطاء

- Logs في Easypanel: `[orders-sheets] webhook failed` → تحقق من URL والـ secret.
- Apps Script → **Executions** لرؤية أخطاء `doPost`.
- تأكد أن نشر Web app **Anyone** وليس "Only myself".
