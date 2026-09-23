# Easypanel — deploy بـ 5 دقائق (Velora)

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
6. **Deploy** → استنى حتى **Running** / logs فيها `Ready`.
7. جرب: `https://www.velorabeauty.world/api/health`

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

**Resources → Memory limit:** ≥ **4096 MB** أثناء البuild (OOM شائع).

إلا Dockerfile فشل → **Build → Nixpacks** (فيه `nixpacks.toml` فـ repo).

---

## 🔔 Deploy تلقائي (اختياري)

1. Easypanel → خدمة الـ App → **Deployments** → **Deployment Trigger URL** (انسخ الرابط).
2. GitHub → repo → **Settings** → **Secrets** → **Actions** → New secret:
   - Name: `EASYPANEL_DEPLOY_WEBHOOK`
   - Value: الرابط كامل (فيه token).
3. من بعد، كل ما **Publish container** يكمل، Easypanel كيتـ deploy وحدو.

---

## أخطاء شائعة

| اللي كتشوف | الحل |
|------------|------|
| `Git key not found` | استعمل **Docker Image** (طريقة 1) — ماشي Git |
| `unauthorized` / pull image | Image: بالضبط `ghcr.io/bayla09/velorabeauty.frontend:latest` — auth فارغ |
| 502 / unhealthy | Port **3000** · logs runtime (ماشي build فقط) |
| الموقع قديم | Deploy بعد ما **Publish container** ✅ على `main` |
| Build OOM | Docker Image (طريقة 1) أو Nixpacks + RAM 4GB |

---

## تحقق

```bash
curl -s https://www.velorabeauty.world/api/health
```

تفاصيل إضافية: [EASYPANEL-DEPLOY.md](./EASYPANEL-DEPLOY.md)
