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
