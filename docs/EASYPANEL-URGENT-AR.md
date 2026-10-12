# Easypanel — باقي ما كيدپloyش؟ (2026-10-12)

## ✅ GitHub جاهز دابا

- **Publish container** على `main` → **✅ ناجح**
- Image جديدة:

```text
ghcr.io/bayla09/velorabeauty.frontend:latest
ghcr.io/bayla09/velorabeauty.frontend:74e4538
```

الموقع الحي مازال على commit قديم حتى **تدير Deploy ف Easypanel** (هاد normal).

---

## 1) شنو خاصك تشوف ف Easypanel

| ✅ صح | ❌ غلط |
|------|--------|
| Source = **Docker Image** | Source = GitHub / Git / Dockerfile |
| Deploy كياخذ **1–3 دقائق** | Deploy **1 ثانية** |
| Port **3000** | Port 80 داخل container بلا mapping |
| Volume **`/app/data`** | بلا volume (طلبات SQLite تتمحى) |

---

## 2) إعداد Docker Image (الطريقة اللي خاصها تخدم)

1. **New Service** → **App**
2. **Source** → **Docker Image**
3. **Image** (كامل):

   ```text
   ghcr.io/bayla09/velorabeauty.frontend:latest
   ```

4. **Registry username / password** → **فارغين** (package public)

   إلا طلع `unauthorized` أو `pull access denied`:
   - Username: `BAYLA09`
   - Password: **GitHub Personal Access Token** (scope: `read:packages` فقط)

5. **Domains** → HTTP → **Port 3000**
6. **Mounts** → path في container: **`/app/data`** (persistent)
7. **Environment** (Stripe إلا خدام):
   - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `CARD_PAYMENT_ENABLED=true`
8. **Deploy** → استنى pull (logs فيها download layers)

---

## 3) Compose (إلا كتستعمل Git repo)

- **Compose file path:** `docker-compose.yml` (الافتراضي ف Easypanel)
- أو `compose.yaml` / `deploy/easypanel-docker-image.compose.yaml`
- **Build: OFF** — غير pull من `image:` + `pull_policy: always`
- Domain → service **`velora-web`** → port **3000**

## 3b) Deploy كيخلص ف 1 ثانية؟

- **GitHub Secret** `EASYPANEL_DEPLOY_WEBHOOK` كيضرب خدمة **Git** معطلة → **حذفو** أو بدّل webhook من خدمة **Docker Image** فقط.
- Source خاصو يكون **Docker Image** ماشي GitHub Dockerfile.

---

## 4) تحقق من بعد Deploy

```bash
curl -s https://www.velorabeauty.world/api/health
```

خاص `version` يبدا بـ **`74e4538`** (أو أحدث commit على main).

إلا بقى `518a181` → Easypanel **ما سحبش** image:
- بدّل Image إلى `:74e4538` بالضبط
- **Redeploy** / **Recreate container**
- تأكد Source ماشي Git

---

## 5) إلا بغيتي Cart drawer / frontend جديد

هاد التحديث ف branch **`cursor/cart-drawer-upsell-7460`** — **مازال ما mergedش** لـ `main`.  
Deploy الحالي **ما غاديش** يبان فيه حتى merge + Publish container ✅ + Deploy Easypanel.
