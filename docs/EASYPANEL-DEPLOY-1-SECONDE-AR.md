# Deploy كيخلص ف 1–2 ثانية — الحل (Velora Frontend)

## شنو كيعني «1 second»؟

Easypanel **ما دارش pull** لـ `ghcr.io/bayla09/velorabeauty.frontend:latest`. غالباً:

| السبب | العلامة |
|--------|---------|
| Source = **GitHub / Git** | Deploy سريع + commit message فـ Deployments |
| **Webhook** كيضرب خدمة Git معطلة | GitHub Actions كيقول Deploy OK · Easypanel 1s |
| Source = **Compose + Git** | `docker compose up --build` · **ما كيسحبش** `:latest` جديد |
| Source = **Docker Image** ولكن **Restart** فقط | أحياناً 1s — جرّب **Force Rebuild** |

**الموقع يمكن يبقى خدام** (container قديم) — `/api/health` ok.

---

## الحل 100% (15 دقيقة): خدمة **جديدة** — App · Docker Image

### A) احذف أو عطّل الخدمة القديمة

Easypanel → مشروع Velora → خدمة frontend اللي Deploy ديالها **1s**  
→ **Stop** · (اختياري) **Delete** إلا بغيتي تبدأ من صفر.

### B) New Service → **App** (ماشي Compose · ماشي Git)

| Tab / Field | القيمة بالضبط |
|-------------|----------------|
| **Source type** | **Docker Image** |
| **Image** | `ghcr.io/bayla09/velorabeauty.frontend:latest` |
| **Username / Password** | **فارغ** (GHCR public) |
| **Port** | `3000` |
| **Domains** | `www.velorabeauty.world` |

**Volume:**

- Mount path: `/app/data` (Persistent)

**Environment:** من `deploy/easypanel.env.example` + Stripe + Sheets (ORDERS_SHEETS_*).

### C) Deploy

- كليك **Deploy** (ماشي Restart فقط).
- **Force Rebuild** إلا موجود.
- **المدة الصحيحة: 1–3 دقائق** — logs فيها `Pulling` / `Downloaded` / `Started`.

### D) GitHub — webhook غلط (مهم)

Repo → **Settings** → **Secrets** → إلا كاين **`EASYPANEL_DEPLOY_WEBHOOK`**:

- **احذفو** إلا كان كيودي لخدمة **Git** (Deploy 1s).
- من بعد ما Docker Image خدام، تقدر تزيد webhook **من Deployments tab** ديال **الخدمة الجديدة** فقط.

---

## إلا بقيتي على **Compose**

1. Path: **`deploy/easypanel-docker-image.compose.yaml`** (فيه `pull_policy: always` + `ports: 3000:3000`).
2. **ما تخليش** `build:` ف compose.
3. Pin tag إلا `latest` ما تبدّل:

   ```text
   ghcr.io/bayla09/velorabeauty.frontend:c6dc554
   ```

   (SHA من GitHub → Actions → Publish container → summary)

4. SSH للسيرفر (إلا عندك):

   ```bash
   cd /path/to/easypanel/project && docker compose pull && docker compose up -d --force-recreate
   ```

---

## تحقق

```bash
curl -s https://www.velorabeauty.world/api/health
```

`version` = آخر commit على `main` بعد merge + Publish container.

---

## ملخص Darija

**Deploy 1s = غلط f Source.**  
**Dir: App + Docker Image + port 3000 + volume /app/data + Deploy 2–3 d9.**  
**Msah webhook l9dim f GitHub.**
