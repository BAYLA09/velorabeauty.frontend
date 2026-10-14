# Easypanel — deploy frontend (2026-10-13)

**Deploy ma kheddamch?** → [EASYPANEL-FRONTEND-FIX-AR.md](./EASYPANEL-FRONTEND-FIX-AR.md)

## Image جاهزة على GitHub (بعد merge `main`)

```text
ghcr.io/bayla09/velorabeauty.frontend:latest
ghcr.io/bayla09/velorabeauty.frontend:89709ec
```

GitHub → **Actions** → **Publish container** → ✅ (2–3 دقائق). من بعد **Easypanel ما كيسحبش وحدو** — خاصك **Deploy** يدوي.

---

## إعداد الخدمة (مرة واحدة)

1. Easypanel → **New Service** → **App**
2. **Source = Docker Image** (ماشي GitHub / Git / Dockerfile)
3. **Image:** `ghcr.io/bayla09/velorabeauty.frontend:latest`
4. Registry user/password → **فارغين** (GHCR public)
5. **Domains** → port **3000**
6. **Mount** → container path **`/app/data`** (persistent)
7. **Environment** → انسخ من `deploy/easypanel.env.example` وعبّي Stripe + `STORE_API_KEY`
8. **Deploy** → استنى **1–3 دقائق** (logs فيها pull layers)

### Deploy كيخلص ف 1 ثانية؟

Source = **Git** (غلط). احذف الخدمة أو بدّل Source ل **Docker Image**.

---

## بعد كل تحديث على GitHub

1. Merge PR على `main`
2. Actions → **Publish container** ✅
3. Easypanel → **Deploy** (Compose: `pull_policy: always` ف `docker-compose.yml`)

---

## تحقق

```bash
curl -s https://www.velorabeauty.world/api/health
```

- `version` يبدأ بـ **`89709ec`** (أو أحدث SHA على main)
- `payments.cardCheckoutEnabled` = **true**
- `deploy.pinImageTag` = نفس الـ SHA اللي خاصك تـ pin إلا `latest` ما تحدّث

```bash
./scripts/check-live-version.sh 89709ec
```
