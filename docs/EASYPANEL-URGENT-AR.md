# Easypanel — deploy frontend (مختصر)

**دليل خطوة بخطوة:** [EASYPANEL-DEPLOY-NOW-AR.md](./EASYPANEL-DEPLOY-NOW-AR.md)

## Image دابا (Publish container ✅)

```text
ghcr.io/bayla09/velorabeauty.frontend:latest
ghcr.io/bayla09/velorabeauty.frontend:89709ec
```

الموقع الحي: `curl -s https://www.velorabeauty.world/api/health` → `version` فيها **`89709ec`** بعد Deploy.

---

## Easypanel — 4 قواعد

| ✅ | ❌ |
|----|-----|
| Source **Docker Image** | GitHub / Git build |
| Deploy **1–3 دقائق** | Deploy **1 ثانية** |
| Port **3000** + volume **`/app/data`** | بلا volume |
| Env من `deploy/easypanel.env.example` | مفاتيح ف Git |

---

## Environment (Easypanel UI)

Stripe: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `CARD_PAYMENT_ENABLED=true`  
Backend sync: `BACKEND_API_BASE_URL`, `STORE_API_KEY`

---

## مشاكل شائعة

1. **PR ma mergedch** → ما كاينش tag f GHCR → merge ثم Publish ✅ ثم Deploy.
2. **Deploy 1s** → Source Git → بدّل Docker Image.
3. **version قديم** → `pull_policy: always` + Redeploy / Recreate container.
4. **GitHub ✅ site قديم** → Deploy يدوي (ما كاينش auto webhook).

Compose: `docker-compose.yml` · Env template: `deploy/easypanel.env.example`
