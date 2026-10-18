# Easypanel — Deploy ma kaydozch (Darija)

> **Bda hna:** [DEPLOY-FRONTEND-DARIJA.md](./DEPLOY-FRONTEND-DARIJA.md) — checklist msawer.

## ⚠️ Daba f GitHub

**`EASYPANEL_DEPLOY_WEBHOOK` ma kaynch** → image katbni f Actions walakin Easypanel **ma kaydeployich bo7do**. Khass **Deploy yddawi** f panel, wla tzid webhook (t7t).

## 3lach kayw9e3

| Symptom | Sabab |
|---------|--------|
| Deploy **1–2 seconds** | Source = **Git** (ma kaypullich image) |
| Build **failed** / OOM | Easypanel kaybni **Dockerfile** kamel 3la VPS |
| **Unauthorized** pull | GHCR — jarrb username `BAYLA09` + token `read:packages` |

---

## ✅ Hal li kaykhdem (khtiar 1 — a7sen)

1. Easypanel → service dyal Velora
2. **Source → Docker Image** (mashi GitHub)
3. Image:

   ```text
   ghcr.io/bayla09/velorabeauty.frontend:latest
   ```

4. Registry user/password → **khalli fadi**
5. Port **3000** · Volume **`/app/data`**
6. Environment → `deploy/easypanel.env.example`
7. **Deploy** → stenna **1–3 d9ayeq** (khass `Pulling` f logs)

---

## ✅ Hal 2 — ila bqiti 3la GitHub Source

1. Source = GitHub → repo `velorabeauty.frontend`
2. **Dockerfile path:** `Dockerfile.easypanel` (**mashi** `Dockerfile`)
3. Deploy → ghadi ypulli image jahza men GHCR (ma kaybuildich npm)

---

## ✅ Hal 3 — Compose

Path:

```text
deploy/easypanel-docker-image.compose.yaml
```

(wla `docker-compose.yml` f jdar repo)

---

## Ba3d kol merge 3la GitHub

1. Actions → **Publish container** ✅ (~2 min)
2. Easypanel → **Deploy** (ydawi — ma kaynch auto ila ma zdtich webhook)
3. Test:

   ```bash
   curl -s https://www.velorabeauty.world/api/health
   ```

   `version` = 7 chars men commit jdid.

---

## Auto-deploy (ikhtiyari)

1. Easypanel → Deployments → **Webhook** → copy URL
2. GitHub repo → Settings → Secrets → **`EASYPANEL_DEPLOY_WEBHOOK`** = URL

---

## Mazal ma kheddamch?

3tina screenshot men:

- **Source** tab (Git wla Docker Image?)
- **Deploy logs** (l-kher 20 line)
- Message d’erreur exact
