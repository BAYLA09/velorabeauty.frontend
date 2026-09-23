# Deploy ma kaymchich? — 5 دقائق

الموقع **ما كيتبدّلش** حتى:

1. GitHub Actions → **Publish container** ✅ على `main`
2. Easypanel → **Deploy** (و خدمة **Docker Image** ماشي Git)

---

## 1) احذف الخدمة القديمة إلا كانت Git

إلا شفتي **`Git key not found`** أو build كيطيح → الخدمة خاسرة.

- Easypanel → الخدمة → **Destroy**
- **New Service** → **App** → من جديد

---

## 2) Source = Docker Image (بالضبط)

| الحقل | القيمة |
|--------|--------|
| Source | **Docker Image** |
| Image | `ghcr.io/bayla09/velorabeauty.frontend:latest` |
| Username / Password | **فارغ** |
| Port | **3000** |

**Deploy** → استنى **Running**.

---

## 3) تأكد أنكِ على آخر نسخة

```bash
curl -s https://www.velorabeauty.world/api/health
```

- `"ok": true` → التطبيق شغال
- `"version"` → لازم يطابق آخر commit على `main` (GitHub → Commits → SHA)

إلا `version` قديم:

1. GitHub → Actions → **Publish container** → ✅
2. Easypanel → **Deploy** (مرة أخرى)
3. إلا بقى قديم: **Recreate** / **Force pull** إلا عندك الزر

---

## 4) Deploy أوتوماتيك (اختياري)

1. Easypanel → App → **Deployment Trigger URL** (webhook)
2. GitHub → repo → Settings → Secrets → Actions → `EASYPANEL_DEPLOY_WEBHOOK` = الرابط

من بعد، كل push على `main` كيـ deploy وحدو.

---

تفاصيل: [EASYPANEL-SETUP-AR.md](./EASYPANEL-SETUP-AR.md)
