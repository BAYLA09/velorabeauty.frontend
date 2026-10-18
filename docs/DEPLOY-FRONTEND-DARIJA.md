# Deploy frontend — khoya hadchi li khassk (Darija)

## 3lach «Deploy ma kheddamch»?

| Chno kayban | Chno kayn f l-waqi3 |
|-------------|---------------------|
| Deploy **1–2 seconds** | Easypanel **ma kaypullich** image GHCR (Source = Git / webhook l9dim) |
| Merge f GitHub ✅ walakin site qdım | **Ma kaynch** `EASYPANEL_DEPLOY_WEBHOOK` f GitHub → **Deploy yddawi b ydek** |
| Build failed / OOM | Easypanel kaybni `Dockerfile` 3la VPS — **ghlt** |

**Publish container** f GitHub kaykhdem ✅ — l-mochkil f **Easypanel ma kaypullich** `:latest`.

---

## Hal sarih (5 d9ayeq)

### 1) Easypanel — service Velora frontend

| Field | Value |
|-------|--------|
| **Source** | **Docker Image** (mashi GitHub) |
| **Image** | `ghcr.io/bayla09/velorabeauty.frontend:latest` |
| User / Password registry | **khalli khawi** |
| **Port** | `3000` |
| **Volume** | `/app/data` (persistent) |
| Domain | `www.velorabeauty.world` |

**Deploy** → stenna **1–3 d9ayeq**. F logs khass:

`Pulling` · `Pull complete` · `Started`

Ila **1 second** b7al → **Source mashi Docker Image** → 9ra `docs/EASYPANEL-DEPLOY-1-SECONDE-AR.md`.

### 2) Ba3d kol merge 3la `main`

1. GitHub → **Actions** → **Publish container** = ✅ (~2 min)
2. Easypanel → **Deploy** (ydawi — daba **auto ma kaynch**)
3. Test:

```bash
curl -s https://www.velorabeauty.world/api/health | jq '{version: .version[0:7], msg: .deploy.statusMessageDarija}'
```

`version` = 7 chars men commit jdid 3la `main`.

### 3) Auto-deploy (ikhtiyari — bach ma tb9ach tdir Deploy b ydek)

1. Easypanel → service **Docker Image** (nfss li fawq) → **Deployments** → **Webhook** → copy URL
2. GitHub → repo **velorabeauty.frontend** → **Settings** → **Secrets** → **Actions**
3. New secret: **`EASYPANEL_DEPLOY_WEBHOOK`** = URL li nsexti
4. **Important:** webhook khass ykon dial service **Docker Image** — mashi service Git li Deploy 1s

Men ba3d: kol **Publish container** ghadi ytrigger Easypanel.

---

## Ila `latest` ma tbdlch

Pin tag men GitHub Actions summary:

```text
ghcr.io/bayla09/velorabeauty.frontend:6cea8a5
```

(bdl `6cea8a5` b SHA jdid)

---

## Mazal?

Screenshot: **Source tab** + **Deploy logs** (20 line l-okhrin) — w 3tina `curl /api/health`.

Guides: `EASYPANEL-FRONTEND-FIX-AR.md` · `EASYPANEL-DEPLOY-1-SECONDE-AR.md`
