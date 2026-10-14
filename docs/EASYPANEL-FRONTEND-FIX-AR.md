# Easypanel — Frontend ma kaydeployich (حل نهائي)

> **Deploy f 1–2 ثانية؟** → اقرأ أولاً: **[EASYPANEL-DEPLOY-1-SECONDE-AR.md](./EASYPANEL-DEPLOY-1-SECONDE-AR.md)** (حذف Git/webhook + App Docker Image).

الموقع **يمكن يبقى خدام** (`/api/health` → `ok: true`) بينما زر **Deploy** فـ Easypanel **ما كيسحبش image** أو **كيخلص ف ثانية**. هاد الدليل كيصلّح 90% ديال الحالات.

---

## الطريقة الموصى بها: **App → Docker Image** (ماشي Git)

### 1) احذف الخدمة القديمة إلا Deploy = 1 ثانية

إلا Source = **GitHub / Git / Dockerfile** → Easypanel كيبني f VPS → غالباً **يفشل** أو **ما كيحدّثش**.

**Dir:** Service → Settings → إلا ما لقيتich **Docker Image** بسهولة → **New Service** → **App**.

### 2) إعدادات بالضبط

| الحقل | القيمة |
|--------|--------|
| **Source** | **Docker Image** |
| **Image** | `ghcr.io/bayla09/velorabeauty.frontend:latest` |
| **Registry Username** | *(فارغ)* |
| **Registry Password** | *(فارغ)* |
| **Port (HTTP)** | **3000** |
| **Domains** | `www.velorabeauty.world` (+ redirect `velorabeauty.world` إن أمكن) |

### 3) Volume (ضروري للطلبات SQLite)

| Mount path (container) | Type |
|------------------------|------|
| `/app/data` | Volume / Persistent |

### 4) Environment

انسخ من `deploy/easypanel.env.example` + أسرار Stripe + Sheets إن وجدت. **الحد الأدنى:**

```env
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
DATABASE_PATH=/app/data/velora.sqlite
SITE_URL=https://www.velorabeauty.world
CARD_PAYMENT_ENABLED=true
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
BACKEND_API_BASE_URL=https://api.velorabeauty.world
STORE_API_KEY=...
```

### 5) Deploy

- استنى **1–3 دقائق** (logs: `Pulling`, `Pull complete`, `Started`).
- إلا **< 5 ثواني** → Source غلط (راجع فوق).

### 6) تحقق

```bash
curl -s https://www.velorabeauty.world/api/health
```

- `ok: true`
- `version` = أحدث SHA على `main` (بعد merge + Publish container)

---

## بديل: **Compose** (من repo)

استعمل **`deploy/easypanel-docker-image.compose.yaml`** (فيه `ports: 3000:3000`).

1. Easypanel → **Compose** → repo `BAYLA09/velorabeauty.frontend` → path: `deploy/easypanel-docker-image.compose.yaml`
2. **ما تستعملش** Dockerfile build على السيرفر.
3. Environment فـ UI (نفس المتغيرات).
4. Deploy 1–3 دقائق.

---

## بعد كل merge على GitHub

1. **Actions** → **Publish container** ✅ (~2 min)
2. Easypanel → **Deploy** (يدوي — **ما كاينش auto**)
3. `curl /api/health` → SHA جديد

Pin tag إلا `latest` ما تحدّث:

```text
ghcr.io/bayla09/velorabeauty.frontend:c6dc554
```

(بدّل `c6dc554` من آخر Publish container summary)

---

## PR #140 / #141

Google Sheets و Thank-you COD **ما غاديش يبانو** حتى **merge** PRs + Publish + Deploy.

---

## سكريبت مساعد (من جهازك)

```bash
./scripts/easypanel-deploy-check.sh
```
