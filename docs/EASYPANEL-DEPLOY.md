# Easypanel — Velora Frontend (deploy ma kaymchich)

## الإعداد الصحيح (App service)

| Field | Value |
|--------|--------|
| Source | GitHub → `BAYLA09/velorabeauty.frontend` |
| Branch | **`main`** |
| Build | **Dockerfile** (ماشي Nixpacks / Railpack) |
| Dockerfile path | `Dockerfile` (جذر الم repo) |
| Build path | `/` |
| HTTP port | **3000** |
| Domains | `www.velorabeauty.world` + `velorabeauty.world` → نفس الخدمة |

## خطأ: `Git key not found`

Easypanel ma lqach **SSH deploy key** wla **GitHub App** bach ypulli l-repo.

1. **Easypanel → Settings → Git** (ou **Integrations → GitHub**): connecti / **Reconnect** compte GitHub.
2. F **service** dyalek → **Source**: khtar **`BAYLA09/velorabeauty.frontend`**, branch **`main`**, w **Save**.
3. Ila katstakhdem **Deploy key** (SSH URL `git@github.com:...`):
   - Easypanel → **Git Keys** / **SSH Keys** → **Generate** wla paste key
   - **GitHub** → repo → **Settings → Deploy keys → Add** → paste **public key** dyal Easypanel (read-only OK)
4. Ila l-source hiya **HTTPS** b token: regenerate **Personal Access Token** (scope `repo`) f GitHub w update f Easypanel.
5. **Force Rebuild** men ba3d ma t-fixi l-git.

**Alternative (bla git pull f deploy):** *Deploy Webhook* — GitHub Actions wla manual `POST` 3la webhook URL; build kaytlaunch mn image/cache — mais source khassa baqi mconnecté bach l-build yjib code.

## إلا Deploy من الواجهة كيتعطل

1. **Deployments → آخر deploy → View logs**  
   - `JavaScript heap out of memory` → زيد **RAM** للـ Docker builder: *Settings → Server → Docker Builders* (≥ 2–4 GB) أو **Force Rebuild**.
2. **GitHub** → Easypanel: *Reconnect* إلا ما كاينش pull جديد.
3. **Force Rebuild** (ماشي Deploy عادي) بعد ما تبدّل Dockerfile.
4. **Deploy Hook** (إلا الزر كيتعلّق):  
   `POST` على الرابط اللي عندك فـ Easypanel → *Deploy Webhook* (ما تشاركوش فـ GitHub).

## تحقق من بعد النشر

- https://www.velorabeauty.world/api/health → `{"ok":true,...}`
- https://www.velorabeauty.world/images/brand/logo-mark.png → 200

## Apex 404

`velorabeauty.world` (بدون www) خاصو domain منفصل فـ Easypanel أو redirect Cloudflare → www.
