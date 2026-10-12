# Easypanel — باقي ما كيدپloyش؟ (2026-10-12)

## ✅ GitHub جاهز دابا (2026-10-12)

- **Publish container** كيتشغّل **غير من push على `main`** (merge PR → image جديدة على GHCR).
- **ما كاينش image** ل commit/branch إلا **merged** — مثلاً `:902bc8a` **ما غاديش يخدم** حتى PR #128 يmerge.
- Image (بعد آخر merge على main):

```text
ghcr.io/bayla09/velorabeauty.frontend:latest
ghcr.io/bayla09/velorabeauty.frontend:364bcf5
```

الموقع الحي دابا (تحقق): `curl -s https://www.velorabeauty.world/api/health` → `version` فيها **`364bcf5`** = deploy خدام؛ ila bghiti fix Stripe 6s → merge **#128** ثم Deploy `:latest` أو SHA جديد.

الموقع الحي **ما كيتبدّلش** من GitHub وحدو — **Deploy يدوي ف Easypanel** (1–3 دقائق). Secret `EASYPANEL_DEPLOY_WEBHOOK` **ماشي مفعّل** → ما كاينش auto-deploy.

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

خاص `version` يطابق **آخر SHA merged** على main (دابا مثلاً **`364bcf5`**).

إلا بقى SHA قديم → Easypanel **ما سحبش** image:
- Image: `ghcr.io/bayla09/velorabeauty.frontend:latest` + **pull_policy always** (compose)
- **Redeploy** / **Recreate container**
- تأكد Source ماشي Git

---

## 5) « Deploy ما خدام » — 3 أسباب شائعة

1. **PR ma mergedch** → **ما كاينش tag** f GHCR. Merge PR f GitHub, استنى **Publish container ✅**, من بعد Deploy f Easypanel.
2. **Deploy 1 ثانية** → Source = Git (غلط). بدّل ل **Docker Image** + image `ghcr.io/bayla09/velorabeauty.frontend:latest`.
3. **Deploy ناجح ولكن نفس المحتوى** → `curl …/api/health` — ila `version` qdima: **Recreate container** w تأكد **pull layers** f logs (1–3 min).
4. **Tag `:902bc8a` pull denied / not found** → normal — merge **#128** (Stripe vanilla) أولاً.
4. **GitHub ✅ ولكن site ma tbdlch** → ma kaynch `EASYPANEL_DEPLOY_WEBHOOK` — **كل merge** khass **Deploy** يدوي (1–3 min, logs fiha pull layers).
