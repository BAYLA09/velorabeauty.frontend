# Easypanel — deploy بـ 5 دقائق (Velora)

## 🆘 «ما قدرتش ن-deploy» — الحل السريع

| اللي كتشوف | المعنى | شنو دير |
|------------|--------|---------|
| Deploy **1 ثانية** | ما تـ pull/image/build | **Source → Docker Image** (تحت) — حذف Git |
| `Git key not found` | Git/Easypanel مقطوع | نفس الحل — **Docker Image** |
| الموقع خدام ولكن **قديم** | Image ما تحدّثاتش | **Publish container** ✅ على `main` ثم **Deploy** (1–3 دق) |
| `unauthorized` / pull | Registry | Image بالضبط `ghcr.io/bayla09/velorabeauty.frontend:latest` · auth **فارغ** (public) |

**Image جاهزة دابا** (GitHub Actions → Publish container). Easypanel **يسحبها** — ما يبنيش من Git:

```text
ghcr.io/bayla09/velorabeauty.frontend:latest
```

إلا `latest` ما تبدّلش، استعمل tag الـ SHA من Actions (مثلاً `:84c1112`).

**Compose copy-paste:** `deploy/easypanel-docker-image.compose.yaml` (فيه `pull_policy: always`).

تحقق من بعد Deploy:

```bash
curl -s https://www.velorabeauty.world/api/health
# version = آخر commit على main (مثلاً 84c1112...)
```

أو: `./scripts/check-live-version.sh 84c1112`

---

الـ repo **عام** والـ image **عامة** على GHCR. إلا كتعطل Git (`Git key not found`) — **ما تبقاش تبني من GitHub فـ Easypanel**.

---

## ✅ الطريقة 1 (الأسهل): Docker Image — بلا Git، بلا build

1. Easypanel → مشروع Velora → **New Service** → **App**  
   (إلا الخدمة القديمة معطلة بـ Git، **احذفها** و أنشئ خدمة جديدة.)
2. **Source** → **Docker Image** (ماشي GitHub و ماشي Git).
3. **Image** (نسخ ولصق بالضبط):

   ```text
   ghcr.io/bayla09/velorabeauty.frontend:latest
   ```

4. **Registry username / password:** **خليهم فارغين** — الـ package public.
5. **Domains** → Target port: **3000** (HTTP داخل الـ container).
6. **Volumes** (من بعد merge checkout + SQLite): mount **`/app/data`** persistent (طلبات COD/بطاقة).
7. **Deploy** → استنى **1–3 دقائق** (pull image) · logs فيها `Ready` — **ماشي 1 ثانية**.
8. جرب:

   ```bash
   curl -s https://www.velorabeauty.world/api/health
   ```

   خاصك تشوف `"version":"..."` = آخر commit على `main` (GitHub → Actions → Publish container). إلا `version` قديم → Easypanel ما سحبش image جديدة → **Deploy** من جديد.

### بعد كل تحديث على GitHub `main`

1. GitHub → **Actions** → **Publish container** → ✅ (2–8 دقائق).
2. Easypanel → **Deploy** (أو **Force Rebuild** إلا بقى image قديم).

---

## ✅ الطريقة 2: Compose (نفس الـ image)

1. **New Service** → **Compose**.
2. Source: GitHub `BAYLA09/velorabeauty.frontend` branch **`main`** — أو الصق محتوى `compose.yaml`.
3. Domain → port **3000** على service `velora-web`.
4. Deploy.

---

## ⚙️ الطريقة 3: GitHub + Dockerfile (إلا عندك Git شغال)

| Field | Value |
|--------|--------|
| Source | **GitHub** (⚠️ ماشي **Git** / SSH) |
| Repo | `BAYLA09/velorabeauty.frontend` |
| Branch | `main` |
| Build path | `/` |
| Builder | **Dockerfile** → `Dockerfile` |
| Port | **3000** |

**Resources → Memory limit:** ≥ **2048 MB** للـ builder (Dockerfile فيه heap 1536).

إلا Dockerfile فشل → **Build → Nixpacks** (فيه `nixpacks.toml` فـ repo).

---

## 🔔 Deploy تلقائي (اختياري)

1. Easypanel → خدمة الـ App → **Deployments** → **Deployment Trigger URL** (انسخ الرابط).
2. GitHub → repo → **Settings** → **Secrets** → **Actions** → New secret:
   - Name: `EASYPANEL_DEPLOY_WEBHOOK`
   - Value: الرابط كامل (فيه token).
3. من بعد، كل ما **Publish container** يكمل، Easypanel كيتـ deploy وحدو.

---

## ⚠️ Deploy كيخلص فـ **1 ثانية** (0–2s) — الحالة ديالك

فـ **Deployments** كتبان رسالة commit (`fix: let Easypanel build…`) و المدة **1 second** فقط.

**معناها:** Easypanel **ما بنا image** · غالباً **Git clone فشل** (`Git key not found`) أو **webhook** كيحاول deploy على خدمة Git معطلة.

الـ image **راه جاهزة** فـ GitHub Actions → **Publish container** ✅ (2–8 دقائق). Easypanel خاصو **يسحبها** ماشي يبني من Git.

**الحل (5 دقائق):**

1. Easypanel → خدمة frontend → **Source**.
2. بدّل من **GitHub / Git** → **Docker Image**.
3. Image: `ghcr.io/bayla09/velorabeauty.frontend:latest` · auth **فارغ**.
4. Port **3000** → **Deploy** — خاصو ياخذ **دقيقة+** (pull). إلا بقى 1s → Source مازال Git.
5. (اختياري) GitHub → repo → **Secrets** → حذف `EASYPANEL_DEPLOY_WEBHOOK` حتى ما يتكرر deploy فاشل · من بعد ما Docker Image خدام، رجّع webhook.

**تحقق:**

```bash
curl -s https://www.velorabeauty.world/api/health
# version = SHA ديال آخر Publish container على main
```

---

## أخطاء شائعة

| اللي كتشوف | الحل |
|------------|------|
| Deploy **1 second** + commit message | **Docker Image** (فوق) — Git/webhook فاشل |
| `Git key not found` | استعمل **Docker Image** (طريقة 1) — ماشi Git |
| `unauthorized` / pull image | Image: بالضبط `ghcr.io/bayla09/velorabeauty.frontend:latest` — auth فارغ |
| 502 / unhealthy | Port **3000** · logs runtime (ماشي build فقط) |
| الموقع قديم | Deploy بعد ما **Publish container** ✅ على `main` |
| Build OOM / `Killed` | Builder **≥ 2 GB** · Dockerfile فيه heap **1536** (ماشي 4096) · أو **Docker Image** من GHCR |
| `better-sqlite3` / native module | **Builder = Dockerfile** (ماشي Nixpacks) · volume **`/app/data`** للطلبات |
| Build context ضخم (~90MB) | `.dockerignore` كيستبعد PNG masters — pull **`main`** |

---

## تحقق

```bash
curl -s https://www.velorabeauty.world/api/health
```

تفاصيل إضافية: [EASYPANEL-DEPLOY.md](./EASYPANEL-DEPLOY.md)
