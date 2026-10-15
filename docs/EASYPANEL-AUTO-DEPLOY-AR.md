# Deploy frontend بلا ما تضغط Easypanel (auto)

إلا **Deploy f Easypanel ma kheddamch** (1 ثانية · زر معطل · Source Git)، دير **واحد** من هاد الحلول.

---

## الحل A — Webhook (الأسهل)

### 1) Easypanel — خدمة **Docker Image** (ماشي Git)

- Image: `ghcr.io/bayla09/velorabeauty.frontend:latest`
- Port **3000** · Volume **`/app/data`**
- Environment: نفس اللي عندك (Stripe, Sheets, …)

### 2) Webhook

Easypanel → **الخدمة** → **Deployments** → **Webhook** → Copy URL

### 3) GitHub

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Name | Value |
|------|--------|
| `EASYPANEL_DEPLOY_WEBHOOK` | URL من الخطوة 2 |

### 4) شنو كيوقع

- كل push على `main` → **Publish container** ✅ → **Deploy Frontend (Easypanel)** كيضرب webhook + كيتأكد من `/api/health`
- يدوي: **Actions** → **Deploy Frontend (Easypanel)** → **Run workflow**

**مهم:** احذف webhook قديم إla كان مربوط بخدمة **Git** (Deploy 1s).

---

## الحل B — SSH من GitHub (بلا Easypanel UI)

GitHub → Secrets:

| Secret | مثال |
|--------|--------|
| `VPS_HOST` | IP السيرفر |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | private key PEM |
| `VPS_CONTAINER` | اسم container (اختياري، default `velora-frontend`) |

من بعد **Publish container** → workflow **Deploy VPS (SSH)** كيسحب image ويعاود container **بنفس env** اللي كان.

---

## الحل C — يدوي f VPS (SSH)

```bash
docker pull ghcr.io/bayla09/velorabeauty.frontend:latest
# إla container موجود: docker inspect velora-frontend --format '{{range .Config.Env}}{{println .}}{{end}}' > /tmp/v.env
docker rm -f velora-frontend
docker run -d --name velora-frontend --restart unless-stopped \
  -p 127.0.0.1:3000:3000 -v velora-orders:/app/data \
  --env-file /tmp/v.env \
  ghcr.io/bayla09/velorabeauty.frontend:latest
curl -s http://127.0.0.1:3000/api/health
```

---

## Deploy 1 ثانية = Source غلط

→ [EASYPANEL-DEPLOY-1-SECONDE-AR.md](./EASYPANEL-DEPLOY-1-SECONDE-AR.md)

---

## تحقق

```bash
curl -s https://www.velorabeauty.world/api/health
```

`version` = أحدث commit على `main` (7 أحرف أولى).
