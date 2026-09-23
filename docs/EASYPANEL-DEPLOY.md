# Easypanel — Velora Frontend (deploy ma kaymchich)

## الوضع الحالي

- إلا **الموقع كيتحل** (`/api/health` → 200) ولكن **Deploy جديد كيفشل**، غالباً Easypanel ما قدرش يـ **clone/pull** من GitHub أو الـ **build** كيتعطل — الخدمة القديمة باقية تخدم.
- إلا **الموقع down** بالكامل، شوف *الخدمة ما كتقلعش* تحت.

---

## الحل الموصى به: Deploy من GHCR (بلا Git على Easypanel)

كل push على **`main`** كيبني image فـ **GitHub Actions** (`Publish container`) و كيرفعها لـ:

```text
ghcr.io/bayla09/velorabeauty.frontend:latest
```

(و tag بـ SHA الـ commit.)

### 1) تأكد أن الـ workflow خضر

GitHub → **Actions** → **Publish container** → آخر run على `main` = ✅

### 2) Easypanel — بدّل المصدر

1. خدمة Velora → **Source** → **Docker Registry** (ماشي GitHub).
2. **Image:** `ghcr.io/bayla09/velorabeauty.frontend:latest`
3. **Authentication:**
   - Username: حساب GitHub ديالك (مثلاً `BAYLA09`)
   - Password: **Personal Access Token** (Classic) فيه **`read:packages`**  
     (GitHub → Settings → Developer settings → Personal access tokens)
4. **Build** tab: ما محتاجش Dockerfile فـ Easypanel — الـ image جاهزة.
5. **Port:** `3000` · **Deploy**.

### 3) Package visibility

الـ image دابا **public** — Easypanel **ما محتاجش** username/password.  
إلا طلب auth: [Package settings](https://github.com/users/BAYLA09/packages/container/velorabeauty.frontend/settings) → **Public**.

**دليل مختصر:** [EASYPANEL-SETUP-AR.md](./EASYPANEL-SETUP-AR.md)

### 4) بعد كل merge على main

1. استنى **Publish container** ✅ (~3–8 دقائق).
2. Easypanel → **Deploy** (Pull image جديدة — أحياناً **Force Rebuild** / Redeploy).

> **Webhook:** إلا بقيتي على GitHub source، webhook كيخدم غير إلا Git متصل. مع GHCR، deploy = redeploy من registry بعد ما CI يكمل.

---

## الإعداد الصحيح (App service — GitHub source)

| Field | Value |
|--------|--------|
| Source | GitHub → `BAYLA09/velorabeauty.frontend` |
| Branch | **`main`** |
| Build | **Dockerfile** (ماشي Nixpacks / Railpack) |
| Dockerfile path | `Dockerfile` (جذر الـ repo) |
| Build path | `/` |
| HTTP port | **3000** |
| Domains | `www.velorabeauty.world` + `velorabeauty.world` → نفس الخدمة |

**مهم:** أي PR (مثلاً upsell) ما كيوصلش للموقع حتى **يتدمج فـ `main`** و **Deploy ينجح**.

---

## 1) `Git key not found` (أكثر خطأ)

هاد المشكل **فـ Easypanel / GitHub**، ماشي فـ الكود.

1. **Easypanel** → مشروع Velora → **Settings** → **Source** / Git.
2. **Disconnect** GitHub ثم **Connect** من جديد — اختار org/user **`BAYLA09`** و repo **`velorabeauty.frontend`**.
3. فـ **GitHub** → **Settings** → **Applications** → **Easypanel** (أو GitHub App) → **Configure** → تأكد أن الـ repo **مسموح** (Repository access).
4. إلا كتستعمل **Deploy key**: GitHub → repo → **Settings** → **Deploy keys** — زيد المفتاح اللي Easypanel كيعطيك (read-only كافي).
5. **Force Rebuild** (Deploy عادي أحياناً ما كيسحبش commit جديد).

بديل مؤقت: **Deploy Webhook** (POST) من Easypanel بعد ما تصلح Git — الرابط فـ *Deploy Webhook* (ما تشاركوش علناً).

---

## 2) Build كيفشل (logs)

**Deployments → آخر deploy → View logs**

| Log | الحل |
|-----|------|
| `JavaScript heap out of memory` | Dockerfile فيه `NODE_OPTIONS=4096` — زيد **RAM** للـ Docker builder (Easypanel *Settings → Server → Docker Builders*، ≥ 4 GB) ثم **Force Rebuild** |
| `npm ci` / lockfile | تأكد branch **`main`** وآخر commit؛ locally: `npm ci && npm run build` |
| `COPY ... standalone` | Build method = **Dockerfile** (ماشي custom build command بلا standalone) |
| Timeout | صور `public/images` كبيرة (~50MB) — عادي؛ زيد timeout builder إن أمكن |
| `unknown flag: mount` / BuildKit | Dockerfile **ما فيهش** `--mount=type=cache` — إلا كنت على commit قديم، pull **`main`** و Force Rebuild |
| `failed to solve` / `executor failed` | GitHub → **Actions** → job **docker** — نفس build اللي Easypanel خاصو يدير |

---

## 3) Deploy «نجح» ولكن الموقع قديم

1. Branch = **`main`** (ماشي PR branch).
2. **Cloudflare / CDN** — Purge cache أو hard refresh.
3. GitHub → **Actions** → workflow **Build** — إلا أحمر، الـ commit فـ `main` فيه مشكل build.

---

## 4) الخدمة ما كتbootش (502 / unhealthy)

1. Port **3000** فـ Easypanel (ماشي 80 داخل الـ container).
2. Logs الـ **runtime** (ماشي build فقط): `Error: Cannot find module` → خدمة مبنية بـ Nixpacks بدل Dockerfile.
3. **Force Rebuild** كامل.

---

## تحقق من بعد النشر

```bash
curl -s https://www.velorabeauty.world/api/health
# {"ok":true,"service":"velorabeauty-frontend"}

curl -sI https://www.velorabeauty.world/images/brand/logo.svg | head -1
# HTTP/2 200
```

## Apex 404

`velorabeauty.world` (بدون www) خاصو domain منفصل فـ Easypanel أو redirect Cloudflare → www.

## Local (نفس اللي Easypanel كيدير)

```bash
docker build -t velorabeauty-frontend .
docker run --rm -p 3000:3000 velorabeauty-frontend
curl -s http://127.0.0.1:3000/api/health
```
